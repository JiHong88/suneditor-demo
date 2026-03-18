"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search, X, Command } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Badge } from "@/components/ui/badge";
import ApiSidebar from "./components/ApiSidebar";
import ApiContent from "./components/ApiContent";
import TypesContent from "./components/TypesContent";
import GlobalSearchResults from "./components/GlobalSearchResults";
import MobileSidebar from "./components/MobileSidebar";
import PageToc from "./components/PageToc";
import apiDocsDataEn from "@/data/api/api-docs.en.json";
import type { ApiDocs } from "./_lib/types";
import { buildSidebarItems, resolveContentData } from "./_lib/sidebarData";
import { buildSearchIndex, searchApi } from "./_lib/apiSearchIndex";
import { SidebarAd } from "@/components/ad/AdBanner";

const localeDataLoaders: Record<string, () => Promise<ApiDocs>> = {
	ko: () => import("@/data/api/api-docs.ko.json").then((m) => m.default as unknown as ApiDocs),
	ar: () => import("@/data/api/api-docs.ar.json").then((m) => m.default as unknown as ApiDocs),
};

const apiDocsEn = apiDocsDataEn as unknown as ApiDocs;
const sidebarItems = buildSidebarItems(apiDocsEn);
const searchIndex = buildSearchIndex(apiDocsEn);

