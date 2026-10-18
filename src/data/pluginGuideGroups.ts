/**
 * Built-in plugins by display type — Plugin Guide page tabs + site search (⌘K).
 * Icons and colors live in the page. Item anchor: `/plugin-guide#plugin-<name>`.
 */
export type PluginGuideEntry = { name: string; configurable?: boolean };

export const PLUGIN_DISPLAY_GROUPS = {
	modal: [
		{ name: "image", configurable: true },
		{ name: "video", configurable: true },
		{ name: "audio", configurable: true },
		{ name: "link" },
		{ name: "embed", configurable: true },
		{ name: "drawing", configurable: true },
		{ name: "math", configurable: true },
	],
	dropdown: [
		{ name: "font" },
		{ name: "blockStyle" },
		{ name: "align" },
		{ name: "fontColor", configurable: true },
		{ name: "backgroundColor", configurable: true },
		{ name: "lineHeight" },
		{ name: "table", configurable: true },
		{ name: "hr" },
		{ name: "list" },
	],
	command: [{ name: "blockquote" }, { name: "list_bulleted" }, { name: "list_numbered" }, { name: "fileUpload" }],
	input: [{ name: "fontSize", configurable: true }, { name: "pageNavigator" }],
	field: [{ name: "autocomplete", configurable: true }],
} satisfies Record<string, PluginGuideEntry[]>;

export type PluginDisplayType = keyof typeof PLUGIN_DISPLAY_GROUPS;

export const PLUGIN_DISPLAY_TYPES = Object.keys(PLUGIN_DISPLAY_GROUPS) as PluginDisplayType[];

export const pluginAnchorId = (name: string) => `plugin-${name}`;

/** `plugin-image` → "modal" (the tab that shows it). */
export function pluginDisplayTypeOf(anchor: string): PluginDisplayType | undefined {
	const name = anchor.replace(/^plugin-/, "");
	if (name === anchor) return undefined;
	return PLUGIN_DISPLAY_TYPES.find((type) => PLUGIN_DISPLAY_GROUPS[type].some((p) => p.name === name));
}
