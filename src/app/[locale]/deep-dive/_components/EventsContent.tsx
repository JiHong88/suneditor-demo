"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
	EVENTS_BASIC, EVENTS_INPUT, EVENTS_CLIPBOARD, EVENTS_IMAGE, EVENTS_UI, EVENTS_FOCUS,
	EVENT_LIST, CATEGORY_COLORS,
} from "@/data/code-examples/eventSnippets";

/* ── Component ────────────────────────────────────────── */

export default function EventsContent() {
	const t = useTranslations("DeepDive.events");

	const categories = [...new Set(EVENT_LIST.map((e) => e.category))];

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["event-overview", "basic-events"]} className='space-y-1'>
				{/* 1. Event Overview */}
				<AccordionItem value='event-overview'>
					<AccordionTrigger className='text-base font-semibold'>{t("overview")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("overviewDesc")}</p>

						<div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
							{categories.map((cat) => {
								const count = EVENT_LIST.filter((e) => e.category === cat).length;
								return (
									<div key={cat} className='flex items-center gap-2 text-xs'>
										<Badge variant='secondary' className={CATEGORY_COLORS[cat]}>
											{t(`cat.${cat}`)}
										</Badge>
										<span className='text-muted-foreground'>{count}</span>
									</div>
								);
							})}
						</div>

						<div className='rounded-lg border overflow-x-auto max-h-[400px] overflow-y-auto'>
							<table className='w-full text-xs'>
								<thead className='sticky top-0 bg-muted/90 backdrop-blur-sm'>
									<tr>
										<th className='text-start px-3 py-2 font-semibold'>Event</th>
										<th className='text-start px-3 py-2 font-semibold'>{t("category")}</th>
										<th className='text-start px-3 py-2 font-semibold'>{t("returnType")}</th>
									</tr>
								</thead>
								<tbody>
									{EVENT_LIST.map((evt) => (
										<tr key={evt.name} className='border-t border-border/50'>
											<td className='px-3 py-1.5'>
												<code className='font-mono text-[11px]'>{evt.name}</code>
											</td>
											<td className='px-3 py-1.5'>
												<Badge variant='secondary' className={`text-[10px] ${CATEGORY_COLORS[evt.category]}`}>
													{t(`cat.${evt.category}`)}
												</Badge>
											</td>
											<td className='px-3 py-1.5 text-muted-foreground'>
												{evt.returnType ? (
													<code className='font-mono text-[10px] bg-muted px-1 rounded'>{evt.returnType}</code>
												) : (
													<span className='text-[10px]'>void</span>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. Basic Events */}
				<AccordionItem value='basic-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("basicEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("basicEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_BASIC} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 3. Input & Keyboard */}
				<AccordionItem value='input-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("inputEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("inputEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_INPUT} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 4. Clipboard */}
				<AccordionItem value='clipboard-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("clipboardEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("clipboardEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_CLIPBOARD} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 5. Image Upload */}
				<AccordionItem value='image-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("imageEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("imageEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_IMAGE} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 6. Focus Management */}
				<AccordionItem value='focus-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("focusEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("focusEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_FOCUS} lang='javascript' />
						</div>
						<div className='rounded-lg border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4'>
							<h4 className='text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2'>{t("focusTip")}</h4>
							<p className='text-xs text-muted-foreground'>{t("focusTipDesc")}</p>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 7. UI Events */}
				<AccordionItem value='ui-events'>
					<AccordionTrigger className='text-base font-semibold'>{t("uiEvents")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>{t("uiEventsDesc")}</p>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={EVENTS_UI} lang='javascript' />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
