"use client";

import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Share2, Check, Settings2, Puzzle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { SunEditor } from "suneditor/types";
import { PLAYGROUND_VALUE } from "@/data/code-examples/editorPresets";
import {
	type PlaygroundState,
	DEFAULTS,
	playgroundReducer,
	urlToState,
	stateToUrl,
	stateToEditorOptions,
	getChangedKeys,
	hasFixedChange,
} from "../_lib/playgroundState";
import PlaygroundControls from "./PlaygroundControls";
import PlaygroundPluginSidebar from "./PlaygroundPluginSidebar";
import dynamic from "next/dynamic";
import PlaygroundEditor from "./PlaygroundEditor";
import PlaygroundCodePanel from "./PlaygroundCodePanel";

const PlaygroundMultiRootEditor = dynamic(() => import("./PlaygroundMultiRootEditor"), { ssr: false });

/** Editor option keys that are fixed after creation — must be stripped before resetOptions */
const FIXED_RESET_KEYS = new Set([
	"mode", "buttonList", "shortcutsDisable", "closeModalOutsideClick", "strictMode",
	"statusbar_resizeEnable", "defaultLine", "iframe", "iframe_fullPage",
	"fontSizeUnits", "formatLine", "formatBrLine", "formatClosureBrLine", "formatBlock", "formatClosureBlock",
	"spanStyles", "lineStyles", "textStyleTags", "allowedClassName", "allUsedStyles",
	"elementWhitelist", "elementBlacklist", "attributeWhitelist", "attributeBlacklist",
	"image", "video", "audio", "table", "fontSize", "fontColor", "backgroundColor",
	"embed", "drawing", "mention", "math",
]);

