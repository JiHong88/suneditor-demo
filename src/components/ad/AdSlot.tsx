"use client";

import { getActiveAd } from "@/data/adConfig";
import GoogleAd from "./GoogleAd";
import CustomAd from "./CustomAd";

interface AdSlotProps {
	slotId: string;
	adFormat?: string;
	fullWidthResponsive?: boolean;
	adStyle?: React.CSSProperties;
	className?: string;
	fallback?: React.ReactNode;
}

export default function AdSlot({ slotId, adFormat, fullWidthResponsive, adStyle, className, fallback }: AdSlotProps) {
	const config = getActiveAd(slotId);

	if (!config) {
		return fallback ? <>{fallback}</> : null;
	}

	const wrapperClass = `ad-slot ad-slot--${slotId} w-full ${className ?? ""}`;

	switch (config.type) {
		case "google":
			return (
				<div className={wrapperClass}>
					<GoogleAd adSlot={config.googleAdSlot!} adFormat={adFormat} fullWidthResponsive={fullWidthResponsive} style={adStyle} />
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
