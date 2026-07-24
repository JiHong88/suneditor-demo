import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/migration",
		title: "v2 → v3 Migration",
		description: "Migrate from SunEditor v2 to v3. Interactive option converter, breaking changes guide, and button name mapping.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "v2 → v3 Migration", path: "/migration" }]} />
			{children}
		</>
	);
}
