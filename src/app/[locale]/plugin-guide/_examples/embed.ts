"use client";

import { interfaces, modules, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Modal, Figure } = modules.contract;
const { dom } = helper;

/**
 * @class
 * @description PluginModal — Button opens a modal dialog.
 * Pattern: link, image, video, audio
 * @implements {interfaces.ModuleModal} — Modal lifecycle hooks
 * @implements {interfaces.ModuleController} — Figure handles controllerAction
 * @implements {interfaces.EditorComponent} — Component select/deselect/destroy
 */
class Embed
	extends interfaces.PluginModal
	implements interfaces.ModuleModal, interfaces.ModuleController, interfaces.EditorComponent
{
	static key = "em";
	_element: HTMLIFrameElement | null = null;
	#isUpdate = false;
	modal: InstanceType<typeof Modal>;
	figure: InstanceType<typeof Figure>;
	urlInput: HTMLInputElement;

	/** @hook Editor.Component — Detect IFRAME nodes in editor content */
	static component(node: Node): Node | null {
		const el = dom.check.isFigure(node) ? (node as HTMLElement).firstElementChild : node;
		return /^IFRAME$/i.test(el?.nodeName ?? "") ? el : null;
	}

	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
		this.title = "em";
		this.icon = "embed";

		// se-modal-content > form > header/body/footer — suneditor standard modal structure
		const modalEl = dom.utils.createElement("div", { class: "se-modal-content" },
			`<form>
				<div class="se-modal-header">
					<button type="button" data-command="close" class="se-btn se-close-btn" aria-label="Close">${this.$.icons.cancel}</button>
					<span class="se-modal-title">Embed URL</span>
				</div>
				<div class="se-modal-body">
					<div class="se-modal-form">
						<label>URL</label>
						<input class="se-input-form" type="url" placeholder="https://..." data-focus />
					</div>
				</div>
				<div class="se-modal-footer">
					<button type="submit" class="se-btn-primary"><span>Insert</span></button>
				</div>
			</form>`,
		);

		this.modal = new Modal(this, this.$, modalEl);
		this.urlInput = modalEl.querySelector("input")!;

		// Figure module — handles controller buttons + resize
		// Controls: [group1, group2] — same pattern as built-in embed/video
		const figureControls = [
			["resize_auto,75,50", "align", "edit", "revert", "copy", "remove"],
		];
		this.figure = new Figure(this, this.$, figureControls, { sizeUnit: "px" });
	}

	/** @override — Required: opens the modal */
	open(): void { this.modal.open(); }

	/** @hook Modal.Action — Required: form submit handler */
	async modalAction(): Promise<boolean> {
		const url = this.urlInput.value.trim();
		if (!url) return false;

		if (this.#isUpdate && this._element) {
			this._element.src = url;
		} else {
			const iframe = dom.utils.createElement("IFRAME", {
				src: url, width: "560", height: "315",
				frameborder: "0", allowfullscreen: "true",
			}) as HTMLIFrameElement;
			// Figure.CreateContainer wraps in <div class="se-component"><figure>...</figure></div>
			const figureInfo = Figure.CreateContainer(iframe, "se-embed-container");
			this.$.html.insert(figureInfo.container.outerHTML);
		}
		this.$.history.push(false);
		return true;
	}

	/** @hook Modal.On — After modal opens */
	modalOn(isUpdate: boolean): void {
		this.#isUpdate = isUpdate;
		this.urlInput.value = isUpdate && this._element ? this._element.src : "";
		this.urlInput.focus();
	}

	/** @hook Modal.Init — Before modal opens/closes */
	modalInit(): void { this.figure.controller.close(); }

	/** @hook Modal.Off — After modal closes */
	modalOff(): void { this.urlInput.value = ""; }

	/** @hook Controller.Action — Figure dispatches controller button clicks here */
	controllerAction(target: HTMLElement): void {
		const cmd = target.getAttribute("data-command");
		if (cmd === "edit") this.modal.open();
		else if (cmd === "remove") this.componentDestroy(this._element!);
	}

	/** @hook Component.Select — Component clicked in editor */
	componentSelect(target: HTMLElement): void {
		this._element = target as HTMLIFrameElement;
		this.figure.open(target, {});
	}

	/** @hook Component.Deselect */
	componentDeselect(): void { this._element = null; }

	/** @hook Component.Destroy — Delete the component */
	async componentDestroy(target: HTMLElement): Promise<void> {
		const container = dom.query.getParentElement(target, Figure.is) || target;
		dom.utils.removeItem(container);
		this._element = null;
		this.$.focusManager.focusEdge(container.previousElementSibling);
		this.$.history.push(false);
	}
}

export default Embed;
