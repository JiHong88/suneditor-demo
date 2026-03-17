/**
 * @fileoverview v2 → v3 옵션 매핑 데이터
 *
 * v2 옵션명을 v3 옵션으로 변환하기 위한 매핑 테이블.
 * "removed" = v3에서 제거됨, "unchanged" = 동일, 나머지는 새 경로.
 */

export type MigrationEntry = {
	/** v2 option key */
	v2: string;
	/** v3 option key (dot notation for nested, e.g. "image.uploadUrl") */
	v3: string | null;
	/** Migration note */
	note?: string;
	/** Value transform hint */
	transform?: string;
};

/** Flat option renames / moves */
export const OPTION_MAP: MigrationEntry[] = [
	// ── Values ──
	{ v2: "strictMode", v3: "strictMode" },
	{ v2: "strictHTMLValidation", v3: "strictHTMLValidation" },
	{ v2: "lang", v3: "lang" },
	{ v2: "defaultTag", v3: "defaultLine", note: "Renamed" },
	{ v2: "textTags", v3: "textTags" },
	{ v2: "value", v3: "value" },
	{ v2: "allowedClassNames", v3: "allowedClassName", note: "Renamed (singular)" },
	{ v2: "historyStackDelayTime", v3: "historyStackDelayTime" },
	{ v2: "frameAttrbutes", v3: "frameAttributes", note: "Typo fixed in v3" },

	// ── Whitelist / Blacklist ──
	{ v2: "addTagsWhitelist", v3: "elementWhitelist", note: "Renamed" },
	{ v2: "tagsBlacklist", v3: "elementBlacklist", note: "Renamed" },
	{ v2: "pasteTagsWhitelist", v3: null, note: "Removed in v3" },
	{ v2: "pasteTagsBlacklist", v3: null, note: "Removed in v3" },
	{ v2: "attributesWhitelist", v3: "attributeWhitelist", note: "Renamed (singular)" },
	{ v2: "attributesBlacklist", v3: "attributeBlacklist", note: "Renamed (singular)" },

	// ── Layout ──
	{ v2: "mode", v3: "mode" },
	{ v2: "rtl", v3: "rtl" },
	{ v2: "lineAttrReset", v3: "lineAttrReset" },
	{ v2: "toolbarWidth", v3: "toolbar_width", note: "Renamed (underscore)" },
	{ v2: "toolbarContainer", v3: "toolbar_container", note: "Renamed (underscore)" },
	{ v2: "stickyToolbar", v3: "toolbar_sticky", note: "Renamed" },
	{ v2: "hideToolbar", v3: "toolbar_hide", note: "Renamed" },
	{ v2: "fullScreenOffset", v3: "fullScreenOffset" },
	{ v2: "iframe", v3: "iframe" },
	{ v2: "fullPage", v3: "iframe_fullPage", note: "Renamed" },
	{ v2: "iframeAttributes", v3: "iframe_attributes", note: "Renamed (underscore)" },
	{ v2: "iframeCSSFileName", v3: "iframe_cssFileName", note: "Renamed" },
	{ v2: "previewTemplate", v3: "previewTemplate" },
	{ v2: "printTemplate", v3: "printTemplate" },
	{ v2: "codeMirror", v3: null, note: "Removed. Use externalLibs.codeMirror" },
	{ v2: "katex", v3: null, note: "Removed. Use externalLibs.katex or math.mathLib" },
	{ v2: "mathFontSize", v3: "math.fontSizeList", note: "Moved to plugin option" },

	// ── Display ──
	{ v2: "position", v3: null, note: "Removed in v3" },
	{ v2: "display", v3: null, note: "Removed in v3" },
	{ v2: "popupDisplay", v3: "popupDisplay" },

	// ── Resizing bar ──
	{ v2: "resizingBar", v3: "statusbar", note: "Renamed" },
	{ v2: "showPathLabel", v3: "statusbar_showPathLabel", note: "Renamed" },
	{ v2: "resizeEnable", v3: "statusbar_resizeEnable", note: "Renamed" },
	{ v2: "resizingBarContainer", v3: "statusbar_container", note: "Renamed" },

	// ── Character count ──
	{ v2: "charCounter", v3: "charCounter" },
	{ v2: "charCounterType", v3: "charCounterType" },
	{ v2: "charCounterLabel", v3: "charCounterLabel" },
	{ v2: "maxCharCount", v3: "maxCharCount" },

	// ── Size ──
	{ v2: "width", v3: "width" },
	{ v2: "minWidth", v3: "minWidth" },
	{ v2: "maxWidth", v3: "maxWidth" },
	{ v2: "height", v3: "height" },
	{ v2: "minHeight", v3: "minHeight" },
	{ v2: "maxHeight", v3: "maxHeight" },

	// ── Editing area ──
	{ v2: "className", v3: "className" },
	{ v2: "defaultStyle", v3: "defaultStyle" },

	// ── Menu items ──
	{ v2: "font", v3: "font.items", note: "Moved to plugin option" },
	{ v2: "fontSize", v3: "fontSize.sizeUnit (array removed)", note: "v3 uses input, not dropdown array" },
	{ v2: "fontSizeUnit", v3: "fontSize.sizeUnit", note: "Moved to plugin option" },
	{ v2: "alignItems", v3: "align.items", note: "Renamed & moved to plugin option" },
	{ v2: "formats", v3: "blockStyle.items", note: "Renamed & moved to plugin option" },
	{ v2: "colorList", v3: "fontColor.items / backgroundColor.items", note: "Split into two plugin options" },
	{ v2: "lineHeights", v3: "lineHeight.items", note: "Renamed & moved to plugin option" },
	{ v2: "paragraphStyles", v3: "paragraphStyle.items", note: "Moved to plugin option" },
	{ v2: "textStyles", v3: "textStyle.items", note: "Moved to plugin option" },

	// ── Image ──
	{ v2: "imageResizing", v3: "image.canResize", note: "Renamed" },
	{ v2: "imageHeightShow", v3: "image.showHeightInput", note: "Renamed" },
	{ v2: "imageAlignShow", v3: null, note: "Removed. Use image.controls" },
	{ v2: "imageWidth", v3: "image.defaultWidth", note: "Renamed" },
	{ v2: "imageHeight", v3: "image.defaultHeight", note: "Renamed" },
	{ v2: "imageSizeOnlyPercentage", v3: "image.percentageOnlySize", note: "Renamed" },
	{ v2: "imageRotation", v3: null, note: "Removed in v3" },
	{ v2: "imageFileInput", v3: "image.createFileInput", note: "Renamed" },
	{ v2: "imageUrlInput", v3: "image.createUrlInput", note: "Renamed" },
	{ v2: "imageUploadHeader", v3: "image.uploadHeaders", note: "Renamed (plural)" },
	{ v2: "imageUploadUrl", v3: "image.uploadUrl", note: "Moved to plugin option" },
	{ v2: "imageUploadSizeLimit", v3: "image.uploadSizeLimit", note: "Moved to plugin option" },
	{ v2: "imageMultipleFile", v3: "image.allowMultiple", note: "Renamed" },
	{ v2: "imageAccept", v3: "image.acceptedFormats", note: "Renamed" },
	{ v2: "imageGalleryData", v3: "imageGallery.data", note: "Moved to plugin option" },
	{ v2: "imageGalleryUrl", v3: "imageGallery.url", note: "Moved to plugin option" },
	{ v2: "imageGalleryHeader", v3: "imageGallery.headers", note: "Moved to plugin option" },

	// ── Video ──
	{ v2: "videoResizing", v3: "video.canResize", note: "Renamed" },
	{ v2: "videoHeightShow", v3: "video.showHeightInput", note: "Renamed" },
	{ v2: "videoAlignShow", v3: null, note: "Removed. Use video.controls" },
	{ v2: "videoRatioShow", v3: "video.showRatioOption", note: "Renamed" },
	{ v2: "videoWidth", v3: "video.defaultWidth", note: "Renamed" },
	{ v2: "videoHeight", v3: "video.defaultHeight", note: "Renamed" },
	{ v2: "videoSizeOnlyPercentage", v3: "video.percentageOnlySize", note: "Renamed" },
	{ v2: "videoRotation", v3: null, note: "Removed in v3" },
	{ v2: "videoRatio", v3: "video.defaultRatio", note: "Renamed" },
	{ v2: "videoRatioList", v3: "video.ratioOptions", note: "Renamed" },
	{ v2: "youtubeQuery", v3: "video.query_youtube", note: "Renamed & moved to plugin option" },
	{ v2: "vimeoQuery", v3: "video.query_vimeo", note: "Renamed & moved to plugin option" },
	{ v2: "videoFileInput", v3: "video.createFileInput", note: "Renamed" },
	{ v2: "videoUrlInput", v3: "video.createUrlInput", note: "Renamed" },
	{ v2: "videoUploadHeader", v3: "video.uploadHeaders", note: "Renamed (plural)" },
	{ v2: "videoUploadUrl", v3: "video.uploadUrl", note: "Moved to plugin option" },
	{ v2: "videoUploadSizeLimit", v3: "video.uploadSizeLimit", note: "Moved to plugin option" },
	{ v2: "videoMultipleFile", v3: "video.allowMultiple", note: "Renamed" },
	{ v2: "videoTagAttrs", v3: "video.videoTagAttributes", note: "Renamed" },
	{ v2: "videoIframeAttrs", v3: "video.iframeTagAttributes", note: "Renamed" },
	{ v2: "videoAccept", v3: "video.acceptedFormats", note: "Renamed" },

	// ── Audio ──
	{ v2: "audioWidth", v3: "audio.defaultWidth", note: "Renamed & moved to plugin option" },
	{ v2: "audioHeight", v3: "audio.defaultHeight", note: "Renamed & moved to plugin option" },
	{ v2: "audioFileInput", v3: "audio.createFileInput", note: "Renamed" },
	{ v2: "audioUrlInput", v3: "audio.createUrlInput", note: "Renamed" },
	{ v2: "audioUploadHeader", v3: "audio.uploadHeaders", note: "Renamed (plural)" },
	{ v2: "audioUploadUrl", v3: "audio.uploadUrl", note: "Moved to plugin option" },
	{ v2: "audioUploadSizeLimit", v3: "audio.uploadSizeLimit", note: "Moved to plugin option" },
	{ v2: "audioMultipleFile", v3: "audio.allowMultiple", note: "Renamed" },
	{ v2: "audioTagAttrs", v3: "audio.audioTagAttributes", note: "Renamed" },
	{ v2: "audioAccept", v3: "audio.acceptedFormats", note: "Renamed" },

	// ── Table ──
	{ v2: "tableCellControllerPosition", v3: "table.cellControllerPosition", note: "Moved to plugin option" },

	// ── Link ──
	{ v2: "linkTargetNewWindow", v3: "link.openNewWindow", note: "Renamed & moved to plugin option" },
	{ v2: "linkProtocol", v3: null, note: "Removed in v3" },
	{ v2: "linkRel", v3: "link.relList", note: "Renamed & moved to plugin option" },
	{ v2: "linkRelDefault", v3: "link.defaultRel", note: "Renamed & moved to plugin option" },
	{ v2: "linkNoPrefix", v3: "link.noAutoPrefix", note: "Renamed & moved to plugin option" },

	// ── HR ──
	{ v2: "hrItems", v3: "hr.items", note: "Moved to plugin option" },

	// ── Key actions ──
	{ v2: "tabDisable", v3: "shortcutsDisable", note: "Use shortcutsDisable: ['tab']" },
	{ v2: "shortcutsDisable", v3: "shortcutsDisable" },
	{ v2: "shortcutsHint", v3: "shortcutsHint" },

	// ── ETC ──
	{ v2: "callBackSave", v3: "events.onSave", note: "Moved to events" },
	{ v2: "templates", v3: "template.items", note: "Moved to plugin option" },
	{ v2: "__allowedScriptTag", v3: null, note: "Removed in v3" },
	{ v2: "placeholder", v3: "placeholder" },
	{ v2: "mediaAutoSelect", v3: null, note: "Removed in v3" },
	{ v2: "icons", v3: "icons" },
	{ v2: "buttonList", v3: "buttonList" },

	// ── Buttons renamed ──
	{ v2: "formatBlock (button)", v3: "blockStyle (button)", note: "Button renamed" },
	{ v2: "hiliteColor (button)", v3: "backgroundColor (button)", note: "Button renamed" },
	{ v2: "horizontalRule (button)", v3: "hr (button)", note: "Button renamed" },
];

