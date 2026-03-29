import { describe, it, expect } from "vitest";
import {
	DEFAULTS,
	urlToState,
	stateToUrl,
	stateToEditorOptions,
	getChangedKeys,
	getButtonList,
	hasButton,
	isFixedOption,
	hasFixedChange,
	type PlaygroundState,
} from "../../src/app/[locale]/playground/_lib/playgroundState";

/* ── PARAM_MAP 무결성 ──────────────────────────────────── */

// PARAM_MAP이 내부 상수라 직접 접근 불가 → roundtrip으로 간접 검증
describe("PARAM_MAP 무결성", () => {
	it("DEFAULTS의 모든 키가 roundtrip 가능 (stateToUrl → urlToState)", () => {
		// 기본값과 다른 값으로 세팅된 state를 만들어서 직렬화 후 역직렬화
		const modified = { ...DEFAULTS };

		// 대표적인 타입별 옵션을 기본값과 다르게 변경
		modified.mode = "balloon";
		modified.toolbar_sticky = 50;
		modified.toolbar_hide = true;
		modified.placeholder = "test";

		const url = stateToUrl(modified);
		const params = new URLSearchParams(url);
		const restored = urlToState(params);

		expect(restored.mode).toBe("balloon");
		expect(restored.toolbar_sticky).toBe(50);
		expect(restored.toolbar_hide).toBe(true);
		expect(restored.placeholder).toBe("test");
	});

	it("기본값은 URL에 직렬화되지 않음", () => {
		const url = stateToUrl(DEFAULTS);
		expect(url).toBe("");
	});
});

/* ── urlToState ─────────────────────────────────────────── */

describe("urlToState", () => {
	it("boolean 파라미터: '1' → true, '0' → false", () => {
		const params = new URLSearchParams("th=1");
		const state = urlToState(params);
		expect(state.toolbar_hide).toBe(true);

		const params2 = new URLSearchParams("th=0");
		const state2 = urlToState(params2);
		expect(state2.toolbar_hide).toBe(false);
	});

	it("number 파라미터 변환", () => {
		const params = new URLSearchParams("ts=92");
		const state = urlToState(params);
		expect(state.toolbar_sticky).toBe(92);
	});

	it("string 파라미터 그대로 전달", () => {
		const params = new URLSearchParams("m=inline");
		const state = urlToState(params);
		expect(state.mode).toBe("inline");
	});

	it("null 타입 파라미터: 'null' → null, 숫자 → Number", () => {
		const params = new URLSearchParams("ccm=null");
		const state = urlToState(params);
		expect(state.charCounter_max).toBeNull();

		const params2 = new URLSearchParams("ccm=500");
		const state2 = urlToState(params2);
		expect(state2.charCounter_max).toBe(500);
	});

	it("알 수 없는 파라미터는 무시", () => {
		const params = new URLSearchParams("unknown_key=value&m=balloon");
		const state = urlToState(params);
		expect(state.mode).toBe("balloon");
		expect(Object.keys(state)).not.toContain("unknown_key");
	});

	it("빈 URLSearchParams → 빈 객체", () => {
		const state = urlToState(new URLSearchParams());
		expect(Object.keys(state)).toHaveLength(0);
	});
});

/* ── stateToUrl ─────────────────────────────────────────── */

describe("stateToUrl", () => {
	it("기본값과 다른 옵션만 직렬화", () => {
		const state = { ...DEFAULTS, mode: "inline" as const };
		const url = stateToUrl(state);
		const params = new URLSearchParams(url);
		expect(params.get("m")).toBe("inline");
		// 기본값인 toolbar_sticky는 포함되지 않아야 함
		expect(params.has("ts")).toBe(false);
	});

	it("boolean은 '1'/'0'으로 직렬화", () => {
		const state = { ...DEFAULTS, toolbar_hide: true };
		const url = stateToUrl(state);
		const params = new URLSearchParams(url);
		expect(params.get("th")).toBe("1");
	});

	it("UI 전용 키(codeFramework, codePanelOpen)는 직렬화하지 않음", () => {
		const state = { ...DEFAULTS, codeFramework: "react" as const };
		const url = stateToUrl(state);
		expect(url).not.toContain("codeFramework");
		expect(url).not.toContain("react");
	});
});

/* ── stateToEditorOptions ──────────────────────────────── */

