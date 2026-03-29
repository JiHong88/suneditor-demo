/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/plugin-guide--examples/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */

export const PLUGIN_EXAMPLE_CALLOUTBLOCK = `import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

const STYLES = [
  { name: "Note", bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  { name: "Warning", bg: "#fff3e0", color: "#e65100", border: "#ffcc80" },
  { name: "Info", bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
];

/**
 * @class
 * @description PluginDropdown — Button opens a menu, item click calls action().
 * Pattern: align, font, blockStyle, lineHeight
 */
class CalloutBlock extends interfaces.PluginDropdown {
  static key = "calloutBlock";

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Callout Block";
    this.icon = "blockquote";

    // se-dropdown > se-list-inner > se-list-basic > se-btn-list (suneditor standard)
    let html = "";
    for (const s of STYLES) {
      html += \`<li><button type="button" class="se-btn se-btn-list" data-command="\${s.name}"
        style="background:\${s.bg};color:\${s.color};padding:4px 8px;border-left:3px solid \${s.border}">\${s.name}</button></li>\`;
    }

    const menu = dom.utils.createElement("div",
      { class: "se-dropdown se-list-layer" },
      \`<div class="se-list-inner"><ul class="se-list-basic">\${html}</ul></div>\`
    );
    this.$.menu.initDropdownTarget(CalloutBlock, menu);
  }

  /** @override — Highlight current style in dropdown when opened */
  on(): void {
    const bq = dom.query.getParentElement(this.$.selection.getNode(), "BLOCKQUOTE") as HTMLElement | null;
    const current = bq?.getAttribute("data-style") || "";
    const buttons = (this.$.menu.targetMap as Record<string, HTMLElement>)[CalloutBlock.key]?.querySelectorAll(".se-btn-list");
    buttons?.forEach((btn) => {
      const name = btn.getAttribute("data-command") || "";
      if (name === current) {
        (btn as HTMLElement).style.outline = "2px solid currentColor";
        (btn as HTMLElement).style.outlineOffset = "-2px";
      } else {
        (btn as HTMLElement).style.outline = "";
      }
    });
  }

  /** @override @type {PluginDropdown['action']} — Required: clicked item handler */
  action(target: HTMLElement): void {
    const name = target.getAttribute("data-command");
    if (!name) return;

    const style = STYLES.find((s) => s.name === name);
    if (!style) return;

    const existing = dom.query.getParentElement(this.$.selection.getNode(), "BLOCKQUOTE") as HTMLElement | null;

    if (existing && existing.getAttribute("data-style") === name) {
      // Same style clicked → remove blockquote
      this.$.format.removeBlock(existing, {
        selectedFormats: undefined, newBlockElement: undefined,
        shouldDelete: false, skipHistory: false,
      });
    } else if (existing) {
      // Different style → update in place
      existing.style.background = style.bg;
      existing.style.color = style.color;
      existing.style.borderLeft = \`3px solid \${style.border}\`;
      existing.setAttribute("data-style", name);
    } else {
      // No blockquote → apply new
      const bq = dom.utils.createElement("BLOCKQUOTE", {
        style: \`background:\${style.bg};color:\${style.color};border-left:3px solid \${style.border};padding:8px 12px;border-radius:4px;margin:4px 0\`,
        "data-style": name,
      }) as HTMLElement;
      this.$.format.applyBlock(bq);
    }

    this.$.menu.dropdownOff();
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}

export default CalloutBlock;`;

export const PLUGIN_EXAMPLE_COLORPALETTE = `import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

/**
 * @class
 * @description PluginDropdownFree — Plugin handles its own events (no auto action() routing).
 * Pattern: fontColor, backgroundColor, table
 */
class ColorPalette extends interfaces.PluginDropdownFree {
	static key = "colorPalette";

	constructor(kernel: SunEditor.Kernel) {
		super(kernel);
		this.title = "Color Palette";
		this.icon = "font_color";

		const colors = ["#ff0000", "#ff8800", "#00cc00", "#0088ff", "#8800ff", "#cc0066", "#333333", "#666666", "#999999"];
		let html = "";
		for (const c of colors) {
			html += \`<button type="button" class="se-btn" data-color="\${c}" style="background:\${c};width:22px;height:22px;margin:2px;border-radius:3px;border:1px solid rgba(0,0,0,.15)"></button>\`;
		}

		const menu = dom.utils.createElement(
			"div",
			{ class: "se-dropdown se-list-layer" },
			\`<div class="se-list-inner" style="padding:6px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:2px">\${html}</div></div>\`,
		);

		// Own event listener — no action() callback from suneditor
		this.$.eventManager.addEvent(menu, "click", this.#handleClick.bind(this));
		this.$.menu.initDropdownTarget(ColorPalette, menu);
	}

	/** @override — Called when dropdown opens */
	on(): void {}

	/** @override — Called when dropdown closes */
	off(): void {}

	#handleClick(e: MouseEvent): void {
		const color = (e.target as HTMLElement).getAttribute("data-color");
		if (!color) return;

		const span = dom.utils.createElement("SPAN") as HTMLElement;
		span.style.color = color;
		this.$.inline.apply(span, { stylesToModify: ["color"], nodesToRemove: null });

		this.$.menu.dropdownOff();
		this.$.focusManager.focus();
		this.$.history.push(false);
	}
}

export default ColorPalette;`;

