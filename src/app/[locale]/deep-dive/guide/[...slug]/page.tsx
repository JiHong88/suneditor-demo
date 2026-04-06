import { notFound } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { fetchGitHubMarkdown, resolveGuideSlug, GUIDE_SUB_SLUGS, GUIDE_FILES } from "@/lib/git/githubMarkdown";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import ScrollToTop from "@/components/common/ScrollToTop";
import type { Metadata } from "next";

const TITLES: Record<string, string> = {
	architecture: "Architecture",
	"external-libraries": "External Libraries",
	"changes-guide": "Changes Guide",
	"custom-plugin": "Custom Plugin",
	"typedef-guide": "TypeDef Guide",
};

type Props = {
	params: Promise<{ locale: string; slug: string[] }>;
};

export async function generateStaticParams() {
	return GUIDE_SUB_SLUGS.map((s) => ({ slug: s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const key = slug.join("/");
	const title = TITLES[key] ?? key;
	return {
		title: `${title} — Deep Dive`,
		description: `SunEditor ${title} — technical reference from the official repository.`,
	};
}

export default async function GuideSubPage({ params }: Props) {
	const { slug, locale } = await params;
	const key = resolveGuideSlug(slug);
	if (key === undefined) notFound();

	const content = await fetchGitHubMarkdown(key);
	if (!content) notFound();

	const githubPath = GUIDE_FILES[key];
	const title = TITLES[key] ?? key;

	return (
		<div className='min-h-screen'>
			<div className='container mx-auto max-w-4xl px-6 py-10'>
				<div className='flex items-center justify-between mb-8'>
					<Link
						href={`/${locale}/deep-dive/guide`}
						className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
					>
						<ArrowLeft className='size-4' />
						Guide
					</Link>
					<a
						href={`https://github.com/JiHong88/SunEditor/blob/master/${githubPath}`}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
					>
						<Github className='size-3.5' />
						{title}
						<ExternalLink className='size-3' />
					</a>
				</div>

				<MarkdownRenderer content={content} />
			</div>
			<ScrollToTop />
		</div>
	);
}
