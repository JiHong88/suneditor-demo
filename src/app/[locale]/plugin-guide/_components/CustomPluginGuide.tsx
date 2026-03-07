"use client";

import { useCallback, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, ChevronRight, Copy, Blocks, Cable, Zap, BookOpen, Layers, Workflow } from "lucide-react";

import CodeBlock from "@/components/common/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ══════════════════════════════════════════════════════
   Code Examples
   ══════════════════════════════════════════════════════ */

const QS_JS = `import { PluginCommand } from 'suneditor/src/interfaces';

class HelloWorld extends PluginCommand {
  static key = 'helloWorld';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
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

const QS_TS = `import { PluginCommand } from 'suneditor/src/interfaces';
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

const QS_REGISTER = `import SUNEDITOR from 'suneditor';
import plugins from 'suneditor/src/plugins';
import HelloWorld from './plugins/helloWorld';

SUNEDITOR.create('editor', {
  plugins: [...plugins, HelloWorld],
  buttonList: [['bold', 'italic', 'helloWorld']],
});`;

const CODE_COMMAND = `import { PluginCommand } from 'suneditor/src/interfaces';
import { dom } from 'suneditor/src/helper';

class ToggleStrikethrough extends PluginCommand {
  static key = 'toggleStrikethrough';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Strikethrough';
    this.icon = 'strikethrough'; // built-in icon key, or raw SVG/HTML
  }

  /**
   * @hook Editor.EventManager
   * @type {SunEditor.Hook.Event.Active}
   */
  active(element, target) {
    if (/^S$/i.test(element?.nodeName)) {
      dom.utils.addClass(target, 'active');
      return true;
    }
    dom.utils.removeClass(target, 'active');
    return false;
  }

  /**
   * @override
   * @type {PluginCommand['action']}
   */
  action() {
    const node = dom.utils.createElement('S');
    this.$.inline.apply(node, { stylesToModify: null, nodesToRemove: null });
  }
}`;

const CODE_DROPDOWN = `import { PluginDropdown } from 'suneditor/src/interfaces';
import { dom } from 'suneditor/src/helper';

/**
 * @typedef {Object} CustomAlignPluginOptions
 * @property {Array.<"right"|"center"|"left"|"justify">} [items] - Align items
 */

class CustomAlign extends PluginDropdown {
  static key = 'customAlign';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   * @param {CustomAlignPluginOptions} pluginOptions
   */
  constructor(kernel, pluginOptions) {
    super(kernel);
    this.title = this.$.lang.align;
    this.icon = 'align_left';

    const menu = dom.utils.createElement('div',
      { class: 'se-dropdown se-list-layer' },
      \`<div class="se-list-inner">
        <ul class="se-list-basic">
          <li><button type="button" class="se-btn se-btn-list" data-command="left">Left</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="center">Center</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="right">Right</button></li>
        </ul>
      </div>\`
    );
    this.$.menu.initDropdownTarget(CustomAlign, menu);
  }

  /**
   * @override
   * @type {PluginDropdown['on']}
   */
  on(target) { /* Called when dropdown opens */ }

  /**
   * @override
   * @type {PluginDropdown['action']}
   */
  action(target) {
    const value = target.getAttribute('data-command');
    if (!value) return;
    const lines = this.$.format.getLines();
    for (const line of lines) {
      dom.utils.setStyle(line, 'textAlign', value);
    }
    this.$.menu.dropdownOff();
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}`;

const CODE_MODAL = `import { PluginModal } from 'suneditor/src/interfaces';
import Modal from 'suneditor/src/modules/contract/Modal';
import { dom } from 'suneditor/src/helper';

class InsertCode extends PluginModal {
  static key = 'insertCode';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Insert Code';
    this.icon = 'code';

    const modalEl = dom.utils.createElement('div', null,
      \`<form>
        <div class="se-modal-header">
          <button type="button" data-command="close" class="se-btn se-modal-close"></button>
          <span class="se-modal-title">Insert Code</span>
        </div>
        <div class="se-modal-body">
          <textarea class="se-input-form" style="height:200px"></textarea>
        </div>
        <div class="se-modal-footer">
          <button type="submit" class="se-btn-primary"><span>Insert</span></button>
        </div>
      </form>\`
    );

    this.modal = new Modal(this, this.$, modalEl);
    this.textarea = modalEl.querySelector('textarea');
  }

  /**
   * @override
   * @type {PluginModal['open']}
   */
  open() { this.modal.open(); }

  /**
   * @hook Modules.Modal
   * @type {SunEditor.Hook.Modal.Action}
   */
  async modalAction() {
    const code = this.textarea.value;
    if (!code) return false;

    const pre = dom.utils.createElement('PRE');
    const codeEl = dom.utils.createElement('CODE');
    codeEl.textContent = code;
    pre.appendChild(codeEl);

    this.$.html.insert(pre.outerHTML);
    this.$.history.push(false);
    return true;
  }

  /**
   * @hook Modules.Modal
   * @type {SunEditor.Hook.Modal.On}
   */
  modalOn(isUpdate) {
    if (!isUpdate) this.textarea.value = '';
    this.textarea.focus();
  }

  /**
   * @hook Modules.Modal
   * @type {SunEditor.Hook.Modal.Off}
   */
  modalOff() { this.textarea.value = ''; }
}`;

const CODE_FIELD = `import { PluginField } from 'suneditor/src/interfaces';
import { converter } from 'suneditor/src/helper';

class HashtagDetector extends PluginField {
  static key = 'hashtagDetector';
  static className = '';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.onInput = converter.debounce(this.onInput.bind(this), 200);
  }

  /**
   * @hook Editor.EventManager
   * @type {SunEditor.Hook.Event.OnInput}
   */
  onInput({ frameContext }) {
    const sel = this.$.selection.get();
    const text = sel.anchorNode?.textContent || '';
    const before = text.substring(0, sel.anchorOffset);
    const match = before.match(/#(\\w+)$/);

    if (match) {
      console.log('Detected hashtag:', match[1]);
    }
  }
}`;

const CODE_DROPDOWN_FREE = `import { PluginDropdownFree } from 'suneditor/src/interfaces';

class CustomPicker extends PluginDropdownFree {
  static key = 'customPicker';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Custom Picker';
    this.icon = 'color';

    const menu = /* build your custom UI */;
    this.$.menu.initDropdownTarget(CustomPicker, menu);

    // Attach your own event listeners
    menu.addEventListener('click', this.#handleClick.bind(this));
  }

  on(target) {
    // Called when dropdown opens
  }

  off() {
    // Called when dropdown closes — cleanup state
  }

  #handleClick(e) {
    // Your own event handling logic
    this.$.menu.dropdownOff();
  }
}`;

