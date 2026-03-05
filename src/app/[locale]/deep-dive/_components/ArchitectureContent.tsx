"use client";

import { useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";
import CodeBlock from "@/components/common/CodeBlock";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

/* ── Styled table helper ──────────────────────────────── */
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
	return (
		<div className='overflow-x-auto my-4'>
			<table className='w-full text-xs border-collapse'>
				<thead>
					<tr>
						{headers.map((h) => (
							<th key={h} className='border border-border bg-muted/50 px-3 py-2 text-left font-semibold'>
								{h}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, i) => (
						<tr key={i}>
							{row.map((cell, j) => (
								<td key={j} className='border border-border px-3 py-2 align-top'>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

/* ── Code constants ───────────────────────────────────── */

const ARCH_DIAGRAM = `┌─────────────────────────────────────────────────────────────────┐
│                        suneditor.js                             │
│                    (Factory Entry Point)                        │
│  • create(target, options) → new Editor()                       │
│  • init(options) → { create() }                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │ creates
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                         editor.js                               │
│                  (Main Editor Class - Facade)                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    CoreKernel (L1)                        │  │
│  │          Dependency Container & Orchestrator              │  │
│  │                                                           │  │
│  │  ┌──────────┐  ┌────────────────────────────────────┐     │  │
│  │  │  Store   │  │  $ (Deps bag)                      │     │  │
│  │  │ #state   │  │  All dependencies in one object    │     │  │
│  │  │ mode     │  │  Shared with all consumers         │     │  │
│  │  └──────────┘  └────────────────────────────────────┘     │  │
│  │                                                           │  │
│  │  L2: Config ─── contextProvider, optionProvider,          │  │
│  │                 instanceCheck, eventManager               │  │
│  │                                                           │  │
│  │  L3: Logic ──── dom/ (selection, format, inline, html)    │  │
│  │                 shell/ (component, history, pluginManager) │  │
│  │                 panel/ (toolbar, menu, viewer)             │  │
│  │                                                           │  │
│  │  L4: Event ──── EventOrchestrator                         │  │
│  │                 (handlers → reducers → rules → effects)   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘`;

const DEP_RULES = `Allowed dependency direction:

  L1 (Core) ─── orchestrates all layers
       ↓
  L2 (Config) ─── available to L3/L4 via $
       ↓
  L3 (Logic)  ─── cross-references via $ only (no direct imports)
       ↓
  L4 (Event)  ─── accesses L2/L3 via $
       ↓
  Helper      ─── pure utilities, all layers can import`;

const GITHUB_ARCHITECTURE_URL = "https://github.com/JiHong88/SunEditor/blob/v3-dev/ARCHITECTURE.md";

/* ── Component ────────────────────────────────────────── */

export default function ArchitectureContent() {
	const t = useTranslations("DeepDive.arch");

	return (
		<div className='space-y-6'>
			<Accordion type='multiple' defaultValue={["design-philosophy", "high-level-arch"]} className='space-y-1'>
				{/* 1. Design Philosophy */}
				<AccordionItem value='design-philosophy'>
					<AccordionTrigger className='text-base font-semibold'>{t("designPhilosophy")}</AccordionTrigger>
					<AccordionContent className='space-y-3'>
						<p className='text-sm text-muted-foreground'>SunEditor is architected as a WYSIWYG editor with these core constraints:</p>
						<div className='grid sm:grid-cols-3 gap-3'>
							<div className='rounded-lg border p-3'>
								<Badge variant='outline' className='mb-2'>Zero Dependencies</Badge>
								<p className='text-xs text-muted-foreground'>No frameworks (React/Vue/Angular) or libraries (jQuery/Lodash) in the core.</p>
							</div>
							<div className='rounded-lg border p-3'>
								<Badge variant='outline' className='mb-2'>Vanilla JavaScript</Badge>
								<p className='text-xs text-muted-foreground'>Written in modern ES2022+, utilizing native browser APIs.</p>
							</div>
							<div className='rounded-lg border p-3'>
								<Badge variant='outline' className='mb-2'>State-aware Editing</Badge>
								<p className='text-xs text-muted-foreground'>Internal state management in addition to native contentEditable behavior.</p>
							</div>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* 2. High-Level Architecture */}
				<AccordionItem value='high-level-arch'>
					<AccordionTrigger className='text-base font-semibold'>{t("highLevelArch")}</AccordionTrigger>
					<AccordionContent className='space-y-4'>
						<p className='text-sm text-muted-foreground'>The system follows a layered architecture with a central Dependency Injection (DI) container.</p>
						<div className='rounded-lg border bg-muted/30 overflow-x-auto'>
							<CodeBlock code={ARCH_DIAGRAM} lang='text' />
						</div>
						<Table
							headers={["Layer", "Directory", "Responsibility", "Components"]}
							rows={[
								["L1: Core", "kernel/", "Dependency container & state", "CoreKernel, Store, KernelInjector"],
								["L2: Config", "config/", "Environment & options", "ContextProvider, OptionProvider, InstanceCheck, EventManager"],
								["L3: Logic", "logic/", "Core editing logic", "Selection, Format, History, PluginManager, Toolbar, Component"],
								["L4: Event", "event/", "Input orchestration", "EventOrchestrator (Redux-style event pipeline)"],
							]}
						/>
						<h4 className='text-sm font-semibold mt-4'>Layer Dependency Rules</h4>
						<p className='text-xs text-muted-foreground'>Dependency boundaries are enforced at build time via dependency-cruiser.</p>
						<div className='rounded-lg border bg-muted/30 overflow-x-auto'>
							<CodeBlock code={DEP_RULES} lang='text' />
						</div>
						<Table
							headers={["Rule", "Description"]}
							rows={[
								["Helper isolation", "helper/* cannot import from any other layer"],
								["Module isolation", "modules/* cannot import core/* or plugins/* — receives $ via constructor"],
								["Plugin isolation", "Plugins cannot import other plugins (same plugin submodules OK)"],
								["No circular deps", "No module can import from a module that imports it"],
							]}
						/>
					</AccordionContent>
				</AccordionItem>
			</Accordion>

			{/* GitHub link for full details */}
			<a
				href={GITHUB_ARCHITECTURE_URL}
				target='_blank'
				rel='noopener noreferrer'
				className='flex items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors'
			>
				<ExternalLink className='size-4 shrink-0' />
				<div>
					<span className='font-medium text-foreground'>Full Architecture Documentation</span>
					<p className='text-xs mt-0.5'>CoreKernel & DI, State Management, Content Model, Multi-Root, Plugin Architecture, Event System — view the complete ARCHITECTURE.md on GitHub</p>
				</div>
			</a>
		</div>
	);
}
