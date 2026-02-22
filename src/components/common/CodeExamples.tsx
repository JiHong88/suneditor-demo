"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { SandpackCodeEditor, SandpackProvider, type SandpackProviderProps } from "@codesandbox/sandpack-react";
import { atomDark, githubLight } from "@codesandbox/sandpack-themes";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CODE_FRAMEWORKS, DEFAULT_FRAMEWORK_KEY, getCodeFramework, hexToRgba, type FrameworkKey } from "./codeExampleFrameworks";

type CodeExamplesProps = {
	compact?: boolean;
	framework?: FrameworkKey;
	onFrameworkChange?: (framework: FrameworkKey) => void;
};

const FRAMEWORK_META: Record<FrameworkKey, { template: SandpackProviderProps["template"]; filePath: string }> = {
	"javascript-cdn": { template: "vanilla", filePath: "/index.html" },
	"javascript-npm": { template: "vanilla", filePath: "/main.js" },
	react: { template: "react", filePath: "/App.tsx" },
	vue: { template: "vue", filePath: "/src/App.vue" },
	angular: { template: "angular", filePath: "/src/app/app.component.ts" },
	svelte: { template: "svelte", filePath: "/App.svelte" },
	jquery: { template: "vanilla", filePath: "/main.js" },
	webcomponents: { template: "vanilla", filePath: "/main.js" },
};

function usePrefersDark() {
	const resolveDark = () => {
		if (typeof document === "undefined") return false;
		return !!document.documentElement?.classList.contains("dark");
	};

	const [dark, setDark] = useState(() => resolveDark());

	useEffect(() => {
		const syncDark = () => setDark(resolveDark());
		syncDark();

		const onThemeChange = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (detail === "dark" || detail === "light") {
				setDark(detail === "dark");
				return;
			}
			syncDark();
		};

		window.addEventListener("themechange", onThemeChange);
		return () => window.removeEventListener("themechange", onThemeChange);
	}, []);

	return dark;
}

export default function CodeExamples({ compact = false, framework, onFrameworkChange }: CodeExamplesProps) {
	const t = useTranslations("Main.Common.CodeExamples");
	const desc = t("desc").split("||");

	const [internalFramework, setInternalFramework] = useState<FrameworkKey>(DEFAULT_FRAMEWORK_KEY);
	const [copied, setCopied] = useState(false);
	const prefersDark = usePrefersDark();
	const selectedFrameworkKey = framework ?? internalFramework;
	const selectedFramework = getCodeFramework(selectedFrameworkKey);
	const selectedMeta = FRAMEWORK_META[selectedFrameworkKey];
	const sandpackFiles = useMemo(
		() => ({
			[selectedMeta.filePath]: { code: selectedFramework.snippet },
		}),
		[selectedFramework.snippet, selectedMeta.filePath]
	);

	const selectFramework = (nextFramework: FrameworkKey) => {
		if (framework === undefined) {
			setInternalFramework(nextFramework);
		}
		onFrameworkChange?.(nextFramework);
	};

	const handleCopy = () => {
		const currentSnippet = getCodeFramework(selectedFrameworkKey).snippet;
		navigator.clipboard.writeText(currentSnippet);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const content = (
		<Card className={compact ? "w-full" : "mx-auto mt-12 max-w-5xl"}>
			<CardContent className='grid gap-6 p-5 md:grid-cols-[220px_1fr]'>
				{/* Vertical Tabs */}
				<div className='flex flex-col gap-1'>
					{CODE_FRAMEWORKS.map((fw) => {
						const active = selectedFrameworkKey === fw.key;
						return (
							<Button
								key={fw.key}
								variant={"ghost"}
								className={`w-full justify-start gap-3 rounded-none px-3 text-base h-11 cursor-pointer border-l-4 ${
									active ? "font-semibold border-primary text-primary" : "border-transparent text-muted-foreground hover:text-primary"
								}`}
								onClick={() => selectFramework(fw.key)}
							>
								<Image src={fw.icon} alt={`${fw.name} logo`} className='h-6 w-6' width={24} height={24} />
								<span>{fw.name}</span>
							</Button>
						);
					})}
				</div>

				{/* Code Display */}
				<div
					className='relative rounded-md border bg-muted/50 p-4 font-mono text-sm'
					style={{
						borderColor: hexToRgba(selectedFramework.accent, 0.65),
						boxShadow: `inset 0 0 0 1px ${hexToRgba(selectedFramework.accent, 0.2)}`,
					}}
				>
					<Button size='icon' variant='ghost' className='absolute top-2 right-2 h-8 w-8' onClick={handleCopy}>
						<Copy className='h-4 w-4' />
					</Button>
					<div className='mb-3 inline-flex items-center gap-2 rounded-md border bg-background/80 px-2.5 py-1 text-xs text-muted-foreground'>
						<Image src={selectedFramework.icon} alt={`${selectedFramework.name} logo`} className='h-3.5 w-3.5' width={14} height={14} />
						<span className='font-medium'>{selectedFramework.name}</span>
						<span className='rounded border px-1.5 py-0.5 text-[10px] uppercase'>{selectedFramework.kind}</span>
					</div>
					<AnimatePresence mode='wait'>
						<motion.div
							key={selectedFrameworkKey}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className='overflow-hidden rounded-md border border-border/60 bg-muted/10'
						>
							<SandpackProvider
								template={selectedMeta.template}
								files={sandpackFiles}
								theme={prefersDark ? atomDark : githubLight}
								options={{
									activeFile: selectedMeta.filePath,
									visibleFiles: [selectedMeta.filePath],
								}}
							>
								<SandpackCodeEditor
									readOnly
									showReadOnly={false}
									showTabs={false}
									showInlineErrors={false}
									showLineNumbers
									wrapContent
									style={{ minHeight: compact ? 260 : 320 }}
								/>
							</SandpackProvider>
						</motion.div>
					</AnimatePresence>
					{copied && <span className='absolute bottom-3 right-3 text-xs text-green-500'>Copied!</span>}
				</div>
			</CardContent>
		</Card>
	);

	if (compact) {
		return content;
	}

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
			{content}
		</section>
	);
}
