// 1. CSS import
import "suneditor/css/contents";

// 2. sun-editor-editable Wrap with class
export default function ContentViewer({ html }) {
  return (
    <div
      className="sun-editor-editable"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}