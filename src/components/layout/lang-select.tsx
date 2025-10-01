"use client";

import { useEffect, useState, useTransition } from "react";
import { readCookie } from "@/lib/cookie";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Locale, locales, defaultLocale } from "@/i18n/routing";
import { getDir, buildLanguageOptions } from "@/i18n/lang";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
		<Select value={lang} onValueChange={onchange}>
			<SelectTrigger className="gap-2 border-none bg-muted px-2 py-1 text-xs text-muted-foreground shadow-none m-0" size="xs">
				{isPending ? (
					<Loader2 className="h-3 w-3 animate-spin" aria-label="Loading" />
				) : (
					<Globe2 className="h-3 w-3" aria-hidden />
				)}
				<SelectValue placeholder="Language" />
			</SelectTrigger>
			<SelectContent>
				{buildLanguageOptions(locales).map((l: any) => (
					<SelectItem value={l.value} dir={l.dir} key={l.value}>
						{l.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
