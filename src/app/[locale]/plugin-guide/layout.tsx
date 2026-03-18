import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Plugin Guide",
	description: "Complete guide to SunEditor's plugin system. Built-in plugins, display types, and how to create custom plugins.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
