import type { ReactNode } from "react";

export type LanguageEntry = {
	/** BCP 47 locale code — used for routing, file names, URLs */
	code: string;
	/** SunEditor lang pack code — only set when different from `code` (e.g. "zh_cn" vs "zh-CN") */
	editorCode?: string;
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
 * All entries with editorLang are also siteLocale (site supports all SunEditor languages).
 * `code` is BCP 47 compliant. `editorCode` maps to suneditor lang file when different.
 */
export const languages: LanguageEntry[] = [
	{ code: "ar", nativeName: "العربية", icon: "🇸🇦", editorLang: true, siteLocale: true },
	{ code: "ckb", nativeName: "کوردیی سۆرانی", icon: "🇮🇶", editorLang: true, siteLocale: true },
	{ code: "cs", nativeName: "Čeština", icon: "🇨🇿", editorLang: true, siteLocale: true },
	{ code: "da", nativeName: "Dansk", icon: "🇩🇰", editorLang: true, siteLocale: true },
	{ code: "de", nativeName: "Deutsch", icon: "🇩🇪", editorLang: true, siteLocale: true },
	{ code: "en", nativeName: "English", icon: "🇺🇸", editorLang: true, siteLocale: true },
	{ code: "es", nativeName: "Español", icon: "🇪🇸", editorLang: true, siteLocale: true },
	{ code: "fa", nativeName: "فارسی", icon: "🇮🇷", editorLang: true, siteLocale: true },
	{ code: "fr", nativeName: "Français", icon: "🇫🇷", editorLang: true, siteLocale: true },
	{ code: "he", nativeName: "עברית", icon: "🇮🇱", editorLang: true, siteLocale: true },
	{ code: "hu", nativeName: "Magyar", icon: "🇭🇺", editorLang: true, siteLocale: true },
	{ code: "it", nativeName: "Italiano", icon: "🇮🇹", editorLang: true, siteLocale: true },
	{ code: "ja", nativeName: "日本語", icon: "🇯🇵", editorLang: true, siteLocale: true },
	{ code: "km", nativeName: "ខ្មែរ", icon: "🇰🇭", editorLang: true, siteLocale: true },
	{ code: "ko", nativeName: "한국어", icon: "🇰🇷", editorLang: true, siteLocale: true },
	{ code: "lv", nativeName: "Latviešu", icon: "🇱🇻", editorLang: true, siteLocale: true },
	{ code: "nl", nativeName: "Nederlands", icon: "🇳🇱", editorLang: true, siteLocale: true },
	{ code: "pl", nativeName: "Polski", icon: "🇵🇱", editorLang: true, siteLocale: true },
	{ code: "pt-BR", editorCode: "pt_br", nativeName: "Português (Brasil)", icon: "🇧🇷", editorLang: true, siteLocale: true },
	{ code: "ro", nativeName: "Română", icon: "🇷🇴", editorLang: true, siteLocale: true },
	{ code: "ru", nativeName: "Русский", icon: "🇷🇺", editorLang: true, siteLocale: true },
	{ code: "sv", editorCode: "se", nativeName: "Svenska", icon: "🇸🇪", editorLang: true, siteLocale: true },
	{ code: "tr", nativeName: "Türkçe", icon: "🇹🇷", editorLang: true, siteLocale: true },
	{ code: "uk", nativeName: "Українська", icon: "🇺🇦", editorLang: true, siteLocale: true },
	{ code: "ur", nativeName: "اردو", icon: "🇵🇰", editorLang: true, siteLocale: true },
	{ code: "zh-CN", editorCode: "zh_cn", nativeName: "简体中文", icon: "🇨🇳", editorLang: true, siteLocale: true },
];

/** Site UI locale codes — BCP 47 (for next-intl routing) */
export const localeCodes = languages.filter((l) => l.siteLocale).map((l) => l.code);

/** SunEditor language pack codes (for editor lang option) */
export const editorLangCodes = languages.filter((l) => l.editorLang).map((l) => l.editorCode ?? l.code);

/** Convert BCP 47 locale → suneditor lang code */
export function toEditorCode(locale: string): string {
	const entry = languages.find((l) => l.code === locale);
	return entry?.editorCode ?? locale;
}

/** Convert suneditor lang code → BCP 47 locale */
export function toLocaleCode(editorCode: string): string {
	const entry = languages.find((l) => l.editorCode === editorCode);
	return entry?.code ?? editorCode;
}

/** Get a language entry by code (BCP 47 or editor code) */
export function getLang(code: string) {
	return languages.find((l) => l.code === code || l.editorCode === code);
}
