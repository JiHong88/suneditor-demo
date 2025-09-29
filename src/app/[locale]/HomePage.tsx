"use client";

import { SiteMetricType } from "@/lib/siteMetrics";
// components
import CodeExamples from "@/components/common/CodeExamples";
import Hero from "./_components/Hero";
import InteractiveDemo from "./_components/InteractiveDemo";
import FeatureGrid from "./_components/FeatureGrid";
import LiveStatsBadges from "./_components/LiveStatsBadges";
import FinalCTA from "./_components/FinalCTA";

export default function HomePage({ metric }: { metric: SiteMetricType }) {
	return (
		<div className='min-h-screen bg-gradient-to-b from-background via-background to-muted/20'>
			<Hero />
			<InteractiveDemo />
			<FeatureGrid />
			{metric && <LiveStatsBadges stats={metric} />}
			<CodeExamples />
			<FinalCTA />
		</div>
	);
}
