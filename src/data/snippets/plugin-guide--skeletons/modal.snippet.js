import { PluginModal } from 'suneditor/src/interfaces';
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
      `<form>
        <div class="se-modal-header">
          <button type="button" data-command="close" class="se-btn se-close-btn"
            aria-label="Close">${this.$.icons.cancel}</button>
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
      </form>`
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
}
