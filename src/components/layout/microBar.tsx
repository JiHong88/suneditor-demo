"use client";

import * as React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LangSelect } from "./lang-select";
import { Heart, History, ArrowRightLeft, ChevronDown, Github } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
	stars?: number;
	className?: string;
};

const ThemeToggle = dynamic(() => import("./theme-toggle").then((m) => m.ThemeToggle), { ssr: false });

export default function MicroBar({ stars, className }: Props) {
	const t = useTranslations("Main");
	const tc = useTranslations("Common");
	const starsLabel = stars ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(stars) : null;
	const [v2Open, setV2Open] = useState(false);
	const v2Ref = useRef<HTMLDivElement>(null);

	// Close on outside click
	const handleClickOutside = useCallback((e: MouseEvent) => {
		if (v2Ref.current && !v2Ref.current.contains(e.target as Node)) {
			setV2Open(false);
		}
	}, []);

	useEffect(() => {
		if (v2Open) {
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [v2Open, handleClickOutside]);

	return (
		<div
			className={cn(
				"microbar fixed md:sticky left-0 right-0 z-30 py-4",
				"h-9 border-b backdrop-blur-md bg-amber-50/40 dark:bg-surface-inset/60 dark:border-white/10",
				"text-xs",
				className,
			)}
		>
			<div className='mx-auto h-full w-full max-w-5xl px-4 md:px-6 flex items-center gap-2 justify-between'>
				{/* 왼쪽: 언어 */}
				<div className='flex items-center gap-2'>
					<label className='inline-flex items-center gap-1'>
						<LangSelect />
					</label>
				</div>

				{/* 오른쪽 */}
				<div className='flex items-center gap-2'>
					{/* v2 dropdown */}
					<div ref={v2Ref} className='relative'>
						<button
							type='button'
							onClick={() => setV2Open((p) => !p)}
							title='SunEditor v2'
							className='inline-flex items-center gap-1 px-2 h-6 rounded-md border border-border/70 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10'
						>
							<History className='size-3' aria-hidden />
							<span>v2</span>
							<ChevronDown className={cn("size-3 transition-transform", v2Open && "rotate-180")} />
						</button>

						{v2Open && (
							<div className='absolute end-0 top-full mt-1.5 w-40 rounded-lg border bg-popover shadow-md py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150'>
								<a
									href='https://legacy.suneditor.com'
									target='_blank'
									className='flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground transition-colors'
									onClick={() => setV2Open(false)}
								>
									<History className='size-3.5 text-muted-foreground' />
									v2 Legacy Demo
								</a>
								<Link
									href='/migration'
									className='flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-accent hover:text-accent-foreground transition-colors'
									onClick={() => setV2Open(false)}
								>
									<ArrowRightLeft className='size-3.5 text-muted-foreground' />
									{t("Menus.migration")}
								</Link>
							</div>
						)}
					</div>

					<ThemeToggle />

					<Link
						href='https://opencollective.com/suneditor'
						target='_blank'
						rel='noreferrer'
						title={tc("sponsor")}
						className='inline-flex items-center gap-1 px-2 h-6 rounded-md border border-border/70 bg-background/50 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-white/[0.04] dark:hover:bg-white/10'
					>
						<Heart className='size-3.5 text-pink-500 dark:text-pink-400' aria-hidden />
						<span>{tc("sponsor")}</span>
					</Link>

					<a
						href='https://github.com/JiHong88/SunEditor'
						target='_blank'
						rel='noreferrer'
						title={t("starOnGitHub")}
						aria-label={t("starOnGitHub")}
						className='inline-flex items-center h-6 rounded-md overflow-hidden text-muted-foreground transition-colors hover:text-foreground sm:border sm:border-border/70 sm:bg-background/50 dark:sm:border-white/10 dark:sm:bg-white/[0.04]'
					>
						<span className='inline-flex items-center gap-1 h-full px-1.5 sm:px-2 transition-colors hover:bg-accent dark:hover:bg-white/10'>
							<Github className='size-3.5 text-violet-600 dark:text-violet-400' aria-hidden />
							<span className='hidden sm:inline'>Star</span>
						</span>
						{starsLabel && <span className='hidden sm:inline-flex items-center h-full px-2 border-s border-border/70 bg-muted/60 font-medium tabular-nums text-foreground/80 dark:border-white/10 dark:bg-white/[0.06]'>{starsLabel}</span>}
					</a>
				</div>
			</div>
		</div>
	);
}
