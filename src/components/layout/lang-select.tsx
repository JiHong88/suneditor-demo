"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";
import { localeCodes } from "@/i18n/languages";
import { getDir, buildLanguageOptions } from "@/i18n/lang";
import { Loader2, Globe2 } from "lucide-react";
import { useLocale } from "next-intl";

export function LangSelect() {
	const currentLocale = useLocale() as Locale;
	const [lang, setLang] = useState<Locale>(currentLocale);
	const router = useRouter();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		const root = document.documentElement;
		root.setAttribute("dir", getDir(lang));
		root.setAttribute("data-lang", lang);
		window.dispatchEvent(new CustomEvent("langchange", { detail: lang } as any));
	}, [lang]);

	const onValueChange = (next: Locale) => {
		setLang(next);
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
				{buildLanguageOptions(localeCodes).map((l: any) => (
					<option value={l.value} key={l.value}>
						{l.dir === "rtl" ? `${l.label} ←` : l.label}
					</option>
				))}
			</select>
		</div>
	);
}
