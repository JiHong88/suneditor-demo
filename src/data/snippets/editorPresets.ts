/**
 * @fileoverview 에디터 공통 프리셋 — 버튼 리스트, 기본 콘텐츠, 코드 포맷팅 헬퍼
 *
 * 사용처:
 * - playground/page.tsx            → PLAYGROUND_VALUE (플레이그라운드 에디터 초기 콘텐츠)
 * - playground/_lib/codeGenerator  → SUNEDITOR_VERSION, CDN_CSS, CDN_JS, fmtButtonList (코드 생성기에서 CDN 코드 빌드)
 * - playground/_lib/playgroundState → BASIC/STANDARD/FULL_BUTTON_LIST (프리셋 선택 시 버튼 리스트 결정)
 * - playground/PlaygroundStackBlitz → SUNEDITOR_VERSION (StackBlitz 데모용 버전 정보)
 * - frameworks.ts                  → DEFAULT_VALUE, BASIC_BUTTON_LIST, fmtButtonList (프레임워크별 코드 스니펫 생성)
 * - renderSnippets.ts              → CDN_CONTENTS_CSS (콘텐츠 렌더링 가이드의 CSS URL)
 */

/** SunEditor 버전 및 CDN URL — @/store/version에서 관리 */
export { SUNEDITOR_VERSION, CDN_CSS, CDN_CONTENTS_CSS, CDN_JS } from "@/store/version";

/** getting-started 및 frameworks.ts에서 기본 에디터 콘텐츠로 사용 */
export const DEFAULT_VALUE = "<p>Hello SunEditor</p>";

/** playground 에디터의 초기 콘텐츠 */
export const PLAYGROUND_VALUE = "<p>Hello <strong>SunEditor</strong>!</p><p>Try editing this content.</p>";

/** Basic — getting-started 퀵스타트 코드 예제 및 frameworks.ts에서 사용 */
export const BASIC_BUTTON_LIST: unknown[] = [
	["undo", "redo"],
	["bold", "italic", "underline"],
	["link", "image"],
];

/** Standard — playground 기본 프리셋 (반응형). playgroundState에서 preset="standard" 선택 시 사용 */
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

/** Full — playground 전체 기능 프리셋 (반응형). playgroundState에서 preset="full" 선택 시 사용 */
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
	["fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
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
			["fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
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
			["-right", ":View-default.more_view", "preview", "print", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView"],
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
				"codeBlock",
				"codeView",
				"markdownView",
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
				"codeBlock",
				"codeView",
				"markdownView",
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

/** buttonList 배열을 JS 코드 문자열로 포맷팅. codeGenerator와 frameworks.ts에서 코드 표시용으로 사용 */
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
