"use client";

import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Share2, Check, Settings2, Puzzle, SlidersHorizontal } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { SunEditor } from "suneditor/types";
import { PLAYGROUND_VALUE } from "@/data/snippets/editorPresets";
import {
	type PlaygroundState,
	DEFAULTS,
	playgroundReducer,
	urlToState,
	stateToUrl,
	stateToEditorOptions,
	getChangedKeys,
	hasFixedChange,
	isFixedOption,
	getButtonList,
} from "./_lib/playgroundState";
import { editorLangCodes } from "@/i18n/languages";
import PlaygroundControls, { PlaygroundPerRootPanel } from "./_components/PlaygroundControls";
import PlaygroundPluginSidebar from "./_components/PlaygroundPluginSidebar";
import dynamic from "next/dynamic";
import PlaygroundEditor from "./_components/PlaygroundEditor";
import PlaygroundCodePanel from "./_components/PlaygroundCodePanel";
import { type AllLibs, loadAllExternalLibs } from "./_components/externalLibsLoader";
import FileListPanel, { useFileList } from "@/components/editor/FileListPanel";

const PlaygroundMultiRootEditor = dynamic(() => import("./_components/PlaygroundMultiRootEditor"), { ssr: false });
const ButtonListBuilder = dynamic(() => import("./_components/button-list-builder/ButtonListBuilder"), { ssr: false });

/** Editor option keys that are fixed after creation — must be stripped before resetOptions */
const FIXED_RESET_KEYS = new Set([
	"mode",
	"buttonList",
	"shortcutsDisable",
	"closeModalOutsideClick",
	"strictMode",
	"statusbar_resizeEnable",
	"defaultLine",
	"iframe",
	"iframe_fullPage",
	"fontSizeUnits",
	"formatLine",
	"formatBrLine",
	"formatClosureBrLine",
	"formatBlock",
	"formatClosureBlock",
	"spanStyles",
	"lineStyles",
	"textStyleTags",
	"allowedClassName",
	"allUsedStyles",
	"elementWhitelist",
	"elementBlacklist",
	"attributeWhitelist",
	"attributeBlacklist",
	"image",
	"video",
	"audio",
	"table",
	"fontSize",
	"fontColor",
	"backgroundColor",
	"embed",
	"drawing",
	"mention",
	"math",
	"link",
	"exportPDF",
	"fileUpload",
	"align",
	"font",
	"blockStyle",
	"lineHeight",
	"paragraphStyle",
	"textStyle",
	"template",
	"layout",
	"imageGallery",
	"videoGallery",
	"audioGallery",
	"fileGallery",
	"fileBrowser",
]);

