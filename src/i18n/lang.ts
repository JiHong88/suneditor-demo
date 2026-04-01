const RTL_SCRIPTS = new Set([
	"Arab",
	"Hebr",
	"Syrc",
	"Thaa",
	"Nkoo",
	"Adlm",
	"Rohg",
	"Yezi",
	"Mand",
	"Samr",
	"Phnx",
	"Khar",
	"Avst",
	"Armi",
	"Nbat",
	"Prti",
	"Phli",
	"Phlp",
	"Phlv",
	"Sarb",
	"Sogd",
	"Sogo",
	"Hung",
]);

const DEFAULT_RTL_LANGS = new Set<string>([
	"ar",
	"arq",
	"ary",
	"arz",
	"shu",
	"ajp",
	"apc",
	"acm",
	"afb",
	"abh",
	"aeb",
	"xaa",
	"azb",
	"he",
	"yi",
	"fa",
	"prs",
	"haz",
	"lrc",
	"luz",
	"lki",
	"mzn",
	"glk",
	"bqi",
	"bal",
	"bgn",
	"bgp",
	"ur",
	"sd",
	"ks",
	"pnb",
	"ckb",
	"sdh",
	"ps",
	"khw",
	"ug",
	"dv",
	"rhg",
	"nqo",
	"aii",
	"syr",
]);

const LANGUAGE_FALLBACK: Record<string, string> = {
	ko: "한국어",
	en: "English",
	ar: "العربية",
	fa: "فارسی",
	he: "עברית",
	ur: "اردو",
	ps: "پښتو",
	dv: "ދިވެހި",
	ug: "ئۇيغۇرچە",
	ckb: "کوردیی سۆرانی",
	sd: "سنڌي",
	ks: "کٲشُر",
	pnb: "پنجابی (شاہ مُکھی)",
	yi: "ייִדיש",
	azb: "تورکجه",
	nqo: "ߒߞߏ",
	rhg: "روهينغيا",
	ja: "日本語",
	zh: "中文",
	"zh-Hans": "简体中文",
	"zh-Hant": "繁體中文",
	fr: "Français",
	de: "Deutsch",
	es: "Español",
	pt: "Português",
	it: "Italiano",
	ru: "Русский",
	vi: "Tiếng Việt",
	th: "ไทย",
};

function canonicalize(tag: string): string {
	try {
		const loc = new Intl.Locale(tag);
		const mx = (loc as any).maximize?.() ?? loc;
		const parts = [(mx.language || "").toLowerCase(), mx.script ? String(mx.script) : "", mx.region ? String(mx.region).toUpperCase() : ""].filter(Boolean);
		return parts.join("-");
	} catch {
		return tag.replace("_", "-");
	}
}

function pickScript(tag: string): string | null {
	try {
		return new Intl.Locale(tag).script ?? null;
	} catch {
		return null;
	}
}
function pickLang(tag: string): string {
	try {
		return (new Intl.Locale(tag).language || "").toLowerCase();
	} catch {
		return tag.split(/[-_]/)[0].toLowerCase();
	}
}

export function isRtlLocale(tag: string): boolean {
	const ctag = canonicalize(tag);
	const script = pickScript(ctag);
	if (script && RTL_SCRIPTS.has(script)) return true;
	const lang = pickLang(ctag);
	return DEFAULT_RTL_LANGS.has(lang);
}

function getLanguageLabel(code: string): string {
	const c = canonicalize(code);
	const lang = pickLang(c);

	// 1) 네이티브 표기
	try {
		const dn = new Intl.DisplayNames([c], { type: "language" });
		const name = dn.of(lang);
		if (name) return name;
	} catch {
		/* ignore */
	}

	// 2) 폴백 맵
	const fb = LANGUAGE_FALLBACK[c] || LANGUAGE_FALLBACK[lang];
	if (fb) return fb;

	// 3) 최종 폴백: 코드
	return c;
}

export function getDir(tag: string): "rtl" | "ltr" {
	return isRtlLocale(tag) ? "rtl" : "ltr";
}

import { getLang } from "@/i18n/languages";

/**
 * Windows does not render flag emojis (regional indicator sequences).
 * Detect Windows and strip flag emojis from option labels.
 */
function isWindows(): boolean {
	if (typeof navigator === "undefined") return false;
	return /Win/i.test(navigator.platform || "") || /Windows/i.test(navigator.userAgent || "");
}

/** Convert a country-flag emoji to its 2-letter code (e.g. 🇺🇸 → "US") */
function flagToCode(flag: string): string {
	const codePoints = [...flag].map((c) => c.codePointAt(0) ?? 0);
	if (codePoints.length === 2 && codePoints.every((cp) => cp >= 0x1f1e6 && cp <= 0x1f1ff)) {
		return codePoints.map((cp) => String.fromCharCode(cp - 0x1f1e6 + 65)).join("");
	}
	return flag;
}

export function buildLanguageOptions(codes: string[]) {
	const win = isWindows();
	return codes.map((code) => {
		const entry = getLang(code);
		const nativeName = getLanguageLabel(code);
		const rawIcon = entry?.icon ?? "";
		const icon = win && typeof rawIcon === "string" ? flagToCode(rawIcon) : rawIcon;
		return {
			value: code,
			label: `${icon} ${code} [${nativeName}]`.trim(),
			dir: getDir(code),
		};
	});
}
