import { Suspense } from "react";
import CodeExamples from "@/components/common/CodeExamples";
import Hero from "./_components/Hero";
import InteractiveDemo from "./_components/InteractiveDemo";
import LiveStatsBadgesLoader from "./_components/LiveStatsBadgesLoader";
import FeatureHighlights from "./_components/FeatureHighlights";
import FinalCTA from "./_components/FinalCTA";
import { HomeHeroBelowBanner } from "@/components/ad/AdBanner";

export default function HomePage() {
	return (
		<div className='min-h-screen'>
			<Hero />
			<InteractiveDemo />
			<HomeHeroBelowBanner />
			<Suspense>
				<LiveStatsBadgesLoader />
			</Suspense>
			<FeatureHighlights />
			<CodeExamples />
			<FinalCTA />
		</div>
	);
}
