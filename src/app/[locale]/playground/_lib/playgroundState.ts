import { BASIC_BUTTON_LIST, STANDARD_BUTTON_LIST, FULL_BUTTON_LIST } from "@/data/snippets/editorPresets";
import { HEADER_HEIGHT } from "@/lib/constants";
import { API_MENTION, API_DOWNLOAD_PDF, API_UPLOAD_IMAGE, API_UPLOAD_VIDEO, API_UPLOAD_AUDIO, API_UPLOAD_FILE, API_GALLERY_IMAGE, API_GALLERY_VIDEO, API_GALLERY_AUDIO, API_GALLERY_FILE, API_GALLERY_BROWSE } from "@/data/snippets/apiEndpoints";
import { OPTION_FIXED_FLAG, OPTION_FRAME_FIXED_FLAG } from "suneditor/src/core/schema/options.js";

/* ── Types ─────────────────────────────────────────────── */

export type ButtonListPreset = "basic" | "standard" | "full" | "custom";
export type CodeFramework = "javascript-cdn" | "javascript-npm" | "react" | "vue" | "angular" | "svelte" | "webcomponents";

export interface PlaygroundState {
	// — Mode & Theme —
	multiroot: boolean;
	mode: "classic" | "classic:bottom" | "inline" | "inline:bottom" | "balloon" | "balloon-always";
	buttonListPreset: ButtonListPreset;
	customButtonList: string; // JSON-serialized custom buttonList array
	type: string;
	theme: string;
	textDirection: "ltr" | "rtl";
	reverseButtons: string;
	v2Migration: boolean;
	lang: string;
	icons: string;

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
	toolbar_container_enabled: boolean;
	shortcutsHint: boolean;
	shortcutsDisable: boolean;
	shortcuts: string; // JSON: {[key: string]: [keyCombo, hintLabel]}

	// — Sub-Toolbar —
	subToolbar_enabled: boolean;
	subToolbar_buttonListPreset: ButtonListPreset;
	subToolbar_mode: "balloon" | "balloon-always";
	subToolbar_width: string;

	// — Statusbar & Counter (frame) —
	statusbar_container_enabled: boolean;
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
	strictMode_tagFilter: boolean;
	strictMode_formatFilter: boolean;
	strictMode_classFilter: boolean;
	strictMode_textStyleTagFilter: boolean;
	strictMode_attrFilter: boolean;
	strictMode_styleFilter: boolean;
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
	convertTextTags: string;
	tagStyles: string;

	// — Plugin: Image —
	image_canResize: boolean;
	image_defaultWidth: string;
	image_defaultHeight: string;
	image_createFileInput: boolean;
	image_createUrlInput: boolean;
	image_uploadUrl: string;
	image_uploadSizeLimit: number;
	image_allowMultiple: boolean;
	image_acceptedFormats: string;
	image_percentageOnlySize: boolean;
	image_showHeightInput: boolean;

	// — Plugin: Video —
	video_canResize: boolean;
	video_defaultWidth: string;
	video_defaultHeight: string;
	video_createFileInput: boolean;
	video_createUrlInput: boolean;
	video_uploadUrl: string;
	video_uploadSizeLimit: number;
	video_allowMultiple: boolean;
	video_acceptedFormats: string;
	video_percentageOnlySize: boolean;
	video_showHeightInput: boolean;
	video_showRatioOption: boolean;
	video_defaultRatio: number;

	// — Plugin: Audio —
	audio_defaultWidth: string;
	audio_defaultHeight: string;
	audio_createFileInput: boolean;
	audio_createUrlInput: boolean;
	audio_uploadUrl: string;
	audio_uploadSizeLimit: number;
	audio_allowMultiple: boolean;
	audio_acceptedFormats: string;

	// — Plugin: HR —
	hr_items: string;

	// — Plugin: Table —
	table_scrollType: "x" | "y" | "xy";
	table_captionPosition: "top" | "bottom";
	table_cellControllerPosition: "cell" | "table";
	table_colorList: string;

	// — Plugin: FontSize —
	fontSize_sizeUnit: string;
	fontSize_showIncDecControls: boolean;
	fontSize_showDefaultSizeLabel: boolean;
	fontSize_disableInput: boolean;

	// — Plugin: FontSize (extended) —
	fontSize_unitMap: string;

	// — Plugin: FontColor —
	fontColor_disableHEXInput: boolean;
	fontColor_items: string;

	// — Plugin: BackgroundColor —
	backgroundColor_disableHEXInput: boolean;
	backgroundColor_items: string;

	// — Plugin: Embed —
	embed_canResize: boolean;
	embed_defaultWidth: string;
	embed_defaultHeight: string;
	embed_showHeightInput: boolean;
	embed_percentageOnlySize: boolean;

	// — Plugin: Drawing —
	drawing_outputFormat: "dataurl" | "svg";
	drawing_lineWidth: number;
	drawing_lineCap: "butt" | "round" | "square";
	drawing_canResize: boolean;
	drawing_lineColor: string;
	drawing_lineReconnect: boolean;

	// — Plugin: Mention —
	mention_triggerText: string;
	mention_limitSize: number;
	mention_delayTime: number;
	mention_searchStartLength: number;
	mention_apiUrl: string;
	mention_useCachingData: boolean;

	// — Plugin: CodeBlock —
	codeBlock_langs: string;

	// — Plugin: Math —
	math_mathLib: "katex" | "mathjax";
	math_canResize: boolean;
	math_autoHeight: boolean;

	// — Plugin: Image (extended) —
	image_uploadHeaders: string;
	image_uploadSingleSizeLimit: number;
	image_useFormatType: boolean;
	image_defaultFormatType: string;
	image_keepFormatType: boolean;
	image_linkEnableFileUpload: boolean;
	image_insertBehavior: string;
	image_controls: string;

	// — Plugin: Video (extended) —
	video_uploadHeaders: string;
	video_uploadSingleSizeLimit: number;
	video_videoTagAttributes: string;
	video_iframeTagAttributes: string;
	video_query_youtube: string;
	video_query_vimeo: string;
	video_extensions: string;
	video_insertBehavior: string;
	video_controls: string;
	video_ratioOptions: string;
	video_urlPatterns: string;
	video_embedQuery: string;

	// — Plugin: Audio (extended) —
	audio_uploadHeaders: string;
	audio_uploadSingleSizeLimit: number;
	audio_audioTagAttributes: string;
	audio_insertBehavior: string;

	// — Plugin: Embed (extended) —
	embed_uploadUrl: string;
	embed_uploadHeaders: string;
	embed_uploadSizeLimit: number;
	embed_uploadSingleSizeLimit: number;
	embed_iframeTagAttributes: string;
	embed_query_youtube: string;
	embed_query_vimeo: string;
	embed_insertBehavior: string;
	embed_controls: string;
	embed_urlPatterns: string;
	embed_embedQuery: string;

	// — Plugin: Drawing (extended) —
	drawing_useFormatType: boolean;
	drawing_defaultFormatType: string;
	drawing_keepFormatType: boolean;
	drawing_maintainRatio: boolean;
	drawing_formSize: string;

	// — Plugin: Mention (extended) —
	mention_apiHeaders: string;
	mention_useCachingFieldData: boolean;

	// — Plugin: FontColor (extended) —
	fontColor_splitNum: number;

	// — Plugin: BackgroundColor (extended) —
	backgroundColor_splitNum: number;

	// — Plugin: Mention (extended2) —
	mention_data: string;

	// — Plugin: Math (extended) —
	math_fontSizeList: string;
	math_formSize: string;
	math_onPaste: string;

	// — Plugin: Link —
	link_title: boolean;
	link_textToDisplay: boolean;
	link_openNewWindow: boolean;
	link_noAutoPrefix: boolean;
	link_uploadUrl: string;
	link_uploadHeaders: string;
	link_uploadSizeLimit: number;
	link_uploadSingleSizeLimit: number;
	link_acceptedFormats: string;
	link_relList: string;
	link_defaultRel: string;

	// — Plugin: ExportPDF —
	exportPDF_apiUrl: string;
	exportPDF_fileName: string;

	// — Plugin: FileUpload —
	fileUpload_uploadUrl: string;
	fileUpload_uploadHeaders: string;
	fileUpload_uploadSizeLimit: number;
	fileUpload_uploadSingleSizeLimit: number;
	fileUpload_allowMultiple: boolean;
	fileUpload_acceptedFormats: string;
	fileUpload_as: string;
	fileUpload_insertBehavior: string;
	fileUpload_controls: string;

	// — Plugin: Align —
	align_items: string;
	// — Plugin: Font —
	font_items: string;
	// — Plugin: BlockStyle —
	blockStyle_items: string;
	// — Plugin: LineHeight —
	lineHeight_items: string;
	// — Plugin: ParagraphStyle —
	paragraphStyle_items: string;
	// — Plugin: TextStyle —
	textStyle_items: string;
	// — Plugin: Template —
	template_items: string;
	// — Plugin: Layout —
	layout_items: string;

	// — Plugin: ImageGallery —
	imageGallery_url: string;
	imageGallery_headers: string;
	imageGallery_data: string;
	// — Plugin: VideoGallery —
	videoGallery_url: string;
	videoGallery_headers: string;
	videoGallery_thumbnail: string;
	videoGallery_data: string;
	// — Plugin: AudioGallery —
	audioGallery_url: string;
	audioGallery_headers: string;
	audioGallery_thumbnail: string;
	audioGallery_data: string;
	// — Plugin: FileGallery —
	fileGallery_url: string;
	fileGallery_headers: string;
	fileGallery_thumbnail: string;
	fileGallery_data: string;
	// — Plugin: FileBrowser —
	fileBrowser_url: string;
	fileBrowser_headers: string;
	fileBrowser_thumbnail: string;
	fileBrowser_data: string;
	fileBrowser_props: string;

