import type { Metadata } from "next";
import { defaultLocale } from "@/i18n/routing";
import { localeCodes } from "@/i18n/languages";

const BASE_URL = "https://suneditor.com";
const SITE_NAME = "SunEditor";

/** Fully-qualified page URL honoring the `as-needed` locale prefix (default locale has no prefix). */
export function pageUrl(locale: string, path: string): string {
	const prefix = locale === defaultLocale ? "" : `/${locale}`;
	return `${BASE_URL}${prefix}${path}`;
}

/** hreflang alternates for a path across every site locale (+ x-default → default locale). */
export function languageAlternates(path: string): Record<string, string> {
	const languages: Record<string, string> = {};
	for (const code of localeCodes) {
		languages[code] = pageUrl(code, path);
	}
	languages["x-default"] = pageUrl(defaultLocale, path);
	return languages;
}

/** URL of the dynamically-generated Open Graph card for a given title/description. */
export function ogImageUrl(title: string, description: string): string {
	const params = new URLSearchParams({ title, desc: description });
	return `${BASE_URL}/og?${params.toString()}`;
}

/**
 * Build per-page metadata: unique title, description, canonical URL, and a
 * dynamic Open Graph / Twitter card. Use inside `generateMetadata` so the
 * canonical + og:url reflect the current locale.
 */
export function buildPageMetadata({
	locale,
	path,
	title,
	description,
	absoluteTitle = false,
	cardTitle,
	cardDescription,
}: {
	locale: string;
	path: string;
	title: string;
	description: string;
	/** When true, use `title` verbatim (no `| SunEditor` template) — for the home page. */
	absoluteTitle?: boolean;
	/** Override the big title rendered on the OG card (defaults to `title`). */
	cardTitle?: string;
	/** Override the subtitle rendered on the OG card (defaults to `description`). */
	cardDescription?: string;
}): Metadata {
	const url = pageUrl(locale, path);
	const ogTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
	const imageUrl = ogImageUrl(cardTitle ?? title, cardDescription ?? description);
	const image = { url: imageUrl, width: 1200, height: 630, alt: title };

	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		alternates: { canonical: url, languages: languageAlternates(path) },
		openGraph: {
			type: "website",
			siteName: SITE_NAME,
			title: ogTitle,
			description,
			url,
			images: [image],
		},
		twitter: {
			card: "summary_large_image",
			title: ogTitle,
			description,
			images: [image.url],
		},
	};
}
