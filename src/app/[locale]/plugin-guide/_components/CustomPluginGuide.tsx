"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, ChevronRight, Copy, Blocks, Cable, Zap, BookOpen, Layers, Workflow, Code2 } from "lucide-react";

import CodeBlock from "@/components/common/CodeBlock";
import QuickTryModal from "@/components/common/QuickTryModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PLUGIN_EXAMPLES, type PluginExample } from "../_examples";

import {
	QS_JS, QS_TS, QS_REGISTER,
	CODE_COMMAND, CODE_DROPDOWN, CODE_MODAL, CODE_FIELD,
	CODE_DROPDOWN_FREE, CODE_BROWSER, CODE_INPUT, CODE_POPUP,
	CODE_CONSTRUCTOR, CODE_EVENT_PRIORITY, CODE_EXTENDS_VS_IMPLEMENTS,
	CODE_CROSS_PLUGIN_JS, CODE_CROSS_PLUGIN_TS, CODE_MULTI_INTERFACE,
	CODE_REGISTRATION, CODE_PLUGIN_OPTIONS,
	CODE_COMPOSITE_FONTSIZE, CODE_COMPOSITE_LIST, CODE_JSDOC_PATTERNS,
	HTML_MODAL, HTML_DROPDOWN, HTML_CONTROLLER, HTML_BROWSER, HTML_POPUP,
} from "@/data/snippets/pluginGuideSnippets";

/* ══════════════════════════════════════════════════════
   Plugin Type Data
   ══════════════════════════════════════════════════════ */

type PluginTypeInfo = {
	className: string;
	type: string;
	color: string;
	required: string[];
	uiBehavior: string;
	examples: string;
	code?: string;
	/** Buttons to show in the quick-try editor */
	demoButtons?: string[];
	/** Demo HTML for quick-try */
	demoHtml?: string;
	/** Extra editor options for quick-try */
	editorOptions?: Record<string, unknown>;
};

const PLUGIN_TYPES: PluginTypeInfo[] = [
	{
		className: "PluginCommand",
		type: "command",
		color: "amber",
		required: ["action()"],
		uiBehavior: "Button click executes action immediately",
		examples: "blockquote, hr, strike",
		code: CODE_COMMAND,
		demoButtons: ["blockquote", "hr", "strike", "subscript", "superscript"],
		demoHtml: "<p>Select text and click a command button.</p><p>These are pure command-type plugins that execute immediately on click.</p>",
	},
	{
		className: "PluginDropdown",
		type: "dropdown",
		color: "sky",
		required: ["action()"],
		uiBehavior: "Button opens menu, item click calls action()",
		examples: "align, font, blockStyle",
		code: CODE_DROPDOWN,
		demoButtons: ["align", "font", "blockStyle"],
		demoHtml: "<p>Click a dropdown button to see the menu open. Select an item to apply.</p>",
	},
	{
		className: "PluginDropdownFree",
		type: "dropdown-free",
		color: "indigo",
		required: [],
		uiBehavior: "Button opens menu, plugin handles own events",
		examples: "table, fontColor, codeBlock",
		code: CODE_DROPDOWN_FREE,
		demoButtons: ["table", "fontColor", "backgroundColor", "codeBlock"],
		demoHtml: "<p>These plugins manage their own event handling within the dropdown panel.</p>",
	},
	{
		className: "PluginModal",
		type: "modal",
		color: "violet",
		required: ["open()", "modalAction()"],
		uiBehavior: "Button opens modal dialog",
		examples: "link, image, video",
		code: CODE_MODAL,
		demoButtons: ["link", "image", "video"],
		demoHtml: "<p>Click a modal-type button to open a dialog for inserting content.</p>",
	},
	{
		className: "PluginBrowser",
		type: "browser",
		color: "purple",
		required: ["open()", "close()"],
		uiBehavior: "Button opens gallery/browser interface",
		examples: "imageGallery",
		code: CODE_BROWSER,
		demoButtons: ["imageGallery"],
		demoHtml: "<p>Browser plugins open a gallery or file browser interface.</p>",
	},
	{
		className: "PluginField",
		type: "field",
		color: "rose",
		required: [],
		uiBehavior: "Responds to editor input events",
		examples: "mention",
		code: CODE_FIELD,
		demoButtons: ["bold", "italic"],
		demoHtml: "<p>Field plugins respond to editor input events. Type <strong>@</strong> to trigger mention detection (mention plugin example).</p>",
	},
	{
		className: "PluginInput",
		type: "input",
		color: "teal",
		required: [],
		uiBehavior: "Toolbar input element (not a button)",
		examples: "pageNavigator",
		code: CODE_INPUT,
		demoButtons: ["pageNavigator", "pageUp", "pageDown", "pageBreak"],
		demoHtml: "<p>Input plugins render directly in the toolbar as input elements rather than buttons.</p><p>The pageNavigator shows a page navigation input.</p>",
		editorOptions: { type: "document:page" },
	},
	{
		className: "PluginPopup",
		type: "popup",
		color: "emerald",
		required: ["show()", "controllerAction()"],
		uiBehavior: "Inline popup context menu",
		examples: "anchor",
		code: CODE_POPUP,
		demoButtons: ["link", "anchor"],
		demoHtml: '<p>Popup plugins show inline context menus. Try inserting a <a href="https://example.com">link</a> and clicking on it to see the anchor popup.</p>',
	},
];

/* ── Cross-Plugin Composite Types ─────────────────── */

type CompositePluginInfo = {
	name: string;
	baseType: string;
	implements: string[];
	color: string;
	desc: string;
	code?: string;
	demoButtons?: string[];
	demoHtml?: string;
};

const COMPOSITE_PLUGINS: CompositePluginInfo[] = [
	{
		name: "fontSize",
		baseType: "PluginInput",
		implements: ["PluginCommand", "PluginDropdown"],
		color: "orange",
		desc: "Input field + dropdown list + command (inc/dec) all controlling font size.",
		code: CODE_COMPOSITE_FONTSIZE,
		demoButtons: ["fontSize"],
		demoHtml: "<p style='font-size: 16px'>fontSize combines Input, Dropdown, and Command types. Try the input field, dropdown, and increment/decrement buttons.</p>",
	},
	{
		name: "list_bulleted / list_numbered",
		baseType: "PluginCommand",
		implements: ["PluginDropdown"],
		color: "orange",
		desc: "Command button for toggling list + dropdown for selecting list style.",
		code: CODE_COMPOSITE_LIST,
		demoButtons: ["list_bulleted", "list_numbered"],
		demoHtml: "<p>List plugins combine Command (toggle list on/off) and Dropdown (select list style) types.</p><p>Click the button to toggle, or the arrow to see style options.</p>",
	},
];

