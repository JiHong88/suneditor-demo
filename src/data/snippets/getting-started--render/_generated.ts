/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/getting-started--render/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */

export const RENDER_ANGULAR = `import { Component, Input } from "@angular/core";
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
}`;

export const RENDER_HTML_CDN = `<!-- 1. SunEditor contents CSS required -->
<link href="https://cdn.jsdelivr.net/npm/suneditor@3.0.0/dist/css/suneditor-contents.min.css" rel="stylesheet">

<!-- 2. sun-editor-editable Wrap with class -->
<div class="sun-editor-editable">
  <!-- HTML from editor.getContents() -->
</div>`;

export const RENDER_JAVASCRIPT_NPM = `// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
const container = document.getElementById("content");
container.innerHTML = \`
  <div class="sun-editor-editable">
    \${savedHtml}
  </div>
\`;`;

export const RENDER_REACT = `// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
export default function ContentViewer({ html }) {
  return (
    <div
      className="sun-editor-editable"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}`;

export const RENDER_SVELTE = `<script>
  // 1. CSS import
  import "suneditor/css/contents";

  export let html = "";
</script>

<!-- 2. sun-editor-editable Wrap with class -->
<div class="sun-editor-editable">
  {@html html}
</div>`;

export const RENDER_VUE = `<script setup>
// 1. CSS import
import "suneditor/css/contents";

defineProps({ html: String });
</script>

<!-- 2. sun-editor-editable Wrap with class -->
<template>
  <div class="sun-editor-editable" v-html="html" />
</template>`;

export const RENDER_WEBCOMPONENTS = `import "suneditor/css/contents";

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

customElements.define("content-viewer", ContentViewer);`;
