const BASE_URL = "https://raw.githubusercontent.com/JiHong88/SunEditor/master";
const REVALIDATE = 60 * 60; // 1시간

/** slug segments → GitHub 파일 경로 */
export const GUIDE_FILES: Record<string, string> = {
	"": "GUIDE.md",
	architecture: "ARCHITECTURE.md",
	"external-libraries": "guide/external-libraries.md",
	"custom-plugin": "guide/custom-plugin.md",
	"typedef-guide": "guide/typedef-guide.md",
	"commit-types": "guide/commit-types.md",
	"coding-rules": "prompts/coding-rules.md",
	"editing-rules": "prompts/editing-rules.md",
	testing: "guide/testing.md",
	"changes-guide": "prompts/changes-guide.md",
	"performance-guide": "prompts/performance-guide.md",
};

/** generateStaticParams 용 slug 배열 (빈 문자열 = index) */
export const GUIDE_SUB_SLUGS = Object.keys(GUIDE_FILES).filter((s) => s !== "");

export function resolveGuideSlug(segments: string[]): string | undefined {
	const key = segments.join("/");
	if (key in GUIDE_FILES) return key;
	return undefined;
}

async function fetchRaw(url: string): Promise<string | null> {
	const token = process.env.GITHUB_TOKEN;
	const headers: Record<string, string> = {
		"User-Agent": "suneditor-demo",
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(url, {
		headers,
		next: { revalidate: REVALIDATE },
	});

	if (!res.ok) {
		console.error(`[githubMarkdown] Failed to fetch ${url}: ${res.status}`);
		return null;
	}
	return res.text();
}

export async function fetchGitHubMarkdown(slugKey: string): Promise<string | null> {
	const filePath = GUIDE_FILES[slugKey];
	if (filePath === undefined) return null;
	return fetchRaw(`${BASE_URL}/${filePath}`);
}

/** `@suneditor/suneditor-react` repository — the `/react` page renders its README. */
export const REACT_WRAPPER_REPO = "https://github.com/suneditor/suneditor-react";
export const REACT_WRAPPER_NPM = "https://www.npmjs.com/package/@suneditor/suneditor-react";

