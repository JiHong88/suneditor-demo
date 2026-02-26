import { BASIC_BUTTON_LIST, STANDARD_BUTTON_LIST, FULL_BUTTON_LIST } from "@/data/code-examples/editorPresets";

/* ── Types ─────────────────────────────────────────────── */

export type ButtonListPreset = "basic" | "standard" | "full";
export type CodeFramework = "javascript-cdn" | "javascript-npm" | "react" | "vue" | "angular" | "svelte" | "webcomponents";

export interface PlaygroundState {
	// — Mode & Theme —
	mode: "classic" | "inline" | "balloon" | "balloon-always";
	buttonListPreset: ButtonListPreset;
	type: string;
	theme: string;
	textDirection: "ltr" | "rtl";

	// — Layout & Sizing (frame) —
	width: string;
	minWidth: string;
	maxWidth: string;
	height: string;
	minHeight: string;
	maxHeight: string;
	editorStyle: string;

	// — Toolbar —
	toolbar_width: string;
	toolbar_sticky: number;
	toolbar_hide: boolean;
	shortcutsHint: boolean;
	shortcutsDisable: boolean;

	// — Statusbar & Counter (frame) —
	statusbar: boolean;
	statusbar_showPathLabel: boolean;
	statusbar_resizeEnable: boolean;
	charCounter: boolean;
	charCounter_max: number | null;
	charCounter_label: string;
	charCounter_type: "char" | "byte" | "byte-html";

	// — Content & Behavior —
	placeholder: string;
	iframe: boolean;
	iframe_fullPage: boolean;
	iframe_attributes: string;
	iframe_cssFileName: string;
	editableFrameAttributes: string;
	defaultLine: string;
	defaultLineBreakFormat: "line" | "br";
	retainStyleMode: "repeat" | "always" | "none";
	freeCodeViewMode: boolean;

	// — Features —
	autoLinkify: boolean;
	autoStyleify: string;
	copyFormatKeepOn: boolean;
	tabDisable: boolean;
	syncTabIndent: boolean;
	componentInsertBehavior: "auto" | "select" | "line" | "none";
	historyStackDelayTime: number;
	fullScreenOffset: number;
	defaultUrlProtocol: string;
	closeModalOutsideClick: boolean;
	previewTemplate: string;
	printTemplate: string;
	toastMessageTime: number;

	// — Filtering (Advanced) —
	strictMode: boolean;
	elementWhitelist: string;
	elementBlacklist: string;
	attributeWhitelist: string;
	attributeBlacklist: string;
	fontSizeUnits: string;
	lineAttrReset: string;
	printClass: string;
	formatLine: string;
	formatBrLine: string;
	formatClosureBrLine: string;
	formatBlock: string;
	formatClosureBlock: string;
	spanStyles: string;
	lineStyles: string;
	textStyleTags: string;
	allowedEmptyTags: string;
	allowedClassName: string;
	allUsedStyles: string;
	scopeSelectionTags: string;

	// — Plugin: Image —
	image_canResize: boolean;
	image_defaultWidth: string;
	image_defaultHeight: string;
	image_createFileInput: boolean;
	image_createUrlInput: boolean;

	// — Plugin: Video —
	video_canResize: boolean;
	video_defaultWidth: string;
	video_defaultHeight: string;
	video_createFileInput: boolean;
	video_createUrlInput: boolean;

	// — Plugin: Audio —
	audio_defaultWidth: string;
	audio_defaultHeight: string;
	audio_createFileInput: boolean;
	audio_createUrlInput: boolean;

	// — Plugin: Table —
	table_scrollType: "x" | "y" | "xy";
	table_captionPosition: "top" | "bottom";
	table_cellControllerPosition: "cell" | "table";

	// — Plugin: FontSize —
	fontSize_sizeUnit: string;
	fontSize_showIncDecControls: boolean;

	// — Plugin: FontColor —
	fontColor_disableHEXInput: boolean;

	// — Plugin: BackgroundColor —
	backgroundColor_disableHEXInput: boolean;

