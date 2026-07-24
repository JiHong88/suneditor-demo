import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/deep-dive",
		title: "Deep Dive",
		description: "Advanced SunEditor guides: theme customization, upload configuration, event handling, and architecture overview.",
	});
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
