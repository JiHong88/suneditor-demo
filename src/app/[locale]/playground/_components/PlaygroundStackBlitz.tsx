"use client";

import sdk from "@stackblitz/sdk";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUNEDITOR_VERSION } from "@/data/code-examples/editorPresets";
import { generateCode } from "../_lib/codeGenerator";
import type { PlaygroundState, CodeFramework } from "../_lib/playgroundState";

/* ── Project generators per framework ─────────────────── */

function getVanillaProject(code: string) {
	return {
		title: "SunEditor - Vanilla JS",
		template: "node" as const,
		files: {
			"index.js": code,
			"index.html": `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>SunEditor</title></head>
<body style="margin:6em 4rem 4rem">
  <h1>SunEditor Demo</h1>
  <textarea id="editor"></textarea>
  <script type="module" src="./index.js"><\/script>
</body>
</html>`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: { suneditor: SUNEDITOR_VERSION, vite: "^5" },
				},
				null,
				2,
			),
			"vite.config.js": `export default { root: "." };`,
		},
	};
}

function getReactProject(code: string) {
	return {
		title: "SunEditor - React",
		template: "node" as const,
		files: {
			"src/Editor.jsx": code,
			"src/App.jsx": `import Editor from "./Editor";
export default function App() {
  return (
    <div style={{ margin: "300px 4rem 4rem" }}>
      <h1>SunEditor Demo</h1>
      <Editor />
    </div>
  );
}`,
			"src/main.jsx": `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>);`,
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor React</title></head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"><\/script></body>
</html>`,
			"vite.config.js": `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({ plugins: [react()] });`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-react-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: {
						suneditor: SUNEDITOR_VERSION,
						react: "^18",
						"react-dom": "^18",
						"@vitejs/plugin-react": "^4",
						vite: "^5",
					},
				},
				null,
				2,
			),
		},
	};
}

function getVueProject(code: string) {
	return {
		title: "SunEditor - Vue 3",
		template: "node" as const,
		files: {
			"src/Editor.vue": code,
			"src/App.vue": `<script setup>
import Editor from "./Editor.vue";
</script>
<template>
  <div style="margin:6em 4rem 4rem">
    <h1>SunEditor Demo</h1>
    <Editor />
  </div>
</template>`,
			"src/main.js": `import { createApp } from "vue";
import App from "./App.vue";
createApp(App).mount("#app");`,
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor Vue</title></head>
<body><div id="app"></div><script type="module" src="/src/main.js"><\/script></body>
</html>`,
			"vite.config.js": `import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({ plugins: [vue()] });`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-vue-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: {
						suneditor: SUNEDITOR_VERSION,
						vue: "^3",
						"@vitejs/plugin-vue": "^5",
						vite: "^5",
					},
				},
				null,
				2,
			),
		},
	};
}

function getSvelteProject(code: string) {
	return {
		title: "SunEditor - Svelte",
		template: "node" as const,
		files: {
			"src/Editor.svelte": code,
			"src/App.svelte": `<script>
import Editor from "./Editor.svelte";
</script>
<div style="margin:6em 4rem 4rem">
  <h1>SunEditor Demo</h1>
  <Editor />
</div>`,
			"src/main.js": `import App from "./App.svelte";
const app = new App({ target: document.getElementById("app") });
export default app;`,
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor Svelte</title></head>
<body><div id="app"></div><script type="module" src="/src/main.js"><\/script></body>
</html>`,
			"vite.config.js": `import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
export default defineConfig({ plugins: [svelte()] });`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-svelte-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: {
						suneditor: SUNEDITOR_VERSION,
						svelte: "^4",
						"@sveltejs/vite-plugin-svelte": "^3",
						vite: "^5",
					},
				},
				null,
				2,
			),
		},
	};
}

function getAngularProject(code: string) {
	return {
		title: "SunEditor - Angular",
		template: "node" as const,
		files: {
			"src/app/editor.component.ts": code,
			"src/app/app.component.ts": `import { Component } from "@angular/core";
import { EditorComponent } from "./editor.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [EditorComponent],
  template: \`<div style="margin:6em 4rem 4rem"><h1>SunEditor Demo</h1><app-editor></app-editor></div>\`
})
export class AppComponent {}`,
			"src/main.ts": `import "zone.js";
import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
bootstrapApplication(AppComponent);`,
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor Angular</title></head>
<body><app-root></app-root><script type="module" src="/src/main.ts"><\/script></body>
</html>`,
			"vite.config.mts": `import { defineConfig } from "vite";
import angular from "@analogjs/vite-plugin-angular";
export default defineConfig({ plugins: [angular()] });`,
			"tsconfig.json": JSON.stringify(
				{
					compilerOptions: {
						target: "ES2022",
						module: "ES2022",
						moduleResolution: "bundler",
						experimentalDecorators: true,
						skipLibCheck: true,
						strict: false,
						esModuleInterop: true,
						useDefineForClassFields: false,
					},
					include: ["src/**/*.ts"],
				},
				null,
				"\t",
			),
			"package.json": JSON.stringify(
				{
					name: "suneditor-angular-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: {
						suneditor: SUNEDITOR_VERSION,
						"@angular/core": "^17",
						"@angular/common": "^17",
						"@angular/compiler": "^17",
						"@angular/platform-browser": "^17",
						"@angular/platform-browser-dynamic": "^17",
						"zone.js": "^0.14",
						"@analogjs/vite-plugin-angular": "^1",
						vite: "^5",
						typescript: "~5.3",
					},
				},
				null,
				2,
			),
		},
	};
}

function getWebComponentsProject(code: string) {
	return {
		title: "SunEditor - Web Components",
		template: "node" as const,
		files: {
			"index.js": code + "\n\n// Use the component\ndocument.body.innerHTML = '<sun-editor></sun-editor>';",
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor WC</title></head>
<body style="margin:6em 4rem 4rem"><h1>SunEditor Demo</h1><script type="module" src="./index.js"><\/script></body>
</html>`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-wc-demo",
					private: true,
					type: "module",
					scripts: { dev: "vite", build: "vite build" },
					dependencies: { suneditor: SUNEDITOR_VERSION, vite: "^5" },
				},
				null,
				2,
			),
			"vite.config.js": `export default { root: "." };`,
		},
	};
}

function getProject(framework: CodeFramework, code: string) {
	switch (framework) {
		case "react":
			return getReactProject(code);
		case "vue":
			return getVueProject(code);
		case "angular":
			return getAngularProject(code);
		case "svelte":
			return getSvelteProject(code);
		case "webcomponents":
			return getWebComponentsProject(code);
		default:
			return getVanillaProject(code);
	}
}

/* ── Public: "Open in StackBlitz" button ──────────────── */

export function OpenInStackBlitzButton({ state, framework }: { state: PlaygroundState; framework: CodeFramework }) {
	return (
		<Button
			size='sm'
			variant='ghost'
			className='h-7 text-xs text-blue-500 hover:text-blue-600'
			title='Open a live code editor powered by StackBlitz'
			onClick={() => {
				// CDN scripts can't load in StackBlitz WebContainers — use npm version instead
				const sbFramework = framework === "javascript-cdn" ? "javascript-npm" : framework;
				const code = generateCode(state, sbFramework);
				const project = getProject(sbFramework, code);
				sdk.openProject(project);
			}}
		>
			<ExternalLink className='me-1.5 h-3 w-3' />
			Run Code (StackBlitz)
		</Button>
	);
}
