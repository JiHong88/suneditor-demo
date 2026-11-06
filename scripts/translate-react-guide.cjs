#!/usr/bin/env node
/**
 * Translates src/data/react-guide/react-guide.en.md → react-guide.{locale}.md
 * Uses Google Cloud Translation API (official), like translate-messages-v2.cjs.
 *
 * Markdown-aware: code fences, blank lines, HTML comments and table separator rows are copied verbatim.
 * Inside translated text, Markdown links, inline code, raw HTML tags and brand names are replaced by
 * `⟦n⟧` tokens (MT keeps those in place; `__PH0__`-style tokens get mangled and brackets get reordered).
 * A link's text is translated as a segment of its own and the link is rebuilt afterwards.
 * Trailing hard line breaks (`\` or two spaces) are re-attached after translation.
 * Incremental: each English segment is cached per locale by its hash, so unchanged sentences are never
 * re-sent even when the README is reordered.
 *
 * Requires: GOOGLE_APPLICATION_CREDENTIALS env var pointing to service account JSON.
 *
 * Usage:
 *   npm run react-guide:translate              # all site locales (incremental)
 *   npm run react-guide:translate -- ko        # one locale only
 *   npm run react-guide:translate -- --force   # ignore the cache
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DIR = path.join(__dirname, "..", "src", "data", "react-guide");
const SRC = path.join(DIR, "react-guide.en.md");
const CACHE_FILE = path.join(DIR, ".translation-cache.json");
const BATCH_SIZE = 100;

// Google Cloud Translate language code mapping (same as the other translate scripts)
const LANG_MAP = { "zh-CN": "zh-CN", "pt-BR": "pt" };

// ── Site locales from languages.ts ────────────────────────
function getSiteLocales() {
	const src = fs.readFileSync(path.join(__dirname, "..", "src", "i18n", "languages.ts"), "utf-8");
	const locales = [];
	const re = /code:\s*"([^"]+)"[^}]*siteLocale:\s*true/g;
	let m;
	while ((m = re.exec(src)) !== null) {
		if (m[1] !== "en") locales.push(m[1]);
	}
	return locales;
}

function hash(text) {
	return crypto.createHash("md5").update(text).digest("hex").slice(0, 12);
}

// ── Protection ────────────────────────────────────────────
// Brand names and React vocabulary that stay in English (`props` as a word is mistranslated as stage props).
const BRAND_TERMS = /\b(?:SunEditor|Next\.js|React|TypeScript|GitHub|npm|Playground|App Router|Pages Router|[Pp]rops?)\b/g;
const LINK = /\[([^\]]*)\]\(([^)]*)\)/g;
// MT localizes the digits in some languages (Persian ۰۱۲, Arabic ٠١٢), so accept those too.
const TOKEN = /⟦\s*([0-9\u0660-\u0669\u06F0-\u06F9]+)\s*⟧/g;
const DIGITS = "0123456789";
const tokenIndex = (digits) => Number([...digits].map((d) => (/[0-9]/.test(d) ? d : DIGITS[(d.charCodeAt(0) - 0x660) % 0x90 % 10])).join(""));

/**
 * Replaces the parts MT must not touch with `⟦n⟧`. A link token keeps `{ text, url }` so the text can be
 * translated separately (see translateTexts); every other token is restored verbatim.
 */
