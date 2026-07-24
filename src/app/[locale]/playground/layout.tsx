import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/playground",
		title: "Playground",
		description: "Interactive SunEditor playground. Customize plugins, themes, toolbar, and editor options in real-time. Share configurations via URL.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
