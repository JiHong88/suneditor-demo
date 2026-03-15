import { PluginField } from 'suneditor/src/interfaces';

class MyField extends PluginField {
  static key = 'myField';
  static className = ''; // No toolbar button — event-driven only

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    // No this.title or this.icon needed — PluginField has no toolbar button.
    // Tip: use converter.debounce() for high-frequency hooks like onInput.
  }

  // ── [Optional] Event Hooks (pick what you need) ─────
  /** Fires on every text input in the editor. */
  // onInput({ frameContext, event }) {}

  /** Fires on keydown inside the editor. Return false to stop event propagation. */
  // onKeyDown({ frameContext, event, range }) {}

  /** Fires on mouse click inside the editor. */
  // onClick({ frameContext, event, range }) {}

  /** Fires on paste event. */
  // onPaste({ frameContext, event, cleanData }) {}
}
