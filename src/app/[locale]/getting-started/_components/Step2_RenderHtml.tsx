"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { getCodeFramework, hexToRgba, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import CodeBlock from "@/components/common/CodeBlock";
import CopyButton from "@/components/common/CopyButton";
import FrameworkBadge from "./FrameworkBadge";
import TroubleshootingHint from "@/components/common/TroubleshootingHint";
import SectionHeading from "./SectionHeading";
import { getRenderSnippet } from "@/data/snippets/renderSnippets";

type StepTwoProps = {
	framework: FrameworkKey;
};

export default function StepTwoContentRendering({ framework }: StepTwoProps) {
	const t = useTranslations("GettingStarted.step2");
	const item = getCodeFramework(framework);
	const snippet = getRenderSnippet(framework);

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-8'>
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("desc")} />
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
					<CopyButton text={snippet.code} className='absolute top-4 right-4 z-10 size-8 hover:bg-accent' />
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
				</div>
			</div>
			<TroubleshootingHint ids={["contents", "stripped"]} className='mt-6' />
		</section>
	);
}
