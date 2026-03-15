/**
 * @fileoverview 저장된 HTML을 각 프레임워크에서 렌더링하는 방법 코드 스니펫 (7개 프레임워크)
 *
 * 사용처:
 * - getting-started 페이지 > Step 2 "저장된 HTML 렌더링" 섹션
 *   → Step2_RenderHtml.tsx에서 getRenderSnippet(framework) 호출
 *
 * 코드 원본: src/data/snippets/render/*.snippet.*
 * 빌드 스크립트: scripts/generate-framework-snippets.cjs
 */

import type { FrameworkKey } from "@/components/common/codeExampleFrameworks";
import {
	RENDER_HTML_CDN,
	RENDER_JAVASCRIPT_NPM,
	RENDER_REACT,
	RENDER_VUE,
	RENDER_ANGULAR,
	RENDER_SVELTE,
	RENDER_WEBCOMPONENTS,
} from "./getting-started--render/_generated";

export type StepSnippet = {
	code: string;
	lang: string;
};

const RENDER_SNIPPETS: Record<FrameworkKey, StepSnippet> = {
	"javascript-cdn": { lang: "html", code: RENDER_HTML_CDN },
	"javascript-npm": { lang: "javascript", code: RENDER_JAVASCRIPT_NPM },
	react: { lang: "jsx", code: RENDER_REACT },
	vue: { lang: "vue", code: RENDER_VUE },
	angular: { lang: "typescript", code: RENDER_ANGULAR },
	svelte: { lang: "svelte", code: RENDER_SVELTE },
	webcomponents: { lang: "javascript", code: RENDER_WEBCOMPONENTS },
};

export function getRenderSnippet(framework: FrameworkKey): StepSnippet {
	return RENDER_SNIPPETS[framework];
}
