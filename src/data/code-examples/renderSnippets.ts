/**
 * @fileoverview 저장된 HTML을 각 프레임워크에서 렌더링하는 방법 코드 스니펫 (7개 프레임워크)
 *
 * 사용처:
 * - getting-started 페이지 > Step 2 "저장된 HTML 렌더링" 섹션
 *   → Step2_RenderHtml.tsx에서 getRenderSnippet(framework) 호출
 *   → 선택된 프레임워크에 맞는 렌더링 코드를 CodeBlock으로 표시
 *
 * 핵심: sun-editor-editable 클래스로 감싸야 에디터 스타일이 적용된다는 것을 보여줌
 */
import type { FrameworkKey } from "@/components/common/codeExampleFrameworks";
import { CDN_CONTENTS_CSS } from "./editorPresets";

export type StepSnippet = {
	code: string;
	lang: string;
};

/* ── Step 2: Content Rendering ──────────────────────────── */
const RENDER_SNIPPETS: Record<FrameworkKey, StepSnippet> = {
	"javascript-cdn": {
		lang: "html",
		code: `<!-- 1. SunEditor contents CSS required -->
<link href="${CDN_CONTENTS_CSS}" rel="stylesheet">

<!-- 2. sun-editor-editable Wrap with class -->
<div class="sun-editor-editable">
  <!-- HTML from editor.getContents() -->
</div>`,
	},
	"javascript-npm": {
		lang: "javascript",
		code: `// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
const container = document.getElementById("content");
container.innerHTML = \`
  <div class="sun-editor-editable">
    \${savedHtml}
  </div>
\`;`,
	},
	react: {
		lang: "jsx",
		code: `// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
export default function ContentViewer({ html }) {
  return (
    <div
      className="sun-editor-editable"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}`,
	},
	vue: {
		lang: "vue",
		code: `<script setup>
// 1. CSS import
import "suneditor/css/contents";

defineProps({ html: String });
</script>

<!-- 2. sun-editor-editable Wrap with class -->
<template>
  <div class="sun-editor-editable" v-html="html" />
</template>`,
	},
	angular: {
		lang: "typescript",
		code: `import { Component, Input } from "@angular/core";
// 1. CSS import (add to angular.json styles)
// "styles": ["node_modules/suneditor/dist/css/suneditor.min.css",
//             "node_modules/suneditor/dist/css/suneditor-contents.min.css"]

// 2. sun-editor-editable Wrap with class
@Component({
  selector: "app-content-viewer",
  template: \`
    <div class="sun-editor-editable" [innerHTML]="html"></div>
  \`
})
export class ContentViewerComponent {
  @Input() html = "";
}`,
	},
	svelte: {
		lang: "svelte",
		code: `<script>
  // 1. CSS import
  import "suneditor/css/contents";

  export let html = "";
</script>

<!-- 2. sun-editor-editable Wrap with class -->
<div class="sun-editor-editable">
  {@html html}
</div>`,
	},
	webcomponents: {
		lang: "javascript",
		code: `import "suneditor/css/contents";

// sun-editor-editable Wrap with class
class ContentViewer extends HTMLElement {
  set content(html) {
    this.innerHTML = \`
      <div class="sun-editor-editable">
        \${html}
      </div>
    \`;
  }
}

customElements.define("content-viewer", ContentViewer);`,
	},
};

export function getRenderSnippet(framework: FrameworkKey): StepSnippet {
	return RENDER_SNIPPETS[framework];
}
