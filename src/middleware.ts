import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/routing";

const intlWithDetection = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: "as-needed",
	localeDetection: true,
});

const intlNoDetection = createMiddleware({
	locales,
	defaultLocale,
	localePrefix: "as-needed",
	localeDetection: false,
});

export default function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	if (pathname === "/") {
		return intlWithDetection(req);
	}

	return intlNoDetection(req);
}

export const config = {
	matcher: ["/((?!_next|api|.*\\..*).*)"],
};
