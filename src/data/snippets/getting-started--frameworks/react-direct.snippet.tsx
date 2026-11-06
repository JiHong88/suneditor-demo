import { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

export default function Editor() {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const instance = suneditor.create(ref.current!, {
      plugins,
      value: "{{DEFAULT_VALUE}}",
      buttonList: {{BUTTON_LIST_6}}
    });

    return () => instance.destroy();
  }, []);

  return <textarea ref={ref} />;
}
