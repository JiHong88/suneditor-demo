"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/* ── Code constants ───────────────────────────────────── */

const DIR_STRUCTURE = `suneditor/
├── src/
│   ├── suneditor.js         # Factory entry point (create, init)
│   ├── events.js            # User event definitions
│   ├── typedef.js           # JSDoc type definitions
│   ├── core/
│   │   ├── editor.js        # Main Editor class (public API)
│   │   ├── kernel/          # L1: Dependency container & state
│   │   │   ├── coreKernel.js
│   │   │   ├── store.js
│   │   │   └── kernelInjector.js
│   │   ├── config/          # L2: Configuration & providers
│   │   │   ├── contextProvider.js
│   │   │   ├── optionProvider.js
│   │   │   ├── instanceCheck.js
│   │   │   └── eventManager.js
│   │   ├── logic/           # L3: Business logic
│   │   │   ├── dom/         # selection, html, format, inline, ...
│   │   │   ├── shell/       # component, history, pluginManager, ...
│   │   │   └── panel/       # toolbar, menu, viewer
│   │   ├── event/           # L4: Event orchestration (Redux-like)
│   │   │   ├── eventOrchestrator.js
│   │   │   ├── executor.js
│   │   │   ├── handlers/    # DOM event listeners
│   │   │   ├── reducers/    # Event analyzers
│   │   │   ├── rules/       # Key rules (enter, backspace, ...)
│   │   │   └── effects/     # Side-effect handlers
│   │   ├── schema/          # context, frameContext, options
│   │   └── section/         # DOM construction
│   ├── plugins/             # Modular features
│   │   ├── command/         # blockquote, list_bulleted, exportPDF, ...
│   │   ├── dropdown/        # align, font, fontColor, table/, ...
│   │   ├── modal/           # image/, video/, link, math, audio, ...
│   │   ├── browser/         # Gallery plugins
│   │   ├── field/           # mention
│   │   └── input/           # fontSize, pageNavigator
│   ├── modules/             # UI components (Modal, Controller, ...)
│   ├── hooks/               # Hook interface definitions
│   ├── interfaces/          # Plugin base classes & contracts
│   ├── helper/              # Pure utility functions
│   ├── assets/              # Icons, CSS, design
│   ├── langs/               # i18n language files
│   └── themes/              # CSS theme files
├── test/                    # Unit, integration, E2E tests
├── types/                   # Generated TypeScript definitions
└── dist/                    # Built bundles`;

const CMD_DEV = `npm run dev              # Start local dev server (http://localhost:8088)
npm start               # Alias for npm run dev`;

const CMD_BUILD = `npm run build:dev       # Build for development (with source maps)
npm run build:prod      # Build for production (minified)`;

const CMD_TEST = `npm test                # Run Jest unit tests (silent mode)
npm run test:watch      # Run Jest in watch mode
npm run test:coverage   # Run tests with coverage report
npm run test:e2e        # Run Playwright E2E tests
npm run test:e2e:ui     # Run E2E tests with Playwright UI
npm run test:all        # Run all tests (Jest + Playwright)`;

const CMD_LINT = `npm run lint            # ESLint + TypeScript check + Architecture check
npm run lint:type       # TypeScript type checking
npm run lint:fix-all    # Fix all lint issues (JS + TS)
npm run check:arch      # Check architecture dependencies`;

const GITHUB_GUIDE_URL = "https://github.com/JiHong88/SunEditor/blob/v3-dev/GUIDE.md";

/* ── Component ────────────────────────────────────────── */

