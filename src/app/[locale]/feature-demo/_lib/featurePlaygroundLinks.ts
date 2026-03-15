/**
 * Maps each feature-demo key to a playground URL query string.
 * - Playground params set the relevant options/plugins.
 * - `val` param sets initial editor content to demonstrate the feature.
 * - Upload URLs use "xxx" as placeholder for the user to replace later.
 */

import {
	DEMO_BOLD_ITALIC, DEMO_FONT_FAMILY, DEMO_FONT_SIZE, DEMO_FONT_COLOR,
	DEMO_BG_COLOR, DEMO_ALIGNMENT, DEMO_BLOCK_STYLES, DEMO_LINE_HEIGHT,
	DEMO_COPY_FORMAT, DEMO_IMAGE, DEMO_IMAGE_RESIZE, DEMO_VIDEO,
	DEMO_AUDIO, DEMO_EMBED, DEMO_DRAWING, DEMO_FILE_UPLOAD,
	DEMO_TABLE, DEMO_CELL_MERGE, DEMO_ROW_COL, DEMO_LISTS,
	DEMO_BLOCKQUOTE, DEMO_HR, DEMO_MATH,
	DEMO_MENTION, DEMO_LINKS, DEMO_CODE_VIEW, DEMO_CHAR_COUNTER,
	DEMO_UNDO_REDO, DEMO_CLASSIC, DEMO_INLINE, DEMO_BALLOON,
	DEMO_BALLOON_ALWAYS, DEMO_DOCUMENT, DEMO_MULTIROOT, DEMO_FULLSCREEN,
	DEMO_RTL, DEMO_STRICT_MODE, DEMO_EXPORT_PDF, DEMO_KEYBOARD,
} from "@/data/snippets/featureDemoSnippets";

export type FeatureLink = {
	/** URL query string (without leading ?) */
	query: string;
	/** Raw demo HTML for Quick Try preview */
	demoHtml: string;
	/** Toolbar buttons shown in the Quick Try editor */
	buttonList: (string | string[])[];
	/** Extra SunEditor options for the Quick Try editor */
	editorOptions?: Record<string, unknown>;
};

/** Build a query string from key-value pairs, encoding values */
function qs(params: Record<string, string>): string {
	return new URLSearchParams(params).toString();
}

/** Build a FeatureLink */
function fl(
	params: Record<string, string>,
	buttonList: (string | string[])[],
	editorOptions?: Record<string, unknown>,
): FeatureLink {
	return {
		query: qs(params),
		demoHtml: params.val || "",
		buttonList,
		editorOptions,
	};
}

/* ── Feature → Playground mapping ──────────────────────── */

