"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import sdk from "@stackblitz/sdk";
import type { VM } from "@stackblitz/sdk";
import { ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SUNEDITOR_VERSION } from "@/data/code-examples/editorPresets";
import { generateCode, getCodeLang } from "../_lib/codeGenerator";
import type { PlaygroundState, CodeFramework } from "../_lib/playgroundState";

type Props = {
	state: PlaygroundState;
	framework: CodeFramework;
};

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
<body>
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
				2
			),
			"vite.config.js": `export default { root: "." };`,
		},
	};
}

function getCDNProject(code: string) {
	return {
		title: "SunEditor - CDN",
		template: "html" as const,
		files: {
			"index.html": code,
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
  return <Editor />;
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
				2
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
<template><Editor /></template>`,
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
				2
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
<Editor />`,
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
				2
			),
		},
	};
}

function getAngularProject(code: string) {
	// Angular requires a full project structure. Use a simplified Vite + Angular setup.
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
  template: \`<app-editor></app-editor>\`
})
export class AppComponent {}`,
			"src/main.ts": `import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
bootstrapApplication(AppComponent);`,
			"index.html": `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>SunEditor Angular</title></head>
<body><app-root></app-root><script type="module" src="/src/main.ts"><\/script></body>
</html>`,
			"package.json": JSON.stringify(
				{
					name: "suneditor-angular-demo",
					private: true,
					scripts: { dev: "ng serve", build: "ng build" },
					dependencies: {
						suneditor: SUNEDITOR_VERSION,
						"@angular/core": "^17",
						"@angular/platform-browser": "^17",
						"@angular/compiler": "^17",
						"zone.js": "^0.14",
					},
				},
				null,
				2
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
<body><script type="module" src="./index.js"><\/script></body>
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
				2
			),
			"vite.config.js": `export default { root: "." };`,
		},
	};
}

function getProject(framework: CodeFramework, code: string) {
	switch (framework) {
		case "javascript-cdn":
			return getCDNProject(code);
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

/* ── Component ────────────────────────────────────────── */

export default function PlaygroundStackBlitz({ state, framework }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const vmRef = useRef<VM | null>(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const code = generateCode(state, framework);

	const embed = useCallback(async () => {
		if (!containerRef.current) return;
		setLoading(true);

		const project = getProject(framework, code);
		try {
			const vm = await sdk.embedProject(containerRef.current, project, {
				height: 500,
				openFile: framework === "javascript-cdn" ? "index.html" : undefined,
				view: "default",
				hideNavigation: true,
				clickToLoad: false,
			});
			vmRef.current = vm;
		} catch {
			/* StackBlitz may fail in unsupported browsers */
		}
		setLoading(false);
	}, [framework, code]);

	// Re-embed when opened
	useEffect(() => {
		if (open) {
			embed();
		}
	}, [open, embed]);

	// Cleanup
	useEffect(() => {
		return () => {
			vmRef.current = null;
		};
	}, []);

	return (
		<div className='rounded-lg border bg-card/90 overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between border-b px-4 py-2'>
				<button type='button' onClick={() => setOpen(!open)} className='flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors'>
					<ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
					Live Editor (StackBlitz)
				</button>
				{open && (
					<Button
						size='sm'
						variant='ghost'
						className='h-7 text-xs'
						onClick={() => {
							const project = getProject(framework, code);
							sdk.openProject(project);
						}}
					>
						<ExternalLink className='mr-1 h-3 w-3' />
						Open in new tab
					</Button>
				)}
			</div>

			{/* StackBlitz embed */}
			<AnimatePresence initial={false}>
				{open && (
					<motion.div initial={{ height: 0 }} animate={{ height: 500 }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className='overflow-hidden'>
						{loading && (
							<div className='flex items-center justify-center h-full text-muted-foreground text-sm'>Loading StackBlitz...</div>
						)}
						<div ref={containerRef} className='w-full h-[500px]' />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
