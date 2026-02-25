"use client";

import { useState, useReducer, useRef, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { RotateCcw, Share2, Check, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { SunEditor } from "suneditor/types";
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
import PlaygroundEditor from "./PlaygroundEditor";
import PlaygroundCodePanel from "./PlaygroundCodePanel";

export default function PlaygroundContent() {
	// Parse URL params on mount
	const initialState = useMemo(() => {
		if (typeof window === "undefined") return DEFAULTS;
		const params = new URLSearchParams(window.location.search);
		const fromUrl = urlToState(params);
		return { ...DEFAULTS, ...fromUrl };
	}, []);

	const [state, dispatch] = useReducer(playgroundReducer, initialState);
	const editorRef = useRef<SunEditor.Instance | null>(null);
	const prevStateRef = useRef<PlaygroundState>(initialState);
	const [urlCopied, setUrlCopied] = useState(false);

	// Compute editor key from fixed options — changes force remount
	const editorKey = useMemo(() => {
		const fixedParts = [
			state.mode,
			state.buttonListPreset,
			state.shortcutsDisable,
			state.closeModalOutsideClick,
			state.defaultLine,
			state.strictMode,
			state.elementWhitelist,
			state.elementBlacklist,
			state.attributeWhitelist,
			state.attributeBlacklist,
			state.fontSizeUnits,
			state.iframe,
			state.iframe_fullPage,
			state.statusbar_resizeEnable,
		];
		return fixedParts.map(String).join("|");
	}, [
		state.mode,
		state.buttonListPreset,
		state.shortcutsDisable,
		state.closeModalOutsideClick,
		state.defaultLine,
		state.strictMode,
		state.elementWhitelist,
		state.elementBlacklist,
		state.attributeWhitelist,
		state.attributeBlacklist,
		state.fontSizeUnits,
		state.iframe,
		state.iframe_fullPage,
		state.statusbar_resizeEnable,
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
		<div className='min-h-screen pb-20'>
			{/* Header */}
			<section className='container mx-auto px-6 py-6 border-b'>
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className='flex items-center justify-between'>
					<div>
						<Badge variant='secondary' className='mb-2'>
							<Settings2 className='mr-1.5 h-3.5 w-3.5' />
							Playground
						</Badge>
						<h1 className='text-2xl font-bold tracking-tight'>SunEditor Playground</h1>
						<p className='text-sm text-muted-foreground mt-1'>Configure options, test the editor, and share your setup via URL.</p>
					</div>
					<div className='flex items-center gap-2'>
						<Button variant='outline' size='sm' onClick={handleReset}>
							<RotateCcw className='mr-1.5 h-3.5 w-3.5' />
							Reset
						</Button>
						<Button variant='outline' size='sm' onClick={handleShare}>
							{urlCopied ? <Check className='mr-1.5 h-3.5 w-3.5 text-green-500' /> : <Share2 className='mr-1.5 h-3.5 w-3.5' />}
							{urlCopied ? "Copied!" : "Share URL"}
						</Button>
					</div>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 py-6 space-y-6'>
				{/* Controls — Desktop: inline, Mobile: Sheet */}
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
					{/* Desktop */}
					<div className='hidden md:block rounded-lg border bg-card/90 p-4'>
						<PlaygroundControls state={state} dispatch={dispatch} />
					</div>

					{/* Mobile */}
					<div className='md:hidden'>
						<Sheet>
							<SheetTrigger asChild>
								<Button variant='outline' className='w-full'>
									<Settings2 className='mr-2 h-4 w-4' />
									Editor Options
								</Button>
							</SheetTrigger>
							<SheetContent side='right' className='w-[320px] overflow-y-auto'>
								<SheetHeader>
									<SheetTitle>Editor Options</SheetTitle>
								</SheetHeader>
								<div className='mt-4'>
									<PlaygroundControls state={state} dispatch={dispatch} />
								</div>
							</SheetContent>
						</Sheet>
					</div>
				</motion.div>

				{/* Editor */}
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
					<PlaygroundEditor key={editorKey} state={state} editorRef={editorRef} />
				</motion.div>

				{/* Code Panel */}
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
					<PlaygroundCodePanel state={state} />
				</motion.div>
			</div>
		</div>
	);
}
