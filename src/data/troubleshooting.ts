import {
	TS_SSR_NEXT,
	TS_CSS,
	TS_CSS_CDN,
	TS_CONTENTS,
	TS_CONTENTS_CDN,
	TS_STRIPPED,
	TS_PASTE,
	TS_PLUGIN,
	TS_TARGET,
	TS_STRICT_MODE,
	TS_VALUE,
	TS_UPLOAD,
	TS_CUSTOM_UPLOAD,
	TS_CONTENT_API,
	TS_V2,
} from "@/data/snippets/troubleshootingSnippets";

/**
 * Troubleshooting 페이지 항목 정의.
 * - `id`는 URL 앵커이자 `Troubleshooting.items.<id>` 메시지 키. 엔진 에러 메시지에서 링크할 예정이라 바꾸지 말 것.
 * - `errors`: 페이지에 그대로 인용하는 엔진 에러 문자열 — `__tests__/data/troubleshooting.test.ts`가 엔진 소스에 실제로 있는지 검사.
 */

/** 이 페이지 내용을 마지막으로 검증한 suneditor 버전. 엔진 업데이트 후 항목을 재확인하고 올린다 (테스트가 설치 버전과 비교). */
export const TROUBLESHOOTING_VERIFIED_VERSION = "3.3.3";

export type TroubleshootingCategory = "setup" | "styling" | "content" | "upload" | "migration";

/** Related page on this site — a `Main.Menus` key, which is also the route. */
export type TroubleshootingRelated = "getting-started" | "plugin-guide" | "docs-api" | "deep-dive" | "migration" | "options";

export type TroubleshootingItem = {
	id: string;
	category: TroubleshootingCategory;
	code: { code: string; lang: string }[];
	related?: TroubleshootingRelated;
	errors?: string[];
};

export const TROUBLESHOOTING_ITEMS: TroubleshootingItem[] = [
	// Setup
	{ id: "ssr", category: "setup", code: [{ code: TS_SSR_NEXT, lang: "jsx" }], related: "getting-started" },
	{
		id: "plugin",
		category: "setup",
		code: [{ code: TS_PLUGIN, lang: "javascript" }],
		related: "plugin-guide",
		errors: ["[SUNEDITOR.create.toolbar.fail] The button name of a plugin that does not exist."],
	},
	{
		id: "target",
		category: "setup",
		code: [{ code: TS_TARGET, lang: "javascript" }],
		errors: ["[SUNEDITOR.create.fail]-[document.querySelector(", "] Cannot find target element", '[SUNEDITOR.create.fail] The first parameter "target" is missing.'],
	},
	{ id: "strictMode", category: "setup", code: [{ code: TS_STRICT_MODE, lang: "jsx" }] },
	// Styles
	{
		id: "css",
		category: "styling",
		code: [
			{ code: TS_CSS, lang: "javascript" },
			{ code: TS_CSS_CDN, lang: "html" },
		],
	},
	{
		id: "contents",
		category: "styling",
		code: [
			{ code: TS_CONTENTS, lang: "jsx" },
			{ code: TS_CONTENTS_CDN, lang: "html" },
		],
		related: "getting-started",
	},
	// Content
	{ id: "stripped", category: "content", code: [{ code: TS_STRIPPED, lang: "javascript" }], related: "options" },
	{ id: "paste", category: "content", code: [{ code: TS_PASTE, lang: "javascript" }], related: "docs-api" },
	{ id: "value", category: "content", code: [{ code: TS_VALUE, lang: "javascript" }], related: "docs-api" },
	// Upload
	{ id: "upload", category: "upload", code: [{ code: TS_UPLOAD, lang: "javascript" }], related: "deep-dive" },
	{ id: "customUpload", category: "upload", code: [{ code: TS_CUSTOM_UPLOAD, lang: "javascript" }], related: "deep-dive" },
	// Migration
	{ id: "contentApi", category: "migration", code: [{ code: TS_CONTENT_API, lang: "javascript" }], related: "migration" },
	{ id: "v2", category: "migration", code: [{ code: TS_V2, lang: "javascript" }], related: "migration" },
];

export const TROUBLESHOOTING_CATEGORIES: TroubleshootingCategory[] = ["setup", "styling", "content", "upload", "migration"];
