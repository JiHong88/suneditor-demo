"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SunEditor from "@/components/editor/suneditor";
import type { SunEditor as SunEditorType } from "suneditor/types";
import { HomeButtonList, DocumentButtonList } from "@/components/editor/buttonList";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { HEADER_HEIGHT } from "@/lib/constants";
import {
	API_DOWNLOAD_PDF,
	API_GALLERY_IMAGE,
	API_GALLERY_VIDEO,
	API_GALLERY_AUDIO,
	API_GALLERY_FILE,
	API_GALLERY_BROWSE,
	API_UPLOAD_FILE,
} from "@/data/snippets/apiEndpoints";

// Demo backend wiring so the full-toolbar presets have working PDF export, file upload,
// template/layout and gallery/browser buttons (same endpoints the playground uses).
// SunEditor instantiates every plugin, so missing options warn even on presets without the button.
const demoApiOptions: SunEditorType.InitOptions = {
	exportPDF: { apiUrl: API_DOWNLOAD_PDF },
	fileUpload: { uploadUrl: API_UPLOAD_FILE },
	template: {
		items: [
			{ name: "Meeting notes", html: "<h3>Meeting notes</h3><p><strong>Date:</strong> </p><p><strong>Attendees:</strong> </p><h4>Action items</h4><ul><li></li></ul>" },
			{ name: "Blog post", html: "<h2>Title</h2><p><em>Summary in one sentence.</em></p><p>Body…</p>" },
		],
	},
	layout: {
		items: [
			{
				name: "Two columns",
				html: '<div style="display:flex;gap:1em"><div style="flex:1"><p>Left</p></div><div style="flex:1"><p>Right</p></div></div>',
			},
		],
	},
	imageGallery: { url: API_GALLERY_IMAGE },
	videoGallery: { url: API_GALLERY_VIDEO },
	audioGallery: { url: API_GALLERY_AUDIO },
	fileGallery: { url: API_GALLERY_FILE },
	fileBrowser: { url: API_GALLERY_BROWSE },
};

const subButtonList = [
	["bold", "italic", "underline", "strike", "subscript", "superscript"],
	"|",
	["fontColor", "backgroundColor"],
];

