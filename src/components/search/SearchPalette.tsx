"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Braces, CornerDownLeft, FileText, LifeBuoy, Loader2, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { groupResults, queryWords, searchSite, type SearchSource, type SourcedEntry, type StaticSearchIndex } from "@/lib/search/siteSearch";
import { TROUBLESHOOTING_ITEMS } from "@/data/troubleshooting";
import { FEATURE_CATEGORIES } from "@/data/snippets/featureDemoCategories";
import { FEATURE_PLAYGROUND_LINKS } from "@/app/[locale]/feature-demo/_lib/featurePlaygroundLinks";

const SOURCE_ICONS: Record<SearchSource, LucideIcon> = {
	pages: FileText,
	troubleshooting: LifeBuoy,
	features: Sparkles,
	options: SlidersHorizontal,
	api: Braces,
};

const indexCache = new Map<string, StaticSearchIndex>();

async function loadIndex(locale: string): Promise<StaticSearchIndex> {
	const cached = indexCache.get(locale);
	if (cached) return cached;
	let mod: { default?: StaticSearchIndex } & StaticSearchIndex;
	try {
		// webpack creates a chunk per matching file in the directory
		mod = await import(`@/data/search/search-index.${locale}.json`);
	} catch {
		mod = await import("@/data/search/search-index.en.json");
	}
	const data = (mod.default ?? mod) as StaticSearchIndex;
	indexCache.set(locale, data);
	return data;
}

/** Pages, troubleshooting and features — built from messages so they follow the current locale. */
function useMessageEntries(): SourcedEntry[] {
	const t = useTranslations();
	return React.useMemo(() => {
		const menu = (key: string) => t(`Main.Menus.${key}`);
		const pages: SourcedEntry[] = [
			{ t: menu("getting-started"), d: t("GettingStarted.desc"), u: "/getting-started" },
			{ t: menu("feature-demo"), d: t("FeatureDemo.subtitle"), u: "/feature-demo" },
			{ t: menu("playground"), d: t("Playground.desc"), u: "/playground" },
			{ t: menu("plugin-guide"), d: t("PluginGuide.subtitle1"), u: "/plugin-guide" },
			...(["deep-dive", "troubleshooting", "migration", "options", "docs-api"] as const).map((key) => ({
				t: menu(key),
				d: t(`Main.MenuDesc.${key}`),
				u: `/${key}`,
			})),
			{ t: t("License.title"), d: t("License.subtitle"), u: "/license" },
		].map((e) => ({ ...e, source: "pages" as const }));

		const troubleshooting: SourcedEntry[] = TROUBLESHOOTING_ITEMS.map(({ id }) => ({
			source: "troubleshooting",
			t: t(`Troubleshooting.items.${id}.title`),
			d: t(`Troubleshooting.items.${id}.symptom`),
			k: id,
			u: `/troubleshooting#${id}`,
		}));

		const features: SourcedEntry[] = FEATURE_CATEGORIES.flatMap((cat) =>
			cat.features.map((key) => {
				const link = FEATURE_PLAYGROUND_LINKS[key];
				return {
					source: "features" as const,
					t: t(`FeatureDemo.features.${key}`),
					d: t(`FeatureDemo.features.${key}Desc`),
					g: t(`FeatureDemo.categories.${cat.key}`),
					u: link ? `/playground?${link.query}#editor` : "/feature-demo",
				};
			}),
		);

		return [...pages, ...troubleshooting, ...features];
	}, [t]);
}

