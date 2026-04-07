"use client";

import { useEffect, useState, useTransition, useMemo } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Locale } from "@/i18n/routing";
import { localeCodes, languages } from "@/i18n/languages";
import { getDir } from "@/i18n/lang";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import LangDropdown, { type LangOption } from "@/components/common/LangDropdown";
import FlagIcon from "@/components/common/FlagIcon";
import { ChevronDown } from "lucide-react";

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

	const options: LangOption[] = useMemo(
		() =>
			localeCodes.map((code) => {
				const entry = languages.find((l) => l.code === code);
				return { value: code, locale: code, label: entry?.nativeName ?? code };
			}),
		[],
	);

	const onValueChange = (next: string) => {
		setLang(next as Locale);
		startTransition(() => {
			router.replace(pathname, { locale: next as Locale });
		});
	};

	const currentEntry = languages.find((l) => l.code === lang);

	return (
		<LangDropdown
			value={lang}
			options={options}
			onChange={onValueChange}
			disabled={isPending}
			trigger={
				<button
					disabled={isPending}
					className='flex items-center gap-1.5 bg-muted rounded-xl px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer'
				>
					{isPending ? (
						<Loader2 className='h-3 w-3 animate-spin' />
					) : (
						<FlagIcon locale={lang} className='text-sm' />
					)}
					<span>{currentEntry?.nativeName ?? lang}</span>
					<ChevronDown className='h-3 w-3 opacity-50' />
				</button>
			}
		/>
	);
}
