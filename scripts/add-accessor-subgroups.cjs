/**
 * Adds kernel convenience accessor subgroups to api-docs JSON files.
 * These represent $.context, $.frameContext, $.options, $.frameOptions, $.frameRoots, $.icons, $.lang
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../src/data/api");

// ── Context Map properties (global DOM elements) ──
const CONTEXT_METHODS = [
	{ name: "menuTray", params: "", returns: "HTMLElement", description: "Top menu tray holding buttons, dropdowns, or custom menus." },
	{ name: "toolbar_main", params: "", returns: "HTMLElement", description: "Main toolbar element containing editor actions." },
	{ name: "toolbar_buttonTray", params: "", returns: "HTMLElement", description: "Container for main toolbar buttons." },
	{ name: "toolbar_arrow", params: "", returns: "HTMLElement", description: "Arrow indicator in toolbar (dropdown navigation)." },
	{ name: "toolbar_wrapper", params: "", returns: "HTMLElement?", description: "Wrapper for main toolbar and editor frame." },
	{ name: "toolbar_sub_main", params: "", returns: "HTMLElement?", description: "Sub-toolbar element (contextual/balloon)." },
	{ name: "toolbar_sub_buttonTray", params: "", returns: "HTMLElement?", description: "Container for sub-toolbar buttons." },
	{ name: "toolbar_sub_arrow", params: "", returns: "HTMLElement?", description: "Arrow indicator in sub-toolbar." },
	{ name: "toolbar_sub_wrapper", params: "", returns: "HTMLElement?", description: "Wrapper for sub-toolbar." },
	{ name: "statusbar_wrapper", params: "", returns: "HTMLElement?", description: "Wrapper for status bar (footer area)." },
	{ name: "_stickyDummy", params: "", returns: "HTMLElement?", description: "Dummy placeholder for sticky toolbar mode." },
];

// ── FrameContext Map properties (per-frame DOM & state) ──
const FRAME_CONTEXT_METHODS = [
	// Identification
	{ name: "key", params: "", returns: "string | null", description: "Unique key for the editor frame (multi-root editors)." },
	{ name: "options", params: "", returns: "SunEditor.FrameOptions", description: "Frame-specific options (see $.frameOptions)." },
	// Core DOM
	{ name: "originElement", params: "", returns: "HTMLElement", description: "Original source element (textarea or target)." },
	{ name: "topArea", params: "", returns: "HTMLElement", description: "Outermost container (toolbar + editor + statusbar)." },
	{ name: "container", params: "", returns: "HTMLElement", description: ".se-container element." },
	{ name: "wrapper", params: "", returns: "HTMLElement", description: ".se-wrapper element (editable area + components)." },
	{ name: "wysiwygFrame", params: "", returns: "SunEditor.WysiwygFrame", description: "WYSIWYG frame element (iframe or div)." },
	{ name: "wysiwyg", params: "", returns: "HTMLElement", description: "Actual editable content area (iframe body or contentEditable div)." },
	{ name: "codeWrapper", params: "", returns: "HTMLElement", description: "Wrapper for code-view mode." },
	{ name: "code", params: "", returns: "HTMLTextAreaElement", description: "Code view editing element (textarea or pre)." },
	{ name: "codeNumbers", params: "", returns: "HTMLTextAreaElement", description: "Line numbers element in code view." },
	{ name: "placeholder", params: "", returns: "HTMLElement", description: "Placeholder element (shown when editor is empty)." },
	{ name: "statusbar", params: "", returns: "HTMLElement", description: "Status bar element (resizing, info)." },
	{ name: "navigation", params: "", returns: "HTMLElement", description: "Navigation element (node path display)." },
	{ name: "charWrapper", params: "", returns: "HTMLElement", description: "Wrapper for character counter." },
	{ name: "charCounter", params: "", returns: "HTMLElement", description: "Character counter display element." },
	// UI Utilities
	{ name: "lineBreaker_t", params: "", returns: "HTMLElement", description: "Top floating line-breaker UI element." },
	{ name: "lineBreaker_b", params: "", returns: "HTMLElement", description: "Bottom floating line-breaker UI element." },
	// State Flags
	{ name: "isCodeView", params: "", returns: "boolean", description: "Whether in code view mode." },
	{ name: "isFullScreen", params: "", returns: "boolean", description: "Whether in fullscreen mode." },
	{ name: "isReadOnly", params: "", returns: "boolean", description: "Whether set to readonly." },
	{ name: "isDisabled", params: "", returns: "boolean", description: "Whether currently disabled." },
	{ name: "isShowBlocks", params: "", returns: "boolean?", description: "Block visualization enabled." },
	{ name: "isChanged", params: "", returns: "boolean", description: "Content changed since last save." },
	// History
	{ name: "historyIndex", params: "", returns: "number", description: "Current index in history stack (undo/redo)." },
	{ name: "savedIndex", params: "", returns: "number", description: "Last saved index in history stack." },
	// DocumentType
	{ name: "documentType", params: "", returns: "Object?", description: "Document-type specific configuration." },
	{ name: "documentTypePage", params: "", returns: "HTMLElement?", description: "Page wrapper for paginated mode." },
	// Runtime
	{ name: "_minHeight", params: "", returns: "number", description: "Minimum height of wysiwyg area." },
	{ name: "_ww", params: "", returns: "Window?", description: "Window object of WYSIWYG iframe." },
	{ name: "_wd", params: "", returns: "Document?", description: "Document object of WYSIWYG iframe." },
];

// ── Frame option keys (from schema EditorFrameOptions) ──
const FRAME_OPTION_KEYS = [
	"value", "placeholder", "editableFrameAttributes",
	"width", "minWidth", "maxWidth", "height", "minHeight", "maxHeight",
	"editorStyle", "iframe", "iframe_fullPage", "iframe_attributes", "iframe_cssFileName",
	"statusbar", "statusbar_showPathLabel", "statusbar_resizeEnable",
	"charCounter", "charCounter_max", "charCounter_label", "charCounter_type",
];

// ── Frame option types ──
const FRAME_OPTION_TYPES = {
	value: "string", placeholder: "string", editableFrameAttributes: "Object<string, string>",
	width: "string | number", minWidth: "string | number", maxWidth: "string | number",
	height: "string | number", minHeight: "string | number", maxHeight: "string | number",
	editorStyle: "string", iframe: "boolean", iframe_fullPage: "boolean",
	iframe_attributes: "Object<string, string>", iframe_cssFileName: "Array<string>",
	statusbar: "boolean", statusbar_showPathLabel: "boolean", statusbar_resizeEnable: "boolean",
	charCounter: "boolean", charCounter_max: "number | null",
	charCounter_label: "string | null", charCounter_type: '"char" | "byte" | "byte-html"',
};

// ── Base option keys (core only, excluding plugin-specific & private __) ──
const BASE_OPTION_KEYS = [
	// Plugins & Toolbar
	"plugins", "excludedPlugins", "buttonList",
	// Modes & Themes
	"v2Migration", "mode", "type", "theme", "lang", "icons", "textDirection", "reverseButtons",
	// Strict
	"strictMode", "scopeSelectionTags",
	// Content Filtering
	"elementWhitelist", "elementBlacklist", "allowedEmptyTags", "allowedClassName",
	"attributeWhitelist", "attributeBlacklist",
	// Text & Inline
	"textStyleTags", "convertTextTags", "allUsedStyles", "tagStyles", "spanStyles", "lineStyles",
	"fontSizeUnits", "retainStyleMode",
	// Line & Block
	"defaultLine", "defaultLineBreakFormat", "lineAttrReset",
	"formatLine", "formatBrLine", "formatClosureBrLine", "formatBlock", "formatClosureBlock",
	// UI & Interaction
	"closeModalOutsideClick", "syncTabIndent", "tabDisable",
	"toolbar_width", "toolbar_container", "toolbar_sticky", "toolbar_hide",
	"subToolbar", "statusbar_container",
	"shortcutsHint", "shortcutsDisable", "shortcuts",
	// Advanced
	"copyFormatKeepOn", "autoLinkify", "autoStyleify",
	"historyStackDelayTime", "printClass", "fullScreenOffset",
	"previewTemplate", "printTemplate", "componentInsertBehavior",
	"defaultUrlProtocol", "toastMessageTime", "freeCodeViewMode",
	// Dynamic
	"externalLibs", "allowedExtraTags", "events",
];

// ── Base option types ──
const BASE_OPTION_TYPES = {
	plugins: "Object | Array", excludedPlugins: "Array<string>", buttonList: "SunEditor.UI.ButtonList",
	v2Migration: "boolean", mode: '"classic" | "inline" | "balloon" | "balloon-always"',
	type: "string", theme: "string", lang: "Object<string, string>", icons: "Object<string, string>",
	textDirection: '"ltr" | "rtl"', reverseButtons: "Array<string>",
	strictMode: "true | Object", scopeSelectionTags: "Array<string>",
	elementWhitelist: "string", elementBlacklist: "string",
	allowedEmptyTags: "string", allowedClassName: "string",
	attributeWhitelist: "Object | null", attributeBlacklist: "Object | null",
	textStyleTags: "string", convertTextTags: "Object",
	allUsedStyles: "string", tagStyles: "Object<string, string>",
	spanStyles: "string", lineStyles: "string",
	fontSizeUnits: "Array<string>", retainStyleMode: '"repeat" | "always" | "none"',
	defaultLine: "string", defaultLineBreakFormat: '"line" | "br"', lineAttrReset: "string",
	formatLine: "string", formatBrLine: "string", formatClosureBrLine: "string",
	formatBlock: "string", formatClosureBlock: "string",
	closeModalOutsideClick: "boolean", syncTabIndent: "boolean", tabDisable: "boolean",
	toolbar_width: "string", toolbar_container: "HTMLElement | null",
	toolbar_sticky: "number", toolbar_hide: "boolean",
	subToolbar: "Object", statusbar_container: "HTMLElement | null",
	shortcutsHint: "boolean", shortcutsDisable: "boolean", shortcuts: "Object<string, Array<string>>",
	copyFormatKeepOn: "boolean", autoLinkify: "boolean", autoStyleify: "Array<string>",
	historyStackDelayTime: "number", printClass: "string", fullScreenOffset: "number",
	previewTemplate: "string | null", printTemplate: "string | null",
	componentInsertBehavior: "SunEditor.ComponentInsertType",
	defaultUrlProtocol: "string | null", toastMessageTime: "Object",
	freeCodeViewMode: "boolean",
	externalLibs: "Object<string, *>", allowedExtraTags: "Object<string, boolean>",
	events: "SunEditor.Event.Handlers",
};

// ── Descriptions (English) for accessors ──
const ACCESSOR_SUBGROUPS_EN = {
	frameRoots: {
		title: "$.frameRoots",
		description: "Map of all frame contexts keyed by root key. In single-root mode, contains one entry with key `null`. In multi-root mode, each root has its own key and FrameContext.",
		methods: [
			{ name: "get", params: "(rootKey: string | null)", returns: "SunEditor.FrameContext", description: "Returns the FrameContext for the given root key." },
			{ name: "set", params: "(rootKey: string | null, frameContext: FrameContext)", returns: "void", description: "Sets the FrameContext for the given root key." },
			{ name: "has", params: "(rootKey: string | null)", returns: "boolean", description: "Checks if a root key exists." },
			{ name: "keys", params: "()", returns: "Iterator<string | null>", description: "Returns an iterator of all root keys." },
			{ name: "values", params: "()", returns: "Iterator<FrameContext>", description: "Returns an iterator of all FrameContext objects." },
		],
	},
	context: {
		title: "$.context",
		description: "ContextMap — Global DOM element references shared across all frames. Contains toolbar, statusbar, and other editor-level UI elements. Stored as a Map<string, HTMLElement>.",
		methods: CONTEXT_METHODS,
	},
	frameContext: {
		title: "$.frameContext",
		description: "FrameContextMap — Per-frame DOM references and state flags for the currently active frame. Contains wysiwyg area, code view, placeholder, and runtime state. Stored as a Map.",
		methods: FRAME_CONTEXT_METHODS,
	},
	icons: {
		title: "$.icons",
		description: "Icon set object containing SVG strings for all editor UI icons. 156+ icon keys mapped to SVG markup. Customizable via the `icons` option.",
		methods: [
			{ name: "bold", params: "", returns: "string", description: "SVG string for the bold icon." },
			{ name: "italic", params: "", returns: "string", description: "SVG string for the italic icon." },
			{ name: "underline", params: "", returns: "string", description: "SVG string for the underline icon." },
			{ name: "strike", params: "", returns: "string", description: "SVG string for the strikethrough icon." },
			{ name: "...", params: "", returns: "string", description: "156+ icon keys total. Pass custom icons via the `icons` editor option." },
		],
	},
	lang: {
		title: "$.lang",
		description: "Language strings object containing all UI text for the editor. 89+ keys for toolbar tooltips, dialog labels, and status messages. Customizable via the `lang` option.",
		methods: [
			{ name: "bold", params: "", returns: "string", description: "Tooltip text for bold button." },
			{ name: "font", params: "", returns: "string", description: "Label for font selector." },
			{ name: "fontSize", params: "", returns: "string", description: "Label for font size selector." },
			{ name: "formats", params: "", returns: "string", description: "Label for format selector." },
			{ name: "...", params: "", returns: "string", description: "89+ language keys total. Pass custom language via the `lang` editor option." },
		],
	},
};

function buildOptionMethods(keys, types, descriptions) {
	return keys.map((key) => ({
		name: key,
		params: "",
		returns: types[key] || "any",
		description: descriptions[key]?.description || "",
	}));
}

// ── Process each locale ──
for (const locale of ["en", "ko", "ar"]) {
	const apiPath = path.join(DATA_DIR, `api-docs.${locale}.json`);
	const optDescPath = path.join(DATA_DIR, `option-descriptions.${locale}.json`);

	const apiDocs = JSON.parse(fs.readFileSync(apiPath, "utf8"));
	const optDesc = JSON.parse(fs.readFileSync(optDescPath, "utf8"));

	// Build options and frameOptions methods from option-descriptions
	const optionsMethods = buildOptionMethods(BASE_OPTION_KEYS, BASE_OPTION_TYPES, optDesc);
	const frameOptionsMethods = buildOptionMethods(FRAME_OPTION_KEYS, FRAME_OPTION_TYPES, optDesc);

	// Build subgroup descriptions (use English for technical items)
	const subgroups = { ...ACCESSOR_SUBGROUPS_EN };

	// Add options/frameOptions with locale-specific descriptions
	subgroups.options = {
		title: "$.options",
		description:
			locale === "ko"
				? "BaseOptionsMap — 에디터 전체에 적용되는 설정 옵션. 플러그인, 툴바, 테마, 콘텐츠 필터링, UI 동작 등을 제어합니다. Map<string, *>으로 저장됩니다."
				: locale === "ar"
				? "BaseOptionsMap — خيارات التكوين المطبقة على المحرر بأكمله. تتحكم في الإضافات وشريط الأدوات والسمات وتصفية المحتوى وسلوك واجهة المستخدم. مخزنة كـ Map."
				: "BaseOptionsMap — Configuration options applied to the entire editor. Controls plugins, toolbar, themes, content filtering, and UI behavior. Stored as a Map<string, *>.",
		methods: optionsMethods,
	};
	subgroups.frameOptions = {
		title: "$.frameOptions",
		description:
			locale === "ko"
				? "FrameOptionsMap — 개별 프레임에 적용되는 설정 옵션. 콘텐츠, 크기, iframe, 상태바, 글자수 카운터 등을 제어합니다."
				: locale === "ar"
				? "FrameOptionsMap — خيارات التكوين المطبقة على الإطار الفردي. تتحكم في المحتوى والحجم وiframe وشريط الحالة وعداد الأحرف."
				: "FrameOptionsMap — Configuration options for individual frames. Controls content, sizing, iframe mode, statusbar, and character counter.",
		methods: frameOptionsMethods,
	};

	// Merge into editor.subgroups
	for (const [key, data] of Object.entries(subgroups)) {
		apiDocs.structure.editor.subgroups[key] = data;
	}

	fs.writeFileSync(apiPath, JSON.stringify(apiDocs, null, "\t") + "\n", "utf8");
	console.log(`✓ ${locale}: added ${Object.keys(subgroups).length} accessor subgroups`);
}

console.log("\nDone!");
