import React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { SiteNav } from "@/components/layout/navigationMenu";
import Footer from "@/components/layout/footer";
import MicroBar from "@/components/layout/microBar";
import { SUNEDITOR_VERSION } from "@/store/version";
import { getDir } from "@/i18n/lang";
import { getLocale } from "next-intl/server";
import { TopBanner, FooterBanner } from "@/components/ad/AdBanner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

export const metadata: Metadata = {
	metadataBase: new URL("https://suneditor.com"),
	title: {
		default: "SunEditor — Lightweight WYSIWYG Editor",
		template: "%s | SunEditor",
	},
	description: "A lightweight, plugin-based WYSIWYG editor built with vanilla JavaScript. Zero dependencies, 30+ plugins, TypeScript support.",
	keywords: ["wysiwyg", "editor", "javascript", "rich text editor", "suneditor", "text editor", "html editor"],
	authors: [{ name: "JiHong88" }],
	creator: "JiHong88",
	openGraph: {
		type: "website",
		siteName: "SunEditor",
		title: "SunEditor — Lightweight WYSIWYG Editor",
		description: "A lightweight, plugin-based WYSIWYG editor built with vanilla JavaScript. Zero dependencies, 30+ plugins, TypeScript support.",
		url: "https://suneditor.com",
		images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SunEditor" }],
	},
	twitter: {
		card: "summary_large_image",
		title: "SunEditor — Lightweight WYSIWYG Editor",
		description: "A lightweight, plugin-based WYSIWYG editor built with vanilla JavaScript. Zero dependencies, 30+ plugins, TypeScript support.",
		images: ["/og-image.png"],
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
		],
		apple: "/apple-touch-icon.png",
	},
	manifest: "/site.webmanifest",
};

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
	const version = SUNEDITOR_VERSION;
	const { locale } = await params;
	const resolvedLocale = locale || (await getLocale());

	return (
		<html suppressHydrationWarning lang={resolvedLocale} dir={getDir(resolvedLocale)} data-lang={resolvedLocale}>
			<head>
				<meta name='color-scheme' content='dark light' />
				<meta name="theme-color" content="#f4b124" media="(prefers-color-scheme: light)" />
				<meta name="theme-color" content="#253445" media="(prefers-color-scheme: dark)" />
				<script id='theme-init'>
					{`(function(){
					try {
					var t = localStorage.getItem('theme');
					if (!t || t === 'system') {
						t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
					}
					document.documentElement.classList.toggle('dark', t === 'dark');
					} catch (_) {}
				})();`}
				</script>
			</head>

			<body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
				<NextIntlClientProvider>
					{/* 네비게이션 */}
					<SiteNav />

					{/* Info bar */}
					<MicroBar className='sticky top-14' />

					{/* 상단 광고 배너 */}
					<TopBanner />

					{/* 메인 */}
					<main className='min-h-[60vh] bg-gradient-to-br from-amber-50/50 via-orange-50/20 to-blue-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900'>
						{children}
					</main>

					{/* 하단 광고 배너 */}
					<FooterBanner />

					{/* 푸터 */}
					<Footer version={`v${version}`} />
				</NextIntlClientProvider>
				<Analytics />
				<SpeedInsights />
			</body>
		</html>
	);
}
