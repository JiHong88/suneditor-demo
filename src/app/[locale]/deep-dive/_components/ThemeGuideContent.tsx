"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { THEME_USAGE, THEME_STRUCTURE, THEME_APPLY, VARIABLE_CATEGORIES } from "@/data/snippets/themeSnippets";

/* ── Component ────────────────────────────────────────── */

export default function ThemeGuideContent() {
	const t = useTranslations("DeepDive.theme");

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["built-in-themes", "css-variables", "custom-theme"]} className='space-y-1'>
				{/* 1. Built-in Themes */}
				<AccordionItem value='built-in-themes'>
					<AccordionTrigger className='text-base font-semibold'>{t("builtInThemes")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("builtInThemesDesc")}</p>
						<div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
							{[
								{ name: "dark", label: "Dark", bg: "#282c34", fg: "#d7dae0", accent: "#56b6c2" },
								{ name: "midnight", label: "Midnight", bg: "#212121", fg: "#e0e0e0", accent: "#bb86fc" },
								{ name: "cobalt", label: "Cobalt", bg: "#0f1828", fg: "#e8eaed", accent: "#89ddff" },
								{ name: "cream", label: "Cream", bg: "#efe7d3", fg: "#5c5040", accent: "#d4a06a" },
							].map((theme) => (
								<div
									key={theme.name}
									className='rounded-lg border overflow-hidden'
								>
									<div
										className='h-16 flex items-center justify-center text-xs font-mono'
										style={{ backgroundColor: theme.bg, color: theme.fg }}
									>
										<span style={{ color: theme.accent }}>{"// "}</span>
										{theme.label}
									</div>
									<div className='px-3 py-2 text-center'>
										<code className='text-xs bg-muted px-1.5 py-0.5 rounded'>se-theme-{theme.name}</code>
									</div>
								</div>
							))}
						</div>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={THEME_USAGE} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. CSS Variable Reference */}
				<AccordionItem value='css-variables'>
					<AccordionTrigger className='text-base font-semibold'>{t("cssVariables")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("cssVariablesDesc")}</p>
						<div className='grid sm:grid-cols-2 gap-4'>
							{VARIABLE_CATEGORIES.map((cat) => (
								<div key={cat.title} className='rounded-lg border p-4'>
									<h4 className='text-sm font-semibold mb-2'>{cat.title}</h4>
									<p className='text-xs text-muted-foreground mb-3'>{t(`varDesc.${cat.desc}`)}</p>
									<ul className='space-y-1'>
										{cat.vars.map((v) => (
											<li key={v.name} className='flex items-start gap-2 text-xs'>
												<code className='bg-muted px-1 rounded shrink-0 font-mono text-[11px]'>{v.name}</code>
												<span className='text-muted-foreground'>{t(`varDesc.${v.desc}`)}</span>
											</li>
										))}
									</ul>
								</div>
							))}
						</div>
						<div className='rounded-lg border border-dashed p-3'>
							<p className='text-xs text-muted-foreground'>
								{t("totalVars")}
							</p>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 3. Custom Theme Example */}
				<AccordionItem value='custom-theme'>
					<AccordionTrigger className='text-base font-semibold'>{t("customTheme")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("customThemeDesc")}</p>

						<div className='space-y-2'>
							<h4 className='text-sm font-semibold'>{t("step1")}</h4>
							<p className='text-xs text-muted-foreground'>{t("step1Desc")}</p>
						</div>

						<div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
							<span>{t("tip1")}</span>
							<a
								href='https://github.com/JiHong88/suneditor/blob/master/src/themes/dark.css'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-0.5 text-primary hover:underline font-medium'
							>
								dark.css
								<svg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6'/><polyline points='15 3 21 3 21 9'/><line x1='10' y1='14' x2='21' y2='3'/></svg>
							</a>
						</div>

						<div className='rounded-lg border overflow-x-auto max-h-[500px] overflow-y-auto'>
							<CodeBlock code={THEME_STRUCTURE} lang='css' />
						</div>

						<div className='space-y-2'>
							<h4 className='text-sm font-semibold'>{t("step2")}</h4>
							<p className='text-xs text-muted-foreground'>{t("step2Desc")}</p>
						</div>

						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={THEME_APPLY} lang='javascript' />
						</div>

						<div className='rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4'>
							<h4 className='text-sm font-semibold text-amber-700 dark:text-amber-400 mb-2'>{t("tips")}</h4>
							<ul className='text-xs text-muted-foreground space-y-1.5 list-disc list-inside'>
								<li>{t("tip1")}</li>
								<li>{t("tip2")}</li>
								<li>{t("tip3")}</li>
								<li>{t("tip4")}</li>
							</ul>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
