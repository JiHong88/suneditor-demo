import { getRequestConfig } from "next-intl/server";
import { Locale, defaultLocale, countryToLocale } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
	const requested = await requestLocale;
	const locale: Locale = countryToLocale(requested);

	let messages = (await import(`../messages/${locale}.json`))?.default;
	if (locale !== defaultLocale) {
		const fallback = (await import(`../messages/${defaultLocale}.json`)).default;
		messages = { ...fallback, ...messages };
	}

	return {
		locale,
		messages,
	};
});
