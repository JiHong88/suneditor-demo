"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const frameworkData = [
	{
		key: "javascript",
		name: "JavaScript",
		icon: "/logos/js.svg",
		snippet: `<!-- 1. Include CSS -->
<link href="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/css/suneditor.min.css" rel="stylesheet">
<!-- 2. Include JS -->
<script src="https://cdn.jsdelivr.net/npm/suneditor@latest/dist/suneditor.min.js"></script>

<!-- 3. Create Textarea -->
<textarea id="my-editor"></textarea>

<!-- 4. Create Editor -->
<script>
  SUNEDITOR.create('my-editor', {
     // All options from https://github.com/JiHong88/SunEditor#options
  });
</script>`,
	},
	{
		key: "angular",
		name: "Angular",
		icon: "/logos/angular.svg",
		snippet: `// 1. Install
npm install suneditor-angular

// 2. Import module in app.module.ts
import { SunEditorModule } from 'suneditor-angular';

@NgModule({
  imports: [ SunEditorModule ],
})
export class AppModule { }

// 3. Use in component
// <sun-editor [setOptions]="{...}"></sun-editor>`,
	},
	{
		key: "jquery",
		name: "jQuery",
		icon: "/logos/jquery.svg",
		snippet: `// jQuery support is planned for a future release.`,
	},
	{
		key: "react",
		name: "React",
		icon: "/logos/react.svg",
		snippet: `import React from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File

const MyComponent = () => {
  return (
    <div>
      <SunEditor />
    </div>
  );
};
export default MyComponent;`,
	},
	{
		key: "svelte",
		name: "Svelte",
		icon: "/logos/svelte.svg",
		snippet: `// Svelte support is planned for a future release.`,
	},
	{
		key: "vue",
		name: "Vue",
		icon: "/logos/vue.svg",
		snippet: `<template>
  <div>
    <suneditor />
  </div>
</template>

<script>
import suneditor from 'suneditor-vue';
import 'suneditor/dist/css/suneditor.min.css';

export default {
  components: {
    suneditor
  }
}
</script>`,
	},
	{
		key: "webcomponents",
		name: "Web Components",
		icon: "/logos/web-components.svg",
		snippet: `// Web Components support is planned for a future release.`,
	},
];

export default function CodeExamples() {
	const t = useTranslations("Main.Common.CodeExamples");
	const desc = t("desc").split("||");

	const [framework, setFramework] = useState(frameworkData[0].key);
	const [copied, setCopied] = useState(false);

	const handleCopy = () => {
		const currentSnippet = frameworkData.find((f) => f.key === framework)?.snippet || "";
		navigator.clipboard.writeText(currentSnippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<section className='container mx-auto px-6 py-20'>
			<div className='mx-auto max-w-2xl text-center'>
				<h2 className='text-3xl font-bold tracking-tight md:text-4xl'>{t("title")}</h2>
				<p className='mt-4 text-base text-muted-foreground'>
					{desc[0]}
					<br />
					{desc[1]}
				</p>
			</div>

			<Card className='mx-auto mt-12 max-w-5xl'>
				<CardContent className='grid gap-6 p-5 md:grid-cols-[220px_1fr]'>
					{/* Vertical Tabs */}
					<div className='flex flex-col gap-1'>
						{frameworkData.map((fw) => {
							return (
								<Button
									key={fw.key}
									variant={"ghost"}
									className={`w-full justify-start gap-3 rounded-none px-3 text-base h-11 cursor-pointer border-l-4 ${
										framework === fw.key ? "border-primary text-primary font-semibold" : "border-transparent text-muted-foreground hover:text-primary"
									}`}
									onClick={() => setFramework(fw.key)}
								>
									<Image src={fw.icon} alt={`${fw.name} logo`} className='h-6 w-6' width={24} height={24} />
									<span>{fw.name}</span>
								</Button>
							);
						})}
					</div>

					{/* Code Display */}
					<div className='relative rounded-md border bg-muted/50 p-4 font-mono text-sm'>
						<Button size='icon' variant='ghost' className='absolute top-2 right-2 h-8 w-8' onClick={handleCopy}>
							<Copy className='h-4 w-4' />
						</Button>
						<AnimatePresence mode='wait'>
							<motion.pre
								key={framework}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className='whitespace-pre-wrap'
							>
								<code>{frameworkData.find((f) => f.key === framework)?.snippet}</code>
							</motion.pre>
						</AnimatePresence>
						{copied && <span className='absolute bottom-3 right-3 text-xs text-green-500'>Copied!</span>}
					</div>
				</CardContent>
			</Card>
		</section>
	);
}
