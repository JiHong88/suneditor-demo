"use client";

import { useState, useEffect } from "react";
import type { SunEditor } from "suneditor/types";
import "suneditor/src/themes/dark.css";
import "suneditor/src/themes/midnight.css";
import "suneditor/src/themes/cobalt.css";
import "suneditor/src/themes/cream.css";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./_editor"), { ssr: false });

interface SunEditorProps {
	value?: SunEditor.InitOptions["value"];
	options?: SunEditor.InitOptions;
	theme?: "default" | "dark" | "midnight" | "cobalt" | "cream";
	onInstance?: (instance: SunEditor.Instance) => void;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options, theme: themeProp, onInstance }) => {
	const [autoTheme, setAutoTheme] = useState<SunEditorProps["theme"]>(() =>
		typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "midnight" : "default",
	);

	useEffect(() => {
		if (themeProp !== undefined) return;

		setAutoTheme(document.documentElement.classList.contains("dark") ? "midnight" : "default");

		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			setAutoTheme(detail === "dark" ? "midnight" : "default");
		};

		window.addEventListener("themechange", handler);
		return () => window.removeEventListener("themechange", handler);
	}, [themeProp]);

	return <Editor value={value} options={options} theme={themeProp ?? autoTheme} onInstance={onInstance} />;
};

export default SunEditor;
