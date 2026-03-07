import { SUNEDITOR_VERSION, CDN_CSS, CDN_JS, fmtButtonList } from "@/data/code-examples/editorPresets";
import { type PlaygroundState, type CodeFramework, DEFAULTS, getButtonList, getRootConfigs, hasButton } from "./playgroundState";

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

/** Returns an ESM import line for lang pack, or empty string. */
function langImport(lang: string): string {
	if (!lang) return "";
	return `\nimport { ${lang} } from "suneditor/src/langs";`;
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
const KATEX_VERSION = "0.16.11";

/** CDN tags for external libraries (CodeMirror + KaTeX/MathJax) */
function extLibsCDNTags(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math");
	const lines: string[] = [];

	// CodeMirror
	lines.push(`  <link href="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.min.css" rel="stylesheet">`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/lib/codemirror.min.js"><\/script>`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/xml/xml.min.js"><\/script>`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/css/css.min.js"><\/script>`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/javascript/javascript.min.js"><\/script>`);
	lines.push(`  <script src="https://cdn.jsdelivr.net/npm/codemirror@${CM_VERSION}/mode/htmlmixed/htmlmixed.min.js"><\/script>`);

	// KaTeX
	if (needMath && state.math_mathLib === "katex") {
		lines.push(`  <link href="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css" rel="stylesheet">`);
		lines.push(`  <script src="https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js"><\/script>`);
	}

	return lines.length > 0 ? "\n" + lines.join("\n") : "";
}

/** CDN externalLibs option body */
function extLibsCDNOption(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math");
	const lines: string[] = [];
	lines.push("externalLibs: {");
	lines.push("  codeMirror: { src: CodeMirror },");
	if (needMath && state.math_mathLib === "katex") {
		lines.push("  katex: { src: katex },");
	}
	lines.push("},");
	return lines.join("\n");
}

/** NPM imports for external libraries */
function extLibsNpmImports(state: PlaygroundState): string {
	const needMath = hasButton(state.buttonListPreset, state.type, "math");
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
	const needMath = hasButton(state.buttonListPreset, state.type, "math");
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
		} catch { /* skip invalid JSON */ }
	}

	// externalLibs
	lines.push(isCDN ? extLibsCDNOption(state) : extLibsNpmOption(state));

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

	// subToolbar
	if (state.subToolbar_enabled) {
		const stLines: string[] = [];
		stLines.push(`  buttonList: ${fmtButtonList(getButtonList(state.subToolbar_buttonListPreset, state.type), indentBase + 4)},`);
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
			["uploadSingleSizeLimit", state.audio_uploadSingleSizeLimit, DEFAULTS.audio_uploadSingleSizeLimit],
			["allowMultiple", state.audio_allowMultiple, DEFAULTS.audio_allowMultiple],
			["acceptedFormats", state.audio_acceptedFormats, DEFAULTS.audio_acceptedFormats],
			["insertBehavior", state.audio_insertBehavior, DEFAULTS.audio_insertBehavior],
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
		pluginLines("fontColor", [
			["disableHEXInput", state.fontColor_disableHEXInput, DEFAULTS.fontColor_disableHEXInput],
			["splitNum", state.fontColor_splitNum, DEFAULTS.fontColor_splitNum],
		])
	);
	pLines.push(
		pluginLines("backgroundColor", [
			["disableHEXInput", state.backgroundColor_disableHEXInput, DEFAULTS.backgroundColor_disableHEXInput],
			["splitNum", state.backgroundColor_splitNum, DEFAULTS.backgroundColor_splitNum],
		])
	);
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
			["useFormatType", state.drawing_useFormatType, DEFAULTS.drawing_useFormatType],
			["defaultFormatType", state.drawing_defaultFormatType, DEFAULTS.drawing_defaultFormatType],
			["keepFormatType", state.drawing_keepFormatType, DEFAULTS.drawing_keepFormatType],
			["maintainRatio", state.drawing_maintainRatio, DEFAULTS.drawing_maintainRatio],
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
			["useCachingFieldData", state.mention_useCachingFieldData, DEFAULTS.mention_useCachingFieldData],
		])
	);
	pLines.push(
		pluginLines("math", [
			["canResize", state.math_canResize, DEFAULTS.math_canResize],
			["autoHeight", state.math_autoHeight, DEFAULTS.math_autoHeight],
		])
	);
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
		])
	);
	pLines.push(
		pluginLines("exportPDF", [
			["apiUrl", state.exportPDF_apiUrl, DEFAULTS.exportPDF_apiUrl],
			["fileName", state.exportPDF_fileName, DEFAULTS.exportPDF_fileName],
		])
	);
	pLines.push(
		pluginLines("fileUpload", [
			["uploadUrl", state.fileUpload_uploadUrl, DEFAULTS.fileUpload_uploadUrl],
			["uploadSizeLimit", state.fileUpload_uploadSizeLimit, DEFAULTS.fileUpload_uploadSizeLimit],
			["uploadSingleSizeLimit", state.fileUpload_uploadSingleSizeLimit, DEFAULTS.fileUpload_uploadSingleSizeLimit],
			["allowMultiple", state.fileUpload_allowMultiple, DEFAULTS.fileUpload_allowMultiple],
			["acceptedFormats", state.fileUpload_acceptedFormats, DEFAULTS.fileUpload_acceptedFormats],
			["as", state.fileUpload_as, DEFAULTS.fileUpload_as],
		])
	);

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
	const galPlugins: { prefix: string; entries: [string, unknown, unknown][]; jsonFields: { key: string; value: string }[] }[] = [
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

	if (state.multiroot) {
		const toolbarHtml = state.mode === "classic" ? '\n  <div id="toolbar"></div>' : '';
		const toolbarOpt = state.mode === "classic" ? '\n      toolbar_container: document.getElementById("toolbar"),' : '';
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
  <textarea id="body"></textarea>
  <script>
    const editor = SUNEDITOR.create({
${buildMultiRootTargets(state, (k) => `document.getElementById("${k}")`, 6)}
    }, {${toolbarOpt}
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
  <link href="${CDN_CSS}" rel="stylesheet">${themeCDNLink(state.theme)}${extTags}
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
		const toolbarOpt = state.mode === "classic" ? '\n  toolbar_container: document.getElementById("toolbar"),' : '';
		return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const editor = suneditor.create({
${buildMultiRootTargets(state, (k) => `document.getElementById("${k}")`, 2)}
}, {
  plugins,${toolbarOpt}
${bodyIndented}
});`;
	}

	return `// npm i suneditor@${SUNEDITOR_VERSION}
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const editor = suneditor.create(document.getElementById("editor"), {
  plugins,
${bodyIndented}
});`;
}

function generateReact(state: PlaygroundState): string {
	const body = buildOptionsBody(state, 6);
	const bodyIndented = indent(body, 8);

	if (state.multiroot) {
		const isClassic = state.mode === "classic";
		const toolbarRef = isClassic ? '\n  const toolbarRef = useRef(null);' : '';
		const toolbarOpt = isClassic ? '\n      toolbar_container: toolbarRef.current,' : '';
		const toolbarJsx = isClassic ? '\n      <div ref={toolbarRef} />' : '';
		return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

export default function Editor() {
  const headerRef = useRef(null);
  const bodyRef = useRef(null);${toolbarRef}

  useEffect(() => {
    const instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}Ref.current`, 6)}
    }, {
      plugins,${toolbarOpt}
${bodyIndented}
    });

    return () => instance.destroy();
  }, []);

  return (
    <div>${toolbarJsx}
      <textarea ref={headerRef} />
      <textarea ref={bodyRef} />
    </div>
  );
}`;
	}

	return `import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

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
		const isClassic = state.mode === "classic";
		const toolbarRefDecl = isClassic ? '\nconst toolbarEl = ref(null);' : '';
		const toolbarOpt = isClassic ? '\n    toolbar_container: toolbarEl.value,' : '';
		const toolbarTmpl = isClassic ? '\n    <div ref="toolbarEl" />' : '';
		return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

