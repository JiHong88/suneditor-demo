"use client";

import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

/**
 * @class
 * @description Cross-Plugin Composition — Input + Command + Dropdown in one plugin.
 * Pattern: fontSize (PluginInput + PluginCommand + PluginDropdown)
 * @implements {interfaces.PluginCommand}
 * @implements {interfaces.PluginDropdown}
 */
class TextScale extends interfaces.PluginInput
	implements interfaces.PluginCommand, interfaces.PluginDropdown
{
	static key = "textScale";
	static className = "se-btn-select se-btn-input se-btn-tool-text-scale";
	declare inner: string | HTMLElement | false;

	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
		this.title = "Text Scale";
		this.icon = '<span style="font-size:11px;font-weight:bold">Aa</span>';
		this.inner = '<input type="text" class="se-not-arrow-text" placeholder="16px" style="width:45px;text-align:center" />';

		// Dropdown arrow button — same pattern as list_bulleted
		this.afterItem = dom.utils.createElement("button", {
			class: "se-btn se-tooltip se-sub-arrow-btn",
			"data-command": TextScale.key,
			"data-type": "dropdown",
		}, `${this.$.icons.arrow_down}`) as HTMLElement;

		// se-dropdown > se-list-inner > se-list-basic — suneditor standard
		const menu = dom.utils.createElement("div", { class: "se-dropdown se-list-layer" },
			`<div class="se-list-inner">
				<ul class="se-list-basic">
					<li><button type="button" class="se-btn se-btn-list" data-command="12px" style="font-size:12px">Small (12px)</button></li>
					<li><button type="button" class="se-btn se-btn-list" data-command="16px" style="font-size:16px">Normal (16px)</button></li>
					<li><button type="button" class="se-btn se-btn-list" data-command="20px" style="font-size:20px">Large (20px)</button></li>
					<li><button type="button" class="se-btn se-btn-list" data-command="28px" style="font-size:28px">Huge (28px)</button></li>
				</ul>
			</div>`,
		);
		this.$.menu.initDropdownTarget({ key: TextScale.key, type: "dropdown" }, menu);
	}

	/** @override PluginInput — Toolbar input keydown */
	toolbarInputKeyDown(params: SunEditor.HookParams.ToolbarInputKeyDown): void {
		if (params.event.key === "Enter") {
			params.event.preventDefault();
			this.#applySize((params.target as HTMLInputElement).value);
		}
	}

	/** @override PluginInput — Toolbar input change */
	toolbarInputChange(params: SunEditor.HookParams.ToolbarInputChange): void {
		this.#applySize(String(params.value));
	}

	/** @imple Command — Dropdown item or command button clicked */
	action(target?: HTMLElement): void {
		const cmd = target?.getAttribute("data-command");
		if (cmd) {
			this.#applySize(cmd);
			this.$.menu.dropdownOff();
		}
	}

	/** @hook Event.Active — Called whenever the cursor position changes */
	active(element: HTMLElement | null, target: HTMLElement | null): boolean | undefined {
		if (!target) return false;
		const input = target.parentElement?.querySelector("input") as HTMLInputElement | null;
		if (!input) return false;

		if (!element) {
			input.value = "";
			return false;
		}

		const fontSize = dom.utils.getStyle(element, "fontSize");
		if (fontSize) {
			input.value = fontSize;
			return true;
		}

		return false;
	}

	/** @imple Dropdown — Called when dropdown opens */
	on(target: HTMLElement): void {
		const input = target?.parentElement?.querySelector("input") as HTMLInputElement | null;
		const currentSize = input?.value || "";
		const buttons = (this.$.menu.targetMap as Record<string, HTMLElement>)[TextScale.key]?.querySelectorAll(".se-btn-list");
		buttons?.forEach((btn) => {
			const cmd = btn.getAttribute("data-command") || "";
			if (cmd === currentSize) {
				dom.utils.addClass(btn as HTMLElement, "active");
			} else {
				dom.utils.removeClass(btn as HTMLElement, "active");
			}
		});
	}

	#applySize(raw: string): void {
		let val = parseInt(raw, 10);
		if (isNaN(val)) val = 16;
		val = Math.max(8, Math.min(72, val));

		const span = dom.utils.createElement("SPAN") as HTMLElement;
		span.style.fontSize = `${val}px`;
		(this.$ as any).inline.apply(span, { stylesToModify: ["font-size"], nodesToRemove: null });
		this.$.focusManager.focus();
		this.$.history.push(false);
	}
}

export default TextScale;
