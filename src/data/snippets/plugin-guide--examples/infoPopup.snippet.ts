import { interfaces, modules, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Controller } = modules.contract;
const { dom } = helper;

/**
 * @class
 * @description PluginPopup — Shows a floating controller panel at cursor position.
 * Pattern: anchor
 * @implements {interfaces.ModuleController} — Controller button click handler
 */
class InfoPopup extends interfaces.PluginPopup implements interfaces.ModuleController {
  static key = "infoPopup";
  static className = "";

  controller: InstanceType<typeof Controller>;
  #infoDisplay: HTMLElement;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Info";
    this.icon = '<span style="font-size:12px;font-weight:bold">ℹ</span>';

    // se-controller panel — same pattern as anchor plugin
    const controllerEl = dom.utils.createElement("DIV",
      { class: "se-controller se-controller-info" },
      `<div class="se-arrow se-arrow-up"></div>
      <div class="link-content">
        <div class="se-controller-display" style="padding:6px 10px;font-size:12px;max-width:280px;word-break:break-all"></div>
        <div class="se-btn-group">
          <button type="button" data-command="close" tabindex="-1" class="se-btn se-tooltip">
            ${this.$.icons.cancel}
            <span class="se-tooltip-inner"><span class="se-tooltip-text">Close</span></span>
          </button>
        </div>
      </div>`
    );

    this.#infoDisplay = controllerEl.querySelector(".se-controller-display")!;
    this.controller = new Controller(this, this.$, controllerEl, { position: "bottom", disabled: true }, InfoPopup.key);
  }

  /** @override — Required: open the popup at cursor position */
  show(): void {
    const node = this.$.selection.getNode();
    const el = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
    if (!el) return;

    const tag = el.nodeName;
    const cs = getComputedStyle(el);
    const info: string[] = [`&lt;${tag}&gt;`];
    if (parseInt(cs.fontWeight) >= 700) info.push("Bold");
    if (cs.fontStyle === "italic") info.push("Italic");
    if (cs.textDecoration.includes("underline")) info.push("Underline");
    if (cs.fontSize) info.push(`Size: ${cs.fontSize}`);
    if (cs.color) info.push(`Color: ${cs.color}`);

    this.#infoDisplay.innerHTML = info.join(" · ");
    this.controller.open(el);
  }

  /** @hook Controller.Action — Handle controller button clicks */
  controllerAction(target: HTMLElement): void {
    const cmd = target.getAttribute("data-command");
    if (cmd === "close") {
      this.controller.close();
    }
  }
}

export default InfoPopup;
