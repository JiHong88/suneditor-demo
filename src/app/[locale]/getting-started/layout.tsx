import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Getting Started",
	description: "Install SunEditor via NPM or CDN and integrate with React, Vue, Angular, and more. Step-by-step guide with code examples.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
