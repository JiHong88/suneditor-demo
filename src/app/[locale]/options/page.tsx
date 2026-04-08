"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search, Copy, Check, ChevronRight, Link2, Settings2, Puzzle, Layers, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useOptDesc } from "@/hooks/useOptDesc";
import apiDocsEn from "@/data/api/api-docs.en.json";
import { highlightInline } from "@/lib/highlightInline";
import ScrollToTop from "@/components/common/ScrollToTop";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/common/CodeBlock";
import { DocsSidebarAd } from "@/components/ad/AdBanner";

/* ── Constants ─────────────────────────────────────────── */
// nav area = 92px (nav + breadcrumb/gap)
const SECTION_TOP = "top-[92px]"; // 92px — right under nav area
const SECTION_H = 44; // section header rendered height (px)
const CAT_TOP = "top-[136px]"; // 92 + 44 = 136px — under section header
const FRAME_CAT_TOP = "top-[176px]"; // 136 + 40px frame header — under frame options header
const SIDEBAR_TOP = "top-[92px]"; // 92px — match main content
const SCROLL_MT = "scroll-mt-[140px]"; // 136 + 4px breathing room
const FRAME_SCROLL_MT = "scroll-mt-[180px]"; // 176 + 4px breathing room

/* ── Types ─────────────────────────────────────────────── */

type OptEntry = { description: string; default?: string };
type OptDesc = Record<string, OptEntry>;
type ApiMethod = { name: string; params: string; returns: string; description: string; example?: string };

type OptionItem = {
	name: string;
	displayName: string;
	type: string;
	description: string;
	defaultValue?: string;
	example?: string;
};

type SidebarSection = {
	id: string;
	label: string;
	icon: "editor" | "frame" | "plugin";
	children: SidebarCategory[];
	/** Frame options subsection nested under editor */
	frameChildren?: SidebarCategory[];
};

type SidebarCategory = {
	id: string;
	label: string;
	pluginName?: string;
	options: OptionItem[];
};

/* ── Data ──────────────────────────────────────────────── */


/* ── Type map from api-docs ────────────────────────────── */

type ApiSubgroups = Record<string, { methods?: ApiMethod[] }>;
type ApiStructure = { structure: { editor: { subgroups: ApiSubgroups } } };

function buildTypeMap(): Record<string, { type: string; example?: string }> {
	const map: Record<string, { type: string; example?: string }> = {};
	const subgroups = (apiDocsEn as ApiStructure).structure.editor.subgroups;
	for (const m of subgroups.options?.methods ?? []) map[m.name] = { type: m.returns || "", example: m.example };
	for (const m of subgroups.frameOptions?.methods ?? []) if (!map[m.name]) map[m.name] = { type: m.returns || "", example: m.example };
	return map;
}
const typeMap = buildTypeMap();

/* ── Helpers ───────────────────────────────────────────── */

function extractExample(desc: string): { cleanDesc: string; example?: string } {
	const match = desc.match(/```(\w*)\s*\n?([\s\S]*?)```/);
	if (!match) return { cleanDesc: desc };
	return { cleanDesc: desc.replace(/```(\w*)\s*\n?[\s\S]*?```/, "").trim(), example: match[2].trim() };
}

function getFrameOptionNames(): Set<string> {
	const subgroups = (apiDocsEn as ApiStructure).structure.editor.subgroups;
	const s = new Set<string>();
	for (const m of subgroups.frameOptions?.methods ?? []) s.add(m.name);
	return s;
}
const frameOptionNames = getFrameOptionNames();

function formatType(type: string): string {
	if (!type) return "";
	return type.replace(/\n/g, " ").replace(/\t/g, "").replace(/\s+/g, " ").trim();
}

/* ── Plugin prefixes ───────────────────────────────────── */

