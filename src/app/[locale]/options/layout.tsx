import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Options Reference",
	description: "Complete reference for 200+ SunEditor options. Editor options, frame options, and plugin-specific configuration.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
