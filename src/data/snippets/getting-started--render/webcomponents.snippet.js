import "suneditor/css/contents";

// sun-editor-editable Wrap with class
class ContentViewer extends HTMLElement {
  set content(html) {
    this.innerHTML = `
      <div class="sun-editor-editable">
        ${html}
      </div>
    `;
  }
}

customElements.define("content-viewer", ContentViewer);