"use client";

import AdSlot from "./AdSlot";

/** Top leaderboard banner (728x90) - shown below microbar */
export function TopBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-2 bg-transparent">
			<AdSlot slotId="top-banner" className="flex items-center justify-center" />
		</div>
	);
}

/** Sidebar rectangle (300x250) - shown in docs/options sidebars */
export function SidebarAd() {
	return (
		<div className="mt-4">
			<AdSlot slotId="sidebar-rect" className="flex items-center justify-center" />
		</div>
	);
}

/** In-feed ad - shown between content sections */
export function InfeedAd() {
	return (
		<div className="mx-auto w-full max-w-4xl px-4 py-4">
			<AdSlot slotId="content-infeed" className="flex items-center justify-center" />
		</div>
	);
}

/** Footer banner (970x90) - shown above footer */
export function FooterBanner() {
	return (
		<div className="mx-auto w-full max-w-5xl px-4 py-3">
			<AdSlot slotId="footer-banner" className="flex items-center justify-center" />
		</div>
	);
}
