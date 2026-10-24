import { CDN_CSS, CDN_CONTENTS_CSS } from "@/store/version";

/* ── Troubleshooting 페이지: 항목별 해결 코드 ── */

export const TS_SSR_NEXT = `// app/editor/EditorLoader.tsx
"use client";

import dynamic from "next/dynamic";

// suneditor reads window on import — keep it out of the server render.
// (Editor.tsx is the client component from the Getting Started React example.)
const Editor = dynamic(() => import("./Editor"), { ssr: false });

export default function EditorLoader() {
  return <Editor />;
}`;

export const TS_CSS = `// npm — import once, e.g. in your app entry or layout
import "suneditor/css/editor";
import "suneditor/css/contents";`;

export const TS_CSS_CDN = `<link href="${CDN_CSS}" rel="stylesheet">`;

export const TS_CONTENTS = `// Display page (no editor needed)
import "suneditor/css/contents";

export default function ContentViewer({ html }) {
  // Sanitize untrusted HTML on the server before it reaches this component.
  return <div className="sun-editor-editable" dangerouslySetInnerHTML={{ __html: html }} />;
}`;

export const TS_CONTENTS_CDN = `<link href="${CDN_CONTENTS_CSS}" rel="stylesheet">
<div class="sun-editor-editable"><!-- saved HTML --></div>`;

export const TS_PLUGIN = `// Every plugin
import suneditor, { plugins } from "suneditor";
suneditor.create(el, { plugins, buttonList: [["bold", "image", "link"]] });

// Or only what the toolbar uses
import { image, link } from "suneditor/plugins";
suneditor.create(el, { plugins: [image, link], buttonList: [["bold", "image", "link"]] });`;

export const TS_TARGET = `// ✗ Runs before <textarea id="editor"> exists
suneditor.create("#editor", options);

// ✓ Create after mount and pass the element
useEffect(() => {
  const instance = suneditor.create(ref.current, options);
  return () => instance.destroy();
}, []);`;

export const TS_STRICT_MODE = `useEffect(() => {
  const instance = suneditor.create(ref.current, { plugins });

  // StrictMode mounts → unmounts → mounts in development.
  // Destroying here keeps exactly one instance alive.
  return () => instance.destroy();
}, []);`;

export const TS_VALUE = `const editor = suneditor.create(el, {
  plugins,
  value: initialHtml, // read once, at creation
  events: {
    onChange: ({ data }) => setHtml(data), // read edits
  },
});

// Replace the content later (e.g. after loading another document)
editor.$.html.set(nextHtml);`;

export const TS_UPLOAD = `suneditor.create(el, {
  plugins,
  image: { uploadUrl: "/api/upload/image" },
});

// Server response SunEditor expects
{ "result": [{ "url": "https://cdn.example.com/photo.jpg", "name": "photo.jpg", "size": 204800 }] }

// Error response
{ "errorMessage": "File too large" }`;

export const TS_V2 = `// v2
{ imageUploadUrl: "/api/upload/image" }

// v3
{ image: { uploadUrl: "/api/upload/image" } }`;

export const TS_STRIPPED = `suneditor.create(el, {
  plugins,
  elementWhitelist: "mark",                     // extra tags
  attributeWhitelist: { "*": "data-[a-z-]+" },  // extra attributes ("*" = every tag)
  allowedClassName: "^callout",                 // extra class names (regex)
  tagStyles: { span: "text-shadow" },           // extra inline styles, per tag
  allowedURLProtocols: ["zoommtg", "vscode"],   // extra URL schemes (href, src, ...)
});

// Input:   <mark>m</mark> <span class="callout" data-id="7" style="color: red; text-shadow: 1px 1px #000">x</span>
// Default: m <span style="color: red">x</span>
// Above:   <mark>m</mark> <span class="callout" data-id="7" style="color: red;text-shadow: 1px 1px #000">x</span>`;

export const TS_PASTE = `suneditor.create(el, {
  plugins,
  events: {
    // Paste everything as plain text
    onPaste: ({ event }) => {
      const text = event.clipboardData.getData("text/plain");
      const escape = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
      return text.replace(/[&<>"]/g, (c) => escape[c]).replace(/\\n/g, "<br>");
    },

    // …or only adjust content from Word: ({ data, from }) => from === "MS" ? tweak(data) : undefined
  },
});`;

export const TS_CUSTOM_UPLOAD = `suneditor.create(el, {
  plugins,
  events: {
    onImageUploadBefore: async ({ $, info }) => {
      if (info.url) return true; // the submitURL() call below — let it through

      for (const file of info.files) {
        // 1. Ask your server for a presigned URL
        const params = new URLSearchParams({ name: file.name, type: file.type });
        const { uploadUrl, publicUrl } = await fetch(\`/api/presign?\${params}\`).then((r) => r.json());

        // 2. Upload straight to storage
        await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

        // 3. Insert the image by its public URL
        await $.plugins.image.submitURL(publicUrl);
      }

      return false; // skip SunEditor's built-in upload
    },
  },
});`;

export const TS_CONTENT_API = `editor.$.html.get();            // v2: editor.getContents()
editor.$.html.set(html);        // v2: editor.setContents(html)
editor.$.html.add(html);        // v2: editor.appendContents(html)
editor.$.html.insert(html);     // v2: editor.insertHTML(html)
editor.$.ui.readOnly(true);     // v2: editor.readOnly(true)
editor.$.ui.disable();          // v2: editor.disable()
editor.$.ui.enable();           // v2: editor.enable()
editor.resetOptions(options);   // v2: editor.setOptions(options)

// v2: editor.onChange = (contents) => {}
suneditor.create(el, { events: { onChange: ({ data }) => {} } });`;