	// — Multi-Root per-root overrides —
	// Layout
	root_header_height: string;
	root_header_width: string;
	root_header_minWidth: string;
	root_header_maxWidth: string;
	root_header_minHeight: string;
	root_header_maxHeight: string;
	root_header_editorStyle: string;
	root_body_height: string;
	root_body_width: string;
	root_body_minWidth: string;
	root_body_maxWidth: string;
	root_body_minHeight: string;
	root_body_maxHeight: string;
	root_body_editorStyle: string;
	// Content
	root_header_placeholder: string;
	root_header_value: string;
	root_header_editableFrameAttributes: string;
	root_body_placeholder: string;
	root_body_value: string;
	root_body_editableFrameAttributes: string;
	// Iframe (tri-state: "" | "true" | "false")
	root_header_iframe: string;
	root_header_iframe_fullPage: string;
	root_header_iframe_attributes: string;
	root_header_iframe_cssFileName: string;
	root_body_iframe: string;
	root_body_iframe_fullPage: string;
	root_body_iframe_attributes: string;
	root_body_iframe_cssFileName: string;
	// Statusbar (tri-state: "" | "true" | "false")
	root_header_statusbar: string;
	root_header_statusbar_showPathLabel: string;
	root_header_statusbar_resizeEnable: string;
	root_body_statusbar: string;
	root_body_statusbar_showPathLabel: string;
	root_body_statusbar_resizeEnable: string;
	// CharCounter
	root_header_charCounter: string;
	root_header_charCounter_max: string;
	root_header_charCounter_label: string;
	root_header_charCounter_type: string;
	root_body_charCounter: string;
	root_body_charCounter_max: string;
	root_body_charCounter_label: string;
	root_body_charCounter_type: string;

	// — UI state (not serialized) —
	codeFramework: CodeFramework;
	codePanelOpen: boolean;
}

/* ── Defaults ──────────────────────────────────────────── */

export const DEFAULTS: PlaygroundState = {
	multiroot: false,
	mode: "classic",
	buttonListPreset: "standard",
	customButtonList: "",
	type: "",
	theme: "",
	textDirection: "ltr",
	reverseButtons: "indent-outdent",
	v2Migration: false,
	lang: "",
	icons: "",

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
	toolbar_container_enabled: false,
	shortcutsHint: true,
	shortcutsDisable: false,
	shortcuts: "",

	subToolbar_enabled: false,
	subToolbar_buttonListPreset: "basic",
	subToolbar_mode: "balloon",
	subToolbar_width: "auto",

	statusbar_container_enabled: false,
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
	strictMode_tagFilter: true,
	strictMode_formatFilter: true,
	strictMode_classFilter: true,
	strictMode_textStyleTagFilter: true,
	strictMode_attrFilter: true,
	strictMode_styleFilter: true,
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
	spanStyles: "font-family|font-size|color|background-color|width|height",
	lineStyles: "text-align|margin|margin-left|margin-right|line-height",
	textStyleTags: "",
	allowedEmptyTags: "",
	allowedClassName: "",
	allUsedStyles: "",
	scopeSelectionTags: "",
	convertTextTags: "",
	tagStyles: "",

	// Plugin: Image
	image_canResize: true,
	image_defaultWidth: "auto",
	image_defaultHeight: "auto",
	image_createFileInput: true,
	image_createUrlInput: true,
	image_uploadUrl: "",
	image_uploadSizeLimit: 0,
	image_allowMultiple: false,
	image_acceptedFormats: "image/*",
	image_percentageOnlySize: false,
	image_showHeightInput: true,

	// Plugin: Video
	video_canResize: true,
	video_defaultWidth: "",
	video_defaultHeight: "",
	video_createFileInput: false,
	video_createUrlInput: true,
	video_uploadUrl: "",
	video_uploadSizeLimit: 0,
	video_allowMultiple: false,
	video_acceptedFormats: "video/*",
	video_percentageOnlySize: false,
	video_showHeightInput: true,
	video_showRatioOption: true,
	video_defaultRatio: 0.5625,

	// Plugin: Audio
	audio_defaultWidth: "300px",
	audio_defaultHeight: "54px",
	audio_createFileInput: true,
	audio_createUrlInput: true,
	audio_uploadUrl: "",
	audio_uploadSizeLimit: 0,
	audio_allowMultiple: false,
	audio_acceptedFormats: "audio/*",

	// Plugin: HR
	hr_items: "",

	// Plugin: Table
	table_scrollType: "x",
	table_captionPosition: "bottom",
	table_cellControllerPosition: "cell",
	table_colorList: "",

	// Plugin: FontSize
	fontSize_sizeUnit: "px",
	fontSize_showIncDecControls: false,
	fontSize_showDefaultSizeLabel: true,
	fontSize_disableInput: false,
	fontSize_unitMap: "",

	// Plugin: FontColor
	fontColor_disableHEXInput: false,
	fontColor_items: "",

	// Plugin: BackgroundColor
	backgroundColor_disableHEXInput: false,
	backgroundColor_items: "",

	// Plugin: Embed
	embed_canResize: true,
	embed_defaultWidth: "",
	embed_defaultHeight: "",
	embed_showHeightInput: true,
	embed_percentageOnlySize: false,

	// Plugin: Drawing
	drawing_outputFormat: "dataurl",
	drawing_lineWidth: 5,
	drawing_lineCap: "round",
	drawing_canResize: true,
	drawing_lineColor: "",
	drawing_lineReconnect: false,

	// Plugin: Mention
	mention_triggerText: "@",
	mention_limitSize: 5,
	mention_delayTime: 200,
	mention_searchStartLength: 0,
	mention_apiUrl: "",
	mention_useCachingData: true,

	// Plugin: Math
	codeBlock_langs: "",

	math_mathLib: "katex" as const,
	math_canResize: true,
	math_autoHeight: false,

	// Plugin: Image (extended)
	image_uploadHeaders: "",
	image_uploadSingleSizeLimit: 0,
	image_useFormatType: true,
	image_defaultFormatType: "block",
	image_keepFormatType: false,
	image_linkEnableFileUpload: false,
	image_insertBehavior: "auto",
	image_controls: "",

	// Plugin: Video (extended)
	video_uploadHeaders: "",
	video_uploadSingleSizeLimit: 0,
	video_videoTagAttributes: "",
	video_iframeTagAttributes: "",
	video_query_youtube: "",
	video_query_vimeo: "",
	video_extensions: "",
	video_insertBehavior: "auto",
	video_controls: "",
	video_ratioOptions: "",
	video_urlPatterns: "",
	video_embedQuery: "",

	// Plugin: Audio (extended)
	audio_uploadHeaders: "",
	audio_uploadSingleSizeLimit: 0,
	audio_audioTagAttributes: "",
	audio_insertBehavior: "auto",

	// Plugin: Embed (extended)
	embed_uploadUrl: "",
	embed_uploadHeaders: "",
	embed_uploadSizeLimit: 0,
	embed_uploadSingleSizeLimit: 0,
	embed_iframeTagAttributes: "",
	embed_query_youtube: "",
	embed_query_vimeo: "",
	embed_insertBehavior: "auto",
	embed_controls: "",
	embed_urlPatterns: "",
	embed_embedQuery: "",

	// Plugin: Drawing (extended)
	drawing_useFormatType: false,
	drawing_defaultFormatType: "block",
	drawing_keepFormatType: false,
	drawing_maintainRatio: true,
	drawing_formSize: "",

	// Plugin: Mention (extended)
	mention_apiHeaders: "",
	mention_useCachingFieldData: true,
	mention_data: "",

	// Plugin: Math (extended)
	math_fontSizeList: "",
	math_formSize: "",
	math_onPaste: "",

	// Plugin: FontColor (extended)
	fontColor_splitNum: 7,

	// Plugin: BackgroundColor (extended)
	backgroundColor_splitNum: 7,

	// Plugin: Link
	link_title: true,
	link_textToDisplay: true,
	link_openNewWindow: true,
	link_noAutoPrefix: false,
	link_uploadUrl: "",
	link_uploadHeaders: "",
	link_uploadSizeLimit: 0,
	link_uploadSingleSizeLimit: 0,
	link_acceptedFormats: "",
	link_relList: "",
	link_defaultRel: "",

	// Plugin: ExportPDF
	exportPDF_apiUrl: "",
	exportPDF_fileName: "suneditor-pdf",

	// Plugin: FileUpload
	fileUpload_uploadUrl: "",
	fileUpload_uploadHeaders: "",
	fileUpload_uploadSizeLimit: 0,
	fileUpload_uploadSingleSizeLimit: 0,
	fileUpload_allowMultiple: false,
	fileUpload_acceptedFormats: "*",
	fileUpload_as: "box",
	fileUpload_insertBehavior: "auto",
	fileUpload_controls: "",

	// Plugin: Align
	align_items: "",
	// Plugin: Font
	font_items: "",
	// Plugin: BlockStyle
	blockStyle_items: "",
	// Plugin: LineHeight
	lineHeight_items: "",
	// Plugin: ParagraphStyle
	paragraphStyle_items: "",
	// Plugin: TextStyle
	textStyle_items: "",
	// Plugin: Template
	template_items: "",
	// Plugin: Layout
	layout_items: "",

	// Plugin: ImageGallery
	imageGallery_url: "",
	imageGallery_headers: "",
	imageGallery_data: "",
	// Plugin: VideoGallery
	videoGallery_url: "",
	videoGallery_headers: "",
	videoGallery_thumbnail: "",
	videoGallery_data: "",
	// Plugin: AudioGallery
	audioGallery_url: "",
	audioGallery_headers: "",
	audioGallery_thumbnail: "",
	audioGallery_data: "",
	// Plugin: FileGallery
	fileGallery_url: "",
	fileGallery_headers: "",
	fileGallery_thumbnail: "",
	fileGallery_data: "",
	// Plugin: FileBrowser
	fileBrowser_url: "",
	fileBrowser_headers: "",
	fileBrowser_thumbnail: "",
	fileBrowser_data: "",
	fileBrowser_props: "",

	// Multi-Root per-root overrides
	root_header_height: "150px",
	root_header_width: "",
	root_header_minWidth: "",
	root_header_maxWidth: "",
	root_header_minHeight: "",
	root_header_maxHeight: "",
	root_header_editorStyle: "",
	root_body_height: "400px",
	root_body_width: "",
	root_body_minWidth: "",
	root_body_maxWidth: "",
	root_body_minHeight: "",
	root_body_maxHeight: "",
	root_body_editorStyle: "",
	root_header_placeholder: "",
	root_header_value: "",
	root_header_editableFrameAttributes: "",
	root_body_placeholder: "",
	root_body_value: "",
	root_body_editableFrameAttributes: "",
	root_header_iframe: "",
	root_header_iframe_fullPage: "",
	root_header_iframe_attributes: "",
	root_header_iframe_cssFileName: "",
	root_body_iframe: "",
	root_body_iframe_fullPage: "",
	root_body_iframe_attributes: "",
	root_body_iframe_cssFileName: "",
	root_header_statusbar: "",
	root_header_statusbar_showPathLabel: "",
	root_header_statusbar_resizeEnable: "",
	root_body_statusbar: "",
	root_body_statusbar_showPathLabel: "",
	root_body_statusbar_resizeEnable: "",
	root_header_charCounter: "",
	root_header_charCounter_max: "",
	root_header_charCounter_label: "",
	root_header_charCounter_type: "",
	root_body_charCounter: "",
	root_body_charCounter_max: "",
	root_body_charCounter_label: "",
	root_body_charCounter_type: "",

	codeFramework: "javascript-npm",
	codePanelOpen: true,
};

