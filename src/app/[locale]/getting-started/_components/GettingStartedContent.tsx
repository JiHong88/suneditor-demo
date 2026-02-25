"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_FRAMEWORK_KEY, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import StepOneCodeExamples from "./StepOneCodeExamples";
import StepTwoContentRendering from "./StepThreeRenderHtml";

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
				<p className='mt-3 text-sm text-muted-foreground md:text-base'>Install, create the editor, and display saved content.</p>
			</motion.section>
			<motion.div variants={sectionVariants}>
				<StepOneCodeExamples framework={framework} onFrameworkChange={setFramework} />
			</motion.div>
			<motion.div variants={sectionVariants}>
				<StepTwoContentRendering framework={framework} />
			</motion.div>

			{/* Playground CTA */}
			<motion.section className='mx-auto w-full max-w-6xl px-6 pt-6' variants={sectionVariants}>
				<div className='flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 px-8 py-10 text-center'>
					<Play className='h-8 w-8 text-primary' />
					<h3 className='text-lg font-semibold'>Try it live</h3>
					<p className='text-sm text-muted-foreground'>Real npm imports, full bundler — edit code and see the result instantly.</p>
					<Button asChild size='lg' className='mt-2 group'>
						<Link href='/playground'>
							Playground
							<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
						</Link>
					</Button>
				</div>
			</motion.section>
		</motion.div>
	);
}
