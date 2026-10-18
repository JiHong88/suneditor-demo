/**
 * Site search (⌘K) — entry shape and ranking.
 * Static entries (API, options) come from src/data/search/search-index.<locale>.json (npm run search:generate);
 * pages, troubleshooting and features are built from messages in the palette.
 */

/** t: title · u: href (locale-less) · g: group label · d: short description · k: extra keyword (e.g. raw option key) */
export type SearchEntry = { t: string; u: string; g?: string; d?: string; k?: string };

export type SearchSource = "pages" | "troubleshooting" | "plugins" | "features" | "options" | "api";

export type SourcedEntry = SearchEntry & { source: SearchSource };

export type StaticSearchIndex = { version: string; api: SearchEntry[]; options: SearchEntry[] };

/** Small tie-breaker so a guide page outranks one of 1,000 API members with an equally good match. */
const SOURCE_BOOST: Record<SearchSource, number> = { pages: 12, troubleshooting: 8, plugins: 7, features: 6, options: 4, api: 0 };

export function queryWords(query: string): string[] {
	return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

/** 0 = no match. Every word must appear somewhere (AND), then the title decides the rank. */
export function scoreEntry(entry: SourcedEntry, words: string[]): number {
	if (words.length === 0) return 0;
	const title = entry.t.toLowerCase();
	const key = entry.k?.toLowerCase() ?? "";
	const group = entry.g?.toLowerCase() ?? "";
	const desc = entry.d?.toLowerCase() ?? "";
	const inTitle = (w: string) => title.includes(w) || key.includes(w);

	if (!words.every((w) => inTitle(w) || group.includes(w) || desc.includes(w))) return 0;

	const q = words.join(" ");
	// Member name: "$.selection.getRange" → "getrange"
	const member = title.slice(title.lastIndexOf(".") + 1);

	let score: number;
	if (title === q || member === q || key === q) score = 100;
	else if (member.startsWith(q) || title.startsWith(q)) score = 80;
	else if (words.every(inTitle)) score = 60;
	else if (words.every((w) => inTitle(w) || group.includes(w))) score = 40;
	else score = 20;

	return score + SOURCE_BOOST[entry.source];
}

/** Ranked matches (best first), shorter titles first on ties. */
export function searchSite(entries: SourcedEntry[], query: string, limit = Infinity): SourcedEntry[] {
	const words = queryWords(query);
	if (words.length === 0) return [];
	const scored: { entry: SourcedEntry; score: number }[] = [];
	for (const entry of entries) {
		const score = scoreEntry(entry, words);
		if (score > 0) scored.push({ entry, score });
	}
	scored.sort((a, b) => b.score - a.score || a.entry.t.length - b.entry.t.length);
	return scored.slice(0, limit).map((s) => s.entry);
}

/** Max rows per group, so 1,000 API members can't push every other kind of result off screen. */
const GROUP_LIMIT: Record<SearchSource, number> = { pages: 5, troubleshooting: 5, plugins: 5, features: 5, options: 6, api: 8 };

/** Group ranked results for display — groups ordered by their best hit, entries keep their rank. */
export function groupResults(results: SourcedEntry[]): { source: SearchSource; entries: SourcedEntry[] }[] {
	const groups = new Map<SearchSource, SourcedEntry[]>();
	for (const r of results) {
		const list = groups.get(r.source);
		if (!list) groups.set(r.source, [r]);
		else if (list.length < GROUP_LIMIT[r.source]) list.push(r);
	}
	return [...groups].map(([source, entries]) => ({ source, entries }));
}
