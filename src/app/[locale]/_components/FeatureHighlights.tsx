import { Package, Puzzle, Languages, Blocks, FileCode } from "lucide-react";

const highlights = [
	{
		icon: <Package className='h-5 w-5' />,
		text: "Zero Dependencies",
		className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
	},
	{
		icon: <Puzzle className='h-5 w-5' />,
		text: "30+ Plugins",
		className: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
	},
	{
		icon: <Languages className='h-5 w-5' />,
		text: "25+ Languages · RTL",
		className: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
	},
	{
		icon: <Blocks className='h-5 w-5' />,
		text: "Custom Plugin API",
		className: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
	},
{
		icon: <FileCode className='h-5 w-5' />,
		text: "TypeScript Support",
		className: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
	},
];

export default function FeatureHighlights() {
	return (
		<section className='container mx-auto px-4 py-8 md:py-10'>
			<div className='flex flex-wrap items-center justify-center gap-3 md:gap-5'>
				{highlights.map((item) => (
					<div key={item.text} className='flex items-center gap-2.5 rounded-full border px-4 py-2 bg-background/80 backdrop-blur-sm'>
						<span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.className}`}>{item.icon}</span>
						<span className='text-sm font-medium'>{item.text}</span>
					</div>
				))}
			</div>
		</section>
	);
}
