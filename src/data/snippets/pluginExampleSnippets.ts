/**
 * @fileoverview 플러그인 가이드 > Examples 탭의 실제 동작하는 예제 플러그인 소스 코드
 *
 * 사용처:
 * - plugin-guide 페이지 > CustomPluginGuide.tsx > ExamplesTab
 *   → 각 ExampleCard의 "코드보기" 버튼 클릭 시 CodeBlock으로 표시
 *   → "바로해보기" 클릭 시 QuickTryModal에서 해당 플러그인이 실제 로드되어 동작
 *
 * 코드 원본: src/data/snippets/plugin-examples/*.snippet.ts
 * 빌드 스크립트: scripts/generate-framework-snippets.cjs
 */

import {
	PLUGIN_EXAMPLE_WORDCOUNT,
	PLUGIN_EXAMPLE_CALLOUTBLOCK,
	PLUGIN_EXAMPLE_EMBED,
	PLUGIN_EXAMPLE_COLORPALETTE,
	PLUGIN_EXAMPLE_HASHTAGHIGHLIGHT,
	PLUGIN_EXAMPLE_ZOOMLEVEL,
	PLUGIN_EXAMPLE_EMOJIPICKER,
	PLUGIN_EXAMPLE_INFOPOPUP,
	PLUGIN_EXAMPLE_TEXTSCALE,
} from "./plugin-guide--examples/_generated";

/* ── 기존 export 이름 유지 (import 호환) ── */
export const CODE_WORDCOUNT = PLUGIN_EXAMPLE_WORDCOUNT;
export const CODE_CALLOUTBLOCK = PLUGIN_EXAMPLE_CALLOUTBLOCK;
export const CODE_EMBED = PLUGIN_EXAMPLE_EMBED;
export const CODE_COLORPALETTE = PLUGIN_EXAMPLE_COLORPALETTE;
export const CODE_HASHTAG = PLUGIN_EXAMPLE_HASHTAGHIGHLIGHT;
export const CODE_ZOOMLEVEL = PLUGIN_EXAMPLE_ZOOMLEVEL;
export const CODE_EMOJI = PLUGIN_EXAMPLE_EMOJIPICKER;
export const CODE_INFOPOPUP = PLUGIN_EXAMPLE_INFOPOPUP;
export const CODE_TEXTSCALE = PLUGIN_EXAMPLE_TEXTSCALE;
