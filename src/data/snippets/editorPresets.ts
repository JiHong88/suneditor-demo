/**
 * @fileoverview 에디터 공통 프리셋 — 버튼 리스트, 기본 콘텐츠, 코드 포맷팅 헬퍼
 *
 * 사용처:
 * - playground/page.tsx            → PLAYGROUND_VALUE (플레이그라운드 에디터 초기 콘텐츠)
 * - playground/_lib/codeGenerator  → SUNEDITOR_VERSION, CDN_CSS, CDN_JS, fmtButtonList (코드 생성기에서 CDN 코드 빌드)
 * - playground/_lib/playgroundState → BASIC/STANDARD_BUTTON_LIST (프리셋 선택 시 버튼 리스트 결정, Full은 @/components/editor/buttonList)
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
	// full size (2 rows)
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "italic", "underline", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"/",
	["outdent", "indent", "align", "list"],
	"|",
	["table", "link", "image", "video"],
	"|",
	["fullScreen", "codeView"],
	// ≤992px
	[
		"%992",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize"],
			["bold", "italic", "underline", "strike"],
			"|",
			["fontColor", "backgroundColor"],
			"|",
			["removeFormat"],
			"|",
			["outdent", "indent", "align", "list"],
			"|",
			["table", "link", "image", "video"],
			"|",
			["fullScreen", "codeView"],
		],
	],
	// ≤768px (bold/color visible, removeFormat into Format more)
	[
		"%768",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize", "|", "removeFormat"],
			["bold", "italic", "underline", "strike"],
			"|",
			["fontColor", "backgroundColor"],
			["outdent", "indent", "align", "list"],
			"|",
			[":Insert-default.more_plus", "table", "link", "image", "video"],
			"|",
			["fullScreen", "codeView"],
		],
	],
	// ≤576px (text into more, view into more)
	[
		"%576",
		[
			["undo", "redo"],
			"|",
			[":Format-default.more_paragraph", "blockStyle", "font", "fontSize"],
			[":Text-default.more_text", "bold", "italic", "underline", "strike", "|", "fontColor", "backgroundColor", "|", "removeFormat"],
			["outdent", "indent", "align", "list"],
			"|",
			[":Insert-default.more_plus", "table", "link", "image", "video"],
			["-right", "fullScreen", "codeView"],
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