	// — Plugin: Embed —
	embed_canResize: boolean;
	embed_defaultWidth: string;
	embed_defaultHeight: string;

	// — Plugin: Drawing —
	drawing_outputFormat: "dataurl" | "svg";
	drawing_lineWidth: number;
	drawing_lineCap: "butt" | "round" | "square";

	// — Plugin: Mention —
	mention_triggerText: string;
	mention_limitSize: number;
	mention_delayTime: number;

	// — Plugin: Math —
	math_canResize: boolean;
	math_autoHeight: boolean;

	// — UI state (not serialized) —
	codeFramework: CodeFramework;
	codePanelOpen: boolean;
}

/* ── Defaults ──────────────────────────────────────────── */

export const DEFAULTS: PlaygroundState = {
	mode: "classic",
	buttonListPreset: "standard",
	type: "",
	theme: "",
	textDirection: "ltr",

	width: "100%",
	minWidth: "",
	maxWidth: "",
	height: "auto",
	minHeight: "",
	maxHeight: "",
	editorStyle: "",

	toolbar_width: "auto",
	toolbar_sticky: 0,
	toolbar_hide: false,
	shortcutsHint: true,
	shortcutsDisable: false,

	statusbar: true,
	statusbar_showPathLabel: true,
	statusbar_resizeEnable: true,
	charCounter: false,
	charCounter_max: null,
	charCounter_label: "",
	charCounter_type: "char",

	placeholder: "",
	iframe: false,
	iframe_fullPage: false,
	iframe_attributes: "",
	iframe_cssFileName: "suneditor",
	editableFrameAttributes: "",
	defaultLine: "p",
	defaultLineBreakFormat: "line",
	retainStyleMode: "repeat",
	freeCodeViewMode: false,

	autoLinkify: true,
	autoStyleify: "bold,underline,italic,strike",
	copyFormatKeepOn: false,
	tabDisable: false,
	syncTabIndent: true,
	componentInsertBehavior: "auto",
	historyStackDelayTime: 400,
	fullScreenOffset: 0,
	defaultUrlProtocol: "",
	closeModalOutsideClick: false,
	previewTemplate: "",
	printTemplate: "",
	toastMessageTime: 1500,

	strictMode: true,
	elementWhitelist: "",
	elementBlacklist: "",
	attributeWhitelist: "",
	attributeBlacklist: "",
	fontSizeUnits: "px,pt,em,rem",
	lineAttrReset: "",
	printClass: "",
	formatLine: "",
	formatBrLine: "",
	formatClosureBrLine: "",
	formatBlock: "",
	formatClosureBlock: "",
	spanStyles: "",
	lineStyles: "",
	textStyleTags: "",
	allowedEmptyTags: "",
	allowedClassName: "",
	allUsedStyles: "",
	scopeSelectionTags: "",

	// Plugin: Image
	image_canResize: true,
	image_defaultWidth: "auto",
	image_defaultHeight: "auto",
	image_createFileInput: true,
	image_createUrlInput: true,

	// Plugin: Video
	video_canResize: true,
	video_defaultWidth: "",
	video_defaultHeight: "",
	video_createFileInput: false,
	video_createUrlInput: true,

	// Plugin: Audio
	audio_defaultWidth: "300px",
	audio_defaultHeight: "54px",
	audio_createFileInput: true,
	audio_createUrlInput: true,

	// Plugin: Table
	table_scrollType: "x",
	table_captionPosition: "bottom",
	table_cellControllerPosition: "cell",

	// Plugin: FontSize
	fontSize_sizeUnit: "px",
	fontSize_showIncDecControls: false,

	// Plugin: FontColor
	fontColor_disableHEXInput: false,

	// Plugin: BackgroundColor
	backgroundColor_disableHEXInput: false,

	// Plugin: Embed
	embed_canResize: true,
	embed_defaultWidth: "",
	embed_defaultHeight: "",

	// Plugin: Drawing
	drawing_outputFormat: "dataurl",
	drawing_lineWidth: 5,
	drawing_lineCap: "round",

	// Plugin: Mention
	mention_triggerText: "@",
	mention_limitSize: 5,
	mention_delayTime: 200,

	// Plugin: Math
	math_canResize: true,
	math_autoHeight: false,

	codeFramework: "javascript-npm",
	codePanelOpen: true,
};

