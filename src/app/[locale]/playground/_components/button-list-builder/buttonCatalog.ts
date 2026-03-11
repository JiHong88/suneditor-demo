import type { ButtonMeta, ButtonCategory } from "./builderTypes";

const BUTTONS: ButtonMeta[] = [
	// ── Document ──────────────────────────────────────────
	{ name: "undo", label: "Undo", category: "document" },
	{ name: "redo", label: "Redo", category: "document" },
	{ name: "dir", label: "Direction", category: "document" },
	{ name: "dir_ltr", label: "LTR", category: "document" },
	{ name: "dir_rtl", label: "RTL", category: "document" },
	{ name: "newDocument", label: "New Document", category: "document" },
	{ name: "selectAll", label: "Select All", category: "document" },
	{ name: "save", label: "Save", category: "document" },
	{ name: "preview", label: "Preview", category: "document" },
	{ name: "print", label: "Print", category: "document" },
	{ name: "exportPDF", label: "Export PDF", category: "document" },

	// ── Text Formatting ──────────────────────────────────
	{ name: "bold", label: "Bold", category: "text" },
	{ name: "underline", label: "Underline", category: "text" },
	{ name: "italic", label: "Italic", category: "text" },
	{ name: "strike", label: "Strikethrough", category: "text" },
	{ name: "subscript", label: "Subscript", category: "text" },
	{ name: "superscript", label: "Superscript", category: "text" },
	{ name: "fontColor", label: "Font Color", category: "text" },
	{ name: "backgroundColor", label: "BG Color", category: "text" },
	{ name: "removeFormat", label: "Remove Format", category: "text" },
	{ name: "copyFormat", label: "Copy Format", category: "text" },

	// ── Format ───────────────────────────────────────────
	{ name: "blockquote", label: "Blockquote", category: "format" },
	{ name: "blockStyle", label: "Block Style", category: "format" },
	{ name: "font", label: "Font", category: "format" },
	{ name: "fontSize", label: "Font Size", category: "format" },
	{ name: "paragraphStyle", label: "Paragraph Style", category: "format" },
	{ name: "textStyle", label: "Text Style", category: "format" },

	// ── Layout & List ────────────────────────────────────
	{ name: "align", label: "Align", category: "layout" },
	{ name: "list_numbered", label: "Ordered List", category: "layout" },
	{ name: "list_bulleted", label: "Unordered List", category: "layout" },
	{ name: "list", label: "List", category: "layout" },
	{ name: "outdent", label: "Outdent", category: "layout" },
	{ name: "indent", label: "Indent", category: "layout" },
	{ name: "lineHeight", label: "Line Height", category: "layout" },
	{ name: "table", label: "Table", category: "layout" },

	// ── Insert ───────────────────────────────────────────
	{ name: "hr", label: "Horizontal Rule", category: "insert" },
	{ name: "link", label: "Link", category: "insert" },
	{ name: "anchor", label: "Anchor", category: "insert" },
	{ name: "math", label: "Math", category: "insert" },
	{ name: "template", label: "Template", category: "insert" },
	{ name: "layout", label: "Layout", category: "insert" },
	{ name: "mention", label: "Mention", category: "insert" },

	// ── Media ────────────────────────────────────────────
	{ name: "image", label: "Image", category: "media" },
	{ name: "drawing", label: "Drawing", category: "media" },
	{ name: "video", label: "Video", category: "media" },
	{ name: "audio", label: "Audio", category: "media" },
	{ name: "embed", label: "Embed", category: "media" },
	{ name: "fileUpload", label: "File Upload", category: "media" },

	// ── Gallery ──────────────────────────────────────────
	{ name: "imageGallery", label: "Image Gallery", category: "gallery" },
	{ name: "videoGallery", label: "Video Gallery", category: "gallery" },
	{ name: "audioGallery", label: "Audio Gallery", category: "gallery" },
	{ name: "fileGallery", label: "File Gallery", category: "gallery" },
	{ name: "fileBrowser", label: "File Browser", category: "gallery" },

	// ── View ─────────────────────────────────────────────
	{ name: "fullScreen", label: "Full Screen", category: "view" },
	{ name: "showBlocks", label: "Show Blocks", category: "view" },
	{ name: "codeView", label: "Code View", category: "view" },

	// ── Page ─────────────────────────────────────────────
	{ name: "pageBreak", label: "Page Break", category: "page" },
	{ name: "pageNavigator", label: "Page Navigator", category: "page" },
	{ name: "pageUp", label: "Page Up", category: "page" },
	{ name: "pageDown", label: "Page Down", category: "page" },
	{ name: "copy", label: "Copy", category: "document" },
];

export const BUTTON_MAP: Record<string, ButtonMeta> = {};
for (const b of BUTTONS) BUTTON_MAP[b.name] = b;

export const CATEGORY_LABELS: Record<ButtonCategory, string> = {
	document: "Document",
	text: "Text",
	format: "Format",
	layout: "Layout & List",
	insert: "Insert",
	media: "Media",
	gallery: "Gallery",
	view: "View",
	page: "Page",
};

export const CATEGORY_ORDER: ButtonCategory[] = ["document", "text", "format", "layout", "insert", "media", "gallery", "view", "page"];

/** Group buttons by category */
export function getButtonsByCategory(): Map<ButtonCategory, ButtonMeta[]> {
	const map = new Map<ButtonCategory, ButtonMeta[]>();
	for (const cat of CATEGORY_ORDER) {
		map.set(cat, BUTTONS.filter((b) => b.category === cat));
	}
	return map;
}

export default BUTTONS;
