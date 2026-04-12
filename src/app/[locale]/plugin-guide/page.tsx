"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Image,
	Video,
	Music,
	PenTool,
	Link2,
	Type,
	Palette,
	AlignLeft,
	Table2,
	Minus,
	ListOrdered,
	List,
	Hash,
	AtSign,
	Calculator,
	Code2,
	FileUp,
	Navigation,
	ArrowRight,
	ExternalLink,
	Github,
} from "lucide-react";
import { useTranslations } from "next-intl";
import CustomPluginGuide from "./_components/CustomPluginGuide";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { GettingStartedMidBanner } from "@/components/ad/AdBanner";

/* ── Plugin icon/config data (non-translatable) ──────── */

type PluginDef = {
	name: string;
	icon: React.ReactNode;
	configurable?: boolean;
};

type DisplayGroupDef = {
	color: string;
	plugins: PluginDef[];
};

const ICON = "size-4 shrink-0";

const displayGroupDefs: Record<string, DisplayGroupDef> = {
	modal: {
		color: "text-violet-600 dark:text-violet-400",
		plugins: [
			{ name: "image", icon: <Image className={ICON} />, configurable: true },
			{ name: "video", icon: <Video className={ICON} />, configurable: true },
			{ name: "audio", icon: <Music className={ICON} />, configurable: true },
			{ name: "link", icon: <Link2 className={ICON} /> },
			{ name: "embed", icon: <Code2 className={ICON} />, configurable: true },
			{ name: "drawing", icon: <PenTool className={ICON} />, configurable: true },
			{ name: "math", icon: <Calculator className={ICON} />, configurable: true },
		],
	},
	dropdown: {
		color: "text-sky-600 dark:text-sky-400",
		plugins: [
			{ name: "font", icon: <Type className={ICON} /> },
			{ name: "blockStyle", icon: <Hash className={ICON} /> },
			{ name: "align", icon: <AlignLeft className={ICON} /> },
			{ name: "fontColor", icon: <Palette className={ICON} />, configurable: true },
			{ name: "backgroundColor", icon: <Palette className={ICON} />, configurable: true },
			{ name: "lineHeight", icon: <List className={ICON} /> },
			{ name: "table", icon: <Table2 className={ICON} />, configurable: true },
			{ name: "hr", icon: <Minus className={ICON} /> },
			{ name: "list", icon: <ListOrdered className={ICON} /> },
		],
	},
	command: {
		color: "text-amber-600 dark:text-amber-400",
		plugins: [
			{ name: "blockquote", icon: <Code2 className={ICON} /> },
			{ name: "list_bulleted", icon: <List className={ICON} /> },
			{ name: "list_numbered", icon: <ListOrdered className={ICON} /> },
			{ name: "fileUpload", icon: <FileUp className={ICON} /> },
		],
	},
	input: {
		color: "text-teal-600 dark:text-teal-400",
		plugins: [
			{ name: "fontSize", icon: <Type className={ICON} />, configurable: true },
			{ name: "pageNavigator", icon: <Navigation className={ICON} /> },
		],
	},
	field: {
		color: "text-rose-600 dark:text-rose-400",
		plugins: [{ name: "autocomplete", icon: <AtSign className={ICON} />, configurable: true }],
	},
};

/* ── Page component ───────────────────────────────────── */