export default function PlaygroundContent() {
	const t = useTranslations("Playground");
	const tc = useTranslations("Common");
	const [state, dispatch] = useReducer(playgroundReducer, DEFAULTS);
	const editorRef = useRef<SunEditor.Instance | null>(null);
	const contentRef = useRef(PLAYGROUND_VALUE);
	const multiRootContentRef = useRef<Record<string, string>>({ header: "", body: "" });
	const prevStateRef = useRef<PlaygroundState>(DEFAULTS);
	const [urlCopied, setUrlCopied] = useState(false);
	const [ready, setReady] = useState(false);

	// Apply URL params after hydration, then mark ready
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const fromUrl = urlToState(params);
		if (Object.keys(fromUrl).length > 0) {
			dispatch({ type: "LOAD", payload: fromUrl });
		}
		setReady(true);
	}, []);

	// Compute editor key from fixed options — changes force remount
	const editorKey = useMemo(() => {
		const fixedParts = [
			state.multiroot,
			state.mode,
			state.buttonListPreset,
			state.type,
			state.shortcutsDisable,
			state.closeModalOutsideClick,
			state.defaultLine,
			state.strictMode,
			state.strictMode_tagFilter,
			state.strictMode_formatFilter,
			state.strictMode_classFilter,
			state.strictMode_textStyleTagFilter,
			state.strictMode_attrFilter,
			state.strictMode_styleFilter,
			state.elementWhitelist,
			state.elementBlacklist,
			state.attributeWhitelist,
			state.attributeBlacklist,
			state.fontSizeUnits,
			state.iframe,
			state.iframe_fullPage,
			state.statusbar_resizeEnable,
			state.formatLine,
			state.formatBrLine,
			state.formatClosureBrLine,
			state.formatBlock,
			state.formatClosureBlock,
			state.spanStyles,
			state.lineStyles,
			state.textStyleTags,
			state.allowedClassName,
			state.allUsedStyles,
			// Plugin options (all fixed)
			state.image_canResize,
			state.image_defaultWidth,
			state.image_defaultHeight,
			state.image_createFileInput,
			state.image_createUrlInput,
			state.image_uploadUrl,
			state.image_uploadSizeLimit,
			state.image_allowMultiple,
			state.image_acceptedFormats,
			state.image_percentageOnlySize,
			state.image_showHeightInput,
			state.video_canResize,
			state.video_defaultWidth,
			state.video_defaultHeight,
			state.video_createFileInput,
			state.video_createUrlInput,
			state.video_uploadUrl,
			state.video_uploadSizeLimit,
			state.video_allowMultiple,
			state.video_acceptedFormats,
			state.video_percentageOnlySize,
			state.video_showHeightInput,
			state.video_showRatioOption,
			state.video_defaultRatio,
			state.audio_defaultWidth,
			state.audio_defaultHeight,
			state.audio_createFileInput,
			state.audio_createUrlInput,
			state.audio_uploadUrl,
			state.audio_uploadSizeLimit,
			state.audio_allowMultiple,
			state.audio_acceptedFormats,
			state.table_scrollType,
			state.table_captionPosition,
			state.table_cellControllerPosition,
			state.fontSize_sizeUnit,
			state.fontSize_showIncDecControls,
			state.fontSize_showDefaultSizeLabel,
			state.fontSize_disableInput,
			state.fontColor_disableHEXInput,
			state.backgroundColor_disableHEXInput,
			state.embed_canResize,
			state.embed_defaultWidth,
			state.embed_defaultHeight,
			state.embed_showHeightInput,
			state.embed_percentageOnlySize,
			state.drawing_outputFormat,
			state.drawing_lineWidth,
			state.drawing_lineCap,
			state.drawing_canResize,
			state.drawing_lineColor,
			state.drawing_lineReconnect,
			state.mention_triggerText,
			state.mention_limitSize,
			state.mention_delayTime,
			state.mention_searchStartLength,
			state.mention_apiUrl,
			state.mention_useCachingData,
			state.math_canResize,
			state.math_autoHeight,
		];
		return fixedParts.map(String).join("|");
	}, [
		state.multiroot,
		state.mode,
		state.buttonListPreset,
		state.type,
		state.shortcutsDisable,
		state.closeModalOutsideClick,
		state.defaultLine,
		state.strictMode,
		state.strictMode_tagFilter,
		state.strictMode_formatFilter,
		state.strictMode_classFilter,
		state.strictMode_textStyleTagFilter,
		state.strictMode_attrFilter,
		state.strictMode_styleFilter,
		state.elementWhitelist,
		state.elementBlacklist,
		state.attributeWhitelist,
		state.attributeBlacklist,
		state.fontSizeUnits,
		state.iframe,
		state.iframe_fullPage,
		state.statusbar_resizeEnable,
		state.formatLine,
		state.formatBrLine,
		state.formatClosureBrLine,
		state.formatBlock,
		state.formatClosureBlock,
		state.spanStyles,
		state.lineStyles,
		state.textStyleTags,
		state.allowedClassName,
		state.allUsedStyles,
		state.image_canResize,
		state.image_defaultWidth,
		state.image_defaultHeight,
		state.image_createFileInput,
		state.image_createUrlInput,
		state.image_uploadUrl,
		state.image_uploadSizeLimit,
		state.image_allowMultiple,
		state.image_acceptedFormats,
		state.image_percentageOnlySize,
		state.image_showHeightInput,
		state.video_canResize,
		state.video_defaultWidth,
		state.video_defaultHeight,
		state.video_createFileInput,
		state.video_createUrlInput,
		state.video_uploadUrl,
		state.video_uploadSizeLimit,
		state.video_allowMultiple,
		state.video_acceptedFormats,
		state.video_percentageOnlySize,
		state.video_showHeightInput,
		state.video_showRatioOption,
		state.video_defaultRatio,
		state.audio_defaultWidth,
		state.audio_defaultHeight,
		state.audio_createFileInput,
		state.audio_createUrlInput,
		state.audio_uploadUrl,
		state.audio_uploadSizeLimit,
		state.audio_allowMultiple,
		state.audio_acceptedFormats,
		state.table_scrollType,
		state.table_captionPosition,
		state.table_cellControllerPosition,
		state.fontSize_sizeUnit,
		state.fontSize_showIncDecControls,
		state.fontSize_showDefaultSizeLabel,
		state.fontSize_disableInput,
		state.fontColor_disableHEXInput,
		state.backgroundColor_disableHEXInput,
		state.embed_canResize,
		state.embed_defaultWidth,
		state.embed_defaultHeight,
		state.embed_showHeightInput,
		state.embed_percentageOnlySize,
		state.drawing_outputFormat,
		state.drawing_lineWidth,
		state.drawing_lineCap,
		state.drawing_canResize,
		state.drawing_lineColor,
		state.drawing_lineReconnect,
		state.mention_triggerText,
		state.mention_limitSize,
		state.mention_delayTime,
		state.mention_searchStartLength,
		state.mention_apiUrl,
		state.mention_useCachingData,
		state.math_canResize,
		state.math_autoHeight,
	]);

	// Apply resettable option changes via resetOptions
	useEffect(() => {
		const prev = prevStateRef.current;
		const changed = getChangedKeys(prev, state);
		prevStateRef.current = state;

		if (changed.length === 0) return;
		if (hasFixedChange(changed)) return; // key changed → remount handles it

		const instance = editorRef.current;
		if (!instance) return;

		const opts = stateToEditorOptions(state);
		// Strip fixed keys that cannot be changed after creation
		for (const k of FIXED_RESET_KEYS) delete opts[k];
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
						<Badge variant='secondary' className='mb-2'>
							<Settings2 className='mr-1.5 h-3.5 w-3.5' />
							{t("badge")}
						</Badge>
						<h1 className='text-2xl font-bold tracking-tight'>{t("title")}</h1>
						<p className='text-sm text-muted-foreground mt-1'>
							{t("desc")}
						</p>
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='outline' size='sm' onClick={handleReset}>
							<RotateCcw className='mr-1.5 h-3.5 w-3.5' />
							{t("reset")}
						</Button>
						<Button variant='outline' size='sm' onClick={handleShare}>
							{urlCopied ? (
								<Check className='mr-1.5 h-3.5 w-3.5 text-green-500' />
							) : (
								<Share2 className='mr-1.5 h-3.5 w-3.5' />
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
								<span className='text-[11px] font-bold text-orange-600 dark:text-amber-400 uppercase tracking-wider'>Plugin Options</span>
							</div>
							<div className='p-3 pb-32 overflow-y-auto'>
								<PlaygroundPluginSidebar state={state} dispatch={dispatch} />
							</div>
						</div>
					</motion.aside>

					{/* Right Content */}
					<div className='flex-1 min-w-0 space-y-6 pb-6'>
						{/* Multiroot Toggle */}
						<div className='flex items-center justify-between rounded-lg border bg-card/90 px-4 py-3'>
							<div>
								<span className='text-sm font-semibold'>Multi-root Editor</span>
								<p className='text-[11px] text-muted-foreground mt-0.5'>Enable multiple editable regions</p>
							</div>
							<button
								type='button'
								role='switch'
								aria-checked={state.multiroot}
								onClick={() => dispatch({ type: "SET", key: "multiroot", value: !state.multiroot })}
								className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors ${state.multiroot ? "bg-orange-500" : "bg-muted"}`}
							>
								<span className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${state.multiroot ? "translate-x-4" : "translate-x-0"}`} />
							</button>
						</div>

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
										<Button variant='outline' className='w-full'>
											<Settings2 className='mr-2 h-4 w-4' />
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
										<Button variant='outline' className='w-full'>
											<Puzzle className='mr-2 h-4 w-4' />
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

						{/* Editor — wait until URL params are applied to avoid double creation */}
						<motion.div
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							{ready && (state.multiroot
							? <PlaygroundMultiRootEditor key={editorKey} state={state} editorRef={editorRef} contentRef={multiRootContentRef} />
							: <PlaygroundEditor key={editorKey} state={state} editorRef={editorRef} contentRef={contentRef} />
						)}
						</motion.div>

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
