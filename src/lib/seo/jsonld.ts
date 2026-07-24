import { SUNEDITOR_VERSION } from "@/store/version";
import { pageUrl } from "@/lib/seo/metadata";

const BASE_URL = "https://suneditor.com";
const GITHUB_URL = "https://github.com/JiHong88/SunEditor";
const NPM_URL = "https://www.npmjs.com/package/suneditor";
const AUTHOR = "Yi JiHong";

const DESCRIPTION =
	"A lightweight, plugin-based WYSIWYG editor built with vanilla JavaScript. Zero dependencies, 30+ plugins, TypeScript support.";

/** Stable @id anchors so the nodes can reference each other. */
const ORG_ID = `${BASE_URL}/#organization`;
const WEBSITE_ID = `${BASE_URL}/#website`;
const SOFTWARE_ID = `${BASE_URL}/#software`;

/** The SunEditor project as an Organization (site-wide). */
export function organizationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": ORG_ID,
		name: "SunEditor",
		url: BASE_URL,
		logo: `${BASE_URL}/se3_logo_title.svg`,
		description: DESCRIPTION,
		founder: { "@type": "Person", name: AUTHOR },
		sameAs: [GITHUB_URL, NPM_URL],
	};
}

/** The suneditor.com site itself (site-wide). */
export function webSiteSchema() {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		name: "SunEditor",
		url: BASE_URL,
		description: DESCRIPTION,
		inLanguage: "en",
		publisher: { "@id": ORG_ID },
	};
}

/**
 * Breadcrumb trail for a sub-page. Pass the trail *after* Home (e.g. Deep Dive → Guide →
 * Architecture); "Home" is prepended automatically. URLs are locale-aware.
 */
export function breadcrumbSchema(locale: string, trail: { name: string; path: string }[]) {
	const crumbs = [{ name: "Home", path: "" }, ...trail];
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: crumbs.map((c, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: c.name,
			item: pageUrl(locale, c.path),
		})),
	};
}

/** SunEditor the product — an open-source, browser-based developer tool (home page). */
export function softwareApplicationSchema() {
	return {
		"@context": "https://schema.org",
		"@type": ["SoftwareApplication", "WebApplication"],
		"@id": SOFTWARE_ID,
		name: "SunEditor",
		description: DESCRIPTION,
		url: BASE_URL,
		applicationCategory: "DeveloperApplication",
		applicationSubCategory: "WYSIWYG Editor",
		operatingSystem: "Web Browser",
		softwareVersion: SUNEDITOR_VERSION,
		downloadUrl: NPM_URL,
		softwareHelp: `${BASE_URL}/getting-started`,
		license: "https://opensource.org/licenses/MIT",
		programmingLanguage: "JavaScript",
		author: { "@type": "Person", name: AUTHOR },
		publisher: { "@id": ORG_ID },
		offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
		isAccessibleForFree: true,
		keywords: "wysiwyg, editor, rich text editor, javascript, html editor, open source",
		sameAs: [GITHUB_URL, NPM_URL],
	};
}
