"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SunEditor, { type SunEditorInstance, type SunEditorModule, type SunEditorOptions } from "@suneditor/suneditor-react";
import { FullButtonList } from "@/components/editor/buttonList";
import { useSiteTheme, withImageResize } from "@/components/editor/suneditor";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions } from "../_lib/playgroundState";
import { type AllLibs, type ExternalLibs, getActiveLibs } from "./externalLibsLoader";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditorInstance | null>;
	contentRef: React.RefObject<string>;
	allLibs: AllLibs;
	onFileManagerAction?: (params: {
		info: { src: string; index: number; name: string; size: number; delete: () => void; select: () => void };
		state: "create" | "update" | "delete";
		pluginName: string;
	}) => void;
}

/** Dynamic import for SunEditor lang packs */
async function loadLang(code: string): Promise<Record<string, unknown> | undefined> {
	if (!code) return undefined;
	try {
		const mod = await import(`suneditor/langs/${code}`);
		return mod.default ?? mod;
	} catch {
		return undefined;
	}
}

export default function PlaygroundEditor({ state, editorRef, contentRef, allLibs, onFileManagerAction }: Props) {
	const toolbarContainerRef = useRef<HTMLDivElement>(null);
	const statusbarContainerRef = useRef<HTMLDivElement>(null);
	const [langPack, setLangPack] = useState<Record<string, unknown> | undefined>(undefined);
	const [langLoaded, setLangLoaded] = useState(!state.lang);
	const siteTheme = useSiteTheme();

	useEffect(() => {
		if (!state.lang) {
			setLangPack(undefined);
			setLangLoaded(true);
			return;
		}
		setLangLoaded(false);
		loadLang(state.lang).then((pack) => {
			setLangPack(pack);
			setLangLoaded(true);
		});
	}, [state.lang]);

	const extLibs: ExternalLibs = useMemo(() => getActiveLibs(allLibs, state.math_mathLib), [allLibs, state.math_mathLib]);

	// Content bookkeeping for key-based remounts:
	// - `initialHtmlRef`: what this mount was created with (= contentRef at creation)
	// - `liveHtmlRef`: latest editor HTML from onChange
	// On unmount the live HTML is written back to contentRef unless the parent overwrote contentRef
	// in the meantime (value option changed), in which case the parent's value wins.
	const initialHtmlRef = useRef<string | null>(null);
	const liveHtmlRef = useRef<string | null>(null);

	// `options` is a function: the wrapper calls it after mount (container refs are set) and on every
	// render to re-sync `events` and `theme`. Everything else is applied once at creation.
	const buildOptions = useCallback(
		(se: SunEditorModule): SunEditorOptions => {
			const opts = stateToEditorOptions(state) as Record<string, unknown>;
			// Always set lang — null sentinel = explicit English; lang pack object = selected language.
			opts.lang = langPack ?? null;
			if (state.icons) {
				try {
					opts.icons = JSON.parse(state.icons);
				} catch {
					/* skip invalid JSON */
				}
			}
			if (extLibs && Object.keys(extLibs).length > 0) {
				opts.externalLibs = extLibs;
			}

			const events = withImageResize(opts.events as SunEditorOptions["events"]) as Record<string, unknown>;
			if (onFileManagerAction) events.onFileManagerAction = onFileManagerAction;

			if (initialHtmlRef.current === null) initialHtmlRef.current = contentRef.current;

			return {
				plugins: se.plugins,
				buttonList: FullButtonList,
				theme: state.theme || siteTheme,
				...(state.toolbar_container_enabled && toolbarContainerRef.current && { toolbar_container: toolbarContainerRef.current }),
				...(state.statusbar_container_enabled && statusbarContainerRef.current && { statusbar_container: statusbarContainerRef.current }),
				...opts,
				// After `opts`: stateToEditorOptions sets `value` from state, but a remount must replay the
				// content saved in contentRef (typed content, URL `val`), which the parent keeps in sync.
				value: initialHtmlRef.current,
				events,
			} as SunEditorOptions;
		},
		[state, langPack, extLibs, onFileManagerAction, siteTheme, contentRef],
	);

	// The wrapper assigns the instance after creation and null after destroy.
	const handleRef = useCallback(
		(instance: SunEditorInstance | null) => {
			editorRef.current = instance;
		},
		[editorRef],
	);

	const handleChange = useCallback((html: string) => {
		liveHtmlRef.current = html;
	}, []);

	// Save content on unmount so it survives remount (runs before the wrapper destroys the engine).
	useEffect(() => {
		return () => {
			const live = liveHtmlRef.current;
			if (live === null) return; // nothing typed in this mount
			if (initialHtmlRef.current !== contentRef.current) return; // parent overwrote contentRef (value option changed)
			contentRef.current = live;
		};
	}, [contentRef]);

	if (!langLoaded) return null;

	return (
		<>
			{state.toolbar_container_enabled && <div id='se-toolbar-container' ref={toolbarContainerRef} className='mb-2.5 border border-b-0 border-border bg-background overflow-hidden' />}
			<SunEditor key={state.toolbar_container_enabled ? "tc" : "no-tc"} ref={handleRef} options={buildOptions} onChange={handleChange} />
			{state.statusbar_container_enabled && <div id='se-statusbar-container' ref={statusbarContainerRef} className='mt-2.5 border border-border bg-background overflow-hidden' />}
		</>
	);
}
