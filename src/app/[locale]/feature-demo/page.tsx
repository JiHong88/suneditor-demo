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
	Calculator,
	AtSign,
	Link2,
	Eye,
	LetterText,
	Undo2,
	PanelTop,
	PanelTopInactive,
	PanelBottom,
	MessageCircle,
	MessageCircleDashed,
	FileText,
	Maximize,
	Languages,
	Shield,
	Printer,
	Keyboard,
	Search,
	ArrowRight,
	Package,
	FileCode,
	Puzzle,
	Globe,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";
import { FEATURE_PLAYGROUND_LINKS } from "./_lib/featurePlaygroundLinks";
import QuickTryModal from "@/components/common/QuickTryModal";
import { FEATURE_CATEGORIES } from "@/data/snippets/featureDemoCategories";

/* ── 아이콘 매핑 (JSX는 컴포넌트에서 관리) ──────────── */

const ICON = "size-4 shrink-0";
const ICON_LG = "h-5 w-5";

/** featureKey → 아이콘 */
const featureIcons: Record<string, React.ReactNode> = {
	boldItalic: <Bold className={ICON} />,
	fontFamily: <Type className={ICON} />,
	fontSize: <Hash className={ICON} />,
	fontColor: <Palette className={ICON} />,
	bgColor: <Highlighter className={ICON} />,
	alignment: <AlignLeft className={ICON} />,
	blockStyles: <Heading className={ICON} />,
	lineHeight: <Space className={ICON} />,
	copyFormat: <CopyCheck className={ICON} />,
	imageUpload: <Image className={ICON} />,
	imageResize: <Move className={ICON} />,
	video: <Video className={ICON} />,
	audio: <Music className={ICON} />,
	embed: <Code2 className={ICON} />,
	drawing: <PenTool className={ICON} />,
	fileUpload: <FileUp className={ICON} />,
	tableInsert: <Table2 className={ICON} />,
	cellMerge: <TableCellsMerge className={ICON} />,
	rowColOps: <Columns3 className={ICON} />,
	lists: <ListOrdered className={ICON} />,
	blockquote: <Quote className={ICON} />,
	hr: <Minus className={ICON} />,
	math: <Calculator className={ICON} />,
	autocomplete: <AtSign className={ICON} />,
	links: <Link2 className={ICON} />,
	codeView: <Eye className={ICON} />,
	markdownView: <FileText className={ICON} />,
	codeBlock: <Code2 className={ICON} />,
	finder: <Search className={ICON} />,
	charCounter: <LetterText className={ICON} />,
	undoRedo: <Undo2 className={ICON} />,
	classicMode: <PanelTop className={ICON} />,
	inlineMode: <PanelTopInactive className={ICON} />,
	balloonMode: <MessageCircle className={ICON} />,
	balloonAlways: <MessageCircleDashed className={ICON} />,
	toolbarBottom: <PanelBottom className={ICON} />,
	documentLayout: <FileText className={ICON} />,
	fullScreen: <Maximize className={ICON} />,
	i18nRtl: <Languages className={ICON} />,
	strictMode: <Shield className={ICON} />,
	exportPdf: <Printer className={ICON} />,
	keyboard: <Keyboard className={ICON} />,
};

/** statKey → 아이콘 */
const statIcons: Record<string, React.ReactNode> = {
	modes: <PanelTop className={ICON_LG} />,
	plugins: <Puzzle className={ICON_LG} />,
	languages: <Globe className={ICON_LG} />,
	zeroDeps: <Package className={ICON_LG} />,
	typescript: <FileCode className={ICON_LG} />,
};

/* ── Page component ───────────────────────────────────── */