export default function DocsApiPage() {
	const t = useTranslations("DocsApi");
	const locale = useLocale();
	const [apiDocs, setApiDocs] = useState<ApiDocs>(apiDocsEn);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedId, setSelectedId] = useState("editor");
	const searchInputRef = useRef<HTMLInputElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);

	// Sync selectedId to URL query param
	const updateUrl = useCallback((sectionId: string, hash?: string) => {
		const url = new URL(window.location.href);
		if (sectionId && sectionId !== "editor") {
			url.searchParams.set("s", sectionId);
		} else {
			url.searchParams.delete("s");
		}
		if (hash) {
			url.hash = hash;
		} else {
			// Remove hash without scrolling
			url.hash = "";
		}
		window.history.replaceState(null, "", url.pathname + url.search + (hash ? `#${hash}` : ""));
	}, []);

	// Load locale-specific API docs
	useEffect(() => {
		const loader = localeDataLoaders[locale];
		if (loader) {
			loader().then(setApiDocs);
		} else {
			setApiDocs(apiDocsEn);
		}
	}, [locale]);

	// Restore selection from URL on mount
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const sParam = params.get("s");
		const hash = window.location.hash.slice(1);

		if (hash) {
			// Find which section contains this item
			const item = searchIndex.find((i) => i.id === hash);
			if (item) {
				setSelectedId(item.sectionId);
				requestAnimationFrame(() => {
					setTimeout(() => {
						document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
					}, 100);
				});
				return;
			}
		}

		if (sParam) {
			setSelectedId(sParam);
		}
	}, []);

	// Cmd+K shortcut
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
			if (e.key === "Escape" && searchQuery) {
				setSearchQuery("");
				searchInputRef.current?.blur();
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, [searchQuery]);

	// Search results
	const searchResults = useMemo(() => {
		return searchApi(searchQuery, searchIndex);
	}, [searchQuery]);

	// Content data for selected section
	const contentData = useMemo(() => {
		return resolveContentData(selectedId, apiDocs, t);
	}, [selectedId, apiDocs, t]);

	// TOC items for current section
	const tocItems = useMemo(() => {
		if (!contentData) return [];
		const items: { id: string; label: string }[] = [];
		if (contentData.getters) {
			for (const g of contentData.getters) {
				items.push({ id: `${contentData.prefix}${g.name}`.replace(/\.$/, ""), label: g.name });
			}
		}
		for (const m of contentData.methods) {
			items.push({ id: `${contentData.prefix}${m.name}`.replace(/\.$/, ""), label: m.name });
		}
		return items;
	}, [contentData]);

	// Handle sidebar selection — scroll content to top, preserve sidebar scroll
	const handleSidebarSelect = useCallback((id: string) => {
		const scrollTop = sidebarRef.current?.scrollTop ?? 0;
		setSelectedId(id);
		updateUrl(id);
		window.scrollTo({ top: 0 });
		requestAnimationFrame(() => {
			if (sidebarRef.current) {
				sidebarRef.current.scrollTop = scrollTop;
			}
		});
	}, [updateUrl]);

	// Handle search result selection
	const handleSearchSelect = useCallback((sectionId: string, itemId: string) => {
		setSelectedId(sectionId);
		setSearchQuery("");
		updateUrl(sectionId, itemId);
		requestAnimationFrame(() => {
			setTimeout(() => {
				document.getElementById(itemId)?.scrollIntoView({ behavior: "smooth", block: "start" });
				// Scroll sidebar to show the selected section
				const sidebarEl = sidebarRef.current?.querySelector(`[data-sidebar-id="${sectionId}"]`);
				sidebarEl?.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}, 150);
		});
	}, [updateUrl]);

	const isSearching = searchQuery.trim().length > 0;

	return (
		<div className='min-h-screen flex flex-col'>
			{/* Header */}
			<div className='border-b bg-background/95 backdrop-blur sticky top-0 z-10'>
				<div className='container mx-auto px-4 md:px-6 py-3 md:py-4'>
					<div className='flex items-center gap-3 md:gap-4'>
						{/* Mobile sidebar trigger */}
						<MobileSidebar items={sidebarItems} selectedId={selectedId} onSelect={setSelectedId} />

						{/* Title */}
						<div className='shrink-0'>
							<div className='flex items-center gap-2'>
								<h1 className='text-lg md:text-2xl font-bold'>{t("title")}</h1>
								<Badge variant='secondary' className='text-[10px] md:text-xs'>
									v{apiDocs.version}
								</Badge>
							</div>
						</div>

						{/* Search */}
						<div className='relative flex-1 max-w-md ms-auto'>
							<Search className='absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
							<input
								ref={searchInputRef}
								type='text'
								placeholder={t("searchPlaceholder")}
								className='w-full ps-9 pe-20 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
							<div className='absolute end-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5'>
								{searchQuery ? (
									<button
										onClick={() => setSearchQuery("")}
										className='text-muted-foreground hover:text-foreground transition-colors'
									>
										<X className='h-4 w-4' />
									</button>
								) : (
									<kbd className='hidden md:flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border'>
										<Command className='h-2.5 w-2.5' />K
									</kbd>
								)}
							</div>
						</div>
					</div>

					{/* Search result count */}
					{isSearching && (
						<div className='mt-2 text-xs text-muted-foreground'>
							{searchResults.length} {t("resultsFound")}
						</div>
					)}
				</div>
			</div>

			{/* Main Content */}
			<div className='flex flex-1 min-h-0'>
				{/* Desktop sidebar */}
				<div
					ref={sidebarRef}
					className='hidden md:block w-60 lg:w-64 shrink-0 border-e bg-background sticky top-[91px] self-start max-h-[calc(100vh-91px)] overflow-y-auto'
				>
					<ApiSidebar items={sidebarItems} selectedId={selectedId} onSelect={handleSidebarSelect} />
					<SidebarAd />
				</div>

				{/* Content area */}
				{isSearching ? (
					<GlobalSearchResults results={searchResults} query={searchQuery} onSelect={handleSearchSelect} />
				) : selectedId === "types" && apiDocs.structure.types && "items" in apiDocs.structure.types ? (
					<TypesContent
						title={apiDocs.structure.types.title}
						description={apiDocs.structure.types.description}
						types={apiDocs.structure.types.items}
					/>
				) : contentData ? (
					<>
						<ApiContent
							title={contentData.title}
							description={contentData.description}
							methods={contentData.methods}
							getters={contentData.getters}
							prefix={contentData.prefix}
							onNavigate={handleSidebarSelect}
						/>
						<PageToc items={tocItems} onItemClick={(id) => updateUrl(selectedId, id)} />
					</>
				) : null}
			</div>
		</div>
	);
}
