/**
 * @fileoverview feature-demo 페이지의 카테고리 및 기능 키 정의
 *
 * 사용처:
 * - feature-demo/page.tsx → 카테고리 탭, 기능 카드 렌더링
 *
 * 아이콘은 JSX이므로 page.tsx에서 매핑.
 * 여기서는 순수 데이터(키, 색상, 기능 키 목록)만 관리.
 */

export type FeatureCategoryDef = {
	key: string;
	color: string;
	features: string[];
};

/** 기능 데모 카테고리 정의 */
export const FEATURE_CATEGORIES: FeatureCategoryDef[] = [
	{
		key: "textFormatting",
		color: "text-blue-600 dark:text-blue-400",
		features: ["boldItalic", "fontFamily", "fontSize", "fontColor", "bgColor", "alignment", "blockStyles", "lineHeight", "copyFormat"],
	},
	{
		key: "media",
		color: "text-violet-600 dark:text-violet-400",
		features: ["imageUpload", "imageResize", "video", "audio", "embed", "drawing", "fileUpload"],
	},
	{
		key: "tableStructure",
		color: "text-green-600 dark:text-green-400",
		features: ["tableInsert", "cellMerge", "rowColOps", "lists", "blockquote", "hr"],
	},
	{
		key: "advanced",
		color: "text-amber-600 dark:text-amber-400",
		features: ["math", "mention", "links", "codeView", "markdownView", "codeBlock", "finder", "charCounter", "undoRedo"],
	},
	{
		key: "modesLayout",
		color: "text-teal-600 dark:text-teal-400",
		features: ["classicMode", "inlineMode", "balloonMode", "balloonAlways", "toolbarBottom", "documentLayout", "fullScreen"],
	},
	{
		key: "platform",
		color: "text-rose-600 dark:text-rose-400",
		features: ["i18nRtl", "strictMode", "exportPdf", "keyboard"],
	},
];

/** 상단 통계 필 키 */
export type StatKey = "modes" | "plugins" | "languages" | "zeroDeps" | "typescript";

export type StatDef = {
	key: StatKey;
	className: string;
};
