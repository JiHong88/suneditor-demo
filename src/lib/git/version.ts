type GetVersionOpts = {
	owner?: string;
	repo?: string;
	prefer?: "release" | "package";
	ref?: string;
	token?: string;
	/** ISR */
	revalidateSeconds?: number;
};

const DEFAULTS = {
	owner: "JiHong88",
	repo: "SunEditor",
	prefer: "release" as const,
	ref: "version/3",
	revalidateSeconds: undefined, // 60 * 60, // 1시간
};

export async function getSunEditorVersion(opts: GetVersionOpts = {}) {
	const { owner, repo, prefer, ref, token, revalidateSeconds } = { ...DEFAULTS, ...opts };

	const headers: Record<string, string> = {
		Accept: "application/vnd.github+json",
	};
	if (token || process.env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${token ?? process.env.GITHUB_TOKEN}`;
	}

	const tryRelease = async () => {
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
	};

	const tryPackageJson = async () => {
		const url = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/package.json`;
		const res = await fetch(url, {
			next: { revalidate: revalidateSeconds },
		});

		if (!res.ok) throw new Error(`pkg_failed:${res.status}`);
		const json = (await res.json()) as { version?: string };
		const v = (json.version ?? "").trim();
		if (!v) throw new Error("pkg_empty");

		return v;
	};

	// release, 실패 시 package로 재시도
	if (prefer === "release") {
		try {
			return await tryRelease();
		} catch {
			return await tryPackageJson();
		}
	} else {
		try {
			return await tryPackageJson();
		} catch {
			return await tryRelease();
		}
	}
}