/* ── Fixed option keys (require remount) ───────────────── */

/** Base options flagged as 'fixed' in OPTION_FIXED_FLAG */
const FIXED_BASE_KEYS: (keyof PlaygroundState)[] = [
	"mode",
	"buttonListPreset",
	"type",
	"shortcutsDisable",
	"closeModalOutsideClick",
	"defaultLine",
	"strictMode",
	"elementWhitelist",
	"elementBlacklist",
	"attributeWhitelist",
	"attributeBlacklist",
	"fontSizeUnits",
	"formatLine",
	"formatBrLine",
	"formatClosureBrLine",
	"formatBlock",
	"formatClosureBlock",
	"spanStyles",
	"lineStyles",
	"textStyleTags",
	"allowedClassName",
	"allUsedStyles",
];

/** Frame options flagged as 'fixed' in OPTION_FRAME_FIXED_FLAG */
const FIXED_FRAME_KEYS: (keyof PlaygroundState)[] = ["iframe", "iframe_fullPage", "statusbar_resizeEnable"];

/** Plugin options are effectively fixed (plugins themselves are fixed) */
const FIXED_PLUGIN_KEYS: (keyof PlaygroundState)[] = [
	"image_canResize",
	"image_defaultWidth",
	"image_defaultHeight",
	"image_createFileInput",
	"image_createUrlInput",
	"video_canResize",
	"video_defaultWidth",
	"video_defaultHeight",
	"video_createFileInput",
	"video_createUrlInput",
	"audio_defaultWidth",
	"audio_defaultHeight",
	"audio_createFileInput",
	"audio_createUrlInput",
	"table_scrollType",
	"table_captionPosition",
	"table_cellControllerPosition",
	"fontSize_sizeUnit",
	"fontSize_showIncDecControls",
	"fontColor_disableHEXInput",
	"backgroundColor_disableHEXInput",
	"embed_canResize",
	"embed_defaultWidth",
	"embed_defaultHeight",
	"drawing_outputFormat",
	"drawing_lineWidth",
	"drawing_lineCap",
	"mention_triggerText",
	"mention_limitSize",
	"mention_delayTime",
	"math_canResize",
	"math_autoHeight",
];

const FIXED_KEYS = new Set<string>([...FIXED_BASE_KEYS, ...FIXED_FRAME_KEYS, ...FIXED_PLUGIN_KEYS]);

export function isFixedOption(key: string): boolean {
	return FIXED_KEYS.has(key);
}

/* ── Reducer ───────────────────────────────────────────── */

export type PlaygroundAction =
	| { type: "SET"; key: keyof PlaygroundState; value: PlaygroundState[keyof PlaygroundState] }
	| { type: "RESET" }
	| { type: "LOAD"; payload: Partial<PlaygroundState> };

export function playgroundReducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
	switch (action.type) {
		case "SET":
			if (state[action.key] === action.value) return state;
			return { ...state, [action.key]: action.value };
		case "RESET":
			return { ...DEFAULTS };
		case "LOAD":
			return { ...DEFAULTS, ...action.payload };
		default:
			return state;
	}
}

/* ── Button list mapping ───────────────────────────────── */

export function getButtonList(preset: ButtonListPreset): string[][] {
	switch (preset) {
		case "basic":
			return BASIC_BUTTON_LIST;
		case "full":
			return FULL_BUTTON_LIST;
		default:
			return STANDARD_BUTTON_LIST;
	}
}

/* ── State → SunEditor options ─────────────────────────── */

