/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/getting-started--frameworks/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */

export const FRAMEWORK_ANGULAR = `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
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
      value: "<p>Hello SunEditor</p>",
      buttonList: [
        ["undo", "redo"],
        "|",
        ["bold", "italic", "underline"],
        "|",
        ["list", "link", "image"]
      ]
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}`;

export const FRAMEWORK_HTML_CDN = `<!-- 1. Include CSS -->
<link href="https://cdn.jsdelivr.net/npm/suneditor@3.0.0/dist/css/suneditor.min.css" rel="stylesheet">
<!-- 2. Include JS -->
<script src="https://cdn.jsdelivr.net/npm/suneditor@3.0.0/dist/suneditor.min.js"><\\/script>

<!-- 3. Create Textarea -->
<textarea id="my-editor"></textarea>

<!-- 4. Create Editor -->
<script>
  const editor = SUNEDITOR.create("my-editor", {
    plugins: SUNEDITOR.plugins,
    value: "<p>Hello SunEditor</p>",
    buttonList: [
      ["undo", "redo"],
      "|",
      ["bold", "italic", "underline"],
      "|",
      ["list", "link", "image"]
    ]
  });
<\\/script>`;

export const FRAMEWORK_JAVASCRIPT_NPM = `// npm i suneditor@3.0.0
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editor = suneditor.create("my-editor", {
  plugins,
  value: "<p>Hello SunEditor</p>",
  buttonList: [
      ["undo", "redo"],
      "|",
      ["bold", "italic", "underline"],
      "|",
      ["list", "link", "image"]
    ]
});`;

export const FRAMEWORK_REACT = `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

export default function Editor() {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const instance = suneditor.create(ref.current!, {
      plugins,
      value: "<p>Hello SunEditor</p>",
      buttonList: [
        ["undo", "redo"],
        "|",
        ["bold", "italic", "underline"],
        "|",
        ["list", "link", "image"]
      ]
    });

    return () => instance.destroy();
  }, []);

  return <textarea ref={ref} />;
}`;

export const FRAMEWORK_SVELTE = `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css/editor";
  import "suneditor/css/contents";

  let editorEl;
  let instance;

  onMount(() => {
    instance = suneditor.create(editorEl, {
      plugins,
      value: "<p>Hello SunEditor</p>",
      buttonList: [
        ["undo", "redo"],
        "|",
        ["bold", "italic", "underline"],
        "|",
        ["list", "link", "image"]
      ]
    });

    return () => instance?.destroy();
  });
</script>

<textarea bind:this={editorEl}></textarea>`;

export const FRAMEWORK_VUE = `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editorEl = ref(null);
let instance = null;

onMounted(() => {
  instance = suneditor.create(editorEl.value, {
    plugins,
    value: "<p>Hello SunEditor</p>",
    buttonList: [
      ["undo", "redo"],
      "|",
      ["bold", "italic", "underline"],
      "|",
      ["list", "link", "image"]
    ]
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <textarea ref="editorEl" />
</template>`;

export const FRAMEWORK_WEBCOMPONENTS = `import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`<textarea></textarea>\`;

    const textarea = this.querySelector("textarea");
    this.editor = suneditor.create(textarea, {
      plugins,
      value: "<p>Hello SunEditor</p>",
      buttonList: [
        ["undo", "redo"],
        "|",
        ["bold", "italic", "underline"],
        "|",
        ["list", "link", "image"]
      ]
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);`;
