import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import SectionHeading from "./SectionHeading";

/* ── $ Kernel data from coreKernel.js ───────────────── */

type DepEntry = {
	name: string;
	desc: string;
	/** Provider this property originates from (for convenience accessors) */
	from?: string;
	/** Whether this is a getter on the source provider */
	getter?: boolean;
};

type DepGroup = {
	label: string;
	layer: string;
	entries: DepEntry[];
};

const KERNEL_DEPS: DepGroup[] = [
	{
		label: "Kernel (L1)",
		layer: "L1",
		entries: [
			{ name: "facade", desc: "Editor instance (public API)" },
			{ name: "store", desc: "Central state store" },
		],
	},
	{
		label: "Config (L2)",
		layer: "L2",
		entries: [
			{ name: "contextProvider", desc: "Context / FrameContext management" },
			{ name: "optionProvider", desc: "Options / FrameOptions management" },
			{ name: "instanceCheck", desc: "Iframe-safe type checks" },
			{ name: "eventManager", desc: "Public event registration & dispatch" },
		],
	},
	{
		label: "Config Accessors",
		layer: "L2",
		entries: [
			{ name: "frameRoots", desc: "Map<rootKey, FrameContext>", from: "contextProvider", getter: true },
			{ name: "context", desc: "ContextMap (global DOM elements)", from: "contextProvider", getter: true },
			{ name: "frameContext", desc: "FrameContextMap (current frame)", from: "contextProvider", getter: true },
			{ name: "options", desc: "BaseOptionsMap (editor options)", from: "optionProvider", getter: true },
			{ name: "frameOptions", desc: "FrameOptionsMap (per-frame options)", from: "optionProvider", getter: true },
			{ name: "icons", desc: "Icon set object", from: "contextProvider" },
			{ name: "lang", desc: "Language strings object", from: "contextProvider" },
		],
	},
	{
		label: "Logic — DOM (L3)",
		layer: "L3",
		entries: [
			{ name: "offset", desc: "Offset calculation" },
			{ name: "selection", desc: "Selection handling" },
			{ name: "format", desc: "Block-level formatting" },
			{ name: "inline", desc: "Inline styling" },
			{ name: "listFormat", desc: "List operations" },
			{ name: "html", desc: "HTML processing" },
			{ name: "nodeTransform", desc: "Node transformation" },
			{ name: "char", desc: "Character counting" },
		],
	},
	{
		label: "Logic — Shell (L3)",
		layer: "L3",
		entries: [
			{ name: "component", desc: "Component lifecycle" },
			{ name: "focusManager", desc: "Focus management" },
			{ name: "pluginManager", desc: "Plugin registry" },
			{ name: "plugins", desc: "Plugin instances map" },
			{ name: "ui", desc: "UI state management" },
			{ name: "commandDispatcher", desc: "Command routing" },
			{ name: "history", desc: "Undo / Redo stack" },
			{ name: "shortcuts", desc: "Shortcut mapping" },
		],
	},
	{
		label: "Logic — Panel (L3)",
		layer: "L3",
		entries: [
			{ name: "toolbar", desc: "Toolbar renderer" },
			{ name: "subToolbar", desc: "Sub-toolbar (conditional)" },
			{ name: "menu", desc: "Menu renderer" },
			{ name: "viewer", desc: "View mode handler" },
		],
	},
];

/* ── Provider getters & methods ─────────────────────── */

type ProviderInfo = {
	name: string;
	desc: string;
	getters: { name: string; returns: string; linkedAs?: string }[];
	properties?: { name: string; type: string }[];
	methods?: { name: string; signature: string }[];
};

const PROVIDERS: ProviderInfo[] = [
	{
		name: "contextProvider",
		desc: "Manages global context (toolbar, statusbar) and per-frame context (wysiwyg, code view).",
		getters: [
			{ name: "frameRoots", returns: "Map<rootKey, FrameContext>", linkedAs: "$.frameRoots" },
			{ name: "context", returns: "ContextMap", linkedAs: "$.context" },
			{ name: "frameContext", returns: "FrameContextMap", linkedAs: "$.frameContext" },
		],
		properties: [
			{ name: "rootKeys", type: "Array" },
			{ name: "icons", type: "Object<string, string>" },
			{ name: "lang", type: "Object<string, *>" },
			{ name: "carrierWrapper", type: "HTMLElement" },
			{ name: "shadowRoot", type: "ShadowRoot" },
		],
	},
	{
		name: "optionProvider",
		desc: "Manages base options (shared) and frame options (per-root).",
		getters: [
			{ name: "options", returns: "BaseOptionsMap", linkedAs: "$.options" },
			{ name: "frameOptions", returns: "FrameOptionsMap", linkedAs: "$.frameOptions" },
		],
	},
	{
		name: "store",
		desc: "Central state store with subscription support.",
		getters: [],
		properties: [
			{ name: "mode", type: "StoreMode { isClassic, isInline, isBalloon, isBalloonAlways }" },
		],
		methods: [
			{ name: "get", signature: "(key) → value" },
			{ name: "set", signature: "(key, value) → void" },
			{ name: "subscribe", signature: "(key, callback) → unsubscribe" },
		],
	},
	{
		name: "eventManager",
		desc: "Public event registration and dispatch API.",
		getters: [],
		properties: [
			{ name: "events", type: "SunEditor.Event.Handlers" },
		],
		methods: [
			{ name: "triggerEvent", signature: "(eventName, data) → Promise" },
			{ name: "addEvent", signature: "(target, type, listener) → EventInfo" },
			{ name: "removeEvent", signature: "(info) → void" },
			{ name: "addGlobalEvent", signature: "(type, listener) → GlobalInfo" },
			{ name: "removeGlobalEvent", signature: "(type|info) → void" },
		],
	},
	{
		name: "instanceCheck",
		desc: "Iframe-safe type checking utilities.",
		getters: [],
		methods: [
			{ name: "isNode", signature: "(obj) → boolean" },
			{ name: "isElement", signature: "(obj) → boolean" },
			{ name: "isRange", signature: "(obj) → boolean" },
			{ name: "isSelection", signature: "(obj) → boolean" },
		],
	},
];

