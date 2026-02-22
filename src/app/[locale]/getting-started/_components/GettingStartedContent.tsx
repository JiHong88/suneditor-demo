"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { DEFAULT_FRAMEWORK_KEY, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import StepOneCodeExamples from "./StepOneCodeExamples";
import StepTwoGetContents from "./StepTwoGetContents";
import StepThreeRenderHtml from "./StepThreeRenderHtml";

const pageVariants = {
	hidden: {},
	visible: {
		transition: {
			delayChildren: 0.06,
			staggerChildren: 0.08,
		},
	},
};

const sectionVariants = {
	hidden: { opacity: 0, y: 14 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.36, ease: "easeOut" as const },
	},
};

export default function GettingStartedContent() {
	const [framework, setFramework] = useState<FrameworkKey>(DEFAULT_FRAMEWORK_KEY);

	return (
		<motion.div className='min-h-screen pb-20' initial='hidden' animate='visible' variants={pageVariants}>
			<motion.section className='mx-auto w-full max-w-6xl px-6 pb-8 pt-10' variants={sectionVariants}>
				<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>Getting Started</h1>
				<p className='mt-3 text-sm text-muted-foreground md:text-base'>Install, get contents, and render saved HTML.</p>
			</motion.section>
			<motion.div variants={sectionVariants}>
				<StepOneCodeExamples framework={framework} onFrameworkChange={setFramework} />
			</motion.div>
			<motion.div variants={sectionVariants}>
				<StepTwoGetContents framework={framework} />
			</motion.div>
			<motion.div variants={sectionVariants}>
				<StepThreeRenderHtml framework={framework} />
			</motion.div>
		</motion.div>
	);
}
