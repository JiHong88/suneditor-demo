"use client";

import { SiteMetricType } from "@/lib/siteMetrics";
// components
import CodeExamples from "@/components/common/CodeExamples";
import Hero from "./_components/Hero";
import InteractiveDemo from "./_components/InteractiveDemo";
import LiveStatsBadges from "./_components/LiveStatsBadges";
import FeatureHighlights from "./_components/FeatureHighlights";
import FinalCTA from "./_components/FinalCTA";

export default function HomePage({ metric }: { metric: SiteMetricType | null }) {
	return (
		<div className='min-h-screen'>
			<Hero />
			<InteractiveDemo />
			{metric && <LiveStatsBadges stats={metric} />}
			<FeatureHighlights />
			<CodeExamples />
			<FinalCTA />
		</div>
	);
}