const PLUGIN_PREFIXES = [
	{ prefix: "align_", label: "Align", name: "align" },
	{ prefix: "audio_", label: "Audio", name: "audio" },
	{ prefix: "audioGallery_", label: "AudioGallery", name: "audioGallery" },
	{ prefix: "backgroundColor_", label: "BackgroundColor", name: "backgroundColor" },
	{ prefix: "blockStyle_", label: "BlockStyle", name: "blockStyle" },
	{ prefix: "drawing_", label: "Drawing", name: "drawing" },
	{ prefix: "embed_", label: "Embed", name: "embed" },
	{ prefix: "exportPDF_", label: "ExportPDF", name: "exportPDF" },
	{ prefix: "fileBrowser_", label: "FileBrowser", name: "fileBrowser" },
	{ prefix: "fileGallery_", label: "FileGallery", name: "fileGallery" },
	{ prefix: "fileUpload_", label: "FileUpload", name: "fileUpload" },
	{ prefix: "font_", label: "Font", name: "font" },
	{ prefix: "fontColor_", label: "FontColor", name: "fontColor" },
	{ prefix: "fontSize_", label: "FontSize", name: "fontSize" },
	{ prefix: "hR_", label: "HR", name: "hR" },
	{ prefix: "hr_", label: "HR", name: "hr" },
	{ prefix: "image_", label: "Image", name: "image" },
	{ prefix: "imageGallery_", label: "ImageGallery", name: "imageGallery" },
	{ prefix: "layout_", label: "Layout", name: "layout" },
	{ prefix: "lineHeight_", label: "LineHeight", name: "lineHeight" },
	{ prefix: "link_", label: "Link", name: "link" },
	{ prefix: "math_", label: "Math", name: "math" },
	{ prefix: "mention_", label: "Mention", name: "mention" },
	{ prefix: "paragraphStyle_", label: "ParagraphStyle", name: "paragraphStyle" },
	{ prefix: "table_", label: "Table", name: "table" },
	{ prefix: "template_", label: "Template", name: "template" },
	{ prefix: "textStyle_", label: "TextStyle", name: "textStyle" },
	{ prefix: "video_", label: "Video", name: "video" },
	{ prefix: "videoGallery_", label: "VideoGallery", name: "videoGallery" },
];

/* ── Build option item ─────────────────────────────────── */

function buildOptionItem(key: string, optDesc: OptDesc, displayName?: string): OptionItem {
	const entry = optDesc[key];
	const typeInfo = typeMap[key];
	const rawDesc = entry?.description ?? "";
	const { cleanDesc, example: descExample } = extractExample(rawDesc);
	return {
		name: key,
		displayName: displayName ?? key,
		type: typeInfo?.type ?? "",
		description: cleanDesc,
		defaultValue: entry?.default,
		example: typeInfo?.example || descExample,
	};
}

/* ── Build 3 sections: Editor / Frame / Plugin ─────────── */

