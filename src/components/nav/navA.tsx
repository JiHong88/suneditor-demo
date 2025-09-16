"use client";
import Link from "next/link";
import { navLink } from "./nav-cva";
import { cn } from "@/lib/utils";
import { Underline } from "./nav-underline";

type Props = {
	href: string;
	children: React.ReactNode;
	active?: boolean;
	underline?: boolean;
	underlineOrigin?: "left" | "center";
	className?: string;
	external?: boolean;
};

export function NavA({ href, children, active, underline = true, underlineOrigin = "center", className, external }: Props) {
	const Cmp: any = external ? "a" : Link;
	return (
		<Cmp href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={cn(navLink({ active }), className)}>
			<span className='relative'>
				{children}
				{underline && <Underline active={active} origin={underlineOrigin} className='group-hover/navlink:scale-x-100 group-focus-visible/navlink:scale-x-100' />}
			</span>
		</Cmp>
	);
}