function protect(text) {
	const tokens = [];
	const tok = (value) => {
		tokens.push(value);
		return `⟦${tokens.length - 1}⟧`;
	};
	const p = text
		.replace(LINK, (_, linkText, url) => tok({ text: linkText, url }))
		.replace(/`[^`]*`/g, tok) // inline code
		.replace(/<\/?[a-zA-Z][^>]*>/g, tok) // raw HTML tags
		.replace(BRAND_TERMS, tok);
	return { protected: p, tokens };
}

/** Puts tokens back; `linkText(text)` supplies the translated text of a link. */
function restore(translated, tokens, linkText = (t) => t) {
	return translated.replace(TOKEN, (m, i) => {
		const t = tokens[tokenIndex(i)];
		if (t === undefined) return m;
		return typeof t === "string" ? t : `[${linkText(t.text)}](${t.url})`;
	});
}

/** Text worth sending: has letters outside tokens. */
function needsTranslation(protectedText) {
	return /[A-Za-z]/.test(protectedText.replace(TOKEN, ""));
}

// ── Markdown segmentation ─────────────────────────────────
// Each line becomes { verbatim } | { table, cells } | { prefix, text, suffix }.
const TABLE_SEP = /^\|?[\s:|-]+\|?$/;
const PREFIXED = [
	/^(#{1,6}\s+)(.*)$/, // heading
	/^(\s*(?:[-*+]|\d+\.)\s+)(.*)$/, // list item
	/^(>\s*)(.*)$/, // blockquote
];
const HARD_BREAK = /(\s*\\|\s{2,})$/; // Markdown hard line break: trailing backslash or two spaces

function splitTableCells(line) {
	const inner = line.trim().replace(/^\|/, "").replace(/\|$/, "");
	return inner.split(/(?<!\\)\|/).map((c) => c.trim());
}

function textSegment(prefix, rest) {
	const br = HARD_BREAK.exec(rest);
	return br ? { prefix, text: rest.slice(0, br.index), suffix: br[0] } : { prefix, text: rest, suffix: "" };
}

function segmentLines(lines) {
	const segs = [];
	let inFence = false;
	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			segs.push({ verbatim: line });
			continue;
		}
		if (inFence || line.trim() === "" || line.startsWith("<!--")) {
			segs.push({ verbatim: line });
			continue;
		}
		if (line.trim().startsWith("|")) {
			if (TABLE_SEP.test(line.trim())) segs.push({ verbatim: line });
			else segs.push({ table: true, cells: splitTableCells(line) });
			continue;
		}
		let matched = false;
		for (const re of PREFIXED) {
			const m = re.exec(line);
			if (m) {
				// One-word headings ("Install", "Props", "Types") come back as verbs or odd nouns; keep them in English.
				if (m[1].startsWith("#") && !/\s/.test(m[2].trim())) segs.push({ verbatim: line });
				else segs.push(textSegment(m[1], m[2]));
				matched = true;
				break;
			}
		}
		if (!matched) segs.push(textSegment("", line));
	}
	return segs;
}

/** Distinct texts to translate: lines, table cells and the texts of the links inside them. */
function collectTexts(segs) {
	const texts = new Set();
	const add = (t) => {
		if (!t) return;
		const { protected: p, tokens } = protect(t);
		if (needsTranslation(p)) texts.add(t);
		for (const tk of tokens) if (typeof tk !== "string") add(tk.text);
	};
	for (const s of segs) {
		if (s.table) s.cells.forEach(add);
		else if (s.text !== undefined) add(s.text);
	}
	return [...texts];
}

// ── Cache ─────────────────────────────────────────────────
function loadCache() {
	try {
		return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
	} catch {
		return {};
	}
}

function saveCache(cache) {
	const sorted = {};
	for (const locale of Object.keys(cache).sort()) {
		sorted[locale] = {};
		for (const key of Object.keys(cache[locale]).sort()) sorted[locale][key] = cache[locale][key];
	}
	fs.writeFileSync(CACHE_FILE, JSON.stringify(sorted, null, "\t") + "\n", "utf-8");
}

// ── Google Cloud Translation batch ────────────────────────
let translationClient = null;
async function translateBatch(texts, from, to) {
	if (!translationClient) {
		const { TranslationServiceClient } = require("@google-cloud/translate").v3;
		translationClient = new TranslationServiceClient();
	}
	const projectId = await translationClient.getProjectId();
	const [response] = await translationClient.translateText({
		parent: `projects/${projectId}/locations/global`,
		contents: texts,
		mimeType: "text/plain",
		sourceLanguageCode: from,
		targetLanguageCode: to,
	});
	return response.translations.map((t) => t.translatedText || null);
}

/**
 * Translates protected texts; returns the raw MT output per text (tokens still in place) or null.
 * A missing or duplicated token means MT damaged the sentence → null, so the English line is kept.
 */
async function translateProtected(texts, targetLang) {
	const items = texts.map((text) => protect(text));
	const results = await translateBatch(
		items.map((it) => it.protected),
		"en",
		targetLang,
	);
	return results.map((out, j) => {
		if (!out) return null;
		const want = items[j].tokens.map((_, i) => String(i)).sort();
		const got = [...out.matchAll(TOKEN)].map((m) => String(tokenIndex(m[1]))).sort();
		return want.join(",") === got.join(",") ? out : null;
	});
}

// ── Translate one locale ──────────────────────────────────
async function translateLocale(locale, segs, texts, cache, force) {
	const targetLang = LANG_MAP[locale] || locale;
	const OUT = path.join(DIR, `react-guide.${locale}.md`);
	const prev = force ? {} : cache[locale] || {};
	const next = {}; // hash(en text) → MT output with tokens still in place
	const pending = [];

	for (const text of texts) {
		const h = hash(text);
		if (prev[h]) next[h] = prev[h];
		else pending.push(text);
	}

	console.log(`\n[react-guide] Translating → "${locale}" (${targetLang})`);
	console.log(`  Segments: ${texts.length}, Changed: ${pending.length}, Cached: ${texts.length - pending.length}`);

	let failCount = 0;
	for (let i = 0; i < pending.length; i += BATCH_SIZE) {
		const batch = pending.slice(i, i + BATCH_SIZE);
		process.stdout.write(`  Batch ${i / BATCH_SIZE + 1}/${Math.ceil(pending.length / BATCH_SIZE)} (${batch.length})...`);
		try {
			const results = await translateProtected(batch, targetLang);
			batch.forEach((text, j) => {
				if (results[j]) next[hash(text)] = results[j];
				else failCount++;
			});
			console.log(" done");
		} catch (err) {
			console.log(` ERROR (fallback to en): ${err.message.slice(0, 80)}`);
			failCount += batch.length;
		}
	}

	// Resolve a text: cached MT output with tokens restored; link texts resolve recursively.
	const tr = (text) => {
		const { tokens } = protect(text);
		const mt = next[hash(text)];
		return mt ? restore(mt, tokens, tr) : restore(protect(text).protected, tokens, tr);
	};
	const out = segs.map((s) => {
		if (s.verbatim !== undefined) return s.verbatim;
		if (s.table) return `| ${s.cells.map(tr).join(" | ")} |`;
		return s.prefix + tr(s.text) + s.suffix;
	});

	fs.writeFileSync(OUT, out.join("\n"), "utf-8");
	cache[locale] = next; // entries no longer in the source are dropped
	console.log(`  Done! ${pending.length - failCount} translated, ${failCount} fallbacks → ${path.relative(process.cwd(), OUT)}`);
}

// ── Main ──────────────────────────────────────────────────
async function main() {
	const args = process.argv.slice(2);
	const force = args.includes("--force");
	const argLocale = args.find((a) => !a.startsWith("--"));
	const locales = argLocale ? [argLocale] : getSiteLocales();

	const source = fs.readFileSync(SRC, "utf-8");
	const segs = segmentLines(source.split("\n"));
	const texts = collectTexts(segs);
	console.log(`[react-guide] ${texts.length} translatable segments in react-guide.en.md → ${locales.join(", ")}${force ? " (force)" : ""}`);

	const cache = loadCache();
	for (const locale of locales) await translateLocale(locale, segs, texts, cache, force);
	saveCache(cache);
	console.log(`\nAll done! Processed ${locales.length} locale(s).`);
}

module.exports = { protect, restore, segmentLines, collectTexts };

if (require.main === module) {
	main().catch((err) => {
		console.error("Fatal error:", err);
		process.exit(1);
	});
}
