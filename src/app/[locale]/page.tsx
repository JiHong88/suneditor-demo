import { fetchMetricData } from "@/lib/siteMetrics";
import HomePage from "./HomePage";

export default async function Page() {
    const metric = await fetchMetricData().catch(() => null);

    return <HomePage metric={metric} />;
}
