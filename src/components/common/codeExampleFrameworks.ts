import rawFrameworks from "@/data/snippets/frameworks";

export type FrameworkKey = "javascript-cdn" | "javascript-npm" | "angular" | "react" | "svelte" | "vue" | "webcomponents";

export type CodeFramework = {
	key: FrameworkKey;
	name: string;
	icon: string;
	accent: string;
	kind: "language" | "framework";
	snippet: string;
};

export const DEFAULT_FRAMEWORK_KEY: FrameworkKey = "javascript-cdn";

export const CODE_FRAMEWORKS: CodeFramework[] = rawFrameworks as CodeFramework[];

export function getCodeFramework(key: FrameworkKey | string) {
	return CODE_FRAMEWORKS.find((item) => item.key === key) ?? CODE_FRAMEWORKS[0];
}

export function hexToRgba(hex: string, alpha: number) {
	const cleaned = hex.replace("#", "");
	const expanded = cleaned.length === 3 ? cleaned.split("").map((ch) => `${ch}${ch}`).join("") : cleaned;
	if (expanded.length !== 6) return `rgba(99, 102, 241, ${alpha})`;

	const value = Number.parseInt(expanded, 16);
	const r = (value >> 16) & 255;
	const g = (value >> 8) & 255;
	const b = value & 255;
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
