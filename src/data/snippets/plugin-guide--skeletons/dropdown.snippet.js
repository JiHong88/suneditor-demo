import { PluginDropdown } from 'suneditor/src/interfaces';
import { dom } from 'suneditor/src/helper';

class MyDropdown extends PluginDropdown {
  static key = 'myDropdown';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Dropdown';
    this.icon = 'align_left';

    // Build dropdown menu — must follow se-dropdown > se-list-inner > se-list-basic structure
    const menu = dom.utils.createElement('div',
      { class: 'se-dropdown se-list-layer' },
      `<div class="se-list-inner">
        <ul class="se-list-basic">
          <li><button type="button" class="se-btn se-btn-list" data-command="optionA">Option A</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="optionB">Option B</button></li>
        </ul>
      </div>`
    );
    this.$.menu.initDropdownTarget(MyDropdown, menu);
  }

  // ── [Required] ──────────────────────────────────────
  /** Called when a dropdown menu item is clicked. */
  action(target) {
    // const value = target.getAttribute('data-command');
    // Apply the selected option...
    // this.$.menu.dropdownOff();
    // this.$.focusManager.focus();
    // this.$.history.push(false);
  }

  // ── [Optional] ──────────────────────────────────────
  /** Called when the dropdown menu opens. Use to highlight active item. */
  // on(target) {}

  /** Called when the dropdown menu closes. */
  // off() {}
}
