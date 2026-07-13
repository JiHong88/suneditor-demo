"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SunEditor from "@/components/editor/suneditor";
import type { SunEditor as SunEditorType } from "suneditor/types";
import { DocumentButtonList } from "@/components/editor/buttonList";
import { HEADER_HEIGHT } from "@/lib/constants";

const subButtonList = [
	["bold", "underline", "italic", "strike", "subscript", "superscript"],
	"|",
	["fontColor", "backgroundColor"],
];

const inlineButtonList = [
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "underline", "italic", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["align", "list", "outdent", "indent"],
	"|",
	["table", "link", "image"],
	"|",
	["fullScreen", "codeView"],
];

const balloonButtonList = [
	["bold", "underline", "italic", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["link"],
];

/* ── Notion-like preset (Block handle + Slash command) ───── */

// Minimal top toolbar: history on the left, print/preview pushed to the right.
const notionButtonList = [["undo", "redo"], ["-right", "preview", "print"]];

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
		action: ($) => $.format.applyBlock(document.createElement("P")),
	},
	{ key: "h1", title: "Heading 1", icon: hIcon(1), keywords: ["title", "big"], action: ($) => $.format.applyBlock(document.createElement("H1")) },
	{ key: "h2", title: "Heading 2", icon: hIcon(2), keywords: ["subtitle"], action: ($) => $.format.applyBlock(document.createElement("H2")) },
	{ key: "h3", title: "Heading 3", icon: hIcon(3), keywords: ["subheading"], action: ($) => $.format.applyBlock(document.createElement("H3")) },
	"list_bulleted",
	"list_numbered",
	{ key: "quote", title: "Quote", icon: "blockquote", keywords: ["blockquote", "cite"], action: ($) => $.format.applyBlock(document.createElement("BLOCKQUOTE")) },
	{ key: "code", title: "Code", icon: "code_block", keywords: ["pre", "snippet"], action: ($) => $.format.applyBlock(document.createElement("PRE")) },
	"table",
	"image",
	"link",
	"hr",
];

// Block handle action menu — resolvable block formats + custom Duplicate / Delete actions.
const notionBlockHandleMenu: NonNullable<SunEditorType.InitOptions["blockHandle"]>["menu"] = [
	"p",
	"heading",
	"list",
	"blockquote",
	"pre",
	"align",
	{ title: "Duplicate", icon: "copy", action: (_$, { block }) => block.after(block.cloneNode(true)) },
	{ title: "Delete", icon: "delete", action: (_$, { block }) => block.remove() },
];

const NOTION_DEMO_VALUE = `<h1>📝 Notion-style editing</h1><p>Hover the left gutter to grab the <strong>⠿ block handle</strong> — drag to reorder a block, or click <strong>+</strong> to add one below.</p><p>On an empty line, press <strong>/</strong> to open the slash command menu.</p><blockquote>Try <em>/heading</em>, <em>/quote</em>, <em>/code</em>, <em>/table</em> or <em>/image</em>.</blockquote><p></p>`;

const presetDefs: { id: string; tKey: string; tip?: string; value?: string; options: SunEditorType.InitOptions }[] = [
	{
		id: "classic",
		tKey: "classic",
		options: { toolbar_sticky: HEADER_HEIGHT, subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "bottom",
		tKey: "bottom",
		options: { mode: "classic:bottom", subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "inline",
		tKey: "inline",
		options: { mode: "inline", toolbar_sticky: HEADER_HEIGHT, buttonList: inlineButtonList },
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
			blockHandle: { menu: notionBlockHandleMenu },
			slashCommand: { triggerChar: "/", items: notionSlashItems, limitSize: 12 },
			subToolbar: { mode: "balloon", buttonList: subButtonList },
		},
	},
];

import { INTERACTIVE_DEMO_VALUE } from "@/data/snippets/pluginGuideSnippets";
const sampleValue = INTERACTIVE_DEMO_VALUE;

export default function InteractiveDemo() {
	const t = useTranslations("Home.InteractiveDemo");
	const [activePreset, setActivePreset] = useState("classic");
	const [em, setEm] = useState<any>(null);
	const preset = presetDefs.find((p) => p.id === activePreset)!;

	useEffect(() => {
		import("../plugin-guide/_examples/embed").then((mod) => setEm(() => mod.default));
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
				<div className='mb-4 flex items-center gap-1 rounded-lg bg-muted/60 p-1 w-fit'>
					{presetDefs.map((p) => (
						<button
							key={p.id}
							onClick={() => setActivePreset(p.id)}
							className={`group relative rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
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
				<div style={{ minHeight: 258 }}>
					<SunEditor key={activePreset} value={preset.value ?? sampleValue} options={preset.options} />
				</div>
			</motion.div>
		</section>
	);
}
