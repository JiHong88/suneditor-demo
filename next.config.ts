import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	typescript: { ignoreBuildErrors: false },
	productionBrowserSourceMaps: true,
	// /react reads the translated README files with fs at render time
	outputFileTracingIncludes: { "/[locale]/react": ["./src/data/react-guide/*.md"] },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