const CODE_BROWSER = `import { PluginBrowser } from 'suneditor/src/interfaces';
import Browser from 'suneditor/src/modules/contract/Browser';

class MyGallery extends PluginBrowser {
  static key = 'myGallery';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'My Gallery';
    this.icon = 'image';

    this.browser = new Browser(this, this.$ /* browser config */);
  }

  open(onSelectFunction) {
    this.browser.open(onSelectFunction);
  }

  close() {
    this.browser.close();
  }
}`;

const CODE_INPUT = `import { PluginInput } from 'suneditor/src/interfaces';

class CustomInput extends PluginInput {
  static key = 'customInput';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Custom Input';
  }

  /**
   * @override
   * @type {PluginInput['toolbarInputKeyDown']}
   */
  toolbarInputKeyDown({ target, event }) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const value = target.value;
      // Handle the input value
    }
  }

  /**
   * @override
   * @type {PluginInput['toolbarInputChange']}
   */
  toolbarInputChange({ target, value }) {
    // Handle input blur/change
  }
}`;

const CODE_POPUP = `import { PluginPopup } from 'suneditor/src/interfaces';

class InfoPopup extends PluginPopup {
  static key = 'infoPopup';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Info';
  }

  show() {
    // Display popup UI
  }
}`;

const CODE_CONSTRUCTOR = `/**
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
   * @param {SunEditor.Kernel} kernel - The core instance
   * @param {MyPluginOptions} pluginOptions
   */
  constructor(kernel, pluginOptions) {
    super(kernel); // Required: sets this.$ = kernel.$

    // Plugin metadata (used by toolbar button)
    this.title = this.$.lang.myPlugin || 'My Plugin';
    this.icon = 'myPlugin'; // icon key from this.$.icons, or raw HTML/SVG

    // Optional: toolbar button positioning
    this.beforeItem = null;  // HTMLElement to insert before
    this.afterItem = null;   // HTMLElement to insert after
    this.replaceButton = null; // HTMLElement to replace the default button

    // Plugin members
    this.myState = {};

    // Module instances (if using Modal, Controller, etc.)
    this.modal = new Modal(this, this.$, modalElement);
    this.controller = new Controller(this, this.$, controllerElement, { position: 'bottom' });
  }
}`;

const CODE_EVENT_PRIORITY = `class MyPlugin extends PluginField {
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

const CODE_EXTENDS_VS_IMPLEMENTS = `// ── 1. extends — Plugin Base Type (single inheritance) ──
class MyPlugin extends PluginModal { ... }   // type: 'modal'
class MyCmd extends PluginCommand { ... }    // type: 'command'

// ── 2. implements — Module Contracts ──
class Image extends PluginModal
  implements ModuleModal, ModuleController, EditorComponent { ... }

// ── 3. implements — Cross-Plugin-Type Composition ──
// fontSize: input field + dropdown menu + command buttons
class FontSize extends PluginInput
  implements PluginCommand, PluginDropdown { ... }`;

const CODE_CROSS_PLUGIN_JS = `import { PluginCommand, PluginDropdown, PluginInput } from 'suneditor/src/interfaces';

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

const CODE_CROSS_PLUGIN_TS = `import { interfaces } from 'suneditor';
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

const CODE_MULTI_INTERFACE = `import { interfaces } from 'suneditor';
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

const CODE_EXAMPLE_WORDCOUNT = `import { PluginCommand } from 'suneditor/src/interfaces';

class WordCount extends PluginCommand {
  static key = 'wordCount';

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Word Count';
    this.icon = '<span style="font-size:12px;font-weight:bold">WC</span>';
  }

  /**
   * @override
   * @type {PluginCommand['action']}
   */
  action() {
    const text = this.$.html.get({ format: 'text' });
    const words = text.trim().split(/\\s+/).filter(Boolean).length;
    this.$.ui.showToast(\`Words: \${words}\`, 2000);
  }
}

export default WordCount;`;

const CODE_EXAMPLE_EMBED = `import { interfaces } from 'suneditor';
import type { SunEditor } from 'suneditor/types';
import Modal from 'suneditor/src/modules/contract/Modal';
import Controller from 'suneditor/src/modules/contract/Controller';
import { dom } from 'suneditor/src/helper';

class Embed extends interfaces.PluginModal
  implements interfaces.ModuleModal, interfaces.ModuleController, interfaces.EditorComponent
{
  static key = 'embed';
  _element: HTMLIFrameElement | null = null;
  #isUpdate = false;
  modal: InstanceType<typeof Modal>;
  controller: InstanceType<typeof Controller>;
  urlInput: HTMLInputElement;

  static component(node: Node): Node | null {
    const el = dom.check.isFigure(node) ? (node as HTMLElement).firstElementChild : node;
    return /^IFRAME$/i.test(el?.nodeName ?? '') ? el : null;
  }

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = 'Embed';
    this.icon = 'embed';

    const modalEl = dom.utils.createElement('div', null,
      \`<form>
        <div class="se-modal-header">
          <button type="button" data-command="close" class="se-btn se-modal-close"></button>
          <span class="se-modal-title">Embed URL</span>
        </div>
        <div class="se-modal-body">
          <label>URL</label>
          <input class="se-input-form" type="url" placeholder="https://..." />
        </div>
        <div class="se-modal-footer">
          <button type="submit" class="se-btn-primary"><span>Insert</span></button>
        </div>
      </form>\`
    );

    const controllerEl = dom.utils.createElement('div', { class: 'se-controller' },
      \`<div>
        <button type="button" data-command="edit" class="se-btn" title="Edit">Edit</button>
        <button type="button" data-command="delete" class="se-btn" title="Delete">Delete</button>
      </div>\`
    );

    this.modal = new Modal(this, this.$, modalEl);
    this.controller = new Controller(this, this.$, controllerEl);
    this.urlInput = modalEl.querySelector('input')!;
  }

  // ── PluginModal (base) ──
  open(): void { this.modal.open(); }

  // ── implements ModuleModal ──
  async modalAction(): Promise<boolean> {  // Hook.Modal.Action
    const url = this.urlInput.value.trim();
    if (!url) return false;

    if (this.#isUpdate && this._element) {
      this._element.src = url;
    } else {
      const iframe = dom.utils.createElement('IFRAME', {
        src: url, width: '560', height: '315',
        frameborder: '0', allowfullscreen: 'true',
      }) as HTMLIFrameElement;
      this.$.html.insert(iframe.outerHTML);
    }

    this.$.history.push(false);
    return true;
  }

  modalOn(isUpdate: boolean): void {  // Hook.Modal.On
    this.#isUpdate = isUpdate;
    this.urlInput.value = isUpdate && this._element ? this._element.src : '';
    this.urlInput.focus();
  }

  modalInit(): void { this.controller.close(); }  // Hook.Modal.Init
  modalOff(): void { this.urlInput.value = ''; }   // Hook.Modal.Off

  // ── implements ModuleController ──
  controllerAction(target: HTMLElement): void {  // Hook.Controller.Action
    const command = target.getAttribute('data-command');
    if (command === 'edit') this.modal.open();
    else if (command === 'delete') this.componentDestroy(this._element!);
  }

  // ── implements EditorComponent ──
  componentSelect(target: HTMLElement): void {  // Hook.Component.Select
    this._element = target as HTMLIFrameElement;
    this.controller.open(target, null, { isWWTarget: false });
  }

  componentDeselect(): void { this._element = null; }  // Hook.Component.Deselect

  async componentDestroy(target: HTMLElement): Promise<void> {  // Hook.Component.Destroy
    const container = dom.query.getParentElement(target, dom.check.isFigure) || target;
    dom.utils.removeItem(container);
    this._element = null;
    this.$.focusManager.focusEdge(container.previousElementSibling);
    this.$.history.push(false);
  }
}

export default Embed;`;

