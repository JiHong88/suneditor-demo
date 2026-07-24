import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/docs-api",
		title: "API Documentation",
		description: "SunEditor API reference. Methods, properties, types, and interfaces for the editor instance and configuration.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "API Documentation", path: "/docs-api" }]} />
			{children}
		</>
	);
}
