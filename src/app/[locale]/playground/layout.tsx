import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Playground",
	description: "Interactive SunEditor playground. Customize plugins, themes, toolbar, and editor options in real-time. Share configurations via URL.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
