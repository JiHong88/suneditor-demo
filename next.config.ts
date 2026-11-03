import path from "node:path";
import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	typescript: { ignoreBuildErrors: false },
	productionBrowserSourceMaps: true,
	// `@suneditor/react` is linked from `../suneditor-react` (file: dependency). Turbopack only resolves
	// modules inside its root, so the root must include the parent folder while the link is in place.
	turbopack: { root: path.join(__dirname, "..") },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
