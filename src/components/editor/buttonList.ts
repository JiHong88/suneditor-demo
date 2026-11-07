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
 * More categories keep their meaning at every size, and no plugin disappears
 * on resize. Each More button closes the group it extends (B I U S + more_text),
 * so it never floats alone between separators. Tool-like More groups
 * (Text, Paragraph, Insert) are icons at every size; File and View behave like
 * app menus, so they stay as text labels on desktop and become icons when compact.
 * Groups hold 2–5 buttons of one role; separators mark role changes only,
 * inside More layers too. Breakpoints use editor width (strictly <), not
 * viewport width. Right-floating groups are declared rightmost first.
 */
const TEXT_SCRIPT = ["subscript", "superscript"];
const TEXT_EXTRA = ["textStyle", "copyFormat", "removeFormat"];
const PARAGRAPH_INDENT = ["outdent", "indent"];
const PARAGRAPH_STYLE = ["lineHeight", "blockquote", "paragraphStyle"];
const INSERT_BLOCKS = ["hr", "codeBlock", "math", "anchor"];
const INSERT_MEDIA = ["audio", "drawing", "embed", "fileUpload"];
const INSERT_STRUCTURE = ["template", "layout"];
const GALLERIES = ["imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"];
const FILE_TOOLS = ["newDocument", "save", "|", "selectAll", "copy", "|", "print", "exportPDF"];
const VIEW_SOURCE = ["codeView", "markdownView"];
const VIEW_DISPLAY = ["showBlocks", "preview"];

const PAGE_TOOLS = ["pageBreak", "pageNavigator", "pageUp", "pageDown"];

function createFullButtonList(withPages: boolean): SunEditor.UI.ButtonList {
	// Compact layouts keep page controls under File; desktop shows them as a group.
	const fileTools = withPages ? [...PAGE_TOOLS, "|", ...FILE_TOOLS] : FILE_TOOLS;

	return [
		// ≥992px: tool More groups as icons, File/View as text menus.
		["undo", "redo"],
		"|",
		["blockStyle", "font", "fontSize"],
		"|",
		["bold", "italic", "underline", "strike"],
		"|",
		["fontColor", "backgroundColor", ":Text-default.more_text", ...TEXT_SCRIPT, "|", ...TEXT_EXTRA],
		"/",
		["align", "list_bulleted", "list_numbered", ":Paragraph-default.more_paragraph", ...PARAGRAPH_INDENT, "|", ...PARAGRAPH_STYLE],
		"|",
		["link", "image", "table", "video", ":Insert-default.more_plus", ...INSERT_BLOCKS, "|", ...INSERT_MEDIA, "|", ...INSERT_STRUCTURE],
		[":Gallery-default.more_media", ...GALLERIES],
		...(withPages ? ["|", [...PAGE_TOOLS]] : []),
		["-right", ":File-text.File ▾", ...FILE_TOOLS],
		["-right", "codeView", "fullScreen", ":View-text.View ▾", "markdownView", ...VIEW_DISPLAY],
		[
			"%992",
			[
				["undo", "redo"],
				"|",
				["blockStyle", "font", "fontSize"],
				"|",
				["bold", "italic", "underline", "strike"],
				"|",
				["fontColor", "backgroundColor", ":Text-default.more_text", ...TEXT_SCRIPT, "|", ...TEXT_EXTRA],
				"/",
				[
					"align",
					"list_bulleted",
					"list_numbered",
					":Paragraph-default.more_paragraph",
					...PARAGRAPH_INDENT,
					"|",
					...PARAGRAPH_STYLE,
				],
				"|",
				[
					"link",
					"image",
					"table",
					"video",
					":Insert-default.more_plus",
					...INSERT_BLOCKS,
					"|",
					...INSERT_MEDIA,
					"|",
					...INSERT_STRUCTURE,
				],
				[":Gallery-default.more_media", ...GALLERIES],
				["-right", ":File-text.File ▾", ...fileTools],
				["-right", "codeView", "fullScreen", ":View-text.View ▾", "markdownView", ...VIEW_DISPLAY],
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
				[
					"fontColor",
					"backgroundColor",
					":Text-default.more_text",
					"font",
					"fontSize",
					"|",
					"strike",
					...TEXT_SCRIPT,
					"|",
					...TEXT_EXTRA,
				],
				"/",
				[
					"align",
					"list_bulleted",
					"list_numbered",
					":Paragraph-default.more_paragraph",
					...PARAGRAPH_INDENT,
					"|",
					...PARAGRAPH_STYLE,
				],
				"|",
				[
					"link",
					"image",
					"table",
					":Insert-default.more_plus",
					...INSERT_BLOCKS,
					"|",
					"video",
					...INSERT_MEDIA,
					"|",
					...INSERT_STRUCTURE,
				],
				[":Gallery-default.more_media", ...GALLERIES],
				["-right", ":File-default.more_file", ...fileTools],
				["-right", "fullScreen", ":View-default.more_view", ...VIEW_SOURCE, "|", ...VIEW_DISPLAY],
			],
		],
		[
			"%576",
			[
				["undo", "redo"],
				"|",
				[
					"bold",
					"italic",
					"underline",
					":Text-default.more_text",
					"blockStyle",
					"font",
					"fontSize",
					"|",
					"strike",
					...TEXT_SCRIPT,
					"|",
					"fontColor",
					"backgroundColor",
					"|",
					...TEXT_EXTRA,
				],
				["-right", ":View-default.more_view", ...VIEW_SOURCE, "|", ...VIEW_DISPLAY, "fullScreen"],
				"/",
				[
					"list_bulleted",
					"list_numbered",
					":Paragraph-default.more_paragraph",
					"align",
					...PARAGRAPH_INDENT,
					"|",
					...PARAGRAPH_STYLE,
				],
				"|",
				[
					"link",
					"image",
					":Insert-default.more_plus",
					"table",
					...INSERT_BLOCKS,
					"|",
					"video",
					...INSERT_MEDIA,
					"|",
					...INSERT_STRUCTURE,
				],
				[":Gallery-default.more_media", ...GALLERIES],
				["-right", ":File-default.more_file", ...fileTools],
			],
		],
	];
}

export const FullButtonList: SunEditor.UI.ButtonList = createFullButtonList(false);

/** Full toolbar with page controls, kept under File on compact layouts. */
export const DocumentButtonList: SunEditor.UI.ButtonList = createFullButtonList(true);