/** Highlight each query word's first occurrence in the title. */
function Highlight({ text, words }: { text: string; words: string[] }) {
	const lower = text.toLowerCase();
	const ranges: [number, number][] = [];
	for (const w of words) {
		const i = lower.indexOf(w);
		if (i >= 0) ranges.push([i, i + w.length]);
	}
	if (ranges.length === 0) return <>{text}</>;
	ranges.sort((a, b) => a[0] - b[0]);
	const parts: React.ReactNode[] = [];
	let pos = 0;
	for (const [start, end] of ranges) {
		if (start < pos) continue;
		if (start > pos) parts.push(text.slice(pos, start));
		parts.push(
			<mark key={start} className='rounded-sm bg-primary/15 text-inherit'>
				{text.slice(start, end)}
			</mark>,
		);
		pos = end;
	}
	parts.push(text.slice(pos));
	return <>{parts}</>;
}

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export default function SearchPalette({ open, onOpenChange }: Props) {
	const t = useTranslations("Search");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();
	const messageEntries = useMessageEntries();

	const [index, setIndex] = React.useState<StaticSearchIndex | null>(() => indexCache.get(locale) ?? null);
	const [query, setQuery] = React.useState("");
	const [active, setActive] = React.useState(0);
	const listRef = React.useRef<HTMLDivElement>(null);
	const listId = React.useId();

	React.useEffect(() => {
		let cancelled = false;
		loadIndex(locale).then((data) => !cancelled && setIndex(data));
		return () => {
			cancelled = true;
		};
	}, [locale]);

	const allEntries = React.useMemo<SourcedEntry[]>(() => {
		if (!index) return messageEntries;
		return [
			...messageEntries,
			...index.options.map((e) => ({ ...e, source: "options" as const })),
			...index.api.map((e) => ({ ...e, source: "api" as const })),
		];
	}, [index, messageEntries]);

	const words = React.useMemo(() => queryWords(query), [query]);
	const groups = React.useMemo(() => {
		// Empty query: quick links to every page
		if (words.length === 0) return [{ source: "pages" as const, entries: messageEntries.filter((e) => e.source === "pages") }];
		return groupResults(searchSite(allEntries, query));
	}, [allEntries, messageEntries, query, words]);
	const flat = React.useMemo(() => groups.flatMap((g) => g.entries), [groups]);

	React.useEffect(() => setActive(0), [query]);

	// Reset the query each time the palette opens
	React.useEffect(() => {
		if (open) setQuery("");
	}, [open]);

	// Keep the active row in view
	React.useEffect(() => {
		listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
	}, [active]);

	const go = (entry: SourcedEntry) => {
		onOpenChange(false);
		const target = new URL(entry.u, window.location.origin);
		if (target.pathname === pathname) {
			// Same page: update the URL and let the page react to hashchange (docs-api section, options/troubleshooting scroll)
			window.history.pushState(null, "", `${window.location.pathname}${target.search}${target.hash}`);
			window.dispatchEvent(new HashChangeEvent("hashchange"));
		} else {
			router.push(entry.u);
		}
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.nativeEvent.isComposing) return;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			setActive((i) => Math.min(i + 1, flat.length - 1));
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			setActive((i) => Math.max(i - 1, 0));
		} else if (e.key === "Enter" && flat[active]) {
			e.preventDefault();
			go(flat[active]);
		}
	};

	let rowIndex = -1;

	return (
		<Dialog.Root open={open} onOpenChange={onOpenChange}>
			<Dialog.Portal>
				<Dialog.Overlay className='fixed inset-0 z-[60] bg-black/40 backdrop-blur-[1px] data-[state=open]:animate-in data-[state=open]:fade-in-0' />
				<Dialog.Content
					aria-describedby={undefined}
					className='fixed start-1/2 top-[12vh] z-[60] flex max-h-[76vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-2xl rtl:translate-x-1/2 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95'
				>
					<Dialog.Title className='sr-only'>{t("title")}</Dialog.Title>
					<div className='flex items-center gap-2 border-b px-4'>
						<Search className='size-4 shrink-0 text-muted-foreground' aria-hidden />
						<input
							autoFocus
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							onKeyDown={onKeyDown}
							placeholder={t("placeholder")}
							role='combobox'
							aria-expanded
							aria-controls={listId}
							aria-activedescendant={flat[active] ? `${listId}-${active}` : undefined}
							aria-autocomplete='list'
							className='h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground'
						/>
						{!index && words.length > 0 && <Loader2 className='size-4 shrink-0 animate-spin text-muted-foreground' aria-label={t("loading")} />}
						<kbd className='hidden shrink-0 rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground sm:block'>Esc</kbd>
					</div>

					<div ref={listRef} id={listId} role='listbox' className='min-h-0 flex-1 overflow-y-auto p-2'>
						{flat.length === 0 ? (
							<p className='px-3 py-10 text-center text-sm text-muted-foreground'>{index ? t("noResults") : t("loading")}</p>
						) : (
							groups.map(({ source, entries }) => {
								const Icon = SOURCE_ICONS[source];
								return (
									<div key={source} role='group' aria-label={t(`groups.${source}`)} className='mb-2 last:mb-0'>
										<div className='px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground'>{t(`groups.${source}`)}</div>
										{entries.map((entry) => {
											rowIndex++;
											const i = rowIndex;
											const selected = i === active;
											return (
												<div
													key={`${source}:${entry.u}:${entry.t}`}
													id={`${listId}-${i}`}
													data-index={i}
													role='option'
													aria-selected={selected}
													onMouseMove={() => !selected && setActive(i)}
													onClick={() => go(entry)}
													className={cn("flex cursor-pointer items-start gap-3 rounded-md px-3 py-2", selected && "bg-accent")}
												>
													<Icon className='mt-0.5 size-4 shrink-0 text-muted-foreground' aria-hidden />
													<div className='min-w-0 flex-1'>
														<div className='flex items-baseline gap-2'>
															<span className={cn("truncate text-sm font-medium", (source === "api" || source === "options") && "font-mono text-[13px]")}>
																<Highlight text={entry.t} words={words} />
															</span>
															{entry.g && <span className='shrink-0 truncate text-[11px] text-muted-foreground'>{entry.g}</span>}
														</div>
														{entry.d && <p className='mt-0.5 line-clamp-1 text-xs text-muted-foreground'>{entry.d}</p>}
													</div>
													{selected && <ArrowRight className='mt-0.5 size-3.5 shrink-0 text-muted-foreground rtl:rotate-180' aria-hidden />}
												</div>
											);
										})}
									</div>
								);
							})
						)}
					</div>

					<div className='hidden items-center gap-4 border-t px-4 py-2 text-[11px] text-muted-foreground sm:flex'>
						<span className='flex items-center gap-1'>
							<kbd className='rounded border bg-muted px-1'>↑</kbd>
							<kbd className='rounded border bg-muted px-1'>↓</kbd>
							{t("hintNavigate")}
						</span>
						<span className='flex items-center gap-1'>
							<kbd className='rounded border bg-muted px-1'>
								<CornerDownLeft className='size-3' />
							</kbd>
							{t("hintOpen")}
						</span>
						<span className='flex items-center gap-1'>
							<kbd className='rounded border bg-muted px-1'>Esc</kbd>
							{t("hintClose")}
						</span>
					</div>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
