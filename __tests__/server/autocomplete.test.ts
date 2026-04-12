import { describe, it, expect } from "vitest";
import { getAutocompleteSuggestions } from "../../server/service/autocomplete";

describe("getAutocompleteSuggestions", () => {
	it("빈 쿼리는 결과를 반환 (전체 중 limit만큼)", () => {
		const results = getAutocompleteSuggestions("", 10);
		expect(results.length).toBeLessThanOrEqual(10);
		expect(results.length).toBeGreaterThan(0);
	});

	it("limit 적용", () => {
		const results = getAutocompleteSuggestions("", 3);
		expect(results.length).toBeLessThanOrEqual(3);
	});

	it("결과 항목 구조 검증 (key, name, desc)", () => {
		const results = getAutocompleteSuggestions("", 1);
		expect(results[0]).toHaveProperty("key");
		expect(results[0]).toHaveProperty("name");
		expect(results[0]).toHaveProperty("desc");
		expect(typeof results[0].key).toBe("string");
		expect(typeof results[0].name).toBe("string");
	});

	it("prefix 필터 동작 — 매칭된 항목만 반환", () => {
		const all = getAutocompleteSuggestions("", 150);
		// 첫 번째 항목의 key 첫 2글자로 필터
		const prefix = all[0].key.slice(0, 2);
		const filtered = getAutocompleteSuggestions(prefix, 150);
		for (const item of filtered) {
			const matches = item.name.toLowerCase().includes(prefix.toLowerCase()) || item.key.toLowerCase().startsWith(prefix.toLowerCase());
			expect(matches).toBe(true);
		}
	});

	it("존재하지 않는 prefix는 빈 배열", () => {
		const results = getAutocompleteSuggestions("zzzzzzzzz999", 10);
		expect(results).toEqual([]);
	});

	it("대소문자 구분 없이 검색", () => {
		const all = getAutocompleteSuggestions("", 150);
		const prefix = all[0].key.slice(0, 2);
		const lower = getAutocompleteSuggestions(prefix.toLowerCase(), 150);
		const upper = getAutocompleteSuggestions(prefix.toUpperCase(), 150);
		expect(lower.length).toBe(upper.length);
	});
});
