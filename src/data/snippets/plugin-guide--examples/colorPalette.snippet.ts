import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

/**
 * @class
 * @description PluginDropdownFree — Plugin handles its own events (no auto action() routing).
 * Pattern: fontColor, backgroundColor, table
 */
class ColorPalette extends interfaces.PluginDropdownFree {
  static key = "colorPalette";

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Color Palette";
    this.icon = "font_color";

    const colors = ["#ff0000", "#ff8800", "#00cc00", "#0088ff", "#8800ff", "#cc0066", "#333333", "#666666", "#999999"];
    let html = "";
    for (const c of colors) {
      html += `<button type="button" class="se-btn" data-color="${c}" style="background:${c};width:22px;height:22px;margin:2px;border-radius:3px;border:1px solid rgba(0,0,0,.15)"></button>`;
    }

    const menu = dom.utils.createElement("div",
      { class: "se-dropdown se-list-layer" },
      `<div class="se-list-inner" style="padding:6px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px">${html}</div></div>`
    );

    // Own event listener — no action() callback from suneditor
    menu.addEventListener("click", this.#handleClick.bind(this));
    this.$.menu.initDropdownTarget(ColorPalette, menu);
  }

  /** @override — Called when dropdown opens */
  on(): void {}

  /** @override — Called when dropdown closes */
  off(): void {}

  #handleClick(e: MouseEvent): void {
    const color = (e.target as HTMLElement).getAttribute("data-color");
    if (!color) return;

    const span = dom.utils.createElement("SPAN") as HTMLElement;
    span.style.color = color;
    this.$.inline.apply(span, { stylesToModify: ["color"], nodesToRemove: null });

    this.$.menu.dropdownOff();
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}

export default ColorPalette;
