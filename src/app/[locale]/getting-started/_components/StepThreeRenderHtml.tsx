"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCodeFramework, hexToRgba, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import CodeBlock from "@/components/common/CodeBlock";
import FrameworkBadge from "./FrameworkBadge";
import SectionHeading from "./SectionHeading";
import { getRenderSnippet } from "./snippets";

type StepTwoProps = {
	framework: FrameworkKey;
};

export default function StepTwoContentRendering({ framework }: StepTwoProps) {
	const [copied, setCopied] = useState(false);
	const item = getCodeFramework(framework);
	const snippet = getRenderSnippet(framework);

	const handleCopy = () => {
		navigator.clipboard.writeText(snippet.code);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-8'>
			<SectionHeading eyebrow='Step 2' title='Content Rendering' description='getContents()로 가져온 HTML을 화면에 표시할 때, CSS와 클래스명이 필요합니다.' />
			<div className='mt-4'>
				<FrameworkBadge framework={framework} />
			</div>
			<div className='mt-8'>
				<div
					className='relative overflow-hidden rounded-2xl border bg-card/90 p-4 shadow-sm'
					style={{
						borderColor: hexToRgba(item.accent, 0.6),
						boxShadow: `inset 0 0 0 1px ${hexToRgba(item.accent, 0.15)}`,
					}}
				>
					<Button size='icon' variant='ghost' className='absolute top-4 right-4 h-8 w-8 z-10' onClick={handleCopy}>
						<Copy className='h-4 w-4' />
					</Button>
					<AnimatePresence mode='wait'>
						<motion.div
							key={framework}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							<CodeBlock code={snippet.code} lang={snippet.lang} />
						</motion.div>
					</AnimatePresence>
					{copied && <span className='absolute bottom-3 right-3 text-xs text-green-500'>Copied!</span>}
				</div>
			</div>
		</section>
	);
}
