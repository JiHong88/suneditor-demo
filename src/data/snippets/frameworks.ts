/**
 * @fileoverview 프레임워크별 SunEditor 초기화 코드 스니펫 (7개 프레임워크)
 *
 * 사용처:
 * - getting-started 페이지 > Step 1 "코드 예제" 탭
 *   → codeExampleFrameworks.ts에서 import 후 FrameworkBadge 컴포넌트에 전달
 *
 * 코드 원본: src/data/snippets/frameworks/*.{html,js,tsx,vue,svelte}
 * 빌드 스크립트: scripts/generate-framework-snippets.cjs
 *   → 실제 코드 파일을 읽어 플레이스홀더 치환 후 _generated.ts로 출력
 *   → 이 파일에서 import하여 FrameworkEntry 배열로 구성
 */

import {
	FRAMEWORK_HTML_CDN,
	FRAMEWORK_JAVASCRIPT_NPM,
	FRAMEWORK_REACT,
	FRAMEWORK_VUE,
	FRAMEWORK_ANGULAR,
	FRAMEWORK_SVELTE,
	FRAMEWORK_WEBCOMPONENTS,
} from "./getting-started--frameworks/_generated";

export type FrameworkEntry = {
	key: string;
	name: string;
	icon: string;
	accent: string;
	kind: "language" | "framework";
	snippet: string;
};

const frameworks: FrameworkEntry[] = [
	{
		key: "javascript-cdn",
		name: "HTML",
		icon: "/logos/html.svg",
		accent: "#e34f26",
		kind: "language",
		snippet: FRAMEWORK_HTML_CDN,
	},
	{
		key: "javascript-npm",
		name: "JavaScript",
		icon: "/logos/js.svg",
		accent: "#f7df1e",
		kind: "language",
		snippet: FRAMEWORK_JAVASCRIPT_NPM,
	},
	{
		key: "react",
		name: "React",
		icon: "/logos/react.svg",
		accent: "#61dafb",
		kind: "framework",
		snippet: FRAMEWORK_REACT,
	},
	{
		key: "vue",
		name: "Vue",
		icon: "/logos/vue.svg",
		accent: "#42b883",
		kind: "framework",
		snippet: FRAMEWORK_VUE,
	},
	{
		key: "angular",
		name: "Angular",
		icon: "/logos/angular.svg",
		accent: "#dd0031",
		kind: "framework",
		snippet: FRAMEWORK_ANGULAR,
	},
	{
		key: "svelte",
		name: "Svelte",
		icon: "/logos/svelte.svg",
		accent: "#ff3e00",
		kind: "framework",
		snippet: FRAMEWORK_SVELTE,
	},
	{
		key: "webcomponents",
		name: "Web Components",
		icon: "/logos/web-components.svg",
		accent: "#1f7ae0",
		kind: "framework",
		snippet: FRAMEWORK_WEBCOMPONENTS,
	},
];

export default frameworks;
