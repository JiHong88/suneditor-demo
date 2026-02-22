import type { SandpackProviderProps } from "@codesandbox/sandpack-react";
import type { FrameworkKey } from "@/components/common/codeExampleFrameworks";

type SandpackSetup = {
	template: SandpackProviderProps["template"];
	files: SandpackProviderProps["files"];
	customSetup?: SandpackProviderProps["customSetup"];
	activeFile?: string;
};

const SUNEDITOR_CSS_LINKS = `<link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor-contents.css" rel="stylesheet" />`;

const fallbackStep2 = (framework: FrameworkKey): SandpackSetup => ({
	template: "vanilla",
	activeFile: "/index.html",
	files: {
		"/index.js": {
			code: `// no-op entry for vanilla template`,
		},
		"/index.html": {
			code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, sans-serif; padding: 12px; }
      .box { border: 1px solid #d4d4d8; border-radius: 12px; padding: 12px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3>${framework}</h3>
      <p>이 프레임워크는 Step 2에서 정적 코드 예시만 제공합니다.</p>
      <p>실행형 샌드박스는 HTML/JavaScript, React, Vue를 사용해 주세요.</p>
    </div>
  </body>
</html>`,
		},
	},
});

const fallbackStep3 = (framework: FrameworkKey): SandpackSetup => ({
	template: "vanilla",
	activeFile: "/index.html",
	files: {
		"/index.js": {
			code: `// no-op entry for vanilla template`,
		},
		"/index.html": {
			code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font-family: system-ui, sans-serif; padding: 12px; }
      .box { border: 1px solid #d4d4d8; border-radius: 12px; padding: 12px; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3>${framework}</h3>
      <p>이 프레임워크는 Step 3에서 정적 코드 예시만 제공합니다.</p>
      <p>실행형 샌드박스는 HTML/JavaScript, React, Vue를 사용해 주세요.</p>
    </div>
  </body>
</html>`,
		},
	},
});

export function getStepTwoSandpackSetup(framework: FrameworkKey): SandpackSetup {
	if (framework === "javascript-cdn") {
		return {
			template: "vanilla",
			activeFile: "/index.html",
			files: {
				"/index.js": {
					code: `// no-op entry for vanilla template`,
				},
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${SUNEDITOR_CSS_LINKS}
    <script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"></script>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12px; }
      .row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      button { padding: 6px 10px; border-radius: 8px; border: 1px solid #d4d4d8; }
      pre { margin: 0 0 10px; padding: 8px; border-radius: 8px; background: #f4f4f5; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div class="row">
      <button id="get-html">Get HTML</button>
    </div>
    <pre id="output"></pre>
    <textarea id="editor"></textarea>
    <script>
      function mountEditor() {
        const output = document.getElementById("output");
        const getHtmlBtn = document.getElementById("get-html");
        const target = document.getElementById("editor");
        const canCreate = window.SUNEDITOR && typeof window.SUNEDITOR.create === "function";

        if (!output || !getHtmlBtn || !target || !canCreate) {
          if (output) {
            output.textContent = "Editor failed to mount. Check #editor and SUNEDITOR script load.";
          }
          return;
        }

        const editor = window.SUNEDITOR.create(target, {
          value: "<p>Hello SunEditor</p>",
          buttonList: [["undo", "redo"], ["bold", "italic", "underline"]]
        });

        getHtmlBtn.addEventListener("click", () => {
          output.textContent = editor.getContents();
        });
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountEditor, { once: true });
      } else {
        mountEditor();
      }
    </script>
  </body>
</html>`,
				},
			},
		};
	}

	if (framework === "javascript-npm") {
		return {
			template: "vanilla",
			activeFile: "/index.js",
			customSetup: {
				dependencies: {
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${SUNEDITOR_CSS_LINKS}
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12px; }
      .row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
      button { padding: 6px 10px; border-radius: 8px; border: 1px solid #d4d4d8; }
      pre { margin: 0 0 10px; padding: 8px; border-radius: 8px; background: #f4f4f5; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <div class="row">
      <button id="get-html">Get HTML</button>
    </div>
    <pre id="output"></pre>
    <textarea id="editor"></textarea>
    <script src="/index.js" type="module"></script>
  </body>
</html>`,
				},
				"/index.js": {
					code: `import suneditor, { plugins } from "suneditor";

function mountEditor() {
  const output = document.getElementById("output");
  const getHtmlBtn = document.getElementById("get-html");
  const target = document.getElementById("editor");

  if (!output || !getHtmlBtn || !target) {
    return;
  }

  const editor = suneditor.create(target, {
    plugins,
    value: "<p>Hello SunEditor</p>",
    buttonList: [["undo", "redo"], ["bold", "italic", "underline"]]
  });

  getHtmlBtn.addEventListener("click", () => {
    output.textContent = editor.getContents();
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountEditor, { once: true });
} else {
  mountEditor();
}`,
				},
			},
		};
	}

	if (framework === "react") {
		return {
			template: "react",
			activeFile: "/App.js",
			customSetup: {
				dependencies: {
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/public/index.html": {
					code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${SUNEDITOR_CSS_LINKS}
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
				},
				"/App.js": {
					code: `import { useEffect, useRef, useState } from "react";
import suneditor, { plugins } from "suneditor";

export default function App() {
  const textareaRef = useRef(null);
  const instanceRef = useRef(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (!textareaRef.current) {
      return;
    }

    instanceRef.current = suneditor.create(textareaRef.current, {
      plugins,
      value: "<p>Hello SunEditor</p>",
      buttonList: [["undo", "redo"], ["bold", "italic", "underline"]]
    });

    return () => instanceRef.current?.destroy();
  }, []);

  const handleGetHtml = () => {
    setHtml(instanceRef.current?.getContents() ?? "");
  };

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 12 }}>
      <button onClick={handleGetHtml}>Get HTML</button>
      <pre style={{ background: "#f4f4f5", borderRadius: 8, padding: 8, whiteSpace: "pre-wrap" }}>{html}</pre>
      <textarea ref={textareaRef} style={{ visibility: "hidden" }} />
    </main>
  );
}`,
				},
				"/index.js": {
					code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);`,
				},
			},
		};
	}

	if (framework === "vue") {
		return {
			template: "vue",
			activeFile: "/src/App.vue",
			customSetup: {
				dependencies: {
					vue: "^3.4.0",
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${SUNEDITOR_CSS_LINKS}
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
				},
				"/src/main.js": {
					code: `import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");`,
				},
				"/src/App.vue": {
					code: `<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";

const editorEl = ref(null);
const html = ref("");
let instance = null;

onMounted(() => {
  if (!editorEl.value) {
    return;
  }

  instance = suneditor.create(editorEl.value, {
    plugins,
    value: "<p>Hello SunEditor</p>",
    buttonList: [["undo", "redo"], ["bold", "italic", "underline"]]
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});

const handleGetHtml = () => {
  html.value = instance?.getContents() ?? "";
};
</script>

<template>
  <main style="font-family: system-ui, sans-serif; padding: 12px;">
    <button @click="handleGetHtml">Get HTML</button>
    <pre style="background: #f4f4f5; border-radius: 8px; padding: 8px; white-space: pre-wrap;">{{ html }}</pre>
    <textarea ref="editorEl" style="visibility: hidden;" />
  </main>
</template>`,
				},
			},
		};
	}

	return fallbackStep2(framework);
}

