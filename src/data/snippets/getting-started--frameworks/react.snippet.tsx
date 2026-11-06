// npm i suneditor @suneditor/suneditor-react
import SunEditor from "@suneditor/suneditor-react";
import "suneditor/css/editor";
import "suneditor/css/contents";

export default function Editor() {
  return (
    <SunEditor
      options={(se) => ({
        plugins: se.plugins,
        value: "{{DEFAULT_VALUE}}",
        buttonList: {{BUTTON_LIST_8}}
      })}
    />
  );
}
