"use client";

import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/* ── Code constants ───────────────────────────────────── */

const THEME_USAGE = `import suneditor from 'suneditor';

// 1. Import the built-in theme CSS
import 'suneditor/src/themes/dark.css';

// 2. Pass theme name to options
const editor = suneditor.create(textarea, {
  theme: 'dark', // 'dark' | 'midnight' | 'cobalt' | 'cream'
});

// 3. Change theme at runtime
editor.$.ui.setTheme('midnight');
editor.$.ui.setTheme('');  // Reset to default`;

const THEME_STRUCTURE = `/* my-theme.css */
.sun-editor.se-theme-ocean,
.sun-editor-editable.se-theme-ocean {
  /* ===== Content Area ===== */

  /* Caret & placeholder */
  --se-caret-color: #e0f2fe;
  --se-drag-caret-color: #38bdf8;
  --se-placeholder-color: #64748b;

  /* Text */
  --se-edit-font-color: #e2e8f0;
  --se-edit-font-pre: #94a3b8;
  --se-edit-font-quote: #94a3b8;

  /* Background */
  --se-edit-background-color: #0f172a;
  --se-edit-background-pre: #1e293b;

  /* Borders */
  --se-edit-border-light: #334155;
  --se-edit-border-dark: #1e293b;
  --se-edit-border-dark-n1: #334155;
  --se-edit-border-dark-n2: #475569;
  --se-edit-border-table: #334155;

  /* Links */
  --se-edit-anchor: #38bdf8;
  --se-edit-anchor-on-back: #1e293b;
  --se-edit-anchor-on-font: #ffffff;
  --se-edit-hr-color: #475569;
  --se-edit-hr-on-back: #1e293b;

  /* States */
  --se-edit-active: #38bdf8;
  --se-edit-hover: #334155;
  --se-edit-outline: #1e293b;

  /* ===== Layout (Toolbar, Statusbar) ===== */

  --se-main-font-family: Helvetica Neue;
  --se-main-out-color: #020617;
  --se-main-color: #e2e8f0;
  --se-main-color-lighter: #94a3b8;
  --se-main-background-color: #0f172a;
  --se-code-view-color: #020617;
  --se-main-font-color: #e2e8f0;
  --se-code-view-background-color: #e2e8f0;
  --se-main-divider-color: #1e293b;
  --se-main-border-color: #334155;
  --se-main-outline-color: #1e293b;
  --se-main-shadow-color: #020617;
  --se-statusbar-font-color: #94a3b8;
  --se-overlay-background-color: rgba(0, 0, 0, 0.55);

  /* Hover states */
  --se-hover-color: #164e63;
  --se-hover-dark-color: #155e75;
  --se-hover-dark2-color: #0e7490;
  --se-hover-dark3-color: #0891b2;
  --se-hover-light-color: #22d3ee;
  --se-hover-light2-color: #67e8f9;
  --se-hover-light3-color: #a5f3fc;

  /* Active states */
  --se-active-color: #38bdf8;
  --se-active-hover-color: #7dd3fc;
  --se-active-dark-color: #0ea5e9;
  --se-active-dark2-color: #0284c7;
  --se-active-dark3-color: #38bdf8;
  --se-active-dark4-color: #0ea5e9;
  --se-active-dark5-color: #0369a1;

  --se-active-light-color: #082f49;
  --se-active-light2-color: #0c4a6e;
  --se-active-light3-color: #075985;
  --se-active-light4-color: #0369a1;
  --se-active-light5-color: #0284c7;
  --se-active-light6-color: #0ea5e9;

  /* Shadow & Drag */
  --se-shadow-layer-color: rgba(0, 0, 0, 0.4);
  --se-drag-over-color: #fbbf24;

  /* ===== Modal / Dropdown ===== */

  --se-modal-background-color: #1e293b;
  --se-modal-color: #e2e8f0;
  --se-modal-border-color: #334155;
  --se-modal-anchor-color: #38bdf8;
  --se-modal-preview-color: #94a3b8;
  --se-modal-file-input-background-color: #0f172a;
  --se-modal-input-disabled-color: #64748b;
  --se-modal-input-disabled-background-color: #1e293b;
  --se-dropdown-font-color: #e2e8f0;

  /* Controller */
  --se-controller-border-color: #334155;
  --se-controller-background-color: #1e293b;
  --se-controller-color: #e2e8f0;
  --se-shadow-controller-color: rgba(0, 0, 0, 0.4);

  /* Input buttons */
  --se-input-btn-border-color: #334155;
  --se-input-btn-disabled-color: #64748b;

  /* Table picker */
  --se-table-picker-color: #1e293b;
  --se-table-picker-border-color: #334155;
  --se-table-picker-highlight-color: #082f49;
  --se-table-picker-highlight-border-color: #38bdf8;

  /* ===== Status Colors ===== */

  --se-success-color: #22c55e;
  --se-success-dark-color: #16a34a;
  --se-success-dark2-color: #15803d;
  --se-success-dark3-color: #166534;
  --se-success-light-color: #4ade80;
  --se-success-light2-color: #86efac;
  --se-success-light3-color: #bbf7d0;
  --se-success-light4-color: #dcfce7;
  --se-success-light5-color: #f0fdf4;

  --se-error-color: #ef4444;
  --se-error-dark-color: #dc2626;
  --se-error-dark2-color: #b91c1c;
  --se-error-dark3-color: #991b1b;
  --se-error-light-color: #f87171;
  --se-error-light2-color: #fca5a5;
  --se-error-light3-color: #fecaca;
  --se-error-light4-color: #fee2e2;
  --se-error-light5-color: #fef2f2;

  /* Document mode */
  --se-doc-background: #1e293b;
  --se-doc-info-page-font-color: #0f172a;
  --se-doc-info-page-background-color: #94a3b8;
  --se-doc-info-font-color: #94a3b8;
  --se-doc-info-active-color: #38bdf8;

  /* Loading & Debug */
  --se-loading-color: #38bdf8;
  --se-show-blocks-color: #38bdf8;
  --se-show-blocks-li-color: #a855f7;
  --se-show-blocks-pre-color: #22c55e;
  --se-show-blocks-component-color: #f59e0b;
}`;

