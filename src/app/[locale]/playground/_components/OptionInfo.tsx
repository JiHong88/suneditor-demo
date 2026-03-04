"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { highlightInline } from "@/lib/highlightInline";

type Props = {
	optionKey: string;
	description: string;
};

export function OptionInfo({ optionKey, description }: Props) {
	const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);
	const [dialog, setDialog] = useState(false);
	const ref = useRef<HTMLSpanElement>(null);

	const showTooltip = useCallback(() => {
		if (!ref.current) return;
		const r = ref.current.getBoundingClientRect();
		setTooltip({ x: r.left + r.width / 2, y: r.top });
	}, []);

	const hideTooltip = useCallback(() => setTooltip(null), []);

	const openDialog = useCallback(() => {
		setTooltip(null);
		setDialog(true);
	}, []);

	const contentSize = useMemo(() => {
		const lines = description.split("\n").length;
		const len = description.length;
		if (lines >= 6 || len > 400) return "xl";
		if (lines >= 4 || len > 200) return "lg";
		if (lines >= 2 || len > 100) return "md";
		return "sm";
	}, [description]);

	const tooltipMaxW = { xl: "max-w-md", lg: "max-w-sm", md: "max-w-80", sm: "max-w-64" }[contentSize];
	const dialogMaxW = { xl: "max-w-xl", lg: "max-w-lg", md: "max-w-md", sm: "max-w-sm" }[contentSize];

	// close dialog on Escape
	useEffect(() => {
		if (!dialog) return;
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") setDialog(false);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [dialog]);

	return (
		<>
			{/* span instead of button – prevents <label> from forwarding clicks */}
			<span
				ref={ref}
				role='button'
				tabIndex={0}
				onMouseEnter={showTooltip}
				onMouseLeave={hideTooltip}
				onClick={(e) => { e.preventDefault(); openDialog(); }}
				onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openDialog(); }}
				className='flex h-3.5 w-3.5 shrink-0 cursor-pointer items-center justify-center rounded-full bg-blue-500/20 text-[9px] font-bold leading-none text-blue-600 transition-colors hover:bg-blue-500/30 hover:text-blue-700 dark:bg-amber-300/20 dark:text-amber-300 dark:hover:bg-amber-300/30 dark:hover:text-amber-200'
			>
				?
			</span>

			{/* Hover tooltip – portal to body to avoid clipping */}
			{tooltip &&
				createPortal(
					<div
						style={{ position: "fixed", left: tooltip.x, top: tooltip.y }}
						className='pointer-events-none z-[200] -translate-x-1/2 -translate-y-full pb-1.5'
					>
						<div className={`${tooltipMaxW} rounded-md bg-popover px-2.5 py-1.5 text-[11px] leading-relaxed text-popover-foreground shadow-lg ring-1 ring-border`}>
							{highlightInline(description)}
						</div>
					</div>,
					document.body,
				)}

			{/* Click dialog – portal to body */}
			{dialog &&
				createPortal(
					<div className='fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-[2px]' onClick={() => setDialog(false)}>
						<div
							className={`mx-4 w-full ${dialogMaxW} rounded-lg bg-popover p-4 shadow-xl ring-1 ring-border dark:shadow-[0_0_40px_rgba(255,240,170,0.1)] dark:ring-amber-300/25`}
							onClick={(e) => e.stopPropagation()}
						>
							<div className='mb-2 flex items-center justify-between'>
								<h3 className='text-sm font-semibold font-mono text-blue-600 dark:text-amber-200'>{optionKey}</h3>
								<button
									type='button'
									onClick={() => setDialog(false)}
									className='flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground'
								>
									<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor' className='h-4 w-4'>
										<path d='M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z' />
									</svg>
								</button>
							</div>
							<p className='text-xs leading-relaxed text-muted-foreground'>{highlightInline(description)}</p>
						</div>
					</div>,
					document.body,
				)}
		</>
	);
}
