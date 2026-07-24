import type { MetadataRoute } from "next";
import { defaultLocale } from "@/i18n/routing";
import { GUIDE_SUB_SLUGS } from "@/lib/git/githubMarkdown";
import { languageAlternates } from "@/lib/seo/metadata";

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
