import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/plugin-guide",
		title: "Plugin Guide",
		description: "Complete guide to SunEditor's plugin system. Built-in plugins, display types, and how to create custom plugins.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "Plugin Guide", path: "/plugin-guide" }]} />
			{children}
		</>
	);
}
