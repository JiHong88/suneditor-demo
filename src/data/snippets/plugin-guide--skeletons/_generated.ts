/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/plugin-guide--skeletons/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */

export const SKELETON_BROWSER = `import { PluginBrowser } from 'suneditor/src/interfaces';
import Browser from 'suneditor/src/modules/contract/Browser';

class MyBrowser extends PluginBrowser {
  static key = 'myBrowser';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Browser';
    this.icon = 'image';

    this.browser = new Browser(this, this.$, {
      title: 'Browse Items',
      data: [],                // Static data array, or use url: '...' for server fetch
      columnSize: 4,           // Items per row
      useSearch: true,         // Enable search bar
      selectorHandler: this.#onSelect.bind(this), // Item click handler
      drawItemHandler: (item) => {
        // Return HTML string for each item cell
        // data-command attribute is required for Browser's click handler
        return '<div class="se-file-item-img" data-command="...">...</div>';
      },
    });
  }

  // ── [Required] ──────────────────────────────────────
  /** Opens the browser/gallery panel.
   *  @param {Function} onSelectfunction — Callback passed by the editor to handle selected items. */
  open(onSelectfunction) {
    this.onSelectfunction = onSelectfunction;
    this.browser.open();
  }

  /** Closes the browser/gallery panel. */
  close() {
    this.browser.close();
  }

  // ── [Optional] ──────────────────────────────────────
  /** Called when the browser initializes or closes. */
  // browserInit() {}

  #onSelect(target) {
    // Handle the selected item
    // this.$.html.insert('...');
    // this.$.history.push(false);
  }
}`;

export const SKELETON_COMMAND = `import { PluginCommand } from 'suneditor/src/interfaces';

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
}`;

export const SKELETON_DROPDOWN_FREE = `import { PluginDropdownFree } from 'suneditor/src/interfaces';
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
}`;

export const SKELETON_DROPDOWN = `import { PluginDropdown } from 'suneditor/src/interfaces';
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
      \`<div class="se-list-inner">
        <ul class="se-list-basic">
          <li><button type="button" class="se-btn se-btn-list" data-command="optionA">Option A</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="optionB">Option B</button></li>
        </ul>
      </div>\`
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
}`;

export const SKELETON_FIELD = `import { PluginField } from 'suneditor/src/interfaces';

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
}`;

export const SKELETON_INPUT = `import { PluginInput } from 'suneditor/src/interfaces';

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
}`;

export const SKELETON_MODAL = `import { PluginModal } from 'suneditor/src/interfaces';
import Modal from 'suneditor/src/modules/contract/Modal';
import { dom } from 'suneditor/src/helper';

class MyModal extends PluginModal {
  static key = 'myModal';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Modal';
    this.icon = 'image';

    // Root element must have class "se-modal-content"
    // Structure: se-modal-content > form > header / body / footer
    const modalEl = dom.utils.createElement('div', { class: 'se-modal-content' },
      \`<form>
        <div class="se-modal-header">
          <button type="button" data-command="close" class="se-btn se-close-btn"
            aria-label="Close">\${this.$.icons.cancel}</button>
          <span class="se-modal-title">My Modal</span>
        </div>
        <div class="se-modal-body">
          <div class="se-modal-form">
            <label>Input</label>
            <input class="se-input-form" type="text" data-focus />
          </div>
        </div>
        <div class="se-modal-footer">
          <button type="submit" class="se-btn-primary"><span>Submit</span></button>
        </div>
      </form>\`
    );

    this.modal = new Modal(this, this.$, modalEl);
  }

  // ── [Required] ──────────────────────────────────────
  /** Opens the modal dialog. */
  open() {
    this.modal.open();
  }

  // ── [Required] implements ModuleModal ───────────────
  /** Form submit handler.
   *  Return true → close modal + loading
   *  Return false → close loading only (validation failed)
   *  Return undefined → close modal only */
  async modalAction() {
    // Validate input, insert content, etc.
    // this.$.html.insert('...');
    // this.$.history.push(false);
    // return true;
  }

  // ── [Optional] Modal Lifecycle ──────────────────────
  /** Called after the modal opens. isUpdate = true when editing existing content. */
  // modalOn(isUpdate) {}

  /** Called before modal opens or closes. Good for resetting controller state. */
  // modalInit() {}

  /** Called after the modal closes. Good for clearing input fields. */
  // modalOff() {}
}`;

export const SKELETON_POPUP = `import { PluginPopup } from 'suneditor/src/interfaces';
import Controller from 'suneditor/src/modules/contract/Controller';
import { dom } from 'suneditor/src/helper';

class MyPopup extends PluginPopup {
  static key = 'myPopup';

  /** @param {SunEditor.Kernel} kernel */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Popup';
    this.icon = 'link';

    // Build a floating controller panel (se-controller > se-arrow + content)
    const el = dom.utils.createElement('DIV',
      { class: 'se-controller se-controller-my-popup' },
      \`<div class="se-arrow se-arrow-up"></div>
      <div class="link-content">
        <div class="se-controller-display"></div>
        <div class="se-btn-group">
          <button type="button" data-command="edit" tabindex="-1"
            class="se-btn se-tooltip">\${this.$.icons.edit}</button>
          <button type="button" data-command="close" tabindex="-1"
            class="se-btn se-tooltip">\${this.$.icons.cancel}</button>
        </div>
      </div>\`
    );
    this.controller = new Controller(this, this.$, el,
      { position: 'bottom', disabled: true }, MyPopup.key);
  }

  // ── [Required] ──────────────────────────────────────
  /** Shows the popup at the current cursor/selection position. */
  show() {
    // const node = this.$.selection.getNode();
    // this.controller.open(node);
  }

  // ── [Required] implements ModuleController ──────────
  /** Handles clicks on controller buttons (data-command). */
  controllerAction(target) {
    // const cmd = target.getAttribute('data-command');
    // if (cmd === 'edit') { /* open edit mode */ }
    // if (cmd === 'close') this.controller.close();
  }

  // ── [Optional] Controller Lifecycle ─────────────────
  /** Called after the controller opens. */
  // controllerOn(form, target) {}

  /** Called before the controller closes. */
  // controllerClose() {}
}`;
