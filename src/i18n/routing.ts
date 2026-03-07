import { defineRouting } from "next-intl/routing";
import { localeCodes } from "./languages";

export const locales: string[] = localeCodes;
export const defaultLocale = "en" as const;

export type Locale = (typeof locales)[number];
const AR_COUNTRIES = new Set(["AE", "SA", "EG", "QA", "KW", "BH", "OM", "IQ", "JO", "PS", "YE", "SD", "DZ", "MA", "TN", "LY", "LB", "SY"]);

export function countryToLocale(country: string = ""): Locale {
	const c = country.toUpperCase();
	if (c === "KR") return "ko";
	if (AR_COUNTRIES.has(c)) return "ar";
	return locales.includes(country as Locale) ? (country as Locale) : "en";
}

export const routing = defineRouting({
	locales,
	defaultLocale,
	localePrefix: "as-needed",
});
