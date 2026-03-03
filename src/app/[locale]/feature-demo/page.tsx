"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Bold,
	Type,
	Hash,
	Palette,
	Highlighter,
	AlignLeft,
	Heading,
	Space,
	CopyCheck,
	Image,
	Move,
	Video,
	Music,
	Code2,
	PenTool,
	FileUp,
	Table2,
	TableCellsMerge,
	Columns3,
	ListOrdered,
	Quote,
	Minus,
	SeparatorHorizontal,
	Calculator,
	AtSign,
	Link2,
	Eye,
	LetterText,
	Undo2,
	PanelTop,
	PanelTopInactive,
	MessageCircle,
	MessageCircleDashed,
	FileText,
	Layers,
	Maximize,
	Package,
	FileCode,
	Languages,
	Shield,
	Blocks,
	Printer,
	Keyboard,
	ArrowRight,
	Puzzle,
	Globe,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

/* ── Feature data (non-translatable: icons only) ──────── */

type FeatureDef = {
	key: string;
	icon: React.ReactNode;
};

type CategoryDef = {
	key: string;
	color: string;
	features: FeatureDef[];
};

const ICON = "size-4 shrink-0";

const categories: CategoryDef[] = [
	{
		key: "textFormatting",
		color: "text-blue-600 dark:text-blue-400",
		features: [
			{ key: "boldItalic", icon: <Bold className={ICON} /> },
			{ key: "fontFamily", icon: <Type className={ICON} /> },
			{ key: "fontSize", icon: <Hash className={ICON} /> },
			{ key: "fontColor", icon: <Palette className={ICON} /> },
			{ key: "bgColor", icon: <Highlighter className={ICON} /> },
			{ key: "alignment", icon: <AlignLeft className={ICON} /> },
			{ key: "blockStyles", icon: <Heading className={ICON} /> },
			{ key: "lineHeight", icon: <Space className={ICON} /> },
			{ key: "copyFormat", icon: <CopyCheck className={ICON} /> },
		],
	},
	{
		key: "media",
		color: "text-violet-600 dark:text-violet-400",
		features: [
			{ key: "imageUpload", icon: <Image className={ICON} /> },
			{ key: "imageResize", icon: <Move className={ICON} /> },
			{ key: "video", icon: <Video className={ICON} /> },
			{ key: "audio", icon: <Music className={ICON} /> },
			{ key: "embed", icon: <Code2 className={ICON} /> },
			{ key: "drawing", icon: <PenTool className={ICON} /> },
			{ key: "fileUpload", icon: <FileUp className={ICON} /> },
		],
	},
	{
		key: "tableStructure",
		color: "text-green-600 dark:text-green-400",
		features: [
			{ key: "tableInsert", icon: <Table2 className={ICON} /> },
			{ key: "cellMerge", icon: <TableCellsMerge className={ICON} /> },
			{ key: "rowColOps", icon: <Columns3 className={ICON} /> },
			{ key: "lists", icon: <ListOrdered className={ICON} /> },
			{ key: "blockquote", icon: <Quote className={ICON} /> },
			{ key: "hr", icon: <Minus className={ICON} /> },
			{ key: "pageBreak", icon: <SeparatorHorizontal className={ICON} /> },
		],
	},
	{
		key: "advanced",
		color: "text-amber-600 dark:text-amber-400",
		features: [
			{ key: "math", icon: <Calculator className={ICON} /> },
			{ key: "mention", icon: <AtSign className={ICON} /> },
			{ key: "links", icon: <Link2 className={ICON} /> },
			{ key: "codeView", icon: <Eye className={ICON} /> },
			{ key: "charCounter", icon: <LetterText className={ICON} /> },
			{ key: "undoRedo", icon: <Undo2 className={ICON} /> },
		],
	},
	{
		key: "modesLayout",
		color: "text-teal-600 dark:text-teal-400",
		features: [
			{ key: "classicMode", icon: <PanelTop className={ICON} /> },
			{ key: "inlineMode", icon: <PanelTopInactive className={ICON} /> },
			{ key: "balloonMode", icon: <MessageCircle className={ICON} /> },
			{ key: "balloonAlways", icon: <MessageCircleDashed className={ICON} /> },
			{ key: "documentLayout", icon: <FileText className={ICON} /> },
			{ key: "multiRoot", icon: <Layers className={ICON} /> },
			{ key: "fullScreen", icon: <Maximize className={ICON} /> },
		],
	},
	{
		key: "platform",
		color: "text-rose-600 dark:text-rose-400",
		features: [
			{ key: "zeroDeps", icon: <Package className={ICON} /> },
			{ key: "tsSupport", icon: <FileCode className={ICON} /> },
			{ key: "i18nRtl", icon: <Languages className={ICON} /> },
			{ key: "strictMode", icon: <Shield className={ICON} /> },
			{ key: "pluginAPI", icon: <Blocks className={ICON} /> },
			{ key: "exportPdf", icon: <Printer className={ICON} /> },
			{ key: "keyboard", icon: <Keyboard className={ICON} /> },
		],
	},
];

