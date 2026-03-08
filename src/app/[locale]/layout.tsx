import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { SiteNav } from "@/components/layout/navigationMenu";
import Footer from "@/components/layout/footer";
import MicroBar from "@/components/layout/microBar";
import { SUNEDITOR_VERSION } from "@/store/version";
import { getDir } from "@/i18n/lang";
import { getLocale } from "next-intl/server";
import "../globals.css";

export default async function RootLayout({
	children,
	locale,
}: Readonly<{ children: React.ReactNode; locale: string }>) {
	const version = SUNEDITOR_VERSION;
	const resolvedLocale = locale || (await getLocale());

	return (
		<html suppressHydrationWarning lang={resolvedLocale} dir={getDir(resolvedLocale)} data-lang={resolvedLocale}>
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

			<body
				style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
			>
				<NextIntlClientProvider>
					{/* 네비게이션 */}
					<SiteNav />

					{/* Info bar */}
					<MicroBar className='sticky top-14' />

					{/* 메인 */}
					<main className='min-h-[60vh] bg-gradient-to-br from-amber-50/50 via-orange-50/20 to-blue-50/80 dark:from-zinc-950 dark:via-zinc-900 dark:to-slate-900'>
						{children}
					</main>

					{/* 푸터 */}
					<Footer version={`v${version}`} />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
