const DEF = {
	owner: "JiHong88",
	repo: "SunEditor",
	revalidateSeconds: 60 * 60, // 1시간
};

export async function fetchGithubStats(): Promise<any> {
	const { owner, repo, revalidateSeconds } = DEF;
	const token = process.env.GITHUB_TOKEN;

	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "suneditor-demo-stars",
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const fetchInit: RequestInit & { next?: { revalidate?: number } } = {
		headers,
		next: { revalidate: revalidateSeconds },
	};

	const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, fetchInit);
	if (!res.ok) {
		return {};
	}
	const json = await res.json();

	return {
		stars: Number(json?.stargazers_count ?? 0),
		forks: Number(json?.forks_count ?? 0),
	};
}
