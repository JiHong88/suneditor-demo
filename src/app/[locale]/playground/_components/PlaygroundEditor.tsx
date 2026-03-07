"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SunEditor } from "suneditor/types";
import SunEditorComponent from "@/components/editor/suneditor";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions, hasButton } from "../_lib/playgroundState";
import { type ExternalLibs, loadExternalLibs } from "./externalLibsLoader";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditor.Instance | null>;
	contentRef: React.RefObject<string>;
}

/** Dynamic import for SunEditor lang packs */
async function loadLang(code: string): Promise<Record<string, unknown> | undefined> {
	if (!code) return undefined;
	try {
		const mod = await import(`suneditor/src/langs/${code}`);
		return mod.default ?? mod;
	} catch {
		return undefined;
	}
}

export default function PlaygroundEditor({ state, editorRef, contentRef }: Props) {
	const [langPack, setLangPack] = useState<Record<string, unknown> | undefined>(undefined);
	const [langLoaded, setLangLoaded] = useState(!state.lang);
	const [extLibs, setExtLibs] = useState<ExternalLibs | null>(null);

	const needMath = hasButton(state.buttonListPreset, state.type, "math");

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

	// Load external libraries on mount
	useEffect(() => {
		loadExternalLibs(needMath, state.math_mathLib).then(setExtLibs);
	}, [needMath, state.math_mathLib]);

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
		return { ...opts } as SunEditor.InitOptions;
	}, [langPack, extLibs]);

	const handleInstance = useCallback(
		(instance: SunEditor.Instance) => {
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

	if (!langLoaded || extLibs === null) return null;

	return (
		<>
			<SunEditorComponent options={options} theme={(state.theme || undefined) as "default" | "dark" | "midnight" | "cobalt" | "cream" | undefined} onInstance={handleInstance} />
		</>
	);
}
