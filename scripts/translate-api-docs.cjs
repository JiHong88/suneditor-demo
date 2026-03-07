/**
 * Translates api-docs.en.json → api-docs.{locale}.json (incremental, hash-based)
 * Reads site locales from src/i18n/languages.ts (siteLocale: true, excluding "en").
 *
 * - Computes a hash for each English source string
 * - Only translates items whose hash changed (or are new)
 * - Preserves existing translations for unchanged items
 * - Stores hashes in .api-docs-hashes.json
 *
 * Usage:
 *   npm run docs:translate              # translate all site locales (incremental)
 *   npm run docs:translate -- ko        # translate specific locale only
 *   npm run docs:translate -- --force   # force re-translate everything
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { translate } = require("google-translate-api-x");

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

// Google Translate language code mapping
// Only codes that differ from the locale code
const LANG_MAP = { zh_cn: "zh-CN", pt_br: "pt" };

const API_DIR = path.join(__dirname, "..", "src", "data", "api");
const SRC = path.join(API_DIR, "api-docs.en.json");
const HASH_FILE = path.join(API_DIR, ".api-docs-hashes.json");
const BATCH_SIZE = 20;
const DELAY_MS = 800;

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
	// Sort keys for stable output
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

// ── Batch translate ───────────────────────────────────────
async function translateBatch(texts, lang) {
	const results = await translate(texts, { to: lang, rejectOnPartialFail: false });
	if (Array.isArray(results)) {
		return results.map((r) => (r && r.text) || null);
	}
	return [results && results.text];
}

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

// ── Segment key for hash map ──────────────────────────────
function segKey(segments) {
	return segments.join(".");
}

// ── Translate a single locale (incremental) ───────────────
async function translateLocale(locale, data, strings, localeHashes, force) {
	const targetLang = LANG_MAP[locale] || locale;
	const OUT = path.join(API_DIR, `api-docs.${locale}.json`);

	// Load existing translated file (if any) to preserve unchanged translations
	let existingData = null;
	try {
		existingData = JSON.parse(fs.readFileSync(OUT, "utf-8"));
	} catch {
		// No existing file — translate everything
	}

	const prevHashes = localeHashes[locale] || {};
	const newHashes = {};

	// Determine which items need translation
	const toTranslate = []; // { index, item }
	const results = new Array(strings.length); // final translated text per item

	for (let i = 0; i < strings.length; i++) {
		const s = strings[i];
		const key = segKey(s.segments);
		const h = hash(s.text);
		newHashes[key] = h;

		if (!force && prevHashes[key] === h && existingData) {
			// Hash matches — reuse existing translation
			const existing = getBySegments(existingData, s.segments);
			if (typeof existing === "string" && existing.trim()) {
				results[i] = existing;
				continue;
			}
		}
		// Needs translation
		const { protected: p, tokens } = protectBackticks(s.text);
		toTranslate.push({ index: i, protectedText: p, tokens });
	}

	console.log(`\n[${"=".repeat(50)}]`);
	console.log(`Translating → "${locale}" (${targetLang})`);
	console.log(
		`  Total: ${strings.length}, Changed: ${toTranslate.length}, Cached: ${strings.length - toTranslate.length}`,
	);

	if (toTranslate.length === 0) {
		console.log("  Nothing to translate — all up to date.");
		localeHashes[locale] = newHashes;

		// Still rewrite file to sync structure changes (new/removed items)
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
			const batchResults = await translateBatch(texts, targetLang);

			for (let j = 0; j < batch.length; j++) {
				const item = batch[j];
				if (batchResults[j]) {
					results[item.index] = restoreBackticks(batchResults[j], item.tokens);
				} else {
					results[item.index] = strings[item.index].text; // fallback to English
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

		if (i + BATCH_SIZE < toTranslate.length) {
			await sleep(DELAY_MS);
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

	console.log(`Target locales: ${locales.join(", ")}${force ? " (force)" : ""}`);

	// Load source and collect strings once
	const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));
	const strings = [];
	collectStrings(data.structure, strings, ["structure"]);
	console.log(`Found ${strings.length} translatable strings.`);

	// Load hash map
	const hashes = loadHashes();

	// Translate each locale sequentially
	for (const locale of locales) {
		await translateLocale(locale, data, strings, hashes, force);
	}

	// Save updated hashes
	saveHashes(hashes);

	console.log(`\nAll done! Processed ${locales.length} locale(s).`);
	console.log(`Hashes: ${HASH_FILE}`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
