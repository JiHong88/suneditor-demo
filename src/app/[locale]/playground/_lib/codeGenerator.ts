import { SUNEDITOR_VERSION, CDN_CSS, CDN_JS, fmtButtonList } from "@/data/code-examples/editorPresets";
import { type PlaygroundState, type CodeFramework, DEFAULTS, getButtonList } from "./playgroundState";

/* ── Helpers ───────────────────────────────────────────── */

function indent(str: string, n: number): string {
	const pad = " ".repeat(n);
	return str
		.split("\n")
		.map((l) => pad + l)
		.join("\n");
}

/** Build plugin sub-object lines. Returns empty array if no non-default values. */
function pluginLines(
	prefix: string,
	entries: [string, unknown, unknown][] // [optionName, currentValue, defaultValue]
): string[] {
	const changed = entries.filter(([, cur, def]) => cur !== def);
	if (!changed.length) return [];
	const inner = changed.map(([k, v]) => {
		const val = typeof v === "string" ? `"${v}"` : String(v);
		return `  ${k}: ${val},`;
	});
	return [`${prefix}: {`, ...inner, "},"];
}

/** Returns an ESM import line for theme CSS, or empty string. */
function themeImport(theme: string): string {
	if (theme === "dark" || theme === "cobalt") {
		return `\nimport "suneditor/src/themes/${theme}.css";`;
	}
	return "";
}

/** Returns a CDN `<link>` tag for theme CSS, or empty string. */
function themeCDNLink(theme: string): string {
	if (theme === "dark" || theme === "cobalt") {
		return `\n  <link href="https://cdn.jsdelivr.net/npm/suneditor@${SUNEDITOR_VERSION}/src/themes/${theme}.css" rel="stylesheet">`;
	}
	return "";
}

