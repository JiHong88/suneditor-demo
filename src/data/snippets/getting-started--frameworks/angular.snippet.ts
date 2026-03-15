import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";

@Component({
  selector: "app-editor",
  template: `<textarea #editorEl></textarea>`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorEl", { static: true }) editorEl!: ElementRef<HTMLTextAreaElement>;
  private instance: SunEditor.Instance | null = null;

  ngAfterViewInit() {
    this.instance = suneditor.create(this.editorEl.nativeElement, {
      plugins,
      value: "{{DEFAULT_VALUE}}",
      buttonList: {{BUTTON_LIST_6}}
    });
  }

  ngOnDestroy() {
    this.instance?.destroy();
  }
}
