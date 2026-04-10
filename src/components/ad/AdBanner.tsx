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
		<div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-center">
			<AdSlot
				slotId="getting-started-mid"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "728px", height: "90px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Feature Demo — square ad between catalog and CTA */
export function FeatureMidAd() {
	return (
		<div className="mx-auto w-full max-w-md px-6 py-4 flex items-center justify-center">
			<AdSlot
				slotId="feature-mid"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "300px", height: "250px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Docs API — vertical ad in sidebar area */
export function DocsSidebarAd() {
	return (
		<div className="w-full py-4 flex items-center justify-center">
			<AdSlot
				slotId="docs-sidebar"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "160px", height: "600px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Docs API — small rectangle ad below PageToc */
export function DocsTocAd() {
	return (
		<div className="w-full py-4">
			<AdSlot
				slotId="docs-toc"
				adFormat="rectangle"
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "192px", height: "160px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Playground — thin horizontal banner between editor and code panel */
export function PlaygroundMidBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-4 flex items-center justify-center">
			<AdSlot
				slotId="playground-mid"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "728px", height: "90px" }}
				className="flex items-center justify-center"
			/>
		</div>
	);
}

/** Footer banner — shown above footer on all pages */
export function FooterBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-3 flex items-center justify-center">
			<AdSlot
				slotId="footer-banner"
				adFormat=""
				fullWidthResponsive={false}
				adStyle={{ width: "100%", maxWidth: "970px", height: "90px" }}
				className="flex items-center justify-center"
			/>
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
