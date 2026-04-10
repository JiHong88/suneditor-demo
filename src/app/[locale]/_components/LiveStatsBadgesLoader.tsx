import { fetchMetricData } from "@/lib/siteMetrics";
import LiveStatsBadges from "./LiveStatsBadges";

export default async function LiveStatsBadgesLoader() {
	const metric = await fetchMetricData().catch(() => null);
	if (!metric) return null;
	return <LiveStatsBadges stats={metric} />;
}
