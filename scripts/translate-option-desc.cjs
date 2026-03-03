/**
 * Translates option-descriptions.en.json → option-descriptions.{locale}.json
 *
 * Usage:
 *   npm i -D google-translate-api-x    (one-time)
 *   node scripts/translate-option-desc.cjs ko
 *   node scripts/translate-option-desc.cjs ar
 *
 * - Translates: description field only
 * - Preserves: backtick-wrapped content, default values, keys
 */

const fs = require("fs");
const path = require("path");
const { translate } = require("google-translate-api-x");

const LOCALE = process.argv[2];
if (!LOCALE) {
	console.error("Usage: node scripts/translate-option-desc.cjs <locale>");
	process.exit(1);
}

const LANG_MAP = { ko: "ko", ar: "ar", ja: "ja", zh: "zh-CN" };
const targetLang = LANG_MAP[LOCALE] || LOCALE;

const SRC = path.join(__dirname, "..", "src", "data", "api", "option-descriptions.en.json");
const OUT = path.join(__dirname, "..", "src", "data", "api", `option-descriptions.${LOCALE}.json`);

const BATCH_SIZE = 30;
const DELAY_MS = 500;

function protectBackticks(text) {
	const tokens = [];
	const protected_ = text.replace(/`[^`]+`/g, (match) => {
		const idx = tokens.length;
		tokens.push(match);
		return `__BT${idx}__`;
	});
	return { protected: protected_, tokens };
}

function restoreBackticks(text, tokens) {
	return text.replace(/__BT(\d+)__/g, (_, idx) => tokens[Number(idx)] || _);
}

async function translateBatch(texts, lang) {
	const results = await translate(texts, { to: lang });
	if (Array.isArray(results)) return results.map((r) => r.text);
	return [results.text];
}

async function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

async function main() {
	console.log(`Translating option-descriptions to "${LOCALE}" (${targetLang})...`);

	const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));
	const keys = Object.keys(data);
	const items = keys
		.filter((k) => data[k].description && data[k].description.trim())
		.map((k) => {
			const { protected: p, tokens } = protectBackticks(data[k].description);
			return { key: k, protectedText: p, tokens, original: data[k].description };
		});

	console.log(`Found ${items.length} descriptions to translate.`);

	const totalBatches = Math.ceil(items.length / BATCH_SIZE);

	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		const batch = items.slice(i, i + BATCH_SIZE);
		const batchNum = Math.floor(i / BATCH_SIZE) + 1;

		process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length})...`);

		try {
			const texts = batch.map((b) => b.protectedText);
			const results = await translateBatch(texts, targetLang);

			for (let j = 0; j < batch.length; j++) {
				const restored = restoreBackticks(results[j], batch[j].tokens);
				data[batch[j].key].description = restored;
			}
			console.log(" done");
		} catch (err) {
			console.log(` ERROR: ${err.message} (keeping English)`);
		}

		if (i + BATCH_SIZE < items.length) await sleep(DELAY_MS);
	}

	fs.writeFileSync(OUT, JSON.stringify(data, null, 2) + "\n", "utf-8");
	console.log(`\nDone! Output: ${OUT}`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
