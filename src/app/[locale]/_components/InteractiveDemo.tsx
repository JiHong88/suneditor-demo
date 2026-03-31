"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import SunEditor from "@/components/editor/suneditor";
import type { SunEditor as SunEditorType } from "suneditor/types";
import { DocumentButtonList } from "@/components/editor/buttonList";

const subButtonList = [
	["bold", "underline", "italic", "strike", "subscript", "superscript"],
	"|",
	["fontColor", "backgroundColor"],
];

const inlineButtonList = [
	["undo", "redo"],
	"|",
	["blockStyle", "font", "fontSize"],
	"|",
	["bold", "underline", "italic", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["align", "list", "outdent", "indent"],
	"|",
	["table", "link", "image"],
	"|",
	["fullScreen", "codeView"],
];

const balloonButtonList = [
	["bold", "underline", "italic", "strike"],
	"|",
	["fontColor", "backgroundColor"],
	"|",
	["removeFormat"],
	"|",
	["link"],
];

const presetDefs: { id: string; tKey: string; options: SunEditorType.InitOptions }[] = [
	{
		id: "classic",
		tKey: "classic",
		options: { toolbar_sticky: 92, subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "bottom",
		tKey: "bottom",
		options: { mode: "classic:bottom", subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "inline",
		tKey: "inline",
		options: { mode: "inline", toolbar_sticky: 92, buttonList: inlineButtonList },
	},
	{
		id: "balloon",
		tKey: "balloon",
		options: { mode: "balloon", buttonList: balloonButtonList },
	},
	{
		id: "document",
		tKey: "document",
		options: {
			mode: "classic",
			type: "document:header,page",
			toolbar_sticky: 92,
			buttonList: DocumentButtonList,
			subToolbar: { mode: "balloon-always", buttonList: subButtonList },
		},
	},
];

import { INTERACTIVE_DEMO_VALUE } from "@/data/snippets/pluginGuideSnippets";
const sampleValue = INTERACTIVE_DEMO_VALUE;

export default function InteractiveDemo() {
	const t = useTranslations("Home.InteractiveDemo");
	const [activePreset, setActivePreset] = useState("classic");
	const [em, setEm] = useState<any>(null);
	const preset = presetDefs.find((p) => p.id === activePreset)!;

	useEffect(() => {
		import("../plugin-guide/_examples/embed").then((mod) => setEm(() => mod.default));
	}, []);

	return (
		<section className='container mx-auto px-6 pb-10'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.6 }}
				className='mx-auto max-w-5xl'
			>
				<div className='mb-4 flex items-center gap-1 rounded-lg bg-muted/60 p-1 w-fit'>
					{presetDefs.map((p) => (
						<button
							key={p.id}
							onClick={() => setActivePreset(p.id)}
							className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
								activePreset === p.id
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							{t(p.tKey)}
						</button>
					))}
				</div>
				<SunEditor key={activePreset} value={sampleValue} options={preset.options} />
			</motion.div>
		</section>
	);
}
