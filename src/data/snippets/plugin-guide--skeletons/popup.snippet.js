import { PluginPopup } from 'suneditor/src/interfaces';
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
      `<div class="se-arrow se-arrow-up"></div>
      <div class="link-content">
        <div class="se-controller-display"></div>
        <div class="se-btn-group">
          <button type="button" data-command="edit" tabindex="-1"
            class="se-btn se-tooltip">${this.$.icons.edit}</button>
          <button type="button" data-command="close" tabindex="-1"
            class="se-btn se-tooltip">${this.$.icons.cancel}</button>
        </div>
      </div>`
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
}
