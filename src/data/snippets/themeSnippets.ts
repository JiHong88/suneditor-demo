/**
 * @fileoverview 테마 가이드 페이지의 코드 스니펫 및 CSS 변수 참조 데이터
 *
 * 사용처:
 * - deep-dive 페이지 > ThemeGuideContent.tsx 컴포넌트
 *
 * 구성:
 *   THEME_USAGE       → "내장 테마" 아코디언 > 테마 적용 및 런타임 변경 코드 예제
 *   THEME_STRUCTURE   → "커스텀 테마 만들기" 아코디언 > CSS 변수 구조 예제 (ocean 테마)
 *   THEME_APPLY       → "커스텀 테마 만들기" 아코디언 > 커스텀 테마 import 및 적용 코드
 *   VARIABLE_CATEGORIES → "CSS 변수 레퍼런스" 아코디언 > 4개 카테고리별 변수 목록 그리드
 *     - Content Area: 캐럿, 폰트, 배경, 테두리, 앵커, 상태 색상
 *     - Layout Shell: 메인 배경/색상/테두리, hover/active 레벨
 *     - Modal & Dropdown: 모달/드롭다운 배경/색상, 컨트롤러
 *     - Status Colors: success/error 9단계, loading 색상
 */

/* ── 내장 테마: 테마 적용 + 런타임 변경 코드 ─────────── */
export const THEME_USAGE = `import suneditor from 'suneditor';

// 1. Import the built-in theme CSS
import 'suneditor/src/themes/dark.css';

// 2. Pass theme name to options
const editor = suneditor.create(textarea, {
  theme: 'dark', // 'dark' | 'midnight' | 'cobalt' | 'cream'
});

// 3. Change theme at runtime
editor.$.ui.setTheme('midnight');
editor.$.ui.setTheme('');  // Reset to default`;

/* ── 커스텀 테마: CSS 변수 구조 예제 (se-theme-ocean) ── */
export const THEME_STRUCTURE = `/* my-theme.css */
.sun-editor.se-theme-ocean,
.sun-editor-editable.se-theme-ocean {
  /* Caret & placeholder */
  --se-caret-color: #e0f2fe;
  --se-drag-caret-color: #38bdf8;
  --se-placeholder-color: #64748b;

  /* Text */
  --se-edit-font-color: #e2e8f0;
  --se-edit-font-pre: #94a3b8;
  --se-edit-font-quote: #94a3b8;

  /* Background */
  --se-edit-background-color: #0f172a;
  --se-edit-background-pre: #1e293b;

  /* ... */
}`;

/* ── 커스텀 테마: import 및 적용 코드 ──────────────── */
export const THEME_APPLY = `// Import your custom theme CSS
import './my-theme.css';

const editor = suneditor.create(textarea, {
  theme: 'ocean',  // Must match the class name: se-theme-ocean
});`;

/* ── CSS 변수 레퍼런스: 4개 카테고리별 변수 목록 (그리드 렌더링용) ── */
export const VARIABLE_CATEGORIES = [
	{
		title: "Content Area",
		desc: "contentArea",
		vars: [
			{ name: "--se-caret-color", desc: "caretColor" },
			{ name: "--se-edit-font-color", desc: "editFontColor" },
			{ name: "--se-edit-background-color", desc: "editBackground" },
			{ name: "--se-edit-border-*", desc: "editBorder" },
			{ name: "--se-edit-anchor", desc: "editAnchor" },
			{ name: "--se-edit-active / hover / outline", desc: "editStates" },
		],
	},
	{
		title: "Layout Shell",
		desc: "layoutShell",
		vars: [
			{ name: "--se-main-background-color", desc: "mainBackground" },
			{ name: "--se-main-color", desc: "mainColor" },
			{ name: "--se-main-border-color", desc: "mainBorder" },
			{ name: "--se-hover-color (6 levels)", desc: "hoverLevels" },
			{ name: "--se-active-color (11 levels)", desc: "activeLevels" },
		],
	},
	{
		title: "Modal & Dropdown",
		desc: "modalDropdown",
		vars: [
			{ name: "--se-modal-background-color", desc: "modalBackground" },
			{ name: "--se-modal-color", desc: "modalColor" },
			{ name: "--se-dropdown-font-color", desc: "dropdownFont" },
			{ name: "--se-controller-*", desc: "controller" },
		],
	},
	{
		title: "Status Colors",
		desc: "statusColors",
		vars: [
			{ name: "--se-success-color (9 levels)", desc: "successLevels" },
			{ name: "--se-error-color (9 levels)", desc: "errorLevels" },
			{ name: "--se-loading-color", desc: "loadingColor" },
		],
	},
];
