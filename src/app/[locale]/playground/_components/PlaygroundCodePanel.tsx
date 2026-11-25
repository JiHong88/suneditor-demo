"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import CopyButton from "@/components/common/CopyButton";
import { generateCode, getCodeLang, type ReactApi } from "../_lib/codeGenerator";
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

/** React tab flavor: the official component (default) or `suneditor.create()` in an effect. Labels are code identifiers, so they are not translated. */
const REACT_APIS: { key: ReactApi; label: string; title: string }[] = [
	{ key: "wrapper", label: "@suneditor/suneditor-react", title: "Official React component" },
	{ key: "direct", label: "suneditor.create()", title: "Engine API without the React component" },
];
const REACT_API_STORAGE_KEY = "playground.reactApi";

type Props = {
	state: PlaygroundState;
};

export default function PlaygroundCodePanel({ state }: Props) {
	const t = useTranslations("Playground");
	const [framework, setFramework] = useState<CodeFramework>("javascript-npm");
	const [reactApi, setReactApi] = useState<ReactApi>("wrapper");
	const [open, setOpen] = useState(true);

	// Remember the React flavor across visits (per browser)
	useEffect(() => {
		try {
			const saved = localStorage.getItem(REACT_API_STORAGE_KEY);
			if (saved === "wrapper" || saved === "direct") setReactApi(saved);
		} catch {
			/* ignore */
		}
	}, []);
	const selectReactApi = (api: ReactApi) => {
		setReactApi(api);
		try {
			localStorage.setItem(REACT_API_STORAGE_KEY, api);
		} catch {
			/* ignore */
		}
	};

	const code = useMemo(() => generateCode(state, framework, reactApi), [state, framework, reactApi]);
	const lang = getCodeLang(framework);

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
							<OpenInStackBlitzButton state={state} framework={framework} reactApi={reactApi} />

							<div className='mx-1 h-4 w-px bg-border' />

							{/* Copy */}
							<CopyButton text={code} toast className='size-7 text-blue-500 hover:bg-accent' iconClassName='size-3.5' />
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

					{/* React flavor — component vs. engine API */}
					{framework === "react" && (
						<div className='flex items-center gap-1 mt-1 pb-1'>
							<div className='inline-flex rounded-md border bg-muted/40 p-0.5' role='radiogroup' aria-label='React API'>
								{REACT_APIS.map((api) => (
									<button
										key={api.key}
										type='button'
										role='radio'
										aria-checked={reactApi === api.key}
										title={api.title}
										onClick={() => selectReactApi(api.key)}
										className={`rounded px-2 py-1 font-mono text-[11px] transition-colors ${
											reactApi === api.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
										}`}
									>
										{api.label}
									</button>
								))}
							</div>
						</div>
					)}
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
		</>
	);
}
