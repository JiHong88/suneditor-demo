import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * 정적 렌더링(SSG) 유지 테스트
 * next-intl은 setRequestLocale 없이 서버 컴포넌트에서 쓰이면 요청 헤더로 locale을 읽어 해당 라우트 전체를 dynamic으로 만든다.
 * dynamic 라우트는 Link prefetch가 로딩 화면까지만 받아 오므로 메뉴 이동마다 서버 렌더링을 기다리게 된다.
 */

const APP_DIR = path.join(__dirname, "../../src/app/[locale]");
const SRC_DIR = path.join(__dirname, "../../src");

function walk(dir: string): string[] {
	return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const isClient = (src: string) => /^\s*["']use client["']/.test(src);
const usesNextIntl = (src: string) => /from ["']next-intl(\/server)?["']/.test(src);

function resolveImport(from: string, spec: string): string | undefined {
	const base = spec.startsWith("@/") ? path.join(SRC_DIR, spec.slice(2)) : spec.startsWith(".") ? path.resolve(path.dirname(from), spec) : undefined;
	if (!base) return undefined;
	return [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")].find((f) => fs.existsSync(f) && fs.statSync(f).isFile());
}

/** The file or any server component it imports (transitively) uses next-intl. Client components are boundaries. */
function needsRequestLocale(file: string, seen = new Set<string>()): boolean {
	if (seen.has(file)) return false;
	seen.add(file);
	const src = fs.readFileSync(file, "utf-8");
	if (usesNextIntl(src)) return true;
	for (const [, spec] of src.matchAll(/from ["']([^"']+)["']/g)) {
		const dep = resolveImport(file, spec);
		if (dep && !isClient(fs.readFileSync(dep, "utf-8")) && needsRequestLocale(dep, seen)) return true;
	}
	return false;
}

const serverEntries = walk(APP_DIR)
	.filter((f) => /\/(page|layout)\.tsx$/.test(f))
	.filter((f) => !isClient(fs.readFileSync(f, "utf-8")));

describe("static rendering", () => {
	it("[locale] layout prerenders every locale", () => {
		const src = fs.readFileSync(path.join(APP_DIR, "layout.tsx"), "utf-8");
		expect(src).toMatch(/export function generateStaticParams/);
		expect(src).toMatch(/setRequestLocale\(/);
	});

	it.each(serverEntries.map((f) => [path.relative(APP_DIR, f), f]))("%s calls setRequestLocale when it renders translations", (_, file) => {
		if (!needsRequestLocale(file)) return;
		expect(fs.readFileSync(file, "utf-8")).toMatch(/setRequestLocale\(/);
	});

	it.each(serverEntries.map((f) => [path.relative(APP_DIR, f), f]))("%s does not read request-time APIs", (_, file) => {
		expect(fs.readFileSync(file, "utf-8")).not.toMatch(/\b(getLocale|headers|cookies|draftMode)\(\)/);
	});
});
