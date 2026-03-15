/**
 * @fileoverview 플러그인 가이드 페이지의 코드 스니펫 상수
 *
 * 사용처:
 * - plugin-guide 페이지 > CustomPluginGuide.tsx 컴포넌트
 *
 * 구성:
 * ── Quick Start 탭 ──
 *   QS_JS          → "Quick Start" 카드 > JS 탭 (HelloWorld 플러그인 JavaScript 버전)
 *   QS_TS          → "Quick Start" 카드 > TS 탭 (HelloWorld 플러그인 TypeScript 버전)
 *   QS_REGISTER    → "Quick Start" 카드 > Register 탭 (플러그인 등록 방법)
 *
 * ── Plugin Types 탭 (각 플러그인 타입별 코드보기) ──
 *   CODE_COMMAND       → PluginCommand 타입 카드 > 코드보기 (버튼 클릭 즉시 실행형)
 *   CODE_DROPDOWN      → PluginDropdown 타입 카드 > 코드보기 (드롭다운 메뉴 + action 라우팅)
 *   CODE_MODAL         → PluginModal 타입 카드 > 코드보기 (모달 다이얼로그)
 *   CODE_FIELD          → PluginField 타입 카드 > 코드보기 (이벤트 기반, 툴바 버튼 없음)
 *   CODE_DROPDOWN_FREE → PluginDropdownFree 타입 카드 > 코드보기 (자체 이벤트 처리 드롭다운)
 *   CODE_BROWSER       → PluginBrowser 타입 카드 > 코드보기 (갤러리/브라우저 UI)
 *   CODE_INPUT         → PluginInput 타입 카드 > 코드보기 (툴바 인풋 필드)
 *   CODE_POPUP         → PluginPopup 타입 카드 > 코드보기 (플로팅 컨트롤러 패널)
 *
 * ── Anatomy 탭 (내부 구조 해설) ──
 *   CODE_CONSTRUCTOR           → 생성자 패턴 상세 (kernel, pluginOptions, 메타데이터)
 *   CODE_EVENT_PRIORITY        → 이벤트 우선순위 설정 (eventIndex)
 *   CODE_EXTENDS_VS_IMPLEMENTS → extends vs implements 비교 설명
 *
 * ── Hooks 탭 (크로스 플러그인 합성) ──
 *   CODE_CROSS_PLUGIN_JS  → 크로스 플러그인 합성 JS 예제 (fontSize 패턴)
 *   CODE_CROSS_PLUGIN_TS  → 크로스 플러그인 합성 TS 예제
 *   CODE_MULTI_INTERFACE  → 다중 인터페이스 구현 예제 (Modal + Controller + Component)
 *
 * ── Examples 탭 (등록 방법) ──
 *   CODE_REGISTRATION    → 플러그인 등록 코드 (Array/Object 포맷)
 *   CODE_PLUGIN_OPTIONS  → 플러그인별 옵션 전달 방법
 */

/* ── Quick Start: HelloWorld 플러그인 (JS) ──────────── */
export const QS_JS = `import { PluginCommand } from 'suneditor/src/interfaces';

class HelloWorld extends PluginCommand {
  static key = 'helloWorld';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The Kernel instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Hello World';
    this.icon = '<span style="font-size:14px">HW</span>';
  }

  /**
   * @override
   * @type {PluginCommand['action']}
   */
  action() {
    this.$.html.insert('<p>Hello, World!</p>');
    this.$.history.push(false);
  }
}

export default HelloWorld;`;

/* ── Quick Start: HelloWorld 플러그인 (TS) ──────────── */
export const QS_TS = `import { PluginCommand } from 'suneditor/src/interfaces';
import type { SunEditor } from 'suneditor/types';

class HelloWorld extends PluginCommand {
  static key = 'helloWorld';

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = 'Hello World';
    this.icon = '<span style="font-size:14px">HW</span>';
  }

  action(): void {
    this.$.html.insert('<p>Hello, World!</p>');
    this.$.history.push(false);
  }
}

export default HelloWorld;`;

/* ── Quick Start: 플러그인 등록 방법 ────────────────── */
export const QS_REGISTER = `import SUNEDITOR from 'suneditor';
import plugins from 'suneditor/src/plugins';
import HelloWorld from './plugins/helloWorld';

SUNEDITOR.create('editor', {
  plugins: [...plugins, HelloWorld],
  buttonList: [['bold', 'italic', 'helloWorld']],
});`;

/* ── Types 탭: PluginCommand 스켈레톤 (버튼 클릭 → action 즉시 실행) ── */
export const CODE_COMMAND = `import { PluginCommand } from 'suneditor/src/interfaces';

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

/* ── Types 탭: PluginDropdown 스켈레톤 (드롭다운 메뉴 → action 라우팅) ── */
export const CODE_DROPDOWN = `import { PluginDropdown } from 'suneditor/src/interfaces';
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

