"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SunEditor from "@/components/editor/suneditor";
import type { SunEditor as SunEditorType } from "suneditor/types";

const subButtonList = [["bold", "underline", "italic", "strike", "subscript", "superscript"], "|", ["fontColor", "backgroundColor"]];

const presets: { id: string; label: string; options: SunEditorType.InitOptions }[] = [
	{
		id: "classic",
		label: "Classic",
		options: { subToolbar: { mode: "balloon", buttonList: subButtonList } },
	},
	{
		id: "inline",
		label: "Inline",
		options: { mode: "inline" },
	},
	{
		id: "balloon",
		label: "Balloon",
		options: { mode: "balloon" },
	},
	{
		id: "document",
		label: "Document",
		options: { mode: "classic", type: "document:header,page", subToolbar: { mode: "balloon-always", buttonList: subButtonList } },
	},
];

const sampleValue = `<h2>SunEditor v3</h2><p>A lightweight, flexible WYSIWYG editor with zero dependencies.</p><p>Try switching between the <strong>presets</strong> above to see different toolbar modes.</p>`;

export default function InteractiveDemo() {
	const [activePreset, setActivePreset] = useState("classic");
	const preset = presets.find((p) => p.id === activePreset)!;

	return (
		<section className='container mx-auto px-6 pb-10'>
			<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6 }} className='mx-auto max-w-5xl'>
				<div className='mb-4 flex items-center gap-1 rounded-lg bg-muted/60 p-1 w-fit'>
					{presets.map((p) => (
						<button
							key={p.id}
							onClick={() => setActivePreset(p.id)}
							className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
								activePreset === p.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
							}`}
						>
							{p.label}
						</button>
					))}
				</div>
				<SunEditor key={activePreset} value={sampleValue} options={preset.options} />
			</motion.div>
		</section>
	);
}