export const PLUGIN_EXAMPLE_EMBED = `import { interfaces, modules, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Modal, Figure } = modules.contract;
const { dom } = helper;

/**
 * @class
 * @description PluginModal — Button opens a modal dialog.
 * Pattern: link, image, video, audio
 * @implements {interfaces.ModuleModal} — Modal lifecycle hooks
 * @implements {interfaces.ModuleController} — Figure handles controllerAction
 * @implements {interfaces.EditorComponent} — Component select/deselect/destroy
 */
class Embed extends interfaces.PluginModal
  implements interfaces.ModuleModal, interfaces.ModuleController, interfaces.EditorComponent
{
  static key = "em";
  _element: HTMLIFrameElement | null = null;
  #isUpdate = false;
  modal: InstanceType<typeof Modal>;
  figure: InstanceType<typeof Figure>;
  urlInput: HTMLInputElement;

  /** @hook Editor.Component — Detect IFRAME nodes in editor content */
  static component(node: Node): Node | null {
    const el = dom.check.isFigure(node) ? (node as HTMLElement).firstElementChild : node;
    return /^IFRAME$/i.test(el?.nodeName ?? "") ? el : null;
  }

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "em";
    this.icon = "embed";

    // se-modal-content > form > header/body/footer — suneditor standard modal structure
    const modalEl = dom.utils.createElement("div", { class: "se-modal-content" },
      \`<form>
        <div class="se-modal-header">
          <button type="button" data-command="close" class="se-btn se-close-btn" aria-label="Close">\${this.$.icons.cancel}</button>
          <span class="se-modal-title">Embed URL</span>
        </div>
        <div class="se-modal-body">
          <div class="se-modal-form">
            <label>URL</label>
            <input class="se-input-form" type="url" placeholder="https://..." data-focus />
          </div>
        </div>
        <div class="se-modal-footer">
          <button type="submit" class="se-btn-primary"><span>Insert</span></button>
        </div>
      </form>\`
    );

    this.modal = new Modal(this, this.$, modalEl);
    this.urlInput = modalEl.querySelector("input")!;

    // Figure module — handles controller buttons + resize
    // Controls: [group] — same pattern as built-in embed/video
    const figureControls = [
      ["resize_auto,75,50", "align", "edit", "revert", "copy", "remove"],
    ];
    this.figure = new Figure(this, this.$, figureControls, { sizeUnit: "px" });
  }

  /** @override — Required: opens the modal */
  open(): void { this.modal.open(); }

  /** @hook Modal.Action — Required: form submit handler */
  async modalAction(): Promise<boolean> {
    const url = this.urlInput.value.trim();
    if (!url) return false;

    if (this.#isUpdate && this._element) {
      this._element.src = url;
    } else {
      const iframe = dom.utils.createElement("IFRAME", {
        src: url, width: "560", height: "315",
        frameborder: "0", allowfullscreen: "true",
      }) as HTMLIFrameElement;
      // Figure.CreateContainer wraps in <div class="se-component"><figure>...</figure></div>
      const figureInfo = Figure.CreateContainer(iframe, "se-embed-container");
      this.$.html.insert(figureInfo.container.outerHTML);
    }
    this.$.history.push(false);
    return true;
  }

  /** @hook Modal.On — After modal opens */
  modalOn(isUpdate: boolean): void {
    this.#isUpdate = isUpdate;
    this.urlInput.value = isUpdate && this._element ? this._element.src : "";
    this.urlInput.focus();
  }

  /** @hook Modal.Init — Before modal opens/closes */
  modalInit(): void { this.figure.controller.close(); }

  /** @hook Modal.Off — After modal closes */
  modalOff(): void { this.urlInput.value = ""; }

  /** @hook Controller.Action — Figure dispatches controller button clicks here */
  controllerAction(target: HTMLElement): void {
    const cmd = target.getAttribute("data-command");
    if (cmd === "edit") this.modal.open();
    else if (cmd === "remove") this.componentDestroy(this._element!);
  }

  /** @hook Component.Select — Component clicked in editor */
  componentSelect(target: HTMLElement): void {
    this._element = target as HTMLIFrameElement;
    this.figure.open(target, {});
  }

  /** @hook Component.Deselect */
  componentDeselect(): void { this._element = null; }

  /** @hook Component.Destroy — Delete the component */
  async componentDestroy(target: HTMLElement): Promise<void> {
    const container = dom.query.getParentElement(target, Figure.is) || target;
    dom.utils.removeItem(container);
    this._element = null;
    this.$.focusManager.focusEdge(container.previousElementSibling);
    this.$.history.push(false);
  }
}

export default Embed;`;