export function stateToEditorOptions(state: PlaygroundState) {
	const opts: Record<string, unknown> = {
		mode: state.mode,
		buttonList: getButtonList(state.buttonListPreset),
		textDirection: state.textDirection,

		// layout (frame)
		width: state.width || "100%",
		height: state.height || "auto",

		// toolbar
		toolbar_sticky: state.toolbar_sticky,
		toolbar_hide: state.toolbar_hide,
		shortcutsHint: state.shortcutsHint,
		shortcutsDisable: state.shortcutsDisable,

		// statusbar (frame)
		statusbar: state.statusbar,
		statusbar_showPathLabel: state.statusbar_showPathLabel,
		statusbar_resizeEnable: state.statusbar_resizeEnable,
		charCounter: state.charCounter,
		charCounter_type: state.charCounter_type,

		// content
		defaultLineBreakFormat: state.defaultLineBreakFormat,
		retainStyleMode: state.retainStyleMode,
		freeCodeViewMode: state.freeCodeViewMode,

		// features
		autoLinkify: state.autoLinkify,
		copyFormatKeepOn: state.copyFormatKeepOn,
		tabDisable: state.tabDisable,
		syncTabIndent: state.syncTabIndent,
		componentInsertBehavior: state.componentInsertBehavior,
		historyStackDelayTime: state.historyStackDelayTime,
		fullScreenOffset: state.fullScreenOffset,
		closeModalOutsideClick: state.closeModalOutsideClick,

		// filtering
		strictMode: state.strictMode,
	};

	// theme
	if (state.theme) opts.theme = state.theme;

	// type
	if (state.type) opts.type = state.type;

	// optional strings (only set if non-empty / non-default)
	if (state.minWidth) opts.minWidth = state.minWidth;
	if (state.maxWidth) opts.maxWidth = state.maxWidth;
	if (state.minHeight) opts.minHeight = state.minHeight;
	if (state.maxHeight) opts.maxHeight = state.maxHeight;
	if (state.editorStyle) opts.editorStyle = state.editorStyle;
	if (state.toolbar_width !== "auto") opts.toolbar_width = state.toolbar_width;
	if (state.placeholder) opts.placeholder = state.placeholder;
	if (state.defaultLine !== "p") opts.defaultLine = state.defaultLine;
	if (state.defaultUrlProtocol) opts.defaultUrlProtocol = state.defaultUrlProtocol;
	if (state.charCounter_max !== null) opts.charCounter_max = state.charCounter_max;
	if (state.charCounter_label) opts.charCounter_label = state.charCounter_label;
	if (state.printClass) opts.printClass = state.printClass;
	if (state.lineAttrReset) opts.lineAttrReset = state.lineAttrReset;
	if (state.previewTemplate) opts.previewTemplate = state.previewTemplate;
	if (state.printTemplate) opts.printTemplate = state.printTemplate;
	if (state.toastMessageTime !== 1500) opts.toastMessageTime = { copy: state.toastMessageTime };
	if (state.fontSizeUnits !== "px,pt,em,rem") opts.fontSizeUnits = state.fontSizeUnits.split(",").map((s) => s.trim());

	// autoStyleify
	if (state.autoStyleify !== DEFAULTS.autoStyleify) {
		opts.autoStyleify = state.autoStyleify.split(",").map((s) => s.trim());
	}

	// iframe
	if (state.iframe) {
		opts.iframe = true;
		if (state.iframe_fullPage) opts.iframe_fullPage = true;
	}
	if (state.iframe_attributes) {
		try {
			opts.iframe_attributes = JSON.parse(state.iframe_attributes);
		} catch {
			/* ignore */
		}
	}
	if (state.iframe_cssFileName !== "suneditor") {
		opts.iframe_cssFileName = state.iframe_cssFileName.split(",").map((s) => s.trim());
	}
	if (state.editableFrameAttributes) {
		try {
			opts.editableFrameAttributes = JSON.parse(state.editableFrameAttributes);
		} catch {
			/* ignore */
		}
	}

	// format extensions
	if (state.formatLine) opts.formatLine = state.formatLine;
	if (state.formatBrLine) opts.formatBrLine = state.formatBrLine;
	if (state.formatClosureBrLine) opts.formatClosureBrLine = state.formatClosureBrLine;
	if (state.formatBlock) opts.formatBlock = state.formatBlock;
	if (state.formatClosureBlock) opts.formatClosureBlock = state.formatClosureBlock;
	if (state.spanStyles) opts.spanStyles = state.spanStyles;
	if (state.lineStyles) opts.lineStyles = state.lineStyles;
	if (state.textStyleTags) opts.textStyleTags = state.textStyleTags;
	if (state.allowedEmptyTags) opts.allowedEmptyTags = state.allowedEmptyTags;
	if (state.allowedClassName) opts.allowedClassName = state.allowedClassName;
	if (state.allUsedStyles) opts.allUsedStyles = state.allUsedStyles;
	if (state.scopeSelectionTags) opts.scopeSelectionTags = state.scopeSelectionTags.split(",").map((s) => s.trim());

	// element/attribute filtering
	if (state.elementWhitelist) opts.elementWhitelist = state.elementWhitelist;
	if (state.elementBlacklist) opts.elementBlacklist = state.elementBlacklist;
	if (state.attributeWhitelist) {
		try {
			opts.attributeWhitelist = JSON.parse(state.attributeWhitelist);
		} catch {
			/* ignore invalid JSON */
		}
	}
	if (state.attributeBlacklist) {
		try {
			opts.attributeBlacklist = JSON.parse(state.attributeBlacklist);
		} catch {
			/* ignore invalid JSON */
		}
	}

	// ── Plugin options (nested) ──
	const img: Record<string, unknown> = {};
	if (!state.image_canResize) img.canResize = false;
	if (state.image_defaultWidth !== "auto") img.defaultWidth = state.image_defaultWidth;
	if (state.image_defaultHeight !== "auto") img.defaultHeight = state.image_defaultHeight;
	if (!state.image_createFileInput) img.createFileInput = false;
	if (!state.image_createUrlInput) img.createUrlInput = false;
	if (Object.keys(img).length) opts.image = img;

	const vid: Record<string, unknown> = {};
	if (!state.video_canResize) vid.canResize = false;
	if (state.video_defaultWidth) vid.defaultWidth = state.video_defaultWidth;
	if (state.video_defaultHeight) vid.defaultHeight = state.video_defaultHeight;
	if (state.video_createFileInput) vid.createFileInput = true;
	if (!state.video_createUrlInput) vid.createUrlInput = false;
	if (Object.keys(vid).length) opts.video = vid;

	const aud: Record<string, unknown> = {};
	if (state.audio_defaultWidth !== "300px") aud.defaultWidth = state.audio_defaultWidth;
	if (state.audio_defaultHeight !== "54px") aud.defaultHeight = state.audio_defaultHeight;
	if (!state.audio_createFileInput) aud.createFileInput = false;
	if (!state.audio_createUrlInput) aud.createUrlInput = false;
	if (Object.keys(aud).length) opts.audio = aud;

	const tbl: Record<string, unknown> = {};
	if (state.table_scrollType !== "x") tbl.scrollType = state.table_scrollType;
	if (state.table_captionPosition !== "bottom") tbl.captionPosition = state.table_captionPosition;
	if (state.table_cellControllerPosition !== "cell") tbl.cellControllerPosition = state.table_cellControllerPosition;
	if (Object.keys(tbl).length) opts.table = tbl;

	const fs: Record<string, unknown> = {};
	if (state.fontSize_sizeUnit !== "px") fs.sizeUnit = state.fontSize_sizeUnit;
	if (state.fontSize_showIncDecControls) fs.showIncDecControls = true;
	if (Object.keys(fs).length) opts.fontSize = fs;

	if (state.fontColor_disableHEXInput) opts.fontColor = { disableHEXInput: true };
	if (state.backgroundColor_disableHEXInput) opts.backgroundColor = { disableHEXInput: true };

	const emb: Record<string, unknown> = {};
	if (!state.embed_canResize) emb.canResize = false;
	if (state.embed_defaultWidth) emb.defaultWidth = state.embed_defaultWidth;
	if (state.embed_defaultHeight) emb.defaultHeight = state.embed_defaultHeight;
	if (Object.keys(emb).length) opts.embed = emb;

	const drw: Record<string, unknown> = {};
	if (state.drawing_outputFormat !== "dataurl") drw.outputFormat = state.drawing_outputFormat;
	if (state.drawing_lineWidth !== 5) drw.lineWidth = state.drawing_lineWidth;
	if (state.drawing_lineCap !== "round") drw.lineCap = state.drawing_lineCap;
	if (Object.keys(drw).length) opts.drawing = drw;

	const mnt: Record<string, unknown> = {};
	if (state.mention_triggerText !== "@") mnt.triggerText = state.mention_triggerText;
	if (state.mention_limitSize !== 5) mnt.limitSize = state.mention_limitSize;
	if (state.mention_delayTime !== 200) mnt.delayTime = state.mention_delayTime;
	if (Object.keys(mnt).length) opts.mention = mnt;

	const mth: Record<string, unknown> = {};
	if (!state.math_canResize) mth.canResize = false;
	if (state.math_autoHeight) mth.autoHeight = true;
	if (Object.keys(mth).length) opts.math = mth;

	return opts;
}