/* ── Preset values for toggleable plugin options ───────── */

export const ITEM_PRESETS: Record<string, string> = {
	align_items: "left,center,right",
	font_items: "Roboto,Open Sans,Lato,Montserrat,Playfair Display,Noto Sans KR",
	blockStyle_items: "p,blockquote,h1,h2,h3",
	lineHeight_items: '[{"text":"1","value":"1em"},{"text":"1.15","value":"1.15em"},{"text":"1.5","value":"1.5em"},{"text":"1.75","value":"1.75em"},{"text":"2","value":"2em"},{"text":"3","value":"3em"}]',
	paragraphStyle_items: "spaced,bordered,neon",
	textStyle_items: "code,shadow",
	template_items: '[{"name":"Greeting","html":"<p>Hello!</p>"}]',
	layout_items: '[{"name":"Two Column","html":"<div style=\\"display:flex;gap:1em\\"><div style=\\"flex:1\\">Left</div><div style=\\"flex:1\\">Right</div></div>"}]',
	hr_items: '[{"name":"Solid","class":"__se__solid"},{"name":"Dashed","class":"__se__dashed"}]',
	fontColor_items: '#ff0000,#ff5722,#ff9800,#ffc107,#ffeb3b,#4caf50,#2196f3,#3f51b5,#9c27b0,#000000,#333333,#666666,#999999,#cccccc,#ffffff',
	backgroundColor_items: '#ff0000,#ff5722,#ff9800,#ffc107,#ffeb3b,#4caf50,#2196f3,#3f51b5,#9c27b0,#000000,#333333,#666666,#999999,#cccccc,#ffffff',
	table_colorList: '#ff0000,#ff5722,#ff9800,#ffc107,#ffeb3b,#4caf50,#2196f3,#3f51b5,#9c27b0,#000000,#333333,#666666,#999999,#cccccc,#ffffff',
	image_controls: '[["align","caption","revert","edit","copy","remove"]]',
	video_controls: '[["align","caption","revert","edit","copy","remove"]]',
	video_ratioOptions: '[{"value":0.5625,"text":"16:9"},{"value":0.75,"text":"4:3"},{"value":1,"text":"1:1"}]',
	embed_controls: '[["align","revert","edit","copy","remove"]]',
	drawing_formSize: '{"width":"600px","height":"40vh","minWidth":"200px","minHeight":"150px"}',
	mention_data: '[{"key":"john","name":"John Doe","url":"/users/john"},{"key":"jane","name":"Jane Smith","url":"/users/jane"}]',
	math_fontSizeList: '[{"text":"1","value":"1em"},{"text":"2","value":"2em"}]',
	math_formSize: '{"width":"460px","height":"14em","minWidth":"400px","minHeight":"40px"}',
	link_relList: 'nofollow,noreferrer,noopener',
	link_defaultRel: '{"default":"nofollow","check_new_window":"noreferrer noopener"}',
	fileUpload_controls: '[["edit","copy","remove"]]',
	video_urlPatterns: '/dailymotion\\.com\\/video\\//,/facebook\\.com\\/.+\\/videos\\//,/tiktok\\.com\\/@[^/]+\\/video\\//',
	video_embedQuery: '{"dailymotion":{"pattern":"/dailymotion\\\\.com\\\\/video\\\\/(\\\\w+)/i","action":"https://www.dailymotion.com/embed/video/$1","tag":"iframe"}}',
	embed_urlPatterns: '/reddit\\.com\\/r\\//,/github\\.com\\/.+\\/issues\\//,/stackoverflow\\.com\\/questions\\//',
	embed_embedQuery: '{"reddit":{"pattern":"/reddit\\\\.com\\\\/r\\\\/(\\\\w+)\\\\/comments\\\\/(\\\\w+)/i","action":"https://www.redditmedia.com/r/$1/comments/$2?embed=true","tag":"iframe"}}',
	fontSize_unitMap: '{"px":{"default":16,"inc":1,"min":8,"max":72,"list":[8,10,12,14,16,18,20,24,28,32,36,48,72]},"pt":{"default":12,"inc":1,"min":6,"max":72,"list":[6,8,10,12,14,18,24,36]},"em":{"default":1,"inc":0.1,"min":0.5,"max":5,"list":[0.5,0.75,1,1.25,1.5,2,2.5,3]},"rem":{"default":1,"inc":0.1,"min":0.5,"max":5,"list":[0.5,0.75,1,1.25,1.5,2,2.5,3]}}',
	math_onPaste: 'function(e) {\n  const text = e.clipboardData.getData("text/plain");\n  e.preventDefault();\n  document.execCommand("insertText", false, text);\n}',
};

export const GALLERY_DATA_PRESETS: Record<string, string> = {
	imageGallery_data: '[\n  {"src": "{{imageGallery-source}}/1.jpg", "thumbnail": "{{imageGallery-source}}/thumb/1.jpg", "name": "Image 1"},\n  {"src": "{{imageGallery-source}}/2.jpg", "thumbnail": "{{imageGallery-source}}/thumb/2.jpg", "name": "Image 2"}\n]',
	videoGallery_data: '[\n  {"src": "{{videoGallery-source}}/1.mp4", "thumbnail": "{{videoGallery-source}}/thumb/1.jpg", "name": "Video 1"}\n]',
	audioGallery_data: '[\n  {"src": "{{audioGallery-source}}/1.mp3", "name": "Audio 1"}\n]',
	fileGallery_data: '[\n  {"src": "{{fileGallery-source}}/doc.pdf", "name": "Document.pdf", "size": "2.5MB"}\n]',
	fileBrowser_data: '{\n  "images": {"name": "Images", "default": true, "_data": [{"src": "https://picsum.photos/seed/browse1/800/600", "name": "photo_1.jpg"}]},\n  "documents": {"name": "Documents", "_data": [{"src": "https://suneditor-files.s3.ap-northeast-2.amazonaws.com/sample/media/sample_file_1.docx", "name": "sample_file_1.docx"}]}\n}',
	fileBrowser_props: '["href", "data-size", "data-name"]',
};

/* ── Fixed option keys (require remount) ───────────────── */

const _allStateKeys = new Set<string>(Object.keys(DEFAULTS));
const _isStateKey = (k: string): k is keyof PlaygroundState => _allStateKeys.has(k);

/** Base options: 'fixed' entries from OPTION_FIXED_FLAG that exist in PlaygroundState */
const FIXED_BASE_KEYS: (keyof PlaygroundState)[] = [
	// Playground-specific keys (no direct suneditor counterpart)
	"multiroot",
	"buttonListPreset",
	"customButtonList",
	"toolbar_container_enabled",
	"statusbar_container_enabled",
	"subToolbar_enabled",
	"subToolbar_buttonListPreset",
	"subToolbar_mode",
	"subToolbar_width",
	"strictMode_tagFilter",
	"strictMode_formatFilter",
	"strictMode_classFilter",
	"strictMode_textStyleTagFilter",
	"strictMode_attrFilter",
	"strictMode_styleFilter",
	// From suneditor OPTION_FIXED_FLAG
	...(Object.entries(OPTION_FIXED_FLAG) as [string, unknown][])
		.filter(([k, v]) => v === "fixed" && _isStateKey(k))
		.map(([k]) => k as keyof PlaygroundState),
];

/** Frame options: 'fixed' direct keys + all root-prefixed frame keys */
const FIXED_FRAME_KEYS: (keyof PlaygroundState)[] = [
	// Direct frame keys flagged as 'fixed'
	...(Object.entries(OPTION_FRAME_FIXED_FLAG) as [string, unknown][])
		.filter(([k, v]) => v === "fixed" && _isStateKey(k))
		.map(([k]) => k as keyof PlaygroundState),
	// Per-root: all frame options require remount
	...(Object.keys(OPTION_FRAME_FIXED_FLAG) as string[]).flatMap((k) => {
		const keys: (keyof PlaygroundState)[] = [];
		const hk = `root_header_${k}`;
		const bk = `root_body_${k}`;
		if (_isStateKey(hk)) keys.push(hk);
		if (_isStateKey(bk)) keys.push(bk);
		return keys;
	}),
];

