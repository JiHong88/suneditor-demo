import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/feature-demo",
		title: "Feature Demo",
		description: "Explore 30+ features of SunEditor including text formatting, image upload, tables, math formulas, RTL support, and more.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
