import { describe, it, expect } from "vitest";
import { searchSite, groupResults, type SourcedEntry, type StaticSearchIndex } from "../../src/lib/search/siteSearch";
import indexEn from "../../src/data/search/search-index.en.json";

const index = indexEn as StaticSearchIndex;
const pages: SourcedEntry[] = [
	{ source: "pages", t: "Options", d: "Every editor and plugin option", u: "/options" },
	{ source: "pages", t: "Getting Started", d: "Install, create the editor, and display saved content.", u: "/getting-started" },
];
const troubleshooting: SourcedEntry[] = [
	{ source: "troubleshooting", t: "“window is not defined” during server rendering", d: "Next.js build fails", u: "/troubleshooting#ssr" },
];
const entries: SourcedEntry[] = [
	...pages,
	...troubleshooting,
	...index.options.map((e) => ({ ...e, source: "options" as const })),
	...index.api.map((e) => ({ ...e, source: "api" as const })),
];
const titles = (q: string, n = 5) => searchSite(entries, q).slice(0, n).map((e) => e.t);

describe("searchSite", () => {
	it("returns nothing for an empty query", () => {
		expect(searchSite(entries, "   ")).toEqual([]);
	});

	it("ranks an exact member name first", () => {
		expect(titles("getRange")[0]).toBe("$.selection.getRange");
	});

	it("matches plugin options by dotted name and raw key", () => {
		expect(titles("image.uploadUrl")[0]).toBe("image.uploadUrl");
		expect(titles("image_uploadUrl")[0]).toBe("image.uploadUrl");
	});

	it("requires every word (AND)", () => {
		const results = searchSite(entries, "window defined");
		expect(results[0].u).toBe("/troubleshooting#ssr");
		expect(searchSite(entries, "window zzzz")).toEqual([]);
	});

	it("prefers a page over an API member with an equally good match", () => {
		expect(titles("options")[0]).toBe("Options");
	});

	it("groups results by their best hit", () => {
		const groups = groupResults(searchSite(entries, "getRange"));
		expect(groups[0].source).toBe("api");
	});
});
