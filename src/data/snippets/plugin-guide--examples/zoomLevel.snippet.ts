import { interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";

/**
 * @class
 * @description PluginInput — Renders an input element in the toolbar (not a button).
 * Pattern: fontSize, pageNavigator
 */
class ZoomLevel extends interfaces.PluginInput {
  static key = "zoomLevel";
  static className = "se-btn-input se-btn-tool-zoom";
  declare inner: string | HTMLElement | false;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Zoom";
    this.inner = '<input type="text" class="se-not-arrow-text" placeholder="100%" style="width:50px;text-align:center" />';
  }

  /** @override — Toolbar input keydown (Enter to apply) */
  toolbarInputKeyDown(params: SunEditor.HookParams.ToolbarInputKeyDown): void {
    if (params.event.key === "Enter") {
      params.event.preventDefault();
      this.#applyZoom((params.target as HTMLInputElement).value);
    }
  }

  /** @override — Toolbar input blur/change */
  toolbarInputChange(params: SunEditor.HookParams.ToolbarInputChange): void {
    this.#applyZoom(String(params.value));
  }

  #applyZoom(raw: string): void {
    let val = parseInt(raw, 10);
    if (isNaN(val)) val = 100;
    val = Math.max(50, Math.min(200, val));

    const ww = this.$.frameContext.get("wysiwygFrame") as HTMLElement;
    if (ww) {
      ww.style.transform = val === 100 ? "" : `scale(${val / 100})`;
      ww.style.transformOrigin = "top left";
    }
    this.$.ui.showToast(`Zoom: ${val}%`, 1500);
  }
}

export default ZoomLevel;
