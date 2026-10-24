import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import path from "path";
import { GUIDE_FILES, GUIDE_SUB_SLUGS, resolveGuideSlug } from "../../src/lib/git/githubMarkdown";

/**
 * deep-dive/guide/[...slug] 회귀 방지 테스트
 *
 * 배경: 예전에는 setRequestLocale을 어디에서도 호출하지 않아서, 이 페이지를 정적(SSG)으로
 * 렌더하면 next-intl이 로케일 해석을 위해 `headers()`를 호출 -> `DYNAMIC_SERVER_USAGE` ->
 * en을 제외한 모든 로케일에서 500이 났다. 그래서 generateStaticParams를 빼고 동적 렌더로 유지했었다.
 *
 * 지금은 [locale]/layout.tsx가 setRequestLocale을 호출하므로 정적 렌더가 안전하다
 * (`__tests__/app/static-rendering.test.ts`가 그 조건을 지킨다). 이 페이지도 모든 slug를 미리 렌더한다.
 */

const slugPagePath = path.resolve(__dirname, "../../src/app/[locale]/deep-dive/guide/[...slug]/page.tsx");
const localeLayoutPath = path.resolve(__dirname, "../../src/app/[locale]/layout.tsx");

describe("deep-dive/guide 500 회귀 방지", () => {
	it("정적 렌더 전제: [locale] 레이아웃이 setRequestLocale을 호출한다", () => {
		expect(readFileSync(localeLayoutPath, "utf8")).toMatch(/setRequestLocale\(/);
	});

	it("[...slug] 페이지는 GUIDE_SUB_SLUGS 전체를 generateStaticParams로 내보낸다", () => {
		const src = readFileSync(slugPagePath, "utf8");
		expect(src).toMatch(/export function generateStaticParams/);
		expect(src).toMatch(/GUIDE_SUB_SLUGS/);
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
