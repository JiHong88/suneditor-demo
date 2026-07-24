import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import JsonLd from "@/components/seo/JsonLd";
import { softwareApplicationSchema } from "@/lib/seo/jsonld";
import HomePage from "./HomePage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "",
		title: "SunEditor — Lightweight WYSIWYG Editor",
		description:
			"A lightweight, plugin-based WYSIWYG editor built with vanilla JavaScript. Zero dependencies, 30+ plugins, TypeScript support.",
		absoluteTitle: true,
		cardTitle: "SunEditor",
		cardDescription: "Lightweight WYSIWYG editor — zero dependencies, 30+ plugins, TypeScript support.",
	});
}

export default function Page() {
	return (
		<>
			<JsonLd data={softwareApplicationSchema()} />
			<HomePage />
		</>
	);
}
