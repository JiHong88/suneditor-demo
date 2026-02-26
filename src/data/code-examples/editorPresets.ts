/** Shared editor presets — single source of truth for version, CDN URLs, button lists, and default content. */

export const SUNEDITOR_VERSION = "3.0.0-beta.35";

export const CDN_CSS = `https://cdn.jsdelivr.net/npm/suneditor@${SUNEDITOR_VERSION}/dist/suneditor.min.css`;
export const CDN_CONTENTS_CSS = `https://cdn.jsdelivr.net/npm/suneditor@${SUNEDITOR_VERSION}/dist/suneditor-contents.min.css`;
export const CDN_JS = `https://cdn.jsdelivr.net/npm/suneditor@${SUNEDITOR_VERSION}/dist/suneditor.min.js`;

export const DEFAULT_VALUE = "<p>Hello SunEditor</p>";
export const PLAYGROUND_VALUE = "<p>Hello <strong>SunEditor</strong>!</p><p>Try editing this content.</p>";

/** Basic — used in quick-start code examples */
export const BASIC_BUTTON_LIST = [
	["undo", "redo"],
	["bold", "italic", "underline"],
	["link", "image"],
];

/** Standard — playground default */
export const STANDARD_BUTTON_LIST = [
	["undo", "redo"],
	["font", "fontSize", "blockStyle"],
	["bold", "italic", "underline", "strike"],
	["fontColor", "backgroundColor"],
	["outdent", "indent", "align", "list"],
	["table", "link", "image"],
	["fullScreen", "codeView"],
];

/** Full — playground full features */
export const FULL_BUTTON_LIST = [
	["undo", "redo"],
	["font", "fontSize", "blockStyle"],
	["paragraphStyle", "blockquote"],
	["bold", "italic", "underline", "strike", "subscript", "superscript"],
	["fontColor", "backgroundColor", "textStyle"],
	["removeFormat"],
	["outdent", "indent", "align", "horizontalRule", "list", "lineHeight"],
	["table", "link", "image", "video", "audio"],
	["imageGallery"],
	["fullScreen", "showBlocks", "codeView"],
	["preview", "print"],
];

/* ── Helpers for building code-display strings ──────────── */

/** Format a buttonList array as a pretty-printed JS string. */
export function fmtButtonList(list: string[][], indent = 4): string {
	const pad = " ".repeat(indent);
	const lines = list.map((group) => `${pad}  [${group.map((b) => `"${b}"`).join(", ")}]`);
	return `[\n${lines.join(",\n")}\n${pad}]`;
}

/** Format a buttonList as a single-line short form for compact display. */
export function fmtButtonListInline(list: string[][]): string {
	const groups = list.map((g) => `[${g.map((b) => `"${b}"`).join(", ")}]`);
	return `[${groups.join(", ")}]`;
}
