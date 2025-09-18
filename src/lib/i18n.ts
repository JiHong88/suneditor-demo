import type { NextRequest } from "next/server";

export type Locale = "ko" | "en" | "ar";

const AR_COUNTRIES = new Set(["AE", "SA", "EG", "QA", "KW", "BH", "OM", "IQ", "JO", "PS", "YE", "SD", "DZ", "MA", "TN", "LY", "LB", "SY"]);

export function countryToLocale(country?: string | null): Locale {
	const c = (country || "").toUpperCase();
	if (AR_COUNTRIES.has(c)) return "ar";
	return (country || "en") as Locale;
}

/** 접속 정보로 locale 추론 (쿠키가 없을 때) */
export function detectLocaleFromRequest(req: NextRequest): Locale {
	// 1) Vercel Edge geo
	const byGeo = (req as NextRequest & { geo?: { country?: string } }).geo?.country;
	if (byGeo) return countryToLocale(byGeo);

	// 2) 헤더 기반
	const h = req.headers;
	const byHdr =
		h.get("x-vercel-ip-country") || // Vercel
		h.get("cf-ipcountry") || // Cloudflare
		h.get("x-country-code") || // 커스텀 프록시
		null;
	if (byHdr) return countryToLocale(byHdr);

	// 3) Accept-Language
	const al = h.get("accept-language")?.toLowerCase() || "";
	if (al.includes("ko")) return "ko";
	if (al.includes("ar")) return "ar";
	return "en";
}
