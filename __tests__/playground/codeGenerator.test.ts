import { describe, it, expect } from "vitest";
import { generateCode, getCodeLang, getNpmDeps } from "../../src/app/[locale]/playground/_lib/codeGenerator";
import { DEFAULTS } from "../../src/app/[locale]/playground/_lib/playgroundState";
import { fmtButtonList, BASIC_BUTTON_LIST } from "../../src/data/snippets/editorPresets";

/* ── generateCode ──────────────────────────────────────── */

describe("generateCode", () => {
	const frameworks = [
		"javascript-cdn",
		"javascript-npm",
		"react",
		"vue",
		"angular",
		"svelte",
		"webcomponents",
	] as const;

	for (const fw of frameworks) {
		it(`${fw}: 기본 state에서 유효한 코드 생성`, () => {
			const code = generateCode(DEFAULTS, fw);
			expect(typeof code).toBe("string");
			expect(code.length).toBeGreaterThan(50);
		});
	}

	it("기본값과 다른 옵션이 코드에 포함", () => {
		const state = { ...DEFAULTS, mode: "balloon" as const, toolbar_sticky: 50 };
		const code = generateCode(state, "javascript-npm");
		expect(code).toContain("balloon");
		expect(code).toContain("toolbar_sticky");
		expect(code).toContain("50");
	});

	it("기본값인 옵션은 코드에서 생략", () => {
		const code = generateCode(DEFAULTS, "javascript-npm");
		// 기본값인 toolbar_sticky: 0 은 출력되지 않아야 함
		expect(code).not.toContain("toolbar_sticky");
	});

	it("CDN 프레임워크에 script/link 태그 포함", () => {
		const code = generateCode(DEFAULTS, "javascript-cdn");
		expect(code).toContain("<script");
		expect(code).toContain("<link");
		expect(code).toContain("suneditor");
	});

	it("react 프레임워크에 import 포함", () => {
		const code = generateCode(DEFAULTS, "react");
		expect(code).toContain("import");
	});

	it("codeBlock 플러그인 옵션 출력 (nested object)", () => {
		const state = { ...DEFAULTS, codeBlock_langs: "javascript, python" };
		const code = generateCode(state, "javascript-npm");
		expect(code).toContain("codeBlock:");
		expect(code).toContain("langs:");
		expect(code).toContain('"javascript"');
		expect(code).toContain('"python"');
	});

	it("classic:bottom 모드 출력", () => {
		const state = { ...DEFAULTS, mode: "classic:bottom" as const };
		const code = generateCode(state, "javascript-npm");
		expect(code).toContain("classic:bottom");
	});
});

/* ── getCodeLang ───────────────────────────────────────── */

describe("getCodeLang", () => {
	it("react → jsx", () => {
		expect(getCodeLang("react")).toBe("jsx");
	});

	it("vue → vue", () => {
		expect(getCodeLang("vue")).toBe("vue");
	});

	it("javascript-cdn → html", () => {
		expect(getCodeLang("javascript-cdn")).toBe("html");
	});

	it("모든 프레임워크에 대해 문자열 반환", () => {
		const frameworks = ["javascript-cdn", "javascript-npm", "react", "vue", "angular", "svelte", "webcomponents"] as const;
		for (const fw of frameworks) {
			expect(typeof getCodeLang(fw)).toBe("string");
		}
	});
});

/* ── getNpmDeps ────────────────────────────────────────── */

describe("getNpmDeps", () => {
	it("추가 의존성 반환 (codemirror 등)", () => {
		const deps = getNpmDeps(DEFAULTS);
		expect(typeof deps).toBe("object");
		// codemirror은 항상 포함
		expect(deps).toHaveProperty("codemirror");
	});
});

/* ── fmtButtonList ─────────────────────────────────────── */

describe("fmtButtonList", () => {
	it("배열을 JS 코드 문자열로 포맷팅", () => {
		const result = fmtButtonList([["bold", "italic"], "|", ["link"]]);
		expect(result).toContain('"bold"');
		expect(result).toContain('"italic"');
		expect(result).toContain('"|"');
		expect(result).toContain('"link"');
	});

	it("반응형 breakpoint 포맷팅", () => {
		const list = [["bold"], ["%768", [["bold", "italic"]]]];
		const result = fmtButtonList(list);
		expect(result).toContain('"%768"');
	});

	it("BASIC_BUTTON_LIST 포맷팅 성공", () => {
		const result = fmtButtonList(BASIC_BUTTON_LIST);
		expect(result).toContain("undo");
		expect(result).toContain("bold");
	});
});
