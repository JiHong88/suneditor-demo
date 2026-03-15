/**
 * @fileoverview 플러그인 가이드 페이지의 코드 스니펫 상수
 *
 * 사용처:
 * - plugin-guide 페이지 > CustomPluginGuide.tsx 컴포넌트
 *
 * 코드 원본 (IDE 하이라이팅 + 유지보수):
 * - plugin-skeletons/*.snippet.js  → Types 탭 스켈레톤 (CODE_COMMAND ~ CODE_POPUP)
 * - html-structures/*.snippet.html → HTML Structure 탭 (HTML_MODAL ~ HTML_POPUP)
 * 빌드: npm run snippets:generate
 *
 * 나머지 (짧은 스니펫)는 이 파일에 직접 정의
 */

/* ══════════════════════════════════════════════════════
   Quick Start 탭
   ══════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════
   Types 탭 — 스켈레톤 + HTML 구조 (자동 생성 파일에서 re-export)
   ══════════════════════════════════════════════════════ */

export {
	SKELETON_COMMAND as CODE_COMMAND,
	SKELETON_DROPDOWN as CODE_DROPDOWN,
	SKELETON_MODAL as CODE_MODAL,
	SKELETON_FIELD as CODE_FIELD,
	SKELETON_DROPDOWN_FREE as CODE_DROPDOWN_FREE,
	SKELETON_BROWSER as CODE_BROWSER,
	SKELETON_INPUT as CODE_INPUT,
	SKELETON_POPUP as CODE_POPUP,
} from "./plugin-guide--skeletons/_generated";

export {
	HTML_MODAL,
	HTML_DROPDOWN,
	HTML_CONTROLLER,
	HTML_BROWSER,
	HTML_POPUP,
} from "./plugin-guide--html-structures/_generated";

/* ══════════════════════════════════════════════════════
   Types 탭 — Composite (크로스 플러그인 합성) 실제 예시
   ══════════════════════════════════════════════════════ */

/* ── Types 탭: fontSize 합성 예시 (Input + Command + Dropdown) ── */
export const CODE_COMPOSITE_FONTSIZE = `class FontSize extends PluginInput
  implements PluginCommand, PluginDropdown
{
  static key = 'fontSize';
  static className = 'se-btn-select se-btn-input se-btn-tool-font-size';

  constructor(kernel) {
    super(kernel);
    // ... title, icon, inner (input or label)

    // afterItem: dropdown arrow or inc/dec buttons
    this.afterItem = dom.utils.createElement('button',
      { class: 'se-btn se-sub-arrow-btn', 'data-command': FontSize.key, 'data-type': 'dropdown' },
      this.$.icons.arrow_down
    );
    this.$.menu.initDropdownTarget({ key: FontSize.key, type: 'dropdown' }, menu);
  }

  /** @hook — Update input with current cursor's font-size */
  active(element, target) {
    const fontSize = dom.utils.getStyle(element, 'fontSize');
    if (fontSize) {
      this.#setSize(target, fontSize); // set input value
      return true;
    }
    return false;
  }

  /** @override — Input keydown: ArrowUp/Down to inc/dec, Enter to apply */
  toolbarInputKeyDown({ target, event }) { /* ... */ }

  /** @override — Input blur/change: apply size */
  toolbarInputChange({ target, value }) { /* ... */ }

  /** @imple Dropdown — Highlight active size in dropdown */
  on(target) {
    const { value, unit } = this.#getSize(target);
    const currentSize = value + unit;
    for (const btn of this.sizeList) {
      if (currentSize === btn.getAttribute('data-value')) {
        dom.utils.addClass(btn, 'active');
      } else {
        dom.utils.removeClass(btn, 'active');
      }
    }
  }

  /** @imple Command — Handle dropdown item click or inc/dec */
  action(target) {
    const commandValue = target.getAttribute('data-command');
    // inc/dec or apply selected size via inline.apply
  }
}`;

/* ── Types 탭: list_bulleted 합성 예시 (Command + Dropdown) ── */
export const CODE_COMPOSITE_LIST = `class List_bulleted extends PluginCommand
  implements PluginDropdown
{
  static key = 'list_bulleted';

  constructor(kernel) {
    super(kernel);
    // ... title, icon

    // afterItem: dropdown arrow for list style selection
    this.afterItem = dom.utils.createElement('button',
      { class: 'se-btn se-sub-arrow-btn', 'data-command': List_bulleted.key, 'data-type': 'dropdown' },
      this.$.icons.arrow_down
    );
    this.$.menu.initDropdownTarget({ key: List_bulleted.key, type: 'dropdown' }, menu);
  }

  /** @hook — Highlight button when cursor is inside UL */
  active(element, target) {
    if (dom.check.isListCell(element) && /^UL$/i.test(element.parentElement.nodeName)) {
      dom.utils.addClass(target, 'active');
      return true;
    }
    dom.utils.removeClass(target, 'active');
    return false;
  }

  /** @override Command — Toggle list or change list style */
  action(target) {
    const type = target?.querySelector('ul')?.style.listStyleType;
    // toggle list on/off or change style
    this.$.menu.dropdownOff();
  }

  /** @imple Dropdown — Highlight current list style in dropdown */
  on() {
    const el = this.$.format.getBlock(this.$.selection.getNode());
    const currentType = el?.style.listStyleType || 'disc';
    for (const item of this.#listItems) {
      if (item.style.listStyleType === currentType) {
        dom.utils.addClass(item.parentElement, 'active');
      } else {
        dom.utils.removeClass(item.parentElement, 'active');
      }
    }
  }
}`;

/* ══════════════════════════════════════════════════════
   Anatomy 탭
   ══════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════
   Hooks 탭
   ══════════════════════════════════════════════════════ */

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

/* ── Hooks 탭: JSDoc 어노테이션 패턴 예시 (@hook, @override, @imple) ── */
export const CODE_JSDOC_PATTERNS = `// ── @hook + @type — Hook methods called by editor core or modules ──
/**
 * @hook Editor.EventManager
 * @type {SunEditor.Hook.Event.OnKeyDown}
 */
onKeyDown({ event, range }) { ... }

/**
 * @hook Modules.Modal
 * @type {SunEditor.Hook.Modal.Action}
 */
async modalAction() { ... }

// ── @override + @type — Base class method overrides ──
/**
 * @override
 * @type {PluginModal['open']}
 */
open(target) { ... }

// ── @imple + @type — Cross-plugin interface methods ──
/**
 * @imple Command
 * @type {PluginCommand['action']}
 */
action(target) { ... }`;

/* ══════════════════════════════════════════════════════
   Examples 탭
   ══════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════
   기타 — getting-started, 홈 페이지에서 사용
   ══════════════════════════════════════════════════════ */

/* ── getting-started > Step3: 코어 API 스니펫 ── */
export const CORE_API_SNIPPET = `const editor = SunEditor.create('textarea', { /* options */ });

// $ — dependency bag (all internals)
editor.$.selection  // Selection handler
editor.$.format     // Block formatting
editor.$.history    // Undo/Redo stack
// ... and more`;

/* ── 홈 페이지 > InteractiveDemo: 에디터 샘플 콘텐츠 ── */
export const INTERACTIVE_DEMO_VALUE = `<h2>SunEditor v3</h2><p>A lightweight, flexible WYSIWYG editor with zero dependencies.</p><p>Try switching between the <strong>presets</strong> above to see different toolbar modes.</p>`;
