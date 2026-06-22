import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

/**
 * PDF Lambda 한글 폰트 회귀 방지
 *
 * 배경: @sparticuz/chromium 은 라틴 전용 Open Sans 만 번들한다. 한글(CJK) 폰트가
 * Lambda 패키지에 동봉되지 않으면 프로덕션 PDF에서 한글이 빈칸으로 출력된다.
 * 이 테스트는 (1) fonts/ 에 CJK 폰트가 존재하고 (2) deploy.sh 가 fonts/ 를
 * 배포 zip 에 포함하는지를 검증해 회귀를 막는다.
 */

const LAMBDA_DIR = path.join(__dirname, "../../aws/lambda/pdf-generator");
const FONTS_DIR = path.join(LAMBDA_DIR, "fonts");

describe("PDF Lambda 한글 폰트 동봉", () => {
	it("fonts/ 디렉토리에 폰트 파일(.ttf/.otf)이 존재한다", () => {
		expect(fs.existsSync(FONTS_DIR)).toBe(true);
		const fontFiles = fs.readdirSync(FONTS_DIR).filter((f) => /\.(ttf|otf|ttc)$/i.test(f));
		expect(fontFiles.length).toBeGreaterThan(0);
	});

	it("동봉 폰트가 한글 음절 영역(U+AC00 '가')을 포함한다", () => {
		const fontFiles = fs
			.readdirSync(FONTS_DIR)
			.filter((f) => /\.(ttf|otf|ttc)$/i.test(f))
			.map((f) => path.join(FONTS_DIR, f));

		// cmap(format 4/12) 어디든 0xAC00 코드포인트가 매핑되어 있는지 바이트 단위로 스캔.
		// format 12 그룹(startChar..endChar)과 format 4 세그먼트 모두를 포괄하기 위해
		// 전수 파싱 대신 "0xAC00 이 어떤 그룹/세그먼트 범위에 들어가는가"를 확인한다.
		const hasHangul = fontFiles.some((file) => fontContainsCodepoint(file, 0xac00));
		expect(hasHangul).toBe(true);
	});

	it("deploy.sh 가 fonts/ 를 배포 zip 에 포함한다", () => {
		const deploy = fs.readFileSync(path.join(LAMBDA_DIR, "deploy.sh"), "utf8");
		// `zip ... function.zip` 명령 라인만 선택 (S3_KEY 등 변수 할당 라인 제외)
		const zipLine = deploy.split("\n").find((l) => /^\s*zip\b/.test(l) && l.includes("function.zip"));
		expect(zipLine, "deploy.sh 에 function.zip 압축 명령 라인이 있어야 함").toBeTruthy();
		expect(zipLine).toMatch(/\bfonts\b/);
	});
});

/**
 * TTF/OTF cmap 을 파싱해 특정 코드포인트가 매핑되어 있는지 확인한다.
 * format 4(BMP)와 format 12(전체 유니코드) subtable 을 지원한다.
 */
function fontContainsCodepoint(file: string, cp: number): boolean {
	const buf = fs.readFileSync(file);
	const numTables = buf.readUInt16BE(4);
	let cmapOffset = -1;
	for (let i = 0; i < numTables; i++) {
		const rec = 12 + i * 16;
		const tag = buf.toString("ascii", rec, rec + 4);
		if (tag === "cmap") {
			cmapOffset = buf.readUInt32BE(rec + 8);
			break;
		}
	}
	if (cmapOffset < 0) return false;

	const numSub = buf.readUInt16BE(cmapOffset + 2);
	const subOffsets: number[] = [];
	for (let i = 0; i < numSub; i++) {
		const rec = cmapOffset + 4 + i * 8;
		subOffsets.push(cmapOffset + buf.readUInt32BE(rec + 4));
	}

	for (const off of subOffsets) {
		const format = buf.readUInt16BE(off);
		if (format === 12 && cmap12HasCp(buf, off, cp)) return true;
		if (format === 4 && cmap4HasCp(buf, off, cp)) return true;
	}
	return false;
}

function cmap12HasCp(buf: Buffer, off: number, cp: number): boolean {
	const nGroups = buf.readUInt32BE(off + 12);
	for (let g = 0; g < nGroups; g++) {
		const rec = off + 16 + g * 12;
		const start = buf.readUInt32BE(rec);
		const end = buf.readUInt32BE(rec + 4);
		if (cp >= start && cp <= end) return true;
	}
	return false;
}

function cmap4HasCp(buf: Buffer, off: number, cp: number): boolean {
	if (cp > 0xffff) return false;
	const segX2 = buf.readUInt16BE(off + 6);
	const segCount = segX2 / 2;
	const endBase = off + 14;
	const startBase = endBase + segX2 + 2;
	for (let s = 0; s < segCount; s++) {
		const end = buf.readUInt16BE(endBase + s * 2);
		const start = buf.readUInt16BE(startBase + s * 2);
		if (cp >= start && cp <= end) return true;
	}
	return false;
}
