"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Palette, Zap, ArrowRight, ExternalLink, Github } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { BookOpen } from "lucide-react";

import ThemeGuideContent from "./_components/ThemeGuideContent";
import EventsContent from "./_components/EventsContent";
import UploadGuideContent from "./_components/UploadGuideContent";

export default function DeepDivePage() {
	const t = useTranslations("DeepDive");
	const [activeTab, setActiveTab] = useState("theme");

	return (
		<div className='min-h-screen'>
			{/* Hero */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center max-w-3xl mx-auto'>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 pb-20 space-y-20'>
				{/* Main content tabs */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className='mb-2'>
							<TabsTrigger value='theme' className='gap-2'>
								<Palette className='size-4' />
								{t("tabs.theme")}
							</TabsTrigger>
							<TabsTrigger value='upload' className='gap-2'>
								<Upload className='size-4' />
								{t("tabs.upload")}
							</TabsTrigger>
							<TabsTrigger value='events' className='gap-2'>
								<Zap className='size-4' />
								{t("tabs.events")}
							</TabsTrigger>
						</TabsList>

						<div className='flex items-center gap-3 mt-3 mb-4 pb-4 border-b'>
							<Link
								href='/deep-dive/guide'
								className='inline-flex items-center gap-2 rounded-lg border border-orange-300 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 shadow-sm transition-colors hover:bg-orange-100 dark:border-orange-500/30 dark:bg-orange-950/40 dark:text-orange-300 dark:hover:bg-orange-950/60'
							>
								<BookOpen className='size-4' />
								{t("architectureGuide")}
								<ArrowRight className='size-3.5' />
							</Link>
							<a
								href='https://github.com/JiHong88/SunEditor/blob/master/GUIDE.md'
								target='_blank'
								rel='noopener noreferrer'
								className='inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
							>
								<Github className='size-3.5' />
								GitHub
								<ExternalLink className='size-3' />
							</a>
						</div>

						<TabsContent value='theme'>
							<ThemeGuideContent />
						</TabsContent>

						<TabsContent value='upload'>
							<UploadGuideContent />
						</TabsContent>

						<TabsContent value='events'>
							<EventsContent />
						</TabsContent>
					</Tabs>
				</motion.section>

				{/* Resources */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
					<h2 className='text-2xl font-semibold mb-6'>{t("resourcesTitle")}</h2>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/plugin-guide'>
								<div className='text-start'>
									<span className='font-medium'>{t("pluginGuide")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("pluginGuideDesc")}</p>
								</div>
								<ArrowRight className='ms-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/docs-api'>
								<div className='text-start'>
									<span className='font-medium'>{t("apiReference")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("apiReferenceDesc")}</p>
								</div>
								<ArrowRight className='ms-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='https://github.com/JiHong88/SunEditor' target='_blank'>
								<div className='text-start'>
									<Github className='h-4 w-4 mb-1' />
									<span className='font-medium'>{t("sourceCode")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("sourceCodeDesc")}</p>
								</div>
								<ExternalLink className='ms-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
					</div>
				</motion.section>
			</div>
		</div>
	);
}
