/** Shared editor presets — button lists, default content, and helpers. Version/CDN URLs live in @/store/version. */

export { SUNEDITOR_VERSION, CDN_CSS, CDN_CONTENTS_CSS, CDN_JS } from "@/store/version";

export const DEFAULT_VALUE = "<p>Hello SunEditor</p>";
export const PLAYGROUND_VALUE = "<p>Hello <strong>SunEditor</strong>!</p><p>Try editing this content.</p>";

/** Basic — used in quick-start code examples */
export const BASIC_BUTTON_LIST: unknown[] = [
	["undo", "redo"],
	["bold", "italic", "underline"],
	["link", "image"],
];

/** Standard — playground default (responsive) */
export const STANDARD_BUTTON_LIST: unknown[] = [
	// full size
	["undo", "redo"],
	"|",
	["font", "fontSize", "blockStyle"],
	"|",
	["bold", "italic", "underline", "strike"],
	["fontColor", "backgroundColor"],
	"|",
	["outdent", "indent", "align", "list"],
	"|",
	["table", "link", "image"],
	"|",
	["fullScreen", "codeView"],
	// (min-width: 768)
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "font", "fontSize", "blockStyle"],
			[":Text-default.more_text", "bold", "italic", "underline", "strike", "fontColor", "backgroundColor"],
			["outdent", "indent", "align", "list"],
			"|",
			[":Insert-default.more_plus", "table", "link", "image"],
			"|",
			["fullScreen", "codeView"],
		],
	],
	// (min-width: 576)
	[
		"%576",
		[
			["undo", "redo"],
			[":Format-default.more_paragraph", "font", "fontSize", "blockStyle"],
			[":Text-default.more_text", "bold", "italic", "underline", "strike", "fontColor", "backgroundColor"],
			[":Insert-default.more_plus", "outdent", "indent", "align", "list", "|", "table", "link", "image"],
			["-right", ":View-default.more_view", "fullScreen", "codeView"],
		],
	],
];

