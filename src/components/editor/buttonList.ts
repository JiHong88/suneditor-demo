import type { SunEditor } from "suneditor/types";

/** Home: one quiet row on desktop, two deliberate rows below 640px. */
export const HomeButtonList: SunEditor.UI.ButtonList = [
	["undo", "redo"],
	"|",
	["blockStyle"],
	"|",
	["bold", "italic", "underline"],
	"|",
	["list"],
	"|",
	["link", "image", "table"],
	[":Insert-default.more_plus", "video", "hr"],
	"|",
	["fullScreen"],
	[
		"%640",
		[
			["undo", "redo"],
			"|",
			["blockStyle"],
			"|",
			["fullScreen"],
			"/",
			["bold", "italic", "underline"],
			"|",
			["list"],
			"|",
			["link", "image"],
			[":Insert-default.more_plus", "table", "video", "hr"],
		],
	],
];

/*
 * Full toolbar: text on row 1; paragraph, insert, view and file on row 2.
 * More categories keep their meaning at every size. Desktop labels are native
 * text buttons; compact layouts use icons. No plugin disappears on resize.
 * Breakpoints use editor width (strictly <), not viewport width.
 * Right-floating groups are declared rightmost first.
 */
const GALLERIES = ["imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"];
const TEXT_TOOLS = ["subscript", "superscript", "|", "textStyle", "copyFormat", "removeFormat"];
const PARAGRAPH_TOOLS = ["outdent", "indent", "lineHeight", "|", "blockquote", "paragraphStyle"];
const INSERT_TOOLS = ["hr", "codeBlock", "math", "anchor", "|", "audio", "drawing", "embed", "fileUpload", "|", "template", "layout", "|", ...GALLERIES];
const FILE_TOOLS = ["newDocument", "save", "|", "selectAll", "copy", "|", "print", "exportPDF"];
const VIEW_TOOLS = ["showBlocks", "markdownView", "preview"];

function createFullButtonList(withPages: boolean): SunEditor.UI.ButtonList {
	const pages = withPages ? ["pageBreak", "pageNavigator", "pageUp", "pageDown", "|"] : [];
	const fileTools = [...pages, ...FILE_TOOLS];

	return [
		// ≥992px: labeled More groups, with room for document page controls.
		["undo", "redo"],
		"|",
		["blockStyle", "font", "fontSize"],
		"|",
		["bold", "italic", "underline", "strike"],
		"|",
		["fontColor", "backgroundColor"],
		[":Text-text.Text ▾", ...TEXT_TOOLS],
		"/",
		["align", "list_bulleted", "list_numbered"],
		[":Paragraph-text.Paragraph ▾", ...PARAGRAPH_TOOLS],
		"|",
		["link", "image", "table", "video"],
		[":Insert-text.Insert ▾", ...INSERT_TOOLS],
		...(withPages ? ["|", ["pageBreak", "pageNavigator", "pageUp", "pageDown"]] : []),
		["-right", ":File-text.File ▾", ...FILE_TOOLS],
		["-right", ":View-text.View ▾", ...VIEW_TOOLS],
		["-right", "codeView", "fullScreen"],
		[
			"%992",
			[
				["undo", "redo"],
				"|",
				["blockStyle", "font", "fontSize"],
				"|",
				["bold", "italic", "underline", "strike"],
				"|",
				["fontColor", "backgroundColor"],
				[":Text-text.Text ▾", ...TEXT_TOOLS],
				"/",
				["align", "list_bulleted", "list_numbered"],
				[":Paragraph-text.Paragraph ▾", ...PARAGRAPH_TOOLS],
				"|",
				["link", "image", "table", "video"],
				[":Insert-text.Insert ▾", ...INSERT_TOOLS],
				["-right", ":File-text.File ▾", ...fileTools],
				["-right", ":View-text.View ▾", ...VIEW_TOOLS],
				["-right", "codeView", "fullScreen"],
			],
		],
		[
			"%768",
			[
				["undo", "redo"],
				"|",
				["blockStyle"],
				"|",
				["bold", "italic", "underline"],
				"|",
				["fontColor", "backgroundColor"],
				[":Text-default.more_text", "font", "fontSize", "|", "strike", ...TEXT_TOOLS],
				"/",
				["align", "list_bulleted", "list_numbered"],
				[":Paragraph-default.more_paragraph", ...PARAGRAPH_TOOLS],
				"|",
				["link", "image", "table"],
				[":Insert-default.more_plus", "video", ...INSERT_TOOLS],
				["-right", ":File-default.more_horizontal", ...fileTools],
				["-right", ":View-default.preview", "codeView", ...VIEW_TOOLS],
				["-right", "fullScreen"],
			],
		],
		[
			"%576",
			[
				["undo", "redo"],
				"|",
				["bold", "italic", "underline"],
				"|",
				[":Text-default.more_text", "blockStyle", "font", "fontSize", "|", "strike", "fontColor", "backgroundColor", ...TEXT_TOOLS],
				["-right", ":View-default.preview", "codeView", "fullScreen", ...VIEW_TOOLS],
				"/",
				["list_bulleted"],
				[":Paragraph-default.more_paragraph", "list_numbered", "align", "|", ...PARAGRAPH_TOOLS],
				"|",
				["link", "image"],
				[":Insert-default.more_plus", "table", "video", ...INSERT_TOOLS],
				["-right", ":File-default.more_horizontal", ...fileTools],
			],
		],
	];
}

export const FullButtonList: SunEditor.UI.ButtonList = createFullButtonList(false);

/** Full toolbar with page controls, kept under File on compact layouts. */
export const DocumentButtonList: SunEditor.UI.ButtonList = createFullButtonList(true);
