import { SUNEDITOR_VERSION, fmtButtonList } from "@/data/code-examples/editorPresets";
import { type PlaygroundState, DEFAULTS, getButtonList } from "./playgroundState";

/* ── Helpers ───────────────────────────────────────────── */

function indent(str: string, n: number): string {
	const pad = " ".repeat(n);
	return str
		.split("\n")
		.map((l) => pad + l)
		.join("\n");
}

/** Build an options object string from current state, omitting defaults. */
function buildOptionsBody(state: PlaygroundState, indentBase: number): string {
	const lines: string[] = [];
	const add = (key: string, value: string) => lines.push(`${key}: ${value},`);

	// mode
	if (state.mode !== "classic") add("mode", `"${state.mode}"`);

	// buttonList
	add("buttonList", fmtButtonList(getButtonList(state.buttonListPreset), indentBase + 2));

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
	if (state.copyFormatKeepOn) add("copyFormatKeepOn", "true");
	if (state.tabDisable) add("tabDisable", "true");
	if (!state.syncTabIndent) add("syncTabIndent", "false");
	if (state.componentInsertBehavior !== "auto") add("componentInsertBehavior", `"${state.componentInsertBehavior}"`);
	if (state.historyStackDelayTime !== 400) add("historyStackDelayTime", String(state.historyStackDelayTime));
	if (state.fullScreenOffset !== 0) add("fullScreenOffset", String(state.fullScreenOffset));
	if (state.defaultUrlProtocol) add("defaultUrlProtocol", `"${state.defaultUrlProtocol}"`);
	if (state.closeModalOutsideClick) add("closeModalOutsideClick", "true");

	// filtering
	if (!state.strictMode) add("strictMode", "false");
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

	return lines.join("\n");
}

/* ── Code generators ───────────────────────────────────── */

function generateVanilla(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 2);
	const bodyIndented = indent(body, 4);

	return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";

const editor = suneditor.create("editor", {
  plugins,
${bodyIndented}
});`;
}

function generateReact(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";

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

	return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";

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

/* ── Public API ────────────────────────────────────────── */

const LANG_MAP: Record<string, string> = {
	vanilla: "javascript",
	react: "jsx",
	vue: "vue",
};

export function generateCode(state: PlaygroundState, framework: "vanilla" | "react" | "vue"): string {
	switch (framework) {
		case "react":
			return generateReact(state);
		case "vue":
			return generateVue(state);
		default:
			return generateVanilla(state);
	}
}

export function getCodeLang(framework: "vanilla" | "react" | "vue"): string {
	return LANG_MAP[framework];
}
