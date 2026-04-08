"use client";

import { useEffect, useState } from "react";
import AdSlot from "./AdSlot";

/** Home page — thin horizontal banner above CodeExamples */
export function HomeHeroBelowBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-center">
			<AdSlot
				slotId="home-hero-below"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "728px", height: "90px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Getting Started — horizontal banner between steps */
export function GettingStartedMidBanner() {
	return (
		<div className="mx-auto w-full max-w-6xl px-6 py-4">
			<AdSlot slotId="getting-started-mid" className="flex items-center justify-center" />
		</div>
	);
}

/** Feature Demo — square ad between catalog and CTA */
export function FeatureMidAd() {
	return (
		<div className="mx-auto w-full max-w-md px-6 py-4">
			<AdSlot slotId="feature-mid" adFormat="rectangle" fullWidthResponsive={false} className="flex items-center justify-center" />
		</div>
	);
}

/** Docs API — vertical ad in sidebar area */
export function DocsSidebarAd() {
	return (
		<div className="w-full py-4">
			<AdSlot slotId="docs-sidebar" adFormat="vertical" fullWidthResponsive={false} />
		</div>
	);
}

/** Footer banner — shown above footer on all pages */
export function FooterBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-3">
			<AdSlot slotId="footer-banner" className="flex items-center justify-center" />
		</div>
	);
}

/** Builder top banner — delays render until Sheet animation completes */
export function BuilderTopBanner() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		// Sheet open animation is 500ms, wait for it to finish
		const timer = setTimeout(() => setReady(true), 600);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="w-full h-full px-2 flex items-center justify-center">
			{ready && (
				<AdSlot
					slotId="builder-top"
					adFormat=""
					fullWidthResponsive={false}
					adStyle={{ width: "100%", maxWidth: "728px", height: "90px" }}
					className="flex items-center justify-center"
				/>
			)}
		</div>
	);
}
