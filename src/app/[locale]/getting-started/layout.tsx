import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/getting-started",
		title: "Getting Started",
		description: "Install SunEditor via NPM or CDN and integrate with React, Vue, Angular, and more. Step-by-step guide with code examples.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
