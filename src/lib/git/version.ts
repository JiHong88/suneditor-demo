type GetVersionOpts = {
	owner?: string;
	repo?: string;
	token?: string;
	/** ISR */
	revalidateSeconds?: number;
};

const DEFAULTS = {
	owner: "JiHong88",
	repo: "SunEditor",
	revalidateSeconds: undefined, // 60 * 60, // 1시간
};

export async function getSunEditorVersion(opts: GetVersionOpts = {}) {
	const { owner, repo, token, revalidateSeconds } = { ...DEFAULTS, ...opts };

	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
	};
	if (token || process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${token ?? process.env.GITHUB_TOKEN}`;
	}

	const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
	const res = await fetch(url, {
		headers,
		next: { revalidate: revalidateSeconds },
	});

	if (!res.ok) throw new Error(`release_failed:${res.status}`);
	const json = (await res.json()) as { tag_name?: string; name?: string };
	const tag = (json.tag_name ?? json.name ?? "").trim();
	if (!tag) throw new Error("release_empty");

	return tag.replace(/^v/i, "");
}
