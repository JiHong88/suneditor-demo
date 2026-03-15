import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

const STYLES = [
  { name: "Note", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  { name: "Warning", bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
  { name: "Info", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
];

/**
 * @class
 * @description PluginDropdown — Button opens a menu, item click calls action().
 * Pattern: align, font, blockStyle, lineHeight
 */
class CalloutBlock extends interfaces.PluginDropdown {
  static key = "calloutBlock";

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Callout Block";
    this.icon = "blockquote";

    // se-dropdown > se-list-inner > se-list-basic > se-btn-list (suneditor standard)
    let html = "";
    for (const s of STYLES) {
      html += `<li><button type="button" class="se-btn se-btn-list" data-command="${s.name}"
        style="background:${s.bg};color:${s.color};padding:4px 8px;border-left:3px solid ${s.border}">${s.name}</button></li>`;
    }

    const menu = dom.utils.createElement("div",
      { class: "se-dropdown se-list-layer" },
      `<div class="se-list-inner"><ul class="se-list-basic">${html}</ul></div>`
    );
    this.$.menu.initDropdownTarget(CalloutBlock, menu);
  }

  /** @override — Highlight current style in dropdown when opened */
  on(): void {
    const bq = dom.query.getParentElement(this.$.selection.getNode(), "BLOCKQUOTE") as HTMLElement | null;
    const current = bq?.getAttribute("data-style") || "";
    const buttons = (this.$.menu.targetMap as Record<string, HTMLElement>)[CalloutBlock.key]?.querySelectorAll(".se-btn-list");
    buttons?.forEach((btn) => {
      const name = btn.getAttribute("data-command") || "";
      if (name === current) {
        (btn as HTMLElement).style.outline = "2px solid currentColor";
        (btn as HTMLElement).style.outlineOffset = "-2px";
      } else {
        (btn as HTMLElement).style.outline = "";
      }
    });
  }

  /** @override @type {PluginDropdown['action']} — Required: clicked item handler */
  action(target: HTMLElement): void {
    const name = target.getAttribute("data-command");
    if (!name) return;

    const style = STYLES.find((s) => s.name === name);
    if (!style) return;

    const existing = dom.query.getParentElement(this.$.selection.getNode(), "BLOCKQUOTE") as HTMLElement | null;

    if (existing && existing.getAttribute("data-style") === name) {
      // Same style clicked → remove blockquote
      this.$.format.removeBlock(existing, {
        selectedFormats: undefined, newBlockElement: undefined,
        shouldDelete: false, skipHistory: false,
      });
    } else if (existing) {
      // Different style → update in place
      existing.style.background = style.bg;
      existing.style.color = style.color;
      existing.style.borderLeft = `3px solid ${style.border}`;
      existing.setAttribute("data-style", name);
    } else {
      // No blockquote → apply new
      const bq = dom.utils.createElement("BLOCKQUOTE", {
        style: `background:${style.bg};color:${style.color};border-left:3px solid ${style.border};padding:8px 12px;border-radius:4px;margin:4px 0`,
        "data-style": name,
      }) as HTMLElement;
      this.$.format.applyBlock(bq);
    }

    this.$.menu.dropdownOff();
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}

export default CalloutBlock;
