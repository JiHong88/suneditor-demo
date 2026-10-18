"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ExternalLink, Link2, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import CodeBlock from "@/components/common/CodeBlock";
import type { TroubleshootingCategory } from "@/data/troubleshooting";

const ISSUES_NEW_URL = "https://github.com/JiHong88/SunEditor/issues/new";
const PAGE_URL = "https://suneditor.com/troubleshooting";

export type ResolvedItem = {
	id: string;
	category: TroubleshootingCategory;
	title: string;
	symptom: string;
	cause: string;
	fix: string;
	code: { code: string; lang: string }[];
	related?: { href: string; label: string };
};

export type ListLabels = {
	contents: string;
	symptom: string;
	cause: string;
	fix: string;
	searchLabel: string;
	searchPlaceholder: string;
	all: string;
	categories: Record<TroubleshootingCategory, string>;
	noResults: string;
	helpful: string;
	yes: string;
	no: string;
	thanks: string;
	stillStuck: string;
	openPrefilledIssue: string;
	copyPermalink: string;
	copied: string;
};

type Props = {
	items: ResolvedItem[];
	categories: TroubleshootingCategory[];
	labels: ListLabels;
	version: string;
};

/** GitHub "new issue" URL with the environment pre-filled (mirrors the repo's bug report template). */
export function prefilledIssueUrl(version: string, userAgent: string, sectionId?: string) {
	const body = [
		"**Describe the problem**",
		"",
		"",
		"**Troubleshooting section checked**",
		sectionId ? `${PAGE_URL}#${sectionId}` : "(none)",
		"",
		"**To Reproduce**",
		"Playground link (configure the editor at https://suneditor.com/playground and share the URL):",
		"",
		"**Environment**",
		`- SunEditor: ${version}`,
		`- Browser: ${userAgent || ""}`,
		"- Framework (vanilla, React, Vue, Next.js, …):",
	].join("\n");
	return `${ISSUES_NEW_URL}?${new URLSearchParams({ body }).toString()}`;
}

function track(id: string, helpful: boolean) {
	const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
	gtag?.("event", "troubleshooting_feedback", { item: id, helpful });
}

