import { describe, it, expect } from "vitest";
import en from "../../src/messages/en.json";
import { PLUGIN_DISPLAY_GROUPS, PLUGIN_DISPLAY_TYPES, pluginAnchorId, pluginDisplayTypeOf } from "../../src/data/pluginGuideGroups";
import { FEATURE_CATEGORIES, featureAnchorId, featureCategoryOf } from "../../src/data/snippets/featureDemoCategories";

/**
 * 사이트 검색(⌘K)이 링크하는 탭 안 항목 앵커 테스트
 * `/plugin-guide#plugin-<name>`, `/feature-demo#feature-<key>` → 해당 탭을 열 수 있어야 하고, 검색에 쓸 문구가 있어야 한다.
 */

describe("plugin guide anchors", () => {
	it.each(PLUGIN_DISPLAY_TYPES.flatMap((type) => PLUGIN_DISPLAY_GROUPS[type].map((p) => [p.name, type] as const)))("%s → %s tab", (name, type) => {
		expect(pluginDisplayTypeOf(pluginAnchorId(name))).toBe(type);
		expect((en.PluginGuide.plugins as Record<string, string>)[name]).toBeTruthy();
	});

	it("ignores hashes that are not plugin anchors", () => {
		expect(pluginDisplayTypeOf("custom-plugin")).toBeUndefined();
		expect(pluginDisplayTypeOf("plugin-unknown")).toBeUndefined();
	});
});

describe("feature demo anchors", () => {
	it.each(FEATURE_CATEGORIES.flatMap((cat) => cat.features.map((key) => [key, cat.key] as const)))("%s → %s tab", (key, cat) => {
		expect(featureCategoryOf(featureAnchorId(key))).toBe(cat);
		const features = en.FeatureDemo.features as Record<string, string>;
		expect(features[key]).toBeTruthy();
		expect(features[`${key}Desc`]).toBeTruthy();
	});

	it("ignores hashes that are not feature anchors", () => {
		expect(featureCategoryOf("media")).toBeUndefined();
	});
});
