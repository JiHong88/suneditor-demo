import { interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";

/**
 * @class
 * @description PluginCommand — Button click triggers action() immediately.
 * Pattern: blockquote, strike, subscript, superscript
 */
class WordCount extends interfaces.PluginCommand {
  static key = "wordCount";

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Word Count";
    this.icon = '<span style="font-size:12px;font-weight:bold">WC</span>';
  }

  /** @override @type {PluginCommand['action']} — Required: main execution */
  action(): void {
    const text = this.$.html.get({ format: "text" });
    const count = text.trim().split(/\s+/).filter(Boolean).length;
    this.$.ui.showToast(`Words: ${count}`, 2000);
  }
}

export default WordCount;
