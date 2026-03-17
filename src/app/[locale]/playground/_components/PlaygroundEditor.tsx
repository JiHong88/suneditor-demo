"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SunEditor } from "suneditor/types";
import SunEditorComponent from "@/components/editor/suneditor";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions } from "../_lib/playgroundState";
import { type AllLibs, type ExternalLibs, getActiveLibs } from "./externalLibsLoader";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditor.Instance | null>;
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

	const extLibs: ExternalLibs = useMemo(
		() => getActiveLibs(allLibs, state.math_mathLib),
		[allLibs, state.math_mathLib],
	);

	const options = useMemo(() => {
		const opts = stateToEditorOptions(state);
		if (langPack) opts.lang = langPack;
		// icons — parse JSON and merge
		if (state.icons) {
			try {
				opts.icons = JSON.parse(state.icons);
			} catch { /* skip invalid JSON */ }
		}
		// external libraries
		if (extLibs && Object.keys(extLibs).length > 0) {
			opts.externalLibs = extLibs;
		}
		// Wire up onFileManagerAction event
		if (onFileManagerAction) {
			opts.events = { ...(opts.events as Record<string, unknown> || {}), onFileManagerAction };
		}

		return { ...opts } as SunEditor.InitOptions;
	}, [state, langPack, extLibs, onFileManagerAction]);

	const handleInstance = useCallback(
		(instance: SunEditor.Instance) => {
			// Save content from outgoing instance so it survives key-based remount
			if (editorRef.current) {
				try { contentRef.current = editorRef.current.$.html.get() as string; } catch { /* ignore */ }
			}
			editorRef.current = instance;
			// Restore saved content — guard against rootStack not yet initialized (e.g. document type)
			try {
				instance.$.html.set(contentRef.current);
			} catch {
				// Retry after initialization completes
				requestAnimationFrame(() => {
					try {
						instance.$.html.set(contentRef.current);
					} catch {
						/* still not ready — content was already set via options.value */
					}
				});
			}
		},
		[editorRef, contentRef],
	);

	// Save content on unmount so it survives remount
	useEffect(() => {
		return () => {
			const instance = editorRef.current;
			if (instance) {
				try {
					contentRef.current = instance.$.html.get() as string;
				} catch {
					/* ignore */
				}
			}
		};
	}, [editorRef, contentRef]);

	if (!langLoaded) return null;

	return (
		<>
			{state.toolbar_container_enabled && (
				<div
					id='se-toolbar-container'
					ref={toolbarContainerRef}
					className='mb-2.5 border border-b-0 border-border bg-background overflow-hidden'
				/>
			)}
			<SunEditorComponent
				key={state.toolbar_container_enabled ? "tc" : "no-tc"}
				options={options}
				theme={(state.theme || undefined) as "default" | "dark" | "midnight" | "cobalt" | "cream" | undefined}
				onInstance={handleInstance}
				toolbarContainerRef={state.toolbar_container_enabled ? toolbarContainerRef : undefined}
				statusbarContainerRef={state.statusbar_container_enabled ? statusbarContainerRef : undefined}
			/>
			{state.statusbar_container_enabled && (
				<div
					id='se-statusbar-container'
					ref={statusbarContainerRef}
					className='mt-2.5 border border-border bg-background overflow-hidden'
				/>
			)}
		</>
	);
}