export const PLUGIN_EXAMPLE_EMOJIPICKER = `import { interfaces, modules } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Browser } = modules.contract;

const EMOJI_DATA = [
  { src: "😀", name: "grinning", tag: ["face"] },
  { src: "😂", name: "joy", tag: ["face"] },
  { src: "😍", name: "heart_eyes", tag: ["face", "love"] },
  { src: "🤔", name: "thinking", tag: ["face"] },
  { src: "😎", name: "sunglasses", tag: ["face"] },
  { src: "🥳", name: "party_face", tag: ["face"] },
  { src: "👍", name: "thumbsup", tag: ["hand"] },
  { src: "👏", name: "clap", tag: ["hand"] },
  { src: "🤝", name: "handshake", tag: ["hand"] },
  { src: "✌️", name: "peace", tag: ["hand"] },
  { src: "🎉", name: "tada", tag: ["object"] },
  { src: "🔥", name: "fire", tag: ["object"] },
  { src: "✨", name: "sparkles", tag: ["object"] },
  { src: "💡", name: "bulb", tag: ["object"] },
  { src: "❤️", name: "heart", tag: ["love"] },
  { src: "💖", name: "sparkling_heart", tag: ["love"] },
  { src: "💯", name: "hundred", tag: ["object"] },
  { src: "🚀", name: "rocket", tag: ["object"] },
  { src: "⭐", name: "star", tag: ["object"] },
  { src: "🌈", name: "rainbow", tag: ["object"] },
];

/**
 * @class
 * @description PluginBrowser — Opens a gallery/browser interface.
 * Pattern: imageGallery, videoGallery, fileBrowser
 */
class EmojiPicker extends interfaces.PluginBrowser {
  static key = "emojiPicker";
  browser: InstanceType<typeof Browser>;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Emoji";
    this.icon = '<span style="font-size:16px">😀</span>';

    this.browser = new Browser(this, this.$, {
      title: "Pick an Emoji",
      data: EMOJI_DATA,       // Static data — no server URL needed
      useSearch: false,
      columnSize: 6,
      selectorHandler: this.#onSelect.bind(this) as (target: Node) => void,
      drawItemHandler: (item) => {
        // data-command is required for Browser's click handler (getCommandTarget)
        return \`<div class="se-file-item-img" data-command="\${(item as any).src}" data-name="\${(item as any).name}" style="font-size:28px;text-align:center;cursor:pointer;padding:8px" title="\${(item as any).name}">\${(item as any).src}</div>\`;
      },
    });
  }

  /** @override — Required: open the browser */
  open(): void { this.browser.open(); }

  /** @override — Required: close the browser */
  close(): void { this.browser.close(); }

  #onSelect(target: HTMLElement): void {
    const emoji = target.getAttribute("data-command") || target.textContent?.trim();
    if (emoji) {
      this.$.html.insert(emoji);
      this.$.history.push(false);
    }
  }
}

export default EmojiPicker;`;

export const PLUGIN_EXAMPLE_HASHTAGHIGHLIGHT = `import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { converter } = helper;

/**
 * @class
 * @description PluginField — Responds to editor input events. No toolbar button.
 * Pattern: mention
 */
class HashtagHighlight extends interfaces.PluginField {
  static key = "hashtagHighlight";
  static className = "";

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    // Debounce onInput to avoid excessive calls
    this.onInput = converter.debounce(this.onInput.bind(this), 300);
  }

  /** @hook Event.OnInput — Fires on every editor input */
  onInput(): void {
    const sel = this.$.selection.get();
    const text = sel.anchorNode?.textContent || "";
    const before = text.substring(0, sel.anchorOffset);
    const match = before.match(/#(\\w+)$/);

    if (match) {
      this.$.ui.showToast(\`Hashtag: #\${match[1]}\`, 2000);
    }
  }
}

export default HashtagHighlight;`;

