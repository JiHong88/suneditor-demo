/**
 * Translates api-docs.en.json → api-docs.{locale}.json
 *
 * Usage:
 *   npm i -D google-translate-api-x    (one-time)
 *   node scripts/translate-api-docs.cjs ko
 *   node scripts/translate-api-docs.cjs ar
 */

const fs = require("fs");
const path = require("path");
const { translate } = require("google-translate-api-x");

const LOCALE = process.argv[2];
if (!LOCALE) {
	console.error("Usage: node scripts/translate-api-docs.cjs <locale>");
	process.exit(1);
}

const LANG_MAP = { ko: "ko", ar: "ar", ja: "ja", zh: "zh-CN" };
const targetLang = LANG_MAP[LOCALE] || LOCALE;

const SRC = path.join(__dirname, "..", "src", "data", "api", "api-docs.en.json");
const OUT = path.join(__dirname, "..", "src", "data", "api", `api-docs.${LOCALE}.json`);

const BATCH_SIZE = 20;
const DELAY_MS = 800;

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
// Each entry: { pathSegments: [...], text: string }
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

// ── Main ──────────────────────────────────────────────────
async function main() {
	console.log(`Translating api-docs to "${LOCALE}" (${targetLang})...`);

	const data = JSON.parse(fs.readFileSync(SRC, "utf-8"));
	const strings = [];
	collectStrings(data.structure, strings, ["structure"]);
	console.log(`Found ${strings.length} translatable strings.`);

	// Protect backticks
	const items = strings.map((s) => {
		const { protected: p, tokens } = protectBackticks(s.text);
		return { ...s, protectedText: p, tokens };
	});

	// Translate in batches
	const translated = new Array(items.length);
	const totalBatches = Math.ceil(items.length / BATCH_SIZE);
	let failCount = 0;

	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		const batch = items.slice(i, i + BATCH_SIZE);
		const batchNum = Math.floor(i / BATCH_SIZE) + 1;

		process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.length})...`);

		try {
			const texts = batch.map((b) => b.protectedText);
			const results = await translateBatch(texts, targetLang);

			for (let j = 0; j < batch.length; j++) {
				if (results[j]) {
					translated[i + j] = restoreBackticks(results[j], batch[j].tokens);
				} else {
					translated[i + j] = batch[j].text; // fallback to English
					failCount++;
				}
			}
			console.log(" done");
		} catch (err) {
			console.log(` ERROR (fallback to en): ${err.message.slice(0, 80)}`);
			for (let j = 0; j < batch.length; j++) {
				translated[i + j] = batch[j].text;
				failCount++;
			}
		}

		if (i + BATCH_SIZE < items.length) {
			await sleep(DELAY_MS);
		}
	}

	// Apply translations to cloned data
	const output = JSON.parse(JSON.stringify(data));
	let setFails = 0;
	for (let i = 0; i < strings.length; i++) {
		if (!setBySegments(output, strings[i].segments, translated[i])) {
			setFails++;
		}
	}

	fs.writeFileSync(OUT, JSON.stringify(output, null, 2) + "\n", "utf-8");

	const translatedCount = translated.filter((t, i) => t !== strings[i].text).length;
	console.log(`\nDone! ${translatedCount}/${strings.length} translated, ${failCount} fallbacks, ${setFails} path errors.`);
	console.log(`Output: ${OUT}`);
}

main().catch((err) => {
	console.error("Fatal error:", err);
	process.exit(1);
});
