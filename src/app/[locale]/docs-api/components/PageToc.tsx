"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
	id: string;
	label: string;
};

interface PageTocProps {
	items: TocItem[];
}

export default function PageToc({ items }: PageTocProps) {
	const [activeId, setActiveId] = useState<string>("");

	useEffect(() => {
		if (items.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
					}
				}
			},
			{ rootMargin: "-100px 0px -60% 0px", threshold: 0 },
		);

		for (const item of items) {
			const el = document.getElementById(item.id);
			if (el) observer.observe(el);
		}

		return () => observer.disconnect();
	}, [items]);

	if (items.length === 0) return null;

	const handleClick = (id: string) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
			window.history.replaceState(null, "", `#${id}`);
		}
	};

	return (
		<nav className='hidden xl:block w-48 shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto'>
			<div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2'>
				On this page
			</div>
			<ul className='space-y-0.5'>
				{items.map((item) => (
					<li key={item.id}>
						<button
							onClick={() => handleClick(item.id)}
							className={cn(
								"block w-full text-start px-2 py-0.5 text-[11px] font-mono rounded transition-colors truncate",
								activeId === item.id
									? "text-primary bg-primary/5 font-medium"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
							)}
							title={item.label}
						>
							{item.label}
						</button>
					</li>
				))}
			</ul>
		</nav>
	);
}
