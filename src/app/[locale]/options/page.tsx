"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search, ChevronRight, Copy, Check } from "lucide-react";
import optDescEn from "@/data/api/option-descriptions.en.json";
import optDescKo from "@/data/api/option-descriptions.ko.json";
import optDescAr from "@/data/api/option-descriptions.ar.json";
import { highlightInline } from "@/lib/highlightInline";

/* ── Types ─────────────────────────────────────────────── */

type OptEntry = { description: string; default?: string };
type OptDesc = Record<string, OptEntry>;

const optDescMap: Record<string, OptDesc> = {
	en: optDescEn as OptDesc,
	ko: optDescKo as OptDesc,
	ar: optDescAr as OptDesc,
};

/* ── Category mapping ──────────────────────────────────── */

interface Category {
	id: string;
	label: string;
	keys: string[];
}

function buildCategories(allKeys: string[]): Category[] {
	const pluginPrefixes = [
		{ prefix: "image_", label: "Image" },
		{ prefix: "video_", label: "Video" },
		{ prefix: "audio_", label: "Audio" },
		{ prefix: "embed_", label: "Embed" },
		{ prefix: "drawing_", label: "Drawing" },
		{ prefix: "math_", label: "Math" },
		{ prefix: "mention_", label: "Mention" },
		{ prefix: "table_", label: "Table" },
		{ prefix: "fontSize_", label: "FontSize" },
		{ prefix: "fontColor_", label: "FontColor" },
		{ prefix: "backgroundColor_", label: "BackgroundColor" },
		{ prefix: "link_", label: "Link" },
		{ prefix: "align_", label: "Align" },
		{ prefix: "font_", label: "Font" },
		{ prefix: "blockStyle_", label: "BlockStyle" },
		{ prefix: "lineHeight_", label: "LineHeight" },
		{ prefix: "paragraphStyle_", label: "ParagraphStyle" },
		{ prefix: "textStyle_", label: "TextStyle" },
		{ prefix: "template_", label: "Template" },
		{ prefix: "layout_", label: "Layout" },
		{ prefix: "hR_", label: "HR" },
		{ prefix: "hr_", label: "HR" },
		{ prefix: "exportPDF_", label: "ExportPDF" },
		{ prefix: "fileUpload_", label: "FileUpload" },
		{ prefix: "imageGallery_", label: "ImageGallery" },
		{ prefix: "videoGallery_", label: "VideoGallery" },
		{ prefix: "audioGallery_", label: "AudioGallery" },
		{ prefix: "fileGallery_", label: "FileGallery" },
		{ prefix: "fileBrowser_", label: "FileBrowser" },
	];

	const used = new Set<string>();
	const cats: Category[] = [];

	// Layout & Sizing
	const layoutKeys = ["width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight", "editorStyle", "top", "frame", "editor"];
	cats.push({ id: "layout", label: "Layout & Sizing", keys: layoutKeys.filter((k) => allKeys.includes(k)) });
	layoutKeys.forEach((k) => used.add(k));

	// Iframe
	const iframeKeys = allKeys.filter((k) => k.startsWith("iframe"));
	if (iframeKeys.length) {
		cats.push({ id: "iframe", label: "Iframe", keys: iframeKeys });
		iframeKeys.forEach((k) => used.add(k));
	}

	// Statusbar & Counter
	const sbKeys = allKeys.filter((k) => k.startsWith("statusbar") || k.startsWith("charCounter"));
	if (sbKeys.length) {
		cats.push({ id: "statusbar", label: "Statusbar & Counter", keys: sbKeys });
		sbKeys.forEach((k) => used.add(k));
	}

	// Toolbar
	const tbKeys = allKeys.filter((k) => k.startsWith("toolbar_") || k.startsWith("shortcut") || ["subToolbar", "buttons", "buttons_sub", "toolbar_sub_width", "buttonList"].includes(k));
	if (tbKeys.length) {
		cats.push({ id: "toolbar", label: "Toolbar", keys: tbKeys });
		tbKeys.forEach((k) => used.add(k));
	}

	// Content & Behavior
	const contentKeys = [
		"value", "placeholder", "editableFrameAttributes", "mode", "type", "theme", "lang", "icons",
		"textDirection", "defaultLine", "defaultLineBreakFormat", "retainStyleMode", "freeCodeViewMode",
		"v2Migration", "plugins", "externalLibs", "codeMirror", "hasCodeMirror", "codeMirrorEditor",
	].filter((k) => allKeys.includes(k));
	if (contentKeys.length) {
		cats.push({ id: "content", label: "Content & Editor", keys: contentKeys });
		contentKeys.forEach((k) => used.add(k));
	}

	// Features
	const featKeys = [
		"autoLinkify", "copyFormatKeepOn", "tabDisable", "syncTabIndent",
		"componentInsertBehavior", "historyStackDelayTime", "fullScreenOffset",
		"defaultUrlProtocol", "closeModalOutsideClick", "previewTemplate",
		"printTemplate", "printClass", "toastMessageTime", "reverseCommands",
		"events", "shortcuts", "allowedExtraTags",
	].filter((k) => allKeys.includes(k));
	if (featKeys.length) {
		cats.push({ id: "features", label: "Features", keys: featKeys });
		featKeys.forEach((k) => used.add(k));
	}

	// Filtering
	const filterKeys = [
		"strictMode", "scopeSelectionTags", "elementWhitelist", "elementBlacklist",
		"allowedEmptyTags", "allowedClassName", "attributeWhitelist", "attributeBlacklist",
		"textStyleTags", "convertTextTags", "allUsedStyles", "tagStyles",
		"spanStyles", "lineStyles", "fontSizeUnits", "lineAttrReset",
		"formatLine", "formatBrLine", "formatClosureBrLine", "formatBlock", "formatClosureBlock",
	].filter((k) => allKeys.includes(k));
	if (filterKeys.length) {
		cats.push({ id: "filtering", label: "Filtering & Formatting", keys: filterKeys });
		filterKeys.forEach((k) => used.add(k));
	}

	// Plugin categories
	for (const pp of pluginPrefixes) {
		const keys = allKeys.filter((k) => k.startsWith(pp.prefix) && !used.has(k));
		if (keys.length) {
			const existingCat = cats.find((c) => c.label === pp.label);
			if (existingCat) {
				existingCat.keys.push(...keys);
			} else {
				cats.push({ id: `plugin_${pp.prefix.replace(/_$/, "")}`, label: pp.label, keys });
			}
			keys.forEach((k) => used.add(k));
		}
	}

	// Remaining uncategorized
	const remaining = allKeys.filter((k) => !used.has(k));
	if (remaining.length) {
		cats.push({ id: "other", label: "Other", keys: remaining });
	}

	return cats.filter((c) => c.keys.length > 0);
}

