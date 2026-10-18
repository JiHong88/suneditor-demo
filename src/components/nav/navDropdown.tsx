"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { navLink } from "./nav-cva";
import { Underline } from "./nav-underline";

export type NavDropdownLink = { label: string; href: string; desc?: string; icon?: LucideIcon };

type Props = {
	label: string;
	links: NavDropdownLink[];
	open: boolean;
	onOpenChange: (open: boolean) => void;
	isActive: (href: string) => boolean;
	dir?: "ltr" | "rtl";
};

/** 마우스를 떼고 닫힐 때까지의 여유 — 버튼에서 패널로 대각선으로 이동해도 닫히지 않게 */
const CLOSE_DELAY = 150;

/**
 * 상단 메뉴 그룹 드롭다운.
 * - 마우스: 호버로 열고 닫힘
 * - 터치·키보드: 버튼 클릭으로 토글
 * - 바깥 클릭·Esc·포커스 이탈 시 닫힘
 */
export function NavDropdown({ label, links, open, onOpenChange, isActive, dir }: Props) {
	const rootRef = React.useRef<HTMLDivElement>(null);
	const buttonRef = React.useRef<HTMLButtonElement>(null);
	const panelId = React.useId();
	const active = links.some((l) => isActive(l.href));
	const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
	const lastPointer = React.useRef("");

	const cancelClose = () => clearTimeout(closeTimer.current);
	React.useEffect(() => cancelClose, []);

	const onPointerEnter = (e: React.PointerEvent) => {
		if (e.pointerType !== "mouse") return;
		cancelClose();
		onOpenChange(true);
	};
	const onPointerLeave = (e: React.PointerEvent) => {
		if (e.pointerType !== "mouse") return;
		cancelClose();
		closeTimer.current = setTimeout(() => onOpenChange(false), CLOSE_DELAY);
	};

	React.useEffect(() => {
		if (!open) return;
		const onClick = (e: MouseEvent) => {
			if (!rootRef.current?.contains(e.target as Node)) onOpenChange(false);
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key !== "Escape") return;
			onOpenChange(false);
			buttonRef.current?.focus();
		};
		document.addEventListener("click", onClick);
		document.addEventListener("keydown", onKey);
		return () => {
			document.removeEventListener("click", onClick);
			document.removeEventListener("keydown", onKey);
		};
	}, [open, onOpenChange]);

	return (
		<div
			ref={rootRef}
			className='relative'
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			onBlur={(e) => {
				if (open && !rootRef.current?.contains(e.relatedTarget as Node)) onOpenChange(false);
			}}
		>
			<button
				ref={buttonRef}
				type='button'
				onPointerDown={(e) => (lastPointer.current = e.pointerType)}
				// 마우스 클릭은 이미 호버로 열린 상태 → 닫지 않고 유지. 키보드(detail 0)·터치는 토글
				onClick={(e) => onOpenChange(lastPointer.current === "mouse" && e.detail > 0 ? true : !open)}
				aria-expanded={open}
				aria-controls={panelId}
				className={cn(navLink({ active: active || open }), "flex items-center gap-1")}
			>
				<span className='relative'>
					{label}
					<Underline active={active} className='group-hover/navlink:scale-x-100 group-focus-visible/navlink:scale-x-100' />
				</span>
				<ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} aria-hidden />
			</button>

			{open && (
				// pt-1.5: 버튼과 패널 사이 틈도 호버 영역에 포함
				<div dir={dir} className='absolute start-0 top-full z-50 pt-1.5'>
					<div
						id={panelId}
						className='w-80 rounded-lg border bg-popover p-1.5 shadow-md animate-in fade-in slide-in-from-top-1 duration-150'
					>
						{links.map(({ href, label: linkLabel, desc, icon: Icon }) => {
							const current = isActive(href);
							return (
								<Link
									key={href}
									href={href}
									onClick={() => onOpenChange(false)}
									aria-current={current ? "page" : undefined}
									className={cn(
										"flex items-start gap-3 rounded-md px-3 py-2.5 outline-none transition-colors hover:bg-accent focus-visible:bg-accent",
										current && "bg-accent/60",
									)}
								>
									{Icon && <Icon className='mt-0.5 size-4 shrink-0 text-muted-foreground' aria-hidden />}
									<span className='min-w-0'>
										<span className='block text-sm font-medium'>{linkLabel}</span>
										{desc && <span className='mt-0.5 block text-xs leading-snug text-muted-foreground'>{desc}</span>}
									</span>
								</Link>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}