/** Plugin options are effectively fixed (plugins themselves are fixed) — all plugin-prefixed state keys */
const FIXED_PLUGIN_KEYS: (keyof PlaygroundState)[] = (Object.keys(DEFAULTS) as (keyof PlaygroundState)[]).filter(
	(k) => /^(image|video|audio|hr|table|fontSize|fontColor|backgroundColor|embed|drawing|mention|math|link|exportPDF|fileUpload|align|font|blockStyle|lineHeight|paragraphStyle|textStyle|template|layout|codeBlock|imageGallery|videoGallery|audioGallery|fileGallery|fileBrowser)_/.test(k),
);

const FIXED_KEYS = new Set<string>([...FIXED_BASE_KEYS, ...FIXED_FRAME_KEYS, ...FIXED_PLUGIN_KEYS]);

export function isFixedOption(key: string): boolean {
	return FIXED_KEYS.has(key);
}

/* ── Auto-enable plugin options for preset buttons ────── */

/**
 * Maps button names → required PlaygroundState keys + their preset values.
 * When a preset is selected, if the button is present and the option is empty,
 * the preset value is auto-filled.
 */
const BUTTON_REQUIRED_OPTIONS: Record<string, Partial<PlaygroundState>> = {
	image: { image_uploadUrl: API_UPLOAD_IMAGE } as Partial<PlaygroundState>,
	video: { video_uploadUrl: API_UPLOAD_VIDEO } as Partial<PlaygroundState>,
	audio: { audio_uploadUrl: API_UPLOAD_AUDIO } as Partial<PlaygroundState>,
	embed: { embed_uploadUrl: API_UPLOAD_FILE } as Partial<PlaygroundState>,
	fileUpload: { fileUpload_uploadUrl: API_UPLOAD_FILE } as Partial<PlaygroundState>,
	link: { link_uploadUrl: API_UPLOAD_FILE } as Partial<PlaygroundState>,
	exportPDF: { exportPDF_apiUrl: API_DOWNLOAD_PDF } as Partial<PlaygroundState>,
	imageGallery: { imageGallery_url: API_GALLERY_IMAGE } as Partial<PlaygroundState>,
	videoGallery: { videoGallery_url: API_GALLERY_VIDEO } as Partial<PlaygroundState>,
	audioGallery: { audioGallery_url: API_GALLERY_AUDIO } as Partial<PlaygroundState>,
	fileGallery: { fileGallery_url: API_GALLERY_FILE } as Partial<PlaygroundState>,
	fileBrowser: { fileBrowser_url: API_GALLERY_BROWSE } as Partial<PlaygroundState>,
};

/** Field plugins (not button-based) auto-enabled per preset */
const PRESET_FIELD_OPTIONS: Partial<Record<ButtonListPreset, Partial<PlaygroundState>>> = {
	full: {
		mention_apiUrl: API_MENTION,
	} as Partial<PlaygroundState>,
};

/** Collect all button names from a resolved button list (deep) */
function collectButtonNames(list: unknown[]): Set<string> {
	const names = new Set<string>();
	for (const item of list) {
		if (typeof item === "string" && item !== "|" && item !== "/" && !item.startsWith("%") && !item.startsWith(":") && !item.startsWith("-")) {
			names.add(item);
		} else if (Array.isArray(item)) {
			for (const name of collectButtonNames(item)) names.add(name);
		}
	}
	return names;
}

/**
 * Auto-fill required plugin options for buttons present in the given preset.
 * Only fills empty (falsy) values — never overwrites user-set values.
 */
function autoEnablePluginOptions(state: PlaygroundState, preset: ButtonListPreset): Partial<PlaygroundState> {
	const list = getButtonList(preset, state.type);
	const buttons = collectButtonNames(list);
	const patch: Record<string, unknown> = {};

	// Button-based options
	for (const [button, requiredOpts] of Object.entries(BUTTON_REQUIRED_OPTIONS)) {
		if (!buttons.has(button)) continue;
		for (const [key, presetValue] of Object.entries(requiredOpts)) {
			const currentValue = state[key as keyof PlaygroundState];
			if (!currentValue) {
				patch[key] = presetValue;
			}
		}
	}

	// Field plugin options per preset
	const fieldOpts = PRESET_FIELD_OPTIONS[preset];
	if (fieldOpts) {
		for (const [key, presetValue] of Object.entries(fieldOpts)) {
			const currentValue = state[key as keyof PlaygroundState];
			if (!currentValue) {
				patch[key] = presetValue;
			}
		}
	}

	return patch as Partial<PlaygroundState>;
}

/* ── Reducer ───────────────────────────────────────────── */

export type PlaygroundAction =
	| { type: "SET"; key: keyof PlaygroundState; value: PlaygroundState[keyof PlaygroundState] }
	| { type: "RESET" }
	| { type: "LOAD"; payload: Partial<PlaygroundState> };

export function playgroundReducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
	switch (action.type) {
		case "SET": {
			if (state[action.key] === action.value) return state;
			// When switching to "custom" preset, seed customButtonList from current resolved list
			if (action.key === "buttonListPreset" && action.value === "custom" && !state.customButtonList) {
				const currentList = getButtonList(state.buttonListPreset, state.type, state.customButtonList);
				return {
					...state,
					buttonListPreset: "custom",
					customButtonList: JSON.stringify(currentList),
				};
			}
			// Auto-enable plugin options when changing preset
			if (action.key === "buttonListPreset" && action.value !== "custom") {
				const nextState = { ...state, buttonListPreset: action.value as ButtonListPreset };
				const patch = autoEnablePluginOptions(nextState, action.value as ButtonListPreset);
				return { ...nextState, ...patch };
			}
			return { ...state, [action.key]: action.value };
		}
		case "RESET": {
			const reset = { ...DEFAULTS, toolbar_sticky: HEADER_HEIGHT };
			const resetPatch = autoEnablePluginOptions(reset, reset.buttonListPreset);
			return { ...reset, ...resetPatch };
		}
		case "LOAD": {
			const loaded = { ...DEFAULTS, ...action.payload };
			// Auto-enable for initial load too
			const patch = autoEnablePluginOptions(loaded, loaded.buttonListPreset);
			return { ...loaded, ...patch };
		}
		default:
			return state;
	}
}

/* ── Button list mapping ───────────────────────────────── */

const PAGE_BUTTONS = new Set(["pageBreak", "pageNavigator", "pageUp", "pageDown"]);

/** Remove page-related buttons from a button list (deep recursive). */
function filterPageButtons(list: unknown[]): unknown[] {
	const result: unknown[] = [];
	for (const item of list) {
		if (typeof item === "string") {
			if (PAGE_BUTTONS.has(item)) continue;
			// Remove responsive group labels that reference "page" with no remaining buttons
			result.push(item);
		} else if (Array.isArray(item)) {
			// Responsive entry: ["%xxx", [...]]
			if (
				item.length === 2 &&
				typeof item[0] === "string" &&
				(item[0] as string).startsWith("%") &&
				Array.isArray(item[1])
			) {
				const filtered = filterPageButtons(item[1] as unknown[]);
				if (filtered.length > 0) result.push([item[0], filtered]);
			} else {
				// Button group: ["undo", "redo", ...]
				const filtered = (item as unknown[]).filter((b) => typeof b !== "string" || !PAGE_BUTTONS.has(b));
				// Remove group labels referencing "Pages" if no page buttons remain
				const noPageLabels = filtered.filter((b) => typeof b !== "string" || !b.toString().includes(":Pages"));
				// Also clean up groups like ":View & Pages-..." to ":View-..."
				const final = noPageLabels.map((b) => {
					if (typeof b === "string" && b.includes(" & Pages")) {
						return b.replace(" & Pages", "");
					}
					return b;
				});
				if (final.length > 0) result.push(final);
			}
		}
	}
	// Remove consecutive/leading/trailing separators left after filtering
	const dedupedSeps: unknown[] = [];
	for (const item of result) {
		if (item === "|" || item === "/") {
			const prev = dedupedSeps[dedupedSeps.length - 1];
			if (dedupedSeps.length === 0 || prev === "|" || prev === "/") continue;
		}
		dedupedSeps.push(item);
	}
	// Remove trailing separator
	while (dedupedSeps.length > 0 && (dedupedSeps[dedupedSeps.length - 1] === "|" || dedupedSeps[dedupedSeps.length - 1] === "/")) {
		dedupedSeps.pop();
	}
	return dedupedSeps;
}

export function getButtonList(preset: ButtonListPreset, type?: string, customButtonList?: string): unknown[] {
	let list: unknown[];
	switch (preset) {
		case "basic":
			list = BASIC_BUTTON_LIST;
			break;
		case "full":
			list = FULL_BUTTON_LIST;
			break;
		case "custom":
			try {
				list = customButtonList ? JSON.parse(customButtonList) : STANDARD_BUTTON_LIST;
			} catch {
				list = STANDARD_BUTTON_LIST;
			}
			break;
		default:
			list = STANDARD_BUTTON_LIST;
			break;
	}

	// Remove page buttons when not in document mode (only for presets, not custom)
	if (preset !== "custom") {
		const isDocumentMode = type ? type.toLowerCase().includes("document") : false;
		if (!isDocumentMode) {
			list = filterPageButtons(list);
		}
	}

	return list;
}

/** Check if a specific button name exists in the resolved button list (deep search) */
export function hasButton(preset: ButtonListPreset, type: string | undefined, name: string, customButtonList?: string): boolean {
	const list = getButtonList(preset, type, customButtonList);
	const search = (arr: unknown[]): boolean =>
		arr.some((item) => (Array.isArray(item) ? search(item) : item === name));
	return search(list);
}

/* ── Helpers for complex option parsing ─────────────────── */

/** Parse comma-separated regex strings like "/foo/,/bar/i" into RegExp[] */
function parseRegExpList(str: string): RegExp[] {
	return str.split(",").map((s) => {
		const m = s.trim().match(/^\/(.+)\/([gimsuy]*)$/);
		return m ? new RegExp(m[1], m[2]) : new RegExp(s.trim());
	});
}

