"use client";

import { useState } from "react";
import { Plus, X, Copy, Monitor, Tablet, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BreakpointConfig, BuilderAction } from "./builderTypes";

interface BuilderBreakpointTabsProps {
	breakpoints: BreakpointConfig[];
	activeBreakpointId: string | undefined;
	onSelect: (id: string | undefined) => void;
	dispatch: React.Dispatch<BuilderAction>;
}

function getBreakpointIcon(width: number) {
	if (width >= 768) return <Tablet className='h-3 w-3' />;
	if (width >= 480) return <Smartphone className='h-3 w-3' />;
	return <Smartphone className='h-2.5 w-2.5' />;
}

export default function BuilderBreakpointTabs({ breakpoints, activeBreakpointId, onSelect, dispatch }: BuilderBreakpointTabsProps) {
	const t = useTranslations("Playground.builder.breakpoint");
	const [showAddInput, setShowAddInput] = useState(false);
	const [newWidth, setNewWidth] = useState("768");

	const handleAdd = () => {
		const width = parseInt(newWidth, 10);
		if (isNaN(width) || width <= 0) return;
		if (breakpoints.some((bp) => bp.width === width)) return;
		dispatch({ type: "ADD_BREAKPOINT", width });
		setShowAddInput(false);
		setNewWidth("768");
	};

	return (
		<div className='flex items-center gap-1.5 flex-wrap'>
			{/* Default tab */}
			<button
				type='button'
				onClick={() => onSelect(undefined)}
				className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer
					${!activeBreakpointId ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
			>
				<Monitor className='h-3.5 w-3.5' />
				{t("default")}
			</button>

			{/* Breakpoint tabs */}
			{breakpoints
				.slice()
				.sort((a, b) => b.width - a.width)
				.map((bp) => (
					<div key={bp.id} className='group/bp relative inline-flex items-center'>
						<button
							type='button'
							onClick={() => onSelect(bp.id)}
							className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer
								${activeBreakpointId === bp.id ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
						>
							{getBreakpointIcon(bp.width)}
							≤{bp.width}px
						</button>

						{/* Actions on hover */}
						<div className='hidden group-hover/bp:flex items-center gap-0.5 ms-0.5'>
							<button
								type='button'
								onClick={() => dispatch({ type: "COPY_TO_BREAKPOINT", breakpointId: bp.id })}
								className='p-1 rounded hover:bg-muted text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer'
								title={t("copyFromDefault")}
							>
								<Copy className='h-3 w-3' />
							</button>
							<button
								type='button'
								onClick={() => {
									dispatch({ type: "REMOVE_BREAKPOINT", breakpointId: bp.id });
									if (activeBreakpointId === bp.id) onSelect(undefined);
								}}
								className='p-1 rounded hover:bg-destructive/10 text-muted-foreground/50 hover:text-destructive transition-colors cursor-pointer'
								title={t("remove")}
							>
								<X className='h-3 w-3' />
							</button>
						</div>
					</div>
				))}

			{/* Add breakpoint */}
			{showAddInput ? (
				<div className='inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-border bg-background'>
					<input
						type='number'
						value={newWidth}
						onChange={(e) => setNewWidth(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAdd()}
						className='w-16 px-1.5 py-0.5 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30'
						placeholder={t("widthPlaceholder")}
						autoFocus
					/>
					<span className='text-[10px] text-muted-foreground'>px</span>
					<button
						type='button'
						onClick={handleAdd}
						className='px-2 py-0.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer'
					>
						{t("add")}
					</button>
					<button
						type='button'
						onClick={() => setShowAddInput(false)}
						className='p-0.5 rounded text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer'
					>
						<X className='h-3.5 w-3.5' />
					</button>
				</div>
			) : (
				<button
					type='button'
					onClick={() => setShowAddInput(true)}
					className='inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted-foreground border border-dashed border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer'
				>
					<Plus className='h-3.5 w-3.5' />
					{t("addBreakpoint")}
				</button>
			)}
		</div>
	);
}
