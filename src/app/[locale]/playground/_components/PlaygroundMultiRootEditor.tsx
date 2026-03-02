"use client";

import { useEffect, useMemo, useRef } from "react";
import type { SunEditor } from "suneditor/types";
import suneditor, { plugins } from "suneditor";
import "suneditor/css";
import "suneditor/css/contents";
import { FullButtonList } from "@/components/editor/buttonList";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions } from "../_lib/playgroundState";

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditor.Instance | null>;
	contentRef: React.RefObject<Record<string, string>>;
}

const ROOTS = [
	{ key: "header", label: "Header", height: "150px" },
	{ key: "body", label: "Body", height: "400px" },
] as const;

export default function PlaygroundMultiRootEditor({ state, editorRef, contentRef }: Props) {
	const containerRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);

	const isClassic = state.mode === "classic" || !state.mode;

	const options = useMemo(() => {
		const opts = stateToEditorOptions(state);
		// Remove per-frame options that will be set per-root
		delete (opts as Record<string, unknown>).height;
		return opts;
	}, []);

	useEffect(() => {
		if (!containerRef.current) return;

		// Create textarea elements for each root
		const targets: Record<string, { target: HTMLTextAreaElement; options: SunEditor.InitFrameOptions }> = {};
		for (const root of ROOTS) {
			const wrapper = containerRef.current.querySelector(`[data-root="${root.key}"]`);
			if (!wrapper) continue;
			const textarea = document.createElement("textarea");
			wrapper.appendChild(textarea);
			targets[root.key] = {
				target: textarea,
				options: { height: root.height },
			};
		}

		// Classic mode in multiroot requires toolbar_container
		const initOptions: Record<string, unknown> = {
			plugins,
			buttonList: FullButtonList,
			...options,
		};
		if (isClassic && toolbarRef.current) {
			initOptions.toolbar_container = toolbarRef.current;
		}

		const instance = suneditor.create(targets, initOptions as SunEditor.InitOptions);

		editorRef.current = instance;

		// Restore saved content for each root
		const saved = contentRef.current;
		for (const root of ROOTS) {
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
			for (const root of ROOTS) {
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
	}, []);

	// Theme sync
	useEffect(() => {
		const instance = editorRef.current;
		if (!instance) return;

		const applyTheme = (theme: string) => {
			instance.$.ui.setTheme(theme as "dark" | "default" | "cobalt");
		};

		if (state.theme) {
			// Explicit theme selected
			applyTheme(state.theme);
			return;
		}

		// Auto theme: sync with page theme
		const getPageTheme = () =>
			document.documentElement.classList.contains("dark") ? "dark" : "default";

		applyTheme(getPageTheme());

		const onThemeChange = () => applyTheme(getPageTheme());
		window.addEventListener("themechange", onThemeChange);
		return () => window.removeEventListener("themechange", onThemeChange);
	}, [state.theme, editorRef]);

	return (
		<div ref={containerRef} className="space-y-0">
			{isClassic && <div ref={toolbarRef} />}
			{ROOTS.map((root) => (
				<div key={root.key} className="mt-5">
					<div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-b-0 rounded-t-md first:rounded-t-lg">
						<span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
							{root.label}
						</span>
						<span className="text-[10px] text-muted-foreground/60">root: &quot;{root.key}&quot;</span>
					</div>
					<div data-root={root.key} />
				</div>
			))}
		</div>
	);
}
