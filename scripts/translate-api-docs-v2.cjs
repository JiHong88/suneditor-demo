/**
 * Translates api-docs.en.json → api-docs.{locale}.json (incremental, hash-based)
 * Uses Google Cloud Translation API (official) instead of google-translate-api-x.
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON.
 *
 * Usage:
 *   npm run docs:translate2              # translate all site locales (incremental)
 *   npm run docs:translate2 -- ko        # translate specific locale only
 *   npm run docs:translate2 -- --force   # force re-translate everything
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { TranslationServiceClient } = require("@google-cloud/translate").v3;

const translationClient = new TranslationServiceClient();

// ── Read site locales from languages.ts ───────────────────
function getSiteLocales() {
	const langFile = path.join(__dirname, "..", "src", "i18n", "languages.ts");
	const src = fs.readFileSync(langFile, "utf-8");

	const locales = [];
	const re = /code:\s*"([^"]+)"[^}]*siteLocale:\s*true/g;
	let m;
	while ((m = re.exec(src)) !== null) {
		if (m[1] !== "en") locales.push(m[1]);
	}
	return locales;
}

// Google Cloud Translate language code mapping
const LANG_MAP = { "zh-CN": "zh-CN", "pt-BR": "pt", ckb: "ku" };

const API_DIR = path.join(__dirname, "..", "src", "data", "api");
const SRC = path.join(API_DIR, "api-docs.en.json");
const HASH_FILE = path.join(API_DIR, ".api-docs-hashes.json");
const BATCH_SIZE = 50;

// ── Hashing ───────────────────────────────────────────────
function hash(text) {
	return crypto.createHash("md5").update(text).digest("hex").slice(0, 12);
}

function loadHashes() {
	try {
		return JSON.parse(fs.readFileSync(HASH_FILE, "utf-8"));
	} catch {
		return {};
	}
}

function saveHashes(hashes) {
	const sorted = {};
	for (const locale of Object.keys(hashes).sort()) {
		const inner = {};
		for (const key of Object.keys(hashes[locale]).sort()) {
			inner[key] = hashes[locale][key];
		}
		sorted[locale] = inner;
	}
	fs.writeFileSync(HASH_FILE, JSON.stringify(sorted, null, "\t") + "\n", "utf-8");
}

// ── Backtick protection ───────────────────────────────────
function protectBackticks(text) {
	const tokens = [];
	const p = text.replace(/`[^`]+`/g, (match) => {
		tokens.push(match);
		return `__BT${tokens.length - 1}__`;
	});
	return { protected: p, tokens };
}

function restoreBackticks(text, tokens) {
	return text.replace(/__BT(\d+)__/g, (_, idx) => tokens[Number(idx)] || _);
}

// ── Collect translatable strings with array-based paths ───
function collectStrings(obj, result, segments) {
	if (!obj || typeof obj !== "object") return;

	if (Array.isArray(obj)) {
		obj.forEach((item, i) => collectStrings(item, result, [...segments, i]));
		return;
	}

	if (typeof obj.description === "string" && obj.description.trim()) {
		result.push({ segments: [...segments, "description"], text: obj.description });
	}

	if (obj.paramDescriptions && typeof obj.paramDescriptions === "object") {
		for (const [key, val] of Object.entries(obj.paramDescriptions)) {
			if (typeof val === "string" && val.trim()) {
				result.push({ segments: [...segments, "paramDescriptions", key], text: val });
			}
		}
	}

	if (typeof obj.returnsDescription === "string" && obj.returnsDescription.trim()) {
		result.push({ segments: [...segments, "returnsDescription"], text: obj.returnsDescription });
	}

	for (const [key, val] of Object.entries(obj)) {
		if (key === "description" || key === "paramDescriptions" || key === "returnsDescription") continue;
		collectStrings(val, result, [...segments, key]);
	}
}

// ── Get value by path segments ────────────────────────────
function getBySegments(obj, segments) {
	let current = obj;
	for (const seg of segments) {
		if (current == null || typeof current !== "object") return undefined;
		current = current[seg];
	}
	return current;
}

// ── Set value by path segments ────────────────────────────
function setBySegments(obj, segments, value) {
	let current = obj;
	for (let i = 0; i < segments.length - 1; i++) {
		if (current == null || typeof current !== "object") {
			console.warn(`  [warn] Path broken at segment ${i}: ${segments.slice(0, i + 1).join(".")}`);
			return false;
		}
		current = current[segments[i]];
	}
	if (current == null || typeof current !== "object") {
		console.warn(`  [warn] Cannot set at: ${segments.join(".")}`);
		return false;
	}
	current[segments[segments.length - 1]] = value;
	return true;
}

// ── Google Cloud Translation batch ────────────────────────
async function translateBatch(texts, from, to) {
	const projectId = await translationClient.getProjectId();
	const request = {
		parent: `projects/${projectId}/locations/global`,
		contents: texts,
		mimeType: "text/plain",
		sourceLanguageCode: from,
		targetLanguageCode: to,
	};

	const [response] = await translationClient.translateText(request);
	return response.translations.map((t) => t.translatedText || null);
}

// ── Segment key for hash map ──────────────────────────────
function segKey(segments) {
	return segments.join(".");
}

// ── Translate a single locale (incremental) ───────────────
async function translateLocale(locale, data, strings, localeHashes, force) {
	const targetLang = LANG_MAP[locale] || locale;
	const OUT = path.join(API_DIR, `api-docs.${locale}.json`);

	let existingData = null;
	try {
		existingData = JSON.parse(fs.readFileSync(OUT, "utf-8"));
	} catch {
		// No existing file
	}

	const prevHashes = localeHashes[locale] || {};
	const newHashes = {};

	const toTranslate = [];
	const results = new Array(strings.length);

	for (let i = 0; i < strings.length; i++) {
		const s = strings[i];
		const key = segKey(s.segments);
		const h = hash(s.text);
		newHashes[key] = h;

		if (!force && prevHashes[key] === h && existingData) {
			const existing = getBySegments(existingData, s.segments);
			if (typeof existing === "string" && existing.trim()) {
				results[i] = existing;
				continue;
			}
		}
		const { protected: p, tokens } = protectBackticks(s.text);
		toTranslate.push({ index: i, protectedText: p, tokens });
	}

	console.log(`\n[${"=".repeat(50)}]`);
	console.log(`[v2/cloud] Translating → "${locale}" (${targetLang})`);
	console.log(
		`  Total: ${strings.length}, Changed: ${toTranslate.length}, Cached: ${strings.length - toTranslate.length}`,
	);

	if (toTranslate.length === 0) {
		console.log("  Nothing to translate — all up to date.");
		localeHashes[locale] = newHashes;

		const output = JSON.parse(JSON.stringify(data));
		for (let i = 0; i < strings.length; i++) {
			setBySegments(output, strings[i].segments, results[i]);
		}
		fs.writeFileSync(OUT, JSON.stringify(output, null, "\t") + "\n", "utf-8");
		return;
	}

	// Translate in batches
	const totalBatches = Math.ceil(toTranslate.length / BATCH_SIZE);
	let failCount = 0;

	for (let i = 0; i < toTranslate.length; i += BATCH_SIZE) {
		const batch = toTranslate.slice(i, i + BATCH_SIZE);
		const batchNum = Math.floor(i / BATCH_SIZE) + 1;

		process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length})...`);

		try {
			const texts = batch.map((b) => b.protectedText);
			const batchResults = await translateBatch(texts, "en", targetLang);

			for (let j = 0; j < batch.length; j++) {
				const item = batch[j];
				if (batchResults[j]) {
					results[item.index] = restoreBackticks(batchResults[j], item.tokens);
				} else {
					results[item.index] = strings[item.index].text;
					failCount++;
				}
			}
			console.log(" done");
		} catch (err) {
			console.log(` ERROR (fallback to en): ${err.message.slice(0, 80)}`);
			for (let j = 0; j < batch.length; j++) {
				results[batch[j].index] = strings[batch[j].index].text;
				failCount++;
			}
		}
	}

	// Apply translations to cloned data
	const output = JSON.parse(JSON.stringify(data));
	let setFails = 0;
	for (let i = 0; i < strings.length; i++) {
		if (!setBySegments(output, strings[i].segments, results[i])) {
			setFails++;
		}
	}

	fs.writeFileSync(OUT, JSON.stringify(output, null, "\t") + "\n", "utf-8");
	localeHashes[locale] = newHashes;

	const translatedCount = toTranslate.length - failCount;
	console.log(`  Done! ${translatedCount} translated, ${failCount} fallbacks, ${setFails} path errors.`);
	console.log(`  Output: ${OUT}`);
}

// ── Main ──────────────────────────────────────────────────
async function main() {
	const args = process.argv.slice(2);
	const force = args.includes("--force");
	const argLocale = args.find((a) => !a.startsWith("--"));
	const locales = argLocale ? [argLocale] : getSiteLocales();

	if (locales.length === 0) {
		console.log("No site locales found (excluding en). Nothing to translate.");
		return;
	}

	console.log(`[v2/cloud] Target locales: ${locales.join(", ")}${force ? " (force)" : ""}`);

	const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));
	const strings = [];
	collectStrings(data.structure, strings, ["structure"]);
	console.log(`Found ${strings.length} translatable strings.`);

	const hashes = loadHashes();

	for (const locale of locales) {
		await translateLocale(locale, data, strings, hashes, force);
	}

	saveHashes(hashes);

	console.log(`\nAll done! Processed ${locales.length} locale(s).`);
	console.log(`Hashes: ${HASH_FILE}`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