export default function TroubleshootingList({ items, categories, labels, version }: Props) {
	const [query, setQuery] = useState("");
	const [category, setCategory] = useState<TroubleshootingCategory | "all">("all");
	const [copiedId, setCopiedId] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<Record<string, "yes" | "no">>({});
	// navigator is browser-only — fill it in after mount so SSR markup stays stable.
	const [userAgent, setUserAgent] = useState("");
	useEffect(() => setUserAgent(navigator.userAgent), []);

	const visible = useMemo(() => {
		const q = query.trim().toLowerCase();
		return items.filter((it) => {
			if (category !== "all" && it.category !== category) return false;
			if (!q) return true;
			const haystack = [it.id, it.title, it.symptom, it.cause, it.fix, ...it.code.map((c) => c.code)].join("\n").toLowerCase();
			return q.split(/\s+/).every((word) => haystack.includes(word));
		});
	}, [items, query, category]);

	const groups = categories.map((cat) => ({ cat, items: visible.filter((it) => it.category === cat) })).filter((g) => g.items.length > 0);

	const copyLink = (id: string) => {
		navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
		setCopiedId(id);
		setTimeout(() => setCopiedId((cur) => (cur === id ? null : cur)), 1500);
	};

	const answer = (id: string, helpful: boolean) => {
		setFeedback((prev) => ({ ...prev, [id]: helpful ? "yes" : "no" }));
		track(id, helpful);
	};

	return (
		<>
			{/* Search + category filter */}
			<div className='space-y-3'>
				<label className='relative block'>
					<span className='sr-only'>{labels.searchLabel}</span>
					<Search className='pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
					<input
						type='search'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder={labels.searchPlaceholder}
						className='w-full rounded-lg border bg-background py-2.5 pe-3 ps-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40'
					/>
				</label>
				<div className='flex flex-wrap gap-2'>
					{(["all", ...categories] as const).map((cat) => (
						<button
							key={cat}
							type='button'
							onClick={() => setCategory(cat)}
							aria-pressed={category === cat}
							className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
								category === cat ? "border-primary bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
							}`}
						>
							{cat === "all" ? labels.all : labels.categories[cat]}
						</button>
					))}
				</div>
			</div>

			{groups.length === 0 ? (
				<p className='mt-10 text-center text-sm text-muted-foreground'>{labels.noResults}</p>
			) : (
				<>
					{/* Table of contents (follows the filter) */}
					<nav aria-label={labels.contents} className='mt-6 rounded-lg border bg-card p-5'>
						<h2 className='text-sm font-semibold'>{labels.contents}</h2>
						<div className='mt-3 grid gap-x-8 gap-y-4 sm:grid-cols-2'>
							{groups.map(({ cat, items: groupItems }) => (
								<div key={cat}>
									<h3 className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>{labels.categories[cat]}</h3>
									<ul className='mt-1.5 space-y-1 text-sm'>
										{groupItems.map((it) => (
											<li key={it.id}>
												<a href={`#${it.id}`} className='text-muted-foreground hover:text-foreground hover:underline'>
													{it.title}
												</a>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
					</nav>

					{groups.map(({ cat, items: groupItems }) => (
						<div key={cat} className='mt-14'>
							<h2 className='border-b pb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground'>{labels.categories[cat]}</h2>
							<div className='mt-8 space-y-14'>
								{groupItems.map((it) => (
									<section key={it.id} id={it.id} className='scroll-mt-28'>
										<div className='group/title flex items-start gap-2'>
											<h3 className='text-xl font-semibold'>
												<a href={`#${it.id}`} className='hover:underline'>
													{it.title}
												</a>
											</h3>
											<button
												type='button'
												onClick={() => copyLink(it.id)}
												title={copiedId === it.id ? labels.copied : labels.copyPermalink}
												aria-label={labels.copyPermalink}
												className='mt-1 rounded-md p-1.5 text-muted-foreground opacity-60 transition hover:bg-muted hover:opacity-100 group-hover/title:opacity-100'
											>
												{copiedId === it.id ? <Check className='size-4 text-green-600' /> : <Link2 className='size-4' />}
											</button>
										</div>
										<dl className='mt-4 space-y-3 text-sm leading-relaxed'>
											<div>
												<dt className='font-medium'>{labels.symptom}</dt>
												<dd className='mt-0.5 text-muted-foreground'>{it.symptom}</dd>
											</div>
											<div>
												<dt className='font-medium'>{labels.cause}</dt>
												<dd className='mt-0.5 text-muted-foreground'>{it.cause}</dd>
											</div>
											<div>
												<dt className='font-medium'>{labels.fix}</dt>
												<dd className='mt-0.5 text-muted-foreground'>{it.fix}</dd>
											</div>
										</dl>
										<div className='mt-4 space-y-3'>
											{it.code.map((c, i) => (
												<CodeBlock key={i} code={c.code} lang={c.lang} className='overflow-hidden rounded-lg border' />
											))}
										</div>
										<div className='mt-4 flex flex-wrap items-center justify-between gap-3 text-sm'>
											{it.related ? (
												<Link href={it.related.href} className='inline-flex items-center gap-1.5 font-medium text-primary hover:underline'>
													{it.related.label}
													<ArrowRight className='h-3.5 w-3.5' />
												</Link>
											) : (
												<span />
											)}
											<div className='flex items-center gap-2 text-muted-foreground'>
												{feedback[it.id] === "yes" ? (
													<span>{labels.thanks}</span>
												) : feedback[it.id] === "no" ? (
													<span className='flex flex-wrap items-center gap-1.5'>
														{labels.stillStuck}
														<a
															href={prefilledIssueUrl(version, userAgent, it.id)}
															target='_blank'
															rel='noopener noreferrer'
															className='inline-flex items-center gap-1 font-medium text-primary hover:underline'
														>
															{labels.openPrefilledIssue}
															<ExternalLink className='h-3.5 w-3.5' />
														</a>
													</span>
												) : (
													<>
														<span>{labels.helpful}</span>
														<button type='button' onClick={() => answer(it.id, true)} className='rounded-md border px-2.5 py-0.5 text-xs hover:bg-muted'>
															{labels.yes}
														</button>
														<button type='button' onClick={() => answer(it.id, false)} className='rounded-md border px-2.5 py-0.5 text-xs hover:bg-muted'>
															{labels.no}
														</button>
													</>
												)}
											</div>
										</div>
									</section>
								))}
							</div>
						</div>
					))}
				</>
			)}
		</>
	);
}

/** Bottom "not listed" call-to-action — a client island so the issue link can include the user agent. */
export function PrefilledIssueLink({ version, label }: { version: string; label: string }) {
	const [userAgent, setUserAgent] = useState("");
	useEffect(() => setUserAgent(navigator.userAgent), []);
	return (
		<a
			href={prefilledIssueUrl(version, userAgent)}
			target='_blank'
			rel='noopener noreferrer'
			className='inline-flex items-center gap-1.5 font-medium text-primary hover:underline'
		>
			{label}
			<ExternalLink className='h-3.5 w-3.5' />
		</a>
	);
}
