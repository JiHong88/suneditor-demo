"use client";

import { useState } from "react";
import { X } from "lucide-react";
import type { MoreButtonConfig, BuilderAction } from "./builderTypes";

interface BuilderMoreButtonDialogProps {
	groupId: string;
	config: MoreButtonConfig;
	dispatch: React.Dispatch<BuilderAction>;
	breakpointId?: string;
	onClose: () => void;
}

export default function BuilderMoreButtonDialog({ groupId, config, dispatch, breakpointId, onClose }: BuilderMoreButtonDialogProps) {
	const [label, setLabel] = useState(config.label);
	const [icon, setIcon] = useState(config.icon);
	const [className, setClassName] = useState(config.className);

	const handleApply = () => {
		dispatch({
			type: "SET_MORE_BUTTON",
			groupId,
			config: { label, icon, className },
			breakpointId,
		});
		onClose();
	};

	const handleRemove = () => {
		dispatch({ type: "SET_MORE_BUTTON", groupId, config: undefined, breakpointId });
		onClose();
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/30' onClick={onClose}>
			<div className='bg-card border rounded-lg shadow-xl w-72 p-4' onClick={(e) => e.stopPropagation()}>
				<div className='flex items-center justify-between mb-3'>
					<h4 className='text-sm font-semibold'>:MoreButton Config</h4>
					<button type='button' onClick={onClose} className='p-0.5 rounded hover:bg-muted transition-colors cursor-pointer'>
						<X className='h-4 w-4' />
					</button>
				</div>

				<div className='space-y-2'>
					<div>
						<label className='text-[10px] font-medium text-muted-foreground uppercase'>Label</label>
						<input
							type='text'
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							className='w-full mt-0.5 px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30'
							placeholder='More'
						/>
					</div>
					<div>
						<label className='text-[10px] font-medium text-muted-foreground uppercase'>Icon</label>
						<input
							type='text'
							value={icon}
							onChange={(e) => setIcon(e.target.value)}
							className='w-full mt-0.5 px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30'
							placeholder='default'
						/>
					</div>
					<div>
						<label className='text-[10px] font-medium text-muted-foreground uppercase'>Class Name</label>
						<input
							type='text'
							value={className}
							onChange={(e) => setClassName(e.target.value)}
							className='w-full mt-0.5 px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/30'
							placeholder='more_custom'
						/>
					</div>
				</div>

				<div className='flex items-center gap-2 mt-4'>
					<button
						type='button'
						onClick={handleRemove}
						className='px-2 py-1 text-[11px] rounded border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors cursor-pointer'
					>
						Remove
					</button>
					<div className='flex-1' />
					<button
						type='button'
						onClick={onClose}
						className='px-2 py-1 text-[11px] rounded border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer'
					>
						Cancel
					</button>
					<button
						type='button'
						onClick={handleApply}
						className='px-3 py-1 text-[11px] rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer'
					>
						Apply
					</button>
				</div>

				{/* Preview */}
				<div className='mt-3 pt-3 border-t'>
					<p className='text-[9px] text-muted-foreground/60 uppercase tracking-wider mb-1'>Output format</p>
					<code className='text-[10px] text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/40 px-2 py-1 rounded block'>
						:{label}-{icon}.{className}
					</code>
				</div>
			</div>
		</div>
	);
}
