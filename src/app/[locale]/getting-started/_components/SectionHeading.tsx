import { cn } from "@/lib/utils";

type SectionHeadingProps = {
	title: string;
	description?: string;
	eyebrow?: string;
	className?: string;
};

export default function SectionHeading({ title, description, eyebrow, className }: SectionHeadingProps) {
	return (
		<div className={cn("w-full", className)}>
			{eyebrow ? (
				<div className='inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-[0.08em] text-primary uppercase'>
					<span className='h-1.5 w-1.5 rounded-full bg-primary' />
					{eyebrow}
				</div>
			) : null}
			<h2 className='mt-3 text-2xl font-semibold tracking-tight md:text-3xl'>{title}</h2>
			{description ? <p className='mt-3 text-sm text-muted-foreground md:text-base'>{description}</p> : null}
			<div className='mt-5 h-px w-full bg-gradient-to-r from-primary/40 via-border to-transparent' />
		</div>
	);
}
