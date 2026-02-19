"use client";

import { useState, useEffect } from "react";
import type { SunEditor } from "suneditor/types";
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("./editor"), { ssr: false });

interface SunEditorProps {
	value?: SunEditor.InitOptions["value"];
	options?: SunEditor.InitOptions;
	theme?: "dark" | "default";
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options, theme: themeProp }) => {
	const [autoTheme, setAutoTheme] = useState<"dark" | "default">(() => {
		if (typeof document !== "undefined") {
			return document.documentElement.classList.contains("dark") ? "dark" : "default";
		}
		return "default";
	});

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

	return <Editor value={value} options={options} theme={themeProp ?? autoTheme} />;
};

export default SunEditor;
