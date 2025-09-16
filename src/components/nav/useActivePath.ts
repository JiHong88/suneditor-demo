"use client";
import { usePathname } from "next/navigation";

export function useActivePath(mode: "exact" | "startsWith" = "startsWith") {
  const pathname = usePathname();
  return {
    pathname,
    isActive: (href: string) => {
      if (!pathname) return false;
      if (href === "/") return pathname === "/";
      return mode === "exact" ? pathname === href : pathname.startsWith(href + "/") || pathname === href;
    },
  };
}
