import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { buildStaticSearchIndex } from "../../scripts/lib/build-search-index.mjs";

/**
 * 사이트 검색(⌘K) 정적 인덱스 테스트
 *
 * src/data/search/search-index.<locale>.json은 api-docs / option-descriptions에서 생성된다.
 * docs:generate·docs:translate 후 `npm run search:generate`를 빠뜨리면 이 테스트가 실패한다.
 */

const ROOT = path.resolve(__dirname, "../..");
const API_DIR = path.join(ROOT, "src/data/api");
const SEARCH_DIR = path.join(ROOT, "src/data/search");
const readJson = (file: string) => JSON.parse(fs.readFileSync(file, "utf-8"));

const locales = fs
	.readdirSync(API_DIR)
	.map((f) => f.match(/^api-docs\.(.+)\.json$/)?.[1])
	.filter((l): l is string => !!l)
	.sort();
const apiDocsEn = readJson(path.join(API_DIR, "api-docs.en.json"));

describe("search index", () => {
	it("exists for every locale", () => {
		const files = fs.readdirSync(SEARCH_DIR).filter((f) => f.endsWith(".json"));
		expect(files.sort()).toEqual(locales.map((l) => `search-index.${l}.json`));
	});

	it.each(locales)("%s is up to date (npm run search:generate)", (locale) => {
		const expected = buildStaticSearchIndex(
			apiDocsEn,
			readJson(path.join(API_DIR, `api-docs.${locale}.json`)),
			readJson(path.join(API_DIR, `option-descriptions.${locale}.json`)),
		);
		const actual = readJson(path.join(SEARCH_DIR, `search-index.${locale}.json`));
		expect(actual).toEqual(expected);
	});

	it("API links point at the DOM ids the docs-api page renders", () => {
		const { api } = readJson(path.join(SEARCH_DIR, "search-index.en.json"));
		const byId = new Map<string, Set<string>>();
		for (const e of api) {
			const url = new URL(e.u, "https://x");
			expect(url.pathname).toBe("/docs-api");
			const hash = decodeURIComponent(url.hash.slice(1));
			// method/getter cards: `${prefix}${name}` (title is the same string), types: `type-<Name>`
			if (hash.startsWith("type-")) expect(hash).toBe(`type-${e.t}`);
			else if (!e.t.endsWith("')")) expect(hash).toBe(e.t);
			const sections = byId.get(hash) ?? new Set<string>();
			sections.add(url.searchParams.get("s") ?? "editor");
			byId.set(hash, sections);
		}
		// One anchor → one section, so a shared link restores the right section
		const ambiguous = [...byId].filter(([, s]) => s.size > 1).map(([id]) => id);
		expect(ambiguous).toEqual([]);
	});

	it("option links point at existing option cards", () => {
		const keys = new Set(Object.keys(readJson(path.join(API_DIR, "option-descriptions.en.json"))));
		const { options } = readJson(path.join(SEARCH_DIR, "search-index.en.json"));
		for (const e of options) {
			const key = e.u.replace("/options#opt-", "");
			expect(keys.has(key), e.u).toBe(true);
		}
	});
});
