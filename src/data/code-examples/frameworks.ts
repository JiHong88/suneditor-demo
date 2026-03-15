/**
 * @fileoverview 프레임워크별 SunEditor 초기화 코드 스니펫 (7개 프레임워크)
 *
 * 사용처:
 * - getting-started 페이지 > Step 1 "코드 예제" 탭
 *   → codeExampleFrameworks.ts에서 import 후 FrameworkBadge 컴포넌트에 전달
 *   → 각 프레임워크(HTML/CDN, JS/NPM, React, Vue, Angular, Svelte, Web Components) 탭에 코드 블록으로 표시
 *
 * 각 스니펫 구조:
 * - key: 프레임워크 식별자 (URL 파라미터, 탭 전환에 사용)
 * - name: 표시 이름
 * - icon: 로고 이미지 경로
 * - snippet: 해당 프레임워크에서 SunEditor를 설치하고 초기화하는 전체 코드
 */
import { SUNEDITOR_VERSION, CDN_CSS, CDN_JS, DEFAULT_VALUE, BASIC_BUTTON_LIST, fmtButtonList } from "./editorPresets";

export type FrameworkEntry = {
	key: string;
	name: string;
	icon: string;
	accent: string;
	kind: "language" | "framework";
	snippet: string;
};

const BL = fmtButtonList(BASIC_BUTTON_LIST, 4);
const V = DEFAULT_VALUE;

const frameworks: FrameworkEntry[] = [
	{
		key: "javascript-cdn",
		name: "HTML",
		icon: "/logos/html.svg",
		accent: "#e34f26",
		kind: "language",
		snippet: `<!-- 1. Include CSS -->
<link href="${CDN_CSS}" rel="stylesheet">
<!-- 2. Include JS -->
<script src="${CDN_JS}"><\/script>

<!-- 3. Create Textarea -->
<textarea id="my-editor"></textarea>

<!-- 4. Create Editor -->
<script>
  const editor = SUNEDITOR.create("my-editor", {
    value: "${V}",
    buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 4)}
  });
<\/script>`,
	},
	{
		key: "javascript-npm",
		name: "JavaScript",
		icon: "/logos/js.svg",
		accent: "#f7df1e",
		kind: "language",
		snippet: `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editor = suneditor.create("my-editor", {
  plugins,
  value: "${V}",
  buttonList: ${BL}
});`,
	},
	{
		key: "react",
		name: "React",
		icon: "/logos/react.svg",
		accent: "#61dafb",
		kind: "framework",
		snippet: `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

export default function Editor() {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const instance = suneditor.create(ref.current!, {
      plugins,
      value: "${V}",
      buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 6)}
    });

    return () => instance.destroy();
  }, []);

  return <textarea ref={ref} />;
}`,
	},
	{
		key: "vue",
		name: "Vue",
		icon: "/logos/vue.svg",
		accent: "#42b883",
		kind: "framework",
		snippet: `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editorEl = ref(null);
let instance = null;

onMounted(() => {
  instance = suneditor.create(editorEl.value, {
    plugins,
    value: "${V}",
    buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 4)}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <textarea ref="editorEl" />
</template>`,
	},
	{
		key: "angular",
		name: "Angular",
		icon: "/logos/angular.svg",
		accent: "#dd0031",
		kind: "framework",
		snippet: `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";

@Component({
  selector: "app-editor",
  template: \`<textarea #editorEl></textarea>\`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorEl", { static: true }) editorEl!: ElementRef<HTMLTextAreaElement>;
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create(this.editorEl.nativeElement, {
      plugins,
      value: "${V}",
      buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 6)}
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}`,
	},
	{
		key: "svelte",
		name: "Svelte",
		icon: "/logos/svelte.svg",
		accent: "#ff3e00",
		kind: "framework",
		snippet: `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css/editor";
  import "suneditor/css/contents";

  let editorEl;
  let instance;

  onMount(() => {
    instance = suneditor.create(editorEl, {
      plugins,
      value: "${V}",
      buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 6)}
    });

    return () => instance?.destroy();
  });
</script>

<textarea bind:this={editorEl}></textarea>`,
	},
	{
		key: "webcomponents",
		name: "Web Components",
		icon: "/logos/web-components.svg",
		accent: "#1f7ae0",
		kind: "framework",
		snippet: `import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`<textarea></textarea>\`;

    const textarea = this.querySelector("textarea");
    this.editor = suneditor.create(textarea, {
      plugins,
      value: "${V}",
      buttonList: ${fmtButtonList(BASIC_BUTTON_LIST, 6)}
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);`,
	},
];

export default frameworks;
