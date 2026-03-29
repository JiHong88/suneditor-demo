import { describe, it, expect } from "vitest";
import { FEATURE_CATEGORIES } from "../../src/data/snippets/featureDemoCategories";
import { FEATURE_PLAYGROUND_LINKS } from "../../src/app/[locale]/feature-demo/_lib/featurePlaygroundLinks";
import en from "../../src/messages/en.json";
import ko from "../../src/messages/ko.json";
import ar from "../../src/messages/ar.json";

/**
 * 데이터 무결성 테스트
 *
 * 기능 추가/삭제 시 여러 파일을 동시에 수정해야 하므로,
 * 누락 없이 모든 곳에 반영되었는지 자동 검증.
 */

/** 모든 카테고리의 feature 키를 flat하게 수집 */
const allFeatureKeys = FEATURE_CATEGORIES.flatMap((cat) => cat.features);

describe("Feature 카테고리 정의 검증", () => {
	it("카테고리가 1개 이상 존재", () => {
		expect(FEATURE_CATEGORIES.length).toBeGreaterThan(0);
	});

	it("모든 카테고리에 color와 features 존재", () => {
		for (const cat of FEATURE_CATEGORIES) {
			expect(cat.key).toBeTruthy();
			expect(cat.color).toBeTruthy();
			expect(cat.features.length).toBeGreaterThan(0);
		}
	});

	it("feature 키 중복 없음", () => {
		const set = new Set(allFeatureKeys);
		expect(set.size).toBe(allFeatureKeys.length);
	});
});

describe("Feature → Playground 링크 매핑 완전성", () => {
	it("모든 feature 키에 대한 playground 링크가 존재", () => {
		const linkKeys = Object.keys(FEATURE_PLAYGROUND_LINKS);
		const missing = allFeatureKeys.filter((key) => !linkKeys.includes(key));
		expect(missing).toEqual([]);
	});

	it("모든 링크에 query와 demoHtml 존재", () => {
		for (const [key, link] of Object.entries(FEATURE_PLAYGROUND_LINKS)) {
			expect(link.query, `${key}: query 누락`).toBeTruthy();
			expect(link.demoHtml, `${key}: demoHtml 누락`).toBeTruthy();
		}
	});
});

describe("i18n 키 완전성", () => {
	// 각 feature 키에 대해 "{key}"와 "{key}Desc" 메시지가 있어야 함
	const featureDemo = (en as Record<string, Record<string, unknown>>).FeatureDemo as Record<string, Record<string, string>>;
	const featureKeys = featureDemo?.features;

	it("en.json에 FeatureDemo.features 섹션 존재", () => {
		expect(featureKeys).toBeDefined();
	});

	for (const key of allFeatureKeys) {
		it(`en.json — "${key}" 이름 키 존재`, () => {
			expect(featureKeys?.[key], `en.json: FeatureDemo.features.${key} 누락`).toBeTruthy();
		});

		it(`en.json — "${key}Desc" 설명 키 존재`, () => {
			expect(featureKeys?.[`${key}Desc`], `en.json: FeatureDemo.features.${key}Desc 누락`).toBeTruthy();
		});
	}

	it("ko.json에도 모든 feature 키 존재", () => {
		const koFeatures = (ko as Record<string, Record<string, unknown>>).FeatureDemo as Record<string, Record<string, string>>;
		const koKeys = koFeatures?.features;
		expect(koKeys).toBeDefined();
		const missing = allFeatureKeys.filter((key) => !koKeys?.[key] || !koKeys?.[`${key}Desc`]);
		expect(missing, `ko.json 누락 키: ${missing.join(", ")}`).toEqual([]);
	});

	it("ar.json에도 모든 feature 키 존재", () => {
		const arFeatures = (ar as Record<string, Record<string, unknown>>).FeatureDemo as Record<string, Record<string, string>>;
		const arKeys = arFeatures?.features;
		expect(arKeys).toBeDefined();
		const missing = allFeatureKeys.filter((key) => !arKeys?.[key] || !arKeys?.[`${key}Desc`]);
		expect(missing, `ar.json 누락 키: ${missing.join(", ")}`).toEqual([]);
	});
});

describe("카테고리 정의 일관성", () => {
	it("각 카테고리에 고유한 key", () => {
		const keys = FEATURE_CATEGORIES.map((c) => c.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	it("카테고리 color 클래스가 text- 로 시작", () => {
		for (const cat of FEATURE_CATEGORIES) {
			expect(cat.color).toMatch(/^text-/);
		}
	});
});
