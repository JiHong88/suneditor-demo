import { PluginCommand } from 'suneditor/src/interfaces';

class MyCommand extends PluginCommand {
  static key = 'myCommand';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Command';
    this.icon = 'bold'; // built-in icon key, or raw SVG/HTML string
  }

  // ── [Required] ──────────────────────────────────────
  /** Executes when the toolbar button is clicked. */
  action() {
    // Insert content, toggle formatting, etc.
    // this.$.html.insert('<p>...</p>');
    // this.$.history.push(false);
  }

  // ── [Optional] Event Hooks ──────────────────────────
  /** Cursor position changed — update toolbar button active state.
   *  Return true if element matches this plugin's target. */
  // active(element, target) {
  //   if (/* element matches */) {
  //     dom.utils.addClass(target, 'active');
  //     return true;
  //   }
  //   dom.utils.removeClass(target, 'active');
  //   return false;
  // }
}
