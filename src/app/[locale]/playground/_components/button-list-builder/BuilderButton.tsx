"use client";

import { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";
import { BUTTON_MAP } from "./buttonCatalog";

interface BuilderButtonProps {
	id: string;
	buttonName: string;
	onRemove?: () => void;
	isDragOverlay?: boolean;
	suppressHover?: boolean;
}

export default function BuilderButton({ id, buttonName, onRemove, isDragOverlay, suppressHover }: BuilderButtonProps) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		data: { type: "canvas-button" as const, buttonName },
	});

	// Entry animation
	const [isNew, setIsNew] = useState(true);
	useEffect(() => {
		const t = setTimeout(() => setIsNew(false), 300);
		return () => clearTimeout(t);
	}, []);

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.3 : 1,
	};

	const isSeparator = buttonName === "|";
	const meta = BUTTON_MAP[buttonName];
	const label = meta?.label ?? buttonName;

	// Separator rendering
	if (isSeparator) {
		const hoverClasses = suppressHover
			? ""
			: "has-[.drag-zone:hover]:border-amber-500 has-[.drag-zone:hover]:bg-amber-50 dark:has-[.drag-zone:hover]:border-amber-500/70 dark:has-[.drag-zone:hover]:bg-amber-950/40 has-[.delete-zone:hover]:border-red-400 has-[.delete-zone:hover]:bg-red-50 has-[.delete-zone:hover]:text-inherit dark:has-[.delete-zone:hover]:border-red-500/60 dark:has-[.delete-zone:hover]:bg-red-950/30";

		return (
			<div
				ref={!isDragOverlay ? setNodeRef : undefined}
				style={!isDragOverlay ? style : undefined}
				className={`inline-flex items-center gap-0.5 rounded select-none transition-all text-amber-700 dark:text-amber-400
					${isDragOverlay ? "shadow-lg border border-amber-400 bg-amber-50 ring-2 ring-amber-400/20 dark:border-amber-500/60 dark:bg-amber-950/30 dark:ring-amber-500/20" : `border border-dashed border-amber-400/50 bg-amber-50/40 dark:border-amber-500/30 dark:bg-amber-950/20 ${hoverClasses}`}
					${isDragging ? "z-50 opacity-30" : ""}
					${isNew && !isDragOverlay ? "animate-[buttonPop_0.25s_ease-out]" : ""}`}
			>
				<div
					className={`drag-zone flex-1 flex items-center gap-0.5 px-1 py-0.5 rounded-s transition-colors ${suppressHover ? "cursor-default" : "cursor-grab hover:text-amber-800 dark:hover:text-amber-300"}`}
					{...attributes}
					{...listeners}
				>
					<GripVertical className='h-3 w-3 shrink-0' />
					<div className='w-px h-4 bg-current opacity-60 mx-0.5' />
				</div>
				{onRemove && (
					<button
						type='button'
						onClick={onRemove}
						className={`delete-zone p-0.5 rounded-e transition-colors ${suppressHover ? "" : "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 cursor-pointer"}`}
					>
						<X className='h-2.5 w-2.5' />
					</button>
				)}
			</div>
		);
	}

	const hoverClasses = suppressHover
		? ""
		: "has-[.drag-zone:hover]:border-blue-400 has-[.drag-zone:hover]:bg-blue-50 dark:has-[.drag-zone:hover]:border-blue-500/60 dark:has-[.drag-zone:hover]:bg-blue-950/30 has-[.delete-zone:hover]:border-red-400 has-[.delete-zone:hover]:bg-red-50 dark:has-[.delete-zone:hover]:border-red-500/60 dark:has-[.delete-zone:hover]:bg-red-950/30";

	return (
		<div
			ref={!isDragOverlay ? setNodeRef : undefined}
			style={!isDragOverlay ? style : undefined}
			className={`inline-flex items-center rounded text-[11px] font-medium border select-none transition-all
				${isDragOverlay ? "shadow-lg border-blue-400 bg-blue-50 text-blue-600 ring-2 ring-blue-400/20 dark:border-blue-500/60 dark:bg-blue-950/30 dark:text-blue-400 dark:ring-blue-500/20" : `border-border bg-muted/60 group-hover/grp:border-foreground/25 group-hover/grp:bg-muted dark:group-hover/grp:border-foreground/15 ${hoverClasses}`}
				${isDragging ? "z-50" : ""}
				${isNew && !isDragOverlay ? "animate-[buttonPop_0.25s_ease-out]" : ""}`}
		>
			<div
				className={`drag-zone flex-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-s transition-colors ${suppressHover ? "cursor-default" : "cursor-grab hover:text-blue-600 dark:hover:text-blue-400"}`}
				{...attributes}
				{...listeners}
			>
				<GripVertical className='h-3 w-3 shrink-0 opacity-60' />
				<span className='truncate max-w-[80px] relative group/tip'>
					{label}
					<span className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-foreground text-background opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50'>
						{label}
					</span>
				</span>
			</div>
			{onRemove && (
				<button
					type='button'
					onClick={onRemove}
					className={`delete-zone px-1 py-0.5 rounded-e transition-colors ${suppressHover ? "" : "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 cursor-pointer"}`}
				>
					<X className='h-2.5 w-2.5' />
				</button>
			)}
		</div>
	);
}
