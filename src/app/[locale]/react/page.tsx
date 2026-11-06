import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ExternalLink, Github, Package } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { buildPageMetadata } from "@/lib/seo/metadata";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import ScrollToTop from "@/components/common/ScrollToTop";
import { REACT_WRAPPER_NPM, REACT_WRAPPER_REPO } from "@/lib/git/githubMarkdown";
import { getReactGuide } from "@/lib/reactGuide";
import { SUNEDITOR_REACT_VERSION } from "@/store/version";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { locale } = await params;
	return buildPageMetadata({
		locale,
		path: "/react",
		title: "React",
		description: "Use SunEditor in React and Next.js with @suneditor/suneditor-react: install, props, controlled value, events, multi-root and instance access.",
	});
}

/**
 * React wrapper guide. The body is the package README rendered from GitHub (same approach as the
 * Deep Dive guides), so it never goes stale against the published docs.
 */
export default async function ReactGuidePage({ params }: Props) {
	const { locale } = await params;
	// Static rendering: without this next-intl reads the locale from request headers and the page becomes dynamic.
	setRequestLocale(locale);
	const t = await getTranslations({ locale, namespace: "ReactGuide" });
	const readme = await getReactGuide(locale);

	return (
		<div className='min-h-screen'>
			<Breadcrumbs locale={locale} trail={[{ name: "React", path: "/react" }]} />

			<section className='container mx-auto max-w-4xl px-6 pt-12 pb-8'>
				<div className='flex flex-wrap items-center gap-3'>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<span className='rounded-full border border-sky-300 bg-sky-50 px-2.5 py-0.5 font-mono text-xs text-sky-700 dark:border-sky-400/30 dark:bg-sky-400/10 dark:text-sky-300'>
						v{SUNEDITOR_REACT_VERSION}
					</span>
				</div>
				<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>

				<div className='mt-6 flex flex-wrap items-center gap-3 text-sm'>
					<a href={REACT_WRAPPER_NPM} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground'>
						<Package className='size-4' />
						npm
						<ExternalLink className='size-3' />
					</a>
					<a href={REACT_WRAPPER_REPO} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground'>
						<Github className='size-4' />
						GitHub
						<ExternalLink className='size-3' />
					</a>
					<Link
						href='/playground'
						className='inline-flex items-center gap-1.5 rounded-lg border border-blue-300 bg-blue-50 px-3 py-1.5 font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-300 dark:hover:bg-blue-400/15'
					>
						{t("playgroundCta")}
						<ArrowRight className='size-3.5' />
					</Link>
				</div>

				<p className='mt-6 border-t pt-4 text-xs text-muted-foreground'>{t("readmeNote")}</p>
			</section>

			<section className='container mx-auto max-w-4xl px-6 pb-20'>
				{readme ? (
					<MarkdownRenderer content={readme} />
				) : (
					<p className='rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200'>{t("unavailable")}</p>
				)}
			</section>
			<ScrollToTop />
		</div>
	);
}
