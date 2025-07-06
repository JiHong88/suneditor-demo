"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";
import "./globals.css";

const navigationItems = [
	{ name: "Getting Started", path: "/getting-started" },
	{ name: "Feature Demo", path: "/feature-demo" },
	{ name: "Playground", path: "/playground" },
	{ name: "Plugin Guide", path: "/plugin-guide" },
	{ name: "Docs/API", path: "/docs" },
];

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	return (
		<html>
			<body
				style={{
					fontFamily:
						'"Helvetica Neue", Helvetica, Arial, sans-serif',
				}}
			>
				<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
					{/* Header */}
					<header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-sm">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between items-center h-16">
								{/* Logo */}
								<Link
									href="/"
									className="flex items-center space-x-3 shrink-0"
								>
									<Image
										src="/se3_logo_title_flat.svg"
										alt="SunEditor Logo"
										width={164 * 1.05}
										height={44 * 1.05}
										priority
									/>
								</Link>

								{/* Navigation */}
								<nav className="hidden lg:flex flex-auto mx-9 space-x-1">
									{navigationItems.map((item) => {
										const isActive = pathname === item.path;
										return (
											<Link
												key={item.path}
												href={item.path}
												className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
													isActive
														? "text-se-active"
														: "text-slate-600 hover:text-se"
												}`}
											>
												<span className="whitespace-nowrap">
													{item.name}
												</span>
											</Link>
										);
									})}
								</nav>

								<div className="w-28 text-right">
									<a
										href="https://github.com/JiHong88/SunEditor"
										target="_blank"
										rel="noopener noreferrer"
									>
										<Button variant="ghost" size="icon">
											<Github className="w-5 h-5 text-slate-600" />
										</Button>
									</a>
								</div>
							</div>

							{/* Mobile Navigation */}
							<div className="lg:hidden pb-4 w-full">
								<NavigationMenu>
									<NavigationMenuList className="flex flex-col space-y-1">
										{navigationItems.map((item) => {
											const isActive =
												pathname === item.path;
											return (
												<NavigationMenuItem
													key={item.path}
												>
													<NavigationMenuLink
														asChild
														className={`flex items-start space-x-2 px-3 py-4 text-sm font-semibold transition-all duration-200 ${
															isActive
																? "text-se-active"
																: "text-slate-600 hover:text-se"
														}`}
													>
														<Link
															href={item.path}
															className="justify-start"
														>
															<span>
																{item.name}
															</span>
														</Link>
													</NavigationMenuLink>
												</NavigationMenuItem>
											);
										})}
									</NavigationMenuList>
								</NavigationMenu>
							</div>
						</div>
					</header>

					{/* Main Content */}
					<main className="flex-1 relative">{children}</main>

					{/* Footer */}
					<footer className="bg-slate-900 text-white">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
							<div className="grid md:grid-cols-3 gap-8">
								<div>
									<div className="flex items-center space-x-3 mb-4">
										<div className="w-8 h-8 rounded-lg flex items-center justify-center">
											<Image
												src="/se3_logo.svg"
												alt="SunEditor Logo"
												width={44}
												height={44}
												priority
											/>
										</div>
										<h3 className="text-lg font-semibold">
											SunEditor
										</h3>
									</div>
									<p className="text-slate-300 text-sm leading-relaxed">
										A lightweight and flexible WYSIWYG web
										editor that supports various text
										formatting and multimedia insertion.
									</p>
								</div>

								<div>
									<h4 className="font-semibold mb-3">
										Developer
									</h4>
									<a
										href="https://github.com/JiHong88/SunEditor"
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center space-x-2 text-slate-300 hover:text-white text-sm transition-colors"
									>
										<Github className="w-4 h-4" />
										<span>GitHub Repository</span>
									</a>
								</div>
							</div>

							<div className="border-t border-slate-700 mt-8 pt-6 text-center">
								<p className="text-slate-400 text-sm">
									© 2025 SunEditor. All rights reserved.
								</p>
							</div>
						</div>
					</footer>
				</div>
			</body>
		</html>
	);
}