const balloonButtonList = [
	["bold", "italic", "underline", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["link"],
];

/* ── Notion-like preset (Block handle + Slash command) ───── */

// Minimal top toolbar: history on the left, print/preview pushed to the right.
// Formatting lives in the selection toolbar, slash menu and block handle — duplicating it here would hide the Notion-style UX.
const notionButtonList = [["undo", "redo"], ["-right", "preview", "print"]];

// Floating toolbar on text selection: Turn into | marks | colors | link, clear | align.
const notionSubButtonList = [
	["blockStyle"],
	"|",
	["bold", "italic", "underline", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["link", "removeFormat"],
	"|",
	["align"],
];

// Tiny inline SVG so the slash menu shows H1/H2/H3 chips like Notion.
const hIcon = (n: number) =>
	`<svg width="17" height="17" viewBox="0 0 24 24"><text x="1" y="18" font-size="15" font-weight="700" fill="currentColor">H${n}</text></svg>`;

// Slash command menu — custom block items (Notion-style titles) mixed with resolvable plugin names.
const notionSlashItems: NonNullable<SunEditorType.InitOptions["slashCommand"]>["items"] = [
	{
		key: "text",
		title: "Text",
		icon: "text_style",
		keywords: ["paragraph", "p", "plain"],
		action: ($) => $.format.setLine(document.createElement("P")),
	},
	{ key: "h1", title: "Heading 1", icon: hIcon(1), keywords: ["title", "big"], action: ($) => $.format.setLine(document.createElement("H1")) },
	{ key: "h2", title: "Heading 2", icon: hIcon(2), keywords: ["subtitle"], action: ($) => $.format.setLine(document.createElement("H2")) },
	{ key: "h3", title: "Heading 3", icon: hIcon(3), keywords: ["subheading"], action: ($) => $.format.setLine(document.createElement("H3")) },
	"list_bulleted",
	"list_numbered",
	{ key: "quote", title: "Quote", icon: "blockquote", keywords: ["blockquote", "cite"], action: ($) => $.format.applyBlock(document.createElement("BLOCKQUOTE")) },
	{ key: "code", title: "Code", icon: "code_block", keywords: ["pre", "snippet"], action: ($) => $.format.setBrLine(document.createElement("PRE")) },
	"hr",
	"table",
	"image",
	"link",
	// Inline marks — toggled at the caret, so the text typed next gets the format
	"bold",
	"italic",
	"underline",
	"strike",
	"fontColor",
	"backgroundColor",
];

// Block handle action menu (Tiptap Notion-like order): Turn into / List / Color / Align / Reset formatting / Duplicate / Copy / Delete.
// Plugin names only — the engine does not resolve "p"/"heading"/"pre" yet. The menu selects the whole block, so marks and copy apply to it.
// Custom actions are not recorded in history by the engine, so push it here to keep them undoable.
const notionBlockHandleMenu: NonNullable<SunEditorType.InitOptions["blockHandle"]>["menu"] = [
	"blockStyle",
	"list",
	"blockquote",
	"codeBlock",
	"fontColor",
	"backgroundColor",
	"align",
	"removeFormat",
	{
		title: "Duplicate",
		icon: "copy",
		action: ($, { block }) => {
			block.after(block.cloneNode(true));
			$.history.push(false);
		},
	},
	"copy",
	{
		title: "Delete",
		icon: "delete",
		action: ($, { block }) => {
			block.remove();
			$.history.push(false);
		},
	},
];

const NOTION_DEMO_VALUE = `<h1>📝 Notion-style editing</h1><p>Hover the left gutter to grab the <strong>⠿ block handle,</strong></p><p>— drag to reorder a block, or click <strong>+</strong> to add one below.</p><p>On an empty line, press <strong>/</strong> to open the slash command menu.</p><blockquote>Try <em>/heading</em>, <em>/quote</em>, <em>/code</em>, <em>/table</em> or <em>/image</em>.</blockquote><p></p>`;

const presetDefs: { id: string; tKey: string; tip?: string; value?: string; options: SunEditorType.InitOptions }[] = [
	{
		id: "classic",
		tKey: "classic",
		options: { toolbar_sticky: HEADER_HEIGHT, buttonList: HomeButtonList, subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "bottom",
		tKey: "bottom",
		options: { mode: "classic:bottom", statusbar: false, buttonList: HomeButtonList, subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "inline",
		tKey: "inline",
		options: { mode: "inline", toolbar_sticky: HEADER_HEIGHT, buttonList: HomeButtonList },
	},
	{
		id: "balloon",
		tKey: "balloon",
		options: { mode: "balloon", buttonList: balloonButtonList },
	},
	{
		id: "document",
		tKey: "document",
		options: {
			mode: "classic",
			type: "document:header,page",
			toolbar_sticky: HEADER_HEIGHT,
			buttonList: DocumentButtonList,
			subToolbar: { mode: "balloon", buttonList: subButtonList },
		},
	},
	{
		id: "notion",
		tKey: "notion",
		tip: "notionTip",
		value: NOTION_DEMO_VALUE,
		options: {
			mode: "classic",
			toolbar_sticky: HEADER_HEIGHT,
			buttonList: notionButtonList,
			innerWidth: "720px",
			placeholder_line: "Press '/' for commands",
			blockHandle: {
				menu: notionBlockHandleMenu,
				// v3.3.1: plus button inserts the line, then opens the slash command menu on it
				onPlusClick: ($, { block }) => $.plugins.slashCommand.open(block),
			},
			slashCommand: { triggerChar: "/", items: notionSlashItems },
			subToolbar: { mode: "balloon", buttonList: notionSubButtonList },
		},
	},
];

import { INTERACTIVE_DEMO_VALUE } from "@/data/snippets/pluginGuideSnippets";
const sampleValue = INTERACTIVE_DEMO_VALUE;

export default function InteractiveDemo() {
	const t = useTranslations("Home.InteractiveDemo");
	const tMenus = useTranslations("Main.Menus");
	const [activePreset, setActivePreset] = useState("classic");
	const [em, setEm] = useState<any>(null);
	const [katex, setKatex] = useState<unknown>(null);
	const preset = presetDefs.find((p) => p.id === activePreset)!;

	useEffect(() => {
		import("../plugin-guide/_examples/embed").then((mod) => setEm(() => mod.default));
		Promise.all([import("katex"), import("katex/dist/katex.min.css")]).then(([mod]) => setKatex(() => mod.default));
	}, []);

	return (
		<section className='container mx-auto px-6 pb-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6 }}
				className='mx-auto max-w-5xl'
			>
				<div className='mb-4 flex flex-wrap items-center justify-between gap-3'>
					<div className='flex max-w-full flex-wrap items-center gap-1 rounded-lg bg-muted/60 p-1'>
						{presetDefs.map((p) => (
							<button
								key={p.id}
								aria-pressed={activePreset === p.id}
								onClick={() => setActivePreset(p.id)}
								className={`group relative min-h-10 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
									activePreset === p.id
										? "bg-background text-foreground shadow-sm"
										: "text-muted-foreground hover:text-foreground"
								}`}
							>
								{t(p.tKey)}
								{p.tip && (
									<span
										role='tooltip'
										className='pointer-events-none absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-xs font-normal text-background opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100'
									>
										{t(p.tip)}
										<span className='absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-foreground' />
									</span>
								)}
							</button>
						))}
					</div>
					<Link href='/playground?p=full' className='inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'>
						{tMenus("playground")}
						<ArrowRight className='h-4 w-4 rtl:rotate-180' aria-hidden='true' />
					</Link>
				</div>
				<div style={{ minHeight: 258 }}>
					{katex ? (
						<SunEditor
							key={activePreset}
							value={preset.value ?? sampleValue}
							options={{ ...demoApiOptions, externalLibs: { katex: { src: katex } }, ...preset.options }}
						/>
					) : null}
				</div>
			</motion.div>
		</section>
	);
}
