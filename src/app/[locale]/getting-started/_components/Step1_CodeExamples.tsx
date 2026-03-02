import { useTranslations } from "next-intl";
import CodeExamples from "@/components/common/CodeExamples";
import { type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import SectionHeading from "./SectionHeading";
import FrameworkBadge from "./FrameworkBadge";

type StepOneCodeExamplesProps = {
	framework: FrameworkKey;
	onFrameworkChange: (framework: FrameworkKey) => void;
};

export default function StepOneCodeExamples({ framework, onFrameworkChange }: StepOneCodeExamplesProps) {
	const t = useTranslations("GettingStarted.step1");

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-14 pt-2'>
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} />
			<div className='mt-4'>
				<FrameworkBadge framework={framework} />
			</div>
			<div className='mt-6'>
				<CodeExamples compact framework={framework} onFrameworkChange={onFrameworkChange} />
			</div>
		</section>
	);
}
