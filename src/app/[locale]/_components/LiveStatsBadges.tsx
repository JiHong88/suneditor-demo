"use client";

import { Github, GitFork, Calendar, TrendingUp, Globe } from "lucide-react";
import { SiteMetricType } from "@/lib/siteMetrics";
import { useTranslations } from "next-intl";

export default function LiveStatsBadges({ stats }: { stats: SiteMetricType }) {
	const t = useTranslations("Home.LiveStatsBadges");
	const statItems = [
		{ icon: <Github className='h-5 w-5' />, label: t("githubStars"), value: stats.githubStars },
		{ icon: <GitFork className='h-5 w-5' />, label: t("gitHubForks"), value: stats.githubForks },
		{ icon: <TrendingUp className='h-5 w-5' />, label: t("npmWeeklyDownloads"), value: stats.weeklyNPMDownloads },
		{ icon: <Calendar className='h-5 w-5' />, label: t("npmAnnualDownloads"), value: stats.yearNPMDownloads },
		{ icon: <Globe className='h-5 w-5' />, label: t("dailyCDNHits"), value: stats.CDNHitsPerDay },
	];

	return (
		<section className='container mx-auto px-4 py-12 md:py-16'>
			<div className='flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-20'>
				{statItems.map((item) => (
					<div key={item.label} className='text-center'>
						<p className='text-3xl font-bold bg-[linear-gradient(90deg,var(--color-se-active)_0%,#e87461_50%,#c084fc_100%)] bg-clip-text text-transparent md:text-4xl'>
							{item.value}
						</p>
						<p className='mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-foreground'>
							<span className='text-muted-foreground'>{item.icon}</span>
							{item.label}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