/* ── Stat pills ───────────────────────────────────────── */

const statMeta = [
	{
		key: "modes" as const,
		icon: <PanelTop className='h-5 w-5' />,
		className: "bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400",
	},
	{
		key: "plugins" as const,
		icon: <Puzzle className='h-5 w-5' />,
		className: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
	},
	{
		key: "languages" as const,
		icon: <Globe className='h-5 w-5' />,
		className: "bg-violet-100 text-violet-600 dark:bg-violet-900/40 dark:text-violet-400",
	},
	{
		key: "zeroDeps" as const,
		icon: <Package className='h-5 w-5' />,
		className: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
	},
	{
		key: "typescript" as const,
		icon: <FileCode className='h-5 w-5' />,
		className: "bg-sky-100 text-sky-600 dark:bg-sky-900/40 dark:text-sky-400",
	},
];

/* ── Page component ───────────────────────────────────── */

export default function FeatureDemoPage() {
	const t = useTranslations("FeatureDemo");
	const [activeTab, setActiveTab] = useState(categories[0].key);

	return (
		<div className='min-h-screen'>
			{/* Hero */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center max-w-3xl mx-auto'
				>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>
				</motion.div>
			</section>

			{/* Stat pills */}
			<section className='container mx-auto px-4 pb-8'>
				<div className='flex flex-wrap items-center justify-center gap-3 md:gap-5'>
					{statMeta.map((item) => (
						<div
							key={item.key}
							className='flex items-center gap-2.5 rounded-full border px-4 py-2 bg-background/80 backdrop-blur-sm'
						>
							<span className={`flex h-8 w-8 items-center justify-center rounded-full ${item.className}`}>
								{item.icon}
							</span>
							<span className='text-sm font-medium'>{t(`stats.${item.key}`)}</span>
						</div>
					))}
				</div>
			</section>

			<div className='container mx-auto px-6 pb-20 space-y-20'>
				{/* Feature catalog */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
				>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className='flex flex-wrap h-auto gap-1 mb-6'>
							{categories.map((cat) => (
								<TabsTrigger key={cat.key} value={cat.key} className='text-xs'>
									<span className={cat.color}>{t(`categories.${cat.key}`)}</span>
									<Badge variant='outline' className='ml-1.5 text-[10px] px-1.5 py-0'>
										{cat.features.length}
									</Badge>
								</TabsTrigger>
							))}
						</TabsList>

						{categories.map((cat) => (
							<TabsContent key={cat.key} value={cat.key}>
								<Card className='mb-6'>
									<CardHeader className='pb-3'>
										<CardTitle className={`text-lg ${cat.color}`}>
											{t(`categories.${cat.key}`)}
										</CardTitle>
										<CardDescription>{t(`categories.${cat.key}Desc`)}</CardDescription>
									</CardHeader>
								</Card>

								<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
									{cat.features.map((feature) => (
										<div
											key={feature.key}
											className='flex items-start gap-3 rounded-lg border p-3 bg-card/60 hover:bg-card transition-colors'
										>
											<span className={`mt-0.5 ${cat.color}`}>{feature.icon}</span>
											<div className='min-w-0 flex-1'>
												<span className='text-sm font-medium'>
													{t(`features.${feature.key}`)}
												</span>
												<p className='text-xs text-muted-foreground mt-0.5'>
													{t(`features.${feature.key}Desc`)}
												</p>
											</div>
										</div>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.section>

				{/* Playground CTA */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='p-6 flex flex-col sm:flex-row items-center gap-6'>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>{t("ctaTitle")}</h3>
								<p className='text-sm text-muted-foreground'>{t("ctaDesc")}</p>
							</div>
							<Button asChild className='shrink-0 group'>
								<Link href='/playground'>
									{t("ctaButton")}
									<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-1' />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</motion.section>

				{/* Resources */}
				<motion.section
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<h2 className='text-2xl font-semibold mb-6'>{t("resourcesTitle")}</h2>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/getting-started'>
								<div className='text-left'>
									<span className='font-medium'>{t("gettingStarted")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("gettingStartedDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/plugin-guide'>
								<div className='text-left'>
									<span className='font-medium'>{t("pluginGuide")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("pluginGuideDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/docs-api'>
								<div className='text-left'>
									<span className='font-medium'>{t("apiReference")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("apiReferenceDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
					</div>
				</motion.section>
			</div>
		</div>
	);
}
