"use client";

import { useState, useEffect } from "react";

export type SiteTheme = "light" | "dark" | "midnight";

const ORDER: SiteTheme[] = ["light", "dark", "midnight"];
const ICON: Record<SiteTheme, string> = { light: "☀️", dark: "🌓", midnight: "🌙" };
const LABEL: Record<SiteTheme, string> = { light: "Light", dark: "Dark", midnight: "Midnight" };
/** Knob position per theme on the 3-stop track. */
const OFFSET: Record<SiteTheme, string> = { light: "", dark: "translate-x-5", midnight: "translate-x-10" };

function isSiteTheme(v: unknown): v is SiteTheme {
	return v === "light" || v === "dark" || v === "midnight";
}

/** Cycles light → dark → midnight. `dark` stays on `<html>` for both dark themes; `midnight` is added on top. */
export function ThemeToggle() {
	const [theme, setTheme] = useState<SiteTheme>("light");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let initialTheme: SiteTheme = "light";

		try {
			const storedTheme = localStorage.getItem("theme");
			if (isSiteTheme(storedTheme)) {
				initialTheme = storedTheme;
			} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				initialTheme = "dark";
			}
		} catch {
			/** ignore */
		}

		setTheme(initialTheme);
		setReady(true);
	}, []);

	useEffect(() => {
		if (!ready) return;

		try {
			localStorage.setItem("theme", theme);
		} catch {
			/** ignore */
		}

		const root = document.documentElement;
		root.classList.toggle("dark", theme !== "light");
		root.classList.toggle("midnight", theme === "midnight");
		root.dataset.theme = theme;

		window.dispatchEvent(new CustomEvent<SiteTheme>("themechange", { detail: theme }));
	}, [ready, theme]);

	const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

	return (
		<div className='flex items-center gap-1 rounded-full border border-border/70 bg-background/50 text-xs dark:border-white/10 dark:bg-white/[0.04]'>
			<button
				onClick={() => setTheme(next)}
				className='relative w-16 h-6 rounded-full transition'
				aria-label={`Theme: ${LABEL[theme]}. Switch to ${LABEL[next]}`}
				title={`${LABEL[theme]} → ${LABEL[next]}`}
			>
				{/* Faint ring so the knob stays visible on the near-black midnight track */}
				<span className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform leading-4 dark:ring-1 dark:ring-white/20 ${OFFSET[theme]}`}>{ICON[theme]}</span>
			</button>
		</div>
	);
}
