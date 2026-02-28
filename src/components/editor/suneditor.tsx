"use client";

import { useState, useEffect } from "react";
import type { SunEditor } from "suneditor/types";
import "suneditor/src/themes/dark.css";
import "suneditor/src/themes/cobalt.css";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./_editor"), { ssr: false });

interface SunEditorProps {
	value?: SunEditor.InitOptions["value"];
	options?: SunEditor.InitOptions;
	theme?: "dark" | "default" | "cobalt";
	onInstance?: (instance: SunEditor.Instance) => void;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options, theme: themeProp, onInstance }) => {
	const [autoTheme, setAutoTheme] = useState<"dark" | "default" | "cobalt">("default");

	useEffect(() => {
		if (themeProp !== undefined) return;

		setAutoTheme(document.documentElement.classList.contains("dark") ? "dark" : "default");

		const handler = (e: Event) => {
			const detail = (e as CustomEvent).detail;
			setAutoTheme(detail === "dark" ? "dark" : "default");
		};

		window.addEventListener("themechange", handler);
		return () => window.removeEventListener("themechange", handler);
	}, [themeProp]);

	return <Editor value={value} options={options} theme={themeProp ?? autoTheme} onInstance={onInstance} />;
};

export default SunEditor;
