import SandpackPlayground from "@/components/common/SandpackPlayground";
import { getCodeFramework, type FrameworkKey } from "@/components/common/codeExampleFrameworks";
import FrameworkBadge from "./FrameworkBadge";
import SectionHeading from "./SectionHeading";
import { getStepThreeSandpackSetup } from "./sandpackSetups";

type StepThreeRenderHtmlProps = {
	framework: FrameworkKey;
};

export default function StepThreeRenderHtml({ framework }: StepThreeRenderHtmlProps) {
	const item = getCodeFramework(framework);
	const setup = getStepThreeSandpackSetup(framework);

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-8'>
			<SectionHeading eyebrow='Step 3' title='HTML 렌더링' />
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
