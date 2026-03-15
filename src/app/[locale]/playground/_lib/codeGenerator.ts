import { SUNEDITOR_VERSION, CDN_CSS, CDN_JS, fmtButtonList } from "@/data/code-examples/editorPresets";
import {
	type PlaygroundState,
	type CodeFramework,
	DEFAULTS,
	getButtonList,
	getRootConfigs,
	hasButton,
} from "./playgroundState";

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
	entries: [string, unknown, unknown][], // [optionName, currentValue, defaultValue]
): string[] {
	const changed = entries.filter(([, cur, def]) => cur !== def);
	if (!changed.length) return [];
	const inner = changed.map(([k, v]) => {
		const val = typeof v === "string" ? `"${v}"` : String(v);
		return `  ${k}: ${val},`;
	});
	return [`${prefix}: {`, ...inner, "},"];
}

/** Merge a raw JSON field into the last pLines entry, or create a new plugin block. */
function mergeJsonField(pLines: string[][], prefix: string, key: string, rawJson: string) {
	const last = pLines[pLines.length - 1];
	if (last && last.length > 0 && last[0].startsWith(`${prefix}: {`)) {
		last.splice(last.length - 1, 0, `  ${key}: ${rawJson},`);
	} else {
		pLines.push([`${prefix}: {`, `  ${key}: ${rawJson},`, "},"]);
	}
}

/** Format comma-separated regex strings as code: [/foo/, /bar/i] */
function fmtRegExpList(str: string): string {
	const parts = str.split(",").map((s) => s.trim());
	return `[${parts.join(", ")}]`;
}

/** Format embedQuery JSON as code with RegExp patterns */
function fmtEmbedQuery(json: string): string {
	try {
		const raw = JSON.parse(json);
		const entries: string[] = [];
		for (const [key, val] of Object.entries(raw)) {
			const v = val as { pattern: string; action: string; tag: string };
			entries.push(`${key}: { pattern: ${v.pattern}, action: ${JSON.stringify(v.action)}, tag: "${v.tag}" }`);
		}
		return `{ ${entries.join(", ")} }`;
	} catch {
		return json;
	}
}

/** Returns an ESM import line for lang pack, or empty string. */
function langImport(lang: string): string {
	if (!lang) return "";
	return `\nimport ${lang} from "suneditor/langs/${lang}";`;
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

/* ── External library helpers ──────────────────────────── */

const CM_VERSION = "6.65.7";
const KATEX_VERSION = "0.16.38";
const MATHJAX_VERSION = "3";

/** Returns extra npm dependencies needed based on state (for StackBlitz package.json etc.) */
export function getNpmDeps(state: PlaygroundState): Record<string, string> {
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const deps: Record<string, string> = { codemirror: `^${CM_VERSION}` };
	if (needMath && state.math_mathLib === "katex") {
		deps.katex = `^${KATEX_VERSION}`;
	} else if (needMath && state.math_mathLib === "mathjax") {
		deps["mathjax-full"] = `^${MATHJAX_VERSION}`;
	}
	return deps;
}

/** CDN tags for external libraries (CodeMirror + KaTeX/MathJax) */
function extLibsCDNTags(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const lines: string[] = [];

	// CodeMirror
	lines.push(
		`  <link href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.min.css" rel="stylesheet">`,
	);
	lines.push(
		`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.min.js"><\/script>`,
	);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/xml/xml.min.js"><\/script>`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/css/css.min.js"><\/script>`);
	lines.push(
		`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/javascript/javascript.min.js"><\/script>`,
	);
	lines.push(
		`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/htmlmixed/htmlmixed.min.js"><\/script>`,
	);

	// KaTeX
	if (needMath && state.math_mathLib === "katex") {
		lines.push(
			`  <link href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" rel="stylesheet">`,
		);
		lines.push(`  <script src="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js"><\/script>`);
	}

	return lines.length > 0 ? "\n" + lines.join("\n") : "";
}

/** ESM import lines for MathJax (for <script type="module"> in CDN template) */
function extLibsCDNMathjaxImports(): string {
	const base = `https://esm.sh/mathjax-full@${MATHJAX_VERSION}`;
	return [
		`import { mathjax } from "${base}/js/mathjax";`,
		`import { TeX } from "${base}/js/input/tex";`,
		`import { CHTML } from "${base}/js/output/chtml";`,
		`import { browserAdaptor } from "${base}/js/adaptors/browserAdaptor";`,
		`import { RegisterHTMLHandler } from "${base}/js/handlers/html";`,
	].join("\n");
}

/** CDN externalLibs option body */
function extLibsCDNOption(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const lines: string[] = [];
	lines.push("externalLibs: {");
	lines.push("  codeMirror: { src: CodeMirror },");
	if (needMath && state.math_mathLib === "katex") {
		lines.push("  katex: { src: katex },");
	} else if (needMath && state.math_mathLib === "mathjax") {
		lines.push("  mathjax: { src: mathjax, TeX, CHTML, browserAdaptor, RegisterHTMLHandler },");
	}
	lines.push("},");
	return lines.join("\n");
}

