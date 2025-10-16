"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LangSelect } from "./lang-select";
import { Heart } from "lucide-react";

type Props = {
	stars?: number;
	className?: string;
};

const ThemeToggle = dynamic(() => import("./theme-toggle").then((m) => m.ThemeToggle), { ssr: false });

export default function MicroBar({ className }: Props) {
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
						<LangSelect />
					</label>
				</div>

				{/* 오른쪽: 도네이션 */}
				<div className='flex items-center gap-2'>
					<ThemeToggle />

					<Link
						href='https://opencollective.com/suneditor'
						target='_blank'
						rel='noreferrer'
						className='inline-flex items-center gap-1 h-6 rounded px-2 py-1 border hover:bg-accent hover:text-accent-foreground'
					>
						<Heart className='size-3.5' aria-hidden style={{ stroke: "#c96198" }} />
						<span>Sponsor</span>
					</Link>
				</div>
			</div>
		</div>
	);
}
