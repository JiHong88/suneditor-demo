"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocale } from "next-intl";
import SunEditorReact, { type SunEditorInstance, type SunEditorModule, type SunEditorOptions } from "@suneditor/suneditor-react";
import type { SunEditor as SE } from "suneditor/types";
import "suneditor/css/editor";
import "suneditor/css/contents";
import "suneditor/src/themes/dark.css";
import "suneditor/src/themes/midnight.css";
import "suneditor/src/themes/cobalt.css";
import "suneditor/src/themes/cream.css";
import { localeCodes, toEditorCode } from "@/i18n/languages";
import { FullButtonList } from "./buttonList";
import { resizeImageFiles } from "@/lib/resizeImage";

const EditorPlaceholder = () => <div className='min-h-[200px] rounded-lg bg-muted/40' />;

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

/** Site dark/light mode → editor theme name ("" = default). Follows the header toggle's `themechange` event. */
export function useSiteTheme(): "dark" | "" {
	const [dark, setDark] = useState(() => typeof document !== "undefined" && document.documentElement.classList.contains("dark"));
	useEffect(() => {
		setDark(document.documentElement.classList.contains("dark"));
		const handler = (e: Event) => setDark((e as CustomEvent).detail === "dark");
		window.addEventListener("themechange", handler);
		return () => window.removeEventListener("themechange", handler);
	}, []);
	return dark ? "dark" : "";
}

type ImageUploadBeforeParams = { info: { files: FileList }; handler: (newInfo?: unknown) => void };

/**
 * Injects the client-side image resize into `events.onImageUploadBefore`.
 * A user-provided handler runs first so it can observe or cancel; silently overriding it would drop it.
 */
export function withImageResize(events: SunEditorOptions["events"] | undefined): NonNullable<SunEditorOptions["events"]> {
	const userEvents = (events ?? {}) as Record<string, unknown>;
	const userImageUploadBefore = userEvents.onImageUploadBefore as ((params: ImageUploadBeforeParams) => unknown) | undefined;
	return {
		...userEvents,
		onImageUploadBefore: async (params: ImageUploadBeforeParams) => {
			if (userImageUploadBefore && (await userImageUploadBefore(params)) === false) return false;
			const resizedFiles = await resizeImageFiles(params.info.files);
			params.handler({ ...params.info, files: resizedFiles });
		},
	} as NonNullable<SunEditorOptions["events"]>;
}

interface SunEditorProps {
	/** Initial HTML (applied once at creation; remount with `key` to replace). */
	value?: SE.InitOptions["value"];
	/** SunEditor init options. `events` and `theme` stay in sync on every render; the rest applies at creation. */
	options?: SE.InitOptions;
	/** Explicit theme. Omit to follow the site's dark/light mode. */
	theme?: "default" | "dark" | "midnight" | "cobalt" | "cream";
	onInstance?: (instance: SE.Instance) => void;
	toolbarContainerRef?: React.RefObject<HTMLDivElement | null>;
	statusbarContainerRef?: React.RefObject<HTMLDivElement | null>;
}

/**
 * Site-wide SunEditor component on top of `@suneditor/suneditor-react`.
 * Adds what every demo page needs: all built-in plugins, the full button list, the site theme,
 * the UI language of the current locale and client-side image resizing before upload.
 */
const SunEditor: React.FC<SunEditorProps> = ({ value, options, theme: themeProp, onInstance, toolbarContainerRef, statusbarContainerRef }) => {
	const locale = useLocale();
	const siteTheme = useSiteTheme();

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

	const theme = themeProp === undefined ? siteTheme : themeProp === "default" ? "" : themeProp;

	// Called by the wrapper after mount (container refs are set) and on every render for `events`/`theme`.
	const buildOptions = useCallback(
		(se: SunEditorModule): SunEditorOptions => {
			const { plugins: userPlugins, events, ...rest } = options ?? {};
			return {
				// Merge custom plugins with the built-in ones instead of replacing them
				plugins: userPlugins ? { ...(se.plugins as Record<string, unknown>), ...(userPlugins as Record<string, unknown>) } : se.plugins,
				buttonList: FullButtonList,
				...(toolbarContainerRef?.current && { toolbar_container: toolbarContainerRef.current }),
				...(statusbarContainerRef?.current && { statusbar_container: statusbarContainerRef.current }),
				...rest,
				...(autoLangPack && { lang: autoLangPack }),
				value: value || rest.value || "",
				theme,
				events: withImageResize(events),
			} as SunEditorOptions;
		},
		[options, autoLangPack, value, theme, toolbarContainerRef, statusbarContainerRef],
	);

	const handleRef = useCallback(
		(instance: SunEditorInstance | null) => {
			if (instance) onInstance?.(instance);
		},
		[onInstance],
	);

	if (!langReady) return <EditorPlaceholder />;

	// `lang` is a fixed option in SunEditor (resetOptions ignores it), so a locale change remounts the editor
	return <SunEditorReact key={autoLangCode} ref={handleRef} options={buildOptions} />;
};

export default SunEditor;