/** NPM imports for external libraries */
function extLibsNpmImports(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const lines: string[] = [];

	lines.push(`import CodeMirror from "codemirror";`);
	lines.push(`import "codemirror/lib/codemirror.css";`);
	lines.push(`import "codemirror/mode/htmlmixed/htmlmixed";`);

	if (needMath && state.math_mathLib === "katex") {
		lines.push(`import katex from "katex";`);
		lines.push(`import "katex/dist/katex.min.css";`);
	} else if (needMath && state.math_mathLib === "mathjax") {
		lines.push(`import { mathjax } from "mathjax-full/js/mathjax";`);
		lines.push(`import { TeX } from "mathjax-full/js/input/tex";`);
		lines.push(`import { CHTML } from "mathjax-full/js/output/chtml";`);
		lines.push(`import { browserAdaptor } from "mathjax-full/js/adaptors/browserAdaptor";`);
		lines.push(`import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";`);
	}

	return "\n" + lines.join("\n");
}

/** NPM externalLibs option body */
function extLibsNpmOption(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const lines: string[] = [];
	lines.push("externalLibs: {");
	lines.push("  codeMirror: { src: CodeMirror },");
	if (needMath && state.math_mathLib === "katex") {
		lines.push("  katex: { src: katex },");
	} else if (needMath && state.math_mathLib === "mathjax") {
		lines.push("  mathjax: { src: mathjax, TeX, CHTML, browserAdaptor, RegisterHTMLHandler },");
	}
	lines.push("},");
	return lines.join("\n");
}

