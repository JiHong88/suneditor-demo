import type { ReactNode } from "react";

export type LanguageEntry = {
	/** locale code (BCP 47 or SunEditor lang key like "zh_cn", "pt_br") */
	code: string;
	/** Native name of the language */
	nativeName: string;
	/** Icon – can be any ReactNode: string emoji, SVG component, img element, etc. */
	icon?: ReactNode;
	/** true if this locale is used for the site UI (next-intl routing) */
	siteLocale?: boolean;
	/** true if SunEditor has a language pack for this code */
	editorLang?: boolean;
};

/**
 * Shared language list – single source of truth.
 * Each entry can be tagged as siteLocale, editorLang, or both.
 * Filter by tag to get the subset you need.
 */
export const languages: LanguageEntry[] = [
	{ code: "ar", nativeName: "العربية", icon: "🇸🇦", editorLang: true, siteLocale: true },
	{ code: "ckb", nativeName: "کوردیی سۆرانی", icon: "🇮🇶", editorLang: true },
	{ code: "cs", nativeName: "Čeština", icon: "🇨🇿", editorLang: true },
	{ code: "da", nativeName: "Dansk", icon: "🇩🇰", editorLang: true },
	{ code: "de", nativeName: "Deutsch", icon: "🇩🇪", editorLang: true },
	{ code: "en", nativeName: "English", icon: "🇺🇸", editorLang: true, siteLocale: true },
	{ code: "es", nativeName: "Español", icon: "🇪🇸", editorLang: true },
	{ code: "fa", nativeName: "فارسی", icon: "🇮🇷", editorLang: true },
	{ code: "fr", nativeName: "Français", icon: "🇫🇷", editorLang: true },
	{ code: "he", nativeName: "עברית", icon: "🇮🇱", editorLang: true },
	{ code: "hu", nativeName: "Magyar", icon: "🇭🇺", editorLang: true },
	{ code: "it", nativeName: "Italiano", icon: "🇮🇹", editorLang: true },
	{ code: "ja", nativeName: "日本語", icon: "🇯🇵", editorLang: true },
	{ code: "km", nativeName: "ខ្មែរ", icon: "🇰🇭", editorLang: true },
	{ code: "ko", nativeName: "한국어", icon: "🇰🇷", editorLang: true, siteLocale: true },
	{ code: "lv", nativeName: "Latviešu", icon: "🇱🇻", editorLang: true },
	{ code: "nl", nativeName: "Nederlands", icon: "🇳🇱", editorLang: true },
	{ code: "pl", nativeName: "Polski", icon: "🇵🇱", editorLang: true },
	{ code: "pt_br", nativeName: "Português (Brasil)", icon: "🇧🇷", editorLang: true },
	{ code: "ro", nativeName: "Română", icon: "🇷🇴", editorLang: true },
	{ code: "ru", nativeName: "Русский", icon: "🇷🇺", editorLang: true },
	{ code: "se", nativeName: "Svenska", icon: "🇸🇪", editorLang: true },
	{ code: "tr", nativeName: "Türkçe", icon: "🇹🇷", editorLang: true },
	{ code: "uk", nativeName: "Українська", icon: "🇺🇦", editorLang: true },
	{ code: "ur", nativeName: "اردو", icon: "🇵🇰", editorLang: true },
	{ code: "zh_cn", nativeName: "简体中文", icon: "🇨🇳", editorLang: true },
];

/** Site UI locale codes (for next-intl routing) */
export const localeCodes = languages.filter((l) => l.siteLocale).map((l) => l.code);

/** SunEditor language pack codes (for playground lang option) */
export const editorLangCodes = languages.filter((l) => l.editorLang).map((l) => l.code);

/** Get a language entry by code */
export function getLang(code: string) {
	return languages.find((l) => l.code === code);
}