const PLUGIN_TYPE_COLOR: Record<string, string> = {
	PluginCommand: "amber",
	PluginDropdown: "sky",
	PluginDropdownFree: "indigo",
	PluginModal: "violet",
	PluginBrowser: "purple",
	PluginField: "rose",
	PluginInput: "teal",
	PluginPopup: "emerald",
	Composite: "orange",
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
	amber: {
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		border: "border-amber-300 dark:border-amber-700",
		dot: "bg-amber-500",
	},
	sky: {
		bg: "bg-sky-500/10",
		text: "text-sky-600 dark:text-sky-400",
		border: "border-sky-300 dark:border-sky-700",
		dot: "bg-sky-500",
	},
	indigo: {
		bg: "bg-indigo-500/10",
		text: "text-indigo-600 dark:text-indigo-400",
		border: "border-indigo-300 dark:border-indigo-700",
		dot: "bg-indigo-500",
	},
	violet: {
		bg: "bg-violet-500/10",
		text: "text-violet-600 dark:text-violet-400",
		border: "border-violet-300 dark:border-violet-700",
		dot: "bg-violet-500",
	},
	purple: {
		bg: "bg-purple-500/10",
		text: "text-purple-600 dark:text-purple-400",
		border: "border-purple-300 dark:border-purple-700",
		dot: "bg-purple-500",
	},
	rose: {
		bg: "bg-rose-500/10",
		text: "text-rose-600 dark:text-rose-400",
		border: "border-rose-300 dark:border-rose-700",
		dot: "bg-rose-500",
	},
	teal: {
		bg: "bg-teal-500/10",
		text: "text-teal-600 dark:text-teal-400",
		border: "border-teal-300 dark:border-teal-700",
		dot: "bg-teal-500",
	},
	orange: {
		bg: "bg-orange-500/10",
		text: "text-orange-600 dark:text-orange-400",
		border: "border-orange-300 dark:border-orange-700",
		dot: "bg-orange-500",
	},
	emerald: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		border: "border-emerald-300 dark:border-emerald-700",
		dot: "bg-emerald-500",
	},
};

/* ══════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════ */

const ACCENT_BORDER: Record<string, string> = {
	slate: "border-s-2 border-s-slate-400/50",
	sky: "border-s-2 border-s-sky-500/50",
	violet: "border-s-2 border-s-violet-500/50",
	amber: "border-s-2 border-s-amber-500/50",
	emerald: "border-s-2 border-s-emerald-500/50",
	rose: "border-s-2 border-s-rose-500/50",
	teal: "border-s-2 border-s-teal-500/50",
};