/** Build an options object string from current state, omitting defaults. */
function buildOptionsBody(state: PlaygroundState, indentBase: number): string {
	const lines: string[] = [];
	const add = (key: string, value: string) => lines.push(`${key}: ${value},`);

	// mode
	if (state.mode !== "classic") add("mode", `"${state.mode}"`);

	// type
	if (state.type) add("type", `"${state.type}"`);

	// buttonList
	add("buttonList", fmtButtonList(getButtonList(state.buttonListPreset, state.type), indentBase + 2));

	// theme
	if (state.theme) add("theme", `"${state.theme}"`);

	// textDirection
	if (state.textDirection !== "ltr") add("textDirection", `"${state.textDirection}"`);

	// layout
	if (state.width !== "100%") add("width", `"${state.width}"`);
	if (state.height !== "auto") add("height", `"${state.height}"`);
	if (state.minWidth) add("minWidth", `"${state.minWidth}"`);
	if (state.maxWidth) add("maxWidth", `"${state.maxWidth}"`);
	if (state.minHeight) add("minHeight", `"${state.minHeight}"`);
	if (state.maxHeight) add("maxHeight", `"${state.maxHeight}"`);
	if (state.editorStyle) add("editorStyle", `"${state.editorStyle}"`);

	// toolbar
	if (state.toolbar_width !== "auto") add("toolbar_width", `"${state.toolbar_width}"`);
	if (state.toolbar_sticky !== 0) add("toolbar_sticky", String(state.toolbar_sticky));
	if (state.toolbar_hide) add("toolbar_hide", "true");
	if (!state.shortcutsHint) add("shortcutsHint", "false");
	if (state.shortcutsDisable) add("shortcutsDisable", "true");

	// statusbar
	if (!state.statusbar) add("statusbar", "false");
	if (!state.statusbar_showPathLabel) add("statusbar_showPathLabel", "false");
	if (!state.statusbar_resizeEnable) add("statusbar_resizeEnable", "false");

	// charCounter
	if (state.charCounter) add("charCounter", "true");
	if (state.charCounter_max !== null) add("charCounter_max", String(state.charCounter_max));
	if (state.charCounter_label) add("charCounter_label", `"${state.charCounter_label}"`);
	if (state.charCounter_type !== "char") add("charCounter_type", `"${state.charCounter_type}"`);

	// content
	if (state.placeholder) add("placeholder", `"${state.placeholder}"`);
	if (state.iframe) add("iframe", "true");
	if (state.iframe_fullPage) add("iframe_fullPage", "true");
	if (state.defaultLine !== "p") add("defaultLine", `"${state.defaultLine}"`);
	if (state.defaultLineBreakFormat !== "line") add("defaultLineBreakFormat", `"${state.defaultLineBreakFormat}"`);
	if (state.retainStyleMode !== "repeat") add("retainStyleMode", `"${state.retainStyleMode}"`);
	if (state.freeCodeViewMode) add("freeCodeViewMode", "true");

	// features
	if (!state.autoLinkify) add("autoLinkify", "false");
	if (state.autoStyleify !== DEFAULTS.autoStyleify) {
		const items = state.autoStyleify.split(",").map((s) => `"${s.trim()}"`);
		add("autoStyleify", `[${items.join(", ")}]`);
	}
	if (state.copyFormatKeepOn) add("copyFormatKeepOn", "true");
	if (state.tabDisable) add("tabDisable", "true");
	if (!state.syncTabIndent) add("syncTabIndent", "false");
	if (state.componentInsertBehavior !== "auto") add("componentInsertBehavior", `"${state.componentInsertBehavior}"`);
	if (state.historyStackDelayTime !== 400) add("historyStackDelayTime", String(state.historyStackDelayTime));
	if (state.fullScreenOffset !== 0) add("fullScreenOffset", String(state.fullScreenOffset));
	if (state.defaultUrlProtocol) add("defaultUrlProtocol", `"${state.defaultUrlProtocol}"`);
	if (state.closeModalOutsideClick) add("closeModalOutsideClick", "true");
	if (state.previewTemplate) add("previewTemplate", `\`${state.previewTemplate}\``);
	if (state.printTemplate) add("printTemplate", `\`${state.printTemplate}\``);
	if (state.toastMessageTime !== 1500) add("toastMessageTime", `{ copy: ${state.toastMessageTime} }`);

	// filtering
	if (!state.strictMode) {
		const sm = {
			tagFilter: state.strictMode_tagFilter,
			formatFilter: state.strictMode_formatFilter,
			classFilter: state.strictMode_classFilter,
			textStyleTagFilter: state.strictMode_textStyleTagFilter,
			attrFilter: state.strictMode_attrFilter,
			styleFilter: state.strictMode_styleFilter,
		};
		add("strictMode", JSON.stringify(sm));
	}
	if (state.elementWhitelist) add("elementWhitelist", `"${state.elementWhitelist}"`);
	if (state.elementBlacklist) add("elementBlacklist", `"${state.elementBlacklist}"`);
	if (state.attributeWhitelist) {
		try {
			add("attributeWhitelist", JSON.stringify(JSON.parse(state.attributeWhitelist)));
		} catch {
			/* skip invalid */
		}
	}
	if (state.attributeBlacklist) {
		try {
			add("attributeBlacklist", JSON.stringify(JSON.parse(state.attributeBlacklist)));
		} catch {
			/* skip invalid */
		}
	}
	if (state.fontSizeUnits !== DEFAULTS.fontSizeUnits) {
		const units = state.fontSizeUnits.split(",").map((s) => `"${s.trim()}"`);
		add("fontSizeUnits", `[${units.join(", ")}]`);
	}
	if (state.lineAttrReset) add("lineAttrReset", `"${state.lineAttrReset}"`);
	if (state.printClass) add("printClass", `"${state.printClass}"`);
	if (state.formatLine) add("formatLine", `"${state.formatLine}"`);
	if (state.formatBrLine) add("formatBrLine", `"${state.formatBrLine}"`);
	if (state.formatClosureBrLine) add("formatClosureBrLine", `"${state.formatClosureBrLine}"`);
	if (state.formatBlock) add("formatBlock", `"${state.formatBlock}"`);
	if (state.formatClosureBlock) add("formatClosureBlock", `"${state.formatClosureBlock}"`);
	if (state.spanStyles && state.spanStyles !== DEFAULTS.spanStyles) add("spanStyles", `"${state.spanStyles}"`);
	if (state.lineStyles && state.lineStyles !== DEFAULTS.lineStyles) add("lineStyles", `"${state.lineStyles}"`);
	if (state.textStyleTags) add("textStyleTags", `"${state.textStyleTags}"`);
	if (state.allowedEmptyTags) add("allowedEmptyTags", `"${state.allowedEmptyTags}"`);
	if (state.allowedClassName) add("allowedClassName", `"${state.allowedClassName}"`);
	if (state.allUsedStyles) add("allUsedStyles", `"${state.allUsedStyles}"`);
	if (state.scopeSelectionTags) {
		const tags = state.scopeSelectionTags.split(",").map((s) => `"${s.trim()}"`);
		add("scopeSelectionTags", `[${tags.join(", ")}]`);
	}

	// ── Plugin options ──
	const pLines: string[][] = [];

	pLines.push(
		pluginLines("image", [
			["canResize", state.image_canResize, DEFAULTS.image_canResize],
			["defaultWidth", state.image_defaultWidth, DEFAULTS.image_defaultWidth],
			["defaultHeight", state.image_defaultHeight, DEFAULTS.image_defaultHeight],
			["createFileInput", state.image_createFileInput, DEFAULTS.image_createFileInput],
			["createUrlInput", state.image_createUrlInput, DEFAULTS.image_createUrlInput],
			["uploadUrl", state.image_uploadUrl, DEFAULTS.image_uploadUrl],
			["uploadSizeLimit", state.image_uploadSizeLimit, DEFAULTS.image_uploadSizeLimit],
			["allowMultiple", state.image_allowMultiple, DEFAULTS.image_allowMultiple],
			["acceptedFormats", state.image_acceptedFormats, DEFAULTS.image_acceptedFormats],
			["percentageOnlySize", state.image_percentageOnlySize, DEFAULTS.image_percentageOnlySize],
			["showHeightInput", state.image_showHeightInput, DEFAULTS.image_showHeightInput],
		])
	);
	pLines.push(
		pluginLines("video", [
			["canResize", state.video_canResize, DEFAULTS.video_canResize],
			["defaultWidth", state.video_defaultWidth, DEFAULTS.video_defaultWidth],
			["defaultHeight", state.video_defaultHeight, DEFAULTS.video_defaultHeight],
			["createFileInput", state.video_createFileInput, DEFAULTS.video_createFileInput],
			["createUrlInput", state.video_createUrlInput, DEFAULTS.video_createUrlInput],
			["uploadUrl", state.video_uploadUrl, DEFAULTS.video_uploadUrl],
			["uploadSizeLimit", state.video_uploadSizeLimit, DEFAULTS.video_uploadSizeLimit],
			["allowMultiple", state.video_allowMultiple, DEFAULTS.video_allowMultiple],
			["acceptedFormats", state.video_acceptedFormats, DEFAULTS.video_acceptedFormats],
			["percentageOnlySize", state.video_percentageOnlySize, DEFAULTS.video_percentageOnlySize],
			["showHeightInput", state.video_showHeightInput, DEFAULTS.video_showHeightInput],
			["showRatioOption", state.video_showRatioOption, DEFAULTS.video_showRatioOption],
			["defaultRatio", state.video_defaultRatio, DEFAULTS.video_defaultRatio],
		])
	);
	pLines.push(
		pluginLines("audio", [
			["defaultWidth", state.audio_defaultWidth, DEFAULTS.audio_defaultWidth],
			["defaultHeight", state.audio_defaultHeight, DEFAULTS.audio_defaultHeight],
			["createFileInput", state.audio_createFileInput, DEFAULTS.audio_createFileInput],
			["createUrlInput", state.audio_createUrlInput, DEFAULTS.audio_createUrlInput],
			["uploadUrl", state.audio_uploadUrl, DEFAULTS.audio_uploadUrl],
			["uploadSizeLimit", state.audio_uploadSizeLimit, DEFAULTS.audio_uploadSizeLimit],
			["allowMultiple", state.audio_allowMultiple, DEFAULTS.audio_allowMultiple],
			["acceptedFormats", state.audio_acceptedFormats, DEFAULTS.audio_acceptedFormats],
		])
	);
	pLines.push(
		pluginLines("table", [
			["scrollType", state.table_scrollType, DEFAULTS.table_scrollType],
			["captionPosition", state.table_captionPosition, DEFAULTS.table_captionPosition],
			["cellControllerPosition", state.table_cellControllerPosition, DEFAULTS.table_cellControllerPosition],
		])
	);
	pLines.push(
		pluginLines("fontSize", [
			["sizeUnit", state.fontSize_sizeUnit, DEFAULTS.fontSize_sizeUnit],
			["showIncDecControls", state.fontSize_showIncDecControls, DEFAULTS.fontSize_showIncDecControls],
			["showDefaultSizeLabel", state.fontSize_showDefaultSizeLabel, DEFAULTS.fontSize_showDefaultSizeLabel],
			["disableInput", state.fontSize_disableInput, DEFAULTS.fontSize_disableInput],
		])
	);
	pLines.push(
		pluginLines("fontColor", [["disableHEXInput", state.fontColor_disableHEXInput, DEFAULTS.fontColor_disableHEXInput]])
	);
	pLines.push(
		pluginLines("backgroundColor", [
			["disableHEXInput", state.backgroundColor_disableHEXInput, DEFAULTS.backgroundColor_disableHEXInput],
		])
	);
	pLines.push(
		pluginLines("embed", [
			["canResize", state.embed_canResize, DEFAULTS.embed_canResize],
			["defaultWidth", state.embed_defaultWidth, DEFAULTS.embed_defaultWidth],
			["defaultHeight", state.embed_defaultHeight, DEFAULTS.embed_defaultHeight],
			["showHeightInput", state.embed_showHeightInput, DEFAULTS.embed_showHeightInput],
			["percentageOnlySize", state.embed_percentageOnlySize, DEFAULTS.embed_percentageOnlySize],
		])
	);
	pLines.push(
		pluginLines("drawing", [
			["outputFormat", state.drawing_outputFormat, DEFAULTS.drawing_outputFormat],
			["lineWidth", state.drawing_lineWidth, DEFAULTS.drawing_lineWidth],
			["lineCap", state.drawing_lineCap, DEFAULTS.drawing_lineCap],
			["canResize", state.drawing_canResize, DEFAULTS.drawing_canResize],
			["lineColor", state.drawing_lineColor, DEFAULTS.drawing_lineColor],
			["lineReconnect", state.drawing_lineReconnect, DEFAULTS.drawing_lineReconnect],
		])
	);
	pLines.push(
		pluginLines("mention", [
			["triggerText", state.mention_triggerText, DEFAULTS.mention_triggerText],
			["limitSize", state.mention_limitSize, DEFAULTS.mention_limitSize],
			["delayTime", state.mention_delayTime, DEFAULTS.mention_delayTime],
			["searchStartLength", state.mention_searchStartLength, DEFAULTS.mention_searchStartLength],
			["apiUrl", state.mention_apiUrl, DEFAULTS.mention_apiUrl],
			["useCachingData", state.mention_useCachingData, DEFAULTS.mention_useCachingData],
		])
	);
	pLines.push(
		pluginLines("math", [
			["canResize", state.math_canResize, DEFAULTS.math_canResize],
			["autoHeight", state.math_autoHeight, DEFAULTS.math_autoHeight],
		])
	);

	for (const pl of pLines) {
		if (pl.length) lines.push(...pl);
	}

	return lines.join("\n");
}