const CODE_EXAMPLE_QUICKSTYLE = `import { PluginDropdown } from 'suneditor/src/interfaces';
import { dom } from 'suneditor/src/helper';

class QuickStyle extends PluginDropdown {
  static key = 'quickStyle';

  #styles = [
    { name: 'Note', class: 'note-block', bg: '#e8f5e9' },
    { name: 'Warning', class: 'warning-block', bg: '#fff3e0' },
    { name: 'Info', class: 'info-block', bg: '#e3f2fd' },
  ];

  /**
   * @constructor
   * @param {SunEditor.Kernel} kernel - The core instance
   */
  constructor(kernel) {
    super(kernel);
    this.title = 'Quick Style';
    this.icon = 'blockStyle';

    let html = '';
    for (const style of this.#styles) {
      html += \`<li><button type="button" class="se-btn se-btn-list" data-command="\${style.class}"
        style="background:\${style.bg};padding:4px 8px">\${style.name}</button></li>\`;
    }

    const menu = dom.utils.createElement('div',
      { class: 'se-dropdown se-list-layer' },
      \`<div class="se-list-inner"><ul class="se-list-basic">\${html}</ul></div>\`
    );
    this.$.menu.initDropdownTarget(QuickStyle, menu);
  }

  /**
   * @override
   * @type {PluginDropdown['action']}
   */
  action(target) {
    const className = target.getAttribute('data-command');
    if (!className) return;

    const lines = this.$.format.getLines();
    for (const line of lines) {
      dom.utils.toggleClass(line, className);
    }

    this.$.menu.dropdownOff();
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}

export default QuickStyle;`;

const CODE_REGISTRATION = `import SUNEDITOR from 'suneditor';
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

const CODE_PLUGIN_OPTIONS = `SUNEDITOR.create('editor', {
  plugins: [MyPlugin],
  buttonList: [['myPlugin']],
  myPlugin: {
    maxItems: 10,
    apiUrl: '/api/data',
  },
});
// Options received as: constructor(kernel, pluginOptions)`;

/* ══════════════════════════════════════════════════════
   Plugin Type Data
   ══════════════════════════════════════════════════════ */

type PluginTypeInfo = {
	className: string;
	type: string;
	color: string;
	required: string[];
	uiBehavior: string;
	examples: string;
	code?: string;
};

const PLUGIN_TYPES: PluginTypeInfo[] = [
	{
		className: "PluginCommand",
		type: "command",
		color: "amber",
		required: ["action()"],
		uiBehavior: "Button click executes action immediately",
		examples: "blockquote, list_bulleted",
		code: CODE_COMMAND,
	},
	{
		className: "PluginDropdown",
		type: "dropdown",
		color: "sky",
		required: ["action()"],
		uiBehavior: "Button opens menu, item click calls action()",
		examples: "align, font, blockStyle",
		code: CODE_DROPDOWN,
	},
	{
		className: "PluginDropdownFree",
		type: "dropdown-free",
		color: "indigo",
		required: [],
		uiBehavior: "Button opens menu, plugin handles own events",
		examples: "table, fontColor",
		code: CODE_DROPDOWN_FREE,
	},
	{
		className: "PluginModal",
		type: "modal",
		color: "violet",
		required: ["open()"],
		uiBehavior: "Button opens modal dialog",
		examples: "link, image, video",
		code: CODE_MODAL,
	},
	{
		className: "PluginBrowser",
		type: "browser",
		color: "purple",
		required: ["open()", "close()"],
		uiBehavior: "Button opens gallery/browser interface",
		examples: "imageGallery",
		code: CODE_BROWSER,
	},
	{
		className: "PluginField",
		type: "field",
		color: "rose",
		required: [],
		uiBehavior: "Responds to editor input events",
		examples: "mention",
		code: CODE_FIELD,
	},
	{
		className: "PluginInput",
		type: "input",
		color: "teal",
		required: [],
		uiBehavior: "Toolbar input element (not a button)",
		examples: "fontSize",
		code: CODE_INPUT,
	},
	{
		className: "PluginPopup",
		type: "popup",
		color: "emerald",
		required: ["show()"],
		uiBehavior: "Inline popup context menu",
		examples: "anchor",
		code: CODE_POPUP,
	},
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
	amber: {
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		border: "border-amber-300 dark:border-amber-700",
		dot: "bg-amber-500",
	},
	sky: {
		bg: "bg-sky-500/10",
		text: "text-sky-600 dark:text-sky-400",
		border: "border-sky-300 dark:border-sky-700",
		dot: "bg-sky-500",
	},
	indigo: {
		bg: "bg-indigo-500/10",
		text: "text-indigo-600 dark:text-indigo-400",
		border: "border-indigo-300 dark:border-indigo-700",
		dot: "bg-indigo-500",
	},
	violet: {
		bg: "bg-violet-500/10",
		text: "text-violet-600 dark:text-violet-400",
		border: "border-violet-300 dark:border-violet-700",
		dot: "bg-violet-500",
	},
	purple: {
		bg: "bg-purple-500/10",
		text: "text-purple-600 dark:text-purple-400",
		border: "border-purple-300 dark:border-purple-700",
		dot: "bg-purple-500",
	},
	rose: {
		bg: "bg-rose-500/10",
		text: "text-rose-600 dark:text-rose-400",
		border: "border-rose-300 dark:border-rose-700",
		dot: "bg-rose-500",
	},
	teal: {
		bg: "bg-teal-500/10",
		text: "text-teal-600 dark:text-teal-400",
		border: "border-teal-300 dark:border-teal-700",
		dot: "bg-teal-500",
	},
	emerald: {
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		border: "border-emerald-300 dark:border-emerald-700",
		dot: "bg-emerald-500",
	},
};

/* ══════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════ */

const ACCENT_BORDER: Record<string, string> = {
	slate: "border-s-2 border-s-slate-400/50",
	sky: "border-s-2 border-s-sky-500/50",
	violet: "border-s-2 border-s-violet-500/50",
	amber: "border-s-2 border-s-amber-500/50",
	emerald: "border-s-2 border-s-emerald-500/50",
	rose: "border-s-2 border-s-rose-500/50",
	teal: "border-s-2 border-s-teal-500/50",
};

