"use client";

import { useEffect, useMemo, useState } from "react";
import { SandpackProvider, SandpackLayout, SandpackCodeEditor, SandpackPreview, SandpackConsole, SandpackProviderProps } from "@codesandbox/sandpack-react";
import { githubLight, atomDark } from "@codesandbox/sandpack-themes";
import SunEditor from "@/components/editor/suneditor";

type SandpackTemplate = SandpackProviderProps;

export default function PlaygroundPage() {
	const prefersDark = usePrefersDark();
	const [framework, setFramework] = useState<"react" | "vanilla" | "vue">("react");
	const [editorContent] = useState("<p>SunEditor is being tested.</p>");

	const setup = useMemo(() => getTemplate(framework), [framework]);

	return (
		<div className='min-h-screen w-full p-6 md:p-10 bg-neutral-50 dark:bg-neutral-900'>
			<div className='mx-auto max-w-6xl'>
				<header className='mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
					<div className='flex flex-wrap items-center gap-3'>
						<label className='text-sm text-neutral-600 dark:text-neutral-300'>Framework</label>
						<select
							className='rounded-xl border px-3 py-2 text-sm bg-white dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700'
							value={framework}
							onChange={(e) => setFramework(e.target.value as any)}
						>
							<option value='react'>React</option>
							<option value='vanilla'>Vanilla JS</option>
							<option value='vue'>Vue 3</option>
						</select>
						{setup.files && <CopyAllButton files={setup.files} />}
					</div>
				</header>

				<SandpackProvider template={setup.template} files={setup.files} customSetup={setup.customSetup} theme={prefersDark ? atomDark : githubLight}>
					<SandpackLayout className='rounded-2xl overflow-hidden shadow-xl border border-neutral-200 dark:border-neutral-800'>
						<SandpackCodeEditor showTabs showInlineErrors showLineNumbers wrapContent closableTabs style={{ minHeight: 420 }} />
						<div className='flex flex-col min-h-[420px] max-h-[70vh]'>
							<SandpackPreview className='flex-1' />
							<div className='border-t border-neutral-200 dark:border-neutral-800'>
								<SandpackConsole />
							</div>
						</div>
					</SandpackLayout>
				</SandpackProvider>

				<div className='my-8'>
					<div className='mt-4 p-0 border rounded prose max-w-none'>
						<SunEditor value={editorContent} />
					</div>
				</div>
			</div>
		</div>
	);
}

function CopyAllButton({ files }: { files: SandpackProviderProps["files"] }) {
	const [copied, setCopied] = useState(false);
	return (
		<button
			onClick={async () => {
				if (!files) return;
				const bundle = Object.entries(files)
					.map(([path, file]) => {
						const code = typeof file === "string" ? file : file.code;
						return `// ${path}\n${code}`;
					})
					.join("\n\n/* ———————————————— */\n\n");
				await navigator.clipboard.writeText(bundle);
				setCopied(true);
				setTimeout(() => setCopied(false), 1200);
			}}
			className='rounded-xl text-sm px-3 py-2 border bg-white hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-100 border-neutral-300 dark:border-neutral-700'
			title='Copy all files to clipboard'
		>
			{copied ? "Copied!" : "Copy All"}
		</button>
	);
}

function usePrefersDark() {
	const [dark, setDark] = useState(false);
	useEffect(() => {
		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => setDark(mq.matches);
		onChange();
		mq.addEventListener("change", onChange);
		return () => mq.removeEventListener("change", onChange);
	}, []);
	return dark;
}

/**
 * Returns Sandpack template + files for the chosen framework.
 */
function getTemplate(framework: "react" | "vanilla" | "vue"): SandpackTemplate {
	if (framework === "vanilla") {
		return {
			template: "vanilla",
			customSetup: {
				dependencies: {},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8" />
    <meta name=\"viewport" content=\"width=device-width, initial-scale=1" />
    <title>Vanilla</title>
  </head>
  <body>
    <h1>Hello Vanilla</h1>
    <div id=\"app"></div>
    <script src=\"/index.js\"></script>
  </body>
</html>`,
				},
				"/index.js": {
					code: `const el = document.getElementById('app');
el.innerHTML = 'Edit /index.js and save…';
console.log('Vanilla running');`,
				},
				"/styles.css": { code: `body{font:16px/1.5 system-ui, sans-serif;}` },
			},
		};
	}

	if (framework === "vue") {
		return {
			template: "vue",
			customSetup: {
				dependencies: {
					vue: "^3.4.0",
				},
			},
			files: {
				"/index.html": {
					code: `<!doctype html>
<html>
  <head>
    <meta charset=\"utf-8" />
    <meta name=\"viewport" content=\"width=device-width, initial-scale=1" />
    <title>Vue 3</title>
  </head>
  <body>
    <div id=\"app"></div>
    <script type=\"module" src=\"/src/main.js\"></script>
  </body>
</html>`,
				},
				"/src/main.js": {
					code: `import { createApp } from 'vue';
import App from './App.vue';
createApp(App).mount('#app');`,
				},
				"/src/App.vue": {
					code: `<script setup>
import { ref } from 'vue';
const count = ref(0);
</script>

<template>
  <main style=\"font-family: system-ui, sans-serif; padding: 1rem">
    <h1>Vue 3 Playground</h1>
    <button @click=\"count++">count: {{ count }}</button>
  </main>
</template>

<style>
button { padding: .5rem 1rem; border-radius: .75rem; }
</style>`,
				},
			},
		};
	}

	// React default
	return {
		template: "react",
		customSetup: {
			dependencies: {
				react: "^18.3.0",
				"react-dom": "^18.3.0",
			},
		},
		files: {
			"/App.js": {
				code: `import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>React Playground</h1>
      <button onClick={() => setCount((c) => c + 1)}>
        count: {count}
      </button>
      <p>Edit <code>/App.js</code> and see it live.</p>
    </main>
  );
}
`,
			},
			"/index.js": {
				code: `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')).render(<App />);`,
			},
			"/styles.css": { code: `*{box-sizing:border-box}` },
		},
	};
}
