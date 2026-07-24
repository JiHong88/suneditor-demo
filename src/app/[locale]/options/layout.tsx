import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/options",
		title: "Options Reference",
		description: "Complete reference for 200+ SunEditor options. Editor options, frame options, and plugin-specific configuration.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "Options Reference", path: "/options" }]} />
			{children}
		</>
	);
}
