import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Feature Demo",
	description: "Explore 30+ features of SunEditor including text formatting, image upload, tables, math formulas, RTL support, and more.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
