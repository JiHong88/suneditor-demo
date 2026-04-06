"use client";

import { useEffect, useRef, useState } from "react";
import AdSlot from "./AdSlot";

/** Footer banner — shown above footer on all pages */
export function FooterBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-3">
			<AdSlot slotId="footer-banner" className="flex items-center justify-center" />
		</div>
	);
}

/** Builder top banner — waits until container actually has width before rendering ad */
export function BuilderTopBanner() {
	const ref = useRef<HTMLDivElement>(null);
	const [ready, setReady] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		// Check if already visible
		if (el.offsetWidth > 0) {
			setReady(true);
			return;
		}

		// Wait for visibility via ResizeObserver
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				if (entry.contentRect.width > 0) {
					setReady(true);
					ro.disconnect();
				}
			}
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	return (
		<div ref={ref} className="w-full px-2 py-1">
			{ready && <AdSlot slotId="builder-top" className="flex items-center justify-center" />}
		</div>
	);
}
