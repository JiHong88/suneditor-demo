import { SUNEDITOR_REACT_VERSION, SUNEDITOR_VERSION } from "@/store/version";
import { pageUrl } from "@/lib/seo/metadata";
import { SITE_DESCRIPTION } from "@/lib/siteConfig";

const BASE_URL = "https://suneditor.com";
const GITHUB_URL = "https://github.com/JiHong88/SunEditor";
const NPM_URL = "https://www.npmjs.com/package/suneditor";
const REACT_NPM_URL = "https://www.npmjs.com/package/@suneditor/suneditor-react";
const REACT_GITHUB_URL = "https://github.com/suneditor/suneditor-react";
const AUTHOR = "Yi JiHong";

const DESCRIPTION = SITE_DESCRIPTION;

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
		keywords: "wysiwyg, wysiwyg editor, html editor, rich text editor, javascript, open source, mit, zero dependencies",
		sameAs: [GITHUB_URL, NPM_URL],
	};
}

/** The official React component package (`/react` page). */
export function reactPackageSchema(locale: string) {
	return {
		"@context": "https://schema.org",
		"@type": "SoftwareSourceCode",
		"@id": `${BASE_URL}/#suneditor-react`,
		name: "@suneditor/suneditor-react",
		alternateName: "SunEditor for React",
		description: "Official React component for SunEditor, the modular WYSIWYG HTML editor. Every editor option passes through unchanged; the engine loads on the client only, so it works in Next.js.",
		url: pageUrl(locale, "/react"),
		codeRepository: REACT_GITHUB_URL,
		downloadUrl: REACT_NPM_URL,
		version: SUNEDITOR_REACT_VERSION,
		programmingLanguage: "TypeScript",
		runtimePlatform: "React",
		license: "https://opensource.org/licenses/MIT",
		isAccessibleForFree: true,
		targetProduct: { "@id": SOFTWARE_ID },
		author: { "@type": "Person", name: AUTHOR },
		publisher: { "@id": ORG_ID },
		keywords: "react wysiwyg editor, react rich text editor, suneditor react, next.js editor",
		sameAs: [REACT_GITHUB_URL, REACT_NPM_URL],
	};
}

/** FAQ block (question/answer pairs rendered visibly on the same page). */
export function faqPageSchema(items: { q: string; a: string }[]) {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map(({ q, a }) => ({
			"@type": "Question",
			name: q,
			acceptedAnswer: { "@type": "Answer", text: a },
		})),
	};
}