/* ── Layer colors ────────────────────────────────────── */

const LAYER_COLORS: Record<string, string> = {
	L1: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
	L2: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
	L3: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

/* ── Component ───────────────────────────────────────── */

export default function Step3KernelApi() {
	const t = useTranslations("GettingStarted.step3");

	return (
		<section className='mx-auto w-full max-w-6xl px-6 pb-14 pt-2'>
			<SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("desc")} />

			{/* $ Kernel Properties */}
			<div className='mt-8 space-y-4'>
				{KERNEL_DEPS.map((group) => (
					<div key={group.label} className='rounded-xl border overflow-hidden'>
						<div className='flex items-center gap-2 bg-muted/40 px-4 py-2.5 border-b'>
							<Badge variant='outline' className={`text-[10px] px-1.5 py-0 ${LAYER_COLORS[group.layer]}`}>
								{group.layer}
							</Badge>
							<span className='text-sm font-semibold'>{group.label}</span>
						</div>
						<div className='divide-y'>
							{group.entries.map((entry) => (
								<div key={entry.name} className='flex items-start gap-3 px-4 py-2 text-xs hover:bg-muted/20 transition-colors'>
									<code className='font-mono font-semibold text-foreground shrink-0 min-w-[140px]'>$.{entry.name}</code>
									<span className='text-muted-foreground flex-1'>{entry.desc}</span>
									{entry.from && (
										<Link
											href={`/docs-api#$.${entry.from}.${entry.name}`}
											className='shrink-0 text-[10px] text-muted-foreground/70 flex items-center gap-1 hover:text-primary transition-colors'
										>
											<span className='text-primary'>←</span>
											<code className='font-mono'>{entry.from}</code>
											{entry.getter && <Badge variant='outline' className='text-[9px] px-1 py-0'>get</Badge>}
										</Link>
									)}
								</div>
							))}
						</div>
					</div>
				))}
			</div>

			{/* Provider Details */}
			<h3 className='mt-10 mb-4 text-lg font-semibold'>{t("providerDetails")}</h3>
			<Accordion type='multiple' defaultValue={["contextProvider", "optionProvider"]} className='space-y-1'>
				{PROVIDERS.map((provider) => (
					<AccordionItem key={provider.name} value={provider.name}>
						<AccordionTrigger className='text-sm font-semibold'>
							<span className='flex items-center gap-2'>
								<code className='font-mono'>{provider.name}</code>
							</span>
						</AccordionTrigger>
						<AccordionContent className='space-y-3 pl-1'>
							<p className='text-xs text-muted-foreground'>{provider.desc}</p>

							{/* Getters */}
							{provider.getters.length > 0 && (
								<div>
									<h4 className='text-xs font-semibold mb-1.5 flex items-center gap-1.5'>
										Getters
										<Badge variant='outline' className='text-[9px] px-1 py-0'>get</Badge>
									</h4>
									<div className='rounded-lg border divide-y'>
										{provider.getters.map((g) => (
											<div key={g.name} className='flex items-center gap-3 px-3 py-1.5 text-xs'>
												<Link
													href={`/docs-api#$.${provider.name}.${g.name}`}
													className='font-mono font-semibold min-w-[120px] hover:text-primary transition-colors'
												>
													.{g.name}
												</Link>
												<span className='text-muted-foreground flex-1'>{g.returns}</span>
												{g.linkedAs && (
													<span className='shrink-0 text-[10px] flex items-center gap-1'>
														<span className='text-primary'>→</span>
														<code className='font-mono text-primary'>{g.linkedAs}</code>
													</span>
												)}
											</div>
										))}
									</div>
								</div>
							)}

							{/* Properties */}
							{provider.properties && provider.properties.length > 0 && (
								<div>
									<h4 className='text-xs font-semibold mb-1.5'>Properties</h4>
									<div className='rounded-lg border divide-y'>
										{provider.properties.map((p) => (
											<div key={p.name} className='flex items-center gap-3 px-3 py-1.5 text-xs'>
												<code className='font-mono font-semibold min-w-[120px]'>.{p.name}</code>
												<span className='text-muted-foreground'>{p.type}</span>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Methods */}
							{provider.methods && provider.methods.length > 0 && (
								<div>
									<h4 className='text-xs font-semibold mb-1.5'>Methods</h4>
									<div className='rounded-lg border divide-y'>
										{provider.methods.map((m) => (
											<div key={m.name} className='flex items-center gap-3 px-3 py-1.5 text-xs'>
												<code className='font-mono font-semibold min-w-[120px]'>.{m.name}</code>
												<span className='text-muted-foreground font-mono'>{m.signature}</span>
											</div>
										))}
									</div>
								</div>
							)}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>

			{/* Link to deep-dive */}
			<div className='mt-6'>
				<Link
					href='/deep-dive'
					className='inline-flex items-center gap-2 text-sm text-primary hover:underline'
				>
					{t("deepDiveLink")}
					<ArrowRight className='h-3.5 w-3.5' />
				</Link>
			</div>
		</section>
	);
}
