import type { SunEditor } from "suneditor/types";

export const FullButtonList: SunEditor.UI.ButtonList = [
	// ═══ Default (full width, 2 rows) ═══
	// Row 1: Core editing tools
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "underline", "italic", "strike", "subscript", "superscript"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat", "copyFormat", "textStyle"],
	"/",
	// Row 2: Content & utilities (less-used items in more-buttons)
	[":Paragraph-default.more_paragraph", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
	["table", "link", "image"],
	[":Insert-default.more_plus", "hr", "anchor", "math", "|", "template", "layout"],
	[":Media-default.more_media", "drawing", "video", "audio", "embed", "fileUpload"],
	[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
	"|",
	["fullScreen", "showBlocks", "codeView"],
	[":More-default.more_view", "codeBlock", "markdownView", "|", "dir", "newDocument", "selectAll", "save", "copy", "|", "preview", "print", "exportPDF"],

	// ═══ ≤1200px (2 rows, row 2 collapsed) ═══
	[
		"%1200",
		[
			["undo", "redo"],
			"|",
			["blockStyle", "font", "fontSize"],
			"|",
			["bold", "underline", "italic", "strike", "subscript", "superscript"],
			"|",
			["fontColor", "backgroundColor"],
			"|",
			["removeFormat", "copyFormat", "textStyle"],
			"/",
			[":Paragraph-default.more_paragraph", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			"|",
			["fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
			["-right", ":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],

	// ═══ ≤992px (1 row, aggressive collapse) ═══
	[
		"%992",
		[
			["undo", "redo"],
			"|",
			["blockStyle", "font", "fontSize"],
			"|",
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Paragraph-default.more_paragraph", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
			["-right", ":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],

	// ═══ ≤768px (tablet) ═══
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize", "|", "blockquote", "paragraphStyle"],
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Paragraph-default.more_list", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload", "|", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
			["-right", ":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],

	// ═══ ≤576px (mobile) ═══
	[
		"%576",
		[
			["undo", "redo"],
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize", "|", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload", "|", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			["-right", ":More-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView", "|", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],
];

/** Document mode — FullButtonList + page navigation buttons */
export const DocumentButtonList: SunEditor.UI.ButtonList = [
	// Row 1: same as Full
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "underline", "italic", "strike", "subscript", "superscript"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat", "copyFormat", "textStyle"],
	"/",
	// Row 2: same as Full + page navigation
	[":Paragraph-default.more_paragraph", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
	["table", "link", "image"],
	[":Insert-default.more_plus", "hr", "anchor", "math", "|", "template", "layout"],
	[":Media-default.more_media", "drawing", "video", "audio", "embed", "fileUpload"],
	[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
	"|",
	["fullScreen", "showBlocks", "codeView"],
	["pageBreak", "pageNavigator", "pageUp", "pageDown"],
	[":More-default.more_view", "codeBlock", "markdownView", "|", "dir", "newDocument", "selectAll", "save", "copy", "|", "preview", "print", "exportPDF"],

	// ≤992px
	[
		"%992",
		[
			["undo", "redo"],
			"|",
			["blockStyle", "font", "fontSize"],
			"|",
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Paragraph-default.more_paragraph", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			"|",
			["pageBreak", "pageNavigator", "pageUp", "pageDown"],
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
			["-right", ":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],

	// ≤768px
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize", "|", "blockquote", "paragraphStyle"],
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Paragraph-default.more_list", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload", "|", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			["-right", ":Pages-default.more_page", "pageBreak", "pageNavigator", "pageUp", "pageDown"],
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
			["-right", ":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],

	// ≤576px
	[
		"%576",
		[
			["undo", "redo"],
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize", "|", "blockquote", "paragraphStyle", "|", "align", "list_numbered", "list_bulleted", "|", "outdent", "indent", "lineHeight"],
			[":Text-default.more_text", "bold", "underline", "italic", "strike", "subscript", "superscript", "|", "fontColor", "backgroundColor", "|", "removeFormat", "copyFormat", "textStyle"],
			[":Insert-default.more_plus", "table", "hr", "link", "anchor", "math", "|", "template", "layout"],
			[":Media-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload", "|", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
			["-right", ":More-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView", "|", "pageBreak", "pageNavigator", "pageUp", "pageDown", "|", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
		],
	],
];
