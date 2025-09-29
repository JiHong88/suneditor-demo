"use client";

import * as React from "react";
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavA } from "@/components/nav/navA";
import { useTranslations } from "next-intl";

function NavigationMenu({ className, children, viewport = true, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & { viewport?: boolean }) {
	return (
		<NavigationMenuPrimitive.Root
			data-slot='navigation-menu'
			data-viewport={viewport}
			className={cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", className)}
			{...props}
		>
			{children}
			{viewport && <NavigationMenuViewport />}
		</NavigationMenuPrimitive.Root>
	);
}

function NavigationMenuList({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
	return <NavigationMenuPrimitive.List data-slot='navigation-menu-list' className={cn("group flex flex-1 list-none items-center justify-center gap-4", className)} {...props} />;
}

function NavigationMenuItem({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
	return <NavigationMenuPrimitive.Item data-slot='navigation-menu-item' className={cn("relative group", className)} {...props} />;
}

function NavigationMenuViewport({ className, ...props }: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
	return (
		<div className={cn("absolute top-full left-0 isolate z-50 flex justify-center")}>
			<NavigationMenuPrimitive.Viewport
				data-slot='navigation-menu-viewport'
				className={cn(
					"origin-top-center bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border shadow md:w-[var(--radix-navigation-menu-viewport-width)]",
					className,
				)}
				{...props}
			/>
		</div>
	);
}

export function SiteNav() {
	const t = useTranslations("Main.Menus");
	const items = [
		{ label: t("getting-started"), href: "/getting-started" },
		{ label: t("feature-demo"), href: "/feature-demo" },
		{ label: t("playground"), href: "/playground" },
		{ label: t("plugin-guide"), href: "/plugin-guide" },
		{ label: t("deep-dive"), href: "/deep-dive" },
		{ label: t("docs-api"), href: "/docs-api" },
	];

	const pathname = usePathname();

	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	const isActive = (href: string) => {
		if (!mounted || !pathname) return false;
		if (href === "/") return pathname === "/";
		console.log("isActive", pathname, href);
		return pathname === href || pathname.startsWith(href + "/");
	};

	// 모바일 드롭다운 상태
	const [openMobile, setOpenMobile] = React.useState(false);

	// 라우트 바뀌면 자동으로 닫기
	React.useEffect(() => {
		setOpenMobile(false);
	}, [pathname]);

	return (
		<>
			<header className='fixed md:sticky top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
				<div className='container mx-auto flex h-14 items-center justify-center px-4'>
					{/* Desktop nav */}
					<div className='hidden items-center gap-1 md:flex'>
						<Link href='/' className='flex items-center space-x-3 shrink-0 mx-6' aria-label='Home'>
							<Image src='/se3_logo_title_flat.svg' alt='SunEditor Logo' width={148 * 1.12} height={44 * 1.12} priority />
						</Link>
						<NavigationMenu className='mx-6'>
							<NavigationMenuList>
								{items.map((it) => (
									<NavigationMenuItem key={it.label} className='group'>
										<NavigationMenuPrimitive.Link asChild>
											<NavA href={it.href} active={isActive(it.href)}>
												{it.label}
											</NavA>
										</NavigationMenuPrimitive.Link>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					{/* Mobile nav */}
					<div className='md:hidden w-full flex justify-between items-center'>
						<Link href='/' className='flex space-x-3 shrink-0' aria-label='Home'>
							<Image src='/se3_logo_title_flat.svg' alt='SunEditor Logo' width={148 * 1.12} height={44 * 1.12} priority />
						</Link>

						<Button variant='outline' size='icon' aria-label='Toggle menu' aria-expanded={openMobile} aria-controls='mobile-nav' onClick={() => setOpenMobile((v) => !v)}>
							<Menu className='size-4' />
						</Button>
					</div>
				</div>

				<div
					id='mobile-nav'
					className={cn(
						"md:hidden overflow-hidden border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70",
						"transition-[max-height,opacity] duration-300 ease-out will-change-[max-height]",
						openMobile ? "max-h-[calc(100dvh-56px)] opacity-100" : "max-h-0 opacity-0",
					)}
				>
					<nav className='px-4 py-2'>
						{items.map((it) => (
							<NavA key={it.label} href={it.href} active={isActive(it.href)} className='py-3'>
								{it.label}
							</NavA>
						))}
					</nav>
				</div>
			</header>

			<div className='h-14 md:hidden' />
		</>
	);
}