export const PLUGIN_EXAMPLE_INFOPOPUP = `import { interfaces, modules, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { Controller } = modules.contract;
const { dom } = helper;

/**
 * @class
 * @description PluginPopup — Shows a floating controller panel at cursor position.
 * Pattern: anchor
 * @implements {interfaces.ModuleController} — Controller button click handler
 */
class InfoPopup extends interfaces.PluginPopup implements interfaces.ModuleController {
  static key = "infoPopup";
  static className = "";

  controller: InstanceType<typeof Controller>;
  #infoDisplay: HTMLElement;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Info";
    this.icon = '<span style="font-size:12px;font-weight:bold">ℹ</span>';

    // se-controller panel — same pattern as anchor plugin
    const controllerEl = dom.utils.createElement("DIV",
      { class: "se-controller se-controller-info" },
      \`<div class="se-arrow se-arrow-up"></div>
      <div class="link-content">
        <div class="se-controller-display" style="padding:6px 10px;font-size:12px;max-width:280px;word-break:break-all"></div>
        <div class="se-btn-group">
          <button type="button" data-command="close" tabindex="-1" class="se-btn se-tooltip">
            \${this.$.icons.cancel}
            <span class="se-tooltip-inner"><span class="se-tooltip-text">Close</span></span>
          </button>
        </div>
      </div>\`
    );

    this.#infoDisplay = controllerEl.querySelector(".se-controller-display")!;
    this.controller = new Controller(this, this.$, controllerEl, { position: "bottom", disabled: true }, InfoPopup.key);
  }

  /** @override — Required: open the popup at cursor position */
  show(): void {
    const node = this.$.selection.getNode();
    const el = node.nodeType === 1 ? (node as HTMLElement) : node.parentElement;
    if (!el) return;

    const tag = el.nodeName;
    const cs = getComputedStyle(el);
    const info: string[] = [\`&lt;\${tag}&gt;\`];
    if (parseInt(cs.fontWeight) >= 700) info.push("Bold");
    if (cs.fontStyle === "italic") info.push("Italic");
    if (cs.textDecoration.includes("underline")) info.push("Underline");
    if (cs.fontSize) info.push(\`Size: \${cs.fontSize}\`);
    if (cs.color) info.push(\`Color: \${cs.color}\`);

    this.#infoDisplay.innerHTML = info.join(" · ");
    this.controller.open(el);
  }

  /** @hook Controller.Action — Handle controller button clicks */
  controllerAction(target: HTMLElement): void {
    const cmd = target.getAttribute("data-command");
    if (cmd === "close") {
      this.controller.close();
    }
  }
}

export default InfoPopup;`;

