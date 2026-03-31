import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
	typescript: { ignoreBuildErrors: false },
	serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
