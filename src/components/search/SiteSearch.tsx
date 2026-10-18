"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

// Palette + index load only on first open
const SearchPalette = dynamic(() => import("./SearchPalette"), { ssr: false });

/** Ignore ⌘K typed inside an editor — SunEditor uses Ctrl/⌘+K for its link button. */
function isInEditor(target: EventTarget | null) {
	const el = target as HTMLElement | null;
	return !!el && (el.isContentEditable || !!el.closest?.(".sun-editor"));
}

/** Header search button + global ⌘K / Ctrl+K shortcut. */
export function SiteSearch({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
	const t = useTranslations("Search");
	const [open, setOpen] = React.useState(false);
	const [mounted, setMounted] = React.useState(false);
	const [isMac, setIsMac] = React.useState(true);

	React.useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)), []);

	const show = React.useCallback(() => {
		setMounted(true);
		setOpen(true);
	}, []);

	React.useEffect(() => {
		// Only the desktop instance owns the shortcut (both are rendered, one hidden by CSS)
		if (variant !== "desktop") return;
		const onKey = (e: KeyboardEvent) => {
			if (e.defaultPrevented || e.key.toLowerCase() !== "k" || !(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
			if (isInEditor(e.target)) return;
			e.preventDefault();
			setMounted(true);
			setOpen((v) => !v);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [variant]);

	return (
		<>
			{variant === "desktop" ? (
				<button
					type='button'
					onClick={show}
					aria-label={t("title")}
					className='flex h-8 shrink-0 items-center gap-2 rounded-md border bg-background/60 ps-2.5 pe-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
				>
					<Search className='size-3.5' aria-hidden />
					<span className='hidden xl:inline'>{t("button")}</span>
					<kbd className='rounded border bg-muted px-1 py-0.5 font-sans text-[10px]'>{isMac ? "⌘K" : "Ctrl K"}</kbd>
				</button>
			) : (
				<button
					type='button'
					onClick={show}
					aria-label={t("title")}
					className='inline-flex size-9 items-center justify-center rounded-md border bg-background/60 hover:bg-accent'
				>
					<Search className='size-4' aria-hidden />
				</button>
			)}
			{mounted && <SearchPalette open={open} onOpenChange={setOpen} />}
		</>
	);
}
