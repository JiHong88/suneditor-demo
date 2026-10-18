import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/license",
		title: "MIT License — Free for Commercial Use",
		description:
			"SunEditor is MIT licensed: free for commercial products, SaaS and internal tools. No license key, account or per-load fee. Plain-language summary and full license text.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "License", path: "/license" }]} />
			{children}
		</>
	);
}