/** Build an options object string from current state, omitting defaults. */
function buildOptionsBody(state: PlaygroundState, indentBase: number, isCDN = false): string {
	const lines: string[] = [];
	const add = (key: string, value: string) => lines.push(`${key}: ${value},`);

	// mode
	if (state.mode !== "classic") add("mode", `"${state.mode}"`);

	// lang
	if (state.lang) add("lang", state.lang);

	// icons
	if (state.icons) {
		try {
			JSON.parse(state.icons);
			add("icons", state.icons);
		} catch {
			/* skip invalid JSON */
		}
	}

	// externalLibs
	lines.push(isCDN ? extLibsCDNOption(state) : extLibsNpmOption(state));

	// type
	if (state.type) add("type", `"${state.type}"`);

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

	// subToolbar
	if (state.subToolbar_enabled) {
		const stLines: string[] = [];
		stLines.push(
			`  buttonList: ${fmtButtonList(getButtonList(state.subToolbar_buttonListPreset, state.type), indentBase + 4)},`,
		);
		if (state.subToolbar_mode !== "balloon") stLines.push(`  mode: "${state.subToolbar_mode}",`);
		if (state.subToolbar_width !== "auto") stLines.push(`  width: "${state.subToolbar_width}",`);
		lines.push(`subToolbar: {\n${stLines.join("\n")}\n},`);
	}

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
			["uploadSingleSizeLimit", state.image_uploadSingleSizeLimit, DEFAULTS.image_uploadSingleSizeLimit],
			["allowMultiple", state.image_allowMultiple, DEFAULTS.image_allowMultiple],
			["acceptedFormats", state.image_acceptedFormats, DEFAULTS.image_acceptedFormats],
			["percentageOnlySize", state.image_percentageOnlySize, DEFAULTS.image_percentageOnlySize],
			["showHeightInput", state.image_showHeightInput, DEFAULTS.image_showHeightInput],
			["useFormatType", state.image_useFormatType, DEFAULTS.image_useFormatType],
			["defaultFormatType", state.image_defaultFormatType, DEFAULTS.image_defaultFormatType],
			["keepFormatType", state.image_keepFormatType, DEFAULTS.image_keepFormatType],
			["linkEnableFileUpload", state.image_linkEnableFileUpload, DEFAULTS.image_linkEnableFileUpload],
			["insertBehavior", state.image_insertBehavior, DEFAULTS.image_insertBehavior],
		]),
	);
	if (state.image_controls) mergeJsonField(pLines, "image", "controls", state.image_controls);
	pLines.push(
		pluginLines("video", [
			["canResize", state.video_canResize, DEFAULTS.video_canResize],
			["defaultWidth", state.video_defaultWidth, DEFAULTS.video_defaultWidth],
			["defaultHeight", state.video_defaultHeight, DEFAULTS.video_defaultHeight],
			["createFileInput", state.video_createFileInput, DEFAULTS.video_createFileInput],
			["createUrlInput", state.video_createUrlInput, DEFAULTS.video_createUrlInput],
			["uploadUrl", state.video_uploadUrl, DEFAULTS.video_uploadUrl],
			["uploadSizeLimit", state.video_uploadSizeLimit, DEFAULTS.video_uploadSizeLimit],
			["uploadSingleSizeLimit", state.video_uploadSingleSizeLimit, DEFAULTS.video_uploadSingleSizeLimit],
			["allowMultiple", state.video_allowMultiple, DEFAULTS.video_allowMultiple],
			["acceptedFormats", state.video_acceptedFormats, DEFAULTS.video_acceptedFormats],
			["percentageOnlySize", state.video_percentageOnlySize, DEFAULTS.video_percentageOnlySize],
			["showHeightInput", state.video_showHeightInput, DEFAULTS.video_showHeightInput],
			["showRatioOption", state.video_showRatioOption, DEFAULTS.video_showRatioOption],
			["defaultRatio", state.video_defaultRatio, DEFAULTS.video_defaultRatio],
			["query_youtube", state.video_query_youtube, DEFAULTS.video_query_youtube],
			["query_vimeo", state.video_query_vimeo, DEFAULTS.video_query_vimeo],
			["extensions", state.video_extensions, DEFAULTS.video_extensions],
			["insertBehavior", state.video_insertBehavior, DEFAULTS.video_insertBehavior],
		]),
	);
	if (state.video_controls) mergeJsonField(pLines, "video", "controls", state.video_controls);
	if (state.video_ratioOptions) mergeJsonField(pLines, "video", "ratioOptions", state.video_ratioOptions);
	if (state.video_urlPatterns) mergeJsonField(pLines, "video", "urlPatterns", fmtRegExpList(state.video_urlPatterns));
	if (state.video_embedQuery) mergeJsonField(pLines, "video", "embedQuery", fmtEmbedQuery(state.video_embedQuery));
	pLines.push(
		pluginLines("audio", [
			["defaultWidth", state.audio_defaultWidth, DEFAULTS.audio_defaultWidth],
			["defaultHeight", state.audio_defaultHeight, DEFAULTS.audio_defaultHeight],
			["createFileInput", state.audio_createFileInput, DEFAULTS.audio_createFileInput],
			["createUrlInput", state.audio_createUrlInput, DEFAULTS.audio_createUrlInput],
			["uploadUrl", state.audio_uploadUrl, DEFAULTS.audio_uploadUrl],
			["uploadSizeLimit", state.audio_uploadSizeLimit, DEFAULTS.audio_uploadSizeLimit],
			["uploadSingleSizeLimit", state.audio_uploadSingleSizeLimit, DEFAULTS.audio_uploadSingleSizeLimit],
			["allowMultiple", state.audio_allowMultiple, DEFAULTS.audio_allowMultiple],
			["acceptedFormats", state.audio_acceptedFormats, DEFAULTS.audio_acceptedFormats],
			["insertBehavior", state.audio_insertBehavior, DEFAULTS.audio_insertBehavior],
		]),
	);
	// HR
	if (state.hr_items) {
		lines.push(`hr: {\n  items: ${state.hr_items},\n},`);
	}
	pLines.push(
		pluginLines("table", [
			["scrollType", state.table_scrollType, DEFAULTS.table_scrollType],
			["captionPosition", state.table_captionPosition, DEFAULTS.table_captionPosition],
			["cellControllerPosition", state.table_cellControllerPosition, DEFAULTS.table_cellControllerPosition],
		]),
	);
	if (state.table_colorList) {
		const colors = state.table_colorList.split(",").map((s) => `"${s.trim()}"`);
		mergeJsonField(pLines, "table", "colorList", `[${colors.join(", ")}]`);
	}
	pLines.push(
		pluginLines("fontSize", [
			["sizeUnit", state.fontSize_sizeUnit, DEFAULTS.fontSize_sizeUnit],
			["showIncDecControls", state.fontSize_showIncDecControls, DEFAULTS.fontSize_showIncDecControls],
			["showDefaultSizeLabel", state.fontSize_showDefaultSizeLabel, DEFAULTS.fontSize_showDefaultSizeLabel],
			["disableInput", state.fontSize_disableInput, DEFAULTS.fontSize_disableInput],
		]),
	);
	if (state.fontSize_unitMap) mergeJsonField(pLines, "fontSize", "unitMap", state.fontSize_unitMap);
	pLines.push(
		pluginLines("fontColor", [
			["disableHEXInput", state.fontColor_disableHEXInput, DEFAULTS.fontColor_disableHEXInput],
			["splitNum", state.fontColor_splitNum, DEFAULTS.fontColor_splitNum],
		]),
	);
	if (state.fontColor_items) {
		const colors = state.fontColor_items.split(",").map((s) => `"${s.trim()}"`);
		mergeJsonField(pLines, "fontColor", "items", `[${colors.join(", ")}]`);
	}
	pLines.push(
		pluginLines("backgroundColor", [
			["disableHEXInput", state.backgroundColor_disableHEXInput, DEFAULTS.backgroundColor_disableHEXInput],
			["splitNum", state.backgroundColor_splitNum, DEFAULTS.backgroundColor_splitNum],
		]),
	);
	if (state.backgroundColor_items) {
		const colors = state.backgroundColor_items.split(",").map((s) => `"${s.trim()}"`);
		mergeJsonField(pLines, "backgroundColor", "items", `[${colors.join(", ")}]`);
	}
	pLines.push(
		pluginLines("embed", [
			["canResize", state.embed_canResize, DEFAULTS.embed_canResize],
			["defaultWidth", state.embed_defaultWidth, DEFAULTS.embed_defaultWidth],
			["defaultHeight", state.embed_defaultHeight, DEFAULTS.embed_defaultHeight],
			["showHeightInput", state.embed_showHeightInput, DEFAULTS.embed_showHeightInput],
			["percentageOnlySize", state.embed_percentageOnlySize, DEFAULTS.embed_percentageOnlySize],
			["uploadUrl", state.embed_uploadUrl, DEFAULTS.embed_uploadUrl],
			["uploadSizeLimit", state.embed_uploadSizeLimit, DEFAULTS.embed_uploadSizeLimit],
			["uploadSingleSizeLimit", state.embed_uploadSingleSizeLimit, DEFAULTS.embed_uploadSingleSizeLimit],
			["query_youtube", state.embed_query_youtube, DEFAULTS.embed_query_youtube],
			["query_vimeo", state.embed_query_vimeo, DEFAULTS.embed_query_vimeo],
			["insertBehavior", state.embed_insertBehavior, DEFAULTS.embed_insertBehavior],
		]),
	);
	if (state.embed_controls) mergeJsonField(pLines, "embed", "controls", state.embed_controls);
	if (state.embed_urlPatterns) mergeJsonField(pLines, "embed", "urlPatterns", fmtRegExpList(state.embed_urlPatterns));
	if (state.embed_embedQuery) mergeJsonField(pLines, "embed", "embedQuery", fmtEmbedQuery(state.embed_embedQuery));
	pLines.push(
		pluginLines("drawing", [
			["outputFormat", state.drawing_outputFormat, DEFAULTS.drawing_outputFormat],
			["lineWidth", state.drawing_lineWidth, DEFAULTS.drawing_lineWidth],
			["lineCap", state.drawing_lineCap, DEFAULTS.drawing_lineCap],
			["canResize", state.drawing_canResize, DEFAULTS.drawing_canResize],
			["lineColor", state.drawing_lineColor, DEFAULTS.drawing_lineColor],
			["lineReconnect", state.drawing_lineReconnect, DEFAULTS.drawing_lineReconnect],
			["useFormatType", state.drawing_useFormatType, DEFAULTS.drawing_useFormatType],
			["defaultFormatType", state.drawing_defaultFormatType, DEFAULTS.drawing_defaultFormatType],
			["keepFormatType", state.drawing_keepFormatType, DEFAULTS.drawing_keepFormatType],
			["maintainRatio", state.drawing_maintainRatio, DEFAULTS.drawing_maintainRatio],
		]),
	);
	if (state.drawing_formSize) mergeJsonField(pLines, "drawing", "formSize", state.drawing_formSize);
	pLines.push(
		pluginLines("mention", [
			["triggerText", state.mention_triggerText, DEFAULTS.mention_triggerText],
			["limitSize", state.mention_limitSize, DEFAULTS.mention_limitSize],
			["delayTime", state.mention_delayTime, DEFAULTS.mention_delayTime],
			["searchStartLength", state.mention_searchStartLength, DEFAULTS.mention_searchStartLength],
			["apiUrl", state.mention_apiUrl, DEFAULTS.mention_apiUrl],
			["useCachingData", state.mention_useCachingData, DEFAULTS.mention_useCachingData],
			["useCachingFieldData", state.mention_useCachingFieldData, DEFAULTS.mention_useCachingFieldData],
		]),
	);
	if (state.mention_data) mergeJsonField(pLines, "mention", "data", state.mention_data);
	pLines.push(
		pluginLines("math", [
			["canResize", state.math_canResize, DEFAULTS.math_canResize],
			["autoHeight", state.math_autoHeight, DEFAULTS.math_autoHeight],
		]),
	);
	if (state.math_fontSizeList) mergeJsonField(pLines, "math", "fontSizeList", state.math_fontSizeList);
	if (state.math_formSize) mergeJsonField(pLines, "math", "formSize", state.math_formSize);
	if (state.math_onPaste) mergeJsonField(pLines, "math", "onPaste", state.math_onPaste);
	pLines.push(
		pluginLines("link", [
			["title", state.link_title, DEFAULTS.link_title],
			["textToDisplay", state.link_textToDisplay, DEFAULTS.link_textToDisplay],
			["openNewWindow", state.link_openNewWindow, DEFAULTS.link_openNewWindow],
			["noAutoPrefix", state.link_noAutoPrefix, DEFAULTS.link_noAutoPrefix],
			["uploadUrl", state.link_uploadUrl, DEFAULTS.link_uploadUrl],
			["uploadSizeLimit", state.link_uploadSizeLimit, DEFAULTS.link_uploadSizeLimit],
			["uploadSingleSizeLimit", state.link_uploadSingleSizeLimit, DEFAULTS.link_uploadSingleSizeLimit],
			["acceptedFormats", state.link_acceptedFormats, DEFAULTS.link_acceptedFormats],
		]),
	);
	if (state.link_relList) {
		const items = state.link_relList.split(",").map((s) => `"${s.trim()}"`);
		mergeJsonField(pLines, "link", "relList", `[${items.join(", ")}]`);
	}
	if (state.link_defaultRel) mergeJsonField(pLines, "link", "defaultRel", state.link_defaultRel);
	pLines.push(
		pluginLines("exportPDF", [
			["apiUrl", state.exportPDF_apiUrl, DEFAULTS.exportPDF_apiUrl],
			["fileName", state.exportPDF_fileName, DEFAULTS.exportPDF_fileName],
		]),
	);
	pLines.push(
		pluginLines("fileUpload", [
			["uploadUrl", state.fileUpload_uploadUrl, DEFAULTS.fileUpload_uploadUrl],
			["uploadSizeLimit", state.fileUpload_uploadSizeLimit, DEFAULTS.fileUpload_uploadSizeLimit],
			[
				"uploadSingleSizeLimit",
				state.fileUpload_uploadSingleSizeLimit,
				DEFAULTS.fileUpload_uploadSingleSizeLimit,
			],
			["allowMultiple", state.fileUpload_allowMultiple, DEFAULTS.fileUpload_allowMultiple],
			["acceptedFormats", state.fileUpload_acceptedFormats, DEFAULTS.fileUpload_acceptedFormats],
			["as", state.fileUpload_as, DEFAULTS.fileUpload_as],
		["insertBehavior", state.fileUpload_insertBehavior, DEFAULTS.fileUpload_insertBehavior],
		]),
	);
	if (state.fileUpload_controls) mergeJsonField(pLines, "fileUpload", "controls", state.fileUpload_controls);

	// Items-based plugins
	if (state.align_items) {
		const items = state.align_items.split(",").map((s) => `"${s.trim()}"`);
		lines.push(`align: {\n  items: [${items.join(", ")}],\n},`);
	}
	if (state.font_items) {
		const items = state.font_items.split(",").map((s) => `"${s.trim()}"`);
		lines.push(`font: {\n  items: [${items.join(", ")}],\n},`);
	}
	if (state.blockStyle_items) {
		const items = state.blockStyle_items.split(",").map((s) => `"${s.trim()}"`);
		lines.push(`blockStyle: {\n  items: [${items.join(", ")}],\n},`);
	}
	if (state.lineHeight_items) {
		lines.push(`lineHeight: {\n  items: ${state.lineHeight_items},\n},`);
	}
	if (state.paragraphStyle_items) {
		const items = state.paragraphStyle_items.split(",").map((s) => `"${s.trim()}"`);
		lines.push(`paragraphStyle: {\n  items: [${items.join(", ")}],\n},`);
	}
	if (state.textStyle_items) {
		const items = state.textStyle_items.split(",").map((s) => `"${s.trim()}"`);
		lines.push(`textStyle: {\n  items: [${items.join(", ")}],\n},`);
	}
	if (state.template_items) {
		lines.push(`template: {\n  items: ${state.template_items},\n},`);
	}
	if (state.layout_items) {
		lines.push(`layout: {\n  items: ${state.layout_items},\n},`);
	}

	// Gallery plugins — url/thumbnail via pluginLines, data/props as raw JSON
	const galPlugins: {
		prefix: string;
		entries: [string, unknown, unknown][];
		jsonFields: { key: string; value: string }[];
	}[] = [
		{
			prefix: "imageGallery",
			entries: [["url", state.imageGallery_url, DEFAULTS.imageGallery_url]],
			jsonFields: state.imageGallery_data ? [{ key: "data", value: state.imageGallery_data }] : [],
		},
		{
			prefix: "videoGallery",
			entries: [
				["url", state.videoGallery_url, DEFAULTS.videoGallery_url],
				["thumbnail", state.videoGallery_thumbnail, DEFAULTS.videoGallery_thumbnail],
			],
			jsonFields: state.videoGallery_data ? [{ key: "data", value: state.videoGallery_data }] : [],
		},
		{
			prefix: "audioGallery",
			entries: [
				["url", state.audioGallery_url, DEFAULTS.audioGallery_url],
				["thumbnail", state.audioGallery_thumbnail, DEFAULTS.audioGallery_thumbnail],
			],
			jsonFields: state.audioGallery_data ? [{ key: "data", value: state.audioGallery_data }] : [],
		},
		{
			prefix: "fileGallery",
			entries: [
				["url", state.fileGallery_url, DEFAULTS.fileGallery_url],
				["thumbnail", state.fileGallery_thumbnail, DEFAULTS.fileGallery_thumbnail],
			],
			jsonFields: state.fileGallery_data ? [{ key: "data", value: state.fileGallery_data }] : [],
		},
		{
			prefix: "fileBrowser",
			entries: [
				["url", state.fileBrowser_url, DEFAULTS.fileBrowser_url],
				["thumbnail", state.fileBrowser_thumbnail, DEFAULTS.fileBrowser_thumbnail],
			],
			jsonFields: [
				...(state.fileBrowser_data ? [{ key: "data", value: state.fileBrowser_data }] : []),
				...(state.fileBrowser_props ? [{ key: "props", value: state.fileBrowser_props }] : []),
			],
		},
	];
	for (const gal of galPlugins) {
		const changed = gal.entries.filter(([, cur, def]) => cur !== def);
		if (!changed.length && !gal.jsonFields.length) continue;
		const inner: string[] = [];
		for (const [k, v] of changed) {
			inner.push(`  ${k}: "${v}",`);
		}
		for (const jf of gal.jsonFields) {
			inner.push(`  ${jf.key}: ${jf.value},`);
		}
		lines.push(`${gal.prefix}: {\n${inner.join("\n")}\n},`);
	}

	for (const pl of pLines) {
		if (pl.length) lines.push(...pl);
	}

	// buttonList — always last
	lines.push(
		`buttonList: ${fmtButtonList(getButtonList(state.buttonListPreset, state.type, state.customButtonList), indentBase + 2)},`,
	);

	return lines.join("\n");
}