function RefTable({ headers, rows, accent }: { headers: ReactNode[]; rows: ReactNode[][]; accent?: string }) {
	return (
		<div className={`overflow-x-auto rounded-lg border ${accent ? ACCENT_BORDER[accent] || "" : ""}`}>
			<table className='w-full text-sm'>
				<thead>
					<tr className='bg-muted/60 border-b'>
						{headers.map((h, i) => (
							<th
								key={i}
								className='px-3 py-2.5 text-start font-semibold text-muted-foreground text-[11px] uppercase tracking-wider'
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr
							key={i}
							className='border-b last:border-0 hover:bg-muted/30 transition-colors even:bg-muted/10'
						>
							{row.map((cell, j) => (
								<td key={j} className='px-3 py-2.5 align-top'>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function SectionLabel({ children }: { children: ReactNode }) {
	return <h4 className='text-sm font-semibold text-foreground mt-6 mb-3 flex items-center gap-2'>{children}</h4>;
}

function CodePanel({ code, lang = "javascript" }: { code: string; lang?: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [code]);

	return (
		<div className='relative group rounded-lg overflow-hidden border text-xs [&_pre]:!p-3'>
			<button
				onClick={handleCopy}
				className='absolute top-2 right-2 z-10 p-1.5 rounded-md bg-background/80 border border-border/50 opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-150'
				aria-label='Copy code'
			>
				{copied ? (
					<Check className='h-3.5 w-3.5 text-emerald-500' />
				) : (
					<Copy className='h-3.5 w-3.5 text-muted-foreground' />
				)}
			</button>
			<CodeBlock code={code} lang={lang} />
		</div>
	);
}

function PluginTypeCard({ info, t, onTry }: { info: PluginTypeInfo; t: ReturnType<typeof useTranslations>; onTry?: (info: PluginTypeInfo) => void }) {
	const [open, setOpen] = useState(false);
	const c = COLOR_MAP[info.color];

	return (
		<div className={`rounded-lg border overflow-hidden`}>
			<div className='flex items-start gap-3 p-4'>
				<span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 flex-wrap'>
						<code className={`text-sm font-bold ${c.text}`}>{info.className}</code>
						<Badge variant='outline' className='text-[10px] px-1.5 py-0 font-mono'>
							{info.type}
						</Badge>
						{info.required.length > 0 && (
							<span className='text-[10px] text-muted-foreground'>
								{t("required")}: <code className='font-mono'>{info.required.join(", ")}</code>
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>{info.uiBehavior}</p>
					<p className='text-[11px] text-muted-foreground/70 mt-0.5'>
						{t("builtInExamples")}: <span className='font-mono'>{info.examples}</span>
					</p>
				</div>
				<div className='flex items-center gap-1 shrink-0'>
					{info.demoButtons && onTry && (
						<button
							onClick={() => onTry(info)}
							className='flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-md hover:bg-primary/5 cursor-pointer'
						>
							<Zap className='h-3 w-3' />
							{t("tryExample")}
						</button>
					)}
					{info.code && (
						<button
							onClick={() => setOpen(!open)}
							className='flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted cursor-pointer'
						>
							{open ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
							{open ? t("hideCode") : t("viewCode")}
						</button>
					)}
				</div>
			</div>
			{info.code && open && (
				<div className={`border-t ${c.bg} px-4 py-3`}>
					<CodePanel code={info.code} />
				</div>
			)}
		</div>
	);
}

/* ══════════════════════════════════════════════════════
   Tab Contents
   ══════════════════════════════════════════════════════ */

function CompositePluginCard({ info, t, onTry }: { info: CompositePluginInfo; t: ReturnType<typeof useTranslations>; onTry?: (info: CompositePluginInfo) => void }) {
	const [open, setOpen] = useState(false);
	const c = COLOR_MAP[info.color];
	return (
		<div className={`rounded-lg border overflow-hidden`}>
			<div className='flex items-start gap-3 p-4'>
				<span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 flex-wrap'>
						<code className={`text-sm font-bold ${c.text}`}>{info.name}</code>
						<Badge variant='outline' className='text-[10px] px-1.5 py-0 font-mono'>
							extends {info.baseType}
						</Badge>
						{info.implements.map((impl) => (
							<Badge key={impl} variant='secondary' className='text-[10px] px-1.5 py-0 font-mono'>
								+ {impl}
							</Badge>
						))}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>{info.desc}</p>
				</div>
				<div className='flex items-center gap-1 shrink-0'>
					{info.demoButtons && onTry && (
						<button
							onClick={() => onTry(info)}
							className='flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-md hover:bg-primary/5 cursor-pointer'
						>
							<Zap className='h-3 w-3' />
							{t("tryExample")}
						</button>
					)}
					{info.code && (
						<button
							onClick={() => setOpen(!open)}
							className='flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted cursor-pointer'
						>
							{open ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
							{open ? t("hideCode") : t("viewCode")}
						</button>
					)}
				</div>
			</div>
			{open && info.code && (
				<div className='border-t bg-muted/30 px-4 py-3'>
					<CodePanel code={info.code} />
				</div>
			)}
		</div>
	);
}

function TypesTab({ t, onTryType, onTryComposite }: { t: ReturnType<typeof useTranslations>; onTryType: (info: PluginTypeInfo) => void; onTryComposite: (info: CompositePluginInfo) => void }) {
	return (
		<div className='space-y-3'>
			<p className='text-sm text-muted-foreground mb-4'>{t("typesDesc")}</p>
			{PLUGIN_TYPES.map((info) => (
				<PluginTypeCard key={info.className} info={info} t={t} onTry={onTryType} />
			))}

			{/* Cross-Plugin Composite */}
			<div className='mt-8'>
				<SectionLabel>
					<Workflow className='h-4 w-4' />
					{t("crossPlugin")}
				</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("crossPluginDesc")}</p>
				<div className='space-y-3'>
					{COMPOSITE_PLUGINS.map((info) => (
						<CompositePluginCard key={info.name} info={info} t={t} onTry={onTryComposite} />
					))}
				</div>
			</div>
		</div>
	);
}

function AnatomyTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* Static Properties */}
			<div>
				<SectionLabel>{t("staticProps")}</SectionLabel>
				<RefTable
					headers={["Property", "Type", "Required", "Description"]}
					rows={[
						[
							<code key='c0'>key</code>,
							<code key='c1'>string</code>,
							<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
								Yes
							</Badge>,
							"Unique plugin identifier. Must match the name used in buttonList.",
						],
						[
							<code key='c0'>type</code>,
							<code key='c1'>string</code>,
							"Inherited",
							"Set by the base class. Do not override.",
						],
						[
							<code key='c0'>className</code>,
							<code key='c1'>string</code>,
							"No",
							"CSS class added to the plugin's toolbar button.",
						],
						[
							<code key='c0'>options</code>,
							<code key='c1'>object</code>,
							"No",
							"Plugin behavior options (eventIndex, isInputComponent, etc.)",
						],
						[
							<code key='c0'>component(node)</code>,
							<code key='c1'>function</code>,
							"If EditorComponent",
							"Detects component DOM nodes. Returns element or null.",
						],
					]}
				/>
			</div>

			{/* Constructor */}
			<div>
				<SectionLabel>{t("constructor")}</SectionLabel>
				<CodePanel code={CODE_CONSTRUCTOR} />
			</div>

			{/* Dependency Bag */}
			<div>
				<SectionLabel>{t("depsBag")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("depsBagDesc")}</p>

				<div className='space-y-5'>
					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-slate-500' />
							<span className='text-slate-600 dark:text-slate-400'>{t("config")}</span>
						</h5>
						<RefTable
							accent='slate'
							headers={["Property", "Type", "Description"]}
							rows={[
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										options
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Global editor options (shared across all frames)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameOptions
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Current frame's options (width, height, placeholder)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										context
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Global context (toolbar, statusbar, modal overlay elements)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameContext
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Current frame context (wysiwyg, code, readonly state)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameRoots
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"All frame contexts keyed by rootKey",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										lang
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										object
									</code>,
									"Language strings (e.g., this.$.lang.image)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										icons
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										object
									</code>,
									"Icon HTML strings (e.g., this.$.icons.bold)",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-sky-500' />
							<span className='text-sky-600 dark:text-sky-400'>{t("domLogic")}</span>
						</h5>
						<RefTable
							accent='sky'
							headers={["Property", "Description"]}
							rows={[
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										selection
									</code>,
									"Selection and range manipulation",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										html
									</code>,
									"HTML get/set, insert, sanitization",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										format
									</code>,
									"Block-level formatting (applyBlock, removeBlock, getLines)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										inline
									</code>,
									"Inline formatting (bold, italic, styles)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										listFormat
									</code>,
									"List operations (create, edit, nested)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										nodeTransform
									</code>,
									"DOM node transformations",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										char
									</code>,
									"Character counting and limits",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										offset
									</code>,
									"Position calculations",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-violet-500' />
							<span className='text-violet-600 dark:text-violet-400'>{t("shellLogic")}</span>
						</h5>
						<RefTable
							accent='violet'
							headers={["Property", "Description"]}
							rows={[
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										component
									</code>,
									"Component lifecycle (select, deselect, setInfo)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										focusManager
									</code>,
									"Focus/blur management",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										pluginManager
									</code>,
									"Plugin registry and lifecycle",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										plugins
									</code>,
									"Plugin instances map (e.g., this.$.plugins.image)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										ui
									</code>,
									"UI state (loading, alerts, toast, theme)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										commandDispatcher
									</code>,
									"Command routing and execution",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										history
									</code>,
									"Undo/redo stack (push, undo, redo)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										shortcuts
									</code>,
									"Keyboard shortcut mapping",
								],
							]}
						/>
					</div>

					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-amber-500' />
								<span className='text-amber-600 dark:text-amber-400'>{t("panelLogic")}</span>
							</h5>
							<RefTable
								accent='amber'
								headers={["Property", "Description"]}
								rows={[
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											toolbar
										</code>,
										"Main toolbar renderer",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											subToolbar
										</code>,
										"Sub-toolbar",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											menu
										</code>,
										"Dropdown menu management",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											viewer
										</code>,
										"Code view, fullscreen, preview",
									],
								]}
							/>
						</div>
						<div>
							<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-emerald-500' />
								<span className='text-emerald-600 dark:text-emerald-400'>{t("services")}</span>
							</h5>
							<RefTable
								accent='emerald'
								headers={["Property", "Description"]}
								rows={[
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											eventManager
										</code>,
										"Public event API",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											contextProvider
										</code>,
										"Context Map management",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											optionProvider
										</code>,
										"Options Map management",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											store
										</code>,
										"Central runtime state store",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											facade
										</code>,
										"The editor public API instance",
									],
								]}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function HooksTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* JSDoc Annotation Patterns */}
			<div>
				<SectionLabel>{t("jsdocPatterns")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("jsdocPatternsDesc")}</p>
				<CodePanel code={CODE_JSDOC_PATTERNS} />
				<div className='mt-3 overflow-x-auto rounded-lg border'>
					<table className='w-full text-xs'>
						<thead>
							<tr className='border-b bg-muted/50'>
								<th className='text-start p-2 font-medium'>Pattern</th>
								<th className='text-start p-2 font-medium'>@hook / @override / @imple</th>
								<th className='text-start p-2 font-medium'>@type Namespace</th>
							</tr>
						</thead>
						<tbody className='divide-y'>
							<tr>
								<td className='p-2'>Event hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.EventManager</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Event.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Core hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.Core</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Core.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Component hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.Component</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Component.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Modal hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Modules.Modal</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Modal.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Controller hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Modules.Controller</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Controller.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Base overrides</td>
								<td className='p-2'>
									<code className='text-[10px]'>@override</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										{"PluginType['method']"}
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Cross-plugin</td>
								<td className='p-2'>
									<code className='text-[10px]'>@imple PluginType</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										{"PluginType['method']"}
									</code>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Common Hooks */}
			<div>
				<SectionLabel>{t("commonHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("commonHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "When Called", "Return"]}
					rows={[
						[
							<code key='c0'>active(element, target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.Active
							</code>,
							"Cursor position changes",
							<code key='c2'>boolean | undefined</code>,
						],
						[
							<code key='c0'>init()</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.Init
							</code>,
							"Editor init / resetOptions",
							<code key='c2'>void</code>,
						],
						[
							<code key='c0'>retainFormat()</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.RetainFormat
							</code>,
							"HTML cleaning/validation",
							<code key='c2'>{"{query, method}"}</code>,
						],
						[
							<code key='c0'>shortcut(params)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.Shortcut
							</code>,
							"Shortcut triggered",
							<code key='c2'>void</code>,
						],
						[
							<code key='c0'>setDir(dir)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.SetDir
							</code>,
							"RTL/LTR change",
							<code key='c2'>void</code>,
						],
					]}
				/>
			</div>

			{/* Event Hooks */}
			<div>
				<SectionLabel>{t("eventHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("eventHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "Interruptible", "Params"]}
					rows={[
						[
							<code key='c0'>onKeyDown</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnKeyDown
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.KeyEvent
							</code>,
						],
						[
							<code key='c0'>onKeyUp</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnKeyUp
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.KeyEvent
							</code>,
						],
						[
							<code key='c0'>onMouseDown</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnMouseDown
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onClick</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnClick
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onPaste</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnPaste
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.Paste
							</code>,
						],
						[
							<code key='c0'>onBeforeInput</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnBeforeInput
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.InputWithData
							</code>,
						],
						[
							<code key='c0'>onInput</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnInput
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.InputWithData
							</code>,
						],
						[
							<code key='c0'>onMouseUp</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnMouseUp
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onFocus</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnFocus
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FocusBlur
							</code>,
						],
						[
							<code key='c0'>onBlur</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnBlur
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FocusBlur
							</code>,
						],
						[
							<code key='c0'>onScroll</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnScroll
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.Scroll
							</code>,
						],
						[
							<code key='c0'>onFilePasteAndDrop</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnFilePasteAndDrop
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FilePasteDrop
							</code>,
						],
					]}
				/>
				<div className='mt-3'>
					<p className='text-[11px] text-muted-foreground mb-2'>
						Event execution priority can be controlled per-plugin:
					</p>
					<CodePanel code={CODE_EVENT_PRIORITY} />
				</div>
			</div>

			{/* Module Hooks */}
			<div>
				<SectionLabel>{t("moduleHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("moduleHooksDesc")}</p>

				<div className='space-y-4'>
					<div>
						<h5 className='text-xs font-semibold mb-2'>
							<code className='text-violet-600 dark:text-violet-400'>ModuleModal</code>
							<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-2'>
								@implements SunEditor.Hook.Modal
							</code>
						</h5>
						<RefTable
							headers={["Hook", "JSDoc Type", "Required", "When"]}
							rows={[
								[
									<code key='c0'>modalAction()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Action
									</code>,
									<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
										Yes
									</Badge>,
									"Form submit",
								],
								[
									<code key='c0'>modalOn(isUpdate)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.On
									</code>,
									"No",
									"After modal opens",
								],
								[
									<code key='c0'>modalInit()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Init
									</code>,
									"No",
									"Before modal opens/closes",
								],
								[
									<code key='c0'>modalOff(isUpdate)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Off
									</code>,
									"No",
									"After modal closes",
								],
								[
									<code key='c0'>modalResize()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Resize
									</code>,
									"No",
									"Modal resized",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold mb-2'>
							<code className='text-sky-600 dark:text-sky-400'>ModuleController</code>
							<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-2'>
								@implements SunEditor.Hook.Controller
							</code>
						</h5>
						<RefTable
							headers={["Hook", "JSDoc Type", "Required", "When"]}
							rows={[
								[
									<code key='c0'>controllerAction(target)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.Action
									</code>,
									<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
										Yes
									</Badge>,
									"Button clicked",
								],
								[
									<code key='c0'>controllerOn(form, target)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.On
									</code>,
									"No",
									"After controller opens",
								],
								[
									<code key='c0'>controllerClose()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.Close
									</code>,
									"No",
									"Before controller closes",
								],
							]}
						/>
					</div>

					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<h5 className='text-xs font-semibold mb-2'>
								<code className='text-teal-600 dark:text-teal-400'>ModuleColorPicker</code>
								<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-1'>
									Hook.ColorPicker
								</code>
							</h5>
							<RefTable
								headers={["Hook", "JSDoc Type"]}
								rows={[
									[
										<code key='c0'>colorPickerAction(color)</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.Action
										</code>,
									],
									[
										<code key='c0'>colorPickerHueSliderOpen()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.HueSliderOpen
										</code>,
									],
									[
										<code key='c0'>colorPickerHueSliderClose()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.HueSliderClose
										</code>,
									],
								]}
							/>
						</div>
						<div>
							<h5 className='text-xs font-semibold mb-2'>
								<code className='text-amber-600 dark:text-amber-400'>ModuleHueSlider</code>
								<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-1'>
									Hook.HueSlider
								</code>
							</h5>
							<RefTable
								headers={["Hook", "JSDoc Type"]}
								rows={[
									[
										<code key='c0'>hueSliderAction()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.HueSlider.Action
										</code>,
									],
									[
										<code key='c0'>hueSliderCancelAction()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.HueSlider.CancelAction
										</code>,
									],
								]}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Component Hooks */}
			<div>
				<SectionLabel>{t("componentHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("componentHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "Required", "When"]}
					rows={[
						[
							<code key='c0'>componentSelect(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Select
							</code>,
							<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
								Yes
							</Badge>,
							"Component selected (clicked)",
						],
						[
							<code key='c0'>componentDeselect(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Deselect
							</code>,
							"No",
							"Component deselected",
						],
						[
							<code key='c0'>componentEdit(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Edit
							</code>,
							"No",
							"Edit button clicked",
						],
						[
							<code key='c0'>componentDestroy(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Destroy
							</code>,
							"No",
							"Component deleted",
						],
						[
							<code key='c0'>componentCopy(params)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Copy
							</code>,
							"No",
							"Copy requested",
						],
					]}
				/>
				<div className='mt-3 p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground'>
					<strong className='text-foreground'>Requirements:</strong> Define{" "}
					<code className='bg-muted px-1 rounded'>static component(node)</code> to detect nodes, and a public{" "}
					<code className='bg-muted px-1 rounded'>_element</code> property referencing the current DOM
					element.
				</div>
			</div>
		</div>
	);
}

function ModulesTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* extends vs implements */}
			<div>
				<SectionLabel>{t("extendsVsImplements")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("extendsVsImplementsDesc")}</p>
				<div className='grid sm:grid-cols-2 gap-3 mb-5'>
					<div className='p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'>
						<div className='flex items-center gap-2 mb-2'>
							<code className='text-xs font-bold text-blue-700 dark:text-blue-400'>extends</code>
							<Badge variant='outline' className='text-[9px] px-1.5 py-0'>
								1 per plugin
							</Badge>
						</div>
						<p className='text-[11px] text-muted-foreground leading-relaxed'>{t("extendsExplain")}</p>
						<div className='mt-2 font-mono text-[10px] text-blue-600 dark:text-blue-400 space-y-0.5'>
							<div>PluginCommand, PluginModal,</div>
							<div>PluginDropdown, PluginField, ...</div>
						</div>
					</div>
					<div className='p-3 rounded-lg border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800'>
						<div className='flex items-center gap-2 mb-2'>
							<code className='text-xs font-bold text-violet-700 dark:text-violet-400'>implements</code>
							<Badge variant='outline' className='text-[9px] px-1.5 py-0'>
								multiple
							</Badge>
						</div>
						<p className='text-[11px] text-muted-foreground leading-relaxed'>{t("implementsExplain")}</p>
						<div className='mt-2 font-mono text-[10px] text-violet-600 dark:text-violet-400 space-y-0.5'>
							<div>ModuleModal, EditorComponent,</div>
							<div>fontSize, anchor, ...</div>
						</div>
					</div>
				</div>
				<CodePanel code={CODE_EXTENDS_VS_IMPLEMENTS} lang='typescript' />
			</div>

			{/* Cross-Plugin Composition */}
			<div>
				<SectionLabel>{t("crossPlugin")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("crossPluginDesc")}</p>
				<Tabs defaultValue='js'>
					<TabsList className='h-8 gap-1 mb-2'>
						<TabsTrigger value='js' className='text-xs h-7 px-3'>
							JavaScript
						</TabsTrigger>
						<TabsTrigger value='ts' className='text-xs h-7 px-3'>
							TypeScript
						</TabsTrigger>
					</TabsList>
					<TabsContent value='js' className='m-0'>
						<CodePanel code={CODE_CROSS_PLUGIN_JS} />
					</TabsContent>
					<TabsContent value='ts' className='m-0'>
						<CodePanel code={CODE_CROSS_PLUGIN_TS} lang='typescript' />
					</TabsContent>
				</Tabs>
				<p className='mt-2 text-[11px] text-muted-foreground italic'>{t("crossPluginNote")}</p>
			</div>

			{/* Available Modules */}
			<div>
				<SectionLabel>{t("modulesRef")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("modulesRefDesc")}</p>
				<RefTable
					headers={["Module", "Import Path", "Constructor", "Purpose"]}
					rows={[
						[
							<code key='c0'>Modal</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Modal
							</code>,
							<code key='c2' className='text-[10px]'>
								new Modal(inst, $, el)
							</code>,
							"Dialog windows",
						],
						[
							<code key='c0'>Controller</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Controller
							</code>,
							<code key='c2' className='text-[10px]'>
								new Controller(inst, $, el, opts?)
							</code>,
							"Floating tooltip controllers",
						],
						[
							<code key='c0'>Figure</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Figure
							</code>,
							<code key='c2' className='text-[10px]'>
								new Figure(inst, $, controls, opts?)
							</code>,
							"Resize/align wrapper",
						],
						[
							<code key='c0'>ColorPicker</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/ColorPicker
							</code>,
							<code key='c2' className='text-[10px]'>
								new ColorPicker(inst, $, ...)
							</code>,
							"Color palette UI",
						],
						[
							<code key='c0'>HueSlider</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/HueSlider
							</code>,
							<code key='c2' className='text-[10px]'>
								new HueSlider(inst, $, ...)
							</code>,
							"HSL color wheel",
						],
						[
							<code key='c0'>Browser</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Browser
							</code>,
							<code key='c2' className='text-[10px]'>
								new Browser(inst, $, ...)
							</code>,
							"Gallery/file browser UI",
						],
						[
							<code key='c0'>FileManager</code>,
							<code key='c1' className='text-[11px]'>
								modules/manager/FileManager
							</code>,
							<code key='c2' className='text-[10px]'>
								new FileManager(inst, $, opts)
							</code>,
							"File upload management",
						],
						[
							<code key='c0'>ApiManager</code>,
							<code key='c1' className='text-[11px]'>
								modules/manager/ApiManager
							</code>,
							<code key='c2' className='text-[10px]'>
								new ApiManager(inst, $, ...)
							</code>,
							"XHR/fetch management",
						],
						[
							<code key='c0'>SelectMenu</code>,
							<code key='c1' className='text-[11px]'>
								modules/ui/SelectMenu
							</code>,
							<code key='c2' className='text-[10px]'>
								new SelectMenu(...)
							</code>,
							"Custom dropdown menus",
						],
						[
							<code key='c0'>ModalAnchorEditor</code>,
							<code key='c1' className='text-[11px]'>
								modules/ui/ModalAnchorEditor
							</code>,
							<code key='c2' className='text-[10px]'>
								new ModalAnchorEditor($, modal, opts)
							</code>,
							"Link/anchor form",
						],
					]}
				/>
				<div className='mt-3 p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground'>
					<strong className='text-foreground'>Constructor pattern:</strong> All contract modules receive{" "}
					<code className='bg-muted px-1 rounded'>inst</code> (plugin instance),{" "}
					<code className='bg-muted px-1 rounded'>$</code> (deps bag), and module-specific parameters.
				</div>
			</div>

			{/* Multi-Interface Pattern */}
			<div>
				<SectionLabel>{t("multiInterface")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("multiInterfaceDesc")}</p>
				<CodePanel code={CODE_MULTI_INTERFACE} lang='typescript' />
				<p className='mt-2 text-[11px] text-muted-foreground italic'>
					In JavaScript, simply implement the methods — no{" "}
					<code className='bg-muted px-1 rounded'>implements</code> keyword needed. The editor calls methods
					by name regardless of declared interfaces.
				</p>
			</div>
		</div>
	);
}

type HtmlStructureInfo = {
	key: string;
	color: string;
	code: string;
	classes: { cls: string; desc: string }[];
	dataAttrs?: { attr: string; desc: string }[];
	notes?: string;
};

const HTML_STRUCTURES: HtmlStructureInfo[] = [
	{
		key: "modal",
		color: "violet",
		code: HTML_MODAL,
		classes: [
			{ cls: "se-modal-content", desc: "Root wrapper — required on the element passed to new Modal()" },
			{ cls: "se-modal-header", desc: "Header section" },
			{ cls: "se-close-btn", desc: "Close button (not se-modal-close)" },
			{ cls: "se-modal-title", desc: "Title text" },
			{ cls: "se-modal-body", desc: "Main content area" },
			{ cls: "se-modal-form", desc: "Form group wrapper" },
			{ cls: "se-input-form", desc: "Standard text input" },
			{ cls: "se-input-select", desc: "Standard select dropdown" },
			{ cls: "se-input-control", desc: "Size/position input (small)" },
			{ cls: "se-modal-footer", desc: "Footer with submit button" },
			{ cls: "se-btn-primary", desc: "Submit button" },
			{ cls: "se-modal-hr", desc: "Horizontal divider line" },
		],
		dataAttrs: [
			{ attr: 'data-command="close"', desc: "Triggers modal close" },
			{ attr: "data-focus", desc: "Auto-focused when modal opens" },
		],
		notes: "The Modal module auto-wraps in se-modal-area > se-modal-inner. You only build the se-modal-content element.",
	},
	{
		key: "dropdown",
		color: "sky",
		code: HTML_DROPDOWN,
		classes: [
			{ cls: "se-dropdown", desc: "Root dropdown wrapper" },
			{ cls: "se-list-layer", desc: "Layer class (always paired with se-dropdown)" },
			{ cls: "se-list-inner", desc: "Inner scroll wrapper" },
			{ cls: "se-list-basic", desc: "Standard list (ul)" },
			{ cls: "se-btn-list", desc: "List item button" },
			{ cls: "se-list-icon", desc: "Icon in list item (span)" },
			{ cls: "se-sub-list", desc: "Submenu/sub-list item" },
		],
		dataAttrs: [
			{ attr: "data-command", desc: "Value passed to action(target)" },
			{ attr: "data-txt", desc: "Text representation of item" },
		],
		notes: "Register via this.$.menu.initDropdownTarget(PluginClass, menuElement). PluginDropdown routes clicks to action(), PluginDropdownFree requires manual event binding.",
	},
	{
		key: "controller",
		color: "amber",
		code: HTML_CONTROLLER,
		classes: [
			{ cls: "se-controller", desc: "Root controller wrapper" },
			{ cls: "se-controller-${kind}", desc: "Variant (e.g., se-controller-link)" },
			{ cls: "se-arrow", desc: "Arrow pointing to element" },
			{ cls: "se-arrow-up / se-arrow-down", desc: "Arrow direction" },
			{ cls: "se-btn-group", desc: "Button group container" },
			{ cls: "se-tooltip", desc: "Tooltip wrapper on buttons" },
			{ cls: "se-tooltip-inner > se-tooltip-text", desc: "Tooltip content" },
		],
		dataAttrs: [
			{ attr: "data-command", desc: "Dispatched to controllerAction(target)" },
			{ attr: 'tabindex="-1"', desc: "Keep out of tab order" },
		],
		notes: "Figure module builds its own controller with resize/align buttons. Use standalone Controller for simpler cases (e.g., link popup).",
	},
	{
		key: "browser",
		color: "purple",
		code: HTML_BROWSER,
		classes: [
			{ cls: "se-browser", desc: "Root browser wrapper" },
			{ cls: "se-browser-back", desc: "Backdrop overlay" },
			{ cls: "se-browser-content", desc: "Content section" },
			{ cls: "se-browser-header", desc: "Header with close button" },
			{ cls: "se-browser-close", desc: "Close button" },
			{ cls: "se-browser-wrapper", desc: "Main wrapper (side + main)" },
			{ cls: "se-browser-side", desc: "Sidebar/folder tree" },
			{ cls: "se-browser-main", desc: "Main content area" },
			{ cls: "se-browser-search-form", desc: "Search input form" },
			{ cls: "se-browser-list", desc: "File/item list grid" },
			{ cls: "se-file-item-column", desc: "Column item container" },
			{ cls: "se-file-item-img", desc: "Item image wrapper" },
		],
		dataAttrs: [
			{ attr: "data-command", desc: "Source URL or folder path on items" },
			{ attr: "data-name", desc: "Display name" },
			{ attr: "data-type", desc: "File type (image, video, etc.)" },
		],
		notes: "Browser module handles layout, search, and folder tree automatically. Provide data, drawItemHandler, and selectorHandler in config.",
	},
	{
		key: "popup",
		color: "teal",
		code: HTML_POPUP,
		classes: [
			{ cls: "se-controller", desc: "Root controller wrapper" },
			{ cls: "se-controller-${kind}", desc: "Variant class (e.g., se-controller-link)" },
			{ cls: "se-controller-simple-input", desc: "Input form variant" },
			{ cls: "se-arrow", desc: "Arrow pointing to target element" },
			{ cls: "se-arrow-up / se-arrow-down", desc: "Arrow direction" },
			{ cls: "link-content", desc: "Content wrapper" },
			{ cls: "se-controller-display", desc: "Display area (label, id, etc.)" },
			{ cls: "se-btn-group", desc: "Button group container" },
			{ cls: "se-form-group", desc: "Form group (input variant)" },
			{ cls: "se-btn-success / se-btn-danger", desc: "Submit / cancel button styles" },
		],
		dataAttrs: [
			{ attr: "data-command", desc: "Dispatched to controllerAction(target)" },
			{ attr: 'tabindex="-1"', desc: "Keep buttons out of tab order" },
		],
		notes: "PluginPopup uses Controller module to show floating panels at cursor position. Create via new Controller(this, this.$, element, options, key). Open with controller.open(range) or controller.open(targetElement).",
	},
];

function HtmlStructureTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	const [openIdx, setOpenIdx] = useState<number | null>(null);

	return (
		<div className='space-y-6'>
			<p className='text-sm text-muted-foreground'>{t("htmlStructureDesc")}</p>

			<div className='space-y-3'>
				{HTML_STRUCTURES.map((info, idx) => {
					const c = COLOR_MAP[info.color];
					const isOpen = openIdx === idx;

					return (
						<div key={info.key} className={`rounded-lg border overflow-hidden`}>
							<button
								type='button'
								onClick={() => setOpenIdx(isOpen ? null : idx)}
								className='w-full flex items-center gap-3 p-4 text-start hover:bg-muted/30 transition-colors cursor-pointer'
							>
								<span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
								<div className='flex-1 min-w-0'>
									<div className='flex items-center gap-2'>
										<span className={`text-sm font-bold ${c.text}`}>
											{t(`htmlStructure.${info.key}.title`)}
										</span>
										<Badge variant='outline' className='text-[10px] px-1.5 py-0 font-mono'>
											{info.key}
										</Badge>
									</div>
									<p className='text-xs text-muted-foreground mt-0.5'>
										{t(`htmlStructure.${info.key}.desc`)}
									</p>
								</div>
								{isOpen ? <ChevronDown className='h-4 w-4 text-muted-foreground shrink-0' /> : <ChevronRight className='h-4 w-4 text-muted-foreground shrink-0' />}
							</button>

							{isOpen && (
								<div className={`border-t ${c.bg} p-4 space-y-4`}>
									{/* HTML Code */}
									<CodePanel code={info.code} lang='html' />

									{/* CSS Classes Table */}
									<div>
										<h5 className='text-xs font-semibold mb-2'>{t("htmlStructure.cssClasses")}</h5>
										<RefTable
											headers={["Class", "Description"]}
											rows={info.classes.map((cls) => [
												<code key='c' className='text-[11px] whitespace-nowrap'>{cls.cls}</code>,
												<span key='d' className='text-xs'>{cls.desc}</span>,
											])}
										/>
									</div>

									{/* Data Attributes */}
									{info.dataAttrs && (
										<div>
											<h5 className='text-xs font-semibold mb-2'>{t("htmlStructure.dataAttrs")}</h5>
											<RefTable
												headers={["Attribute", "Description"]}
												rows={info.dataAttrs.map((da) => [
													<code key='a' className='text-[11px] whitespace-nowrap'>{da.attr}</code>,
													<span key='d' className='text-xs'>{da.desc}</span>,
												])}
											/>
										</div>
									)}

									{/* Notes */}
									{info.notes && (
										<div className='p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground'>
											<strong className='text-foreground'>Note: </strong>
											{info.notes}
										</div>
									)}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

function ExampleCard({ example, idx, t, onTry }: { example: PluginExample; idx: number; t: ReturnType<typeof useTranslations>; onTry: (key: string) => void }) {
	const [open, setOpen] = useState(false);
	const isComposite = example.pluginType.includes("Composite") || example.pluginType.includes("+");
	const colorKey = isComposite ? "orange" : PLUGIN_TYPE_COLOR[example.pluginType] || "slate";
	const c = COLOR_MAP[colorKey];

	return (
		<div className={`rounded-lg border overflow-hidden`}>
			<div className='flex items-start gap-3 p-4'>
				<span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 flex-wrap'>
						<h4 className='text-sm font-semibold'>{t(`example${idx + 1}Title`)}</h4>
						<Badge variant='outline' className={`text-[9px] px-1.5 py-0 ${c.text}`}>
							{example.pluginType}
						</Badge>
					</div>
					<p className='text-xs text-muted-foreground mt-1'>{t(`example${idx + 1}Desc`)}</p>
				</div>
				<div className='flex items-center gap-1 shrink-0'>
					<button
						type='button'
						onClick={() => onTry(example.key)}
						className='flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-md hover:bg-primary/5 cursor-pointer'
					>
						<Zap className='h-3 w-3' />
						{t("tryIt")}
					</button>
					<button
						onClick={() => setOpen(!open)}
						className='flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted cursor-pointer'
					>
						{open ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
						{open ? t("hideCode") : t("viewCode")}
					</button>
				</div>
			</div>
			{open && (
				<div className='border-t bg-muted/30 px-4 py-3'>
					<CodePanel code={example.code} lang='typescript' />
				</div>
			)}
		</div>
	);
}

function ExamplesTab({ t, onTryExample }: { t: ReturnType<typeof useTranslations>; onTryExample: (key: string) => void }) {
	return (
		<div className='space-y-3'>
			<p className='text-sm text-muted-foreground'>{t("examplesDesc")}</p>

			{PLUGIN_EXAMPLES.map((example, idx) => (
				<ExampleCard key={example.key} example={example} idx={idx} t={t} onTry={onTryExample} />
			))}

			{/* Registration */}
			<div>
				<SectionLabel>{t("registration")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("registrationDesc")}</p>
				<CodePanel code={CODE_REGISTRATION} />

				<div className='mt-4'>
					<h5 className='text-xs font-semibold text-muted-foreground mb-2'>{t("pluginOptions")}</h5>
					<p className='text-[11px] text-muted-foreground mb-2'>{t("pluginOptionsDesc")}</p>
					<CodePanel code={CODE_PLUGIN_OPTIONS} />
				</div>

				<div className='mt-4'>
					<h5 className='text-xs font-semibold text-muted-foreground mb-2'>{t("registrationRules")}</h5>
					<ol className='space-y-1.5 text-xs text-muted-foreground list-decimal list-inside'>
						<li>{t("rule1")}</li>
						<li>
							<code className='bg-muted px-1 rounded'>static key</code> {t("rule2")}
						</li>
						<li>{t("rule3")}</li>
					</ol>
				</div>
			</div>

			{/* Built-in Reference */}
			<div>
				<SectionLabel>{t("builtInRef")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("builtInRefDesc")}</p>
				<RefTable
					headers={["Plugin", "Type", "Complexity", "File"]}
					rows={[
						[
							<code key='c0'>blockquote</code>,
							"Command",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/command/blockquote.js
							</code>,
						],
						[
							<code key='c0'>align</code>,
							"Dropdown",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/dropdown/align.js
							</code>,
						],
						[
							<code key='c0'>font</code>,
							"Dropdown",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/dropdown/font.js
							</code>,
						],
						[
							<code key='c0'>link</code>,
							"Modal + Controller",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/modal/link.js
							</code>,
						],
						[
							<code key='c0'>image</code>,
							"Modal + Component + FileManager",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-red-600 dark:text-red-400'
							>
								Complex
							</Badge>,
							<code key='c2' className='text-[11px]'>
								plugins/modal/image/index.js
							</code>,
						],
						[
							<code key='c0'>table</code>,
							"DropdownFree + Component + Controller",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-red-600 dark:text-red-400'
							>
								Complex
							</Badge>,
							<code key='c2' className='text-[11px]'>
								plugins/dropdown/table/index.js
							</code>,
						],
						[
							<code key='c0'>mention</code>,
							"Field",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/field/mention.js
							</code>,
						],
						[
							<code key='c0'>fontSize</code>,
							"Input",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/input/fontSize.js
							</code>,
						],
					]}
				/>
			</div>
		</div>
	);
}

/* ══════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════ */

const TAB_ICONS: Record<string, ReactNode> = {
	types: <Blocks className='h-3.5 w-3.5' />,
	anatomy: <Layers className='h-3.5 w-3.5' />,
	hooks: <Cable className='h-3.5 w-3.5' />,
	modules: <Workflow className='h-3.5 w-3.5' />,
	htmlStructure: <Code2 className='h-3.5 w-3.5' />,
	examples: <BookOpen className='h-3.5 w-3.5' />,
};

export default function CustomPluginGuide() {
	const t = useTranslations("PluginGuide.custom");
	const [refTab, setRefTab] = useState("types");
	const [qsLang, setQsLang] = useState("js");

	// Quick Try modal state for plugin examples
	const [tryModalOpen, setTryModalOpen] = useState(false);
	const [tryExample, setTryExample] = useState<PluginExample | null>(null);
	const [loadedPlugin, setLoadedPlugin] = useState<unknown>(null);

	// Quick Try for plugin type cards (built-in plugins)
	const [tryTypeInfo, setTryTypeInfo] = useState<PluginTypeInfo | null>(null);
	const [tryTypeModalOpen, setTryTypeModalOpen] = useState(false);

	const handleTryType = useCallback((info: PluginTypeInfo) => {
		setTryTypeInfo(info);
		setTryTypeModalOpen(true);
	}, []);

	// Quick Try for composite plugin cards
	const [tryComposite, setTryComposite] = useState<CompositePluginInfo | null>(null);
	const [tryCompositeModalOpen, setTryCompositeModalOpen] = useState(false);

	const handleTryComposite = useCallback((info: CompositePluginInfo) => {
		setTryComposite(info);
		setTryCompositeModalOpen(true);
	}, []);

	const handleTryExample = useCallback((key: string) => {
		const example = PLUGIN_EXAMPLES.find((e) => e.key === key);
		if (!example) return;
		setTryExample(example);
		setLoadedPlugin(null);
		example.load().then((mod) => {
			setLoadedPlugin(() => mod.default);
			setTryModalOpen(true);
		});
	}, []);

	return (
		<div className='space-y-10'>
			{/* ── Title ── */}
			<div>
				<h2 className='text-2xl font-semibold mb-2'>{t("title")}</h2>
				<p className='text-sm text-muted-foreground'>{t("desc")}</p>
			</div>

			{/* ── Architecture + Key Principles ── */}
			<div className='space-y-4'>
				{/* Inheritance chain */}
				<div className='rounded-lg border bg-muted/20 p-4'>
					<h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
						{t("inheritanceChain")}
					</h4>
					<div className='flex items-center gap-2 flex-wrap font-mono text-sm'>
						<span className='px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'>
							KernelInjector
						</span>
						<span className='text-muted-foreground'>→</span>
						<span className='px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'>
							Base
						</span>
						<span className='text-muted-foreground'>→</span>
						<span className='px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20'>
							PluginCommand / PluginModal / PluginDropdown / ...
						</span>
					</div>
				</div>

				{/* 3 Principles */}
				<div className='grid sm:grid-cols-3 gap-3'>
					{(["classRefs", "depInjection", "contracts"] as const).map((key) => (
						<Card key={key} className='bg-card/60'>
							<CardContent className='p-4'>
								<div className='flex items-center gap-2 mb-1.5'>
									<Zap className='h-3.5 w-3.5 text-primary' />
									<span className='text-xs font-semibold'>{t(key)}</span>
								</div>
								<p className='text-[11px] text-muted-foreground leading-relaxed'>{t(`${key}Desc`)}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* ── Quick Start ── */}
			<div>
				<h3 className='text-lg font-semibold mb-3'>{t("quickStart")}</h3>
				<Card>
					<CardContent className='p-0'>
						<Tabs value={qsLang} onValueChange={setQsLang}>
							<div className='border-b px-4 pt-3'>
								<TabsList className='h-8 gap-1'>
									<TabsTrigger value='js' className='text-xs h-7 px-3'>
										JavaScript
									</TabsTrigger>
									<TabsTrigger value='ts' className='text-xs h-7 px-3'>
										TypeScript
									</TabsTrigger>
									<TabsTrigger value='register' className='text-xs h-7 px-3'>
										{t("register")}
									</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value='js' className='m-0 p-4'>
								<CodePanel code={QS_JS} lang='javascript' />
							</TabsContent>
							<TabsContent value='ts' className='m-0 p-4'>
								<CodePanel code={QS_TS} lang='typescript' />
							</TabsContent>
							<TabsContent value='register' className='m-0 p-4'>
								<CodePanel code={QS_REGISTER} lang='javascript' />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>

			{/* ── Reference Tabs ── */}
			<div>
				<Tabs value={refTab} onValueChange={setRefTab}>
					<TabsList className='flex flex-wrap h-auto gap-1 mb-4'>
						{(["types", "anatomy", "hooks", "modules", "htmlStructure", "examples"] as const).map((key) => (
							<TabsTrigger
								key={key}
								value={key}
								className={`text-xs gap-1.5 ${key === "examples" ? "text-primary font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" : ""}`}
							>
								{TAB_ICONS[key]}
								{t(`tabs.${key}`)}
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value='types'>
						<TypesTab t={t} onTryType={handleTryType} onTryComposite={handleTryComposite} />
					</TabsContent>
					<TabsContent value='anatomy'>
						<AnatomyTab t={t} />
					</TabsContent>
					<TabsContent value='hooks'>
						<HooksTab t={t} />
					</TabsContent>
					<TabsContent value='modules'>
						<ModulesTab t={t} />
					</TabsContent>
					<TabsContent value='htmlStructure'>
						<HtmlStructureTab t={t} />
					</TabsContent>
					<TabsContent value='examples'>
						<ExamplesTab t={t} onTryExample={handleTryExample} />
					</TabsContent>
				</Tabs>
			</div>

			{/* Quick Try Modal for plugin examples */}
			{tryExample && (
				<QuickTryModal
					open={tryModalOpen}
					onClose={() => setTryModalOpen(false)}
					label={tryExample.key}
					desc={tryExample.desc}
					config={{
						...tryExample.editorConfig,
						editorOptions: {
							...tryExample.editorConfig.editorOptions,
							...(loadedPlugin ? { plugins: { [tryExample.key.toLowerCase()]: loadedPlugin } } : {}),
						},
					}}
					badgeText={tryExample.pluginType}
				/>
			)}

			{/* Quick Try Modal for plugin type cards */}
			{tryTypeInfo && tryTypeInfo.demoButtons && (
				<QuickTryModal
					open={tryTypeModalOpen}
					onClose={() => setTryTypeModalOpen(false)}
					label={tryTypeInfo.className}
					desc={tryTypeInfo.uiBehavior}
					config={{
						demoHtml: tryTypeInfo.demoHtml || "<p>Try the built-in plugins.</p>",
						buttonList: [tryTypeInfo.demoButtons],
						editorOptions: tryTypeInfo.editorOptions,
					}}
					badgeText={tryTypeInfo.type}
				/>
			)}

			{/* Quick Try Modal for composite plugin cards */}
			{tryComposite && tryComposite.demoButtons && (
				<QuickTryModal
					open={tryCompositeModalOpen}
					onClose={() => setTryCompositeModalOpen(false)}
					label={tryComposite.name}
					desc={tryComposite.desc}
					config={{
						demoHtml: tryComposite.demoHtml || "<p>Try the composite plugin.</p>",
						buttonList: [tryComposite.demoButtons],
					}}
					badgeText={`${tryComposite.baseType} + ${tryComposite.implements.join(" + ")}`}
				/>
			)}
		</div>
	);
}