/* ── Types 탭: PluginModal 스켈레톤 (모달 다이얼로그) ── */
export const CODE_MODAL = `import { PluginModal } from 'suneditor/src/interfaces';
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

/* ── Types 탭: PluginField 스켈레톤 (이벤트 기반, 툴바 버튼 없음) ── */
export const CODE_FIELD = `import { PluginField } from 'suneditor/src/interfaces';

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

/* ── Types 탭: PluginDropdownFree 스켈레톤 (자체 이벤트 처리 드롭다운) ── */
export const CODE_DROPDOWN_FREE = `import { PluginDropdownFree } from 'suneditor/src/interfaces';
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

/* ── Types 탭: PluginBrowser 스켈레톤 (갤러리/브라우저 UI) ── */
export const CODE_BROWSER = `import { PluginBrowser } from 'suneditor/src/interfaces';
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
  /** Opens the browser/gallery panel. */
  open() {
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

/* ── Types 탭: PluginInput 스켈레톤 (툴바 인풋 필드) ── */
export const CODE_INPUT = `import { PluginInput } from 'suneditor/src/interfaces';

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

/* ── Types 탭: PluginPopup 스켈레톤 (플로팅 컨트롤러 패널) ── */
export const CODE_POPUP = `import { PluginPopup } from 'suneditor/src/interfaces';
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

/* ── Anatomy 탭: 생성자 패턴 상세 (kernel, pluginOptions, 메타데이터 설정) ── */
export const CODE_CONSTRUCTOR = `/**
 * @typedef {Object} MyPluginOptions
 * @property {boolean} [canResize=true] - Whether the element can be resized.
 * @property {string} [defaultWidth="auto"] - The default width.
 */

/**
 * @class
 * @description MyPlugin description.
 */
class MyPlugin extends PluginModal {
  static key = 'myPlugin';
  static className = 'se-btn-my-plugin';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The Kernel instance
   * @param {MyPluginOptions} pluginOptions
   */
  constructor(kernel, pluginOptions) {
    super(kernel); // KernelInjector → this.$ = kernel.$ (Deps bag)

    // Plugin metadata (used by toolbar button)
    this.title = this.$.lang.myPlugin || 'My Plugin';
    this.icon = 'myPlugin'; // icon key from this.$.icons, or raw HTML/SVG

    // Optional: toolbar button content and layout
    this.inner = null; // string (HTML) | HTMLElement | false (hide) | null (use icon)
    this.beforeItem = null; // HTMLElement to insert before the button
    this.afterItem = null; // HTMLElement to insert after the button
    this.replaceButton = null; // HTMLElement to replace the entire default button

    // Plugin members
    this.myState = {};

    // Module instances (if using Modal, Controller, etc.)
    this.modal = new Modal(this, this.$, modalElement);
    this.controller = new Controller(this, this.$, controllerElement, { position: 'bottom' });
  }
}`;

/* ── Anatomy 탭: 이벤트 우선순위 (eventIndex로 실행 순서 제어) ── */
export const CODE_EVENT_PRIORITY = `class MyPlugin extends PluginField {
  static options = {
    eventIndex: 100,           // Default priority (lower = earlier)
    eventIndex_onKeyDown: 50,  // Override: run onKeyDown earlier
    eventIndex_onInput: 200,   // Override: run onInput later
  };

  /**
   * @hook Editor.EventManager
   * @type {SunEditor.Hook.Event.OnKeyDown}
   */
  onKeyDown({ event, range }) {
    if (event.key === 'Tab') {
      event.preventDefault();
      this.$.html.insert('    ');
      return false; // Stop further processing
    }
  }
}`;

/* ── Anatomy 탭: extends vs implements 비교 (상속 vs 인터페이스 구현) ── */
export const CODE_EXTENDS_VS_IMPLEMENTS = `// ── 1. extends — Plugin Base Type (single inheritance) ──
class MyPlugin extends PluginModal { ... }   // type: 'modal'
class MyCmd extends PluginCommand { ... }    // type: 'command'

// ── 2. implements — Module Contracts ──
class Image extends PluginModal
  implements ModuleModal, ModuleController, EditorComponent { ... }

// ── 3. implements — Cross-Plugin-Type Composition ──
// fontSize: input field + dropdown menu + command buttons
class FontSize extends PluginInput
  implements PluginCommand, PluginDropdown { ... }`;

/* ── Hooks 탭: 크로스 플러그인 합성 JS 예제 (fontSize = Input + Command + Dropdown) ── */
export const CODE_CROSS_PLUGIN_JS = `import { PluginCommand, PluginDropdown, PluginInput } from 'suneditor/src/interfaces';

void PluginCommand;
void PluginDropdown;

/**
 * @implements {PluginCommand}
 * @implements {PluginDropdown}
 */
class FontSize extends PluginInput {
  static key = 'fontSize';

  // PluginInput base
  toolbarInputKeyDown(params) { /* handle arrow keys, enter */ }
  toolbarInputChange(params) { /* apply typed value */ }

  /**
   * @imple Command
   * @type {PluginCommand['action']}
   */
  action(target) { /* inc/dec font size */ }

  /**
   * @imple Dropdown
   * @type {PluginDropdown['on']}
   */
  on(target) { /* highlight active size in list */ }
}`;

/* ── Hooks 탭: 크로스 플러그인 합성 TS 예제 ── */
export const CODE_CROSS_PLUGIN_TS = `import { interfaces } from 'suneditor';
import type { SunEditor } from 'suneditor/types';

class FontSize extends interfaces.PluginInput
  implements interfaces.PluginCommand, interfaces.PluginDropdown
{
  static key = 'fontSize';

  toolbarInputKeyDown(params: SunEditor.HookParams.ToolbarInputKeyDown): void { ... }
  toolbarInputChange(params: SunEditor.HookParams.ToolbarInputChange): void { ... }
  action(target: HTMLElement): void { ... }
  on(target: HTMLElement): void { ... }
}`;

/* ── Hooks 탭: 다중 인터페이스 구현 (Modal + Controller + EditorComponent) ── */
export const CODE_MULTI_INTERFACE = `import { interfaces } from 'suneditor';
import type { SunEditor } from 'suneditor/types';
import Modal from 'suneditor/src/modules/contract/Modal';
import Controller from 'suneditor/src/modules/contract/Controller';

class CustomEmbed extends interfaces.PluginModal
  implements
    interfaces.ModuleModal,
    interfaces.ModuleController,
    interfaces.EditorComponent
{
  static key = 'customEmbed';
  _element: HTMLElement | null = null;
  modal: InstanceType<typeof Modal>;
  controller: InstanceType<typeof Controller>;

  static component(node: Node): Node | null {
    return /^IFRAME$/i.test(node?.nodeName) ? node : null;
  }

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = 'Custom Embed';
    this.icon = 'embed';
    const modalEl = /* build modal HTML */;
    const controllerEl = /* build controller HTML */;
    this.modal = new Modal(this, this.$, modalEl);
    this.controller = new Controller(this, this.$, controllerEl);
  }

  // ── PluginModal (base) ──
  open(): void { this.modal.open(); }

  // ── implements ModuleModal ──
  async modalAction(): Promise<boolean> {  // Hook.Modal.Action
    this.$.history.push(false);
    return true;
  }
  modalOn(isUpdate: boolean): void { /* init state */ }  // Hook.Modal.On
  modalOff(): void { /* cleanup */ }                     // Hook.Modal.Off

  // ── implements ModuleController ──
  controllerAction(target: HTMLElement): void {  // Hook.Controller.Action
    const cmd = target.getAttribute('data-command');
    if (cmd === 'edit') this.modal.open();
    if (cmd === 'delete') this.componentDestroy(this._element!);
  }

  // ── implements EditorComponent ──
  componentSelect(target: HTMLElement): void {  // Hook.Component.Select
    this._element = target;
    this.controller.open(target, null, { isWWTarget: false });
  }
  componentDeselect(): void { this._element = null; }  // Hook.Component.Deselect
  async componentDestroy(target: HTMLElement): Promise<void> {  // Hook.Component.Destroy
    target.parentElement?.remove();
    this._element = null;
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}`;
/* ── Examples 탭: 플러그인 등록 (Array/Object 포맷) ── */
export const CODE_REGISTRATION = `import SUNEDITOR from 'suneditor';
import plugins from 'suneditor/src/plugins';
import MyPlugin from './plugins/myPlugin';
import AnotherPlugin from './plugins/anotherPlugin';

// Array format (recommended)
SUNEDITOR.create('editor', {
  plugins: [...plugins, MyPlugin, AnotherPlugin],
  buttonList: [['bold', 'italic', 'myPlugin', 'anotherPlugin']],
});

// Object format
SUNEDITOR.create('editor', {
  plugins: { ...plugins, myPlugin: MyPlugin, anotherPlugin: AnotherPlugin },
  buttonList: [['bold', 'italic', 'myPlugin', 'anotherPlugin']],
});`;

/* ── Examples 탭: 플러그인별 옵션 전달 방법 ── */
export const CODE_PLUGIN_OPTIONS = `SUNEDITOR.create('editor', {
  plugins: [MyPlugin],
  buttonList: [['myPlugin']],
  myPlugin: {
    maxItems: 10,
    apiUrl: '/api/data',
  },
});
// Options received as: constructor(kernel, pluginOptions)`;