import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { SiteNav } from "@/components/layout/navigationMenu";
import Footer from "@/components/layout/footer";
import MicroBar from "@/components/layout/microBar";
import { getBootVersion } from "@/lib/git/releaseVersion";
import { fetchGitHubStars } from "@/lib/git/stars";
import "../globals.css";

const navigationItems = [
	{ label: "Getting Started", href: "/getting-started" },
	{ label: "Feature Demo", href: "/feature-demo" },
	{ label: "Playground", href: "/playground" },
	{ label: "Plugin Guide", href: "/plugin-guide" },
	{ label: "Deep Dive", href: "/deep-dive" },
	{ label: "Docs/API", href: "/docs" },
];

export default async function RootLayout({ children, locale }: Readonly<{ children: React.ReactNode; locale: string }>) {
	const version = (await getBootVersion().catch(() => null)) || "";
	const stars = await fetchGitHubStars().catch(() => undefined);

	return (
		<html suppressHydrationWarning lang={locale}>
			<head>
				<meta name='color-scheme' content='dark light' />
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
					<SiteNav items={navigationItems} />

					{/* Info bar */}
					<MicroBar stars={stars} className='sticky top-14' />

					{/* 메인 */}
					<main className='min-h-[60vh] bg-gradient-to-br from-slate-50 to-blue-50'>{children}</main>

					{/* 푸터 */}
					<Footer version={`v${version}`} />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