export const PLUGIN_EXAMPLE_TEXTSCALE = `import { interfaces, helper } from "suneditor";
import type { SunEditor } from "suneditor/types";

const { dom } = helper;

/**
 * @class
 * @description Cross-Plugin Composition — Input + Command + Dropdown in one plugin.
 * Pattern: fontSize (PluginInput + PluginCommand + PluginDropdown)
 * @implements {interfaces.PluginCommand}
 * @implements {interfaces.PluginDropdown}
 */
class TextScale extends interfaces.PluginInput
  implements interfaces.PluginCommand, interfaces.PluginDropdown
{
  static key = "textScale";
  static className = "se-btn-select se-btn-input se-btn-tool-text-scale";
  declare inner: string | HTMLElement | false;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Text Scale";
    this.icon = '<span style="font-size:11px;font-weight:bold">Aa</span>';
    this.inner = '<input type="text" class="se-not-arrow-text" placeholder="16px" style="width:45px;text-align:center" />';

    // Dropdown arrow button — same pattern as list_bulleted
    this.afterItem = dom.utils.createElement("button", {
      class: "se-btn se-tooltip se-sub-arrow-btn",
      "data-command": TextScale.key,
      "data-type": "dropdown",
    }, \`\${this.$.icons.arrow_down}\`) as HTMLElement;

    // se-dropdown > se-list-inner > se-list-basic — suneditor standard
    const menu = dom.utils.createElement("div", { class: "se-dropdown se-list-layer" },
      \`<div class="se-list-inner">
        <ul class="se-list-basic">
          <li><button type="button" class="se-btn se-btn-list" data-command="12px" style="font-size:12px">Small (12px)</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="16px" style="font-size:16px">Normal (16px)</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="20px" style="font-size:20px">Large (20px)</button></li>
          <li><button type="button" class="se-btn se-btn-list" data-command="28px" style="font-size:28px">Huge (28px)</button></li>
        </ul>
      </div>\`
    );
    this.$.menu.initDropdownTarget({ key: TextScale.key, type: "dropdown" }, menu);
  }

  /** @override PluginInput — Toolbar input keydown */
  toolbarInputKeyDown(params: SunEditor.HookParams.ToolbarInputKeyDown): void {
    if (params.event.key === "Enter") {
      params.event.preventDefault();
      this.#applySize((params.target as HTMLInputElement).value);
    }
  }

  /** @override PluginInput — Toolbar input change */
  toolbarInputChange(params: SunEditor.HookParams.ToolbarInputChange): void {
    this.#applySize(String(params.value));
  }

  /** @imple Command — Dropdown item or command button clicked */
  action(target?: HTMLElement): void {
    const cmd = target?.getAttribute("data-command");
    if (cmd) {
      this.#applySize(cmd);
      this.$.menu.dropdownOff();
    }
  }

  /** @hook Event.Active — Called whenever the cursor position changes */
  active(element: HTMLElement | null, target: HTMLElement | null): boolean | undefined {
    if (!target) return false;
    const input = target.parentElement?.querySelector("input") as HTMLInputElement | null;
    if (!input) return false;

    if (!element) {
      input.value = "";
      return false;
    }

    const fontSize = dom.utils.getStyle(element, "fontSize");
    if (fontSize) {
      input.value = fontSize;
      return true;
    }

    return false;
  }

  /** @imple Dropdown — Called when dropdown opens */
  on(target: HTMLElement): void {
    const input = target?.parentElement?.querySelector("input") as HTMLInputElement | null;
    const currentSize = input?.value || "";
    const buttons = (this.$.menu.targetMap as Record<string, HTMLElement>)[TextScale.key]?.querySelectorAll(".se-btn-list");
    buttons?.forEach((btn) => {
      const cmd = btn.getAttribute("data-command") || "";
      if (cmd === currentSize) {
        dom.utils.addClass(btn as HTMLElement, "active");
      } else {
        dom.utils.removeClass(btn as HTMLElement, "active");
      }
    });
  }

  #applySize(raw: string): void {
    let val = parseInt(raw, 10);
    if (isNaN(val)) val = 16;
    val = Math.max(8, Math.min(72, val));

    const span = dom.utils.createElement("SPAN") as HTMLElement;
    span.style.fontSize = \`\${val}px\`;
    this.$.inline.apply(span, { stylesToModify: ["font-size"], nodesToRemove: null });
    this.$.focusManager.focus();
    this.$.history.push(false);
  }
}

export default TextScale;`;

export const PLUGIN_EXAMPLE_WORDCOUNT = `import { interfaces } from "suneditor";
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
    const count = text.trim().split(/\\s+/).filter(Boolean).length;
    this.$.ui.showToast(\`Words: \${count}\`, 2000);
  }
}

export default WordCount;`;

export const PLUGIN_EXAMPLE_ZOOMLEVEL = `import { interfaces } from "suneditor";
import type { SunEditor } from "suneditor/types";

/**
 * @class
 * @description PluginInput — Renders an input element in the toolbar (not a button).
 * Pattern: fontSize, pageNavigator
 */
class ZoomLevel extends interfaces.PluginInput {
  static key = "zoomLevel";
  static className = "se-btn-input se-btn-tool-zoom";
  declare inner: string | HTMLElement | false;

  constructor(kernel: SunEditor.Kernel) {
    super(kernel);
    this.title = "Zoom";
    this.inner = '<input type="text" class="se-not-arrow-text" placeholder="100%" style="width:50px;text-align:center" />';
  }

  /** @override — Toolbar input keydown (Enter to apply) */
  toolbarInputKeyDown(params: SunEditor.HookParams.ToolbarInputKeyDown): void {
    if (params.event.key === "Enter") {
      params.event.preventDefault();
      this.#applyZoom((params.target as HTMLInputElement).value);
    }
  }

  /** @override — Toolbar input blur/change */
  toolbarInputChange(params: SunEditor.HookParams.ToolbarInputChange): void {
    this.#applyZoom(String(params.value));
  }

  #applyZoom(raw: string): void {
    let val = parseInt(raw, 10);
    if (isNaN(val)) val = 100;
    val = Math.max(50, Math.min(200, val));

    const ww = this.$.frameContext.get("wysiwygFrame") as HTMLElement;
    if (ww) {
      ww.style.transform = val === 100 ? "" : \`scale(\${val / 100})\`;
      ww.style.transformOrigin = "top left";
    }
    this.$.ui.showToast(\`Zoom: \${val}%\`, 1500);
  }
}

export default ZoomLevel;`;
