import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/troubleshooting",
		title: "Troubleshooting",
		description:
			"Fix common SunEditor problems: window is not defined in Next.js SSR, missing styles, stripped tags and styles, paste formatting, S3 uploads, plugin errors, React StrictMode and v2 → v3 API changes.",
	});
}

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
	const { locale } = await params;
	return (
		<>
			<Breadcrumbs locale={locale} trail={[{ name: "Troubleshooting", path: "/troubleshooting" }]} />
			{children}
		</>
	);
}
