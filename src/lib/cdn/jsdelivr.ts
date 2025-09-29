export async function getLastDayDownloads() {
	const url = `https://data.jsdelivr.com/v1/package/npm/suneditor/stats/date`;
	const res = await fetch(url);
	if (!res.ok) {
		throw new Error(`jsDelivr API error: ${res.status} ${res.statusText}`);
	}
	const json = await res.json();

	const dates = json.dates || {};
	const keys = Object.keys(dates).sort();
	if (keys.length === 0) {
		return 0;
	}

	return Number(dates[keys.at(-1) as string]?.total ?? 0);
}