/** Format a value for code output */
function fmtVal(v: unknown): string {
	if (typeof v === "string") return `"${v}"`;
	if (typeof v === "boolean" || typeof v === "number") return String(v);
	if (v === null) return "null";
	if (Array.isArray(v)) return `[${v.map(fmtVal).join(", ")}]`;
	if (typeof v === "object") return JSON.stringify(v);
	return String(v);
}

/** Build per-root target entries for multiroot create() calls */
function buildMultiRootTargets(state: PlaygroundState, targetExpr: (key: string) => string, pad: number): string {
	const roots = getRootConfigs(state);
	const lines: string[] = [];
	const p = " ".repeat(pad);
	for (const root of roots) {
		const optEntries = Object.entries(root.options).filter(([, v]) => v !== undefined && v !== "");
		if (optEntries.length === 0) {
			lines.push(`${p}${root.key}: { target: ${targetExpr(root.key)} },`);
		} else if (optEntries.length <= 3) {
			const optStr = optEntries.map(([k, v]) => `${k}: ${fmtVal(v)}`).join(", ");
			lines.push(`${p}${root.key}: { target: ${targetExpr(root.key)}, options: { ${optStr} } },`);
		} else {
			// Multi-line for readability when many options
			lines.push(`${p}${root.key}: {`);
			lines.push(`${p}  target: ${targetExpr(root.key)},`);
			lines.push(`${p}  options: {`);
			for (const [k, v] of optEntries) {
				lines.push(`${p}    ${k}: ${fmtVal(v)},`);
			}
			lines.push(`${p}  },`);
			lines.push(`${p}},`);
		}
	}
	return lines.join("\n");
}

