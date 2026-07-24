import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/plugin-guide",
		title: "Plugin Guide",
		description: "Complete guide to SunEditor's plugin system. Built-in plugins, display types, and how to create custom plugins.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
