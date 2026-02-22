import SandpackPlayground from "@/components/common/SandpackPlayground";
import { getCodeFramework, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import FrameworkBadge from "./FrameworkBadge";
import SectionHeading from "./SectionHeading";
import { getStepTwoSandpackSetup } from "./sandpackSetups";

type StepTwoGetContentsProps = {
	framework: FrameworkKey;
};

export default function StepTwoGetContents({ framework }: StepTwoGetContentsProps) {
	const item = getCodeFramework(framework);
	const setup = getStepTwoSandpackSetup(framework);

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-14'>
			<SectionHeading eyebrow='Step 2' title='getContents' />
			<div className='mt-4'>
				<FrameworkBadge framework={framework} />
			</div>
			<div className='mt-8'>
				<SandpackPlayground
					template={setup.template}
					files={setup.files}
					customSetup={setup.customSetup}
					activeFile={setup.activeFile}
					accentColor={item.accent}
				/>
			</div>
		</section>
	);
}