/* ── Code generators ───────────────────────────────────── */

function generateCDN(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 4, true);
	const bodyIndented = indent(body, 6);
	const extTags = extLibsCDNTags(state);
	const needMath = hasButton(state.buttonListPreset, state.type, "math", state.customButtonList);
	const useMathJax = needMath && state.math_mathLib === "mathjax";
	const scriptOpen = useMathJax ? '<script type="module">' : "<script>";
	const mjImports = useMathJax
		? extLibsCDNMathjaxImports()
				.split("\n")
				.join("\n    ") + "\n\n    "
		: "    ";

	if (state.multiroot) {
		const toolbarHtml = state.mode === "classic" ? '\n  <div id="toolbar"></div>' : "";
		const toolbarOpt =
			state.mode === "classic" ? '\n      toolbar_container: document.getElementById("toolbar"),' : "";
		const statusbarHtml = state.statusbar_container_enabled ? '\n  <div id="statusbar"></div>' : "";
		const statusbarOpt = state.statusbar_container_enabled ? '\n      statusbar_container: document.getElementById("statusbar"),' : "";
		return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SunEditor Multi-Root</title>
  <link href="${CDN_CSS}" rel="stylesheet">${themeCDNLink(state.theme)}${extTags}
  <script src="${CDN_JS}"><\/script>
</head>
<body style="margin:6em 4rem 4rem">
  <h1>SunEditor Multi-Root Demo</h1>${toolbarHtml}
  <textarea id="header"></textarea>
  <textarea id="body"></textarea>${statusbarHtml}
  ${scriptOpen}
    ${mjImports}const editor = SUNEDITOR.create({
${buildMultiRootTargets(state, (k) => `document.getElementById("${k}")`, 6)}
    }, {${toolbarOpt}${statusbarOpt}
${bodyIndented}
    });
  <\/script>
</body>
</html>`;
	}

	const toolbarHtmlS = state.toolbar_container_enabled && state.mode === "classic" ? '\n  <div id="toolbar"></div>' : "";
	const toolbarOptS = state.toolbar_container_enabled && state.mode === "classic" ? '\n      toolbar_container: document.getElementById("toolbar"),' : "";
	const statusbarHtmlS = state.statusbar_container_enabled ? '\n  <div id="statusbar"></div>' : "";
	const statusbarOptS = state.statusbar_container_enabled ? '\n      statusbar_container: document.getElementById("statusbar"),' : "";
	return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SunEditor</title>
  <link href="${CDN_CSS}" rel="stylesheet">${themeCDNLink(state.theme)}${extTags}
  <script src="${CDN_JS}"><\/script>
</head>
<body style="margin:6em 4rem 4rem">
  <h1>SunEditor Demo</h1>${toolbarHtmlS}
  <textarea id="editor"></textarea>${statusbarHtmlS}
  ${scriptOpen}
    ${mjImports}const editor = SUNEDITOR.create(document.getElementById("editor"), {${toolbarOptS}${statusbarOptS}
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
		const toolbarOpt = state.mode === "classic" ? '\n  toolbar_container: document.getElementById("toolbar"),' : "";
		const statusbarOptV = state.statusbar_container_enabled ? '\n  statusbar_container: document.getElementById("statusbar"),' : "";
		return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const editor = suneditor.create({
${buildMultiRootTargets(state, (k) => `document.getElementById("${k}")`, 2)}
}, {
  plugins,${toolbarOpt}${statusbarOptV}
${bodyIndented}
});`;
	}

	const toolbarOptVS = state.toolbar_container_enabled && state.mode === "classic" ? '\n  toolbar_container: document.getElementById("toolbar"),' : "";
	const statusbarOptVS = state.statusbar_container_enabled ? '\n  statusbar_container: document.getElementById("statusbar"),' : "";
	return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const editor = suneditor.create(document.getElementById("editor"), {
  plugins,${toolbarOptVS}${statusbarOptVS}
${bodyIndented}
});`;
}

function generateReact(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		const isClassic = state.mode === "classic";
		const toolbarRef = isClassic ? "\n  const toolbarRef = useRef(null);" : "";
		const toolbarOpt = isClassic ? "\n      toolbar_container: toolbarRef.current," : "";
		const toolbarJsx = isClassic ? "\n      <div ref={toolbarRef} />" : "";
		const statusbarRefR = state.statusbar_container_enabled ? "\n  const statusbarRef = useRef(null);" : "";
		const statusbarOptR = state.statusbar_container_enabled ? "\n      statusbar_container: statusbarRef.current," : "";
		const statusbarJsxR = state.statusbar_container_enabled ? "\n      <div ref={statusbarRef} />" : "";
		return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

export default function Editor() {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);${toolbarRef}${statusbarRefR}

  useEffect(() => {
    const instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}Ref.current`, 6)}
    }, {
      plugins,${toolbarOpt}${statusbarOptR}
${bodyIndented}
    });

    return () => instance.destroy();
  }, []);

  return (
    <div>${toolbarJsx}
      <textarea ref={headerRef} />
      <textarea ref={bodyRef} />${statusbarJsxR}
    </div>
  );
}`;
	}

	const toolbarRefRS = state.toolbar_container_enabled && state.mode === "classic" ? "\n  const toolbarRef = useRef(null);" : "";
	const toolbarOptRS = state.toolbar_container_enabled && state.mode === "classic" ? "\n      toolbar_container: toolbarRef.current," : "";
	const toolbarJsxRS = state.toolbar_container_enabled && state.mode === "classic" ? "\n      <div ref={toolbarRef} />" : "";
	const statusbarRefRS = state.statusbar_container_enabled ? "\n  const statusbarRef = useRef(null);" : "";
	const statusbarOptRS = state.statusbar_container_enabled ? "\n      statusbar_container: statusbarRef.current," : "";
	const statusbarJsxRS = state.statusbar_container_enabled ? "\n      <div ref={statusbarRef} />" : "";
	const reactNeedWrapper = (state.toolbar_container_enabled && state.mode === "classic") || state.statusbar_container_enabled;
	const reactReturn = reactNeedWrapper
		? `  return (\n    <div>${toolbarJsxRS}\n      <textarea ref={ref} />${statusbarJsxRS}\n    </div>\n  );`
		: `  return <textarea ref={ref} />;`;
	return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

export default function Editor() {
  const ref = useRef(null);${toolbarRefRS}${statusbarRefRS}

  useEffect(() => {
    const instance = suneditor.create(ref.current, {
      plugins,${toolbarOptRS}${statusbarOptRS}
${bodyIndented}
    });

    return () => instance.destroy();
  }, []);

${reactReturn}
}`;
}

