/**
 * Site search (⌘K) static index — API members and options, one file per locale.
 * Shared by scripts/generate-search-index.mjs (writes the files) and __tests__/data/searchIndex.test.ts (checks they are fresh).
 *
 * Pages, troubleshooting and features are not here: the palette builds those from messages at runtime.
 */
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
 * @param {object} apiDocsEn   api-docs.en.json — names, ids, groups (stable across locales)
 * @param {object} apiDocsLoc  api-docs.<locale>.json — descriptions
 * @param {Record<string, {description: string}>} optDesc option-descriptions.<locale>.json
 */
export function buildStaticSearchIndex(apiDocsEn, apiDocsLoc, optDesc) {
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

	return { version: apiDocsEn.version, api, options };
}
