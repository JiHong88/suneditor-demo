import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/seo/jsonld";

/**
 * Emits a BreadcrumbList JSON-LD for a sub-page. Pass the trail after Home;
 * "Home" is prepended automatically. Renders no visible markup.
 */
export default function Breadcrumbs({ locale, trail }: { locale: string; trail: { name: string; path: string }[] }) {
	return <JsonLd data={breadcrumbSchema(locale, trail)} />;
}