function generateVue(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 4);
	const bodyIndented = indent(body, 6);

	if (state.multiroot) {
		const isClassic = state.mode === "classic";
		const toolbarRefDecl = isClassic ? "\nconst toolbarEl = ref(null);" : "";
		const toolbarOpt = isClassic ? "\n    toolbar_container: toolbarEl.value," : "";
		const toolbarTmpl = isClassic ? '\n    <div ref="toolbarEl" />' : "";
		const statusbarDeclV = state.statusbar_container_enabled ? "\nconst statusbarEl = ref(null);" : "";
		const statusbarOptV2 = state.statusbar_container_enabled ? "\n    statusbar_container: statusbarEl.value," : "";
		const statusbarTmplV = state.statusbar_container_enabled ? '\n    <div ref="statusbarEl" />' : "";
		return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const headerEl = ref(null);
const bodyEl = ref(null);${toolbarRefDecl}${statusbarDeclV}
let instance = null;

onMounted(() => {
  instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}El.value`, 4)}
  }, {
    plugins,${toolbarOpt}${statusbarOptV2}
${bodyIndented}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <div>${toolbarTmpl}
    <textarea ref="headerEl" />
    <textarea ref="bodyEl" />${statusbarTmplV}
  </div>
</template>`;
	}

	const toolbarDeclVS = state.toolbar_container_enabled && state.mode === "classic" ? "\nconst toolbarEl = ref(null);" : "";
	const toolbarOptVS = state.toolbar_container_enabled && state.mode === "classic" ? "\n    toolbar_container: toolbarEl.value," : "";
	const statusbarDeclVS = state.statusbar_container_enabled ? "\nconst statusbarEl = ref(null);" : "";
	const statusbarOptVS = state.statusbar_container_enabled ? "\n    statusbar_container: statusbarEl.value," : "";
	const vueNeedWrapper = (state.toolbar_container_enabled && state.mode === "classic") || state.statusbar_container_enabled;
	const toolbarTmplVS = state.toolbar_container_enabled && state.mode === "classic" ? '\n    <div ref="toolbarEl" />' : "";
	const statusbarTmplVS = state.statusbar_container_enabled ? '\n    <div ref="statusbarEl" />' : "";
	const vueTmpl = vueNeedWrapper
		? `<template>\n  <div>${toolbarTmplVS}\n    <textarea ref="el" />${statusbarTmplVS}\n  </div>\n</template>`
		: `<template>\n  <textarea ref="el" />\n</template>`;
	return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const el = ref(null);${toolbarDeclVS}${statusbarDeclVS}
let instance = null;

onMounted(() => {
  instance = suneditor.create(el.value, {
    plugins,${toolbarOptVS}${statusbarOptVS}
${bodyIndented}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

${vueTmpl}`;
}

function generateAngular(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		const isClassic = state.mode === "classic";
		const toolbarTmpl = isClassic ? "\n    <div #toolbarEl></div>" : "";
		const toolbarViewChild = isClassic
			? '\n  @ViewChild("toolbarEl", { static: true }) toolbarEl!: ElementRef<HTMLDivElement>;'
			: "";
		const toolbarOpt = isClassic ? "\n      toolbar_container: this.toolbarEl.nativeElement," : "";
		const statusbarTmplA = state.statusbar_container_enabled ? "\n    <div #statusbarEl></div>" : "";
		const statusbarViewChildA = state.statusbar_container_enabled
			? '\n  @ViewChild("statusbarEl", { static: true }) statusbarEl!: ElementRef<HTMLDivElement>;'
			: "";
		const statusbarOptA = state.statusbar_container_enabled ? "\n      statusbar_container: this.statusbarEl.nativeElement," : "";
		return `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

@Component({
  selector: "app-editor",
  template: \`${toolbarTmpl}
    <textarea #headerEl></textarea>
    <textarea #bodyEl></textarea>${statusbarTmplA}
  \`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("headerEl", { static: true }) headerEl!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("bodyEl", { static: true }) bodyEl!: ElementRef<HTMLTextAreaElement>;${toolbarViewChild}${statusbarViewChildA}
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `this.${k}El.nativeElement`, 6)}
    }, {
      plugins,${toolbarOpt}${statusbarOptA}
${bodyIndented}
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}`;
	}

	const toolbarTmplAS = state.toolbar_container_enabled && state.mode === "classic" ? "<div #toolbarEl></div>\n    " : "";
	const toolbarViewChildAS = state.toolbar_container_enabled && state.mode === "classic"
		? '\n  @ViewChild("toolbarEl", { static: true }) toolbarEl!: ElementRef<HTMLDivElement>;'
		: "";
	const toolbarOptAS = state.toolbar_container_enabled && state.mode === "classic" ? "\n      toolbar_container: this.toolbarEl.nativeElement," : "";
	const statusbarTmplAS = state.statusbar_container_enabled ? "\n    <div #statusbarEl></div>" : "";
	const statusbarViewChildAS = state.statusbar_container_enabled
		? '\n  @ViewChild("statusbarEl", { static: true }) statusbarEl!: ElementRef<HTMLDivElement>;'
		: "";
	const statusbarOptAS = state.statusbar_container_enabled ? "\n      statusbar_container: this.statusbarEl.nativeElement," : "";
	return `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

@Component({
  selector: "app-editor",
  template: \`${toolbarTmplAS}<textarea #editorEl></textarea>${statusbarTmplAS}\`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorEl", { static: true }) editorEl!: ElementRef<HTMLTextAreaElement>;${toolbarViewChildAS}${statusbarViewChildAS}
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create(this.editorEl.nativeElement, {
      plugins,${toolbarOptAS}${statusbarOptAS}
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
		const isClassic = state.mode === "classic";
		const toolbarVar = isClassic ? "\n  let toolbarEl;" : "";
		const toolbarOpt = isClassic ? "\n      toolbar_container: toolbarEl," : "";
		const toolbarHtml = isClassic ? "\n<div bind:this={toolbarEl}></div>" : "";
		const statusbarVarSv = state.statusbar_container_enabled ? "\n  let statusbarEl;" : "";
		const statusbarOptSv = state.statusbar_container_enabled ? "\n      statusbar_container: statusbarEl," : "";
		const statusbarHtmlSv = state.statusbar_container_enabled ? "\n<div bind:this={statusbarEl}></div>" : "";
		return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css/editor";
  import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

  let headerEl;
  let bodyEl;${toolbarVar}${statusbarVarSv}
  let instance;

  onMount(() => {
    instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}El`, 6)}
    }, {
      plugins,${toolbarOpt}${statusbarOptSv}
${bodyIndented}
    });

    return () => instance?.destroy();
  });
