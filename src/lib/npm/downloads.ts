export async function fetchLastWeekDownloads(): Promise<number> {
	const url = `https://api.npmjs.org/downloads/point/last-week/suneditor`;
	const res = await fetch(url, { next: { revalidate: 3600 } });
	if (!res.ok) {
		return 0;
	}
	const json = await res.json();
	return Number(json?.downloads ?? 0);
}

export async function fetchLastYearDownloads(): Promise<number> {
	const url = `https://api.npmjs.org/downloads/point/last-year/suneditor`;

	const res = await fetch(url, { next: { revalidate: 3600 } });
	if (!res.ok) {
		return 0;
	}
	const json = await res.json();
	return Number(json?.downloads ?? 0);
}
