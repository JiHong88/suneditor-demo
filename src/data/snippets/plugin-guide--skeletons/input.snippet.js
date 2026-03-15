import { PluginInput } from 'suneditor/src/interfaces';

class MyInput extends PluginInput {
  static key = 'myInput';
  static className = 'se-btn-input se-btn-tool-my-input';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Input';
    // this.inner renders as an input element in the toolbar (instead of a button)
    this.inner = '<input type="text" class="se-not-arrow-text" placeholder="Value" />';
  }

  // ── No required methods (all are optional hooks) ────

  // ── [Optional] Toolbar Input Hooks ──────────────────
  /** Fires on keydown inside the toolbar input. */
  // toolbarInputKeyDown({ target, event }) {
  //   if (event.key === 'Enter') {
  //     event.preventDefault();
  //     // Apply the input value...
  //   }
  // }

  /** Fires when the toolbar input value changes (blur/change). */
  // toolbarInputChange({ target, value }) {
  //   // Apply the changed value...
  // }

  /** Cursor position changed — update the input value to reflect current state. */
  // active(element, target) {
  //   const input = target?.parentElement?.querySelector('input');
  //   if (!element) { input.value = ''; return false; }
  //   // Read current value from element and set input.value
  //   return false;
  // }
}
