"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export type OptDesc = Record<string, { description: string; default?: string }>;

// English always bundled as fallback
import optDescEn from "@/data/api/option-descriptions.en.json";

const cache = new Map<string, OptDesc>();
cache.set("en", optDescEn as OptDesc);

async function load(locale: string): Promise<OptDesc> {
	if (cache.has(locale)) return cache.get(locale)!;
	try {
		// webpack creates a chunk per matching file in the directory
		const mod = await import(`@/data/api/option-descriptions.${locale}.json`);
		const data = (mod.default ?? mod) as OptDesc;
		cache.set(locale, data);
		return data;
	} catch {
		return cache.get("en")!;
	}
}

/** Dynamically loads option-descriptions for the current locale (with en fallback). */
export function useOptDesc(): OptDesc {
	const locale = useLocale();
	const [data, setData] = useState<OptDesc>(() => cache.get(locale) ?? cache.get("en")!);

	useEffect(() => {
		load(locale).then(setData);
	}, [locale]);

	return data;
}
