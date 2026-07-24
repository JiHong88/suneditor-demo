import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/docs-api",
		title: "API Documentation",
		description: "SunEditor API reference. Methods, properties, types, and interfaces for the editor instance and configuration.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
