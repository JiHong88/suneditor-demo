import { notFound } from "next/navigation";
import { ArrowLeft, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { fetchGitHubMarkdown } from "@/lib/git/githubMarkdown";
import MarkdownRenderer from "@/components/common/MarkdownRenderer";
import ScrollToTop from "@/components/common/ScrollToTop";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Guide — Deep Dive",
	description: "SunEditor technical guide — architecture, conventions, and development workflow.",
};

type Props = {
	params: Promise<{ locale: string }>;
};

export default async function GuidePage({ params }: Props) {
	const { locale } = await params;
	const content = await fetchGitHubMarkdown("");
	if (!content) notFound();

	return (
		<div className='min-h-screen'>
			<div className='container mx-auto max-w-4xl px-6 py-10'>
				<div className='flex items-center justify-between mb-8'>
					<Link
						href={`/${locale}/deep-dive`}
						className='inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors'
					>
						<ArrowLeft className='size-4' />
						Deep Dive
					</Link>
					<a
						href='https://github.com/JiHong88/SunEditor/blob/master/GUIDE.md'
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
					>
						<Github className='size-3.5' />
						View on GitHub
						<ExternalLink className='size-3' />
					</a>
				</div>

				<MarkdownRenderer content={content} />
			</div>
			<ScrollToTop />
		</div>
	);
}
