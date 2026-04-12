"use client";

import { useState, useEffect, useMemo } from "react";
import { useLocale } from "next-intl";
import type { SunEditor } from "suneditor/types";
import "suneditor/src/themes/dark.css";
import "suneditor/src/themes/midnight.css";
import "suneditor/src/themes/cobalt.css";
import "suneditor/src/themes/cream.css";
import dynamic from "next/dynamic";
import { localeCodes, toEditorCode } from "@/i18n/languages";

const EditorPlaceholder = () => <div className="min-h-[200px] rounded-lg bg-muted/40" />;
const Editor = dynamic(() => import("./_editor"), { ssr: false, loading: EditorPlaceholder });

/** Dynamic import for SunEditor lang packs (accepts BCP 47 locale or editor code) */
async function loadLangPack(locale: string): Promise<Record<string, string> | undefined> {
	if (!locale) return undefined;
	const code = toEditorCode(locale);
	try {
		const mod = await import(`suneditor/langs/${code}`);
		return (mod.default ?? mod) as Record<string, string>;
	} catch {
		return undefined;
	}
}

interface SunEditorProps {
	value?: SunEditor.InitOptions["value"];
	options?: SunEditor.InitOptions;
	theme?: "default" | "dark" | "midnight" | "cobalt" | "cream";
	onInstance?: (instance: SunEditor.Instance) => void;
	toolbarContainerRef?: React.RefObject<HTMLDivElement | null>;
	statusbarContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const SunEditor: React.FC<SunEditorProps> = ({ value, options, theme: themeProp, onInstance, toolbarContainerRef, statusbarContainerRef }) => {
	const locale = useLocale();

	// Auto-detect lang from locale — skip if caller already provides lang (object or null sentinel)
	const autoLangCode = useMemo(() => {
		if (options && "lang" in options) return ""; // caller handles lang explicitly
		if (locale === "en" || !localeCodes.includes(locale)) return "";
		return locale;
	}, [options, locale]);

	const [autoLangPack, setAutoLangPack] = useState<Record<string, string> | undefined>(undefined);
	const [langReady, setLangReady] = useState(!autoLangCode);

	useEffect(() => {
		if (!autoLangCode) {
			setAutoLangPack(undefined);
			setLangReady(true);
			return;
		}
		setLangReady(false);
		loadLangPack(autoLangCode).then((pack) => {
			setAutoLangPack(pack);
			setLangReady(true);
		});
	}, [autoLangCode]);

	// Merge auto-loaded lang into options
	const finalOptions = useMemo(() => {
		if (!autoLangPack) return options;
		return { ...options, lang: autoLangPack };
	}, [options, autoLangPack]);

	// Theme — auto-detect from page dark/light or use explicit prop
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

	if (!langReady) return <EditorPlaceholder />;

	return <Editor value={value} options={finalOptions} theme={themeProp ?? autoTheme} onInstance={onInstance} toolbarContainerRef={toolbarContainerRef} statusbarContainerRef={statusbarContainerRef} />;
};

export default SunEditor;