/** Button name changes */
export const BUTTON_MAP: Record<string, string> = {
	formatBlock: "blockStyle",
	hiliteColor: "backgroundColor",
	horizontalRule: "hr",
	dir: "dir",
	dir_ltr: "dir_ltr",
	dir_rtl: "dir_rtl",
};

/** Event name changes (v2 → v3) */
export const EVENT_MAP: Record<string, string | null> = {
	onload: "onload",
	onScroll: "onScroll",
	onMouseDown: "onMouseDown",
	onClick: "onClick",
	onInput: "onInput",
	onKeyDown: "onKeyDown",
	onKeyUp: "onKeyUp",
	onFocus: "onFocus",
	onBlur: "onBlur",
	onChange: "onChange",
	onSave: "onSave",
	onSetToolbarButtons: null, // removed
	showInline: null, // removed
	showController: null, // removed
	imageUploadHandler: "image.uploadHandler",
	onImageUploadBefore: "onImageUploadBefore",
	onImageUpload: "onImageLoad",
	onImageUploadError: "onImageUploadError",
	onVideoUploadBefore: "onVideoUploadBefore",
	onVideoUpload: "onVideoLoad",
	onVideoUploadError: "onVideoUploadError",
	onAudioUploadBefore: "onAudioUploadBefore",
	onAudioUpload: "onAudioLoad",
	onAudioUploadError: "onAudioUploadError",
	onDrop: "onDrop",
	onPaste: "onPaste",
	onCopy: "onCopy",
	onCut: "onCut",
};