function RefTable({ headers, rows, accent }: { headers: ReactNode[]; rows: ReactNode[][]; accent?: string }) {
	return (
		<div className={`overflow-x-auto rounded-lg border ${accent ? ACCENT_BORDER[accent] || "" : ""}`}>
			<table className='w-full text-sm'>
				<thead>
					<tr className='bg-muted/60 border-b'>
						{headers.map((h, i) => (
							<th
								key={i}
								className='px-3 py-2.5 text-start font-semibold text-muted-foreground text-[11px] uppercase tracking-wider'
							>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr
							key={i}
							className='border-b last:border-0 hover:bg-muted/30 transition-colors even:bg-muted/10'
						>
							{row.map((cell, j) => (
								<td key={j} className='px-3 py-2.5 align-top'>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function SectionLabel({ children }: { children: ReactNode }) {
	return <h4 className='text-sm font-semibold text-foreground mt-6 mb-3 flex items-center gap-2'>{children}</h4>;
}

function CodePanel({ code, lang = "javascript" }: { code: string; lang?: string }) {
	const [copied, setCopied] = useState(false);

	const handleCopy = useCallback(() => {
		navigator.clipboard.writeText(code).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	}, [code]);

	return (
		<div className='relative group rounded-lg overflow-hidden border text-xs [&_pre]:!p-3'>
			<button
				onClick={handleCopy}
				className='absolute top-2 right-2 z-10 p-1.5 rounded-md bg-background/80 border border-border/50 opacity-0 group-hover:opacity-100 hover:bg-muted transition-all duration-150'
				aria-label='Copy code'
			>
				{copied ? (
					<Check className='h-3.5 w-3.5 text-emerald-500' />
				) : (
					<Copy className='h-3.5 w-3.5 text-muted-foreground' />
				)}
			</button>
			<CodeBlock code={code} lang={lang} />
		</div>
	);
}

function PluginTypeCard({ info, t }: { info: PluginTypeInfo; t: ReturnType<typeof useTranslations> }) {
	const [open, setOpen] = useState(false);
	const c = COLOR_MAP[info.color];

	return (
		<div className={`rounded-lg border ${c.border} overflow-hidden`}>
			<div className='flex items-start gap-3 p-4'>
				<span className={`mt-1 w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
				<div className='flex-1 min-w-0'>
					<div className='flex items-center gap-2 flex-wrap'>
						<code className={`text-sm font-bold ${c.text}`}>{info.className}</code>
						<Badge variant='outline' className='text-[10px] px-1.5 py-0 font-mono'>
							{info.type}
						</Badge>
						{info.required.length > 0 && (
							<span className='text-[10px] text-muted-foreground'>
								{t("required")}: <code className='font-mono'>{info.required.join(", ")}</code>
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>{info.uiBehavior}</p>
					<p className='text-[11px] text-muted-foreground/70 mt-0.5'>
						{t("builtInExamples")}: <span className='font-mono'>{info.examples}</span>
					</p>
				</div>
				{info.code && (
					<button
						onClick={() => setOpen(!open)}
						className='shrink-0 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted'
					>
						{open ? <ChevronDown className='h-3 w-3' /> : <ChevronRight className='h-3 w-3' />}
						{open ? t("hideCode") : t("viewCode")}
					</button>
				)}
			</div>
			{info.code && open && (
				<div className={`border-t ${c.bg} px-4 py-3`}>
					<CodePanel code={info.code} />
				</div>
			)}
		</div>
	);
}

/* ══════════════════════════════════════════════════════
   Tab Contents
   ══════════════════════════════════════════════════════ */

function TypesTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-3'>
			<p className='text-sm text-muted-foreground mb-4'>{t("typesDesc")}</p>
			{PLUGIN_TYPES.map((info) => (
				<PluginTypeCard key={info.className} info={info} t={t} />
			))}
		</div>
	);
}

function AnatomyTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* Static Properties */}
			<div>
				<SectionLabel>{t("staticProps")}</SectionLabel>
				<RefTable
					headers={["Property", "Type", "Required", "Description"]}
					rows={[
						[
							<code key='c0'>key</code>,
							<code key='c1'>string</code>,
							<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
								Yes
							</Badge>,
							"Unique plugin identifier. Must match the name used in buttonList.",
						],
						[
							<code key='c0'>type</code>,
							<code key='c1'>string</code>,
							"Inherited",
							"Set by the base class. Do not override.",
						],
						[
							<code key='c0'>className</code>,
							<code key='c1'>string</code>,
							"No",
							"CSS class added to the plugin's toolbar button.",
						],
						[
							<code key='c0'>options</code>,
							<code key='c1'>object</code>,
							"No",
							"Plugin behavior options (eventIndex, isInputComponent, etc.)",
						],
						[
							<code key='c0'>component(node)</code>,
							<code key='c1'>function</code>,
							"If EditorComponent",
							"Detects component DOM nodes. Returns element or null.",
						],
					]}
				/>
			</div>

			{/* Constructor */}
			<div>
				<SectionLabel>{t("constructor")}</SectionLabel>
				<CodePanel code={CODE_CONSTRUCTOR} />
			</div>

			{/* Dependency Bag */}
			<div>
				<SectionLabel>{t("depsBag")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("depsBagDesc")}</p>

				<div className='space-y-5'>
					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-slate-500' />
							<span className='text-slate-600 dark:text-slate-400'>{t("config")}</span>
						</h5>
						<RefTable
							accent='slate'
							headers={["Property", "Type", "Description"]}
							rows={[
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										options
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Global editor options (shared across all frames)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameOptions
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Current frame's options (width, height, placeholder)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										context
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Global context (toolbar, statusbar, modal overlay elements)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameContext
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"Current frame context (wysiwyg, code, readonly state)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										frameRoots
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										Map
									</code>,
									"All frame contexts keyed by rootKey",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										lang
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										object
									</code>,
									"Language strings (e.g., this.$.lang.image)",
								],
								[
									<code key='c0' className='text-slate-700 dark:text-slate-300 font-semibold'>
										icons
									</code>,
									<code key='c1' className='text-xs text-muted-foreground'>
										object
									</code>,
									"Icon HTML strings (e.g., this.$.icons.bold)",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-sky-500' />
							<span className='text-sky-600 dark:text-sky-400'>{t("domLogic")}</span>
						</h5>
						<RefTable
							accent='sky'
							headers={["Property", "Description"]}
							rows={[
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										selection
									</code>,
									"Selection and range manipulation",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										html
									</code>,
									"HTML get/set, insert, sanitization",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										format
									</code>,
									"Block-level formatting (applyBlock, removeBlock, getLines)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										inline
									</code>,
									"Inline formatting (bold, italic, styles)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										listFormat
									</code>,
									"List operations (create, edit, nested)",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										nodeTransform
									</code>,
									"DOM node transformations",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										char
									</code>,
									"Character counting and limits",
								],
								[
									<code key='c0' className='text-sky-700 dark:text-sky-300 font-semibold'>
										offset
									</code>,
									"Position calculations",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
							<span className='w-2 h-2 rounded-full bg-violet-500' />
							<span className='text-violet-600 dark:text-violet-400'>{t("shellLogic")}</span>
						</h5>
						<RefTable
							accent='violet'
							headers={["Property", "Description"]}
							rows={[
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										component
									</code>,
									"Component lifecycle (select, deselect, setInfo)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										focusManager
									</code>,
									"Focus/blur management",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										pluginManager
									</code>,
									"Plugin registry and lifecycle",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										plugins
									</code>,
									"Plugin instances map (e.g., this.$.plugins.image)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										ui
									</code>,
									"UI state (loading, alerts, toast, theme)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										commandDispatcher
									</code>,
									"Command routing and execution",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										history
									</code>,
									"Undo/redo stack (push, undo, redo)",
								],
								[
									<code key='c0' className='text-violet-700 dark:text-violet-300 font-semibold'>
										shortcuts
									</code>,
									"Keyboard shortcut mapping",
								],
							]}
						/>
					</div>

					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-amber-500' />
								<span className='text-amber-600 dark:text-amber-400'>{t("panelLogic")}</span>
							</h5>
							<RefTable
								accent='amber'
								headers={["Property", "Description"]}
								rows={[
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											toolbar
										</code>,
										"Main toolbar renderer",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											subToolbar
										</code>,
										"Sub-toolbar",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											menu
										</code>,
										"Dropdown menu management",
									],
									[
										<code key='c0' className='text-amber-700 dark:text-amber-300 font-semibold'>
											viewer
										</code>,
										"Code view, fullscreen, preview",
									],
								]}
							/>
						</div>
						<div>
							<h5 className='text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-emerald-500' />
								<span className='text-emerald-600 dark:text-emerald-400'>{t("services")}</span>
							</h5>
							<RefTable
								accent='emerald'
								headers={["Property", "Description"]}
								rows={[
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											eventManager
										</code>,
										"Public event API",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											contextProvider
										</code>,
										"Context Map management",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											optionProvider
										</code>,
										"Options Map management",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											store
										</code>,
										"Central runtime state store",
									],
									[
										<code key='c0' className='text-emerald-700 dark:text-emerald-300 font-semibold'>
											facade
										</code>,
										"The editor public API instance",
									],
								]}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

const CODE_JSDOC_PATTERNS = `// ── @hook + @type — Hook methods called by editor core or modules ──
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

function HooksTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* JSDoc Annotation Patterns */}
			<div>
				<SectionLabel>{t("jsdocPatterns")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("jsdocPatternsDesc")}</p>
				<CodePanel code={CODE_JSDOC_PATTERNS} />
				<div className='mt-3 overflow-x-auto rounded-lg border'>
					<table className='w-full text-xs'>
						<thead>
							<tr className='border-b bg-muted/50'>
								<th className='text-start p-2 font-medium'>Pattern</th>
								<th className='text-start p-2 font-medium'>@hook / @override / @imple</th>
								<th className='text-start p-2 font-medium'>@type Namespace</th>
							</tr>
						</thead>
						<tbody className='divide-y'>
							<tr>
								<td className='p-2'>Event hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.EventManager</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Event.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Core hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.Core</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Core.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Component hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Editor.Component</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Component.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Modal hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Modules.Modal</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Modal.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Controller hooks</td>
								<td className='p-2'>
									<code className='text-[10px]'>@hook Modules.Controller</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										SunEditor.Hook.Controller.*
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Base overrides</td>
								<td className='p-2'>
									<code className='text-[10px]'>@override</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										{"PluginType['method']"}
									</code>
								</td>
							</tr>
							<tr>
								<td className='p-2'>Cross-plugin</td>
								<td className='p-2'>
									<code className='text-[10px]'>@imple PluginType</code>
								</td>
								<td className='p-2'>
									<code className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										{"PluginType['method']"}
									</code>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			{/* Common Hooks */}
			<div>
				<SectionLabel>{t("commonHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("commonHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "When Called", "Return"]}
					rows={[
						[
							<code key='c0'>active(element, target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.Active
							</code>,
							"Cursor position changes",
							<code key='c2'>boolean | undefined</code>,
						],
						[
							<code key='c0'>init()</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.Init
							</code>,
							"Editor init / resetOptions",
							<code key='c2'>void</code>,
						],
						[
							<code key='c0'>retainFormat()</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.RetainFormat
							</code>,
							"HTML cleaning/validation",
							<code key='c2'>{"{query, method}"}</code>,
						],
						[
							<code key='c0'>shortcut(params)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.Shortcut
							</code>,
							"Shortcut triggered",
							<code key='c2'>void</code>,
						],
						[
							<code key='c0'>setDir(dir)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Core.SetDir
							</code>,
							"RTL/LTR change",
							<code key='c2'>void</code>,
						],
					]}
				/>
			</div>

			{/* Event Hooks */}
			<div>
				<SectionLabel>{t("eventHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("eventHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "Interruptible", "Params"]}
					rows={[
						[
							<code key='c0'>onKeyDown</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnKeyDown
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.KeyEvent
							</code>,
						],
						[
							<code key='c0'>onKeyUp</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnKeyUp
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.KeyEvent
							</code>,
						],
						[
							<code key='c0'>onMouseDown</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnMouseDown
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onClick</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnClick
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onPaste</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnPaste
							</code>,
							<Badge
								key='b'
								className='text-[9px] px-1 py-0 bg-amber-500/20 text-amber-700 dark:text-amber-300 border-0'
							>
								Yes
							</Badge>,
							<code key='c3' className='text-[10px]'>
								HookParams.Paste
							</code>,
						],
						[
							<code key='c0'>onBeforeInput</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnBeforeInput
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.InputWithData
							</code>,
						],
						[
							<code key='c0'>onInput</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnInput
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.InputWithData
							</code>,
						],
						[
							<code key='c0'>onMouseUp</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnMouseUp
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.MouseEvent
							</code>,
						],
						[
							<code key='c0'>onFocus</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnFocus
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FocusBlur
							</code>,
						],
						[
							<code key='c0'>onBlur</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnBlur
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FocusBlur
							</code>,
						],
						[
							<code key='c0'>onScroll</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnScroll
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.Scroll
							</code>,
						],
						[
							<code key='c0'>onFilePasteAndDrop</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Event.OnFilePasteAndDrop
							</code>,
							"No",
							<code key='c2' className='text-[10px]'>
								HookParams.FilePasteDrop
							</code>,
						],
					]}
				/>
				<div className='mt-3'>
					<p className='text-[11px] text-muted-foreground mb-2'>
						Event execution priority can be controlled per-plugin:
					</p>
					<CodePanel code={CODE_EVENT_PRIORITY} />
				</div>
			</div>

			{/* Module Hooks */}
			<div>
				<SectionLabel>{t("moduleHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("moduleHooksDesc")}</p>

				<div className='space-y-4'>
					<div>
						<h5 className='text-xs font-semibold mb-2'>
							<code className='text-violet-600 dark:text-violet-400'>ModuleModal</code>
							<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-2'>
								@implements SunEditor.Hook.Modal
							</code>
						</h5>
						<RefTable
							headers={["Hook", "JSDoc Type", "Required", "When"]}
							rows={[
								[
									<code key='c0'>modalAction()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Action
									</code>,
									<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
										Yes
									</Badge>,
									"Form submit",
								],
								[
									<code key='c0'>modalOn(isUpdate)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.On
									</code>,
									"No",
									"After modal opens",
								],
								[
									<code key='c0'>modalInit()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Init
									</code>,
									"No",
									"Before modal opens/closes",
								],
								[
									<code key='c0'>modalOff(isUpdate)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Off
									</code>,
									"No",
									"After modal closes",
								],
								[
									<code key='c0'>modalResize()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Modal.Resize
									</code>,
									"No",
									"Modal resized",
								],
							]}
						/>
					</div>

					<div>
						<h5 className='text-xs font-semibold mb-2'>
							<code className='text-sky-600 dark:text-sky-400'>ModuleController</code>
							<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-2'>
								@implements SunEditor.Hook.Controller
							</code>
						</h5>
						<RefTable
							headers={["Hook", "JSDoc Type", "Required", "When"]}
							rows={[
								[
									<code key='c0'>controllerAction(target)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.Action
									</code>,
									<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
										Yes
									</Badge>,
									"Button clicked",
								],
								[
									<code key='c0'>controllerOn(form, target)</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.On
									</code>,
									"No",
									"After controller opens",
								],
								[
									<code key='c0'>controllerClose()</code>,
									<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
										Hook.Controller.Close
									</code>,
									"No",
									"Before controller closes",
								],
							]}
						/>
					</div>

					<div className='grid sm:grid-cols-2 gap-4'>
						<div>
							<h5 className='text-xs font-semibold mb-2'>
								<code className='text-teal-600 dark:text-teal-400'>ModuleColorPicker</code>
								<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-1'>
									Hook.ColorPicker
								</code>
							</h5>
							<RefTable
								headers={["Hook", "JSDoc Type"]}
								rows={[
									[
										<code key='c0'>colorPickerAction(color)</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.Action
										</code>,
									],
									[
										<code key='c0'>colorPickerHueSliderOpen()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.HueSliderOpen
										</code>,
									],
									[
										<code key='c0'>colorPickerHueSliderClose()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.ColorPicker.HueSliderClose
										</code>,
									],
								]}
							/>
						</div>
						<div>
							<h5 className='text-xs font-semibold mb-2'>
								<code className='text-amber-600 dark:text-amber-400'>ModuleHueSlider</code>
								<code className='text-[10px] text-emerald-600 dark:text-emerald-400 ms-1'>
									Hook.HueSlider
								</code>
							</h5>
							<RefTable
								headers={["Hook", "JSDoc Type"]}
								rows={[
									[
										<code key='c0'>hueSliderAction()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.HueSlider.Action
										</code>,
									],
									[
										<code key='c0'>hueSliderCancelAction()</code>,
										<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
											Hook.HueSlider.CancelAction
										</code>,
									],
								]}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Component Hooks */}
			<div>
				<SectionLabel>{t("componentHooks")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("componentHooksDesc")}</p>
				<RefTable
					headers={["Hook", "JSDoc Type", "Required", "When"]}
					rows={[
						[
							<code key='c0'>componentSelect(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Select
							</code>,
							<Badge key='b' variant='default' className='text-[9px] px-1 py-0'>
								Yes
							</Badge>,
							"Component selected (clicked)",
						],
						[
							<code key='c0'>componentDeselect(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Deselect
							</code>,
							"No",
							"Component deselected",
						],
						[
							<code key='c0'>componentEdit(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Edit
							</code>,
							"No",
							"Edit button clicked",
						],
						[
							<code key='c0'>componentDestroy(target)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Destroy
							</code>,
							"No",
							"Component deleted",
						],
						[
							<code key='c0'>componentCopy(params)</code>,
							<code key='c1' className='text-[10px] text-emerald-600 dark:text-emerald-400'>
								Hook.Component.Copy
							</code>,
							"No",
							"Copy requested",
						],
					]}
				/>
				<div className='mt-3 p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground'>
					<strong className='text-foreground'>Requirements:</strong> Define{" "}
					<code className='bg-muted px-1 rounded'>static component(node)</code> to detect nodes, and a public{" "}
					<code className='bg-muted px-1 rounded'>_element</code> property referencing the current DOM
					element.
				</div>
			</div>
		</div>
	);
}

function ModulesTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-6'>
			{/* extends vs implements */}
			<div>
				<SectionLabel>{t("extendsVsImplements")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("extendsVsImplementsDesc")}</p>
				<div className='grid sm:grid-cols-2 gap-3 mb-5'>
					<div className='p-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'>
						<div className='flex items-center gap-2 mb-2'>
							<code className='text-xs font-bold text-blue-700 dark:text-blue-400'>extends</code>
							<Badge variant='outline' className='text-[9px] px-1.5 py-0'>
								1 per plugin
							</Badge>
						</div>
						<p className='text-[11px] text-muted-foreground leading-relaxed'>{t("extendsExplain")}</p>
						<div className='mt-2 font-mono text-[10px] text-blue-600 dark:text-blue-400 space-y-0.5'>
							<div>PluginCommand, PluginModal,</div>
							<div>PluginDropdown, PluginField, ...</div>
						</div>
					</div>
					<div className='p-3 rounded-lg border bg-violet-50/50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800'>
						<div className='flex items-center gap-2 mb-2'>
							<code className='text-xs font-bold text-violet-700 dark:text-violet-400'>implements</code>
							<Badge variant='outline' className='text-[9px] px-1.5 py-0'>
								multiple
							</Badge>
						</div>
						<p className='text-[11px] text-muted-foreground leading-relaxed'>{t("implementsExplain")}</p>
						<div className='mt-2 font-mono text-[10px] text-violet-600 dark:text-violet-400 space-y-0.5'>
							<div>ModuleModal, EditorComponent,</div>
							<div>fontSize, anchor, ...</div>
						</div>
					</div>
				</div>
				<CodePanel code={CODE_EXTENDS_VS_IMPLEMENTS} lang='typescript' />
			</div>

			{/* Cross-Plugin Composition */}
			<div>
				<SectionLabel>{t("crossPlugin")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("crossPluginDesc")}</p>
				<Tabs defaultValue='js'>
					<TabsList className='h-8 gap-1 mb-2'>
						<TabsTrigger value='js' className='text-xs h-7 px-3'>
							JavaScript
						</TabsTrigger>
						<TabsTrigger value='ts' className='text-xs h-7 px-3'>
							TypeScript
						</TabsTrigger>
					</TabsList>
					<TabsContent value='js' className='m-0'>
						<CodePanel code={CODE_CROSS_PLUGIN_JS} />
					</TabsContent>
					<TabsContent value='ts' className='m-0'>
						<CodePanel code={CODE_CROSS_PLUGIN_TS} lang='typescript' />
					</TabsContent>
				</Tabs>
				<p className='mt-2 text-[11px] text-muted-foreground italic'>{t("crossPluginNote")}</p>
			</div>

			{/* Available Modules */}
			<div>
				<SectionLabel>{t("modulesRef")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("modulesRefDesc")}</p>
				<RefTable
					headers={["Module", "Import Path", "Constructor", "Purpose"]}
					rows={[
						[
							<code key='c0'>Modal</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Modal
							</code>,
							<code key='c2' className='text-[10px]'>
								new Modal(inst, $, el)
							</code>,
							"Dialog windows",
						],
						[
							<code key='c0'>Controller</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Controller
							</code>,
							<code key='c2' className='text-[10px]'>
								new Controller(inst, $, el, opts?)
							</code>,
							"Floating tooltip controllers",
						],
						[
							<code key='c0'>Figure</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Figure
							</code>,
							<code key='c2' className='text-[10px]'>
								new Figure(inst, $, controls, opts?)
							</code>,
							"Resize/align wrapper",
						],
						[
							<code key='c0'>ColorPicker</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/ColorPicker
							</code>,
							<code key='c2' className='text-[10px]'>
								new ColorPicker(inst, $, ...)
							</code>,
							"Color palette UI",
						],
						[
							<code key='c0'>HueSlider</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/HueSlider
							</code>,
							<code key='c2' className='text-[10px]'>
								new HueSlider(inst, $, ...)
							</code>,
							"HSL color wheel",
						],
						[
							<code key='c0'>Browser</code>,
							<code key='c1' className='text-[11px]'>
								modules/contract/Browser
							</code>,
							<code key='c2' className='text-[10px]'>
								new Browser(inst, $, ...)
							</code>,
							"Gallery/file browser UI",
						],
						[
							<code key='c0'>FileManager</code>,
							<code key='c1' className='text-[11px]'>
								modules/manager/FileManager
							</code>,
							<code key='c2' className='text-[10px]'>
								new FileManager(inst, $, opts)
							</code>,
							"File upload management",
						],
						[
							<code key='c0'>ApiManager</code>,
							<code key='c1' className='text-[11px]'>
								modules/manager/ApiManager
							</code>,
							<code key='c2' className='text-[10px]'>
								new ApiManager(inst, $, ...)
							</code>,
							"XHR/fetch management",
						],
						[
							<code key='c0'>SelectMenu</code>,
							<code key='c1' className='text-[11px]'>
								modules/ui/SelectMenu
							</code>,
							<code key='c2' className='text-[10px]'>
								new SelectMenu(...)
							</code>,
							"Custom dropdown menus",
						],
						[
							<code key='c0'>ModalAnchorEditor</code>,
							<code key='c1' className='text-[11px]'>
								modules/ui/ModalAnchorEditor
							</code>,
							<code key='c2' className='text-[10px]'>
								new ModalAnchorEditor($, modal, opts)
							</code>,
							"Link/anchor form",
						],
					]}
				/>
				<div className='mt-3 p-3 rounded-lg bg-muted/30 border text-xs text-muted-foreground'>
					<strong className='text-foreground'>Constructor pattern:</strong> All contract modules receive{" "}
					<code className='bg-muted px-1 rounded'>inst</code> (plugin instance),{" "}
					<code className='bg-muted px-1 rounded'>$</code> (deps bag), and module-specific parameters.
				</div>
			</div>

			{/* Multi-Interface Pattern */}
			<div>
				<SectionLabel>{t("multiInterface")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("multiInterfaceDesc")}</p>
				<CodePanel code={CODE_MULTI_INTERFACE} lang='typescript' />
				<p className='mt-2 text-[11px] text-muted-foreground italic'>
					In JavaScript, simply implement the methods — no{" "}
					<code className='bg-muted px-1 rounded'>implements</code> keyword needed. The editor calls methods
					by name regardless of declared interfaces.
				</p>
			</div>
		</div>
	);
}

function ExamplesTab({ t }: { t: ReturnType<typeof useTranslations> }) {
	return (
		<div className='space-y-8'>
			<p className='text-sm text-muted-foreground'>{t("examplesDesc")}</p>

			{/* Example 1: Word Count */}
			<div>
				<div className='flex items-center gap-2 mb-2'>
					<h4 className='text-sm font-semibold'>{t("example1Title")}</h4>
					<Badge
						variant='outline'
						className='text-[9px] px-1.5 py-0 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700'
					>
						Command
					</Badge>
				</div>
				<p className='text-xs text-muted-foreground mb-3'>{t("example1Desc")}</p>
				<CodePanel code={CODE_EXAMPLE_WORDCOUNT} />
			</div>

			{/* Example 2: Quick Style Dropdown */}
			<div>
				<div className='flex items-center gap-2 mb-2'>
					<h4 className='text-sm font-semibold'>{t("example2Title")}</h4>
					<Badge
						variant='outline'
						className='text-[9px] px-1.5 py-0 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-700'
					>
						Dropdown
					</Badge>
				</div>
				<p className='text-xs text-muted-foreground mb-3'>{t("example2Desc")}</p>
				<CodePanel code={CODE_EXAMPLE_QUICKSTYLE} />
			</div>

			{/* Example 3: Custom Embed */}
			<div>
				<div className='flex items-center gap-2 mb-2'>
					<h4 className='text-sm font-semibold'>{t("example3Title")}</h4>
					<Badge
						variant='outline'
						className='text-[9px] px-1.5 py-0 text-violet-600 dark:text-violet-400 border-violet-300 dark:border-violet-700'
					>
						Modal + Controller + Component
					</Badge>
				</div>
				<p className='text-xs text-muted-foreground mb-3'>{t("example3Desc")}</p>
				<CodePanel code={CODE_EXAMPLE_EMBED} lang='typescript' />
			</div>

			{/* Registration */}
			<div>
				<SectionLabel>{t("registration")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("registrationDesc")}</p>
				<CodePanel code={CODE_REGISTRATION} />

				<div className='mt-4'>
					<h5 className='text-xs font-semibold text-muted-foreground mb-2'>{t("pluginOptions")}</h5>
					<p className='text-[11px] text-muted-foreground mb-2'>{t("pluginOptionsDesc")}</p>
					<CodePanel code={CODE_PLUGIN_OPTIONS} />
				</div>

				<div className='mt-4'>
					<h5 className='text-xs font-semibold text-muted-foreground mb-2'>{t("registrationRules")}</h5>
					<ol className='space-y-1.5 text-xs text-muted-foreground list-decimal list-inside'>
						<li>{t("rule1")}</li>
						<li>
							<code className='bg-muted px-1 rounded'>static key</code> {t("rule2")}
						</li>
						<li>{t("rule3")}</li>
					</ol>
				</div>
			</div>

			{/* Built-in Reference */}
			<div>
				<SectionLabel>{t("builtInRef")}</SectionLabel>
				<p className='text-xs text-muted-foreground mb-3'>{t("builtInRefDesc")}</p>
				<RefTable
					headers={["Plugin", "Type", "Complexity", "File"]}
					rows={[
						[
							<code key='c0'>blockquote</code>,
							"Command",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/command/blockquote.js
							</code>,
						],
						[
							<code key='c0'>align</code>,
							"Dropdown",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/dropdown/align.js
							</code>,
						],
						[
							<code key='c0'>font</code>,
							"Dropdown",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/dropdown/font.js
							</code>,
						],
						[
							<code key='c0'>link</code>,
							"Modal + Controller",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/modal/link.js
							</code>,
						],
						[
							<code key='c0'>image</code>,
							"Modal + Component + FileManager",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-red-600 dark:text-red-400'
							>
								Complex
							</Badge>,
							<code key='c2' className='text-[11px]'>
								plugins/modal/image/index.js
							</code>,
						],
						[
							<code key='c0'>table</code>,
							"DropdownFree + Component + Controller",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-red-600 dark:text-red-400'
							>
								Complex
							</Badge>,
							<code key='c2' className='text-[11px]'>
								plugins/dropdown/table/index.js
							</code>,
						],
						[
							<code key='c0'>mention</code>,
							"Field",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-amber-600 dark:text-amber-400'
							>
								Medium
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/field/mention.js
							</code>,
						],
						[
							<code key='c0'>fontSize</code>,
							"Input",
							<Badge
								key='b'
								variant='outline'
								className='text-[9px] px-1 py-0 text-green-600 dark:text-green-400'
							>
								Simple
							</Badge>,
							<code key='c1' className='text-[11px]'>
								plugins/input/fontSize.js
							</code>,
						],
					]}
				/>
			</div>
		</div>
	);
}

/* ══════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════ */

const TAB_ICONS: Record<string, ReactNode> = {
	types: <Blocks className='h-3.5 w-3.5' />,
	anatomy: <Layers className='h-3.5 w-3.5' />,
	hooks: <Cable className='h-3.5 w-3.5' />,
	modules: <Workflow className='h-3.5 w-3.5' />,
	examples: <BookOpen className='h-3.5 w-3.5' />,
};

export default function CustomPluginGuide() {
	const t = useTranslations("PluginGuide.custom");
	const [refTab, setRefTab] = useState("types");
	const [qsLang, setQsLang] = useState("js");

	return (
		<div className='space-y-10'>
			{/* ── Title ── */}
			<div>
				<h2 className='text-2xl font-semibold mb-2'>{t("title")}</h2>
				<p className='text-sm text-muted-foreground'>{t("desc")}</p>
			</div>

			{/* ── Architecture + Key Principles ── */}
			<div className='space-y-4'>
				{/* Inheritance chain */}
				<div className='rounded-lg border bg-muted/20 p-4'>
					<h4 className='text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3'>
						{t("inheritanceChain")}
					</h4>
					<div className='flex items-center gap-2 flex-wrap font-mono text-sm'>
						<span className='px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'>
							KernelInjector
						</span>
						<span className='text-muted-foreground'>→</span>
						<span className='px-2.5 py-1 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'>
							Base
						</span>
						<span className='text-muted-foreground'>→</span>
						<span className='px-2.5 py-1 rounded-md bg-primary/10 text-primary border border-primary/20'>
							PluginCommand / PluginModal / PluginDropdown / ...
						</span>
					</div>
				</div>

				{/* 3 Principles */}
				<div className='grid sm:grid-cols-3 gap-3'>
					{(["classRefs", "depInjection", "contracts"] as const).map((key) => (
						<Card key={key} className='bg-card/60'>
							<CardContent className='p-4'>
								<div className='flex items-center gap-2 mb-1.5'>
									<Zap className='h-3.5 w-3.5 text-primary' />
									<span className='text-xs font-semibold'>{t(key)}</span>
								</div>
								<p className='text-[11px] text-muted-foreground leading-relaxed'>{t(`${key}Desc`)}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* ── Quick Start ── */}
			<div>
				<h3 className='text-lg font-semibold mb-3'>{t("quickStart")}</h3>
				<Card>
					<CardContent className='p-0'>
						<Tabs value={qsLang} onValueChange={setQsLang}>
							<div className='border-b px-4 pt-3'>
								<TabsList className='h-8 gap-1'>
									<TabsTrigger value='js' className='text-xs h-7 px-3'>
										JavaScript
									</TabsTrigger>
									<TabsTrigger value='ts' className='text-xs h-7 px-3'>
										TypeScript
									</TabsTrigger>
									<TabsTrigger value='register' className='text-xs h-7 px-3'>
										{t("register")}
									</TabsTrigger>
								</TabsList>
							</div>
							<TabsContent value='js' className='m-0 p-4'>
								<CodePanel code={QS_JS} lang='javascript' />
							</TabsContent>
							<TabsContent value='ts' className='m-0 p-4'>
								<CodePanel code={QS_TS} lang='typescript' />
							</TabsContent>
							<TabsContent value='register' className='m-0 p-4'>
								<CodePanel code={QS_REGISTER} lang='javascript' />
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>

			{/* ── Reference Tabs ── */}
			<div>
				<Tabs value={refTab} onValueChange={setRefTab}>
					<TabsList className='flex flex-wrap h-auto gap-1 mb-4'>
						{(["types", "anatomy", "hooks", "modules", "examples"] as const).map((key) => (
							<TabsTrigger key={key} value={key} className='text-xs gap-1.5'>
								{TAB_ICONS[key]}
								{t(`tabs.${key}`)}
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value='types'>
						<TypesTab t={t} />
					</TabsContent>
					<TabsContent value='anatomy'>
						<AnatomyTab t={t} />
					</TabsContent>
					<TabsContent value='hooks'>
						<HooksTab t={t} />
					</TabsContent>
					<TabsContent value='modules'>
						<ModulesTab t={t} />
					</TabsContent>
					<TabsContent value='examples'>
						<ExamplesTab t={t} />
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
