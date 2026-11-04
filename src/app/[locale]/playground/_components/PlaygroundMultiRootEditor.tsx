"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SunEditorGroup, SunEditorRoot, type SunEditorFrameOptions, type SunEditorInstance, type SunEditorModule, type SunEditorOptions } from "@suneditor/suneditor-react";
import { FullButtonList } from "@/components/editor/buttonList";
import { useSiteTheme, withImageResize } from "@/components/editor/suneditor";
import type { PlaygroundState } from "../_lib/playgroundState";
import { stateToEditorOptions, getRootConfigs } from "../_lib/playgroundState";
import { type AllLibs, getActiveLibs } from "./externalLibsLoader";

/** Dynamic import for SunEditor lang packs */
async function loadLangPack(code: string): Promise<Record<string, unknown> | undefined> {
	if (!code) return undefined;
	try {
		const mod = await import(`suneditor/langs/${code}`);
		return mod.default ?? mod;
	} catch {
		return undefined;
	}
}

interface Props {
	state: PlaygroundState;
	editorRef: React.RefObject<SunEditorInstance | null>;
	contentRef: React.RefObject<Record<string, string>>;
	allLibs: AllLibs;
}

export default function PlaygroundMultiRootEditor({ state, editorRef, contentRef, allLibs }: Props) {
	const toolbarRef = useRef<HTMLDivElement>(null);
	const statusbarRef = useRef<HTMLDivElement>(null);
	const siteTheme = useSiteTheme();

	const isClassic = state.mode === "classic" || !state.mode;

	const roots = useMemo(() => getRootConfigs(state), [state]);

	// Lang pack loading
	const [langPack, setLangPack] = useState<Record<string, unknown> | undefined>(undefined);
	const [langLoaded, setLangLoaded] = useState(!state.lang);

	useEffect(() => {
		if (!state.lang) {
			setLangPack(undefined);
			setLangLoaded(true);
			return;
		}
		setLangLoaded(false);
		loadLangPack(state.lang).then((pack) => {
			setLangPack(pack);
			setLangLoaded(true);
		});
	}, [state.lang]);

	const extLibs = useMemo(() => getActiveLibs(allLibs, state.math_mathLib), [allLibs, state.math_mathLib]);

	// Shared instance options. The group calls this after the roots and container refs are mounted,
	// and on every render to re-sync `events` and `theme`.
	const buildOptions = useCallback(
		(se: SunEditorModule): SunEditorOptions => {
			const opts = stateToEditorOptions(state) as Record<string, unknown>;
			opts.lang = langPack ?? null;
			// Per-frame options are set on each root
			delete opts.height;
			delete opts.width;
			if (extLibs && Object.keys(extLibs).length > 0) opts.externalLibs = extLibs;

			return {
				plugins: se.plugins,
				buttonList: FullButtonList,
				theme: state.theme || siteTheme,
				// Classic mode in multiroot requires toolbar_container
				...(isClassic && toolbarRef.current && { toolbar_container: toolbarRef.current }),
				...(state.statusbar_container_enabled && statusbarRef.current && { statusbar_container: statusbarRef.current }),
				...opts,
				events: withImageResize(opts.events as SunEditorOptions["events"]),
			} as SunEditorOptions;
		},
		[state, langPack, extLibs, siteTheme, isClassic],
	);

	const handleRef = useCallback(
		(instance: SunEditorInstance | null) => {
			editorRef.current = instance;
		},
		[editorRef],
	);

	// Initial HTML of each root: content saved by the previous mount (or from the URL), else the root's
	// value option. Root frame options are read at render time, so the previous mount keeps contentRef
	// current on every change (see onChange below) instead of writing it back on unmount — the new
	// component renders before the old one's cleanup runs. When the parent changes a root's value option
	// it overwrites contentRef during its own render, so that value wins on the remount that follows.
	const rootFrameOptions = useMemo(() => {
		const result: Record<string, SunEditorFrameOptions> = {};
		for (const root of roots) {
			const frame = root.options as SunEditorFrameOptions;
			result[root.key] = { ...frame, value: contentRef.current[root.key] || (frame.value as string | undefined) || "" };
		}
		return result;
		// contentRef is read once per mount on purpose (remounts get a new component instance)
	}, [roots, contentRef]);

	if (!langLoaded || extLibs === null) return null;

	return (
		<SunEditorGroup ref={handleRef} options={buildOptions}>
			<div className='space-y-0'>
				{isClassic && <div ref={toolbarRef} />}
				{state.statusbar_container_enabled && <div className='mt-3' ref={statusbarRef} />}
				{roots.map((root) => {
					const isHeader = root.key === "header";
					const dotColor = isHeader ? "bg-violet-500" : "bg-emerald-500";
					const bgColor = isHeader ? "bg-violet-50 dark:bg-violet-400/10" : "bg-emerald-50 dark:bg-emerald-400/10";
					const borderColor = isHeader ? "border-violet-200 dark:border-violet-400/30" : "border-emerald-200 dark:border-emerald-400/30";
					const textColor = isHeader ? "text-violet-700 dark:text-violet-300" : "text-emerald-700 dark:text-emerald-300";
					const subTextColor = isHeader ? "text-violet-500/60 dark:text-violet-400/50" : "text-emerald-500/60 dark:text-emerald-400/50";
					return (
						<div key={root.key} className='mt-5'>
							<div className={`flex items-center gap-2 px-3 py-1.5 ${bgColor} border ${borderColor} border-b-0 rounded-t-md`}>
								<span className={`inline-block w-2 h-2 rounded-full ${dotColor}`} />
								<span className={`text-xs font-semibold ${textColor} uppercase tracking-wider`}>{root.label}</span>
								<code className={`text-[10px] ${subTextColor}`}>root: &quot;{root.key}&quot;</code>
							</div>
							<SunEditorRoot
								name={root.key}
								data-root={root.key}
								options={rootFrameOptions[root.key]}
								onChange={(html) => {
									contentRef.current[root.key] = html;
								}}
							/>
						</div>
					);
				})}
			</div>
		</SunEditorGroup>
	);
}