function buildSections(optDesc: OptDesc): SidebarSection[] {
	const allKeys = Object.keys(optDesc);
	const used = new Set<string>();

	// 1. Plugin keys
	const pluginKeys = new Map<string, string[]>();
	for (const pp of PLUGIN_PREFIXES) {
		const keys = allKeys.filter((k) => k.startsWith(pp.prefix));
		if (keys.length) {
			const existing = pluginKeys.get(pp.label) ?? [];
			existing.push(...keys);
			pluginKeys.set(pp.label, existing);
			keys.forEach((k) => used.add(k));
		}
	}

	// 2. Frame option keys (from frameOptionNames set)
	const frameKeys = allKeys.filter((k) => !used.has(k) && frameOptionNames.has(k));
	frameKeys.forEach((k) => used.add(k));

	// 3. Editor-only keys (everything else)
	const editorKeys = allKeys.filter((k) => !used.has(k));

	// ── Editor categories
	const editorCatDefs: { id: string; label: string; filter: (k: string) => boolean }[] = [
		{ id: "cat_plugins", label: "Plugins & Buttons", filter: (k) => ["plugins", "excludedPlugins", "buttonList", "buttons", "buttons_sub"].includes(k) },
		{ id: "cat_modes", label: "Modes & Themes", filter: (k) => ["v2Migration", "mode", "type", "theme", "lang", "icons", "textDirection", "reverseButtons", "reverseCommands"].includes(k) },
		{ id: "cat_toolbar", label: "Toolbar", filter: (k) => k.startsWith("toolbar_") || k.startsWith("shortcut") || ["subToolbar"].includes(k) },
		{
			id: "cat_filtering", label: "Filtering & Formatting",
			filter: (k) => [
				"strictMode", "scopeSelectionTags", "elementWhitelist", "elementBlacklist",
				"allowedEmptyTags", "allowedClassName", "attributeWhitelist", "attributeBlacklist",
				"textStyleTags", "convertTextTags", "allUsedStyles", "tagStyles",
				"spanStyles", "lineStyles", "fontSizeUnits", "retainStyleMode",
				"lineAttrReset", "formatLine", "formatBrLine", "formatClosureBrLine",
				"formatBlock", "formatClosureBlock", "defaultLine", "defaultLineBreakFormat",
				"allowedExtraTags",
			].includes(k),
		},
		{
			id: "cat_ui", label: "UI & Interaction",
			filter: (k) => [
				"closeModalOutsideClick", "syncTabIndent", "tabDisable",
				"autoLinkify", "autoStyleify", "copyFormatKeepOn",
				"historyStackDelayTime", "printClass", "fullScreenOffset",
				"previewTemplate", "printTemplate", "componentInsertBehavior",
				"defaultUrlProtocol", "toastMessageTime", "freeCodeViewMode",
			].includes(k),
		},
		{ id: "cat_external", label: "External Libraries", filter: (k) => ["externalLibs", "codeMirror", "hasCodeMirror", "codeMirrorEditor"].includes(k) },
		{ id: "cat_events", label: "Events & Shortcuts", filter: (k) => ["events", "shortcuts"].includes(k) },
	];

	const editorCategories: SidebarCategory[] = [];
	const editorUsed = new Set<string>();
	for (const catDef of editorCatDefs) {
		const keys = editorKeys.filter((k) => !editorUsed.has(k) && catDef.filter(k));
		if (keys.length) {
			editorCategories.push({ id: catDef.id, label: catDef.label, options: keys.map((k) => buildOptionItem(k, optDesc)) });
			keys.forEach((k) => editorUsed.add(k));
		}
	}
	const editorRemaining = editorKeys.filter((k) => !editorUsed.has(k));
	if (editorRemaining.length) {
		editorCategories.push({ id: "cat_other", label: "Other", options: editorRemaining.map((k) => buildOptionItem(k, optDesc)) });
	}

	// ── Frame categories
	const frameCatDefs: { id: string; label: string; filter: (k: string) => boolean }[] = [
		{ id: "frame_content", label: "Content", filter: (k) => ["value", "placeholder", "editableFrameAttributes"].includes(k) },
		{ id: "frame_layout", label: "Layout & Sizing", filter: (k) => ["width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight", "editorStyle", "top", "frame", "editor"].includes(k) },
		{ id: "frame_iframe", label: "Iframe", filter: (k) => k.startsWith("iframe") },
		{ id: "frame_statusbar", label: "Statusbar & Counter", filter: (k) => k.startsWith("statusbar") || k.startsWith("charCounter") },
	];

	const frameCategories: SidebarCategory[] = [];
	const frameUsed = new Set<string>();
	for (const catDef of frameCatDefs) {
		const keys = frameKeys.filter((k) => !frameUsed.has(k) && catDef.filter(k));
		if (keys.length) {
			frameCategories.push({ id: catDef.id, label: catDef.label, options: keys.map((k) => buildOptionItem(k, optDesc)) });
			keys.forEach((k) => frameUsed.add(k));
		}
	}
	const frameRemaining = frameKeys.filter((k) => !frameUsed.has(k));
	if (frameRemaining.length) {
		frameCategories.push({ id: "frame_other", label: "Other", options: frameRemaining.map((k) => buildOptionItem(k, optDesc)) });
	}

	// ── Plugin categories
	const pluginCategories: SidebarCategory[] = [];
	const seenLabels = new Set<string>();
	for (const pp of PLUGIN_PREFIXES) {
		const keys = pluginKeys.get(pp.label);
		if (!keys?.length || seenLabels.has(pp.label)) continue;
		seenLabels.add(pp.label);
		pluginCategories.push({
			id: `plugin_${pp.name}`,
			label: pp.label,
			pluginName: pp.name,
			options: keys.map((k) => buildOptionItem(k, optDesc, k.slice(pp.prefix.length))),
		});
	}

	return [
		{ id: "editor", label: "Editor Options", icon: "editor" as const, children: editorCategories, frameChildren: frameCategories },
		{ id: "plugin", label: "Plugin Options", icon: "plugin" as const, children: pluginCategories },
	];
}