</script>${toolbarHtml}

<textarea bind:this={headerEl}></textarea>
<textarea bind:this={bodyEl}></textarea>${statusbarHtmlSv}`;
	}

	const toolbarVarSS = state.toolbar_container_enabled && state.mode === "classic" ? "\n  let toolbarEl;" : "";
	const toolbarOptSS = state.toolbar_container_enabled && state.mode === "classic" ? "\n      toolbar_container: toolbarEl," : "";
	const toolbarHtmlSS = state.toolbar_container_enabled && state.mode === "classic" ? "\n<div bind:this={toolbarEl}></div>" : "";
	const statusbarVarSS = state.statusbar_container_enabled ? "\n  let statusbarEl;" : "";
	const statusbarOptSS = state.statusbar_container_enabled ? "\n      statusbar_container: statusbarEl," : "";
	const statusbarHtmlSS = state.statusbar_container_enabled ? "\n<div bind:this={statusbarEl}></div>" : "";
	return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css/editor";
  import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

  let editorEl;${toolbarVarSS}${statusbarVarSS}
  let instance;

  onMount(() => {
    instance = suneditor.create(editorEl, {
      plugins,${toolbarOptSS}${statusbarOptSS}
${bodyIndented}
    });

    return () => instance?.destroy();
  });
</script>${toolbarHtmlSS}

<textarea bind:this={editorEl}></textarea>${statusbarHtmlSS}`;
}

