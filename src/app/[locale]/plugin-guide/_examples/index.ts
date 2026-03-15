import type { QuickTryEditorConfig } from "@/components/common/QuickTryModal";
import {
	CODE_WORDCOUNT, CODE_CALLOUTBLOCK, CODE_EMBED, CODE_COLORPALETTE,
	CODE_HASHTAG, CODE_ZOOMLEVEL, CODE_EMOJI, CODE_INFOPOPUP, CODE_TEXTSCALE,
} from "@/data/snippets/pluginExampleSnippets";

export type PluginExample = {
	/** Example key / display name */
	key: string;
	/** Plugin type label */
	pluginType: string;
	/** Description */
	desc: string;
	/** The raw source code to display */
	code: string;
	/** Dynamic import for the plugin class (client-only) */
	load: () => Promise<{ default: unknown }>;
	/** Editor config for the quick-try modal */
	editorConfig: QuickTryEditorConfig;
};

/* ── Exports ───────────────────────────────────────── */

export const PLUGIN_EXAMPLES: PluginExample[] = [
	{
		key: "WordCount",
		pluginType: "PluginCommand",
		desc: "Counts words and shows a toast notification.",
		code: CODE_WORDCOUNT,
		load: () => import("./wordCount"),
		editorConfig: {
			demoHtml: "<p>Hello SunEditor! Try clicking the WC button to count words in this text.</p>",
			buttonList: [["wordCount"]],
		},
	},
	{
		key: "CalloutBlock",
		pluginType: "PluginDropdown",
		desc: "Apply Note / Warning / Info callout blocks.",
		code: CODE_CALLOUTBLOCK,
		load: () => import("./calloutBlock"),
		editorConfig: {
			demoHtml: "<p>Select text and apply a callout block style from the dropdown.</p>",
			buttonList: [["calloutBlock"]],
		},
	},
	{
		key: "Embed",
		pluginType: "PluginModal",
		desc: "Insert and manage iframe embeds with modal + controller.",
		code: CODE_EMBED,
		load: () => import("./embed"),
		editorConfig: {
			demoHtml: "<p>Click the embed button to insert an iframe URL.</p>",
			buttonList: [["em"]],
		},
	},
	{
		key: "ColorPalette",
		pluginType: "PluginDropdownFree",
		desc: "Color swatch grid with custom event handling.",
		code: CODE_COLORPALETTE,
		load: () => import("./colorPalette"),
		editorConfig: {
			demoHtml: "<p>Select some text, then pick a color from the palette to apply.</p>",
			buttonList: [["colorPalette"]],
		},
	},
	{
		key: "HashtagHighlight",
		pluginType: "PluginField",
		desc: "Detects #hashtag patterns on input. No toolbar button.",
		code: CODE_HASHTAG,
		load: () => import("./hashtagHighlight"),
		editorConfig: {
			demoHtml: "<p>Type #hello or #suneditor to see hashtag detection in action.</p>",
			buttonList: [["bold", "italic"]],
		},
	},
	{
		key: "ZoomLevel",
		pluginType: "PluginInput",
		desc: "Zoom input field in toolbar. Type 50-200 to scale.",
		code: CODE_ZOOMLEVEL,
		load: () => import("./zoomLevel"),
		editorConfig: {
			demoHtml: "<p>Use the zoom input in the toolbar. Type a value (50-200) and press Enter.</p>",
			buttonList: [["zoomLevel"]],
		},
	},
	{
		key: "EmojiPicker",
		pluginType: "PluginBrowser",
		desc: "Emoji gallery browser using static data.",
		code: CODE_EMOJI,
		load: () => import("./emojiPicker"),
		editorConfig: {
			demoHtml: "<p>Click the emoji button to open the gallery and pick an emoji to insert.</p>",
			buttonList: [["emojiPicker"]],
		},
	},
	{
		key: "InfoPopup",
		pluginType: "PluginPopup",
		desc: "Shows formatting info about current selection.",
		code: CODE_INFOPOPUP,
		load: () => import("./infoPopup"),
		editorConfig: {
			demoHtml: "<p>Place your cursor on <strong>bold</strong> or <em>italic</em> text, then click the info button.</p>",
			buttonList: [["bold", "italic", "underline", "infoPopup"]],
		},
	},
	{
		key: "TextScale",
		pluginType: "Composite (Input + Command + Dropdown)",
		desc: "Cross-plugin composition: Input + Command + Dropdown.",
		code: CODE_TEXTSCALE,
		load: () => import("./textScale"),
		editorConfig: {
			demoHtml: "<p>Try the text scale plugin: type a size in the input, pick from the dropdown, or use the toolbar.</p>",
			buttonList: [["textScale"]],
		},
	},
];
