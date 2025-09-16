import { useState, useEffect } from "react";

export function ThemeToggle() {
	const [theme, setTheme] = useState<"system" | "light" | "dark">((localStorage.getItem("theme") as any) || "system");

	useEffect(() => {
		console.log("theme", theme);
		try {
			localStorage.setItem("theme", theme);
		} catch {
			//
		}
		const root = document.documentElement;
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const isDark = theme === "dark" || (theme === "system" && prefersDark);
		root.classList.toggle("dark", isDark);
		(root as any).dataset.theme = theme;
	}, [theme]);

	return (
		<div className='flex items-center gap-1 rounded-md border bg-background text-xs'>
			<button className={`rounded-md px-2 py-1 ${theme === "light" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} onClick={() => setTheme("light")}>
				Light
			</button>
			<button className={`rounded-md px-2 py-1 ${theme === "dark" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} onClick={() => setTheme("dark")}>
				Dark
			</button>
			<button className={`rounded-md px-2 py-1 ${theme === "system" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`} onClick={() => setTheme("system")}>
				System
			</button>
		</div>
	);
}
