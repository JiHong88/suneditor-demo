"use client";

import { useCallback, useEffect, useMemo } from "react";
import type { SunEditor } from "suneditor/types";
import SunEditorComponent from "@/components/editor/suneditor";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions } from "../_lib/playgroundState";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditor.Instance | null>;
	contentRef: React.RefObject<string>;
}

export default function PlaygroundEditor({ state, editorRef, contentRef }: Props) {
	const options = useMemo(() => {
		const opts = stateToEditorOptions(state);
		return { ...opts } as SunEditor.InitOptions;
	}, []);

	const handleInstance = useCallback(
		(instance: SunEditor.Instance) => {
			editorRef.current = instance;
			// Restore saved content
			instance.$.html.set(contentRef.current);
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

	return (
		<>
			<SunEditorComponent options={options} theme={(state.theme || undefined) as "dark" | "default" | "cobalt" | undefined} onInstance={handleInstance} />
		</>
	);
}
