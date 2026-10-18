"use client";

import * as React from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Menu, Ellipsis, Layers, LifeBuoy, ArrowRightLeft, SlidersHorizontal, Braces } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavA } from "@/components/nav/navA";
import { NavDropdown, type NavDropdownLink } from "@/components/nav/navDropdown";
import { useTranslations, useLocale } from "next-intl";
import { getDir } from "@/i18n/lang";
import { useOverflowNav } from "@/hooks/useOverflowNav";

const navLinkClass =
	"relative block rounded-sm px-1.5 xl:px-3 py-2 text-xs xl:text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50";

type NavGroup = { id: string; label: string; links: NavDropdownLink[] };
type NavItem = { label: string; href: string } | NavGroup;

const isGroup = (it: NavItem): it is NavGroup => "links" in it;

function getLastPathSegment(url: string) {
	const clean = url.split("?")[0].split("#")[0];
	const parts = clean.replace(/\/+$/, "").split("/");
	return parts.pop() || "";
}

export function SiteNav() {
	const t = useTranslations("Main.Menus");
	const t_groups = useTranslations("Main.MenuGroups");
	const t_short = useTranslations("Main.MenuShort");
	const t_desc = useTranslations("Main.MenuDesc");
	const locale = useLocale();
	const dir = getDir(locale);
	const items: NavItem[] = [
		{ label: t("getting-started"), href: "/getting-started" },
		{ label: t("feature-demo"), href: "/feature-demo" },
		{ label: t("playground"), href: "/playground" },
		{ label: t_short("plugin-guide"), href: "/plugin-guide" },
		{
			id: "guides",
			label: t_groups("guides"),
			links: [
				{ label: t("troubleshooting"), href: "/troubleshooting", desc: t_desc("troubleshooting"), icon: LifeBuoy },
				{ label: t("deep-dive"), href: "/deep-dive", desc: t_desc("deep-dive"), icon: Layers },
				{ label: t("migration"), href: "/migration", desc: t_desc("migration"), icon: ArrowRightLeft },
			],
		},
		{
			id: "reference",
			label: t_groups("reference"),
			links: [
				{ label: t("options"), href: "/options", desc: t_desc("options"), icon: SlidersHorizontal },
				{ label: t("docs-api"), href: "/docs-api", desc: t_desc("docs-api"), icon: Braces },
			],
		},
	];

	const pathname = usePathname();

	const [mounted, setMounted] = React.useState(false);
	React.useEffect(() => setMounted(true), []);

	const isActive = (href: string) => {
		if (!mounted || !pathname) return false;
		if (href === "/") return pathname === "/";

		const segment = getLastPathSegment(href);
		if (!segment) return false;
		return pathname.includes(`/${segment}`);
	};

	// 모바일 드롭다운 상태
	const [openMobile, setOpenMobile] = React.useState(false);
	// 그룹 드롭다운 (한 번에 하나만 열림)
	const [openGroup, setOpenGroup] = React.useState<string | null>(null);

	// 라우트 바뀌면 자동으로 닫기
	React.useEffect(() => {
		setOpenMobile(false);
		setOpenGroup(null);
	}, [pathname]);

	// Priority+ overflow
	const { containerRef, moreRef, setItemRef, visibleCount } = useOverflowNav(items.length, locale);
	const overflowItems = items.slice(visibleCount);
	const hasOverflow = overflowItems.length > 0;

	// More 드롭다운 상태
	const [openMore, setOpenMore] = React.useState(false);
	const moreButtonRef = React.useRef<HTMLButtonElement>(null);

	// 바깥 클릭 시 닫기
	React.useEffect(() => {
		if (!openMore) return;
		function handleClick(e: MouseEvent) {
			if (moreButtonRef.current?.contains(e.target as Node)) return;
			setOpenMore(false);
		}
		document.addEventListener("click", handleClick);
		return () => document.removeEventListener("click", handleClick);
	}, [openMore]);

	// 라우트 변경 시 More 닫기
	React.useEffect(() => {
		setOpenMore(false);
	}, [pathname]);

	return (
		<>
			<header className='fixed md:sticky top-0 inset-x-0 z-50 w-full border-b backdrop-blur-md bg-amber-50/50 dark:bg-zinc-900/60'>
				<div className='mx-auto flex h-14 items-center justify-center px-4 max-w-screen-2xl'>
					{/* Desktop nav */}
					<div className='hidden items-center gap-1 md:flex flex-1 min-w-0 max-w-fit mx-auto'>
						<Link href='/' className='flex items-center shrink-0 mx-2 lg:mx-6' aria-label='Home'>
							{/* md~lg: 아이콘만 */}
							<Image src='/se3_logo.svg' alt='SunEditor Logo' width={36} height={36} priority className='lg:hidden' />
							{/* lg+: 풀 로고 */}
							<Image
								src='/se3_logo_title_flat.svg'
								alt='SunEditor Logo'
								width={148 * 1.12}
								height={44 * 1.12}
								priority
								className='hidden lg:block'
							/>
						</Link>
						<nav
							ref={containerRef}
							className='mx-2 lg:mx-6 min-w-0 flex-1 flex items-center gap-1 xl:gap-4 flex-nowrap'
							dir={dir}
						>
							{items.map((it, i) => (
								<div
									key={isGroup(it) ? it.id : it.href}
									ref={setItemRef(i)}
									className={cn(i >= visibleCount && "invisible absolute")}
									aria-hidden={i >= visibleCount || undefined}
								>
									{isGroup(it) ? (
										<NavDropdown
											label={it.label}
											links={it.links}
											open={openGroup === it.id}
											onOpenChange={(open) => setOpenGroup((cur) => (open ? it.id : cur === it.id ? null : cur))}
											isActive={isActive}
											dir={dir}
										/>
									) : (
										<NavA href={it.href} active={isActive(it.href)}>
											{it.label}
										</NavA>
									)}
								</div>
							))}

							{/* More 버튼 */}
							<div ref={moreRef} className={cn("relative", !hasOverflow && "hidden")}>
								<button
									ref={moreButtonRef}
									onClick={() => setOpenMore((v) => !v)}
									className={cn(navLinkClass, "text-muted-foreground hover:text-foreground")}
									aria-expanded={openMore}
									aria-label='More pages'
								>
									<Ellipsis className='size-4' />
								</button>

								{openMore && (
									<div
										className={cn(
											"absolute top-full z-50 mt-1.5 min-w-40 rounded-md border bg-popover p-1 shadow-md",
											dir === "rtl" ? "left-0" : "right-0",
										)}
									>
										{overflowItems.map((it) =>
											isGroup(it) ? (
												<div key={it.id} className='mt-1 border-t pt-1 first:mt-0 first:border-t-0 first:pt-0'>
													<div className='px-3 pb-0.5 pt-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground'>
														{it.label}
													</div>
													{it.links.map((l) => (
														<NavA
															key={l.href}
															href={l.href}
															active={isActive(l.href)}
															underlineOrigin='left'
															className='py-2'
														>
															{l.label}
														</NavA>
													))}
												</div>
											) : (
												<NavA
													key={it.href}
													href={it.href}
													active={isActive(it.href)}
													underlineOrigin='left'
													className='py-2'
												>
													{it.label}
												</NavA>
											),
										)}
									</div>
								)}
							</div>
						</nav>
					</div>

					{/* Mobile nav */}
					<div className='md:hidden w-full flex justify-between items-center'>
						<Link href='/' className='flex gap-3 shrink-0' aria-label='Home'>
							<Image
								src='/se3_logo_title.svg'
								alt='SunEditor Logo'
								width={148 * 1.12}
								height={44 * 1.12}
								priority
								className='dark:hidden'
							/>
							<Image
								src='/se3_logo_title_flat.svg'
								alt='SunEditor Logo'
								width={148 * 1.12}
								height={44 * 1.12}
								priority
								className='hidden dark:block'
							/>
						</Link>

						<Button
							variant='outline'
							size='icon'
							aria-label='Toggle menu'
							aria-expanded={openMobile}
							aria-controls='mobile-nav'
							onClick={() => setOpenMobile((v) => !v)}
						>
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
						{items.map((it) =>
							isGroup(it) ? (
								<div key={it.id} className='mt-2 border-t pt-2'>
									<div className='px-3 pt-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
										{it.label}
									</div>
									{it.links.map((l) => (
										<NavA key={l.href} href={l.href} active={isActive(l.href)} className='py-3'>
											{l.label}
										</NavA>
									))}
								</div>
							) : (
								<NavA key={it.href} href={it.href} active={isActive(it.href)} className='py-3'>
									{it.label}
								</NavA>
							),
						)}
					</nav>
				</div>
			</header>

			<div className='h-14 md:hidden' />
		</>
	);
}
