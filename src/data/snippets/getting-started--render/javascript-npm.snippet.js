// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
const container = document.getElementById("content");
container.innerHTML = `
  <div class="sun-editor-editable">
    ${savedHtml}
  </div>
`;