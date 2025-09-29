import { fetchGithubStats } from "./git/githubStats";
import { fetchLastWeekDownloads, fetchLastYearDownloads } from "./npm/downloads";
import { getLastDayDownloads } from "./cdn/jsdelivr";

export type SiteMetricType = {
	githubStars: string;
	githubForks: string;
	yearNPMDownloads: string;
	weeklyNPMDownloads: string;
	CDNHitsPerDay: string;
};

export async function fetchMetricData(): Promise<SiteMetricType> {
	const [github, npmWeek, npmYear, delivrDay] = await Promise.all([fetchGithubStats(), fetchLastWeekDownloads(), fetchLastYearDownloads(), getLastDayDownloads()]);

	const formatter = new Intl.NumberFormat("en-US", {
		notation: "compact",
		maximumFractionDigits: 1,
	});

	return {
		githubStars: formatter.format(github.stars),
		githubForks: formatter.format(github.forks),
		yearNPMDownloads: formatter.format(npmYear),
		weeklyNPMDownloads: formatter.format(npmWeek),
		CDNHitsPerDay: formatter.format(delivrDay),
	};
}
