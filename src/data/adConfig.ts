export type AdSize = "banner" | "rectangle" | "leaderboard" | "responsive";

export type AdSlotConfig = {
	slotId: string;
	type: "google" | "custom" | "empty";
	// Google AdSense
	googleAdSlot?: string;
	// Custom ad
	imageUrl?: string;
	linkUrl?: string;
	altText?: string;
	// Common
	startDate?: string;
	endDate?: string;
};

/**
 * Ad slot definitions.
 * Ordered by priority — first matching active config wins.
 * When type is "empty", the slot renders nothing (placeholder for future ads).
 */
export const AD_SLOTS: Record<string, AdSlotConfig[]> = {
	"footer-banner": [{ slotId: "footer-banner", type: "google", googleAdSlot: "auto" }],
	"builder-top": [{ slotId: "builder-top", type: "google", googleAdSlot: "auto" }],
};

/**
 * Google AdSense client ID.
 * Set to empty string to disable AdSense globally.
 */
export const ADSENSE_CLIENT_ID = "ca-pub-6933506635175446";

/** Get the active config for a slot (first non-expired entry) */
export function getActiveAd(slotId: string): AdSlotConfig | null {
	const configs = AD_SLOTS[slotId];
	if (!configs?.length) return null;

	const now = new Date();
	for (const config of configs) {
		if (config.startDate && new Date(config.startDate) > now) continue;
		if (config.endDate && new Date(config.endDate) < now) continue;
		if (config.type === "empty") return null;
		return config;
	}
	return null;
}
