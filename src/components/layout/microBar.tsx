"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LangSelect } from "./lang-select";
import { Globe2, Heart, Star } from "lucide-react";

type Props = {
	stars?: number;
	className?: string;
};

export default function MicroBar({ stars, className }: Props) {
	return (
		<div
			className={cn(
				"microbar fixed md:sticky left-0 right-0 z-30 py-4",
				"h-9 border-b bg-slate-50/70 dark:bg-slate-900/40 backdrop-blur supports-[backdrop-filter]:bg-background/60",
				"text-xs",
				className,
			)}
		>
			<div className='container mx-auto h-full px-3 flex items-center gap-2 justify-between'>
				{/* 왼쪽: 언어 */}
				<div className='flex items-center gap-2'>
					<label className='inline-flex items-center gap-1'>
						<Globe2 className='size-3.5 opacity-80' />
						<LangSelect />
					</label>
				</div>

				{/* 오른쪽: 테마 · 스타 · (데스크톱) 도네이션 */}
				<div className='flex items-center gap-2'>
					<ThemeToggle />

					<Link href='https://github.com/JiHong88/suneditor' className='inline-flex items-center gap-1 rounded border px-2 py-1' target='_blank'>
						<Star className='size-3.5' aria-hidden style={{ fill: "#daaa3f", stroke: "#daaa3f" }} />
						<span> {typeof stars === "number" ? stars : "…"}</span>
					</Link>

					{/* 데스크톱에서만 도네이션 노출 */}
					<Link
						href='https://opencollective.com/suneditor'
						target='_blank'
						rel='noreferrer'
						className='hidden md:inline-flex items-center gap-1 rounded px-2 py-1 border hover:bg-accent hover:text-accent-foreground'
					>
						<Heart className='size-3.5' aria-hidden style={{ stroke: "#c96198" }} />
						<span>Sponsor</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
