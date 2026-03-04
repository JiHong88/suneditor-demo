"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "../_lib/types";

type ApiSidebarProps = {
	items: SidebarItem[];
	selectedId: string;
	onSelect: (id: string) => void;
};

// Accent colors per top-level group index
const groupAccents = [
	{ border: "border-blue-400", bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-400" },
	{
		border: "border-violet-400",
		bg: "bg-violet-500/10",
		text: "text-violet-600 dark:text-violet-400",
		dot: "bg-violet-400",
	},
	{
		border: "border-emerald-400",
		bg: "bg-emerald-500/10",
		text: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-400",
	},
	{
		border: "border-amber-400",
		bg: "bg-amber-500/10",
		text: "text-amber-600 dark:text-amber-400",
		dot: "bg-amber-400",
	},
	{ border: "border-rose-400", bg: "bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", dot: "bg-rose-400" },
	{ border: "border-cyan-400", bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", dot: "bg-cyan-400" },
	{ border: "border-pink-400", bg: "bg-pink-500/10", text: "text-pink-600 dark:text-pink-400", dot: "bg-pink-400" },
	{ border: "border-teal-400", bg: "bg-teal-500/10", text: "text-teal-600 dark:text-teal-400", dot: "bg-teal-400" },
];

/** Check if item or any descendant has the given id */
function containsId(item: SidebarItem, targetId: string): boolean {
	if (item.id === targetId) return true;
	return item.children?.some((child) => containsId(child, targetId)) ?? false;
}

function SidebarItemComponent({
	item,
	selectedId,
	onSelect,
	depth = 0,
	accent,
}: {
	item: SidebarItem;
	selectedId: string;
	onSelect: (id: string) => void;
	depth?: number;
	accent: (typeof groupAccents)[number];
}) {
	const hasChildren = item.children && item.children.length > 0;
	const [isExpanded, setIsExpanded] = useState(depth === 0 && item.id !== "internals-group");
	const isSelected = selectedId === item.id;

	// Auto-expand when selectedId is a descendant (e.g. from search)
	useEffect(() => {
		if (hasChildren && !isExpanded && containsId(item, selectedId)) {
			setIsExpanded(true);
		}
	}, [selectedId]);

	const handleClick = () => {
		if (hasChildren) {
			setIsExpanded(!isExpanded);
		} else {
			onSelect(item.id);
		}
	};

	const handleArrowClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsExpanded(!isExpanded);
	};

	const isGroupHeader = depth === 0;
	const isSubgroup = depth >= 1 && hasChildren;
	const isInfoLabel = item.id === "kernel-info" || item.id.startsWith("layer-");
	const isTypeish = item.variant === "typeish";

	return (
		<div>
			<div
				role='button'
				tabIndex={0}
				data-sidebar-id={item.id}
				onClick={handleClick}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						handleClick();
					}
				}}
				className={cn(
					"w-full flex items-center justify-between text-sm rounded-md transition-all cursor-pointer select-none",
					// Group header (depth 0)
					isGroupHeader &&
						cn(
							"sticky top-0 z-10 backdrop-blur-sm font-semibold py-2 px-3 mt-3 first:mt-0",
							"border-l-[3px]",
							accent.border,
							accent.bg,
							accent.text,
						),
					// Subgroup (depth 1 with children)
					isSubgroup && !isTypeish && "py-1.5 px-2 font-medium text-foreground/80 hover:text-foreground",
					// Typeish subgroup — Interfaces (slightly bolder)
					isSubgroup &&
						isTypeish &&
						item.id === "interfaces-sub" &&
						"py-1.5 px-2 font-medium italic text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-200",
					// Typeish subgroup — Hooks (lighter)
					isSubgroup &&
						isTypeish &&
						item.id !== "interfaces-sub" &&
						"py-1.5 px-2 font-medium italic text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
					// Info label (subtle but clickable)
					isInfoLabel && cn("py-1.5 px-2", isSelected ? "bg-muted/40" : "hover:bg-muted/30"),
					// Leaf item
					!isGroupHeader &&
						!isSubgroup &&
						!isInfoLabel &&
						cn(
							"py-1 px-2",
							isSelected
								? cn("font-medium", accent.text)
								: "text-foreground/55 hover:text-foreground/85 hover:bg-muted/60",
						),
				)}
				style={{ paddingLeft: isGroupHeader ? undefined : `${depth * 12 + 8}px` }}
			>
				<div className='flex items-center gap-1.5 flex-1 min-w-0'>
					{hasChildren ? (
						<span
							role='button'
							tabIndex={0}
							onClick={handleArrowClick}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleArrowClick(e as unknown as React.MouseEvent);
								}
							}}
							className='flex-shrink-0 hover:bg-black/5 dark:hover:bg-white/5 rounded p-0.5'
						>
							<ChevronRight
								className={cn(
									"h-3 w-3 transition-transform",
									isExpanded && "rotate-90",
									isGroupHeader ? accent.text : "text-foreground/40",
								)}
							/>
						</span>
					) : (
						<span
							className={cn(
								"w-1.5 h-1.5 rounded-full flex-shrink-0 ml-0.5 mr-1",
								isSelected ? accent.dot : "bg-foreground/15",
							)}
						/>
					)}
					<span className='truncate text-left'>
						{isInfoLabel ? (
							<span className='text-xs italic text-muted-foreground/50'>{item.title}</span>
						) : item.id === "kernel-group" ? (
							<>
								$<span className='text-[11px] ml-0.5 font-normal opacity-50'> (Kernel)</span>
							</>
						) : (
							item.title
						)}
					</span>
					{item.id === "interfaces-sub" && (
						<span className='ml-1 text-[9px] font-mono font-medium not-italic px-1 py-px rounded bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'>
							extends
						</span>
					)}
					{item.id === "hooks-sub" && (
						<span className='ml-1 text-[9px] font-mono font-medium not-italic px-1 py-px rounded bg-slate-200/80 dark:bg-slate-700 text-slate-500 dark:text-slate-400'>
							implements
						</span>
					)}
				</div>
				{!isInfoLabel && (
					<span
						className={cn(
							"ml-1.5 text-[10px] tabular-nums flex-shrink-0",
							isGroupHeader ? accent.text : "text-foreground/30",
						)}
					>
						{item.count}
					</span>
				)}
			</div>

			{hasChildren && isExpanded && (
				<div className={cn(isGroupHeader && "mb-1")}>
					{item.children!.map((child) => (
						<SidebarItemComponent
							key={child.id}
							item={child}
							selectedId={selectedId}
							onSelect={onSelect}
							depth={depth + 1}
							accent={accent}
						/>
					))}
				</div>
			)}
		</div>
	);
}

export default function ApiSidebar({ items, selectedId, onSelect }: ApiSidebarProps) {
	let accentIdx = 0;
	return (
		<nav>
			<div className='p-2 pb-24'>
				{items.map((item) => {
					if (item.type === "separator") {
						return <hr key={item.id} className='my-3 border-t border-border/50' />;
					}
					const accent = groupAccents[accentIdx % groupAccents.length];
					accentIdx++;
					return (
						<SidebarItemComponent
							key={item.id}
							item={item}
							selectedId={selectedId}
							onSelect={onSelect}
							accent={accent}
						/>
					);
				})}
			</div>
		</nav>
	);
}
