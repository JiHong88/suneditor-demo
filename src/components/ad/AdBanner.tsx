"use client";

import { useEffect, useState } from "react";
import AdSlot from "./AdSlot";

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
			{ready && <AdSlot slotId="builder-top" className="flex items-center justify-center" />}
		</div>
	);
}