export default function FeatureDemoPage() {
	const t = useTranslations("FeatureDemo");
	const [activeTab, setActiveTab] = useState(FEATURE_CATEGORIES[0].key);

	// Quick Try modal state
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedFeature, setSelectedFeature] = useState<{
		key: string;
		catColor: string;
		icon: React.ReactNode;
	} | null>(null);

	const openQuickTry = (featureKey: string, catColor: string, icon: React.ReactNode) => {
		setSelectedFeature({ key: featureKey, catColor, icon });
		setModalOpen(true);
	};

	const link = selectedFeature ? FEATURE_PLAYGROUND_LINKS[selectedFeature.key] : null;
	const playgroundHref = link ? `/playground?${link.query}#editor` : "/playground#editor";

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
				{/* Feature catalog */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className='flex flex-wrap h-auto gap-1 mb-6'>
							{FEATURE_CATEGORIES.map((cat) => (
								<TabsTrigger key={cat.key} value={cat.key} className='text-xs'>
									<span className={cat.color}>{t(`categories.${cat.key}`)}</span>
									<Badge variant='outline' className='ms-1.5 text-[10px] px-1.5 py-0'>
										{cat.features.length}
									</Badge>
								</TabsTrigger>
							))}
						</TabsList>

						{FEATURE_CATEGORIES.map((cat) => (
							<TabsContent key={cat.key} value={cat.key}>
								<Card className='mb-6'>
									<CardHeader className='pb-3'>
										<CardTitle className={`text-lg ${cat.color}`}>{t(`categories.${cat.key}`)}</CardTitle>
										<CardDescription>{t(`categories.${cat.key}Desc`)}</CardDescription>
									</CardHeader>
								</Card>

								<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-3'>
									{cat.features.map((featureKey) => (
										<button
											key={featureKey}
											type='button'
											onClick={() => openQuickTry(featureKey, cat.color, featureIcons[featureKey])}
											className='flex items-start gap-3 rounded-lg border p-3 bg-card/60 hover:bg-card transition-colors group text-start cursor-pointer'
										>
											<span className={`mt-0.5 ${cat.color}`}>{featureIcons[featureKey]}</span>
											<div className='min-w-0 flex-1'>
												<span className='text-sm font-medium'>{t(`features.${featureKey}`)}</span>
												<p className='text-xs text-muted-foreground mt-0.5'>{t(`features.${featureKey}Desc`)}</p>
											</div>
											<Badge
												variant='secondary'
												className='mt-0.5 text-[10px] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'
											>
												{t("quickTry")}
											</Badge>
										</button>
									))}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.section>

				{/* Playground CTA */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
					<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
						<CardContent className='p-6 flex flex-col sm:flex-row items-center gap-6'>
							<div className='flex-1'>
								<h3 className='font-semibold mb-1'>{t("ctaTitle")}</h3>
								<p className='text-sm text-muted-foreground'>{t("ctaDesc")}</p>
							</div>
							<Button asChild className='shrink-0 group'>
								<Link href='/playground'>
									{t("ctaButton")}
									<ArrowRight className='ms-2 h-4 w-4 transition-transform group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1' />
								</Link>
							</Button>
						</CardContent>
					</Card>
				</motion.section>

				{/* Resources */}
				<motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
					<h2 className='text-2xl font-semibold mb-6'>{t("resourcesTitle")}</h2>
					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/getting-started'>
								<div className='text-start'>
									<span className='font-medium'>{t("gettingStarted")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("gettingStartedDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/plugin-guide'>
								<div className='text-start'>
									<span className='font-medium'>{t("pluginGuide")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("pluginGuideDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
						<Button variant='outline' className='h-auto py-4 justify-start' asChild>
							<Link href='/docs-api'>
								<div className='text-start'>
									<span className='font-medium'>{t("apiReference")}</span>
									<p className='text-xs text-muted-foreground mt-0.5'>{t("apiReferenceDesc")}</p>
								</div>
								<ArrowRight className='ml-auto h-4 w-4 shrink-0' />
							</Link>
						</Button>
					</div>
				</motion.section>
			</div>

			{/* Quick Try Modal */}
			{selectedFeature && link && (
				<QuickTryModal
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					label={t(`features.${selectedFeature.key}`)}
					desc={t(`features.${selectedFeature.key}Desc`)}
					config={{
						demoHtml: link.demoHtml,
						buttonList: link.buttonList,
						editorOptions: link.editorOptions,
					}}
					playgroundHref={playgroundHref}
					color={selectedFeature.catColor}
					icon={selectedFeature.icon}
					badgeText={t("quickTry")}
				/>
			)}
		</div>
	);
}
