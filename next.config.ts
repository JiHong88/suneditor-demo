import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	typescript: { ignoreBuildErrors: false },
	productionBrowserSourceMaps: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