/* ── Code generators ───────────────────────────────────── */

function generateCDN(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 4);
	const bodyIndented = indent(body, 6);

	if (state.multiroot) {
		return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SunEditor Multi-Root</title>
  <link href="${CDN_CSS}" rel="stylesheet">${themeCDNLink(state.theme)}
  <script src="${CDN_JS}"><\/script>
</head>
<body style="margin:6em 4rem 4rem">
  <h1>SunEditor Multi-Root Demo</h1>
  <textarea id="header"></textarea>
  <textarea id="body"></textarea>
  <script>
    const editor = SUNEDITOR.create({
      header: { target: document.getElementById("header") },
      body: { target: document.getElementById("body"), options: { height: "400px" } },
    }, {
${bodyIndented}
    });
  <\/script>
</body>
</html>`;
	}

	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SunEditor</title>
  <link href="${CDN_CSS}" rel="stylesheet">${themeCDNLink(state.theme)}
  <script src="${CDN_JS}"><\/script>
</head>
<body style="margin:6em 4rem 4rem">
  <h1>SunEditor Demo</h1>
  <textarea id="editor"></textarea>
  <script>
    const editor = SUNEDITOR.create(document.getElementById("editor"), {
${bodyIndented}
    });
  <\/script>
</body>
</html>`;
}