export default function GuideContent() {
	const t = useTranslations("DeepDive.guide");

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["directory-structure", "essential-commands"]} className='space-y-1'>
				{/* 1. Directory Structure */}
				<AccordionItem value='directory-structure'>
					<AccordionTrigger className='text-base font-semibold'>{t("directoryStructure")}</AccordionTrigger>
					<AccordionContent>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={DIR_STRUCTURE} lang='text' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. Essential Commands */}
				<AccordionItem value='essential-commands'>
					<AccordionTrigger className='text-base font-semibold'>{t("essentialCommands")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<h4 className='text-sm font-semibold'>Development</h4>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={CMD_DEV} lang='bash' />
						</div>
						<h4 className='text-sm font-semibold mt-3'>Building</h4>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={CMD_BUILD} lang='bash' />
						</div>
						<h4 className='text-sm font-semibold mt-3'>Testing</h4>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={CMD_TEST} lang='bash' />
						</div>
						<h4 className='text-sm font-semibold mt-3'>Linting</h4>
						<div className='rounded-lg border overflow-x-auto'>
							<CodeBlock code={CMD_LINT} lang='bash' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 3. Naming Conventions */}
				<AccordionItem value='naming-conventions'>
					<AccordionTrigger className='text-base font-semibold'>{t("namingConventions")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<div className='grid sm:grid-cols-2 gap-4'>
							<div>
								<h4 className='text-sm font-semibold mb-2'>File Naming</h4>
								<ul className='text-xs text-muted-foreground space-y-1 list-disc list-inside'>
									<li><strong>JavaScript:</strong> camelCase (<code className='bg-muted px-1 rounded'>selection.js</code>)</li>
									<li><strong>Classes:</strong> Match class name (<code className='bg-muted px-1 rounded'>Modal.js</code>)</li>
									<li><strong>Plugins:</strong> Match key (<code className='bg-muted px-1 rounded'>blockquote.js</code>)</li>
								</ul>
							</div>
							<div>
								<h4 className='text-sm font-semibold mb-2'>Code Naming</h4>
								<ul className='text-xs text-muted-foreground space-y-1 list-disc list-inside'>
									<li><strong>Classes:</strong> PascalCase (<code className='bg-muted px-1 rounded'>CoreKernel</code>)</li>
									<li><strong>Functions:</strong> camelCase (<code className='bg-muted px-1 rounded'>getRange</code>)</li>
									<li><strong>Private:</strong> <code className='bg-muted px-1 rounded'>#privateField</code> (ES2022)</li>
									<li><strong>Constants:</strong> UPPER_SNAKE_CASE</li>
								</ul>
							</div>
							<div>
								<h4 className='text-sm font-semibold mb-2'>Plugin Naming</h4>
								<ul className='text-xs text-muted-foreground space-y-1 list-disc list-inside'>
									<li><strong>Keys:</strong> lowercase (<code className='bg-muted px-1 rounded'>&apos;image&apos;</code>, <code className='bg-muted px-1 rounded'>&apos;blockStyle&apos;</code>)</li>
									<li><strong>Types:</strong> lowercase (<code className='bg-muted px-1 rounded'>&apos;command&apos;</code>, <code className='bg-muted px-1 rounded'>&apos;modal&apos;</code>)</li>
									<li><strong>Class names:</strong> PascalCase</li>
								</ul>
							</div>
							<div>
								<h4 className='text-sm font-semibold mb-2'>CSS Naming</h4>
								<ul className='text-xs text-muted-foreground space-y-1 list-disc list-inside'>
									<li><strong>Prefix:</strong> All classes start with <code className='bg-muted px-1 rounded'>se-</code></li>
									<li><strong>Components:</strong> <code className='bg-muted px-1 rounded'>se-component</code>, <code className='bg-muted px-1 rounded'>se-flex-component</code></li>
								</ul>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 4. Common Pitfalls */}
				<AccordionItem value='common-pitfalls'>
					<AccordionTrigger className='text-base font-semibold'>{t("commonPitfalls")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<div className='grid sm:grid-cols-2 gap-4'>
							<div className='rounded-lg border border-red-200 dark:border-red-900/50 p-4'>
								<h4 className='text-sm font-semibold text-red-600 dark:text-red-400 mb-2'>DON&apos;T</h4>
								<ul className='text-xs text-muted-foreground space-y-1.5 list-disc list-inside'>
									<li>Use innerHTML directly on wysiwyg frame</li>
									<li>Access frameRoots directly</li>
									<li>Register events without EventManager</li>
									<li>Use document.execCommand</li>
									<li>Create plugin without extending base class</li>
									<li>Access deps directly from kernel</li>
								</ul>
							</div>
							<div className='rounded-lg border border-green-200 dark:border-green-900/50 p-4'>
								<h4 className='text-sm font-semibold text-green-600 dark:text-green-400 mb-2'>DO</h4>
								<ul className='text-xs text-muted-foreground space-y-1.5 list-disc list-inside'>
									<li>Use this.$.html for content manipulation</li>
									<li>Use this.$.frameContext and this.$.frameOptions</li>
									<li>Register events via this.$.eventManager</li>
									<li>Use this.$.format for block-level formatting</li>
									<li>Check types with dom.check methods (iframe-safe)</li>
									<li>Follow Redux pattern for event handling</li>
								</ul>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* GitHub link for full details */}
			<a
				href={GITHUB_GUIDE_URL}
				target='_blank'
				rel='noopener noreferrer'
				className='flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors'
			>
				<ExternalLink className='size-4 shrink-0' />
				<div>
					<span className='font-medium text-foreground'>Full Developer Guide</span>
					<p className='text-xs mt-0.5'>Plugin System, Modules & Helpers, Options & Context, Architecture Overview, Plugin Registration Flow — view the complete GUIDE.md on GitHub</p>
				</div>
			</a>
		</div>
	);
}
