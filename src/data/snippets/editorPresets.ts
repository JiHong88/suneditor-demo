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
	"|",
	["bold", "italic", "underline"],
	"|",
	["list", "link", "image"],
];

/** Standard — playground 기본 프리셋 (반응형). playgroundState에서 preset="standard" 선택 시 사용 */
export const STANDARD_BUTTON_LIST: unknown[] = [
	// full size
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "italic", "underline", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["outdent", "indent", "align", "list"],
	"|",
	["table", "link", "image"],
	"|",
	["fullScreen", "codeView"],
	// ≤768px
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize"],
			[":Text-default.more_text", "bold", "italic", "underline", "strike", "|", "fontColor", "backgroundColor", "|", "removeFormat"],
			["outdent", "indent", "align", "list"],
			"|",
			[":Insert-default.more_plus", "table", "link", "image"],
			"|",
			["fullScreen", "codeView"],
		],
	],
	// ≤576px
	[
		"%576",
		[
			["undo", "redo"],
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize"],
			[":Text-default.more_text", "bold", "italic", "underline", "strike", "|", "fontColor", "backgroundColor", "|", "removeFormat"],
			[":Insert-default.more_plus", "outdent", "indent", "align", "list", "|", "table", "link", "image"],
			["-right", ":View-default.more_view", "fullScreen", "codeView"],
		],
	],
];

/** Full — playground 전체 기능 프리셋 (반응형). playgroundState에서 preset="full" 선택 시 사용 */
export const FULL_BUTTON_LIST: unknown[] = [
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
	[":More-default.more_view", "codeBlock", "markdownView", "|", "dir", "newDocument", "selectAll", "save", "copy", "|", "preview", "print", "exportPDF", "|", "pageBreak", "pageNavigator", "pageUp", "pageDown"],

	// ═══ ≤1200px (2 rows, row 2 collapsed into more-buttons) ═══
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
			["-right", ":Pages-default.more_page", "pageBreak", "pageNavigator", "pageUp", "pageDown"],
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
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView", "|", "pageBreak", "pageNavigator", "pageUp", "pageDown"],
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
			["-right", ":View-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView", "|", "pageBreak", "pageNavigator", "pageUp", "pageDown"],
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
			["-right", ":More-default.more_view", "fullScreen", "showBlocks", "codeBlock", "codeView", "markdownView", "|", "pageBreak", "pageNavigator", "pageUp", "pageDown", "|", "dir", "newDocument", "selectAll", "save", "copy", "preview", "print", "exportPDF"],
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
