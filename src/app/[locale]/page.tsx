"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Rocket, BookOpen, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// SunEditor를 CSR로만 로드 (SSR 회피)
//const SunEditor = dynamic(() => import('suneditor-react'), { ssr: false, loading: () => <div className='h-40 w-full animate-pulse rounded-xl bg-muted' /> });

export default function HomePage() {
	const [codeTab, setCodeTab] = useState("npm");
	const t = useTranslations("Home");

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/40'>
			{/* Hero */}
			<section className='relative overflow-hidden'>
				<div className='absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/.15)_0%,transparent_70%)]' />
				<div className='container mx-auto px-6 pt-6 pb-16'>
					<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mx-auto max-w-4xl text-center'>
						<Badge variant='secondary' className='px-3 py-1 text-xs'>
							Open-source • VanillaScript • Plugin-first
						</Badge>
						<h1 className='mt-6 text-4xl font-bold tracking-tight md:text-6xl'>
							<span className='ml-3 bg-gradient-to-l from-primary to-[var(--color-se-active)] bg-clip-text text-transparent'>SunEditor</span>
							<span className='ml-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent'>Demo & Docs</span>
						</h1>
						<p className='mx-auto mt-4 max-w-2xl text-muted-foreground'>{t("title")}</p>
						<div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
							<Button asChild className='group'>
								<a href='/playground'>
									Playground
									<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
								</a>
							</Button>
							<Button asChild variant='outline'>
								<a href='/docs'>Docs / API</a>
							</Button>
							<Button asChild variant='ghost' className='gap-2'>
								<a href='/feature-demo'>
									<Sparkles className='h-4 w-4' />
									Feature
								</a>
							</Button>
						</div>
						{/* Quick social proof 자리 */}
						<div className='mt-6 text-sm text-muted-foreground'>SSR-friendly · A11y · i18n · Custom plugin API</div>
					</motion.div>

					{/* Inline Live Demo */}
					<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className='mx-auto mt-12 max-w-5xl'>
						<Card className='border-primary/20 shadow-sm'>
							<CardHeader className='pb-2'>
								<CardTitle className='flex items-center gap-2 text-lg'>
									<Rocket className='h-5 w-5' /> 기본 데모?
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className='rounded-xl border bg-background p-4'>
									{/* 실제 에디터 (CSR) */}
									<link rel='stylesheet' href='https://unpkg.com/suneditor/dist/css/suneditor.min.css' />
									{/* <SunEditor
										setOptions={{
											height: 180,
											buttonList: [
												['undo', 'redo'],
												['bold', 'italic', 'underline', 'strike'],
												['fontColor', 'hiliteColor'],
												['align', 'list', 'formatBlock'],
												['table', 'link', 'image'],
												['removeFormat'],
											],
										}}
										defaultValue='<p>여기에 바로 타이핑해봐 ✨</p>'
									/> */}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</section>

			{/* Install & Basic Usage */}
			<section className='container mx-auto px-6 py-16'>
				<div className='grid items-start gap-8 md:grid-cols-2'>
					<motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
						<h2 className='text-2xl font-semibold'>설치</h2>
						<p className='mt-2 text-muted-foreground'>SSR은 피하고 CSR로 안전하게 로딩</p>
						<Tabs value={codeTab} onValueChange={setCodeTab} className='mt-6'>
							<TabsList>
								<TabsTrigger value='npm'>npm</TabsTrigger>
								<TabsTrigger value='yarn'>yarn</TabsTrigger>
								<TabsTrigger value='pnpm'>pnpm</TabsTrigger>
							</TabsList>
							<TabsContent value='npm'>
								<CodeBlock>npm i suneditor suneditor-react</CodeBlock>
							</TabsContent>
							<TabsContent value='yarn'>
								<CodeBlock>yarn add suneditor suneditor-react</CodeBlock>
							</TabsContent>
							<TabsContent value='pnpm'>
								<CodeBlock>pnpm add suneditor suneditor-react</CodeBlock>
							</TabsContent>
						</Tabs>
						<div className='mt-6'>
							<CodeBlock language='tsx'>{`"use client";
import dynamic from "next/dynamic";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

export default function EditorDemo(){
  return (
    <SunEditor setOptions={{ buttonList: [["bold","italic","underline"],["list","align"],["link","image"]] }} />
  );
}`}</CodeBlock>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Deep links to 주요 페이지 */}
			<section className='container mx-auto px-6 pb-20'>
				<div className='grid gap-6 md:grid-cols-3'>
					<DeepLinkCard href='/getting-started' icon={<Rocket className='h-5 w-5' />} title='Getting Started' desc='설치부터 첫 에디터 렌더까지' />
					<DeepLinkCard href='/plugin-guide' icon={<Code2 className='h-5 w-5' />} title='Plugin Guide' desc='툴바 버튼, 커맨드, 팝업… 커스텀 플러그인' />
					<DeepLinkCard href='/deep-dive' icon={<BookOpen className='h-5 w-5' />} title='Deep Dive' desc='코어 구조와 이벤트 흐름' />
				</div>
			</section>
		</div>
	);
}

function DeepLinkCard({ href, icon, title, desc }: { href: string; icon: React.ReactNode; title: string; desc: string }) {
	return (
		<a href={href} className='group'>
			<Card className='h-full transition-transform group-hover:-translate-y-0.5'>
				<CardHeader className='pb-2'>
					<CardTitle className='flex items-center gap-2 text-base'>
						{icon}
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className='text-sm text-muted-foreground'>{desc}</p>
				</CardContent>
			</Card>
		</a>
	);
}

function CodeBlock({ children, language }: { children: React.ReactNode; language?: string }) {
	return (
		<pre className='mt-2 overflow-x-auto rounded-xl border bg-muted/30 p-4 text-sm'>
			<code className={`language-${language ?? "bash"}`}>{children}</code>
		</pre>
	);
}
