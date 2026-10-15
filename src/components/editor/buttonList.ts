import type { SunEditor } from "suneditor/types";

/*
 * Full toolbar layout rules
 * - Max 2 rows ("/") at every breakpoint. Row 1: text & paragraph formatting / Row 2: insert & view.
 * - Core buttons are never hidden: undo, redo, bold, italic, underline, list, link, image.
 *   (align, table, fontColor stay visible down to 768px)
 * - More buttons keep a fixed meaning across breakpoints — only their contents grow or shrink:
 *   Text(more_text) · Paragraph(more_paragraph) · Insert(more_plus) · More(more_horizontal, view & document)
 * - Breakpoints are compared with the editor width, not the viewport
 *   (main demo ≈ 1020px → default, playground on xl screens ≈ 950px → %992).
 * - "-right" modules float right, so the first one listed is the rightmost.
 */

const GALLERIES = ["imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"];
const DOC_ACTIONS = ["newDocument", "selectAll", "save", "copy", "|", "preview", "print", "exportPDF"];

function createFullButtonList(withPages: boolean): SunEditor.UI.ButtonList {
	const pageBreak = withPages ? ["pageBreak"] : [];
	const pageNav = withPages ? ["pageNavigator", "pageUp", "pageDown", "|"] : [];

	return [
		// ═══ Default (≥992px, 2 rows, 3 more buttons) ═══
		// Row 1: Text & paragraph formatting
		["undo", "redo"],
		"|",
		["blockStyle", "font", "fontSize"],
		"|",
		["bold", "underline", "italic", "strike"],
		"|",
		["fontColor", "backgroundColor"],
		"|",
		["removeFormat"],
		[":Text-default.more_text", "subscript", "superscript", "|", "copyFormat", "textStyle"],
		"|",
		["align", "list_numbered", "list_bulleted", "lineHeight"],
		"|",
		["outdent", "indent"],
		"/",
		// Row 2: Insert & view
		["blockquote", "paragraphStyle", "codeBlock", "hr"],
		"|",
		["link", "image", "video", "table"],
		"|",
		["math", "drawing", "template", "layout"],
		[":Insert-default.more_plus", "anchor", "audio", "embed", "fileUpload", "|", ...GALLERIES],
		...(withPages ? ["|", ["pageBreak", "pageNavigator", "pageUp", "pageDown"]] : []),
		["-right", ":More-default.more_horizontal", ...DOC_ACTIONS],
		["-right", "showBlocks", "codeView", "markdownView", "fullScreen"],

		// ═══ ≤992px (2 rows, 4 more buttons) ═══
		[
			"%992",
			[
				["undo", "redo"],
				"|",
				["blockStyle", "font", "fontSize"],
				"|",
				["bold", "underline", "italic", "strike"],
				"|",
				["fontColor", "backgroundColor"],
				"|",
				["removeFormat"],
				[":Text-default.more_text", "subscript", "superscript", "|", "copyFormat", "textStyle"],
				"/",
				["align", "list_numbered", "list_bulleted"],
				"|",
				["outdent", "indent"],
				[":Paragraph-default.more_paragraph", "lineHeight", "|", "blockquote", "paragraphStyle"],
				"|",
				["link", "image", "video", "table"],
				"|",
				["codeBlock", "math", ...pageBreak],
				[":Insert-default.more_plus", "hr", "anchor", "|", "drawing", "audio", "embed", "fileUpload", "|", "template", "layout", "|", ...GALLERIES],
				["-right", ":More-default.more_horizontal", "showBlocks", "markdownView", "|", ...pageNav, ...DOC_ACTIONS],
				["-right", "codeView", "fullScreen"],
			],
		],

		// ═══ ≤768px (tablet, 2 rows) ═══
		[
			"%768",
			[
				["undo", "redo"],
				"|",
				["blockStyle", "fontSize"],
				"|",
				["bold", "underline", "italic", "strike"],
				"|",
				["fontColor", "backgroundColor"],
				[":Text-default.more_text", "font", "|", "subscript", "superscript", "|", "removeFormat", "copyFormat", "textStyle"],
				"/",
				["align", "list_numbered", "list_bulleted"],
				[":Paragraph-default.more_paragraph", "outdent", "indent", "lineHeight", "|", "blockquote", "paragraphStyle"],
				"|",
				["link", "image", "table"],
				[
					":Insert-default.more_plus",
					"video",
					"hr",
					"codeBlock",
					"math",
					"anchor",
					...pageBreak,
					"|",
					"drawing",
					"audio",
					"embed",
					"fileUpload",
					"|",
					"template",
					"layout",
					"|",
					...GALLERIES,
				],
				["-right", ":More-default.more_horizontal", "showBlocks", "codeView", "markdownView", "|", ...pageNav, ...DOC_ACTIONS],
				["-right", "fullScreen"],
			],
		],

		// ═══ ≤576px (mobile, 2 rows) ═══
		[
			"%576",
			[
				["undo", "redo"],
				"|",
				["bold", "underline", "italic"],
				"|",
				["link", "image"],
				"/",
				["list_bulleted"],
				"|",
				["fontColor"],
				[
					":Text-default.more_text",
					"blockStyle",
					"font",
					"fontSize",
					"|",
					"strike",
					"subscript",
					"superscript",
					"|",
					"backgroundColor",
					"removeFormat",
					"copyFormat",
					"textStyle",
				],
				[":Paragraph-default.more_paragraph", "list_numbered", "align", "|", "outdent", "indent", "lineHeight", "|", "blockquote", "paragraphStyle"],
				[
					":Insert-default.more_plus",
					"table",
					"video",
					"|",
					"hr",
					"codeBlock",
					"math",
					"anchor",
					...pageBreak,
					"|",
					"drawing",
					"audio",
					"embed",
					"fileUpload",
					"|",
					"template",
					"layout",
					"|",
					...GALLERIES,
				],
				["-right", ":More-default.more_horizontal", "fullScreen", "showBlocks", "codeView", "markdownView", "|", ...pageNav, ...DOC_ACTIONS],
			],
		],
	];
}

export const FullButtonList: SunEditor.UI.ButtonList = createFullButtonList(false);

/** Document mode — FullButtonList + page buttons (pageBreak, pageNavigator, pageUp, pageDown) */
export const DocumentButtonList: SunEditor.UI.ButtonList = createFullButtonList(true);
