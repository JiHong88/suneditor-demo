/**
 * Translates option-descriptions.en.json → option-descriptions.{locale}.json (incremental, hash-based)
 * Uses Google Cloud Translation API (official) instead of google-translate-api-x.
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON.
 *
 * Usage:
 *   node scripts/translate-option-desc-v2.cjs              # translate all site locales (incremental)
 *   node scripts/translate-option-desc-v2.cjs ko           # translate specific locale only
 *   node scripts/translate-option-desc-v2.cjs --force      # force re-translate everything
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
const LANG_MAP = { zh_cn: "zh-CN", pt_br: "pt" };

const API_DIR = path.join(__dirname, "..", "src", "data", "api");
const SRC = path.join(API_DIR, "option-descriptions.en.json");
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

// ── Hash key for option descriptions ──────────────────────
function optHashKey(optionKey) {
	return `options.${optionKey}.description`;
}

// ── Translate a single locale (incremental) ───────────────
async function translateLocale(locale, data, items, hashes, force) {
	const targetLang = LANG_MAP[locale] || locale;
	const OUT = path.join(API_DIR, `option-descriptions.${locale}.json`);

	let existingData = null;
	try {
		existingData = JSON.parse(fs.readFileSync(OUT, "utf-8"));
	} catch {
		// No existing file
	}

	const prevHashes = hashes[locale] || {};
	const newHashes = { ...prevHashes };

	const toTranslate = [];
	const results = new Array(items.length);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const hKey = optHashKey(item.key);
		const h = hash(item.original);
		newHashes[hKey] = h;

		if (!force && prevHashes[hKey] === h && existingData) {
			const existing = existingData[item.key];
			if (existing && typeof existing.description === "string" && existing.description.trim()) {
				results[i] = existing.description;
				continue;
			}
		}
		const { protected: p, tokens } = protectBackticks(item.original);
		toTranslate.push({ index: i, protectedText: p, tokens });
	}

	console.log(`\n[${"=".repeat(50)}]`);
	console.log(`[v2/cloud] Translating option-descriptions → "${locale}" (${targetLang})`);
	console.log(
		`  Total: ${items.length}, Changed: ${toTranslate.length}, Cached: ${items.length - toTranslate.length}`,
	);

	if (toTranslate.length === 0) {
		console.log("  Nothing to translate — all up to date.");
		hashes[locale] = newHashes;

		const output = JSON.parse(JSON.stringify(data));
		for (let i = 0; i < items.length; i++) {
			output[items[i].key].description = results[i];
		}
		fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n", "utf-8");
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
					results[item.index] = items[item.index].original;
					failCount++;
				}
			}
			console.log(" done");
		} catch (err) {
			console.log(` ERROR (fallback to en): ${err.message.slice(0, 80)}`);
			for (let j = 0; j < batch.length; j++) {
				results[batch[j].index] = items[batch[j].index].original;
				failCount++;
			}
		}
	}

	// Apply translations
	const output = JSON.parse(JSON.stringify(data));
	for (let i = 0; i < items.length; i++) {
		output[items[i].key].description = results[i];
	}

	fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n", "utf-8");
	hashes[locale] = newHashes;

	const translatedCount = toTranslate.length - failCount;
	console.log(`  Done! ${translatedCount} translated, ${failCount} fallbacks.`);
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
	const items = Object.keys(data)
		.filter((k) => data[k].description && data[k].description.trim())
		.map((k) => ({ key: k, original: data[k].description }));

	console.log(`Found ${items.length} translatable option descriptions.`);

	const hashes = loadHashes();

	for (const locale of locales) {
		await translateLocale(locale, data, items, hashes, force);
	}

	saveHashes(hashes);

	console.log(`\nAll done! Processed ${locales.length} locale(s).`);
	console.log(`Hashes: ${HASH_FILE}`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
