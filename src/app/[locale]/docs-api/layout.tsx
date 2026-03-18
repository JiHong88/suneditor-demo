import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "API Documentation",
	description: "SunEditor API reference. Methods, properties, types, and interfaces for the editor instance and configuration.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
