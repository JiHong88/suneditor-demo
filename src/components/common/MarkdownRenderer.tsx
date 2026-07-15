"use client";

import "github-markdown-css/github-markdown-light.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Link } from "@/i18n/navigation";
import { GUIDE_FILES } from "@/lib/git/githubMarkdown";
import CodeBlock from "./CodeBlock";

type Props = {
	content: string;
	className?: string;
};

/** filename without directory or .md extension */
function baseName(p: string): string {
	return (
		p
			.replace(/\.md$/i, "")
			.split("/")
			.pop() ?? ""
	);
}

/** Map relative .md paths to internal guide slugs */
function resolveHref(href: string): { internal: boolean; resolved: string } {
	const [pathPart, hash] = href.split("#");

	// Only relative .md doc links are candidates for internal mapping.
	// Handles ./x.md, ../x.md, ../guide/x.md, prompts/x.md, etc. by comparing basenames.
	if (/\.md$/i.test(pathPart)) {
		const bare = baseName(pathPart);
		for (const [slug, filePath] of Object.entries(GUIDE_FILES)) {
			if (bare === baseName(filePath)) {
				const route = slug === "" ? "/deep-dive/guide" : `/deep-dive/guide/${slug}`;
				return { internal: true, resolved: `${route}${hash ? `#${hash}` : ""}` };
			}
		}
	}

	// Anchor-only or external links pass through unchanged
	return { internal: false, resolved: href };
}

export default function MarkdownRenderer({ content, className }: Props) {
	return (
		<div className={`markdown-body !bg-transparent ${className ?? ""}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeRaw, rehypeSlug]}
				components={{
					a({ href, children }) {
						if (!href) return <span>{children}</span>;

						const { internal, resolved } = resolveHref(href);

						if (internal) {
							return <Link href={resolved}>{children}</Link>;
						}

						// Anchor links
						if (resolved.startsWith("#")) {
							return <a href={resolved}>{children}</a>;
						}

						// External links
						return (
							<a href={resolved} target='_blank' rel='noopener noreferrer'>
								{children}
							</a>
						);
					},
					code({ className: codeClassName, children, ...props }) {
						const match = /language-(\w+)/.exec(codeClassName || "");
						const codeStr = String(children).replace(/\n$/, "");

						// Inline code
						if (!match) {
							return (
								<code {...props}>
									{children}
								</code>
							);
						}

						// Fenced code block
						return <CodeBlock code={codeStr} lang={match[1]} className='rounded-md border my-4' />;
					},
					table({ children }) {
						return (
							<div className='overflow-x-auto my-4'>
								<table>{children}</table>
							</div>
						);
					},
					img({ src, alt }) {
						if (!src) return null;
						const s = String(src);
						// Resolve relative image paths to GitHub raw URL
						const resolvedSrc = s.startsWith("http")
							? s
							: `https://raw.githubusercontent.com/JiHong88/SunEditor/master/${s.replace(/^\.\//, "")}`;
						return (
							// eslint-disable-next-line @next/next/no-img-element
							<img
								src={resolvedSrc}
								alt={alt ?? ""}
								loading='lazy'
								className='max-w-full h-auto [content-visibility:auto] [contain-intrinsic-size:0_300px]'
							/>
						);
					},
				}}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