function generateVanilla(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 2);
	const bodyIndented = indent(body, 4);

	if (state.multiroot) {
		return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

const editor = suneditor.create({
  header: { target: document.getElementById("header") },
  body: { target: document.getElementById("body"), options: { height: "400px" } },
}, {
  plugins,
${bodyIndented}
});`;
	}

	return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

const editor = suneditor.create(document.getElementById("editor"), {
  plugins,
${bodyIndented}
});`;
}

function generateReact(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

export default function Editor() {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const instance = suneditor.create({
      header: { target: headerRef.current },
      body: { target: bodyRef.current, options: { height: "400px" } },
    }, {
      plugins,
${bodyIndented}
    });

    return () => instance.destroy();
  }, []);

  return (
    <div>
      <textarea ref={headerRef} />
      <textarea ref={bodyRef} />
    </div>
  );
}`;
	}

	return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

export default function Editor() {
  const ref = useRef(null);

  useEffect(() => {
    const instance = suneditor.create(ref.current, {
      plugins,
${bodyIndented}
    });

    return () => instance.destroy();
  }, []);

  return <textarea ref={ref} />;
}`;
}

function generateVue(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 4);
	const bodyIndented = indent(body, 6);

	if (state.multiroot) {
		return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

const headerEl = ref(null);
const bodyEl = ref(null);
let instance = null;

onMounted(() => {
  instance = suneditor.create({
    header: { target: headerEl.value },
    body: { target: bodyEl.value, options: { height: "400px" } },
  }, {
    plugins,
${bodyIndented}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <div>
    <textarea ref="headerEl" />
    <textarea ref="bodyEl" />
  </div>
</template>`;
	}

	return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

const el = ref(null);
let instance = null;

onMounted(() => {
  instance = suneditor.create(el.value, {
    plugins,
${bodyIndented}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <textarea ref="el" />
</template>`;
}

function generateAngular(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		return `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

@Component({
  selector: "app-editor",
  template: \`
    <textarea #headerEl></textarea>
    <textarea #bodyEl></textarea>
  \`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("headerEl", { static: true }) headerEl!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("bodyEl", { static: true }) bodyEl!: ElementRef<HTMLTextAreaElement>;
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create({
      header: { target: this.headerEl.nativeElement },
      body: { target: this.bodyEl.nativeElement, options: { height: "400px" } },
    }, {
      plugins,
${bodyIndented}
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}`;
	}

	return `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

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
${bodyIndented}
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}`;
}

function generateSvelte(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 4);
	const bodyIndented = indent(body, 6);

	if (state.multiroot) {
		return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css";
  import "suneditor/css/contents";${themeImport(state.theme)}

  let headerEl;
  let bodyEl;
  let instance;

  onMount(() => {
    instance = suneditor.create({
      header: { target: headerEl },
      body: { target: bodyEl, options: { height: "400px" } },
    }, {
      plugins,
${bodyIndented}
    });

    return () => instance?.destroy();
  });
</script>

<textarea bind:this={headerEl}></textarea>
<textarea bind:this={bodyEl}></textarea>`;
	}

	return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css";
  import "suneditor/css/contents";${themeImport(state.theme)}

  let editorEl;
  let instance;

  onMount(() => {
    instance = suneditor.create(editorEl, {
      plugins,
${bodyIndented}
    });

    return () => instance?.destroy();
  });
</script>

<textarea bind:this={editorEl}></textarea>`;
}

function generateWebComponents(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		return `import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`<textarea id="header"></textarea><textarea id="body"></textarea>\`;

    this.editor = suneditor.create({
      header: { target: this.querySelector("#header") },
      body: { target: this.querySelector("#body"), options: { height: "400px" } },
    }, {
      plugins,
${bodyIndented}
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);`;
	}

	return `import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`<textarea></textarea>\`;

    const textarea = this.querySelector("textarea");
    this.editor = suneditor.create(textarea, {
      plugins,
${bodyIndented}
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);`;
}

/* ── Public API ────────────────────────────────────────── */

const LANG_MAP: Record<CodeFramework, string> = {
	"javascript-cdn": "html",
	"javascript-npm": "javascript",
	react: "jsx",
	vue: "vue",
	angular: "typescript",
	svelte: "svelte",
	webcomponents: "javascript",
};

export function generateCode(state: PlaygroundState, framework: CodeFramework): string {
	switch (framework) {
		case "javascript-cdn":
			return generateCDN(state);
		case "react":
			return generateReact(state);
		case "vue":
			return generateVue(state);
		case "angular":
			return generateAngular(state);
		case "svelte":
			return generateSvelte(state);
		case "webcomponents":
			return generateWebComponents(state);
		default:
			return generateVanilla(state);
	}
}

export function getCodeLang(framework: CodeFramework): string {
	return LANG_MAP[framework];
}
