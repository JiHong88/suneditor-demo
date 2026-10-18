import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { TROUBLESHOOTING_ITEMS, TROUBLESHOOTING_CATEGORIES, TROUBLESHOOTING_VERIFIED_VERSION } from "../../src/data/troubleshooting";

/**
 * Troubleshooting 페이지 정확성 테스트
 *
 * 페이지에 엔진 에러 문자열을 그대로 인용하므로, 엔진이 바뀌면 문서가 조용히 낡는다.
 * 엔진 업데이트 시 이 테스트가 실패하면 항목을 재확인하고 TROUBLESHOOTING_VERIFIED_VERSION을 올린다.
 */

const ROOT = path.resolve(__dirname, "../..");
const ENGINE_DIR = path.join(ROOT, "node_modules/suneditor");
const MESSAGES_DIR = path.join(ROOT, "src/messages");

function readEngineSource(dir: string): string {
	let out = "";
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) out += readEngineSource(full);
		else if (entry.name.endsWith(".js")) out += fs.readFileSync(full, "utf-8") + "\n";
	}
	return out;
}

const engineSource = readEngineSource(path.join(ENGINE_DIR, "src"));
const engineVersion: string = JSON.parse(fs.readFileSync(path.join(ENGINE_DIR, "package.json"), "utf-8")).version;
const locales = fs.readdirSync(MESSAGES_DIR).filter((f) => f.endsWith(".json") && !f.startsWith("."));
const messages = Object.fromEntries(locales.map((f) => [f.replace(/\.json$/, ""), JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, f), "utf-8"))]));

describe("Troubleshooting 항목 정의", () => {
	it("id 중복 없음", () => {
		const ids = TROUBLESHOOTING_ITEMS.map((item) => item.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it("모든 항목의 category가 정의된 카테고리", () => {
		for (const item of TROUBLESHOOTING_ITEMS) expect(TROUBLESHOOTING_CATEGORIES).toContain(item.category);
	});

	it("검증 버전이 설치된 suneditor 버전과 일치 (엔진 업데이트 후 항목 재확인 → 버전 올리기)", () => {
		expect(TROUBLESHOOTING_VERIFIED_VERSION).toBe(engineVersion);
	});
});

describe("엔진 에러 문자열 실재 여부", () => {
	for (const item of TROUBLESHOOTING_ITEMS) {
		for (const err of item.errors ?? []) {
			it(`[${item.id}] 엔진 소스에 존재: ${err}`, () => {
				expect(engineSource).toContain(err);
			});
		}
	}
});

describe("모든 언어에 항목 문구 존재 + 에러 문자열 원문 유지", () => {
	for (const [locale, msg] of Object.entries(messages)) {
		it(`[${locale}]`, () => {
			for (const item of TROUBLESHOOTING_ITEMS) {
				const text = msg.Troubleshooting?.items?.[item.id];
				for (const field of ["title", "symptom", "cause", "fix"]) {
					expect(text?.[field], `${locale}: Troubleshooting.items.${item.id}.${field}`).toBeTruthy();
				}
				for (const err of item.errors ?? []) {
					expect(text.symptom, `${locale}: ${item.id}.symptom must quote "${err}" verbatim`).toContain(err);
				}
			}
		});
	}
});
