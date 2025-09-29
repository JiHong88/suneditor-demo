"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Rocket, BookOpen, Sparkles, Puzzle, Shield, Globe2, GaugeCircle, Cpu, Github, Download, Users, Megaphone } from "lucide-react";
import { useTranslations } from "next-intl";
// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
	const [codeTab, setCodeTab] = useState("npm");
	const t = useTranslations("Home");

	return (
		<div className='min-h-screen bg-gradient-to-b from-background to-muted/40'>
			<Hero t={t} />
			<QuickLinks />
			<LiveEditorShowcase />
			<QuickStart codeTab={codeTab} setCodeTab={setCodeTab} />
			<ValueProps />
			<FeatureHighlights />
			<PluginGalleryTeaser />
			<Benchmarks />
			<CompatibilityA11y />
			<SecurityAndI18n />
			<MigrationCTA />
			<Community />
			<FinalCTA />
		</div>
	);
}

function Hero({ t }: { t: any }) {
	return (
		<section className='relative overflow-hidden'>
			<div className='absolute inset-0 -z-10 bg-[radial-gradient(50%_50%_at_50%_0%,hsl(var(--primary)/.15)_0%,transparent_70%)]' />
			<div className='container mx-auto px-6 pt-6 pb-16'>
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='mx-auto max-w-4xl text-center'>
					<Badge variant='secondary' className='px-3 py-1 text-xs'>
						Open‑source • VanillaScript • Plugin‑first
					</Badge>
					<h1 className='mt-6 text-4xl font-bold tracking-tight md:text-6xl'>
						<span className='ml-3 bg-gradient-to-l from-primary to-[var(--color-se-active)] bg-clip-text text-transparent'>SunEditor</span>
						<span className='ml-3 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent'>v3</span>
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
					<div className='mt-6 text-sm text-muted-foreground'>SSR‑friendly · A11y · i18n · Custom plugin API</div>
				</motion.div>
			</div>
		</section>
	);
}

function QuickLinks() {
	return (
		<section className='container mx-auto px-6 pb-12'>
			<div className='grid gap-6 md:grid-cols-3'>
				<DeepLinkCard href='/getting-started' icon={<Rocket className='h-5 w-5' />} title='Getting Started' desc='설치부터 첫 에디터 렌더까지' />
				<DeepLinkCard href='/plugin-guide' icon={<Code2 className='h-5 w-5' />} title='Plugin Guide' desc='툴바 버튼, 커맨드, 팝업… 커스텀 플러그인' />
				<DeepLinkCard href='/deep-dive' icon={<BookOpen className='h-5 w-5' />} title='Deep Dive' desc='코어 구조와 이벤트 흐름' />
			</div>
		</section>
	);
}

function LiveEditorShowcase() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Sparkles className='h-5 w-5' /> Live Editor
					</CardTitle>
					<CardDescription>실시간으로 SunEditor를 체험하세요. (SSR 비활성화 • CSR 로드)</CardDescription>
				</CardHeader>
				<CardContent>
					{/* SunEditor를 CSR로만 로드 (SSR 회피) */}
					{/* <DynamicSunEditor /> */}
					<div className='h-40 w-full animate-pulse rounded-xl bg-muted' />
					<div className='mt-3 text-xs text-muted-foreground'>데모에서는 이미지 업로드/붙여넣기, 표/코드블록/수식(옵션) 등을 바로 시험해볼 수 있어요.</div>
				</CardContent>
			</Card>
		</section>
	);
}

function QuickStart({ codeTab, setCodeTab }: { codeTab: string; setCodeTab: (v: string) => void }) {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-xl font-semibold'>Quick Start</h2>
				<a className='text-sm text-primary hover:underline' href='/docs/installation'>
					Installation docs
				</a>
			</div>
			<Tabs value={codeTab} onValueChange={setCodeTab}>
				<TabsList>
					<TabsTrigger value='npm'>npm</TabsTrigger>
					<TabsTrigger value='yarn'>yarn</TabsTrigger>
					<TabsTrigger value='pnpm'>pnpm</TabsTrigger>
					<TabsTrigger value='cdn'>CDN</TabsTrigger>
				</TabsList>
				<TabsContent value='npm'>
					<CodeBlock>{`npm i suneditor suneditor-react`}</CodeBlock>
				</TabsContent>
				<TabsContent value='yarn'>
					<CodeBlock>{`yarn add suneditor suneditor-react`}</CodeBlock>
				</TabsContent>
				<TabsContent value='pnpm'>
					<CodeBlock>{`pnpm add suneditor suneditor-react`}</CodeBlock>
				</TabsContent>
				<TabsContent value='cdn'>
					<CodeBlock language='html'>{`<link rel="stylesheet" href="https://unpkg.com/suneditor/dist/css/suneditor.min.css" />
<script src="https://unpkg.com/suneditor/dist/suneditor.min.js"></script>`}</CodeBlock>
				</TabsContent>
			</Tabs>
			<div className='mt-4 grid gap-4 md:grid-cols-3'>
				<SmallStat icon={<GaugeCircle className='h-4 w-4' />} label='Core size' value='~X kB gz' />
				<SmallStat icon={<Cpu className='h-4 w-4' />} label='Zero deps core' value='Yes' />
				<SmallStat icon={<Puzzle className='h-4 w-4' />} label='Plugins' value={"20+ built‑ins"} />
			</div>
		</section>
	);
}