/* ── Shared components ─────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button type="button" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
			className="inline-flex items-center p-1 rounded-md hover:bg-muted transition-colors" title="Copy">
			{copied ? <Check className="size-3.5 text-green-600" /> : <Copy className="size-3.5 text-muted-foreground" />}
		</button>
	);
}

function PermalinkButton({ id }: { id: string }) {
	const [copied, setCopied] = useState(false);
	return (
		<button type="button" onClick={() => {
			navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}#${id}`);
			window.history.replaceState(null, "", `#${id}`);
			setCopied(true); setTimeout(() => setCopied(false), 2000);
		}} className="inline-flex items-center p-1 rounded-md hover:bg-muted transition-colors" title="Copy permalink">
			{copied ? <Check className="size-3.5 text-green-600" /> : <Link2 className="size-3.5 text-muted-foreground" />}
		</button>
	);
}

/* ── Option card ───────────────────────────────────────── */

function OptionCard({ item, pluginName }: { item: OptionItem; pluginName?: string }) {
	const t = useTranslations("Options");
	const cardId = `opt-${item.name}`;
	const typeStr = formatType(item.type);

	const formatDescription = (desc: string) => {
		if (!desc) return null;
		const cleaned = desc.replace(/^-\s*/, "").trim();
		if (!cleaned) return null;
		const parts = cleaned.split(/\n\s*-\s+/);
		if (parts.length > 1) {
			return (
				<div className="text-sm text-muted-foreground leading-relaxed space-y-1">
					{parts.map((part, idx) => {
						if (!part.trim()) return null;
						return (
							<div key={idx} className="flex gap-2">
								{idx > 0 && <span className="text-primary mt-0.5 shrink-0">&#x2022;</span>}
								<span className={idx === 0 ? "" : "flex-1"}>{highlightInline(part.trim())}</span>
							</div>
						);
					})}
				</div>
			);
		}
		return <p className="text-sm text-muted-foreground leading-relaxed">{highlightInline(cleaned)}</p>;
	};

	return (
		<div id={cardId} className={cn("group/card border rounded-lg p-5 hover:shadow-sm transition-all", SCROLL_MT, "hover:border-primary/30")}>
			<div className="flex items-center justify-between mb-3">
				<code className="text-base font-bold font-mono text-green-600 dark:text-green-400 break-all">{item.displayName}</code>
				<div className="flex items-center gap-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity shrink-0">
					<PermalinkButton id={cardId} />
					<CopyButton text={pluginName ? `${pluginName}: { ${item.displayName}: ... }` : item.name} />
				</div>
			</div>
			{typeStr && (
				<div className="mb-3">
					<code className="text-xs font-mono px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800 inline-block max-w-full overflow-x-auto">
						{typeStr}
					</code>
				</div>
			)}
			{item.description ? formatDescription(item.description) : (
				<p className="text-sm text-muted-foreground/50 italic">{t("noDescription")}</p>
			)}
			{item.defaultValue !== undefined && (
				<div className="mt-3 flex items-baseline gap-2">
					<span className="text-[11px] font-medium text-muted-foreground/70 uppercase tracking-wider shrink-0">{t("default")}</span>
					<code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded text-foreground/80">{item.defaultValue}</code>
				</div>
			)}
			{item.example?.trim() && (
				<div className="mt-4 pt-3 border-t">
					<span className="text-xs font-semibold text-primary uppercase tracking-wide">{t("example")}</span>
					<div className="mt-2 rounded-lg overflow-hidden border text-xs [&_pre]:!p-3">
						<CodeBlock code={item.example} lang="javascript" />
					</div>
				</div>
			)}
		</div>
	);
}

/* ── Category content ──────────────────────────────────── */

function EditorCategoryContent({ category }: { category: SidebarCategory }) {
	return (
		<section id={`cat-${category.id}`} className={SCROLL_MT}>
			<h3 className={cn("text-lg font-bold pb-2 mb-4 border-b-2 border-blue-200 dark:border-blue-800/60 sticky z-10 bg-background/95 backdrop-blur-sm", CAT_TOP)}>
				{category.label}
				<span className="text-xs font-normal text-muted-foreground ml-2">({category.options.length})</span>
			</h3>
			<div className="space-y-3">
				{category.options.map((opt) => <OptionCard key={opt.name} item={opt} />)}
			</div>
		</section>
	);
}

function FrameCategoryContent({ category }: { category: SidebarCategory }) {
	return (
		<section id={`cat-${category.id}`} className={FRAME_SCROLL_MT}>
			<h3 className={cn("text-lg font-bold pb-2 mb-4 border-b-2 border-emerald-200 dark:border-emerald-800/60 sticky z-10 bg-background/95 backdrop-blur-sm", FRAME_CAT_TOP)}>
				{category.label}
				<span className="text-xs font-normal text-muted-foreground ml-2">({category.options.length})</span>
			</h3>
			<div className="space-y-3">
				{category.options.map((opt) => <OptionCard key={opt.name} item={opt} />)}
			</div>
		</section>
	);
}

function PluginCategoryContent({ category }: { category: SidebarCategory }) {
	const pluginName = category.pluginName!;
	return (
		<section id={`cat-${category.id}`} className={SCROLL_MT}>
			{/* Plugin header */}
			<div className={cn("sticky z-10 bg-background/95 backdrop-blur-sm pb-2 pt-1", CAT_TOP)}>
				<div className="flex items-baseline gap-1.5">
					<h3 className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">{pluginName}</h3>
					<span className="text-lg font-bold font-mono text-amber-500/70 dark:text-amber-400/70">{"{"}</span>
					<span className="text-xs text-muted-foreground ms-1">({category.options.length})</span>
				</div>
			</div>
			{/* Cards with left accent bar */}
			<div className="relative ps-5 ms-2 border-s-2 border-amber-200/60 dark:border-amber-800/40">
				<div className="space-y-3">
					{category.options.map((opt) => <OptionCard key={opt.name} item={opt} pluginName={pluginName} />)}
				</div>
			</div>
			{/* Closing brace */}
			<div className="flex items-center gap-1 ms-2 mt-1">
				<span className="text-lg font-bold font-mono text-amber-500/70 dark:text-amber-400/70">{"}"}</span>
			</div>
		</section>
	);
}

/* ── Sidebar ───────────────────────────────────────────── */

const sectionConfig = {
	editor: { Icon: Settings2, border: "border-blue-400", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-400" },
	frame: { Icon: Layers, border: "border-emerald-400", bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-400" },
	plugin: { Icon: Puzzle, border: "border-amber-400", bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-400" },
};

function SidebarCatList({ categories, activeId, onSelect, config }: { categories: SidebarCategory[]; activeId: string; onSelect: (id: string) => void; config: (typeof sectionConfig)[keyof typeof sectionConfig] }) {
	return (
		<>
			{categories.map((cat) => {
				const isActive = activeId === cat.id;
				return (
					<button key={cat.id} type="button" onClick={() => onSelect(cat.id)}
						className={cn(
							"w-full text-left text-xs py-1.5 rounded-md transition-colors flex items-center justify-between",
							isActive ? cn("font-medium", config.text) : "text-foreground/55 hover:text-foreground/85 hover:bg-muted/60",
						)}
						style={{ paddingLeft: "28px", paddingRight: "8px" }}
					>
						<span className="flex items-center gap-1.5 min-w-0">
							<span className={cn("w-1.5 h-1.5 rounded-full shrink-0", isActive ? config.dot : "bg-foreground/15")} />
							<span className="truncate">{cat.label}</span>
						</span>
						<span className="text-[10px] opacity-40 shrink-0 ms-1">{cat.options.length}</span>
					</button>
				);
			})}
		</>
	);
}

function Sidebar({
	sections, activeId, onSelect, expandedSections, onToggleSection,
}: {
	sections: SidebarSection[];
	activeId: string;
	onSelect: (id: string) => void;
	expandedSections: Record<string, boolean>;
	onToggleSection: (id: string) => void;
}) {
	return (
		<nav className="space-y-1">
			{sections.map((section) => {
				const config = sectionConfig[section.icon];
				const frameConfig = sectionConfig.frame;
				const isExpanded = expandedSections[section.id] ?? true;
				const totalOptions = section.children.reduce((sum, c) => sum + c.options.length, 0)
					+ (section.frameChildren?.reduce((sum, c) => sum + c.options.length, 0) ?? 0);
				return (
					<div key={section.id}>
						<button type="button" onClick={() => onToggleSection(section.id)}
							className={cn(
								"w-full flex items-center justify-between text-sm font-semibold py-2 px-3 rounded-md transition-all",
								"sticky top-0 z-10 backdrop-blur-sm border-s-[3px]",
								config.border, config.bg, config.text,
							)}
						>
							<span className="flex items-center gap-1.5">
								<ChevronRight className={cn("size-3 transition-transform", isExpanded && "rotate-90")} />
								<config.Icon className="size-3.5" />
								{section.label}
							</span>
							<span className="text-[10px] opacity-60">{totalOptions}</span>
						</button>
						{isExpanded && (
							<div className="mt-0.5 mb-1">
								<SidebarCatList categories={section.children} activeId={activeId} onSelect={onSelect} config={config} />
								{/* Frame options sub-group */}
								{section.frameChildren && section.frameChildren.length > 0 && (
									<div className="mt-2">
										<div className={cn(
											"flex items-center justify-between text-[11px] font-semibold py-1 ps-[28px] pe-2",
											frameConfig.text,
										)}>
											<span className="flex items-center gap-1.5">
												<Layers className="size-3 opacity-70" />
												Frame Options
											</span>
											<span className="text-[10px] opacity-40">
												{section.frameChildren.reduce((s, c) => s + c.options.length, 0)}
											</span>
										</div>
										<div className="ms-3 border-s-2 border-emerald-200/60 dark:border-emerald-800/40 mt-0.5">
											<SidebarCatList categories={section.frameChildren} activeId={activeId} onSelect={onSelect} config={frameConfig} />
										</div>
									</div>
								)}
							</div>
						)}
					</div>
				);
			})}
		</nav>
	);
}

/* ── Mobile sidebar ────────────────────────────────────── */

function MobileOptionsSidebar({
	sections, activeId, onSelect, expandedSections, onToggleSection, title,
}: {
	sections: SidebarSection[];
	activeId: string;
	onSelect: (id: string) => void;
	expandedSections: Record<string, boolean>;
	onToggleSection: (id: string) => void;
	title: string;
}) {
	const [open, setOpen] = useState(false);
	const handleSelect = (id: string) => { onSelect(id); setOpen(false); };
	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden shrink-0">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
				<SheetHeader className="px-4 pt-4 pb-2">
					<SheetTitle>{title}</SheetTitle>
				</SheetHeader>
				<div className="px-2 pb-4">
					<Sidebar sections={sections} activeId={activeId} onSelect={handleSelect} expandedSections={expandedSections} onToggleSection={onToggleSection} />
				</div>
			</SheetContent>
		</Sheet>
	);
}

/* ── Main page ─────────────────────────────────────────── */

export default function OptionsPage() {
	const t = useTranslations("Options");
	const optDesc = useOptDesc();
	const sections = useMemo(() => buildSections(optDesc), [optDesc]);

	const [search, setSearch] = useState("");
	const [activeCategory, setActiveCategory] = useState(sections[0]?.children[0]?.id ?? "");
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ editor: true, frame: true, plugin: true });
	const contentRef = useRef<HTMLDivElement>(null);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const toggleSection = useCallback((id: string) => {
		setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
	}, []);

	const filteredSections = useMemo(() => {
		if (!search.trim()) return sections;
		const q = search.toLowerCase();
		const filterCats = (cats: SidebarCategory[]) =>
			cats.map((c) => ({ ...c, options: c.options.filter((o) => o.name.toLowerCase().includes(q) || o.displayName.toLowerCase().includes(q) || o.description.toLowerCase().includes(q) || o.type.toLowerCase().includes(q)) }))
				.filter((c) => c.options.length > 0);
		return sections
			.map((s) => ({
				...s,
				children: filterCats(s.children),
				frameChildren: s.frameChildren ? filterCats(s.frameChildren) : undefined,
			}))
			.filter((s) => s.children.length > 0 || (s.frameChildren?.length ?? 0) > 0);
	}, [search, sections]);

	const totalFiltered = useMemo(
		() => filteredSections.reduce((sum, s) => sum + s.children.reduce((cSum, c) => cSum + c.options.length, 0) + (s.frameChildren?.reduce((cSum, c) => cSum + c.options.length, 0) ?? 0), 0),
		[filteredSections],
	);

	useEffect(() => {
		const el = contentRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => { for (const e of entries) if (e.isIntersecting) { setActiveCategory(e.target.id.replace("cat-", "")); break; } },
			{ root: null, rootMargin: `-${SECTION_H + 60}px 0px -70% 0px`, threshold: 0 },
		);
		el.querySelectorAll("section[id^='cat-']").forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	}, [filteredSections]);

	useEffect(() => {
		const hash = window.location.hash.slice(1);
		if (hash) requestAnimationFrame(() => setTimeout(() => document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100));
	}, []);

	const scrollTo = (id: string) => document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

	return (
		<div className="min-h-screen pb-20">
			<section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-8 pt-10">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl sm:text-3xl font-bold mb-2">{t("title")}</h1>
					<p className="text-muted-foreground text-sm">{t("description")}</p>
					<div className="flex items-center gap-4 mt-3 flex-wrap">
						<Badge variant="secondary">{totalFiltered} {t("options")}</Badge>
						<div className="flex gap-3 text-xs text-muted-foreground">
							<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400" />{t("editorOptions")}</span>
							<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" />{t("frameOptions")}</span>
							<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" />{t("pluginOptions")}</span>
						</div>
					</div>
				</div>

				{/* Search + Mobile menu */}
				<div className="flex items-center gap-2 mb-6 max-w-xl">
					<MobileOptionsSidebar sections={filteredSections} activeId={activeCategory} onSelect={(id) => { scrollTo(id); }} expandedSections={expandedSections} onToggleSection={toggleSection} title={t("title")} />
					<div className="relative flex-1">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
						<input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("searchPlaceholder")}
							className="w-full h-10 rounded-lg border border-input bg-background pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
						{search && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{totalFiltered} {t("results")}</span>}
					</div>
				</div>

				{/* Layout */}
				<div className="flex gap-8">
					<aside className="hidden lg:block w-60 shrink-0">
						<div ref={sidebarRef} className={cn("sticky max-h-[calc(100vh-5rem)] overflow-y-auto pr-2", SIDEBAR_TOP)}>
							<Sidebar sections={filteredSections} activeId={activeCategory} onSelect={scrollTo} expandedSections={expandedSections} onToggleSection={toggleSection} />
							<div className="border-t mt-2.5 px-2 pb-32">
								<DocsSidebarAd />
							</div>
						</div>
					</aside>

					<main ref={contentRef} className="flex-1 min-w-0 space-y-14">
						{filteredSections.length === 0 ? (
							<p className="text-muted-foreground text-sm py-12 text-center">{t("noResults")}</p>
						) : (
							filteredSections.map((section) => {
								const config = sectionConfig[section.icon];
								const frameConfig = sectionConfig.frame;
								const sectionTotal = section.children.reduce((s, c) => s + c.options.length, 0)
									+ (section.frameChildren?.reduce((s, c) => s + c.options.length, 0) ?? 0);
								return (
									<div key={section.id}>
										{/* Section sticky header */}
										<div className={cn("sticky z-20 bg-background/95 backdrop-blur-sm pb-2 pt-2 mb-4 border-b", SECTION_TOP)} style={{ height: `${SECTION_H}px` }}>
											<div className="flex items-center gap-2">
												<config.Icon className={cn("size-5", config.text)} />
												<h2 className={cn("text-xl font-bold", config.text)}>{section.label}</h2>
												<Badge variant="outline" className="text-[10px]">{sectionTotal}</Badge>
											</div>
										</div>
										<div className="space-y-10">
											{section.children.map((cat) => {
												if (cat.pluginName) return <PluginCategoryContent key={cat.id} category={cat} />;
												return <EditorCategoryContent key={cat.id} category={cat} />;
											})}
										</div>
										{/* Frame Options sub-section */}
										{section.frameChildren && section.frameChildren.length > 0 && (
											<div className="mt-14">
												<div className={cn("sticky z-10 bg-background/95 backdrop-blur-sm pb-2 pt-1 mb-4", CAT_TOP)}>
													<div className="flex items-baseline gap-1.5">
														<Layers className={cn("size-4", frameConfig.text)} />
														<h3 className={cn("text-lg font-bold", frameConfig.text)}>{t("frameOptions")}</h3>
														<span className="text-xs text-muted-foreground ms-1">
															({section.frameChildren.reduce((s, c) => s + c.options.length, 0)})
														</span>
													</div>
												</div>
												<p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed mb-6">
													{t("perFrameHint")}
												</p>
												<div className="space-y-10 ps-1 border-s-[3px] border-emerald-200/40 dark:border-emerald-800/30">
													{section.frameChildren.map((cat) => (
														<FrameCategoryContent key={cat.id} category={cat} />
													))}
												</div>
											</div>
										)}
									</div>
								);
							})
						)}
					</main>
				</div>
			</section>
			<ScrollToTop onScrollToTop={() => sidebarRef.current?.scrollTo({ top: 0, behavior: "smooth" })} />
		</div>
	);
}
