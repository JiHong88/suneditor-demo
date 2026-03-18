import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Deep Dive",
	description: "Advanced SunEditor guides: theme customization, upload configuration, event handling, and architecture overview.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