export default function PlaygroundPage() {
	const t = useTranslations("Playground");
	const tc = useTranslations("Common");
	const locale = useLocale();
	const initialLang = locale !== "en" && editorLangCodes.includes(locale) ? locale : "";
	const [state, dispatch] = useReducer(playgroundReducer, { ...DEFAULTS, toolbar_sticky: 92, lang: initialLang });
	const editorRef = useRef<SunEditor.Instance | null>(null);
	const contentRef = useRef(PLAYGROUND_VALUE);
	const multiRootContentRef = useRef<Record<string, string>>({ header: "", body: "" });
	const prevStateRef = useRef<PlaygroundState>(DEFAULTS);
	const [allLibs, setAllLibs] = useState<AllLibs | null>(null);
	const [urlCopied, setUrlCopied] = useState(false);
	const [ready, setReady] = useState(false);
	const [builderOpen, setBuilderOpen] = useState(false);
	const [editorRenderedWidth, setEditorRenderedWidth] = useState(0);
	const { files, handleFileManagerAction, clearFiles } = useFileList();

	const handleBuilderOpen = useCallback((open: boolean) => {
		if (open) {
			const el = document.getElementById("editor");
			if (el) setEditorRenderedWidth(el.clientWidth);
		}
		setBuilderOpen(open);
	}, []);

	const handleBuilderApply = useCallback((buttonList: unknown[]) => {
		const json = JSON.stringify(buttonList);
		dispatch({ type: "SET", key: "customButtonList", value: json });
		dispatch({ type: "SET", key: "buttonListPreset", value: "custom" });
	}, []);

	// Preload all external libs immediately on mount
	useEffect(() => {
		loadAllExternalLibs().then(setAllLibs);
	}, []);

	// Apply URL params after hydration, then mark ready
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const fromUrl = urlToState(params);
		if (Object.keys(fromUrl).length > 0) {
			dispatch({ type: "LOAD", payload: fromUrl });
		}
		// Apply initial content from URL (val param)
		const val = params.get("val");
		if (val) {
			contentRef.current = val;
		}
		setReady(true);
	}, []);

	// Compute editor key from fixed options — changes force remount
	// Uses isFixedOption to automatically include all fixed keys (base, frame, plugin, per-root)
	const editorKey = useMemo(() => {
		return Object.entries(state)
			.filter(([k]) => isFixedOption(k))
			.map(([, v]) => String(v))
			.join("|");
	}, [state]);

	// Clear file list when editor is remounted (key change) to prevent stale closures
	const prevEditorKeyRef = useRef(editorKey);
	useEffect(() => {
		if (prevEditorKeyRef.current !== editorKey) {
			prevEditorKeyRef.current = editorKey;
			clearFiles();
		}
	}, [editorKey, clearFiles]);

	// Apply resettable option changes via resetOptions
	useEffect(() => {
		const prev = prevStateRef.current;
		const changed = getChangedKeys(prev, state);
		prevStateRef.current = state;

		if (changed.length === 0) return;
		if (hasFixedChange(changed)) return; // key changed → remount handles it

		const instance = editorRef.current;
		if (!instance) return;

		// Build opts from current & previous state, then only send changed keys
		// to avoid triggering #RestoreFrameOptions for unchanged frame options
		const opts = stateToEditorOptions(state) as Record<string, unknown>;
		const prevOpts = stateToEditorOptions(prev) as Record<string, unknown>;
		for (const k of FIXED_RESET_KEYS) { delete opts[k]; delete prevOpts[k]; }
		for (const k of Object.keys(opts)) {
			if (JSON.stringify(opts[k]) === JSON.stringify(prevOpts[k])) {
				delete opts[k];
			}
		}
		if (Object.keys(opts).length === 0) return;
		instance.resetOptions(opts);
	}, [state]);

	// Sync URL
	useEffect(() => {
		const qs = stateToUrl(state);
		const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
		window.history.replaceState(null, "", url);
	}, [state]);

	const handleReset = useCallback(() => dispatch({ type: "RESET" }), []);

	const handleShare = useCallback(() => {
		const qs = stateToUrl(state);
		const url = `${window.location.origin}${window.location.pathname}${qs ? "?" + qs : ""}`;
		navigator.clipboard.writeText(url);
		setUrlCopied(true);
		setTimeout(() => setUrlCopied(false), 1500);
	}, [state]);

	return (
		<div className='min-h-[calc(100vh-5.75rem)] flex flex-col'>
			{/* Header */}
			<section className='container mx-auto px-6 py-6 border-b'>
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex items-center justify-between'
				>
					<div>
						<h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
						<p className='text-sm text-muted-foreground mt-1'>{t("desc")}</p>
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='outline' size='sm' onClick={handleReset}>
							<RotateCcw className='me-1.5 h-3.5 w-3.5' />
							{t("reset")}
						</Button>
						<Button variant='outline' size='sm' onClick={handleShare}>
							{urlCopied ? (
								<Check className='me-1.5 h-3.5 w-3.5 text-green-500' />
							) : (
								<Share2 className='me-1.5 h-3.5 w-3.5' />
							)}
							{urlCopied ? tc("copied") : t("shareURL")}
						</Button>
					</div>
				</motion.div>
			</section>

			{/* Main layout: Sidebar + Content */}
			<div className='container mx-auto px-6 pt-6 flex-1'>
				<div className='flex gap-6'>
					{/* Left Sidebar — Desktop only */}
					<motion.aside
						initial={{ opacity: 0, x: -16 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.05 }}
						className='hidden lg:block w-64 shrink-0 sticky top-[93px] self-start'
					>
						<div className='rounded-lg border bg-card/90 max-h-[calc(100vh-93px-1rem)] flex flex-col'>
							<div className='shrink-0 px-3 py-2.5 border-b'>
								<span className='text-[12px] font-bold text-orange-600 dark:text-amber-400 uppercase tracking-wider'>
									{t("pluginOptions")}
								</span>
							</div>
							<div className='p-3 pb-32 overflow-y-auto'>
								<PlaygroundPluginSidebar state={state} dispatch={dispatch} />
							</div>
						</div>
					</motion.aside>

					{/* Right Content */}
					<div className='flex-1 min-w-0 space-y-6 pb-24'>
						{/* Multiroot Toggle */}
						<div className='flex items-center justify-between rounded-lg border bg-card/90 px-4 py-3'>
							<div>
								<span className='text-sm font-semibold'>{t("multiroot")}</span>
								<p className='text-[11px] text-muted-foreground mt-0.5'>{t("multirootDesc")}</p>
							</div>
							<button
								type='button'
								role='switch'
								aria-checked={state.multiroot}
								onClick={() => dispatch({ type: "SET", key: "multiroot", value: !state.multiroot })}
								className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${state.multiroot ? "bg-orange-500" : "bg-muted"}`}
							>
								<span
									className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${state.multiroot ? "translate-x-4" : "translate-x-0"}`}
								/>
							</button>
						</div>

						{/* Per-Root Frame Options — right below multiroot toggle */}
						{state.multiroot && (
							<PlaygroundPerRootPanel state={state} dispatch={dispatch} />
						)}

						{/* Controls — Desktop: inline, Mobile: Sheet */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.05 }}
						>
							{/* Desktop */}
							<div className='hidden md:block rounded-lg border bg-card/90 pt-4 pb-8'>
								<PlaygroundControls state={state} dispatch={dispatch} />
							</div>

							{/* Mobile: Editor Options */}
							<div className='md:hidden'>
								<Sheet>
									<SheetTrigger asChild>
										<Button variant='outline' className='w-full border-2 border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60'>
											<Settings2 className='me-2 h-4 w-4' />
											{t("editorOptions")}
										</Button>
									</SheetTrigger>
									<SheetContent side='right' className='w-[320px] overflow-y-auto'>
										<SheetHeader>
											<SheetTitle>{t("editorOptions")}</SheetTitle>
										</SheetHeader>
										<div className='mt-4 pb-8'>
											<PlaygroundControls state={state} dispatch={dispatch} />
										</div>
									</SheetContent>
								</Sheet>
							</div>

							{/* Plugin Sheet — visible below lg (when sidebar is hidden) */}
							<div className='lg:hidden mt-5'>
								<Sheet>
									<SheetTrigger asChild>
										<Button variant='outline' className='w-full border-2 border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950/60 dark:text-orange-300 dark:hover:bg-orange-900/60'>
											<Puzzle className='me-2 h-4 w-4' />
											{t("pluginOptions")}
										</Button>
									</SheetTrigger>
									<SheetContent side='left' className='w-[300px] overflow-y-auto'>
										<SheetHeader>
											<SheetTitle>{t("pluginOptions")}</SheetTitle>
										</SheetHeader>
										<div className='mt-4 px-3 pb-8'>
											<PlaygroundPluginSidebar state={state} dispatch={dispatch} />
										</div>
									</SheetContent>
								</Sheet>
							</div>
						</motion.div>

						{/* Customize ButtonList */}
						{state.buttonListPreset === "custom" && (
							<Button
								variant='outline'
								className='w-full border-2 border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-900/60'
								onClick={() => handleBuilderOpen(true)}
							>
								<SlidersHorizontal className='me-2 h-4 w-4' />
								Customize ButtonList
							</Button>
						)}

						{/* ButtonList Builder */}
						<ButtonListBuilder
							open={builderOpen}
							onOpenChange={handleBuilderOpen}
							initialButtonList={getButtonList(state.buttonListPreset, state.type, state.customButtonList)}
							onApply={handleBuilderApply}
							editorRenderedWidth={editorRenderedWidth}
							editorTheme={state.theme}
						/>

						{/* Editor — wait until URL params are applied to avoid double creation */}
						<motion.div
							id='editor'
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							{ready && allLibs &&
								(state.multiroot ? (
									<PlaygroundMultiRootEditor
										key={editorKey}
										state={state}
										editorRef={editorRef}
										contentRef={multiRootContentRef}
										allLibs={allLibs}
									/>
								) : (
									<PlaygroundEditor
										key={editorKey}
										state={state}
										editorRef={editorRef}
										contentRef={contentRef}
										allLibs={allLibs}
										onFileManagerAction={handleFileManagerAction}
									/>
								))}
						</motion.div>

						{/* File List Panel */}
						<FileListPanel files={files} />

						{/* Code Panel */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 }}
						>
							<PlaygroundCodePanel state={state} />
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}
