import { use } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_CARD_DESCRIPTION } from "@/lib/siteConfig";
import JsonLd from "@/components/seo/JsonLd";
import { softwareApplicationSchema } from "@/lib/seo/jsonld";
import HomePage from "./HomePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "",
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		absoluteTitle: true,
		cardTitle: "SunEditor",
		cardDescription: SITE_CARD_DESCRIPTION,
	});
}

export default function Page({ params }: { params: Promise<{ locale: string }> }) {
	setRequestLocale(use(params).locale);
	return (
		<>
			<JsonLd data={softwareApplicationSchema()} />
			<HomePage />
		</>
	);
}
