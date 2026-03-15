import { Component, Input } from "@angular/core";
// 1. CSS import (add to angular.json styles)
// "styles": ["node_modules/suneditor/dist/css/suneditor.min.css",
//             "node_modules/suneditor/dist/css/suneditor-contents.min.css"]

// 2. sun-editor-editable Wrap with class
@Component({
  selector: "app-content-viewer",
  template: `
    <div class="sun-editor-editable" [innerHTML]="html"></div>
  `
})
export class ContentViewerComponent {
  @Input() html = "";
}