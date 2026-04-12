"use client";

import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { converter } = helper;

/**
 * @class
 * @description PluginField — Responds to editor input events. No toolbar button.
 * Pattern: autocomplete
 */
class HashtagHighlight extends interfaces.PluginField {
	static key = "hashtagHighlight";
	static className = "";

	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
		// Debounce onInput to avoid excessive calls
		this.onInput = converter.debounce(this.onInput.bind(this), 300);
	}

	/** @hook Event.OnInput — Fires on every editor input */
	onInput(): void {
		const sel = this.$.selection.get();
		const text = sel.anchorNode?.textContent || "";
		const before = text.substring(0, sel.anchorOffset);
		const match = before.match(/#(\w+)$/);

		if (match) {
			this.$.ui.showToast(`Hashtag: #${match[1]}`, 2000);
		}
	}
}

export default HashtagHighlight;
