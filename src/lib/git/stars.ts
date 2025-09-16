export type GitHubStarsOpts = {
	owner?: string;
	repo?: string;
	token?: string;
	revalidateSeconds?: number;
	noStore?: boolean;
};

const DEF = {
	owner: "JiHong88",
	repo: "SunEditor",
	revalidateSeconds: 60 * 60, // 1시간
};

export async function fetchGitHubStars(opts: GitHubStarsOpts = {}): Promise<number> {
	const { owner, repo, revalidateSeconds } = { ...DEF, ...opts };
	const token = opts.token ?? process.env.GITHUB_TOKEN;

	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
		"User-Agent": "suneditor-demo-stars",
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const url = `https://api.github.com/repos/${owner}/${repo}`;

	const fetchInit: RequestInit & { next?: { revalidate?: number } } = {
		headers,
	};

	if (opts.noStore) {
		(fetchInit as any).cache = "no-store";
	} else {
		fetchInit.next = { revalidate: revalidateSeconds };
	}

	const res = await fetch(url, fetchInit);
	if (!res.ok) {
		return 0;
	}

	const json = await res.json();
	return Number(json?.stargazers_count ?? 0);
}
