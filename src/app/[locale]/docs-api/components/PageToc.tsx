"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
	id: string;
	label: string;
};

interface PageTocProps {
	items: TocItem[];
	onItemClick?: (id: string) => void;
}

export default function PageToc({ items, onItemClick }: PageTocProps) {
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
			onItemClick?.(id);
		}
	};

	return (
		<nav className='hidden xl:block w-48 shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto'>
			<div className='px-3 pt-3 pb-2'>
				<div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.12em] mb-3'>
					On this page
				</div>
				<ul className='space-y-px border-s border-border/40'>
					{items.map((item) => (
						<li key={item.id}>
							<button
								onClick={() => handleClick(item.id)}
								className={cn(
									"block w-full text-start ps-3 pe-2 py-1 text-[11px] font-mono transition-colors truncate -ms-px border-s-2",
									activeId === item.id
										? "text-primary border-primary font-medium"
										: "text-muted-foreground/70 border-transparent hover:text-foreground hover:border-border",
								)}
								title={item.label}
							>
								{item.label}
							</button>
						</li>
					))}
				</ul>
			</div>
		</nav>
	);
}
