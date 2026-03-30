import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	output: "standalone",
	typescript: { ignoreBuildErrors: false },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
