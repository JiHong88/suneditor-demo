"use client";

import { getActiveAd } from "@/data/adConfig";
import GoogleAd from "./GoogleAd";
import CustomAd from "./CustomAd";

interface AdSlotProps {
	slotId: string;
	className?: string;
	fallback?: React.ReactNode;
}

export default function AdSlot({ slotId, className, fallback }: AdSlotProps) {
	const config = getActiveAd(slotId);

	if (!config) {
		return fallback ? <>{fallback}</> : null;
	}

	const wrapperClass = `ad-slot ad-slot--${slotId} ${className ?? ""}`;

	switch (config.type) {
		case "google":
			return (
				<div className={wrapperClass}>
					<GoogleAd adSlot={config.googleAdSlot!} />
				</div>
			);
		case "custom":
			return (
				<div className={wrapperClass}>
					<CustomAd
						imageUrl={config.imageUrl!}
						linkUrl={config.linkUrl!}
						altText={config.altText}
					/>
				</div>
			);
		default:
			return fallback ? <>{fallback}</> : null;
	}
}
