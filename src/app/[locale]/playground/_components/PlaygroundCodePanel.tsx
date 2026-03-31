"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/common/CodeBlock";
import { generateCode, getCodeLang } from "../_lib/codeGenerator";
import type { PlaygroundState } from "../_lib/playgroundState";
import type { CodeFramework } from "../_lib/playgroundState";
import { OpenInStackBlitzButton } from "./PlaygroundStackBlitz";

const FRAMEWORKS: { key: CodeFramework; name: string; title?: string; icon: string }[] = [
	{ key: "javascript-cdn", name: "CDN", title: "HTML / CDN", icon: "/logos/html.svg" },
	{ key: "javascript-npm", name: "JS", title: "Vanilla JavaScript", icon: "/logos/js.svg" },
	{ key: "react", name: "React", icon: "/logos/react.svg" },
	{ key: "vue", name: "Vue", icon: "/logos/vue.svg" },
	{ key: "angular", name: "Angular", icon: "/logos/angular.svg" },
	{ key: "svelte", name: "Svelte", icon: "/logos/svelte.svg" },
	{ key: "webcomponents", name: "WC", title: "Web Components", icon: "/logos/web-components.svg" },
];

type Props = {
	state: PlaygroundState;
};

export default function PlaygroundCodePanel({ state }: Props) {
	const t = useTranslations("Playground");
	const tc = useTranslations("Common");
	const [framework, setFramework] = useState<CodeFramework>("javascript-npm");
	const [open, setOpen] = useState(true);
	const [copied, setCopied] = useState(false);

	const code = useMemo(() => generateCode(state, framework), [state, framework]);
	const lang = getCodeLang(framework);

	const handleCopy = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<>
			<div className='rounded-lg border bg-card overflow-hidden'>
				{/* Header */}
				<div className='border-b px-4 py-2'>
					<div className='flex items-center justify-between'>
						<button type='button' onClick={() => setOpen(!open)} className='flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors'>
							<ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
							{t("generatedCode")}
						</button>

						<div className='flex items-center gap-1'>
							{/* StackBlitz */}
							<OpenInStackBlitzButton state={state} framework={framework} />

							<div className='mx-1 h-4 w-px bg-border' />

							{/* Copy */}
							<Button size='icon' variant='ghost' className='h-7 w-7' onClick={handleCopy} title={tc("copyCode")}>
								{copied ? <Check className='h-3.5 w-3.5 text-green-500' /> : <Copy className='h-3.5 w-3.5 text-blue-500' />}
							</Button>
						</div>
					</div>

					{/* Framework tabs — below header */}
					<div className='flex items-center gap-1 mt-2 overflow-x-auto pb-1'>
						{FRAMEWORKS.map((fw) => (
							<button
								key={fw.key}
								type='button'
								title={fw.title ?? fw.name}
								onClick={() => setFramework(fw.key)}
								className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-xs transition-colors whitespace-nowrap border ${
									framework === fw.key ? "bg-background font-medium shadow-sm border-border" : "text-muted-foreground hover:text-foreground border-transparent hover:bg-muted/50"
								}`}
							>
								<Image src={fw.icon} alt={fw.title ?? fw.name} width={16} height={16} className='h-4 w-4' />
								<span className='hidden sm:inline'>{fw.name}</span>
							</button>
						))}
					</div>
				</div>

				{/* Code block */}
				<AnimatePresence initial={false}>
					{open && (
						<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className='overflow-hidden'>
							<div className='max-h-[32rem] overflow-auto [&_pre]:!text-xs [&_code]:!text-xs [&_pre]:!leading-relaxed'>
								<CodeBlock code={code} lang={lang} />
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Copy toast */}
			<AnimatePresence>
				{copied && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 8 }}
						className='fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2.5 text-sm font-medium shadow-lg'
					>
						<Check className='h-4 w-4 text-green-400' />
						{tc("copiedToClipboard")}
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
