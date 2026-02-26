"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Copy, Check } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CodeBlock from "@/components/common/CodeBlock";
import { generateCode, getCodeLang } from "../_lib/codeGenerator";
import type { PlaygroundState } from "../_lib/playgroundState";
import type { CodeFramework } from "../_lib/playgroundState";

const FRAMEWORKS: { key: CodeFramework; name: string; icon: string }[] = [
	{ key: "javascript-cdn", name: "CDN", icon: "/logos/html.svg" },
	{ key: "javascript-npm", name: "JS", icon: "/logos/js.svg" },
	{ key: "react", name: "React", icon: "/logos/react.svg" },
	{ key: "vue", name: "Vue", icon: "/logos/vue.svg" },
	{ key: "angular", name: "Angular", icon: "/logos/angular.svg" },
	{ key: "svelte", name: "Svelte", icon: "/logos/svelte.svg" },
	{ key: "webcomponents", name: "WC", icon: "/logos/web-components.svg" },
];

type Props = {
	state: PlaygroundState;
};

export default function PlaygroundCodePanel({ state }: Props) {
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
		<div className='rounded-lg border bg-card/90 overflow-hidden'>
			{/* Header */}
			<div className='flex items-center justify-between border-b px-4 py-2'>
				<button type='button' onClick={() => setOpen(!open)} className='flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors'>
					<ChevronDown className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`} />
					Generated Code
				</button>

				<div className='flex items-center gap-2'>
					{/* Framework tabs */}
					<div className='flex items-center gap-0.5 rounded-md border bg-muted/50 p-0.5 overflow-x-auto'>
						{FRAMEWORKS.map((fw) => (
							<button
								key={fw.key}
								type='button'
								onClick={() => setFramework(fw.key)}
								className={`flex items-center gap-1 rounded px-1.5 py-1 text-xs transition-colors whitespace-nowrap ${
									framework === fw.key ? "bg-background font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
								}`}
							>
								<Image src={fw.icon} alt={fw.name} width={14} height={14} className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>{fw.name}</span>
							</button>
						))}
					</div>

					{/* Copy */}
					<Button size='icon' variant='ghost' className='h-7 w-7' onClick={handleCopy}>
						{copied ? <Check className='h-3.5 w-3.5 text-green-500' /> : <Copy className='h-3.5 w-3.5' />}
					</Button>
				</div>
			</div>

			{/* Code block */}
			<AnimatePresence initial={false}>
				{open && (
					<motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className='overflow-hidden'>
						<div className='max-h-80 overflow-auto'>
							<CodeBlock code={code} lang={lang} />
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