/* ── Components ────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(text);
				setCopied(true);
				setTimeout(() => setCopied(false), 1500);
			}}
			className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
			title="Copy option name"
		>
			{copied ? <Check className="size-3" /> : <Copy className="size-3" />}
		</button>
	);
}

function OptionRow({ name, entry }: { name: string; entry: OptEntry }) {
	return (
		<div id={`opt-${name}`} className="group border-b border-border/40 py-4 scroll-mt-20">
			<div className="flex items-start gap-2 mb-1.5">
				<code className="text-sm font-semibold text-primary break-all">{name}</code>
				<CopyButton text={name} />
			</div>
			<div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{highlightInline(entry.description)}</div>
			{entry.default !== undefined && (
				<div className="mt-2 flex items-baseline gap-2">
					<span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider">Default:</span>
					<code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground/80">{entry.default}</code>
				</div>
			)}
		</div>
	);
}

function CategorySection({ cat, optDesc }: { cat: Category; optDesc: OptDesc }) {
	return (
		<section id={`cat-${cat.id}`} className="scroll-mt-20">
			<h2 className="text-lg font-bold border-b-2 border-primary/20 pb-2 mb-1 sticky top-14 bg-background/95 backdrop-blur-sm z-10">
				{cat.label}
				<span className="text-xs font-normal text-muted-foreground ml-2">({cat.keys.length})</span>
			</h2>
			<div>
				{cat.keys.map((key) => {
					const entry = optDesc[key];
					if (!entry) return null;
					return <OptionRow key={key} name={key} entry={entry} />;
				})}
			</div>
		</section>
	);
}

/* ── Sidebar ───────────────────────────────────────────── */

