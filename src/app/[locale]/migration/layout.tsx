import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "v2 → v3 Migration",
	description: "Migrate from SunEditor v2 to v3. Interactive option converter, breaking changes guide, and button name mapping.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
