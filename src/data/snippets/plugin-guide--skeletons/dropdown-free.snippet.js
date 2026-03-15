import { PluginDropdownFree } from 'suneditor/src/interfaces';
import { dom } from 'suneditor/src/helper';

class MyDropdownFree extends PluginDropdownFree {
  static key = 'myDropdownFree';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My DropdownFree';
    this.icon = 'color';

    // Build your custom dropdown UI (no se-list-basic structure required)
    const menu = dom.utils.createElement('div',
      { class: 'se-dropdown se-list-layer' },
      '<div class="se-list-inner"><!-- your custom UI here --></div>'
    );

    // Unlike PluginDropdown, you handle your own events — no automatic action() routing
    menu.addEventListener('click', this.#handleClick.bind(this));
    this.$.menu.initDropdownTarget(MyDropdownFree, menu);
  }

  // ── No required methods ─────────────────────────────

  // ── [Optional] ──────────────────────────────────────
  /** Called when the dropdown menu opens. */
  // on(target) {}

  /** Called when the dropdown menu closes. */
  // off() {}

  /** Your own event handler. */
  #handleClick(e) {
    // Handle click on your custom UI elements
    // this.$.menu.dropdownOff();
    // this.$.focusManager.focus();
    // this.$.history.push(false);
  }
}