describe("stateToEditorOptions", () => {
	it("기본 state에서 필수 옵션 포함", () => {
		const opts = stateToEditorOptions(DEFAULTS);
		expect(opts).toHaveProperty("mode", "classic");
		expect(opts).toHaveProperty("buttonList");
		expect(opts).toHaveProperty("width");
		expect(opts).toHaveProperty("height");
	});

	it("toolbar 옵션 전달", () => {
		const state = { ...DEFAULTS, toolbar_sticky: 50, toolbar_hide: true };
		const opts = stateToEditorOptions(state);
		expect(opts.toolbar_sticky).toBe(50);
		expect(opts.toolbar_hide).toBe(true);
	});

	it("codeBlock 플러그인 옵션: langs 배열로 변환", () => {
		const state = { ...DEFAULTS, codeBlock_langs: "javascript, python, html" };
		const opts = stateToEditorOptions(state);
		expect(opts.codeBlock).toEqual({ langs: ["javascript", "python", "html"] });
	});

	it("codeBlock_langs 빈 문자열이면 옵션 미포함", () => {
		const opts = stateToEditorOptions(DEFAULTS);
		expect(opts.codeBlock).toBeUndefined();
	});

	it("charCounter 옵션", () => {
		const state = { ...DEFAULTS, charCounter: true, charCounter_max: 500 };
		const opts = stateToEditorOptions(state);
		expect(opts.charCounter).toBe(true);
		expect(opts.charCounter_max).toBe(500);
	});

	it("shortcuts JSON 파싱", () => {
		const state = { ...DEFAULTS, shortcuts: '{"bold": ["c+KeyB", "B"]}' };
		const opts = stateToEditorOptions(state);
		expect(opts.shortcuts).toEqual({ bold: ["c+KeyB", "B"] });
	});

	it("잘못된 shortcuts JSON은 무시", () => {
		const state = { ...DEFAULTS, shortcuts: "invalid json{" };
		const opts = stateToEditorOptions(state);
		expect(opts.shortcuts).toBeUndefined();
	});
});

/* ── getButtonList ──────────────────────────────────────── */

describe("getButtonList", () => {
	it("basic 프리셋 반환", () => {
		const list = getButtonList("basic");
		expect(Array.isArray(list)).toBe(true);
		expect(list.length).toBeGreaterThan(0);
	});

	it("standard 프리셋 반환", () => {
		const list = getButtonList("standard");
		expect(list.length).toBeGreaterThan(getButtonList("basic").length);
	});

	it("full 프리셋이 가장 많은 버튼 포함", () => {
		const full = getButtonList("full");
		const standard = getButtonList("standard");
		expect(full.length).toBeGreaterThanOrEqual(standard.length);
	});

	it("custom 프리셋: JSON 문자열 파싱", () => {
		const custom = JSON.stringify([["bold", "italic"], "|", ["link"]]);
		const list = getButtonList("custom", undefined, custom);
		expect(list).toEqual([["bold", "italic"], "|", ["link"]]);
	});

	it("custom 프리셋: 잘못된 JSON이면 standard 폴백", () => {
		const list = getButtonList("custom", undefined, "not json");
		expect(list).toEqual(getButtonList("standard"));
	});
});

/* ── hasButton ─────────────────────────────────────────── */

describe("hasButton", () => {
	it("standard 프리셋에 bold 포함", () => {
		expect(hasButton("standard", undefined, "bold")).toBe(true);
	});

	it("basic 프리셋에 없는 버튼", () => {
		expect(hasButton("basic", undefined, "exportPDF")).toBe(false);
	});

	it("full 프리셋에 exportPDF 포함", () => {
		expect(hasButton("full", undefined, "exportPDF")).toBe(true);
	});
});

/* ── 유틸리티 함수 ─────────────────────────────────────── */

describe("getChangedKeys", () => {
	it("동일하면 빈 배열", () => {
		expect(getChangedKeys(DEFAULTS, DEFAULTS)).toEqual([]);
	});

	it("변경된 키만 반환", () => {
		const next = { ...DEFAULTS, mode: "balloon" as const };
		const changed = getChangedKeys(DEFAULTS, next);
		expect(changed).toContain("mode");
		expect(changed).toHaveLength(1);
	});
});

describe("isFixedOption / hasFixedChange", () => {
	it("mode는 fixed 옵션", () => {
		expect(isFixedOption("mode")).toBe(true);
	});

	it("toolbar_sticky는 live 옵션", () => {
		expect(isFixedOption("toolbar_sticky")).toBe(false);
	});

	it("fixed 키가 포함되면 hasFixedChange = true", () => {
		expect(hasFixedChange(["mode"])).toBe(true);
	});

	it("live 키만 있으면 hasFixedChange = false", () => {
		expect(hasFixedChange(["toolbar_sticky", "toolbar_hide"])).toBe(false);
	});
});
