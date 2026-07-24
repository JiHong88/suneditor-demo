import type { MetadataRoute } from "next";
import { localeCodes } from "@/i18n/languages";
import { defaultLocale } from "@/i18n/routing";
import { GUIDE_SUB_SLUGS } from "@/lib/git/githubMarkdown";

const BASE_URL = "https://suneditor.com";

/** Public, indexable page paths (without locale prefix). "" is the home page. */
const STATIC_PATHS = [
	"",
	"/getting-started",
	"/options",
	"/feature-demo",
	"/playground",
	"/plugin-guide",
	"/docs-api",
	"/migration",
	"/deep-dive",
	"/deep-dive/guide",
	...GUIDE_SUB_SLUGS.map((slug) => `/deep-dive/guide/${slug}`),
];

/** Build a fully-qualified URL for a locale + path, honoring the `as-needed` prefix strategy. */
function localizedUrl(locale: string, path: string): string {
	const prefix = locale === defaultLocale ? "" : `/${locale}`;
	return `${BASE_URL}${prefix}${path}`;
}

/** hreflang alternates for a given path across every site locale (+ x-default). */
function languageAlternates(path: string): Record<string, string> {
	const languages: Record<string, string> = {};
	for (const locale of localeCodes) {
		languages[locale] = localizedUrl(locale, path);
	}
	languages["x-default"] = localizedUrl(defaultLocale, path);
	return languages;
}

function priorityFor(path: string): number {
	if (path === "") return 1;
	if (path.startsWith("/deep-dive/guide/")) return 0.6;
	return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
	const lastModified = new Date();

	return STATIC_PATHS.map((path) => ({
		url: localizedUrl(defaultLocale, path),
		lastModified,
		changeFrequency: "weekly",
		priority: priorityFor(path),
		alternates: {
			languages: languageAlternates(path),
		},
	}));
}
