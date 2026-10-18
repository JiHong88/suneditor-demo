/**
 * Generates src/data/search/search-index.<locale>.json for the site search (⌘K).
 * Run after `docs:generate` / `docs:translate*`:  npm run search:generate
 * __tests__/data/searchIndex.test.ts fails when the committed files are stale.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildStaticSearchIndex } from "./lib/build-search-index.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const API_DIR = path.join(ROOT, "src/data/api");
const OUT_DIR = path.join(ROOT, "src/data/search");

const readJson = (file) => JSON.parse(fs.readFileSync(path.join(API_DIR, file), "utf-8"));
const locales = fs
	.readdirSync(API_DIR)
	.map((f) => f.match(/^api-docs\.(.+)\.json$/)?.[1])
	.filter(Boolean)
	.sort();

const apiDocsEn = readJson("api-docs.en.json");
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const locale of locales) {
	const index = buildStaticSearchIndex(apiDocsEn, readJson(`api-docs.${locale}.json`), readJson(`option-descriptions.${locale}.json`));
	const file = path.join(OUT_DIR, `search-index.${locale}.json`);
	fs.writeFileSync(file, JSON.stringify(index) + "\n");
	console.log(
		`  ✅ search-index.${locale}.json  api ${index.api.length} · options ${index.options.length} · ${(fs.statSync(file).size / 1024).toFixed(0)} KB`,
	);
}
