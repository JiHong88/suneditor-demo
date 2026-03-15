import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

class SunEditorElement extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<textarea></textarea>`;

    const textarea = this.querySelector("textarea");
    this.editor = suneditor.create(textarea, {
      plugins,
      value: "{{DEFAULT_VALUE}}",
      buttonList: {{BUTTON_LIST_6}}
    });
  }

  disconnectedCallback() {
    this.editor?.destroy();
  }
}

customElements.define("sun-editor", SunEditorElement);