/* ── URL serialization ─────────────────────────────────── */

const PARAM_MAP: Record<string, keyof PlaygroundState> = {
	// Mode & Theme
	m: "mode",
	p: "buttonListPreset",
	tp: "type",
	t: "theme",
	dir: "textDirection",
	// Layout
	w: "width",
	minw: "minWidth",
	maxw: "maxWidth",
	h: "height",
	minh: "minHeight",
	maxh: "maxHeight",
	es: "editorStyle",
	// Toolbar
	tw: "toolbar_width",
	ts: "toolbar_sticky",
	th: "toolbar_hide",
	sh: "shortcutsHint",
	sd: "shortcutsDisable",
	// Statusbar
	sb: "statusbar",
	sp: "statusbar_showPathLabel",
	sr: "statusbar_resizeEnable",
	cc: "charCounter",
	ccm: "charCounter_max",
	ccl: "charCounter_label",
	cct: "charCounter_type",
	// Content
	ph: "placeholder",
	if: "iframe",
	ifp: "iframe_fullPage",
	ifa: "iframe_attributes",
	icf: "iframe_cssFileName",
	efa: "editableFrameAttributes",
	dl: "defaultLine",
	dlb: "defaultLineBreakFormat",
	rsm: "retainStyleMode",
	fcv: "freeCodeViewMode",
	// Features
	al: "autoLinkify",
	asy: "autoStyleify",
	cfk: "copyFormatKeepOn",
	td: "tabDisable",
	sti: "syncTabIndent",
	cib: "componentInsertBehavior",
	hsd: "historyStackDelayTime",
	fso: "fullScreenOffset",
	dup: "defaultUrlProtocol",
	cmo: "closeModalOutsideClick",
	pvt: "previewTemplate",
	prt: "printTemplate",
	tmt: "toastMessageTime",
	// Filtering
	sm: "strictMode",
	ew: "elementWhitelist",
	eb: "elementBlacklist",
	aw: "attributeWhitelist",
	ab: "attributeBlacklist",
	fsu: "fontSizeUnits",
	lar: "lineAttrReset",
	pc: "printClass",
	fl: "formatLine",
	fbl: "formatBrLine",
	fcbl: "formatClosureBrLine",
	fb: "formatBlock",
	fcb: "formatClosureBlock",
	ss: "spanStyles",
	ls: "lineStyles",
	tst: "textStyleTags",
	aet: "allowedEmptyTags",
	acn: "allowedClassName",
	aus: "allUsedStyles",
	sst: "scopeSelectionTags",
	// Plugin: Image
	"i.r": "image_canResize",
	"i.w": "image_defaultWidth",
	"i.h": "image_defaultHeight",
	"i.fi": "image_createFileInput",
	"i.ui": "image_createUrlInput",
	// Plugin: Video
	"v.r": "video_canResize",
	"v.w": "video_defaultWidth",
	"v.h": "video_defaultHeight",
	"v.fi": "video_createFileInput",
	"v.ui": "video_createUrlInput",
	// Plugin: Audio
	"a.w": "audio_defaultWidth",
	"a.h": "audio_defaultHeight",
	"a.fi": "audio_createFileInput",
	"a.ui": "audio_createUrlInput",
	// Plugin: Table
	"tb.s": "table_scrollType",
	"tb.cp": "table_captionPosition",
	"tb.cc": "table_cellControllerPosition",
	// Plugin: FontSize
	"fs.u": "fontSize_sizeUnit",
	"fs.ic": "fontSize_showIncDecControls",
	// Plugin: FontColor
	"fc.dh": "fontColor_disableHEXInput",
	// Plugin: BackgroundColor
	"bc.dh": "backgroundColor_disableHEXInput",
	// Plugin: Embed
	"em.r": "embed_canResize",
	"em.w": "embed_defaultWidth",
	"em.h": "embed_defaultHeight",
	// Plugin: Drawing
	"dr.of": "drawing_outputFormat",
	"dr.lw": "drawing_lineWidth",
	"dr.lc": "drawing_lineCap",
	// Plugin: Mention
	"mn.t": "mention_triggerText",
	"mn.l": "mention_limitSize",
	"mn.d": "mention_delayTime",
	// Plugin: Math
	"mt.r": "math_canResize",
	"mt.ah": "math_autoHeight",
};