export const FEATURE_PLAYGROUND_LINKS: Record<string, FeatureLink> = {
	// ── Text Formatting ──
	boldItalic: fl(
		{ p: "standard", val: DEMO_BOLD_ITALIC },
		[["bold", "italic", "underline", "strike", "subscript", "superscript"]],
	),
	fontFamily: fl(
		{ p: "full", val: DEMO_FONT_FAMILY },
		[["font"], "|", ["bold", "italic", "underline"]],
	),
	fontSize: fl(
		{ p: "full", val: DEMO_FONT_SIZE },
		[["fontSize"], "|", ["bold", "italic", "underline"]],
	),
	fontColor: fl(
		{ p: "standard", val: DEMO_FONT_COLOR },
		[["fontColor"], "|", ["bold", "italic"]],
	),
	bgColor: fl(
		{ p: "standard", val: DEMO_BG_COLOR },
		[["backgroundColor"], "|", ["bold", "italic"]],
	),
	alignment: fl(
		{ p: "standard", val: DEMO_ALIGNMENT },
		[["align"], "|", ["bold", "italic"]],
	),
	blockStyles: fl(
		{ p: "full", val: DEMO_BLOCK_STYLES },
		[["blockStyle"], "|", ["bold", "italic", "underline"]],
	),
	lineHeight: fl(
		{ p: "full", val: DEMO_LINE_HEIGHT },
		[["lineHeight"], "|", ["bold", "italic"]],
	),
	copyFormat: fl(
		{ p: "full", val: DEMO_COPY_FORMAT },
		[["copyFormat", "removeFormat"], "|", ["bold", "italic", "fontColor", "fontSize"]],
	),

	// ── Media ──
	imageUpload: fl(
		{ p: "full", "i.uu": "xxx://image-upload-server", val: DEMO_IMAGE },
		[["image"]],
	),
	imageResize: fl(
		{ p: "full", val: DEMO_IMAGE_RESIZE },
		[["image"]],
	),
	video: fl(
		{ p: "full", val: DEMO_VIDEO },
		[["video"]],
	),
	audio: fl(
		{ p: "full", val: DEMO_AUDIO },
		[["audio"]],
	),
	embed: fl(
		{ p: "full", val: DEMO_EMBED },
		[["embed"]],
	),
	drawing: fl(
		{ p: "full", val: DEMO_DRAWING },
		[["drawing"]],
	),
	fileUpload: fl(
		{ p: "full", "fu.uu": "xxx://file-upload-server", val: DEMO_FILE_UPLOAD },
		[["fileUpload"]],
	),

	// ── Table & Structure ──
	tableInsert: fl(
		{ p: "standard", val: DEMO_TABLE },
		[["table"], "|", ["bold", "italic"]],
	),
	cellMerge: fl(
		{ p: "standard", val: DEMO_CELL_MERGE },
		[["table"], "|", ["bold", "italic"]],
	),
	rowColOps: fl(
		{ p: "standard", val: DEMO_ROW_COL },
		[["table"], "|", ["bold", "italic"]],
	),
	lists: fl(
		{ p: "standard", val: DEMO_LISTS },
		[["list_numbered", "list_bulleted"], "|", ["outdent", "indent"]],
	),
	blockquote: fl(
		{ p: "full", val: DEMO_BLOCKQUOTE },
		[["blockquote"], "|", ["bold", "italic"]],
	),
	hr: fl(
		{ p: "full", val: DEMO_HR },
		[["hr"], "|", ["bold", "italic"]],
	),

	// ── Advanced ──
	math: fl(
		{ p: "full", val: DEMO_MATH },
		[["math"], "|", ["bold", "italic"]],
	),
	mention: fl(
		{ p: "full", "mn.au": "xxx://mention-api", val: DEMO_MENTION },
		[["bold", "italic"]],
	),
	links: fl(
		{ p: "standard", val: DEMO_LINKS },
		[["link", "anchor"], "|", ["bold", "italic"]],
	),
	codeView: fl(
		{ p: "standard", val: DEMO_CODE_VIEW },
		[["codeView"], "|", ["bold", "italic", "underline"]],
	),
	charCounter: fl(
		{ cc: "1", ccm: "500", val: DEMO_CHAR_COUNTER },
		[["bold", "italic", "underline"]],
		{ charCounter: true, charCounter_max: 500 },
	),
	undoRedo: fl(
		{ p: "standard", val: DEMO_UNDO_REDO },
		[["undo", "redo"], "|", ["bold", "italic", "underline"]],
	),

	// ── Modes & Layout ──
	classicMode: fl(
		{ m: "classic", val: DEMO_CLASSIC },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link", "image"]],
		{ mode: "classic" },
	),
	inlineMode: fl(
		{ m: "inline", val: DEMO_INLINE },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link", "image"]],
		{ mode: "inline" },
	),
	balloonMode: fl(
		{ m: "balloon", val: DEMO_BALLOON },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link"]],
		{ mode: "balloon" },
	),
	balloonAlways: fl(
		{ m: "balloon-always", val: DEMO_BALLOON_ALWAYS },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["link"]],
		{ mode: "balloon-always" },
	),
	documentLayout: fl(
		{ p: "full", val: DEMO_DOCUMENT },
		[["bold", "italic", "underline"], "|", ["blockStyle"], "|", ["align"], "|", ["pageBreak", "pageNavigator", "pageUp", "pageDown"]],
		{ type: "document:page,header" },
	),
	multiRoot: fl(
		{ mr: "1", val: DEMO_MULTIROOT },
		[["bold", "italic", "underline"], "|", ["link", "image"]],
	),
	fullScreen: fl(
		{ p: "standard", val: DEMO_FULLSCREEN },
		[["fullScreen"], "|", ["bold", "italic", "underline"]],
	),

	// ── Platform ──
	zeroDeps: fl(
		{ val: "<p>SunEditor has <strong>zero dependencies</strong> — no jQuery, no Bootstrap, nothing else required.</p>" },
		[["bold", "italic", "underline"]],
	),
	tsSupport: fl(
		{ val: "<p>SunEditor ships with full <strong>TypeScript</strong> type definitions out of the box.</p>" },
		[["bold", "italic", "underline"]],
	),
	i18nRtl: fl(
		{ dir: "rtl", rb: "all", val: DEMO_RTL },
		[["bold", "italic", "underline"], "|", ["align"], "|", ["dir"]],
		{ textDirection: "rtl" },
	),
	strictMode: fl(
		{ sm: "1", val: DEMO_STRICT_MODE },
		[["bold", "italic", "underline"], "|", ["link"]],
	),
	pluginAPI: fl(
		{
			p: "full",
			val: "<p>SunEditor provides a powerful <strong>Plugin API</strong> for creating custom plugins.</p><p>Check the Plugin Guide for details.</p>",
		},
		[["bold", "italic", "underline"], "|", ["link", "image"]],
	),
	exportPdf: fl(
		{ p: "full", "ep.au": "xxx://pdf-export-api", val: DEMO_EXPORT_PDF },
		[["exportPDF", "print", "preview"], "|", ["bold", "italic"]],
	),
	keyboard: fl(
		{ p: "standard", val: DEMO_KEYBOARD },
		[["undo", "redo"], "|", ["bold", "italic", "underline"], "|", ["link"]],
	),
};