export default function PluginGuidePage() {
	const t = useTranslations("PluginGuide");
	const [displayTab, setDisplayTab] = useState("modal");

	return (
		<div className='min-h-screen'>
			{/* Header */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center max-w-3xl mx-auto'
				>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>
						{t("subtitle1")}
						<br className='hidden md:block' />
						{t.rich("subtitle2", {
							strong: (chunks) => <strong>{chunks}</strong>,
						})}
					</p>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 pb-20 space-y-20'>
				{/* ── Display Types & Built-in Plugins ─────────── */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<h2 className='text-2xl font-semibold mb-2'>{t("builtInTitle")}</h2>
					<p className='text-sm text-muted-foreground mb-8'>
						{t.rich("builtInDesc", {
							code: (chunks) => <code className='text-xs bg-muted px-1.5 py-0.5 rounded'>{chunks}</code>,
						})}
					</p>

					<Tabs value={displayTab} onValueChange={setDisplayTab}>
						<TabsList className='flex flex-wrap h-auto gap-1 mb-6'>
							{Object.entries(displayGroupDefs).map(([key, group]) => (
								<TabsTrigger key={key} value={key} className='text-xs'>
									<span className={group.color}>{t(`displayTypes.${key}`)}</span>
									<Badge variant='outline' className='ms-1.5 text-[10px] px-1.5 py-0'>
										{group.plugins.length}
									</Badge>
								</TabsTrigger>
							))}
						</TabsList>

						{Object.entries(displayGroupDefs).map(([key, group]) => (
							<TabsContent key={key} value={key}>
								<Card className='mb-6'>
									<CardHeader className='pb-3'>
										<CardTitle className={`text-lg ${group.color}`}>
											{t(`displayTypes.${key}`)}
										</CardTitle>
										<CardDescription>{t(`displayTypes.${key}Desc`)}</CardDescription>
									</CardHeader>
								</Card>

								<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
									{group.plugins.map((plugin) => (
										<div
											key={plugin.name}
											className='flex items-start gap-3 rounded-lg border p-3 bg-card/60 hover:bg-card transition-colors'
										>
											<span className={`mt-0.5 ${group.color}`}>{plugin.icon}</span>
											<div className='min-w-0 flex-1'>
												<div className='flex items-center gap-2'>
													<code className='text-sm font-medium'>{plugin.name}</code>
													{plugin.configurable && (
														<Badge
															variant='outline'
															className='text-[9px] px-1 py-0 text-muted-foreground'
														>
															{t("configurable")}
														</Badge>
													)}
												</div>
												<p className='text-xs text-muted-foreground mt-0.5'>
													{t(`plugins.${plugin.name}`)}
												</p>
											</div>
										</div>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.section>

				{/* ── Plugin Options in Playground ─────────────── */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<h2 className='text-2xl font-semibold mb-2'>{t("tryOptionsTitle")}</h2>
					<p className='text-sm text-muted-foreground mb-6'>
						{t.rich("tryOptionsDesc", {
							badge: (chunks) => (
								<Badge variant='outline' className='text-[9px] px-1 py-0 mx-1'>
									{chunks}
								</Badge>
							),
						})}
					</p>
					<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='p-6 flex flex-col sm:flex-row items-center gap-6'>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>{t("playgroundSidebarTitle")}</h3>
								<p className='text-sm text-muted-foreground'>{t("playgroundSidebarDesc")}</p>
							</div>
							<Button asChild className='shrink-0 group'>
								<Link href='/playground'>
									{t("openPlayground")}
									<ArrowRight className='ms-2 h-4 w-4 transition-transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1' />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</motion.section>

				<GettingStartedMidBanner />

				{/* ── Custom Plugin Guide ─────────────────────── */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
					id='custom-plugin'
				>
					<CustomPluginGuide />
				</motion.section>

				{/* ── Resources ────────────────────────────────── */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<h2 className='text-2xl font-semibold mb-6'>{t("resourcesTitle")}</h2>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
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
							<Link href='https://github.com/JiHong88/SunEditor/tree/master/src/plugins' target='_blank'>
								<div className='text-start'>
									<Github className='h-4 w-4 mb-1' />
									<span className='font-medium'>{t("pluginSource")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("pluginSourceDesc")}</p>
								</div>
								<ExternalLink className='ms-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='https://github.com/JiHong88/SunEditor/discussions' target='_blank'>
								<div className='text-start'>
									<span className='font-medium'>{t("community")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("communityDesc")}</p>
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