function generateWebComponents(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		const isClassic = state.mode === "classic";
		const toolbarInner = isClassic ? '<div id="toolbar"></div>' : "";
		const toolbarOpt = isClassic ? '\n      toolbar_container: this.querySelector("#toolbar"),' : "";
		const statusbarInnerWC = state.statusbar_container_enabled ? '<div id="statusbar"></div>' : "";
		const statusbarOptWC = state.statusbar_container_enabled ? '\n      statusbar_container: this.querySelector("#statusbar"),' : "";
		return `import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`${toolbarInner}<textarea id="header"></textarea><textarea id="body"></textarea>${statusbarInnerWC}\`;

    this.editor = suneditor.create({
${buildMultiRootTargets(state, (k) => `this.querySelector("#${k}")`, 6)}
    }, {
      plugins,${toolbarOpt}${statusbarOptWC}
${bodyIndented}
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);`;
	}

	const toolbarInnerWCS = state.toolbar_container_enabled && state.mode === "classic" ? '<div id="toolbar"></div>' : "";
	const toolbarOptWCS = state.toolbar_container_enabled && state.mode === "classic" ? '\n      toolbar_container: this.querySelector("#toolbar"),' : "";
	const statusbarInnerWCS = state.statusbar_container_enabled ? '<div id="statusbar"></div>' : "";
	const statusbarOptWCS = state.statusbar_container_enabled ? '\n      statusbar_container: this.querySelector("#statusbar"),' : "";
		return `import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`${toolbarInnerWCS}<textarea></textarea>${statusbarInnerWCS}\`;

    const textarea = this.querySelector("textarea");
    this.editor = suneditor.create(textarea, {
      plugins,${toolbarOptWCS}${statusbarOptWCS}
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
