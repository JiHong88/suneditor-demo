#!/usr/bin/env node

/**
 * 코드 스니펫 파일(.snippet.*)을 읽어서 TypeScript 배럴 파일(_generated.ts)로 생성
 *
 * 지원 디렉토리:
 *   frameworks/       — 프레임워크 초기화 코드 (플레이스홀더 치환)
 *   render/           — 프레임워크 렌더링 코드 (플레이스홀더 치환)
 *   plugin-examples/  — 플러그인 예제 (그대로 읽기)
 *   plugin-skeletons/ — 플러그인 스켈레톤 (그대로 읽기)
 *   html-structures/  — HTML 구조 레퍼런스 (그대로 읽기)
 *
 * 실행: node scripts/generate-framework-snippets.cjs
 *       npm run snippets:generate
 */

const fs = require("fs");
const path = require("path");

const CODE_EXAMPLES_DIR = path.join(__dirname, "../src/data/snippets");

/* ── 동적 값 (editorPresets.ts와 동기화) ──────────── */
const versionPath = path.join(__dirname, "../src/store/version.ts");
const versionContent = fs.readFileSync(versionPath, "utf-8");
const VERSION = versionContent.match(/SUNEDITOR_VERSION\s*=\s*["']([^"']+)["']/)?.[1] || "3.0.0";
const CDN_BASE = `https://cdn.jsdelivr.net/npm/suneditor@${VERSION}/dist`;
const CDN_CSS = `${CDN_BASE}/css/suneditor.min.css`;
const CDN_CONTENTS_CSS = `${CDN_BASE}/css/suneditor-contents.min.css`;
const CDN_JS = `${CDN_BASE}/suneditor.min.js`;
const DEFAULT_VALUE = "<p>Hello SunEditor</p>";

const BASIC_BUTTON_LIST = [
	["undo", "redo"],
	"|",
	["bold", "italic", "underline"],
	"|",
	["list", "link", "image"],
];

function fmtButtonList(list, indent) {
	const pad = " ".repeat(indent + 2);
	const items = list.map((item) => {
		if (typeof item === "string") return `${pad}"${item}"`;
		return `${pad}[${item.map((b) => `"${b}"`).join(", ")}]`;
	});
	return `[\n${items.join(",\n")}\n${" ".repeat(indent)}]`;
}

/* ── 플레이스홀더 치환 ───────────────────────────── */
const PLACEHOLDERS = {
	"{{VERSION}}": VERSION,
	"{{CDN_CSS}}": CDN_CSS,
	"{{CDN_CONTENTS_CSS}}": CDN_CONTENTS_CSS,
	"{{CDN_JS}}": CDN_JS,
	"{{DEFAULT_VALUE}}": DEFAULT_VALUE,
	"{{BUTTON_LIST_4}}": fmtButtonList(BASIC_BUTTON_LIST, 4),
	"{{BUTTON_LIST_6}}": fmtButtonList(BASIC_BUTTON_LIST, 6),
};

function replacePlaceholders(content) {
	let result = content;
	for (const [key, val] of Object.entries(PLACEHOLDERS)) {
		result = result.replaceAll(key, val);
	}
	return result;
}

/* ── 디렉토리 설정 ───────────────────────────────── */
const DIRS = [
	{ dir: "getting-started--frameworks", prefix: "FRAMEWORK", usePlaceholders: true },
	{ dir: "getting-started--render", prefix: "RENDER", usePlaceholders: true },
	{ dir: "plugin-guide--examples", prefix: "PLUGIN_EXAMPLE", usePlaceholders: false },
	{ dir: "plugin-guide--skeletons", prefix: "SKELETON", usePlaceholders: false },
	{ dir: "plugin-guide--html-structures", prefix: "HTML", usePlaceholders: false },
];

/* ── 파일명 → export 변수명 변환 ─────────────────── */
function toVarName(prefix, fileName) {
	// "html-cdn.snippet.html" → "html_cdn" → "HTML_CDN"
	const base = fileName.replace(/\.snippet\..+$/, "").replace(/[-.]/g, "_").toUpperCase();
	return `${prefix}_${base}`;
}

/* ── 생성 ─────────────────────────────────────────── */
let totalCount = 0;

for (const { dir, prefix, usePlaceholders } of DIRS) {
	const dirPath = path.join(CODE_EXAMPLES_DIR, dir);
	if (!fs.existsSync(dirPath)) continue;

	const snippetFiles = fs.readdirSync(dirPath).filter((f) => f.includes(".snippet.")).sort();
	if (snippetFiles.length === 0) continue;

	const exports = [];
	for (const file of snippetFiles) {
		let content = fs.readFileSync(path.join(dirPath, file), "utf-8").trimEnd();
		if (usePlaceholders) content = replacePlaceholders(content);

		const escaped = content.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
		const varName = toVarName(prefix, file);
		exports.push(`export const ${varName} = \`${escaped}\`;`);
	}

	const header = `/**
 * @generated 이 파일은 자동 생성됩니다. 직접 수정하지 마세요.
 * 원본: src/data/snippets/${dir}/*.snippet.*
 * 생성: node scripts/generate-framework-snippets.cjs
 */
`;

	const outputFile = path.join(dirPath, "_generated.ts");
	fs.writeFileSync(outputFile, header + "\n" + exports.join("\n\n") + "\n");
	console.log(`  ✅ ${dir}/_generated.ts (${exports.length} snippets)`);
	totalCount += exports.length;
}

console.log(`\n✅ Total: ${totalCount} snippets generated`);
