"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
// shadcn/ui
import { Button } from "@/components/ui/button";

export default function Hero() {
	const t = useTranslations("Home.Hero");
	const t_menus = useTranslations("Main.Menus");

	return (
		<section className='relative overflow-hidden'>
			{/* Background Grid & Gradients */}
			<div className='absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:36px_36px]' />
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(circle_farthest-side_at_50%_0,hsl(var(--primary)/.15)_0%,transparent_60%)]' />
			{/* Colorful Glows */}
			<div className='absolute -top-1/4 -left-1/4 -z-20 h-96 w-96 animate-pulse rounded-full bg-orange-500/10 blur-3xl' />
			<div className='absolute -bottom-1/4 -right-1/4 -z-20 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl' style={{ animationDelay: "2s" }} />

			<div className='container mx-auto px-6 pt-12 pb-16'>
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mx-auto max-w-4xl text-center'>
					<h1 className='text-5xl font-bold tracking-tight md:text-7xl'>
						<span className='bg-gradient-to-r from-orange-400 via-rose-500 to-purple-600 bg-clip-text text-transparent'>SunEditor Demo</span>
					</h1>
					<p className='mx-auto mt-6 max-w-2xl text-base text-muted-foreground'>{t("title")}</p>
					<div className='mt-8 flex flex-wrap items-center justify-center gap-4'>
						<Button
							asChild
							size='lg'
							className='group bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl'
						>
							<a href='/playground'>
								{t_menus("playground")}
								<ArrowRight className='ml-2 h-5 w-5 transition-transform group-hover:translate-x-1' />
							</a>
						</Button>
						<Button asChild size='lg' variant='outline'>
							<a href='/docs-api'>{t_menus("docs-api")}</a>
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
