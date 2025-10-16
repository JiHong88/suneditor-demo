"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Play, Sparkles, Table, ImageIcon, Code2, Type, FileText, Languages, Accessibility } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

const featureCategories = {
	formatting: {
		title: "Text Formatting",
		icon: <Type className='h-5 w-5' />,
		features: [
			{ name: "Rich Text Styling", desc: "Bold, italic, underline, strikethrough, superscript, subscript", demo: "basic-formatting" },
			{ name: "Font Family & Size", desc: "Multiple font families and size options", demo: "font-control" },
			{ name: "Text Color & Highlight", desc: "Foreground and background color picker", demo: "color-picker" },
			{ name: "Text Alignment", desc: "Left, center, right, justify alignment", demo: "text-align" },
			{ name: "Line Height & Spacing", desc: "Adjustable line height and paragraph spacing", demo: "spacing" },
		],
	},
	structure: {
		title: "Document Structure",
		icon: <FileText className='h-5 w-5' />,
		features: [
			{ name: "Headings (H1-H6)", desc: "Hierarchical heading structure with styling", demo: "headings" },
			{ name: "Lists", desc: "Ordered, unordered, and nested lists", demo: "lists" },
			{ name: "Blockquotes", desc: "Quote formatting with custom styling", demo: "blockquotes" },
			{ name: "Horizontal Rules", desc: "Section dividers and separators", demo: "hr" },
			{ name: "Indentation", desc: "Text and paragraph indentation controls", demo: "indent" },
		],
	},
	media: {
		title: "Media & Embeds",
		icon: <ImageIcon className='h-5 w-5' />,
		features: [
			{ name: "Image Upload", desc: "Drag & drop, paste, or browse to upload images", demo: "image-upload" },
			{ name: "Image Resize & Align", desc: "Resize handles and alignment options", demo: "image-controls" },
			{ name: "Video Embeds", desc: "YouTube, Vimeo, and custom video embeds", demo: "video-embed" },
			{ name: "Audio Support", desc: "Audio file embedding and playback", demo: "audio" },
			{ name: "File Attachments", desc: "Upload and link to various file types", demo: "file-attach" },
		],
	},
	tables: {
		title: "Advanced Tables",
		icon: <Table className='h-5 w-5' />,
		features: [
			{ name: "Table Creation", desc: "Insert tables with custom dimensions", demo: "table-create" },
			{ name: "Cell Merge/Split", desc: "Merge and split table cells", demo: "cell-merge" },
			{ name: "Row/Column Operations", desc: "Add, delete, resize rows and columns", demo: "row-col-ops" },
			{ name: "Table Styling", desc: "Borders, colors, and table formatting", demo: "table-style" },
			{ name: "Header Rows", desc: "Define and style table headers", demo: "table-headers" },
		],
	},
	code: {
		title: "Code & Technical",
		icon: <Code2 className='h-5 w-5' />,
		features: [
			{ name: "Inline Code", desc: "Inline code formatting with syntax highlighting", demo: "inline-code" },
			{ name: "Code Blocks", desc: "Multi-line code blocks with language support", demo: "code-blocks" },
			{ name: "Syntax Highlighting", desc: "Automatic syntax highlighting for popular languages", demo: "syntax-highlight" },
			{ name: "HTML View", desc: "Raw HTML editing and preview mode", demo: "html-view" },
			{ name: "Custom HTML", desc: "Insert custom HTML elements", demo: "custom-html" },
		],
	},
	links: {
		title: "Links & Navigation",
		icon: <Link className='h-5 w-5' />,
		features: [
			{ name: "Hyperlinks", desc: "Create and edit links with target options", demo: "hyperlinks" },
			{ name: "Auto-linking", desc: "Automatic URL detection and conversion", demo: "auto-link" },
			{ name: "Anchor Links", desc: "Internal page anchors and navigation", demo: "anchors" },
			{ name: "Link Preview", desc: "Link preview tooltips", demo: "link-preview" },
			{ name: "Link Validation", desc: "URL validation and error checking", demo: "link-validation" },
		],
	},
	accessibility: {
		title: "Accessibility",
		icon: <Accessibility className='h-5 w-5' />,
		features: [
			{ name: "Keyboard Navigation", desc: "Full keyboard accessibility support", demo: "kbd-nav" },
			{ name: "Screen Reader", desc: "ARIA labels and screen reader compatibility", demo: "screen-reader" },
			{ name: "High Contrast", desc: "High contrast mode support", demo: "high-contrast" },
			{ name: "Focus Management", desc: "Proper focus indicators and management", demo: "focus-mgmt" },
			{ name: "Alt Text", desc: "Image alt text editing interface", demo: "alt-text" },
		],
	},
	i18n: {
		title: "Internationalization",
		icon: <Languages className='h-5 w-5' />,
		features: [
			{ name: "RTL Support", desc: "Right-to-left language support", demo: "rtl" },
			{ name: "Multi-language UI", desc: "Interface available in multiple languages", demo: "multi-lang" },
			{ name: "Character Sets", desc: "Support for various character encodings", demo: "charset" },
			{ name: "Input Methods", desc: "IME support for Asian languages", demo: "ime" },
			{ name: "Text Direction", desc: "Mixed LTR/RTL content support", demo: "text-direction" },
		],
	},
};

