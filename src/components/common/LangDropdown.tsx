"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { getDir } from "@/i18n/lang";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FlagIcon from "./FlagIcon";

export type LangOption = {
	value: string;
	/** locale code for flag icon (e.g. "ko", "en") */
	locale: string;
	label: string;
};

type Props = {
	value: string;
	options: LangOption[];
	onChange: (value: string) => void;
	/** Custom trigger content; if omitted, renders default button */
	trigger?: React.ReactNode;
	align?: "start" | "center" | "end";
	className?: string;
	disabled?: boolean;
};

export default function LangDropdown({ value, options, onChange, trigger, align = "start", className, disabled }: Props) {
	const [open, setOpen] = useState(false);
	const current = options.find((o) => o.value === value);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild disabled={disabled}>
				{trigger ?? (
					<button
						className={`flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer ${className ?? ""}`}
					>
						{current && <FlagIcon locale={current.locale} className='text-sm' />}
						<span className='truncate'>{current?.label ?? value}</span>
						<ChevronDown className='h-3 w-3 opacity-50 shrink-0' />
					</button>
				)}
			</PopoverTrigger>
			<PopoverContent className='w-56 p-1 max-h-72 overflow-y-auto' align={align}>
				{options.map((opt) => {
					const isRtl = getDir(opt.locale) === "rtl";
					const selected = opt.value === value;
					return (
						<button
							key={opt.value}
							onClick={() => { onChange(opt.value); setOpen(false); }}
							className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer
								${selected ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
						>
							<FlagIcon locale={opt.locale} className='text-base shrink-0' />
							<span className='flex-1 text-start truncate'>{opt.label}</span>
							{isRtl && (
								<span className='shrink-0 text-[9px] font-medium px-1 py-0.5 rounded bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400'>
									RTL
								</span>
							)}
							{selected && <Check className='h-3.5 w-3.5 shrink-0 text-primary' />}
						</button>
					);
				})}
			</PopoverContent>
		</Popover>
	);
}
