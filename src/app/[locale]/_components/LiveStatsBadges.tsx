"use client";

import { Github, GitFork, Calendar, TrendingUp, Globe } from "lucide-react";
import { SiteMetricType } from "@/lib/siteMetrics";
import { useTranslations } from "next-intl";

export default function LiveStatsBadges({ stats }: { stats: SiteMetricType }) {
	const t = useTranslations("Home.LiveStatsBadges");
	const statItems = [
		{
			icon: <Github className='h-6 w-6' />,
			label: t("githubStars"),
			value: stats.githubStars,
			iconColor: "text-slate-600 dark:text-slate-400",
			borderColor: "border-slate-200 dark:border-slate-700",
		},
		{
			icon: <GitFork className='h-6 w-6' />,
			label: t("gitHubForks"),
			value: stats.githubForks,
			iconColor: "text-slate-600 dark:text-slate-400",
			borderColor: "border-slate-200 dark:border-slate-700",
		},
		{
			icon: <TrendingUp className='h-6 w-6' />,
			label: t("npmWeeklyDownloads"),
			value: stats.weeklyNPMDownloads,
			iconColor: "text-red-500",
			borderColor: "border-red-200 dark:border-red-500/20",
		},
		{
			icon: <Calendar className='h-6 w-6' />,
			label: t("npmAnnualDownloads"),
			value: stats.yearNPMDownloads,
			iconColor: "text-red-500/80",
			borderColor: "border-red-200 dark:border-red-500/20",
		},
		{
			icon: <Globe className='h-6 w-6' />,
			label: t("dailyCDNHits"),
			value: stats.CDNHitsPerDay,
			iconColor: "text-sky-500",
			borderColor: "border-sky-200 dark:border-sky-500/20",
		},
	];

	return (
		<section className='container mx-auto px-6 pb-20'>
			<div className='text-center mb-12'>
				<h2 className='text-3xl font-bold tracking-tight text-foreground sm:text-4xl'>{t("title")}</h2>
			</div>
			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
				{statItems.map((item) => (
					<div key={item.label} className={`flex items-center gap-4 rounded-xl bg-muted/50 p-6 border-2 transition-all hover:-translate-y-1 ${item.borderColor}`}>
						<span className={item.iconColor}>{item.icon}</span>
						<div className='flex-1'>
							<p className='text-2xl font-bold text-foreground'>{item.value}</p>
							<p className='text-sm text-muted-foreground'>{item.label}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