/** Parse embedQuery JSON: converts "pattern" string fields to RegExp */
function parseEmbedQuery(json: string): Record<string, { pattern: RegExp; action: string; tag: string }> {
	const raw = JSON.parse(json);
	const result: Record<string, { pattern: RegExp; action: string; tag: string }> = {};
	for (const [key, val] of Object.entries(raw)) {
		const v = val as { pattern: string; action: string; tag: string };
		const m = v.pattern.match(/^\/(.+)\/([gimsuy]*)$/);
		result[key] = {
			pattern: m ? new RegExp(m[1], m[2]) : new RegExp(v.pattern),
			action: v.action,
			tag: v.tag,
		};
	}
	return result;
}

/** Parse a function string into an actual Function */
function parseFunction(str: string): ((...args: unknown[]) => unknown) | null {
	try {
		return new Function("return (" + str + ")")() as (...args: unknown[]) => unknown;
	} catch {
		return null;
	}
}

/* ── State → SunEditor options ─────────────────────────── */

export function stateToEditorOptions(state: PlaygroundState) {
	const opts: Record<string, unknown> = {
		mode: state.mode,
		buttonList: getButtonList(state.buttonListPreset, state.type, state.customButtonList),
		textDirection: state.textDirection,

		// layout (frame)
		width: state.width || "100%",
		height: state.height || "auto",

		// toolbar
		toolbar_sticky: state.toolbar_sticky,
		toolbar_hide: state.toolbar_hide,
		shortcutsHint: state.shortcutsHint,
		shortcutsDisable: state.shortcutsDisable,
	};

	// shortcuts (JSON string → object)
	if (state.shortcuts) {
		try {
			opts.shortcuts = JSON.parse(state.shortcuts);
		} catch { /* skip invalid JSON */ }
	}

	// subToolbar
	if (state.subToolbar_enabled) {
		const st: Record<string, unknown> = {
			buttonList: getButtonList(state.subToolbar_buttonListPreset, state.type),
			mode: state.subToolbar_mode,
		};
		if (state.subToolbar_width !== "auto") st.width = state.subToolbar_width;
		opts.subToolbar = st;
	}

	// statusbar (frame)
	opts.statusbar = state.statusbar;
	opts.statusbar_showPathLabel = state.statusbar_showPathLabel;
	opts.statusbar_resizeEnable = state.statusbar_resizeEnable;
	opts.charCounter = state.charCounter;
	opts.charCounter_type = state.charCounter_type;

	// content
	opts.defaultLineBreakFormat = state.defaultLineBreakFormat;
	opts.retainStyleMode = state.retainStyleMode;
	opts.freeCodeViewMode = state.freeCodeViewMode;
	// codeBlock plugin
	if (state.codeBlock_langs) {
		const langs = state.codeBlock_langs.split(",").map((s: string) => s.trim()).filter(Boolean);
		if (langs.length) opts.codeBlock = { langs };
	}

	// features
	opts.autoLinkify = state.autoLinkify;
	opts.copyFormatKeepOn = state.copyFormatKeepOn;
	opts.tabDisable = state.tabDisable;
	opts.syncTabIndent = state.syncTabIndent;
	opts.componentInsertBehavior = state.componentInsertBehavior;
	opts.historyStackDelayTime = state.historyStackDelayTime;
	opts.fullScreenOffset = state.fullScreenOffset;
	opts.closeModalOutsideClick = state.closeModalOutsideClick;

	// filtering
	opts.strictMode = state.strictMode
		? true
		: {
				tagFilter: state.strictMode_tagFilter,
				formatFilter: state.strictMode_formatFilter,
				classFilter: state.strictMode_classFilter,
				textStyleTagFilter: state.strictMode_textStyleTagFilter,
				attrFilter: state.strictMode_attrFilter,
				styleFilter: state.strictMode_styleFilter,
			};

	// theme
	if (state.theme) opts.theme = state.theme;

	// type
	if (state.type) opts.type = state.type;

	// reverseButtons
	if (state.reverseButtons !== DEFAULTS.reverseButtons) {
		opts.reverseButtons = state.reverseButtons.split(",").map((s) => s.trim());
	}

	// v2Migration
	if (state.v2Migration) opts.v2Migration = true;

	// lang — dynamic import handled externally; value stored as lang code string
	// icons — JSON string parsed and merged at runtime

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
	if (state.spanStyles && state.spanStyles !== DEFAULTS.spanStyles) opts.spanStyles = state.spanStyles;
	if (state.lineStyles && state.lineStyles !== DEFAULTS.lineStyles) opts.lineStyles = state.lineStyles;
	if (state.textStyleTags) opts.textStyleTags = state.textStyleTags;
	if (state.allowedEmptyTags) opts.allowedEmptyTags = state.allowedEmptyTags;
	if (state.allowedClassName) opts.allowedClassName = state.allowedClassName;
	if (state.allUsedStyles) opts.allUsedStyles = state.allUsedStyles;
	if (state.scopeSelectionTags) opts.scopeSelectionTags = state.scopeSelectionTags.split(",").map((s) => s.trim());

	// convertTextTags
	if (state.convertTextTags) {
		try { opts.convertTextTags = JSON.parse(state.convertTextTags); } catch { /* skip */ }
	}
	// tagStyles
	if (state.tagStyles) {
		try { opts.tagStyles = JSON.parse(state.tagStyles); } catch { /* skip */ }
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

	// ── Plugin options (nested) ──
	const img: Record<string, unknown> = {};
	if (!state.image_canResize) img.canResize = false;
	if (state.image_defaultWidth !== "auto") img.defaultWidth = state.image_defaultWidth;
	if (state.image_defaultHeight !== "auto") img.defaultHeight = state.image_defaultHeight;
	if (!state.image_createFileInput) img.createFileInput = false;
	if (!state.image_createUrlInput) img.createUrlInput = false;
	if (state.image_uploadUrl) img.uploadUrl = state.image_uploadUrl;
	if (state.image_uploadSizeLimit) img.uploadSizeLimit = state.image_uploadSizeLimit;
	if (state.image_allowMultiple) img.allowMultiple = true;
	if (state.image_acceptedFormats !== "image/*") img.acceptedFormats = state.image_acceptedFormats;
	if (state.image_percentageOnlySize) img.percentageOnlySize = true;
	if (!state.image_showHeightInput) img.showHeightInput = false;
	if (state.image_uploadHeaders) { try { img.uploadHeaders = JSON.parse(state.image_uploadHeaders); } catch { /* skip */ } }
	if (state.image_uploadSingleSizeLimit) img.uploadSingleSizeLimit = state.image_uploadSingleSizeLimit;
	if (!state.image_useFormatType) img.useFormatType = false;
	if (state.image_defaultFormatType !== "block") img.defaultFormatType = state.image_defaultFormatType;
	if (state.image_keepFormatType) img.keepFormatType = true;
	if (state.image_linkEnableFileUpload) img.linkEnableFileUpload = true;
	if (state.image_insertBehavior !== "auto") img.insertBehavior = state.image_insertBehavior;
	if (state.image_controls) { try { img.controls = JSON.parse(state.image_controls); } catch { /* skip */ } }
	if (Object.keys(img).length) opts.image = img;

	const vid: Record<string, unknown> = {};
	if (!state.video_canResize) vid.canResize = false;
	if (state.video_defaultWidth) vid.defaultWidth = state.video_defaultWidth;
	if (state.video_defaultHeight) vid.defaultHeight = state.video_defaultHeight;
	if (state.video_createFileInput) vid.createFileInput = true;
	if (!state.video_createUrlInput) vid.createUrlInput = false;
	if (state.video_uploadUrl) vid.uploadUrl = state.video_uploadUrl;
	if (state.video_uploadSizeLimit) vid.uploadSizeLimit = state.video_uploadSizeLimit;
	if (state.video_allowMultiple) vid.allowMultiple = true;
	if (state.video_acceptedFormats !== "video/*") vid.acceptedFormats = state.video_acceptedFormats;
	if (state.video_percentageOnlySize) vid.percentageOnlySize = true;
	if (!state.video_showHeightInput) vid.showHeightInput = false;
	if (!state.video_showRatioOption) vid.showRatioOption = false;
	if (state.video_defaultRatio !== 0.5625) vid.defaultRatio = state.video_defaultRatio;
	if (state.video_uploadHeaders) { try { vid.uploadHeaders = JSON.parse(state.video_uploadHeaders); } catch { /* skip */ } }
	if (state.video_uploadSingleSizeLimit) vid.uploadSingleSizeLimit = state.video_uploadSingleSizeLimit;
	if (state.video_videoTagAttributes) { try { vid.videoTagAttributes = JSON.parse(state.video_videoTagAttributes); } catch { /* skip */ } }
	if (state.video_iframeTagAttributes) { try { vid.iframeTagAttributes = JSON.parse(state.video_iframeTagAttributes); } catch { /* skip */ } }
	if (state.video_query_youtube) vid.query_youtube = state.video_query_youtube;
	if (state.video_query_vimeo) vid.query_vimeo = state.video_query_vimeo;
	if (state.video_extensions) vid.extensions = state.video_extensions.split(",").map((s) => s.trim());
	if (state.video_insertBehavior !== "auto") vid.insertBehavior = state.video_insertBehavior;
	if (state.video_controls) { try { vid.controls = JSON.parse(state.video_controls); } catch { /* skip */ } }
	if (state.video_ratioOptions) { try { vid.ratioOptions = JSON.parse(state.video_ratioOptions); } catch { /* skip */ } }
	if (state.video_urlPatterns) { try { vid.urlPatterns = parseRegExpList(state.video_urlPatterns); } catch { /* skip */ } }
	if (state.video_embedQuery) { try { vid.embedQuery = parseEmbedQuery(state.video_embedQuery); } catch { /* skip */ } }
	if (Object.keys(vid).length) opts.video = vid;

	const aud: Record<string, unknown> = {};
	if (state.audio_defaultWidth !== "300px") aud.defaultWidth = state.audio_defaultWidth;
	if (state.audio_defaultHeight !== "54px") aud.defaultHeight = state.audio_defaultHeight;
	if (!state.audio_createFileInput) aud.createFileInput = false;
	if (!state.audio_createUrlInput) aud.createUrlInput = false;
	if (state.audio_uploadUrl) aud.uploadUrl = state.audio_uploadUrl;
	if (state.audio_uploadSizeLimit) aud.uploadSizeLimit = state.audio_uploadSizeLimit;
	if (state.audio_allowMultiple) aud.allowMultiple = true;
	if (state.audio_acceptedFormats !== "audio/*") aud.acceptedFormats = state.audio_acceptedFormats;
	if (state.audio_uploadHeaders) { try { aud.uploadHeaders = JSON.parse(state.audio_uploadHeaders); } catch { /* skip */ } }
	if (state.audio_uploadSingleSizeLimit) aud.uploadSingleSizeLimit = state.audio_uploadSingleSizeLimit;
	if (state.audio_audioTagAttributes) { try { aud.audioTagAttributes = JSON.parse(state.audio_audioTagAttributes); } catch { /* skip */ } }
	if (state.audio_insertBehavior !== "auto") aud.insertBehavior = state.audio_insertBehavior;
	if (Object.keys(aud).length) opts.audio = aud;

	// HR
	if (state.hr_items) {
		try { opts.hr = { items: JSON.parse(state.hr_items) }; } catch { /* skip */ }
	}

	const tbl: Record<string, unknown> = {};
	if (state.table_scrollType !== "x") tbl.scrollType = state.table_scrollType;
	if (state.table_captionPosition !== "bottom") tbl.captionPosition = state.table_captionPosition;
	if (state.table_cellControllerPosition !== "cell") tbl.cellControllerPosition = state.table_cellControllerPosition;
	if (state.table_colorList) tbl.colorList = state.table_colorList.split(",").map((s) => s.trim());
	if (Object.keys(tbl).length) opts.table = tbl;

	const fs: Record<string, unknown> = {};
	if (state.fontSize_sizeUnit !== "px") fs.sizeUnit = state.fontSize_sizeUnit;
	if (state.fontSize_showIncDecControls) fs.showIncDecControls = true;
	if (!state.fontSize_showDefaultSizeLabel) fs.showDefaultSizeLabel = false;
	if (state.fontSize_disableInput) fs.disableInput = true;
	if (state.fontSize_unitMap) { try { fs.unitMap = JSON.parse(state.fontSize_unitMap); } catch { /* skip */ } }
	if (Object.keys(fs).length) opts.fontSize = fs;

	const fc: Record<string, unknown> = {};
	if (state.fontColor_disableHEXInput) fc.disableHEXInput = true;
	if (state.fontColor_splitNum !== 7) fc.splitNum = state.fontColor_splitNum;
	if (state.fontColor_items) fc.items = state.fontColor_items.split(",").map((s) => s.trim());
	if (Object.keys(fc).length) opts.fontColor = fc;

	const bc: Record<string, unknown> = {};
	if (state.backgroundColor_disableHEXInput) bc.disableHEXInput = true;
	if (state.backgroundColor_splitNum !== 7) bc.splitNum = state.backgroundColor_splitNum;
	if (state.backgroundColor_items) bc.items = state.backgroundColor_items.split(",").map((s) => s.trim());
	if (Object.keys(bc).length) opts.backgroundColor = bc;

	const emb: Record<string, unknown> = {};
	if (!state.embed_canResize) emb.canResize = false;
	if (state.embed_defaultWidth) emb.defaultWidth = state.embed_defaultWidth;
	if (state.embed_defaultHeight) emb.defaultHeight = state.embed_defaultHeight;
	if (!state.embed_showHeightInput) emb.showHeightInput = false;
	if (state.embed_percentageOnlySize) emb.percentageOnlySize = true;
	if (state.embed_uploadUrl) emb.uploadUrl = state.embed_uploadUrl;
	if (state.embed_uploadHeaders) { try { emb.uploadHeaders = JSON.parse(state.embed_uploadHeaders); } catch { /* skip */ } }
	if (state.embed_uploadSizeLimit) emb.uploadSizeLimit = state.embed_uploadSizeLimit;
	if (state.embed_uploadSingleSizeLimit) emb.uploadSingleSizeLimit = state.embed_uploadSingleSizeLimit;
	if (state.embed_iframeTagAttributes) { try { emb.iframeTagAttributes = JSON.parse(state.embed_iframeTagAttributes); } catch { /* skip */ } }
	if (state.embed_query_youtube) emb.query_youtube = state.embed_query_youtube;
	if (state.embed_query_vimeo) emb.query_vimeo = state.embed_query_vimeo;
	if (state.embed_insertBehavior !== "auto") emb.insertBehavior = state.embed_insertBehavior;
	if (state.embed_controls) { try { emb.controls = JSON.parse(state.embed_controls); } catch { /* skip */ } }
	if (state.embed_urlPatterns) { try { emb.urlPatterns = parseRegExpList(state.embed_urlPatterns); } catch { /* skip */ } }
	if (state.embed_embedQuery) { try { emb.embedQuery = parseEmbedQuery(state.embed_embedQuery); } catch { /* skip */ } }
	if (Object.keys(emb).length) opts.embed = emb;

	const drw: Record<string, unknown> = {};
	if (state.drawing_outputFormat !== "dataurl") drw.outputFormat = state.drawing_outputFormat;
	if (state.drawing_lineWidth !== 5) drw.lineWidth = state.drawing_lineWidth;
	if (state.drawing_lineCap !== "round") drw.lineCap = state.drawing_lineCap;
	if (!state.drawing_canResize) drw.canResize = false;
	if (state.drawing_lineColor) drw.lineColor = state.drawing_lineColor;
	if (state.drawing_lineReconnect) drw.lineReconnect = true;
	if (state.drawing_useFormatType) drw.useFormatType = true;
	if (state.drawing_defaultFormatType !== "block") drw.defaultFormatType = state.drawing_defaultFormatType;
	if (state.drawing_keepFormatType) drw.keepFormatType = true;
	if (!state.drawing_maintainRatio) drw.maintainRatio = false;
	if (state.drawing_formSize) { try { drw.formSize = JSON.parse(state.drawing_formSize); } catch { /* skip */ } }
	if (Object.keys(drw).length) opts.drawing = drw;

	const mnt: Record<string, unknown> = {};
	if (state.mention_triggerText !== "@") mnt.triggerText = state.mention_triggerText;
	if (state.mention_limitSize !== 5) mnt.limitSize = state.mention_limitSize;
	if (state.mention_delayTime !== 200) mnt.delayTime = state.mention_delayTime;
	if (state.mention_searchStartLength) mnt.searchStartLength = state.mention_searchStartLength;
	if (state.mention_apiUrl) mnt.apiUrl = state.mention_apiUrl;
	if (!state.mention_useCachingData) mnt.useCachingData = false;
	if (state.mention_apiHeaders) { try { mnt.apiHeaders = JSON.parse(state.mention_apiHeaders); } catch { /* skip */ } }
	if (!state.mention_useCachingFieldData) mnt.useCachingFieldData = false;
	if (state.mention_data) { try { mnt.data = JSON.parse(state.mention_data); } catch { /* skip */ } }
	if (Object.keys(mnt).length) opts.mention = mnt;

	const mth: Record<string, unknown> = {};
	if (!state.math_canResize) mth.canResize = false;
	if (state.math_autoHeight) mth.autoHeight = true;
	if (state.math_fontSizeList) { try { mth.fontSizeList = JSON.parse(state.math_fontSizeList); } catch { /* skip */ } }
	if (state.math_formSize) { try { mth.formSize = JSON.parse(state.math_formSize); } catch { /* skip */ } }
	if (state.math_onPaste) { const fn = parseFunction(state.math_onPaste); if (fn) mth.onPaste = fn; }
	if (Object.keys(mth).length) opts.math = mth;

	// Link
	const lnk: Record<string, unknown> = {};
	if (!state.link_title) lnk.title = false;
	if (!state.link_textToDisplay) lnk.textToDisplay = false;
	if (!state.link_openNewWindow) lnk.openNewWindow = false;
	if (state.link_noAutoPrefix) lnk.noAutoPrefix = true;
	if (state.link_uploadUrl) lnk.uploadUrl = state.link_uploadUrl;
	if (state.link_uploadHeaders) { try { lnk.uploadHeaders = JSON.parse(state.link_uploadHeaders); } catch { /* skip */ } }
	if (state.link_uploadSizeLimit) lnk.uploadSizeLimit = state.link_uploadSizeLimit;
	if (state.link_uploadSingleSizeLimit) lnk.uploadSingleSizeLimit = state.link_uploadSingleSizeLimit;
	if (state.link_acceptedFormats) lnk.acceptedFormats = state.link_acceptedFormats;
	if (state.link_relList) lnk.relList = state.link_relList.split(",").map((s) => s.trim());
	if (state.link_defaultRel) { try { lnk.defaultRel = JSON.parse(state.link_defaultRel); } catch { /* skip */ } }
	if (Object.keys(lnk).length) opts.link = lnk;

	// ExportPDF
	const epdf: Record<string, unknown> = {};
	if (state.exportPDF_apiUrl) epdf.apiUrl = state.exportPDF_apiUrl;
	if (state.exportPDF_fileName !== "suneditor-pdf") epdf.fileName = state.exportPDF_fileName;
	if (Object.keys(epdf).length) opts.exportPDF = epdf;

	// FileUpload
	const fu: Record<string, unknown> = {};
	if (state.fileUpload_uploadUrl) fu.uploadUrl = state.fileUpload_uploadUrl;
	if (state.fileUpload_uploadHeaders) { try { fu.uploadHeaders = JSON.parse(state.fileUpload_uploadHeaders); } catch { /* skip */ } }
	if (state.fileUpload_uploadSizeLimit) fu.uploadSizeLimit = state.fileUpload_uploadSizeLimit;
	if (state.fileUpload_uploadSingleSizeLimit) fu.uploadSingleSizeLimit = state.fileUpload_uploadSingleSizeLimit;
	if (state.fileUpload_allowMultiple) fu.allowMultiple = true;
	if (state.fileUpload_acceptedFormats !== "*") fu.acceptedFormats = state.fileUpload_acceptedFormats;
	if (state.fileUpload_as !== "box") fu.as = state.fileUpload_as;
	if (state.fileUpload_insertBehavior !== "auto") fu.insertBehavior = state.fileUpload_insertBehavior;
	if (state.fileUpload_controls) { try { fu.controls = JSON.parse(state.fileUpload_controls); } catch { /* skip */ } }
	if (Object.keys(fu).length) opts.fileUpload = fu;

	// Align
	if (state.align_items) {
		opts.align = { items: state.align_items.split(",").map((s) => s.trim()) };
	}
	// Font
	if (state.font_items) {
		opts.font = { items: state.font_items.split(",").map((s) => s.trim()) };
	}
	// BlockStyle
	if (state.blockStyle_items) {
		opts.blockStyle = { items: state.blockStyle_items.split(",").map((s) => s.trim()) };
	}
	// LineHeight
	if (state.lineHeight_items) {
		try { opts.lineHeight = { items: JSON.parse(state.lineHeight_items) }; } catch { /* skip */ }
	}
	// ParagraphStyle
	if (state.paragraphStyle_items) {
		opts.paragraphStyle = { items: state.paragraphStyle_items.split(",").map((s) => s.trim()) };
	}
	// TextStyle
	if (state.textStyle_items) {
		opts.textStyle = { items: state.textStyle_items.split(",").map((s) => s.trim()) };
	}
	// Template
	if (state.template_items) {
		try { opts.template = { items: JSON.parse(state.template_items) }; } catch { /* skip */ }
	}
	// Layout
	if (state.layout_items) {
		try { opts.layout = { items: JSON.parse(state.layout_items) }; } catch { /* skip */ }
	}

	// ImageGallery
	const ig: Record<string, unknown> = {};
	if (state.imageGallery_url) ig.url = state.imageGallery_url;
	if (state.imageGallery_headers) { try { ig.headers = JSON.parse(state.imageGallery_headers); } catch { /* skip */ } }
	if (state.imageGallery_data) { try { ig.data = JSON.parse(state.imageGallery_data); } catch { /* skip */ } }
	if (Object.keys(ig).length) opts.imageGallery = ig;

	// VideoGallery
	const vg: Record<string, unknown> = {};
	if (state.videoGallery_url) vg.url = state.videoGallery_url;
	if (state.videoGallery_headers) { try { vg.headers = JSON.parse(state.videoGallery_headers); } catch { /* skip */ } }
	if (state.videoGallery_thumbnail) vg.thumbnail = state.videoGallery_thumbnail;
	if (state.videoGallery_data) { try { vg.data = JSON.parse(state.videoGallery_data); } catch { /* skip */ } }
	if (Object.keys(vg).length) opts.videoGallery = vg;

	// AudioGallery
	const ag: Record<string, unknown> = {};
	if (state.audioGallery_url) ag.url = state.audioGallery_url;
	if (state.audioGallery_headers) { try { ag.headers = JSON.parse(state.audioGallery_headers); } catch { /* skip */ } }
	if (state.audioGallery_thumbnail) ag.thumbnail = state.audioGallery_thumbnail;
	if (state.audioGallery_data) { try { ag.data = JSON.parse(state.audioGallery_data); } catch { /* skip */ } }
	if (Object.keys(ag).length) opts.audioGallery = ag;

	// FileGallery
	const fg: Record<string, unknown> = {};
	if (state.fileGallery_url) fg.url = state.fileGallery_url;
	if (state.fileGallery_headers) { try { fg.headers = JSON.parse(state.fileGallery_headers); } catch { /* skip */ } }
	if (state.fileGallery_thumbnail) fg.thumbnail = state.fileGallery_thumbnail;
	if (state.fileGallery_data) { try { fg.data = JSON.parse(state.fileGallery_data); } catch { /* skip */ } }
	if (Object.keys(fg).length) opts.fileGallery = fg;

	// FileBrowser
	const fbr: Record<string, unknown> = {};
	if (state.fileBrowser_url) fbr.url = state.fileBrowser_url;
	if (state.fileBrowser_headers) { try { fbr.headers = JSON.parse(state.fileBrowser_headers); } catch { /* skip */ } }
	if (state.fileBrowser_thumbnail) fbr.thumbnail = state.fileBrowser_thumbnail;
	if (state.fileBrowser_data) { try { fbr.data = JSON.parse(state.fileBrowser_data); } catch { /* skip */ } }
	if (state.fileBrowser_props) { try { fbr.props = JSON.parse(state.fileBrowser_props); } catch { /* skip */ } }
	if (Object.keys(fbr).length) opts.fileBrowser = fbr;

	return opts;
}

/* ── Per-root frame options for multiroot ──────────────── */

export type RootConfig = { key: string; label: string; options: Record<string, unknown> };

/** Build per-root frame options from flat state. Empty string = inherit global. */
function buildRootOptions(state: PlaygroundState, prefix: "root_header" | "root_body"): Record<string, unknown> {
	const opts: Record<string, unknown> = {};
	const s = (key: string) => state[`${prefix}_${key}` as keyof PlaygroundState] as string;

	// String options: emit if non-empty
	const strKeys = [
		"height", "width", "minWidth", "maxWidth", "minHeight", "maxHeight",
		"editorStyle", "placeholder", "value", "charCounter_label",
	];
	for (const k of strKeys) {
		const v = s(k);
		if (v) opts[k === "charCounter_label" ? "charCounter_label" : k] = v;
	}

	// charCounter_type
	if (s("charCounter_type")) opts.charCounter_type = s("charCounter_type");

	// charCounter_max (number)
	if (s("charCounter_max")) opts.charCounter_max = Number(s("charCounter_max"));

	// JSON objects
	if (s("editableFrameAttributes")) {
		try { opts.editableFrameAttributes = JSON.parse(s("editableFrameAttributes")); } catch { /* skip */ }
	}
	if (s("iframe_attributes")) {
		try { opts.iframe_attributes = JSON.parse(s("iframe_attributes")); } catch { /* skip */ }
	}

	// CSV to array
	if (s("iframe_cssFileName")) {
		opts.iframe_cssFileName = s("iframe_cssFileName").split(",").map((x) => x.trim());
	}

	// Tri-state booleans ("" = inherit, "true"/"false" = explicit)
	const boolKeys = [
		"iframe", "iframe_fullPage",
		"statusbar", "statusbar_showPathLabel", "statusbar_resizeEnable",
		"charCounter",
	];
	for (const k of boolKeys) {
		const v = s(k);
		if (v === "true") opts[k] = true;
		else if (v === "false") opts[k] = false;
	}

	return opts;
}

export function getRootConfigs(state: PlaygroundState): RootConfig[] {
	return [
		{ key: "header", label: "Header", options: buildRootOptions(state, "root_header") },
		{ key: "body", label: "Body", options: buildRootOptions(state, "root_body") },
	];
}

/* ── URL serialization ─────────────────────────────────── */

const PARAM_MAP: Record<string, keyof PlaygroundState> = {
	// Mode & Theme
	mr: "multiroot",
	m: "mode",
	p: "buttonListPreset",
	cbl: "customButtonList",
	tp: "type",
	t: "theme",
	dir: "textDirection",
	rb: "reverseButtons",
	v2m: "v2Migration",
	ln: "lang",
	ic: "icons",
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
	tce: "toolbar_container_enabled",
	sh: "shortcutsHint",
	sd: "shortcutsDisable",
	sc: "shortcuts",
	// Sub-Toolbar
	ste: "subToolbar_enabled",
	stp: "subToolbar_buttonListPreset",
	stm: "subToolbar_mode",
	stw: "subToolbar_width",
	// Multi-Root per-root: layout
	rhh: "root_header_height",
	rhw: "root_header_width",
	rhinw: "root_header_minWidth",
	rhaxw: "root_header_maxWidth",
	rhinh: "root_header_minHeight",
	rhaxh: "root_header_maxHeight",
	rhes: "root_header_editorStyle",
	rbh: "root_body_height",
	rbw: "root_body_width",
	rbinw: "root_body_minWidth",
	rbaxw: "root_body_maxWidth",
	rbinh: "root_body_minHeight",
	rbaxh: "root_body_maxHeight",
	rbes: "root_body_editorStyle",
	// Multi-Root per-root: content
	rhp: "root_header_placeholder",
	rhv: "root_header_value",
	rhefa: "root_header_editableFrameAttributes",
	rbp: "root_body_placeholder",
	rbv: "root_body_value",
	rbefa: "root_body_editableFrameAttributes",
	// Multi-Root per-root: iframe
	rhif: "root_header_iframe",
	rhifp: "root_header_iframe_fullPage",
	rhifa: "root_header_iframe_attributes",
	rhicf: "root_header_iframe_cssFileName",
	rbif: "root_body_iframe",
	rbifp: "root_body_iframe_fullPage",
	rbifa: "root_body_iframe_attributes",
	rbicf: "root_body_iframe_cssFileName",
	// Multi-Root per-root: statusbar
	rhsb: "root_header_statusbar",
	rhsp: "root_header_statusbar_showPathLabel",
	rhsr: "root_header_statusbar_resizeEnable",
	rbsb: "root_body_statusbar",
	rbsp: "root_body_statusbar_showPathLabel",
	rbsr: "root_body_statusbar_resizeEnable",
	// Multi-Root per-root: charCounter
	rhcc: "root_header_charCounter",
	rhccm: "root_header_charCounter_max",
	rhccl: "root_header_charCounter_label",
	rhcct: "root_header_charCounter_type",
	rbcc: "root_body_charCounter",
	rbccm: "root_body_charCounter_max",
	rbccl: "root_body_charCounter_label",
	rbcct: "root_body_charCounter_type",
	// Statusbar
	ssce: "statusbar_container_enabled",
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
	"cb.l": "codeBlock_langs",
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
	"sm.tf": "strictMode_tagFilter",
	"sm.ff": "strictMode_formatFilter",
	"sm.cf": "strictMode_classFilter",
	"sm.tsf": "strictMode_textStyleTagFilter",
	"sm.af": "strictMode_attrFilter",
	"sm.sf": "strictMode_styleFilter",
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
	ctt: "convertTextTags",
	tgs: "tagStyles",
	// Plugin: Image
	"i.r": "image_canResize",
	"i.w": "image_defaultWidth",
	"i.h": "image_defaultHeight",
	"i.fi": "image_createFileInput",
	"i.ui": "image_createUrlInput",
	"i.uu": "image_uploadUrl",
	"i.sl": "image_uploadSizeLimit",
	"i.am": "image_allowMultiple",
	"i.af": "image_acceptedFormats",
	"i.po": "image_percentageOnlySize",
	"i.shi": "image_showHeightInput",
	// Plugin: Video
	"v.r": "video_canResize",
	"v.w": "video_defaultWidth",
	"v.h": "video_defaultHeight",
	"v.fi": "video_createFileInput",
	"v.ui": "video_createUrlInput",
	"v.uu": "video_uploadUrl",
	"v.sl": "video_uploadSizeLimit",
	"v.am": "video_allowMultiple",
	"v.af": "video_acceptedFormats",
	"v.po": "video_percentageOnlySize",
	"v.shi": "video_showHeightInput",
	"v.sro": "video_showRatioOption",
	"v.dr": "video_defaultRatio",
	// Plugin: Audio
	"a.w": "audio_defaultWidth",
	"a.h": "audio_defaultHeight",
	"a.fi": "audio_createFileInput",
	"a.ui": "audio_createUrlInput",
	"a.uu": "audio_uploadUrl",
	"a.sl": "audio_uploadSizeLimit",
	"a.am": "audio_allowMultiple",
	"a.af": "audio_acceptedFormats",
	// Plugin: HR
	"hr.i": "hr_items",
	// Plugin: Table
	"tb.s": "table_scrollType",
	"tb.cp": "table_captionPosition",
	"tb.cc": "table_cellControllerPosition",
	"tb.cl": "table_colorList",
	// Plugin: FontSize
	"fs.u": "fontSize_sizeUnit",
	"fs.ic": "fontSize_showIncDecControls",
	"fs.sdl": "fontSize_showDefaultSizeLabel",
	"fs.di": "fontSize_disableInput",
	"fs.um": "fontSize_unitMap",
	// Plugin: FontColor
	"fc.dh": "fontColor_disableHEXInput",
	"fc.i": "fontColor_items",
	// Plugin: BackgroundColor
	"bc.dh": "backgroundColor_disableHEXInput",
	"bc.i": "backgroundColor_items",
	// Plugin: Embed
	"em.r": "embed_canResize",
	"em.w": "embed_defaultWidth",
	"em.h": "embed_defaultHeight",
	"em.shi": "embed_showHeightInput",
	"em.po": "embed_percentageOnlySize",
	// Plugin: Drawing
	"dr.of": "drawing_outputFormat",
	"dr.lw": "drawing_lineWidth",
	"dr.lc": "drawing_lineCap",
	"dr.r": "drawing_canResize",
	"dr.clr": "drawing_lineColor",
	"dr.rc": "drawing_lineReconnect",
	// Plugin: Mention
	"mn.t": "mention_triggerText",
	"mn.l": "mention_limitSize",
	"mn.d": "mention_delayTime",
	"mn.ssl": "mention_searchStartLength",
	"mn.au": "mention_apiUrl",
	"mn.uc": "mention_useCachingData",
	// Plugin: Math
	"mt.ml": "math_mathLib",
	"mt.r": "math_canResize",
	"mt.ah": "math_autoHeight",
	// Plugin: Image (extended)
	"i.uh": "image_uploadHeaders",
	"i.ssl": "image_uploadSingleSizeLimit",
	"i.uft": "image_useFormatType",
	"i.dft": "image_defaultFormatType",
	"i.kft": "image_keepFormatType",
	"i.lfu": "image_linkEnableFileUpload",
	"i.ib": "image_insertBehavior",
	"i.ct": "image_controls",
	// Plugin: Video (extended)
	"v.uh": "video_uploadHeaders",
	"v.ssl": "video_uploadSingleSizeLimit",
	"v.vta": "video_videoTagAttributes",
	"v.ita": "video_iframeTagAttributes",
	"v.qy": "video_query_youtube",
	"v.qv": "video_query_vimeo",
	"v.ext": "video_extensions",
	"v.ib": "video_insertBehavior",
	"v.ct": "video_controls",
	"v.ro": "video_ratioOptions",
	"v.up": "video_urlPatterns",
	"v.eq": "video_embedQuery",
	// Plugin: Audio (extended)
	"a.uh": "audio_uploadHeaders",
	"a.ssl": "audio_uploadSingleSizeLimit",
	"a.ata": "audio_audioTagAttributes",
	"a.ib": "audio_insertBehavior",
	// Plugin: Embed (extended)
	"em.uu": "embed_uploadUrl",
	"em.uh": "embed_uploadHeaders",
	"em.usl": "embed_uploadSizeLimit",
	"em.ssl": "embed_uploadSingleSizeLimit",
	"em.ita": "embed_iframeTagAttributes",
	"em.qy": "embed_query_youtube",
	"em.qv": "embed_query_vimeo",
	"em.ib": "embed_insertBehavior",
	"em.ct": "embed_controls",
	"em.up": "embed_urlPatterns",
	"em.eq": "embed_embedQuery",
	// Plugin: Drawing (extended)
	"dr.uft": "drawing_useFormatType",
	"dr.dft": "drawing_defaultFormatType",
	"dr.kft": "drawing_keepFormatType",
	"dr.mr": "drawing_maintainRatio",
	"dr.fs": "drawing_formSize",
	// Plugin: Mention (extended)
	"mn.ah": "mention_apiHeaders",
	"mn.ucfd": "mention_useCachingFieldData",
	"mn.dt": "mention_data",
	// Plugin: Math (extended)
	"mt.fsl": "math_fontSizeList",
	"mt.fs": "math_formSize",
	"mt.op": "math_onPaste",
	// Plugin: FontColor (extended)
	"fc.sn": "fontColor_splitNum",
	// Plugin: BackgroundColor (extended)
	"bc.sn": "backgroundColor_splitNum",
	// Plugin: Link
	"lk.t": "link_title",
	"lk.td": "link_textToDisplay",
	"lk.onw": "link_openNewWindow",
	"lk.nap": "link_noAutoPrefix",
	"lk.uu": "link_uploadUrl",
	"lk.uh": "link_uploadHeaders",
	"lk.sl": "link_uploadSizeLimit",
	"lk.ssl": "link_uploadSingleSizeLimit",
	"lk.af": "link_acceptedFormats",
	"lk.rl": "link_relList",
	"lk.dr": "link_defaultRel",
	// Plugin: ExportPDF
	"ep.au": "exportPDF_apiUrl",
	"ep.fn": "exportPDF_fileName",
	// Plugin: FileUpload
	"fu.uu": "fileUpload_uploadUrl",
	"fu.uh": "fileUpload_uploadHeaders",
	"fu.sl": "fileUpload_uploadSizeLimit",
	"fu.ssl": "fileUpload_uploadSingleSizeLimit",
	"fu.am": "fileUpload_allowMultiple",
	"fu.af": "fileUpload_acceptedFormats",
	"fu.as": "fileUpload_as",
	"fu.ib": "fileUpload_insertBehavior",
	"fu.ct": "fileUpload_controls",
	// Plugin: Align
	"al.i": "align_items",
	// Plugin: Font
	"fn.i": "font_items",
	// Plugin: BlockStyle
	"bs.i": "blockStyle_items",
	// Plugin: LineHeight
	"lh.i": "lineHeight_items",
	// Plugin: ParagraphStyle
	"ps.i": "paragraphStyle_items",
	// Plugin: TextStyle
	"ts.i": "textStyle_items",
	// Plugin: Template
	"tp.i": "template_items",
	// Plugin: Layout
	"ly.i": "layout_items",
	// Plugin: ImageGallery
	"ig.u": "imageGallery_url",
	"ig.h": "imageGallery_headers",
	"ig.d": "imageGallery_data",
	// Plugin: VideoGallery
	"vg.u": "videoGallery_url",
	"vg.h": "videoGallery_headers",
	"vg.th": "videoGallery_thumbnail",
	"vg.d": "videoGallery_data",
	// Plugin: AudioGallery
	"ag.u": "audioGallery_url",
	"ag.h": "audioGallery_headers",
	"ag.th": "audioGallery_thumbnail",
	"ag.d": "audioGallery_data",
	// Plugin: FileGallery
	"fg.u": "fileGallery_url",
	"fg.h": "fileGallery_headers",
	"fg.th": "fileGallery_thumbnail",
	"fg.d": "fileGallery_data",
	// Plugin: FileBrowser
	"fb.u": "fileBrowser_url",
	"fb.h": "fileBrowser_headers",
	"fb.th": "fileBrowser_thumbnail",
	"fb.d": "fileBrowser_data",
	"fb.p": "fileBrowser_props",
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
