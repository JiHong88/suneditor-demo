"use client";

import { interfaces, modules } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Browser } = modules.contract;

const EMOJI_DATA = [
	{ src: "😀", name: "grinning", tag: ["face"] },
	{ src: "😂", name: "joy", tag: ["face"] },
	{ src: "😍", name: "heart_eyes", tag: ["face", "love"] },
	{ src: "🤔", name: "thinking", tag: ["face"] },
	{ src: "😎", name: "sunglasses", tag: ["face"] },
	{ src: "🥳", name: "party_face", tag: ["face"] },
	{ src: "👍", name: "thumbsup", tag: ["hand"] },
	{ src: "👏", name: "clap", tag: ["hand"] },
	{ src: "🤝", name: "handshake", tag: ["hand"] },
	{ src: "✌️", name: "peace", tag: ["hand"] },
	{ src: "🎉", name: "tada", tag: ["object"] },
	{ src: "🔥", name: "fire", tag: ["object"] },
	{ src: "✨", name: "sparkles", tag: ["object"] },
	{ src: "💡", name: "bulb", tag: ["object"] },
	{ src: "❤️", name: "heart", tag: ["love"] },
	{ src: "💖", name: "sparkling_heart", tag: ["love"] },
	{ src: "💯", name: "hundred", tag: ["object"] },
	{ src: "🚀", name: "rocket", tag: ["object"] },
	{ src: "⭐", name: "star", tag: ["object"] },
	{ src: "🌈", name: "rainbow", tag: ["object"] },
];

/**
 * @class
 * @description PluginBrowser — Opens a gallery/browser interface.
 * Pattern: imageGallery, videoGallery, fileBrowser
 */
class EmojiPicker extends interfaces.PluginBrowser {
	static key = "emojiPicker";
	browser: InstanceType<typeof Browser>;

	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
		this.title = "Emoji";
		this.icon = '<span style="font-size:16px">😀</span>';

		this.browser = new Browser(this, this.$, {
			title: "Pick an Emoji",
			data: EMOJI_DATA,       // Static data — no server URL needed
			useSearch: false,
			columnSize: 6,
			selectorHandler: this.#onSelect.bind(this) as (target: Node) => void,
			drawItemHandler: (item) => {
				// data-command is required for Browser's click handler (getCommandTarget)
				return `<div class="se-file-item-img" data-command="${(item as any).src}" data-name="${(item as any).name}" style="font-size:28px;text-align:center;cursor:pointer;padding:8px" title="${(item as any).name}">${(item as any).src}</div>`;
			},
		});
	}

	/** @override — Required: open the browser */
	open(): void { this.browser.open(); }

	/** @override — Required: close the browser */
	close(): void { this.browser.close(); }

	#onSelect(target: HTMLElement): void {
		const emoji = target.getAttribute("data-command") || target.textContent?.trim();
		if (emoji) {
			this.$.html.insert(emoji);
			this.$.history.push(false);
		}
	}
}

export default EmojiPicker;
