import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/feature-demo",
		title: "Feature Demo",
		description: "Explore 30+ features of SunEditor including text formatting, image upload, tables, math formulas, RTL support, and more.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "Feature Demo", path: "/feature-demo" }]} />
			{children}
		</>
	);
}