const REVERSE_PARAM_MAP: Record<string, string> = Object.fromEntries(Object.entries(PARAM_MAP).map(([k, v]) => [v, k]));

// Keys that should not be serialized to URL
const UI_KEYS = new Set(["codeFramework", "codePanelOpen"]);

export function stateToUrl(state: PlaygroundState): string {
	const params = new URLSearchParams();

	for (const [stateKey, value] of Object.entries(state)) {
		if (UI_KEYS.has(stateKey)) continue;
		const defaultValue = DEFAULTS[stateKey as keyof PlaygroundState];
		if (value === defaultValue) continue;

		const paramKey = REVERSE_PARAM_MAP[stateKey];
		if (!paramKey) continue;

		if (typeof value === "boolean") {
			params.set(paramKey, value ? "1" : "0");
		} else if (value === null) {
			params.set(paramKey, "null");
		} else {
			params.set(paramKey, String(value));
		}
	}

	return params.toString();
}

export function urlToState(searchParams: URLSearchParams): Partial<PlaygroundState> {
	const partial: Record<string, unknown> = {};

	for (const [paramKey, rawValue] of searchParams.entries()) {
		const stateKey = PARAM_MAP[paramKey];
		if (!stateKey) continue;

		const defaultValue = DEFAULTS[stateKey];

		if (typeof defaultValue === "boolean") {
			partial[stateKey] = rawValue === "1";
		} else if (typeof defaultValue === "number") {
			partial[stateKey] = Number(rawValue);
		} else if (defaultValue === null) {
			partial[stateKey] = rawValue === "null" ? null : Number(rawValue);
		} else {
			partial[stateKey] = rawValue;
		}
	}

	return partial as Partial<PlaygroundState>;
}

/* ── Diff helper: detect which keys changed ────────────── */

export function getChangedKeys(prev: PlaygroundState, next: PlaygroundState): (keyof PlaygroundState)[] {
	const keys: (keyof PlaygroundState)[] = [];
	for (const k of Object.keys(next) as (keyof PlaygroundState)[]) {
		if (prev[k] !== next[k]) keys.push(k);
	}
	return keys;
}

export function hasFixedChange(changedKeys: (keyof PlaygroundState)[]): boolean {
	return changedKeys.some((k) => FIXED_KEYS.has(k));
}