export function getStepThreeSandpackSetup(framework: FrameworkKey): SandpackSetup {
	if (framework === "javascript-cdn") {
		return {
			template: "vanilla",
			activeFile: "/index.html",
			files: {
				"/index.js": {
					code: `// no-op entry for vanilla template`,
				},
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${SUNEDITOR_CSS_LINKS}
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12px; }
      pre { margin: 0 0 10px; padding: 8px; border-radius: 8px; background: #f4f4f5; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <pre id="raw"></pre>
    <div id="preview"></div>
    <script>
      function unwrapEditable(html) {
        if (!html.includes("sun-editor-editable")) return html;
        const doc = new DOMParser().parseFromString(html, "text/html");
        const editable = doc.querySelector(".sun-editor-editable");
        return editable ? editable.innerHTML : html;
      }

      function mountSavedHtml() {
        const raw = document.getElementById("raw");
        const preview = document.getElementById("preview");
        const savedHtml = '<div class="sun-editor"><div class="sun-editor-editable"><h2>Saved</h2><p>Content from DB</p></div></div>';

        if (!raw || !preview) {
          return;
        }

        raw.textContent = savedHtml;
        preview.innerHTML = \`
          <div class="sun-editor">
            <div class="sun-editor-editable">\${unwrapEditable(savedHtml)}</div>
          </div>
        \`;
      }

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mountSavedHtml, { once: true });
      } else {
        mountSavedHtml();
      }
    </script>
  </body>
</html>`,
				},
			},
		};
	}

	if (framework === "javascript-npm") {
		return {
			template: "vanilla",
			activeFile: "/index.js",
			customSetup: {
				dependencies: {
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${SUNEDITOR_CSS_LINKS}
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 12px; }
      pre { margin: 0 0 10px; padding: 8px; border-radius: 8px; background: #f4f4f5; white-space: pre-wrap; }
    </style>
  </head>
  <body>
    <pre id="raw"></pre>
    <div id="preview"></div>
    <script src="/index.js" type="module"></script>
  </body>
</html>`,
				},
				"/index.js": {
					code: `function unwrapEditable(html) {
  if (!html.includes("sun-editor-editable")) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const editable = doc.querySelector(".sun-editor-editable");
  return editable ? editable.innerHTML : html;
}

function mountSavedHtml() {
  const raw = document.getElementById("raw");
  const preview = document.getElementById("preview");
  const savedHtml = '<div class="sun-editor"><div class="sun-editor-editable"><h2>Saved</h2><p>Content from DB</p></div></div>';

  if (!raw || !preview) {
    return;
  }

  raw.textContent = savedHtml;
  preview.innerHTML = \`
    <div class="sun-editor">
      <div class="sun-editor-editable">\${unwrapEditable(savedHtml)}</div>
    </div>
  \`;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountSavedHtml, { once: true });
} else {
  mountSavedHtml();
}`,
				},
			},
		};
	}

	if (framework === "react") {
		return {
			template: "react",
			activeFile: "/App.js",
			customSetup: {
				dependencies: {
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/public/index.html": {
					code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${SUNEDITOR_CSS_LINKS}
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
				},
				"/App.js": {
					code: `import { useMemo } from "react";

function unwrapEditable(html) {
  if (!html.includes("sun-editor-editable")) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const editable = doc.querySelector(".sun-editor-editable");
  return editable ? editable.innerHTML : html;
}

export default function App() {
  const savedHtml = '<div class="sun-editor"><div class="sun-editor-editable"><h2>Saved</h2><p>Content from DB</p></div></div>';
  const previewHtml = useMemo(() => unwrapEditable(savedHtml), [savedHtml]);

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 12 }}>
      <pre style={{ background: "#f4f4f5", borderRadius: 8, padding: 8, whiteSpace: "pre-wrap" }}>{savedHtml}</pre>
      <div className="sun-editor">
        <div className="sun-editor-editable" dangerouslySetInnerHTML={{ __html: previewHtml }} />
      </div>
    </main>
  );
}`,
				},
				"/index.js": {
					code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);`,
				},
			},
		};
	}

	if (framework === "vue") {
		return {
			template: "vue",
			activeFile: "/src/App.vue",
			customSetup: {
				dependencies: {
					vue: "^3.4.0",
					suneditor: "^3.0.0-beta.35",
				},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    ${SUNEDITOR_CSS_LINKS}
    <title>Vue App</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`,
				},
				"/src/main.js": {
					code: `import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");`,
				},
				"/src/App.vue": {
					code: `<script setup>
import { computed } from "vue";

const savedHtml = '<div class="sun-editor"><div class="sun-editor-editable"><h2>Saved</h2><p>Content from DB</p></div></div>';

function unwrapEditable(html) {
  if (!html.includes("sun-editor-editable")) return html;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const editable = doc.querySelector(".sun-editor-editable");
  return editable ? editable.innerHTML : html;
}

const previewHtml = computed(() => unwrapEditable(savedHtml));
</script>

<template>
  <main style="font-family: system-ui, sans-serif; padding: 12px;">
    <pre style="background: #f4f4f5; border-radius: 8px; padding: 8px; white-space: pre-wrap;">{{ savedHtml }}</pre>
    <div class="sun-editor">
      <div class="sun-editor-editable" v-html="previewHtml"></div>
    </div>
  </main>
</template>`,
				},
			},
		};
	}

	return fallbackStep3(framework);
}
