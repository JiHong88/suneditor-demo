import { BASIC_BUTTON_LIST, STANDARD_BUTTON_LIST, FULL_BUTTON_LIST } from "@/data/code-examples/editorPresets";

/* ── Types ─────────────────────────────────────────────── */

export type ButtonListPreset = "basic" | "standard" | "full";

export interface PlaygroundState {
	// — Mode & Theme —
	mode: "classic" | "inline" | "balloon" | "balloon-always";
	buttonListPreset: ButtonListPreset;
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
	defaultLine: string;
	defaultLineBreakFormat: "line" | "br";
	retainStyleMode: "repeat" | "always" | "none";
	freeCodeViewMode: boolean;

	// — Features —
	autoLinkify: boolean;
	copyFormatKeepOn: boolean;
	tabDisable: boolean;
	syncTabIndent: boolean;
	componentInsertBehavior: "auto" | "select" | "line" | "none";
	historyStackDelayTime: number;
	fullScreenOffset: number;
	defaultUrlProtocol: string;
	closeModalOutsideClick: boolean;

	// — Filtering (Advanced) —
	strictMode: boolean;
	elementWhitelist: string;
	elementBlacklist: string;
	attributeWhitelist: string; // JSON string
	attributeBlacklist: string; // JSON string
	fontSizeUnits: string; // comma-separated
	lineAttrReset: string;
	printClass: string;

	// — UI state (not serialized) —
	codeFramework: "vanilla" | "react" | "vue";
	codePanelOpen: boolean;
}

/* ── Defaults ──────────────────────────────────────────── */

export const DEFAULTS: PlaygroundState = {
	mode: "classic",
	buttonListPreset: "standard",
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
	defaultLine: "p",
	defaultLineBreakFormat: "line",
	retainStyleMode: "repeat",
	freeCodeViewMode: false,

	autoLinkify: true,
	copyFormatKeepOn: false,
	tabDisable: false,
	syncTabIndent: true,
	componentInsertBehavior: "auto",
	historyStackDelayTime: 400,
	fullScreenOffset: 0,
	defaultUrlProtocol: "",
	closeModalOutsideClick: false,

	strictMode: true,
	elementWhitelist: "",
	elementBlacklist: "",
	attributeWhitelist: "",
	attributeBlacklist: "",
	fontSizeUnits: "px,pt,em,rem",
	lineAttrReset: "",
	printClass: "",

	codeFramework: "vanilla",
	codePanelOpen: true,
};

/* ── Fixed option keys (require remount) ───────────────── */

/** Base options flagged as 'fixed' in OPTION_FIXED_FLAG */
const FIXED_BASE_KEYS: (keyof PlaygroundState)[] = [
	"mode",
	"buttonListPreset", // maps to buttonList
	"shortcutsDisable",
	"closeModalOutsideClick",
	"defaultLine",
	"strictMode",
	"elementWhitelist",
	"elementBlacklist",
	"attributeWhitelist",
	"attributeBlacklist",
	"fontSizeUnits",
];

/** Frame options flagged as 'fixed' in OPTION_FRAME_FIXED_FLAG */
const FIXED_FRAME_KEYS: (keyof PlaygroundState)[] = ["iframe", "iframe_fullPage", "statusbar_resizeEnable"];

const FIXED_KEYS = new Set<string>([...FIXED_BASE_KEYS, ...FIXED_FRAME_KEYS]);

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

	// optional strings (only set if non-empty)
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
	if (state.fontSizeUnits !== "px,pt,em,rem") opts.fontSizeUnits = state.fontSizeUnits.split(",").map((s) => s.trim());

	// iframe
	if (state.iframe) {
		opts.iframe = true;
		if (state.iframe_fullPage) opts.iframe_fullPage = true;
	}

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

	return opts;
}

/* ── URL serialization ─────────────────────────────────── */

// Short param names for compact URLs
const PARAM_MAP: Record<string, keyof PlaygroundState> = {
	m: "mode",
	p: "buttonListPreset",
	t: "theme",
	dir: "textDirection",
	w: "width",
	minw: "minWidth",
	maxw: "maxWidth",
	h: "height",
	minh: "minHeight",
	maxh: "maxHeight",
	es: "editorStyle",
	tw: "toolbar_width",
	ts: "toolbar_sticky",
	th: "toolbar_hide",
	sh: "shortcutsHint",
	sd: "shortcutsDisable",
	sb: "statusbar",
	sp: "statusbar_showPathLabel",
	sr: "statusbar_resizeEnable",
	cc: "charCounter",
	ccm: "charCounter_max",
	ccl: "charCounter_label",
	cct: "charCounter_type",
	ph: "placeholder",
	if: "iframe",
	ifp: "iframe_fullPage",
	dl: "defaultLine",
	dlb: "defaultLineBreakFormat",
	rsm: "retainStyleMode",
	fcv: "freeCodeViewMode",
	al: "autoLinkify",
	cfk: "copyFormatKeepOn",
	td: "tabDisable",
	sti: "syncTabIndent",
	cib: "componentInsertBehavior",
	hsd: "historyStackDelayTime",
	fso: "fullScreenOffset",
	dup: "defaultUrlProtocol",
	cmo: "closeModalOutsideClick",
	sm: "strictMode",
	ew: "elementWhitelist",
	eb: "elementBlacklist",
	aw: "attributeWhitelist",
	ab: "attributeBlacklist",
	fsu: "fontSizeUnits",
	lar: "lineAttrReset",
	pc: "printClass",
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
			// nullable number (charCounter_max)
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
