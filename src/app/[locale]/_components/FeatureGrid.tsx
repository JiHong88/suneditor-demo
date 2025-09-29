"use client";

import { Rocket, Table, Layout, FileText, Languages, FunctionSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function FeatureGrid() {
	const t = useTranslations("Home.FeatureGrid");
	const features = [
		{
			icon: <Rocket className='h-6 w-6' />,
			title: t("Architecture.title"),
			desc: t("Architecture.desc"),
			className: "bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400",
		},
		{
			icon: <Table className='h-6 w-6' />,
			title: t("Table.title"),
			desc: t("Table.desc"),
			className: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400",
		},
		{
			icon: <Layout className='h-6 w-6' />,
			title: t("DocumentLayout.title"),
			desc: t("DocumentLayout.desc"),
			className: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400",
		},
		{
			icon: <FileText className='h-6 w-6' />,
			title: t("PDF.title"),
			desc: t("PDF.desc"),
			className: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400",
		},
		{
			icon: <Languages className='h-6 w-6' />,
			title: t("RTL.title"),
			desc: t("RTL.desc"),
			className: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400",
		},
		{
			icon: <FunctionSquare className='h-6 w-6' />,
			title: t("Math.title"),
			desc: t("Math.desc"),
			className: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400",
		},
	];

	return (
		<section className='bg-muted/40 py-20'>
			<div className='container mx-auto px-6'>
				<div className='mx-auto max-w-2xl text-center'>
					<h2 className='text-3xl font-bold tracking-tight md:text-4xl'>{t("title")}</h2>
					<p className='mt-4 text-lg text-muted-foreground'>{t("desc")}</p>
				</div>
				<div className='mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{features.map((f) => (
						<Card key={f.title} className='bg-background/80 backdrop-blur-sm'>
							<CardHeader>
								<div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg ${f.className}`}>{f.icon}</div>
								<CardTitle>{f.title}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className='text-muted-foreground'>{f.desc}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