function Sidebar({
	categories,
	activeId,
	onSelect,
}: {
	categories: Category[];
	activeId: string;
	onSelect: (id: string) => void;
}) {
	return (
		<nav className="space-y-0.5">
			{categories.map((cat) => (
				<button
					key={cat.id}
					type="button"
					onClick={() => onSelect(cat.id)}
					className={`w-full text-left text-xs px-3 py-1.5 rounded-md transition-colors flex items-center justify-between ${
						activeId === cat.id
							? "bg-primary/10 text-primary font-medium"
							: "text-muted-foreground hover:text-foreground hover:bg-muted/50"
					}`}
				>
					<span className="flex items-center gap-1.5">
						<ChevronRight className={`size-3 transition-transform ${activeId === cat.id ? "rotate-90" : ""}`} />
						{cat.label}
					</span>
					<span className="text-[10px] opacity-50">{cat.keys.length}</span>
				</button>
			))}
		</nav>
	);
}

/* ── Main page ─────────────────────────────────────────── */

export default function OptionsPage() {
	const t = useTranslations("Options");
	const locale = useLocale();
	const optDesc = optDescMap[locale] ?? optDescMap.en;
	const allKeys = useMemo(() => Object.keys(optDesc), [optDesc]);
	const categories = useMemo(() => buildCategories(allKeys), [allKeys]);

	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
	const contentRef = useRef<HTMLDivElement>(null);

	// Filter
	const filtered = useMemo(() => {
		if (!search.trim()) return categories;
		const q = search.toLowerCase();
		return categories
			.map((cat) => ({
				...cat,
				keys: cat.keys.filter(
					(k) =>
						k.toLowerCase().includes(q) ||
						(optDesc[k]?.description ?? "").toLowerCase().includes(q),
				),
			}))
			.filter((cat) => cat.keys.length > 0);
	}, [search, categories, optDesc]);

	const totalFiltered = useMemo(() => filtered.reduce((sum, c) => sum + c.keys.length, 0), [filtered]);

	// Track active category on scroll
	useEffect(() => {
		const el = contentRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const id = entry.target.id.replace("cat-", "");
						setActiveCategory(id);
						break;
					}
				}
			},
			{ root: null, rootMargin: "-80px 0px -70% 0px", threshold: 0 },
		);
		const sections = el.querySelectorAll("section[id^='cat-']");
		sections.forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	}, [filtered]);

	const scrollTo = (id: string) => {
		const el = document.getElementById(`cat-${id}`);
		if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	return (
		<div className="min-h-screen pb-20">
			<section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-8 pt-10">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("title")}</h1>
					<p className="text-muted-foreground text-sm">{t("description")}</p>
				</div>

				{/* Search */}
				<div className="relative mb-6 max-w-xl">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
					<input
						type="text"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder={t("searchPlaceholder")}
						className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
					/>
					{search && (
						<span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
							{totalFiltered} {t("results")}
						</span>
					)}
				</div>

				{/* Layout: sidebar + content */}
				<div className="flex gap-8">
					{/* Sidebar - desktop only */}
					<aside className="hidden lg:block w-56 shrink-0">
						<div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2">
							<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
								{t("categories")}
								<span className="ml-1 text-muted-foreground/50">({allKeys.length})</span>
							</p>
							<Sidebar
								categories={filtered}
								activeId={activeCategory}
								onSelect={scrollTo}
							/>
						</div>
					</aside>

					{/* Content */}
					<main ref={contentRef} className="flex-1 min-w-0 space-y-8">
						{filtered.length === 0 ? (
							<p className="text-muted-foreground text-sm py-12 text-center">{t("noResults")}</p>
						) : (
							filtered.map((cat) => (
								<CategorySection key={cat.id} cat={cat} optDesc={optDesc} />
							))
						)}
					</main>
				</div>
			</section>
		</div>
	);
}