const headerEl = ref(null);
const bodyEl = ref(null);${toolbarRefDecl}
let instance = null;

onMounted(() => {
  instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}El.value`, 4)}
  }, {
    plugins,${toolbarOpt}
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
    <textarea ref="bodyEl" />
  </div>
</template>`;
	}

	return `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

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
		const isClassic = state.mode === "classic";
		const toolbarTmpl = isClassic ? '\n    <div #toolbarEl></div>' : '';
		const toolbarViewChild = isClassic ? '\n  @ViewChild("toolbarEl", { static: true }) toolbarEl!: ElementRef<HTMLDivElement>;' : '';
		const toolbarOpt = isClassic ? '\n      toolbar_container: this.toolbarEl.nativeElement,' : '';
		return `import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

@Component({
  selector: "app-editor",
  template: \`${toolbarTmpl}
    <textarea #headerEl></textarea>
    <textarea #bodyEl></textarea>
  \`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("headerEl", { static: true }) headerEl!: ElementRef<HTMLTextAreaElement>;
  @ViewChild("bodyEl", { static: true }) bodyEl!: ElementRef<HTMLTextAreaElement>;${toolbarViewChild}
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `this.${k}El.nativeElement`, 6)}
    }, {
      plugins,${toolbarOpt}
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
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

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
		const isClassic = state.mode === "classic";
		const toolbarVar = isClassic ? '\n  let toolbarEl;' : '';
		const toolbarOpt = isClassic ? '\n      toolbar_container: toolbarEl,' : '';
		const toolbarHtml = isClassic ? '\n<div bind:this={toolbarEl}></div>' : '';
		return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css";
  import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

  let headerEl;
  let bodyEl;${toolbarVar}
  let instance;

  onMount(() => {
    instance = suneditor.create({
${buildMultiRootTargets(state, (k) => `${k}El`, 6)}
    }, {
      plugins,${toolbarOpt}
${bodyIndented}
    });

    return () => instance?.destroy();
  });
</script>${toolbarHtml}

<textarea bind:this={headerEl}></textarea>
<textarea bind:this={bodyEl}></textarea>`;
	}

	return `<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css";
  import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

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
		const isClassic = state.mode === "classic";
		const toolbarInner = isClassic ? '<div id="toolbar"></div>' : '';
		const toolbarOpt = isClassic ? '\n      toolbar_container: this.querySelector("#toolbar"),' : '';
		return `import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = \`${toolbarInner}<textarea id="header"></textarea><textarea id="body"></textarea>\`;

    this.editor = suneditor.create({
${buildMultiRootTargets(state, (k) => `this.querySelector("#${k}")`, 6)}
    }, {
      plugins,${toolbarOpt}
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
import "suneditor/css/contents";${themeImport(state.theme)}${langImport(state.lang)}${extLibsNpmImports(state)}

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