export default function FeatureDemoPage() {
	const [selectedCategory, setSelectedCategory] = useState("formatting");
	const [selectedDemo, setSelectedDemo] = useState<string | null>(null);
	const t = useTranslations("FeatureDemo");

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/20'>
			{/* Header */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center'>
					<Badge variant='secondary' className='mb-4'>
						<Sparkles className='mr-2 h-4 w-4' />
						Interactive Demos
					</Badge>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>SunEditor Features</h1>
					<p className='mt-4 text-lg text-muted-foreground max-w-2xl mx-auto'>
						Explore all the powerful features and capabilities of SunEditor v3. Click on any feature to see it in action.
					</p>
				</motion.div>
			</section>

			{/* Feature Categories */}
			<section className='container mx-auto px-6 pb-20'>
				<Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
					<TabsList className='grid grid-cols-4 lg:grid-cols-8 mb-8'>
						{Object.entries(featureCategories).map(([key, category]) => (
							<TabsTrigger key={key} value={key} className='flex flex-col gap-1 h-auto py-2'>
								{category.icon}
								<span className='text-xs'>{category.title.split(" ")[0]}</span>
							</TabsTrigger>
						))}
					</TabsList>

					{Object.entries(featureCategories).map(([key, category]) => (
						<TabsContent key={key} value={key}>
							<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
								{category.features.map((feature) => (
									<Card key={feature.name} className='cursor-pointer transition-all hover:shadow-md hover:-translate-y-1' onClick={() => setSelectedDemo(feature.demo)}>
										<CardHeader className='pb-3'>
											<CardTitle className='flex items-center gap-2 text-lg'>
												<Check className='h-4 w-4 text-green-500' />
												{feature.name}
											</CardTitle>
											<CardDescription>{feature.desc}</CardDescription>
										</CardHeader>
										<CardContent>
											<Button variant='outline' size='sm' className='w-full group'>
												<Play className='mr-2 h-4 w-4 transition-transform group-hover:scale-110' />
												Try Demo
											</Button>
										</CardContent>
									</Card>
								))}
							</div>
						</TabsContent>
					))}
				</Tabs>
			</section>

			{/* Demo Viewer */}
			{selectedDemo && (
				<section className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
					<motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className='bg-background rounded-lg shadow-2xl max-w-4xl w-full m-4 max-h-[80vh] overflow-auto'>
						<div className='p-6 border-b flex justify-between items-center'>
							<h3 className='text-xl font-semibold'>Feature Demo: {selectedDemo}</h3>
							<Button variant='ghost' onClick={() => setSelectedDemo(null)}>
								✕
							</Button>
						</div>
						<div className='p-6'>
							<div className='aspect-video bg-muted rounded-lg flex items-center justify-center'>
								<div className='text-center text-muted-foreground'>
									<Play className='h-16 w-16 mx-auto mb-4' />
									<p>Interactive demo for "{selectedDemo}" would load here</p>
									<p className='text-sm mt-2'>This would contain a live SunEditor instance showcasing the specific feature</p>
								</div>
							</div>
							<div className='mt-6 flex gap-4'>
								<Button>Try in Playground</Button>
								<Button variant='outline'>View Code</Button>
							</div>
						</div>
					</motion.div>
				</section>
			)}

			{/* Call to Action */}
			<section className='container mx-auto px-6 pb-20'>
				<Card className='bg-gradient-to-r from-primary/5 to-secondary/5'>
					<CardContent className='p-8 text-center'>
						<h3 className='text-2xl font-semibold mb-4'>Ready to integrate SunEditor?</h3>
						<p className='text-muted-foreground mb-6'>Start building with these powerful features in your own project</p>
						<div className='flex flex-wrap gap-4 justify-center'>
							<Button asChild>
								<Link href='/playground'>Try Playground</Link>
							</Button>
							<Button variant='outline' asChild>
								<Link href='/getting-started'>Getting Started</Link>
							</Button>
							<Button variant='ghost' asChild>
								<Link href='/docs'>Read Docs</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
