const BASE_URL = "https://raw.githubusercontent.com/JiHong88/SunEditor/master";
const REVALIDATE = 60 * 60; // 1시간

/** slug segments → GitHub 파일 경로 */
export const GUIDE_FILES: Record<string, string> = {
	"": "GUIDE.md",
	architecture: "ARCHITECTURE.md",
	"external-libraries": "guide/external-libraries.md",
	"changes-guide": "guide/changes-guide.md",
	"custom-plugin": "guide/custom-plugin.md",
	"typedef-guide": "guide/typedef-guide.md",
};

/** generateStaticParams 용 slug 배열 (빈 문자열 = index) */
export const GUIDE_SUB_SLUGS = Object.keys(GUIDE_FILES).filter((s) => s !== "");

export function resolveGuideSlug(segments: string[]): string | undefined {
	const key = segments.join("/");
	if (key in GUIDE_FILES) return key;
	return undefined;
}

export async function fetchGitHubMarkdown(slugKey: string): Promise<string | null> {
	const filePath = GUIDE_FILES[slugKey];
	if (filePath === undefined) return null;

	const token = process.env.GITHUB_TOKEN;
	const headers: Record<string, string> = {
		"User-Agent": "suneditor-demo",
	};
	if (token) headers.Authorization = `Bearer ${token}`;

	const res = await fetch(`${BASE_URL}/${filePath}`, {
		headers,
		next: { revalidate: REVALIDATE },
	});

	if (!res.ok) return null;
	return res.text();
}