const THEME_APPLY = `// Import your custom theme CSS
import './my-theme.css';

const editor = suneditor.create(textarea, {
  theme: 'ocean',  // Must match the class name: se-theme-ocean
});`;

const VARIABLE_CATEGORIES = [
	{
		title: "Content Area",
		desc: "contentArea",
		vars: [
			{ name: "--se-caret-color", desc: "caretColor" },
			{ name: "--se-edit-font-color", desc: "editFontColor" },
			{ name: "--se-edit-background-color", desc: "editBackground" },
			{ name: "--se-edit-border-*", desc: "editBorder" },
			{ name: "--se-edit-anchor", desc: "editAnchor" },
			{ name: "--se-edit-active / hover / outline", desc: "editStates" },
		],
	},
	{
		title: "Layout Shell",
		desc: "layoutShell",
		vars: [
			{ name: "--se-main-background-color", desc: "mainBackground" },
			{ name: "--se-main-color", desc: "mainColor" },
			{ name: "--se-main-border-color", desc: "mainBorder" },
			{ name: "--se-hover-color (6 levels)", desc: "hoverLevels" },
			{ name: "--se-active-color (11 levels)", desc: "activeLevels" },
		],
	},
	{
		title: "Modal & Dropdown",
		desc: "modalDropdown",
		vars: [
			{ name: "--se-modal-background-color", desc: "modalBackground" },
			{ name: "--se-modal-color", desc: "modalColor" },
			{ name: "--se-dropdown-font-color", desc: "dropdownFont" },
			{ name: "--se-controller-*", desc: "controller" },
		],
	},
	{
		title: "Status Colors",
		desc: "statusColors",
		vars: [
			{ name: "--se-success-color (9 levels)", desc: "successLevels" },
			{ name: "--se-error-color (9 levels)", desc: "errorLevels" },
			{ name: "--se-loading-color", desc: "loadingColor" },
		],
	},
];

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
