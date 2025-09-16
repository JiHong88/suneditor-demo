"use client";
import { useEffect, useState } from "react";

export type Lang = "ko" | "en" | "ar";

function readInitial(): Lang {
  if (typeof document !== "undefined") {
    const fromDom = (document.documentElement.getAttribute("data-lang") as Lang) || "ko";
    const fromLs = (localStorage.getItem("lang") as Lang) || null;
    return (fromLs ?? fromDom) as Lang;
  }
  return "ko";
}

export function useLang() {
  const [lang, setLang] = useState<Lang>(readInitial);

  // lang 변경 → DOM, localStorage, cookie, 커스텀 이벤트
  useEffect(() => {
    const root = document.documentElement;
    const dir = lang === "ar" ? "rtl" : "ltr";
    root.setAttribute("lang", lang);
    root.setAttribute("dir", dir);
    root.setAttribute("data-lang", lang);
    try { localStorage.setItem("lang", lang); } catch {}
    document.cookie = `lang=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent<Lang>("langchange", { detail: lang } as any));
  }, [lang]);

  // 다른 탭에서 바꾸면 동기화
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "lang" && e.newValue) setLang(e.newValue as Lang);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { lang, setLang };
}
