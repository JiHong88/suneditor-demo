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
		if (name) {
			return isRtlLocale(c) ? `← ${name}` : name;
		}
	} catch {
		/* ignore */
	}

	// 2) 폴백 맵
	const fb = LANGUAGE_FALLBACK[c] || LANGUAGE_FALLBACK[lang];
	if (fb) return isRtlLocale(c) ? `← ${fb}` : fb;

	// 3) 최종 폴백: 코드
	return c;
}

export function getDir(tag: string): "rtl" | "ltr" {
	return isRtlLocale(tag) ? "rtl" : "ltr";
}

export function buildLanguageOptions(codes: string[]) {
	return codes.map((code) => ({
		value: code,
		label: getLanguageLabel(code),
		dir: getDir(code),
	}));
}
