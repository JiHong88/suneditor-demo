import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { TROUBLESHOOTING_ITEMS, TROUBLESHOOTING_CATEGORIES, TROUBLESHOOTING_VERIFIED_VERSION, TROUBLESHOOTING_ROUTE, ENGINE_LINKED_TROUBLESHOOTING_IDS } from "../../src/data/troubleshooting";

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

/**
 * 엔진이 링크하는 엔드포인트 고정
 *
 * suneditor 엔진(`src/helper/env.js`의 `TROUBLESHOOTING_URLS`)은 에러 메시지에서
 * `https://suneditor.com/troubleshooting#<id>`로 직접 링크한다. 라우트 경로·앵커 id가 바뀌면 배포된 모든 엔진 버전의 링크가 깨진다.
 */
describe("엔진이 링크하는 Troubleshooting 엔드포인트 고정", () => {
	const ENDPOINT_PREFIX = `https://suneditor.com${TROUBLESHOOTING_ROUTE}#`;
	const ids = new Set(TROUBLESHOOTING_ITEMS.map((item) => item.id));

	it("라우트 경로가 /troubleshooting", () => {
		expect(TROUBLESHOOTING_ROUTE).toBe("/troubleshooting");
		expect(fs.existsSync(path.join(ROOT, "src/app/[locale]", TROUBLESHOOTING_ROUTE, "page.tsx"))).toBe(true);
	});

	it("기본 locale은 prefix 없이 서빙 (suneditor.com/troubleshooting 이 그대로 동작)", () => {
		const routing = fs.readFileSync(path.join(ROOT, "src/i18n/routing.ts"), "utf-8");
		expect(routing).toMatch(/localePrefix:\s*["']as-needed["']/);
	});

	it("엔진이 링크하는 id가 모두 항목으로 존재", () => {
		for (const id of ENGINE_LINKED_TROUBLESHOOTING_IDS) expect(ids, `missing troubleshooting item "${id}"`).toContain(id);
	});

	it("항목 id가 그대로 DOM 앵커(id 속성)로 렌더링됨", () => {
		const list = fs.readFileSync(path.join(ROOT, "src/app/[locale]/troubleshooting/_components/TroubleshootingList.tsx"), "utf-8");
		expect(list).toMatch(/<section[^>]*\sid=\{it\.id\}/);
	});

	/** 엔진 소스에서 TROUBLESHOOTING_URLS 블록의 URL을 뽑는다. 설치 패키지 우선, 로컬 체크아웃(../suneditor)이 있으면 그것도 대조. */
	const engineUrlSources: [string, string][] = [
		["node_modules/suneditor", engineSource],
		...(fs.existsSync(path.join(ROOT, "../suneditor/src/helper/env.js")) ? ([["../suneditor", fs.readFileSync(path.join(ROOT, "../suneditor/src/helper/env.js"), "utf-8")]] as [string, string][]) : []),
	];

	for (const [label, source] of engineUrlSources) {
		const block = source.match(/TROUBLESHOOTING_URLS\s*=\s*\{([\s\S]*?)\}/);
		if (!block) continue; // 이 버전의 엔진은 아직 링크하지 않음

		const urls = [...block[1].matchAll(/["'`](https?:\/\/[^"'`]+)["'`]/g)].map((m) => m[1]);

		it(`[${label}] TROUBLESHOOTING_URLS 가 모두 ${ENDPOINT_PREFIX}<id> 형식이고 id가 항목으로 존재`, () => {
			expect(urls.length).toBeGreaterThan(0);
			for (const url of urls) {
				expect(url.startsWith(ENDPOINT_PREFIX), `${url} must start with ${ENDPOINT_PREFIX}`).toBe(true);
				const id = url.slice(ENDPOINT_PREFIX.length);
				expect(ids, `engine links #${id} but no such troubleshooting item`).toContain(id);
			}
		});

		it(`[${label}] 엔진이 링크하는 id가 ENGINE_LINKED_TROUBLESHOOTING_IDS 와 일치`, () => {
			const engineIds = urls.map((u) => u.slice(ENDPOINT_PREFIX.length)).sort();
			expect(engineIds).toEqual([...ENGINE_LINKED_TROUBLESHOOTING_IDS].sort());
		});
	}
});
