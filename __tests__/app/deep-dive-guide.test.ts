import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { GUIDE_FILES, GUIDE_SUB_SLUGS, resolveGuideSlug } from "../../src/lib/git/githubMarkdown";

/**
 * deep-dive/guide/[...slug] 회귀 방지 테스트
 *
 * 배경: 이 페이지에 `generateStaticParams`가 있으면 Next.js가 정적(SSG)으로
 * 렌더하려 시도한다. 이 앱은 어디에서도 next-intl의 `setRequestLocale`을
 * 호출하지 않기 때문에, 정적 렌더 도중 next-intl이 로케일 해석을 위해
 * 동적 API(`headers()`)를 호출 -> `DYNAMIC_SERVER_USAGE` 에러 발생 ->
 * 기본 로케일(en)을 제외한 모든 로케일(ko, ja, ar ...)에서 500.
 *
 * 나머지 페이지처럼 동적(ƒ) 렌더를 유지해야 한다.
 * generateStaticParams를 다시 추가하면 이 테스트가 실패한다.
 */

const slugPagePath = path.resolve(__dirname, "../../src/app/[locale]/deep-dive/guide/[...slug]/page.tsx");

describe("deep-dive/guide 500 회귀 방지", () => {
	it("[...slug] 페이지는 generateStaticParams를 export하지 않는다 (정적 렌더 + next-intl 충돌 방지)", () => {
		const src = readFileSync(slugPagePath, "utf8");
		expect(src).not.toMatch(/generateStaticParams/);
	});

	it("정적 렌더를 강제하는 export가 없다 (동적 렌더 유지)", () => {
		const src = readFileSync(slugPagePath, "utf8");
		expect(src).not.toMatch(/export\s+const\s+dynamic\s*=\s*["']force-static["']/);
	});
});

describe("guide slug -> GitHub 파일 매핑", () => {
	it("모든 sub-slug가 GUIDE_FILES로 resolve 된다", () => {
		for (const slug of GUIDE_SUB_SLUGS) {
			const resolved = resolveGuideSlug(slug.split("/"));
			expect(resolved).toBe(slug);
			expect(GUIDE_FILES[slug]).toBeTruthy();
		}
	});

	it("존재하지 않는 slug는 undefined를 반환한다", () => {
		expect(resolveGuideSlug(["does-not-exist"])).toBeUndefined();
	});
});
