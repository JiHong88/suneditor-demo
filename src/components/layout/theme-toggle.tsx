"use client";

import { useState, useEffect } from "react";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [ready, setReady] = useState(false);

	useEffect(() => {
		let initialTheme: "light" | "dark" = "light";

		try {
			const storedTheme = localStorage.getItem("theme");
			if (storedTheme === "dark" || storedTheme === "light") {
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
		const isDark = theme === "dark";
		root.classList.toggle("dark", isDark);
		(root as any).dataset.theme = theme;

		window.dispatchEvent(new CustomEvent("themechange", { detail: theme } as any));
	}, [ready, theme]);

	return (
		<div className='flex items-center gap-1 rounded-full bg-muted text-xs border-0'>
			<button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className='relative w-12 h-6 bg-muted rounded-full transition' aria-label='Toggle theme'>
				<span className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-transform leading-4 ${theme === "dark" ? "translate-x-6" : ""}`}>{theme === "dark" ? "🌙" : "☀️"}</span>
			</button>
		</div>
	);
}