function ValueProps() {
	const items = [
		{ icon: <Puzzle className='h-5 w-5' />, title: "Plugin‑first", desc: "필요한 기능만 로드하고, 나머지는 플러그인으로 확장" },
		{ icon: <Shield className='h-5 w-5' />, title: "CSP‑friendly", desc: "nonce/hash 전략, inline‑free 렌더링 가이드" },
		{ icon: <Globe2 className='h-5 w-5' />, title: "i18n", desc: "다국어 번역 및 RTL 지원" },
		{ icon: <GaugeCircle className='h-5 w-5' />, title: "Performant", desc: "지연 로딩, 가벼운 DOM 업데이트, 배터리 소모 감소" },
	];
	return (
		<section className='container mx-auto px-6 pb-8'>
			<div className='grid gap-4 md:grid-cols-4'>
				{items.map((it) => (
					<Card key={it.title}>
						<CardHeader className='pb-2'>
							<CardTitle className='flex items-center gap-2 text-base'>
								{it.icon}
								{it.title}
							</CardTitle>
						</CardHeader>
						<CardContent className='text-sm text-muted-foreground'>{it.desc}</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

function FeatureHighlights() {
	const items = [
		{ title: "Tables", desc: "병합/분할, 셀 스타일, 붙여넣기 호환" },
		{ title: "Media", desc: "이미지/비디오/오디오, iframe 임베드" },
		{ title: "Markdown-ish", desc: "단축키, 코드블록, syntax highlight(옵션)" },
		{ title: "Accessibility", desc: "키보드 탐색, ARIA, 스크린리더 테스트" },
	];
	return (
		<section className='container mx-auto px-6 pb-20'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-xl font-semibold'>Feature Highlights</h2>
				<a className='text-sm text-primary hover:underline' href='/feature-demo'>
					모두 보기
				</a>
			</div>
			<div className='grid gap-6 md:grid-cols-2 lg:grid-cols-4'>
				{items.map((it) => (
					<Card key={it.title} className='h-full'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-base'>{it.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className='text-sm text-muted-foreground'>{it.desc}</p>
							<div className='mt-3 h-24 w-full rounded-lg bg-muted/50' />
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

function PluginGalleryTeaser() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<Puzzle className='h-5 w-5' /> Plugin Gallery
					</CardTitle>
					<CardDescription>에코시스템을 둘러보고 바로 설치해 보세요.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						{[1, 2, 3].map((i) => (
							<Card key={i} className='border-dashed'>
								<CardHeader className='pb-1'>
									<CardTitle className='text-sm'>플러그인 이름</CardTitle>
								</CardHeader>
								<CardContent className='text-xs text-muted-foreground'>간단 설명 • 설치 명령어 • 사용 예</CardContent>
							</Card>
						))}
					</div>
					<div className='mt-4'>
						<Button asChild variant='outline'>
							<a href='/plugins'>모든 플러그인 보기</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function Benchmarks() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<Card>
				<CardHeader>
					<CardTitle className='flex items-center gap-2'>
						<GaugeCircle className='h-5 w-5' /> Benchmarks
					</CardTitle>
					<CardDescription>초기 로드, 입력 지연(typing latency), 붙여넣기 처리 등을 수치로 보여주세요.</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='grid gap-4 md:grid-cols-3'>
						<SmallStat icon={<Download className='h-4 w-4' />} label='첫 로드' value='~XXX ms' />
						<SmallStat icon={<Cpu className='h-4 w-4' />} label='입력 지연' value='~XX ms' />
						<SmallStat icon={<GaugeCircle className='h-4 w-4' />} label='붙여넣기 1MB' value='~X.XX s' />
					</div>
					<div className='mt-4 text-xs text-muted-foreground'>측정 방법과 환경을 함께 명시해 신뢰도를 높이세요.</div>
				</CardContent>
			</Card>
		</section>
	);
}

function CompatibilityA11y() {
	const items = [
		{ title: "브라우저 지원", desc: "Chrome, Firefox, Safari, Edge 최신 2버전" },
		{ title: "프레임워크", desc: "React, Vue, Svelte, Next.js/SSR 가이드" },
		{ title: "A11y", desc: "키보드 포커스, ARIA labels, 스크린리더 체크리스트" },
	];
	return (
		<section className='container mx-auto px-6 pb-20'>
			<h2 className='mb-4 text-xl font-semibold'>Compatibility & A11y</h2>
			<div className='grid gap-6 md:grid-cols-3'>
				{items.map((it) => (
					<Card key={it.title}>
						<CardHeader className='pb-2'>
							<CardTitle className='text-base'>{it.title}</CardTitle>
						</CardHeader>
						<CardContent className='text-sm text-muted-foreground'>{it.desc}</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}

function SecurityAndI18n() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<div className='grid gap-6 md:grid-cols-2'>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Shield className='h-5 w-5' /> CSP & Security
						</CardTitle>
						<CardDescription>nonce/hash, unsafe-hashes, 업로드 보안, sanitizer 전략</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='list-disc pl-5 text-sm text-muted-foreground'>
							<li>Next.js nonce 전달 예제</li>
							<li>inline style/event 제거 전략</li>
							<li>파일 업로드 XSS/CSRF 체크리스트</li>
						</ul>
						<div className='mt-3'>
							<Button asChild variant='outline'>
								<a href='/docs/security'>Security guide</a>
							</Button>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle className='flex items-center gap-2'>
							<Globe2 className='h-5 w-5' /> i18n
						</CardTitle>
						<CardDescription>번역 키 구조, 자동 번역 워크플로, RTL</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className='list-disc pl-5 text-sm text-muted-foreground'>
							<li>언어팩 구조와 커스텀 방법</li>
							<li>문구 기여 가이드</li>
						</ul>
						<div className='mt-3'>
							<Button asChild variant='outline'>
								<a href='/docs/i18n'>i18n guide</a>
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}

function MigrationCTA() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<Card>
				<CardHeader>
					<CardTitle>v2 → v3 Migration</CardTitle>
					<CardDescription>브레이킹 체인지, 플러그인 API 변경, 예제 코드</CardDescription>
				</CardHeader>
				<CardContent>
					<div className='flex flex-wrap gap-3'>
						<Button asChild>
							<a href='/docs/migration-v3'>Migration guide</a>
						</Button>
						<Button asChild variant='outline'>
							<a href='/docs/changelog'>Changelog</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	);
}

function Community() {
	return (
		<section className='container mx-auto px-6 pb-20'>
			<h2 className='mb-4 text-xl font-semibold'>Community</h2>
			<div className='grid gap-6 md:grid-cols-4'>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center gap-2 text-base'>
							<Github className='h-4 w-4' /> GitHub
						</CardTitle>
					</CardHeader>
					<CardContent className='text-sm text-muted-foreground'>
						Stars <span className='font-medium'>XX,XXX+</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center gap-2 text-base'>
							<Download className='h-4 w-4' /> npm
						</CardTitle>
					</CardHeader>
					<CardContent className='text-sm text-muted-foreground'>
						주간 다운로드 <span className='font-medium'>XXXk</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center gap-2 text-base'>
							<Users className='h-4 w-4' /> Users
						</CardTitle>
					</CardHeader>
					<CardContent className='text-sm text-muted-foreground'>회사 로고 스와이퍼(선택)</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='flex items-center gap-2 text-base'>
							<Megaphone className='h-4 w-4' /> Contribute
						</CardTitle>
					</CardHeader>
					<CardContent className='text-sm text-muted-foreground'>버그 리포트, 문서 기여, 스폰서십 링크</CardContent>
				</Card>
			</div>
		</section>
	);
}

function FinalCTA() {
	return (
		<section className='container mx-auto px-6 pb-24'>
			<Card className='bg-gradient-to-r from-muted to-transparent'>
				<CardContent className='flex flex-col items-center gap-4 py-10 text-center'>
					<h3 className='text-2xl font-semibold'>지금 바로 프로젝트에 SunEditor v3를 도입하세요</h3>
					<p className='max-w-2xl text-sm text-muted-foreground'>Playground에서 기능을 시험하고, 설치 가이드를 따라 첫 에디터를 띄워 보세요. 문제가 있다면 GitHub 이슈로 알려주세요.</p>
					<div className='flex flex-wrap items-center justify-center gap-3'>
						<Button asChild className='group'>
							<a href='/playground'>
								Start in Playground
								<ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5' />
							</a>
						</Button>
						<Button asChild variant='outline'>
							<a href='/docs'>Read the Docs</a>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
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

function SmallStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
	return (
		<div className='flex items-center gap-3 rounded-lg border bg-background p-3'>
			<div className='rounded-md border p-2'>{icon}</div>
			<div className='text-sm'>
				<div className='text-muted-foreground'>{label}</div>
				<div className='font-medium'>{value}</div>
			</div>
		</div>
	);
}
