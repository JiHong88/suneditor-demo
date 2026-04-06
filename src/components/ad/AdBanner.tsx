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

/** Builder top banner — delays render until container has width (Sheet open) */
export function BuilderTopBanner() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const id = requestAnimationFrame(() => setReady(true));
		return () => cancelAnimationFrame(id);
	}, []);

	if (!ready) return <div className="w-full px-2 py-1" />;

	return (
		<div className="w-full px-2 py-1">
			<AdSlot slotId="builder-top" className="flex items-center justify-center" />
		</div>
	);
}
