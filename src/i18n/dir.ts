// rtl.ts
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

// 네가 만든 기본 RTL 언어 폴백 리스트(스크립트 표기가 없는 경우 대비)
// 자주 쓰이는 것 몇 개만 추가 제안: azb(남아제르), nqo(N’Ko), aii(신 아람어), syr(고전 시리아어)
const DEFAULT_RTL_LANGS = new Set([
	// 아랍어권
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
	// 히브리어권
	"he",
	"yi",
	// 이란/아프간 계열
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
	// 인도·파키스탄 계열
	"ur",
	"sd",
	"ks",
	"pnb",
	// 쿠르드
	"ckb",
	"sdh",
	// 아프간/파키스탄
	"ps",
	"khw",
	// 중앙아시아
	"ug",
	// 몰디브
	"dv",
	// 기타 RTL 언어
	"rhg",
	"nqo",
	"aii",
	"syr",
]);

function pickScript(tag: string): string | null {
	try {
		const loc = new Intl.Locale(tag);
		return loc.script ?? null;
	} catch {
		return null;
	}
}

function pickLang(tag: string): string {
	try {
		const loc = new Intl.Locale(tag);
		return (loc.language || "").toLowerCase();
	} catch {
		return tag.replace("_", "-").split("-")[0].toLowerCase();
	}
}

export function isRtlLocale(tag: string): boolean {
	const script = pickScript(tag);
	if (script && RTL_SCRIPTS.has(script)) return true; // 1) 스크립트가 RTL이면 확정
	const lang = pickLang(tag);
	return DEFAULT_RTL_LANGS.has(lang); // 2) 스크립트 없으면 폴백
}

export function getDir(tag: string): "rtl" | "ltr" {
	return isRtlLocale(tag) ? "rtl" : "ltr";
}
