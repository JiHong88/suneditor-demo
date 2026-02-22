import CodeExamples from "@/components/common/CodeExamples";
import { type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import SectionHeading from "./SectionHeading";
import FrameworkBadge from "./FrameworkBadge";

type StepOneCodeExamplesProps = {
	framework: FrameworkKey;
	onFrameworkChange: (framework: FrameworkKey) => void;
};

export default function StepOneCodeExamples({ framework, onFrameworkChange }: StepOneCodeExamplesProps) {
	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-14 pt-2'>
			<SectionHeading eyebrow='Step 1' title='Install' />
			<div className='mt-4'>
				<FrameworkBadge framework={framework} />
			</div>
			<div className='mt-6'>
				<CodeExamples compact framework={framework} onFrameworkChange={onFrameworkChange} />
			</div>
		</section>
	);
}
