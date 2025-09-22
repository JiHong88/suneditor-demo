"use client";

import { useEffect, useState, useTransition } from "react";
import { readCookie } from "@/lib/cookie";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Locale, locales, defaultLocale } from "@/i18n/routing";
import { getDir, buildLanguageOptions } from "@/i18n/lang";
import { Loader2, Globe2 } from "lucide-react";

function getInitialLang(): Locale {
	if (typeof document === "undefined") return defaultLocale;
	const fromCookie = (readCookie("NEXT_LOCALE") as Locale | null) ?? null;
	const fromDom = (document.documentElement.getAttribute("data-lang") as Locale) || null;
	return (fromCookie || fromDom || defaultLocale) as Locale;
}

export function LangSelect() {
	const [lang, setLang] = useState<Locale>(getInitialLang);
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		const root = document.documentElement;
		root.setAttribute("dir", getDir(lang));
		root.setAttribute("data-lang", lang);
		setLang(lang);
		window.dispatchEvent(new CustomEvent("langchange", { detail: lang } as any));
	}, [lang]);

	const onchange = (next: Locale) => {
		startTransition(() => {
			router.replace(pathname, { locale: next });
		});
	};

	return (
		<div className='flex items-center gap-2 rounded-xl border border-border bg-muted px-2 py-1 text-xs'>
			<span className='text-muted-foreground'>{isPending ? <Loader2 className='h-3 w-3 animate-spin' aria-label='Loading' /> : <Globe2 className='h-3 w-3' aria-hidden />}</span>
			<select className='bg-muted text-muted-foreground outline-none appearance-none' value={lang} onChange={(e) => onchange(e.target.value as Locale)} aria-label='Language'>
				{buildLanguageOptions(locales).map((l: any) => (
					<option value={l.value} dir={l.dir} key={l.value}>
						{l.label}
					</option>
				))}
			</select>
		</div>
	);
}
