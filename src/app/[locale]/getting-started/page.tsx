"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { DEFAULT_FRAMEWORK_KEY, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import Step1_CodeExamples from "./_components/Step1_CodeExamples";
import Step2_RenderHtml from "./_components/Step2_RenderHtml";
import Step3_CoreApi from "./_components/Step3_CoreApi";

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

export default function GettingStartedPage() {
	const t = useTranslations("GettingStarted");
	const t_menus = useTranslations("Main.Menus");
	const [framework, setFramework] = useState<FrameworkKey>(DEFAULT_FRAMEWORK_KEY);

	return (
		<motion.div className='min-h-screen pb-20' initial='hidden' animate='visible' variants={pageVariants}>
			<motion.section className='mx-auto w-full max-w-6xl px-6 pb-8 pt-10' variants={sectionVariants}>
				<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
				<p className='mt-3 text-sm text-muted-foreground md:text-base'>
					{t("desc")}
				</p>
			</motion.section>
			<motion.div variants={sectionVariants}>
				<Step1_CodeExamples framework={framework} onFrameworkChange={setFramework} />
			</motion.div>
			<motion.div variants={sectionVariants}>
				<Step2_RenderHtml framework={framework} />
			</motion.div>
			<motion.div variants={sectionVariants}>
				<Step3_CoreApi />
			</motion.div>

			{/* Playground CTA */}
			<motion.section className='mx-auto w-full max-w-6xl px-6 pt-6' variants={sectionVariants}>
				<div className='flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 px-8 py-10 text-center'>
					<Play className='h-8 w-8 text-primary' />
					<h3 className='text-lg font-semibold'>{t("cta.title")}</h3>
					<p className='text-sm text-muted-foreground'>
						{t("cta.desc")}
					</p>
					<Button asChild size='lg' className='mt-2 group'>
						<Link href='/playground'>
							{t_menus("playground")}
							<ArrowRight className='ms-2 h-4 w-4 transition-transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1' />
						</Link>
					</Button>
				</div>
			</motion.section>
		</motion.div>
	);
}
