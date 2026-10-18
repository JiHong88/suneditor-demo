/**
 * Plugin option key prefixes (`image_uploadUrl` → plugin "image", option "uploadUrl").
 * Used by the Options page (grouping) and scripts/lib/build-search-index.mjs (site search) — keep this file import-free
 * so the Node script can load it directly.
 */
export const OPTION_PLUGIN_PREFIXES = [
	{ prefix: "align_", label: "Align", name: "align" },
	{ prefix: "audio_", label: "Audio", name: "audio" },
	{ prefix: "audioGallery_", label: "AudioGallery", name: "audioGallery" },
	{ prefix: "backgroundColor_", label: "BackgroundColor", name: "backgroundColor" },
	{ prefix: "blockStyle_", label: "BlockStyle", name: "blockStyle" },
	{ prefix: "drawing_", label: "Drawing", name: "drawing" },
	{ prefix: "embed_", label: "Embed", name: "embed" },
	{ prefix: "exportPDF_", label: "ExportPDF", name: "exportPDF" },
	{ prefix: "fileBrowser_", label: "FileBrowser", name: "fileBrowser" },
	{ prefix: "fileGallery_", label: "FileGallery", name: "fileGallery" },
	{ prefix: "fileUpload_", label: "FileUpload", name: "fileUpload" },
	{ prefix: "font_", label: "Font", name: "font" },
	{ prefix: "fontColor_", label: "FontColor", name: "fontColor" },
	{ prefix: "fontSize_", label: "FontSize", name: "fontSize" },
	{ prefix: "hR_", label: "HR", name: "hR" },
	{ prefix: "hr_", label: "HR", name: "hr" },
	{ prefix: "image_", label: "Image", name: "image" },
	{ prefix: "imageGallery_", label: "ImageGallery", name: "imageGallery" },
	{ prefix: "layout_", label: "Layout", name: "layout" },
	{ prefix: "lineHeight_", label: "LineHeight", name: "lineHeight" },
	{ prefix: "link_", label: "Link", name: "link" },
	{ prefix: "math_", label: "Math", name: "math" },
	{ prefix: "autocomplete_", label: "Autocomplete", name: "autocomplete" },
	{ prefix: "paragraphStyle_", label: "ParagraphStyle", name: "paragraphStyle" },
	{ prefix: "table_", label: "Table", name: "table" },
	{ prefix: "template_", label: "Template", name: "template" },
	{ prefix: "textStyle_", label: "TextStyle", name: "textStyle" },
	{ prefix: "video_", label: "Video", name: "video" },
	{ prefix: "videoGallery_", label: "VideoGallery", name: "videoGallery" },
];
