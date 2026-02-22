import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCodeFramework, hexToRgba, type FrameworkKey } from "@/components/common/codeExampleFrameworks";

type FrameworkBadgeProps = {
	framework: FrameworkKey;
	className?: string;
};

export default function FrameworkBadge({ framework, className }: FrameworkBadgeProps) {
	const item = getCodeFramework(framework);

	return (
		<div
			className={cn("inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium", className)}
			style={{
				borderColor: hexToRgba(item.accent, 0.5),
				backgroundColor: hexToRgba(item.accent, 0.08),
			}}
		>
			<Image src={item.icon} alt={`${item.name} logo`} width={16} height={16} className='h-4 w-4' />
			<span>{item.name}</span>
			<span className='rounded border border-current/20 bg-background/80 px-1.5 py-0.5 text-[10px] uppercase text-muted-foreground'>{item.kind}</span>
		</div>
	);
}
