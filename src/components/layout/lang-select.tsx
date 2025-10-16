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

	const onValueChange = (next: Locale) => {
		startTransition(() => {
			router.replace(pathname, { locale: next });
		});
	};

	return (
		<div className='flex bg-muted rounded-xl items-center px-2'>
			{isPending ? <Loader2 className='h-3 w-3 animate-spin' aria-label='Loading' /> : <Globe2 className='h-3 w-3' aria-hidden />}
			<select
				value={lang}
				onChange={(e) => onValueChange(e.target.value as Locale)}
				disabled={isPending}
				className='cursor-pointer gap-2 border-none px-2 py-1 text-xs text-muted-foreground shadow-none m-0 appearance-none'
			>
				{buildLanguageOptions(locales).map((l: any) => (
					<option value={l.value} key={l.value} dir={l.dir}>
						{l.dir === "rtl" ? `${l.label} ←` : l.label}
					</option>
				))}
			</select>
		</div>
	);
}
