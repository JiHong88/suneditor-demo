import { Package, Puzzle, Languages, Blocks, FileCode } from "lucide-react";
import { useTranslations } from "next-intl";

const highlightMeta = [
	{ key: "zeroDependencies" as const, icon: <Package className='h-5 w-5' />, className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400" },
	{ key: "plugins" as const, icon: <Puzzle className='h-5 w-5' />, className: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
	{ key: "languages" as const, icon: <Languages className='h-5 w-5' />, className: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400" },
	{ key: "pluginAPI" as const, icon: <Blocks className='h-5 w-5' />, className: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" },
	{ key: "typescript" as const, icon: <FileCode className='h-5 w-5' />, className: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400" },
];

export default function FeatureHighlights() {
	const t = useTranslations("Home.FeatureHighlights");

	return (
		<section className='container mx-auto px-4 py-8 md:py-10'>
			<div className='flex flex-wrap items-center justify-center gap-3 md:gap-5'>
				{highlightMeta.map((item) => (
					<div key={item.key} className='flex items-center gap-2.5 rounded-full border px-4 py-2 bg-background/80 backdrop-blur-sm'>
						<span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.className}`}>{item.icon}</span>
						<span className='text-sm font-medium'>{t(item.key)}</span>
					</div>
				))}
			</div>
		</section>
	);
}
