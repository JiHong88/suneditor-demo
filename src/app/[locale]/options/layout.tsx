import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/options",
		title: "Options Reference",
		description: "Complete reference for 200+ SunEditor options. Editor options, frame options, and plugin-specific configuration.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