/** Full — playground full features (responsive) */
export const FULL_BUTTON_LIST: unknown[] = [
	// full size
	["undo", "redo", "|", "dir", "newDocument", "selectAll", "save", "preview", "print", "exportPDF"],
	"|",
	["blockquote", "|", "blockStyle", "font", "fontSize", "|", "paragraphStyle", "textStyle"],
	"|",
	["bold", "underline", "italic", "strike", "subscript", "superscript"],
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat", "copyFormat"],
	"|",
	["table", "lineHeight"],
	"/",
	["align", "list_numbered", "list_bulleted"],
	"|",
	["outdent", "indent"],
	"|",
	["hr", "link", "anchor", "math"],
	"|",
	["image", "drawing", "video", "audio", "embed", "fileUpload"],
	"|",
	["imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
	"|",
	["template", "layout"],
	"|",
	["fullScreen", "showBlocks", "codeView"],
	"|",
	["pageBreak", "pageNavigator", "pageUp", "pageDown"],
	"|",
	["copy"],
	// (min-width: 1200)
	[
		"%1200",
		[
			["undo", "redo", "|", "dir", "newDocument", "selectAll", "save", "preview", "print", "exportPDF"],
			"|",
			[
				":Paragraph-default.more_paragraph",
				"blockquote",
				"|",
				"blockStyle",
				"font",
				"fontSize",
				"|",
				"paragraphStyle",
			],
			"|",
			["textStyle"],
			["bold", "underline", "italic", "strike", "subscript", "superscript"],
			["fontColor", "backgroundColor"],
			"|",
			["removeFormat", "copyFormat"],
			"/",
			["outdent", "indent"],
			"|",
			[":Lists & Align-default.more_list", "table", "lineHeight", "align", "list_numbered", "list_bulleted"],
			[":Media & File-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[
				":Galleries-default.more_gallery",
				"imageGallery",
				"videoGallery",
				"audioGallery",
				"fileGallery",
				"fileBrowser",
			],
			"|",
			["hr", "link", "anchor", "math"],
			"|",
			["template", "layout"],
			"|",
			["fullScreen", "showBlocks", "codeView"],
			"|",
			["pageBreak", "pageNavigator", "pageUp", "pageDown"],
			"|",
			["copy"],
		],
	],
	// (min-width: 992)
	[
		"%992",
		[
			["undo", "redo", "|", "dir", "newDocument", "selectAll", "save", "preview", "print", "exportPDF"],
			"|",
			[
				":Paragraph-default.more_paragraph",
				"blockquote",
				"|",
				"blockStyle",
				"font",
				"fontSize",
				"|",
				"paragraphStyle",
			],
			"|",
			[
				":Text-default.more_text",
				"bold",
				"underline",
				"italic",
				"strike",
				"subscript",
				"superscript",
				"fontColor",
				"backgroundColor",
				"|",
				"removeFormat",
				"copyFormat",
				"textStyle",
				"copy",
			],
			["outdent", "indent"],
			"|",
			[":Insert-default.more_plus", "hr", "link", "anchor", "math"],
			"|",
			[":Lists & Align-default.more_list", "table", "lineHeight", "align", "list_numbered", "list_bulleted"],
			[":Media & File-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[
				":Galleries-default.more_gallery",
				"imageGallery",
				"videoGallery",
				"audioGallery",
				"fileGallery",
				"fileBrowser",
			],
			[":Templates-default.more_file", "template", "layout"],
			["-right", ":View-default.more_view", "preview", "print", "fullScreen", "showBlocks", "codeView"],
		],
	],
	// (min-width: 768)
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Docs-default.more_horizontal", "dir", "newDocument", "selectAll"],
			["save"],
			[
				":Paragraph-default.more_paragraph",
				"blockquote",
				"|",
				"blockStyle",
				"font",
				"fontSize",
				"|",
				"paragraphStyle",
			],
			[
				":Text-default.more_text",
				"bold",
				"underline",
				"italic",
				"strike",
				"subscript",
				"superscript",
				"fontColor",
				"backgroundColor",
				"|",
				"removeFormat",
				"copyFormat",
				"textStyle",
				"copy",
			],
			["outdent", "indent"],
			[":Insert-default.more_plus", "hr", "link", "anchor", "math"],
			"|",
			[":Lists & Align-default.more_list", "table", "lineHeight", "align", "list_numbered", "list_bulleted"],
			[":Media & File-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[
				":Galleries-default.more_gallery",
				"imageGallery",
				"videoGallery",
				"audioGallery",
				"fileGallery",
				"fileBrowser",
			],
			[":Templates-default.more_file", "template", "layout"],
			"|",
			["-right", ":Pages-default.more_page", "pageBreak", "pageNavigator", "pageUp", "pageDown"],
			[
				"-right",
				":View-default.more_view",
				"preview",
				"print",
				"exportPDF",
				"fullScreen",
				"showBlocks",
				"codeView",
			],
		],
	],
	// (min-width: 576)
	[
		"%576",
		[
			["undo", "redo"],
			"|",
			[":Docs-default.more_horizontal", "dir", "newDocument", "selectAll", "save"],
			[
				":Paragraph-default.more_paragraph",
				"outdent",
				"indent",
				"|",
				"blockquote",
				"|",
				"blockStyle",
				"font",
				"fontSize",
				"|",
				"paragraphStyle",
			],
			[
				":Text-default.more_text",
				"bold",
				"underline",
				"italic",
				"strike",
				"subscript",
				"superscript",
				"fontColor",
				"backgroundColor",
				"|",
				"removeFormat",
				"copyFormat",
				"textStyle",
				"copy",
			],
			[":Insert-default.more_plus", "hr", "link", "anchor", "math"],
			[":Lists & Align-default.more_list", "table", "lineHeight", "align", "list_numbered", "list_bulleted"],
			[":Media & File-default.more_media", "image", "drawing", "video", "audio", "embed", "fileUpload"],
			[
				":Galleries & Templates-default.more_gallery",
				"imageGallery",
				"videoGallery",
				"audioGallery",
				"fileGallery",
				"fileBrowser",
				"|",
				"template",
				"layout",
			],
			[
				":View & Pages-default.more_view",
				"preview",
				"print",
				"exportPDF",
				"fullScreen",
				"showBlocks",
				"codeView",
				"|",
				"pageBreak",
				"pageNavigator",
				"pageUp",
				"pageDown",
			],
		],
	],
];

/* ── Helpers for building code-display strings ──────────── */

/** Format a buttonList array as a pretty-printed JS string (supports responsive format). */
export function fmtButtonList(list: unknown[], baseIndent = 4): string {
	function formatItems(items: unknown[], depth: number): string {
		const pad = " ".repeat(depth);
		const lines: string[] = [];

		for (const item of items) {
			if (typeof item === "string") {
				// Separator like "|" or "/"
				lines.push(`${pad}"${item}"`);
			} else if (Array.isArray(item)) {
				// Responsive entry: ["%xxx", [...buttons...]]
				if (
					item.length === 2 &&
					typeof item[0] === "string" &&
					(item[0] as string).startsWith("%") &&
					Array.isArray(item[1])
				) {
					const inner = formatItems(item[1] as unknown[], depth + 2);
					lines.push(
						`${pad}[\n` +
							`${pad}  "${item[0]}",\n` +
							`${pad}  [\n` +
							`${inner}\n` +
							`${pad}  ]\n` +
							`${pad}]`,
					);
				} else {
					// Regular button group: ["undo", "redo", ...]
					const buttons = (item as string[]).map((b) => `"${b}"`).join(", ");
					lines.push(`${pad}[${buttons}]`);
				}
			}
		}

		return lines.join(",\n");
	}

	const pad = " ".repeat(baseIndent);
	return `[\n${formatItems(list, baseIndent + 2)}\n${pad}]`;
}
