import { cn } from "@/lib/utils";
import { hexToRgba } from "@/components/common/codeExampleFrameworks";

type CodePanelProps = {
	code: string;
	title?: string;
	description?: string;
	language?: "bash" | "html" | "tsx" | "ts" | "js";
	accentColor?: string;
	className?: string;
};

export default function CodePanel({ code, title, description, language = "bash", accentColor, className }: CodePanelProps) {
	const languageLabel = language.toUpperCase();

	return (
		<div
			className={cn("overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-sm", className)}
			style={
				accentColor
					? {
							borderColor: hexToRgba(accentColor, 0.6),
							boxShadow: `inset 0 0 0 1px ${hexToRgba(accentColor, 0.15)}`,
						}
					: undefined
			}
		>
			<div className='flex items-start justify-between gap-3 border-b border-border/70 bg-muted/20 px-4 py-3'>
				<div className='min-w-0'>
					{title ? <h3 className='text-sm font-semibold tracking-tight'>{title}</h3> : <h3 className='text-sm font-semibold tracking-tight'>Code</h3>}
					{description ? <p className='mt-1 text-xs text-muted-foreground'>{description}</p> : null}
				</div>
				<span className='shrink-0 rounded-md border border-border/80 bg-background px-2 py-0.5 text-[11px] font-semibold text-muted-foreground'>{languageLabel}</span>
			</div>
			<pre className='overflow-x-auto bg-muted/10 p-4 text-xs leading-6 md:text-sm'>
				<code className={`language-${language}`}>{code}</code>
			</pre>
		</div>
	);
}
