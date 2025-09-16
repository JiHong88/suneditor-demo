"use client";

import { useEffect, useState } from "react";
import { readCookie, writeCookie } from "@/lib/cookie";

type Lang = "ko" | "en" | "ar";
const DEFAULT_LANG: Lang = "ko";

function getInitialLang(): Lang {
	if (typeof document === "undefined") return DEFAULT_LANG;
	const fromCookie = (readCookie("lang") as Lang | null) ?? null;
	const fromDom = (document.documentElement.getAttribute("data-lang") as Lang) || null;
	const fromLs = (localStorage.getItem("lang") as Lang) || null;
	return (fromCookie || fromDom || fromLs || DEFAULT_LANG) as Lang;
}

export function LangSelect() {
	const [lang, setLang] = useState<Lang>(getInitialLang);

	useEffect(() => {
		const root = document.documentElement;
		const dir = lang === "ar" ? "rtl" : "ltr";
		root.setAttribute("lang", lang);
		root.setAttribute("dir", dir);
		root.setAttribute("data-lang", lang);

		// 쿠키
		writeCookie("lang", lang, { days: 365 });

		// 탭 동기화용 미러
		try {
			localStorage.setItem("lang", lang);
		} catch {}

		// 앱 내부 이벤트
		window.dispatchEvent(new CustomEvent("langchange", { detail: lang } as any));
	}, [lang]);

	// 다른 탭에서 변경 감지
	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key === "lang" && e.newValue) setLang(e.newValue as Lang);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	return (
		<div className='flex items-center gap-2 rounded-xl border bg-background px-2 py-1 text-xs'>
			<span className='text-muted-foreground'>Lang</span>
			<select className='bg-transparent outline-none' value={lang} onChange={(e) => setLang(e.target.value as Lang)} aria-label='Language'>
				<option value='ko'>한국어</option>
				<option value='en'>English</option>
				<option value='ar'>العربية (RTL)</option>
			</select>
		</div>
	);
}
