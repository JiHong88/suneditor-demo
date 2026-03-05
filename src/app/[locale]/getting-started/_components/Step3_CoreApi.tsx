import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import SectionHeading from "./SectionHeading";
import CodeBlock from "@/components/common/CodeBlock";

const SNIPPET = `const editor = SunEditor.create('textarea', { /* options */ });

// $ — dependency bag (all internals)
editor.$.selection  // Selection handler
editor.$.format     // Block formatting
editor.$.history    // Undo/Redo stack
// ... and more`;

export default function Step3CoreApi() {
	const t = useTranslations("GettingStarted.step3");

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-14 pt-2'>
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("desc")} />

			<div className='mt-6'>
				<CodeBlock code={SNIPPET} lang='javascript' />
			</div>

			<div className='mt-6 flex flex-wrap gap-4'>
				<Link
					href='/docs-api'
					className='inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline'
				>
					{t("apiDocsLink")}
					<ArrowRight className='h-3.5 w-3.5' />
				</Link>
				<Link
					href='/deep-dive'
					className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:underline transition-colors'
				>
					{t("deepDiveLink")}
					<ArrowRight className='h-3.5 w-3.5' />
				</Link>
			</div>
		</section>
	);
}
