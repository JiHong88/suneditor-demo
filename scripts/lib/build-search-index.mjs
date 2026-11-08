/**
 * Site search (⌘K) static index — API members, options and React guide sections, one file per locale.
 * Shared by scripts/generate-search-index.mjs (writes the files) and __tests__/data/searchIndex.test.ts (checks they are fresh).
 *
 * Pages, troubleshooting and features are not here: the palette builds those from messages at runtime.
 */
import GithubSlugger from "github-slugger";
import { buildSearchIndex } from "../../src/app/[locale]/docs-api/_lib/apiSearchIndex.ts";
import { OPTION_PLUGIN_PREFIXES } from "../../src/data/optionPluginPrefixes.ts";

const DESC_MAX = 110;

/** First sentence-ish line of a doc description, without code/markdown, cut to DESC_MAX. */
export function shortDesc(text) {
	if (!text) return "";
	const plain = text
		.replace(/```[\s\S]*?```/g, " ")
		.split("\n")
		.map((l) => l.replace(/^[-*]\s+/, "").trim())
		.find((l) => l.length > 0);
	if (!plain) return "";
	// Docs use " - " to start bullet points (see DocDescription) — keep only the lead sentence
	const clean = plain
		.split(/\s-\s/)[0]
		.replace(/`/g, "")
		.replace(/\{@link\s+([^}|]+)(?:\|[^}]*)?\}/g, "$1")
		.replace(/\s+/g, " ")
		.trim();
	return clean.length > DESC_MAX ? `${clean.slice(0, DESC_MAX - 1).trimEnd()}…` : clean;
}

function apiTitle(item) {
	if (item.kind === "type") return item.name;
	// "$.store.get('" + name → "$.store.get('name')"
	if (item.prefix.endsWith("('")) return `${item.prefix}${item.name}')`;
	return `${item.prefix}${item.name}`.replace(/\.$/, "");
}

function apiUrl(item) {
	const s = item.sectionId === "editor" ? "" : `?s=${encodeURIComponent(item.sectionId)}`;
	return `/docs-api${s}#${item.id}`;
}

function pluginOf(key) {
	let best = null;
	for (const pp of OPTION_PLUGIN_PREFIXES) {
		if (key.startsWith(pp.prefix) && (!best || pp.prefix.length > best.prefix.length)) best = pp;
	}
	return best;
}

/**
 * `##` / `###` sections of the React guide (src/data/react-guide/react-guide.<locale>.md) → `/react#<slug>`.
 * Slugs are computed the way the page renders them (rehype-slug → github-slugger), from the localized heading text.
 * `g` is the parent `##` heading of a `###`; `d` is the first paragraph line under the heading.
 */
export function reactGuideEntries(markdown) {
	if (!markdown) return [];
	const lines = markdown.replace(/```[\s\S]*?```/g, (block) => block.replace(/[^\n]/g, "")).split("\n");
	const slugger = new GithubSlugger();
	const entries = [];
	let parent = "";
	for (let i = 0; i < lines.length; i++) {
		const m = lines[i].match(/^(##|###)\s+(.+?)\s*#*\s*$/);
		if (!m) continue;
		const title = m[2].replace(/`/g, "").trim();
		if (m[1] === "##") parent = title;
		// First prose line under the heading: skip sub-headings, tables and HTML comments
		const body = lines.slice(i + 1).find((l) => l.trim() && !/^(#{1,6}\s|\||<!--)/.test(l));
		const entry = { t: title, u: `/react#${slugger.slug(m[2].trim())}` };
		if (m[1] === "###" && parent) entry.g = parent;
		const d = shortDesc(body?.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1"));
		if (d) entry.d = d;
		entries.push(entry);
	}
	return entries;
}

/**
 * @param {object} apiDocsEn   api-docs.en.json — names, ids, groups (stable across locales)
 * @param {object} apiDocsLoc  api-docs.<locale>.json — descriptions
 * @param {Record<string, {description: string}>} optDesc option-descriptions.<locale>.json
 * @param {string} [reactGuide] react-guide.<locale>.md (English when the locale has none)
 */
export function buildStaticSearchIndex(apiDocsEn, apiDocsLoc, optDesc, reactGuide = "") {
	const locDesc = new Map(buildSearchIndex(apiDocsLoc).map((i) => [`${i.sectionId}|${i.id}`, i.description]));

	const api = buildSearchIndex(apiDocsEn).map((item) => ({
		t: apiTitle(item),
		g: item.groupTitle,
		d: shortDesc(locDesc.get(`${item.sectionId}|${item.id}`) ?? item.description),
		u: apiUrl(item),
	}));

	const options = Object.keys(optDesc).map((key) => {
		const plugin = pluginOf(key);
		const entry = {
			t: plugin ? `${plugin.name}.${key.slice(plugin.prefix.length)}` : key,
			g: plugin ? plugin.label : "",
			d: shortDesc(optDesc[key]?.description),
			u: `/options#opt-${key}`,
		};
		// Original key (e.g. image_uploadUrl) is searchable too
		if (plugin) entry.k = key;
		return entry;
	});

	return { version: apiDocsEn.version, api, options, react: reactGuideEntries(reactGuide) };
}
