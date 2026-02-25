"use client";

import { useEffect, useRef } from "react";
import type { SunEditor } from "suneditor/types";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions } from "../_lib/playgroundState";
import { PLAYGROUND_VALUE } from "@/data/code-examples/editorPresets";

interface Props {
	state: PlaygroundState;
	editorRef: React.MutableRefObject<SunEditor.Instance | null>;
}

export default function PlaygroundEditor({ state, editorRef }: Props) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const mountedRef = useRef(true);

	useEffect(() => {
		mountedRef.current = true;
		let instance: SunEditor.Instance | null = null;

		(async () => {
			const suneditor = (await import("suneditor")).default;
			const { plugins } = await import("suneditor");
			await import("suneditor/css");
			await import("suneditor/css/contents");

			if (!mountedRef.current || !textareaRef.current) return;

			const opts = stateToEditorOptions(state);
			instance = suneditor.create(textareaRef.current, {
				plugins,
				value: PLAYGROUND_VALUE,
				...opts,
			});

			editorRef.current = instance;
		})();

		return () => {
			mountedRef.current = false;
			const current = instance || editorRef.current;
			if (current) {
				current.destroy();
				editorRef.current = null;
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps -- state used only for initial creation; updates via resetOptions
	}, []);

	return (
		<div className='rounded-lg border overflow-hidden'>
			<textarea ref={textareaRef} style={{ visibility: "hidden" }} />
		</div>
	);
}
