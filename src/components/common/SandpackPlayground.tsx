"use client";

import { useEffect, useState } from "react";
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider, type SandpackProviderProps } from "@codesandbox/sandpack-react";
import { atomDark, githubLight } from "@codesandbox/sandpack-themes";
import { cn } from "@/lib/utils";
import { hexToRgba } from "./codeExampleFrameworks";

type SandpackPlaygroundProps = {
	template: SandpackProviderProps["template"];
	files: SandpackProviderProps["files"];
	customSetup?: SandpackProviderProps["customSetup"];
	activeFile?: string;
	accentColor?: string;
	className?: string;
};

function usePrefersDark() {
	const resolveDark = () => {
		if (typeof document === "undefined") return false;
		return !!document.documentElement?.classList.contains("dark");
	};

	const [dark, setDark] = useState(() => resolveDark());

	useEffect(() => {
		const syncDark = () => setDark(resolveDark());
		syncDark();

		const onThemeChange = (event: Event) => {
			const detail = (event as CustomEvent<string>).detail;
			if (detail === "dark" || detail === "light") {
				setDark(detail === "dark");
				return;
			}
			syncDark();
		};

		window.addEventListener("themechange", onThemeChange);
		return () => window.removeEventListener("themechange", onThemeChange);
	}, []);

	return dark;
}

export default function SandpackPlayground({ template, files, customSetup, activeFile, accentColor, className }: SandpackPlaygroundProps) {
	const prefersDark = usePrefersDark();

	return (
		<div
			className={cn("overflow-hidden rounded-2xl border bg-card/90 shadow-sm", className)}
			style={
				accentColor
					? {
							borderColor: hexToRgba(accentColor, 0.6),
							boxShadow: `inset 0 0 0 1px ${hexToRgba(accentColor, 0.15)}`,
						}
					: undefined
			}
		>
			<SandpackProvider
				template={template}
				files={files}
				customSetup={customSetup}
				theme={prefersDark ? atomDark : githubLight}
				options={{
					activeFile,
					autorun: true,
					recompileMode: "delayed",
					recompileDelay: 400,
				}}
			>
				<SandpackLayout className='min-h-[520px] overflow-hidden border-0'>
					<SandpackCodeEditor showTabs showInlineErrors showLineNumbers wrapContent style={{ minHeight: 520 }} />
					<SandpackPreview className='min-h-[520px]' showNavigator showOpenInCodeSandbox={false} />
				</SandpackLayout>
			</SandpackProvider>
		</div>
	);
}
