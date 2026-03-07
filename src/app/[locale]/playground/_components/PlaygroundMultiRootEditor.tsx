"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SunEditor } from "suneditor/types";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";
import { FullButtonList } from "@/components/editor/buttonList";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions, getRootConfigs, hasButton } from "../_lib/playgroundState";
import { loadExternalLibs } from "./externalLibsLoader";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditor.Instance | null>;
	contentRef: React.RefObject<Record<string, string>>;
}

export default function PlaygroundMultiRootEditor({ state, editorRef, contentRef }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [extLibs, setExtLibs] = useState<Record<string, unknown> | null>(null);

	const isClassic = state.mode === "classic" || !state.mode;
	const needMath = hasButton(state.buttonListPreset, state.type, "math");

	const roots = useMemo(() => getRootConfigs(state), [state]);

	const options = useMemo(() => {
		const opts = stateToEditorOptions(state);
		// Remove per-frame options that will be set per-root
		delete (opts as Record<string, unknown>).height;
		delete (opts as Record<string, unknown>).width;
		return opts;
	}, []);

	// Load external libraries
	useEffect(() => {
		loadExternalLibs(needMath, state.math_mathLib).then(setExtLibs);
	}, [needMath, state.math_mathLib]);

	useEffect(() => {
		if (!containerRef.current || extLibs === null) return;

		// Create textarea elements for each root
		const targets: Record<string, { target: HTMLTextAreaElement; options: SunEditor.InitFrameOptions }> = {};
		for (const root of roots) {
			const wrapper = containerRef.current.querySelector(`[data-root="${root.key}"]`);
			if (!wrapper) continue;
			const textarea = document.createElement("textarea");
			wrapper.appendChild(textarea);
			targets[root.key] = {
				target: textarea,
				options: root.options as SunEditor.InitFrameOptions,
			};
		}

		// Classic mode in multiroot requires toolbar_container
		const resolvedTheme = state.theme || (document.documentElement.classList.contains("dark") ? "midnight" : "default");
		const initOptions: Record<string, unknown> = {
			plugins,
			buttonList: FullButtonList,
			...options,
			theme: resolvedTheme,
		};
		if (isClassic && toolbarRef.current) {
			initOptions.toolbar_container = toolbarRef.current;
		}
		// External libraries
		if (Object.keys(extLibs).length > 0) {
			initOptions.externalLibs = extLibs;
		}

		const instance = suneditor.create(targets, initOptions as SunEditor.InitOptions);

		editorRef.current = instance;

		// Restore saved content for each root
		const saved = contentRef.current;
		for (const root of roots) {
			if (saved[root.key]) {
				try {
					instance.$.html.set(saved[root.key], { rootKey: root.key as unknown as number });
				} catch {
					/* ignore */
				}
			}
		}

		return () => {
			// Save content before destroy
			for (const root of roots) {
				try {
					const html = instance.$.html.get({ rootKey: root.key as unknown as number });
					if (typeof html === "string") {
						contentRef.current[root.key] = html;
					}
				} catch {
					/* ignore */
				}
			}
			instance.destroy();
			editorRef.current = null;
		};
	}, [extLibs]);

	// Theme sync
	useEffect(() => {
		const instance = editorRef.current;
		if (!instance) return;

		const applyTheme = (theme: string) => {
			instance.$.ui.setTheme(theme);
		};

		if (state.theme) {
			// Explicit theme selected
			applyTheme(state.theme);
			return;
		}

		// Auto theme: sync with page theme
		const getPageTheme = () =>
			document.documentElement.classList.contains("dark") ? "midnight" : "default";

		applyTheme(getPageTheme());

		const onThemeChange = () => applyTheme(getPageTheme());
		window.addEventListener("themechange", onThemeChange);
		return () => window.removeEventListener("themechange", onThemeChange);
	}, [state.theme, editorRef]);

	if (extLibs === null) return null;

	return (
		<div ref={containerRef} className="space-y-0">
			{isClassic && <div ref={toolbarRef} />}
			{roots.map((root) => {
				const isHeader = root.key === "header";
				const dotColor = isHeader ? "bg-violet-500" : "bg-emerald-500";
				const bgColor = isHeader ? "bg-violet-50 dark:bg-violet-900/20" : "bg-emerald-50 dark:bg-emerald-900/20";
				const borderColor = isHeader ? "border-violet-200 dark:border-violet-800/50" : "border-emerald-200 dark:border-emerald-800/50";
				const textColor = isHeader ? "text-violet-700 dark:text-violet-300" : "text-emerald-700 dark:text-emerald-300";
				const subTextColor = isHeader ? "text-violet-500/60 dark:text-violet-400/50" : "text-emerald-500/60 dark:text-emerald-400/50";
				return (
					<div key={root.key} className="mt-5">
						<div className={`flex items-center gap-2 px-3 py-1.5 ${bgColor} border ${borderColor} border-b-0 rounded-t-md`}>
							<span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
							<span className={`text-xs font-semibold ${textColor} uppercase tracking-wider`}>
								{root.label}
							</span>
							<code className={`text-[10px] ${subTextColor}`}>root: &quot;{root.key}&quot;</code>
						</div>
						<div data-root={root.key} />
					</div>
				);
			})}
		</div>
	);
}
