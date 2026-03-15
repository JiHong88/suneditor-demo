// npm i suneditor@{{VERSION}}
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editor = suneditor.create("my-editor", {
  plugins,
  value: "{{DEFAULT_VALUE}}",
  buttonList: {{BUTTON_LIST_4}}
});
