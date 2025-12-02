"use client";

import React, { useEffect, useRef } from "react";
import suneditor, { plugins } from "suneditor";
import type { SunEditor } from "suneditor/types";
import "suneditor/css";
import "suneditor/css/contents";
import { FullButtonList } from "../editor/buttonList";

interface SunEditorProps {
	value?: SunEditor.InitOptions["value"];
	options?: SunEditor.InitOptions;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options }) => {
	const editorRef = useRef<HTMLTextAreaElement>(null);
	const instanceRef = useRef<SunEditor.Instance | null>(null);
	const isInitializedRef = useRef(false);

	// Editor
	useEffect(() => {
		if (isInitializedRef.current || !editorRef.current) return;

		isInitializedRef.current = true;

		const instance = suneditor.create(editorRef.current, {
			...(options || {}),
			value: options?.value || "",
			plugins,
			buttonList: FullButtonList,
		});

		instanceRef.current = instance;

		// Cleanup: unmount 시 즉시 destroy
		return () => {
			if (instanceRef.current) {
				try {
					instanceRef.current.destroy();
					instanceRef.current = null;
					isInitializedRef.current = false;
				} catch (error) {
					console.warn("Editor destroy error:", error);
					instanceRef.current = null;
					isInitializedRef.current = false;
				}
			}
		};
	}, []);

	useEffect(() => {
		if (instanceRef.current && value !== undefined) {
			const currentContent = instanceRef.current.html.get();
			if (currentContent !== value) {
				console.log("Updating editor content from prop value", instanceRef.current, value);
				// instanceRef.current.html.set(value);
			}
		}
	}, [value]);

	return <textarea ref={editorRef} style={{ visibility: "hidden" }} />;
};

export default SunEditor;
