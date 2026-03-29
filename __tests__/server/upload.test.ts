import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import {
	hashFile,
	buildFilePath,
	validateFileSize,
	validateMimeType,
	ensureUploadDir,
	processUpload,
	successResponse,
	errorResponse,
} from "../../server/service/upload/index";
import { ACCEPTED_MIMES, DEFAULT_SIZE_LIMITS, UPLOAD_BASE_PATH } from "../../server/types";

/* ── 유틸리티 함수 단위 테스트 ─────────────────────────── */

describe("hashFile", () => {
	it("동일한 버퍼는 동일한 해시를 반환", () => {
		const buf = Buffer.from("hello world");
		expect(hashFile(buf)).toBe(hashFile(buf));
	});

	it("다른 버퍼는 다른 해시를 반환", () => {
		expect(hashFile(Buffer.from("a"))).not.toBe(hashFile(Buffer.from("b")));
	});

	it("MD5 hex 형식 (32자)", () => {
		const hash = hashFile(Buffer.from("test"));
		expect(hash).toMatch(/^[0-9a-f]{32}$/);
	});
});

describe("buildFilePath", () => {
	it("해시 기반 파일명 생성", () => {
		const result = buildFilePath("/uploads/image", "abc123", "photo.jpg");
		expect(result).toBe(path.join("/uploads/image", "abc123.jpg"));
	});

	it("확장자가 없으면 .bin 사용", () => {
		const result = buildFilePath("/uploads/file", "abc123", "noext");
		expect(result).toBe(path.join("/uploads/file", "abc123.bin"));
	});

	it("확장자를 소문자로 정규화", () => {
		const result = buildFilePath("/dir", "hash", "file.PNG");
		expect(result).toBe(path.join("/dir", "hash.png"));
	});
});

describe("validateFileSize", () => {
	it("제한 이내면 null 반환", () => {
		expect(validateFileSize(1024, "image")).toBeNull();
	});

	it("제한 초과 시 에러 메시지 반환", () => {
		const overLimit = DEFAULT_SIZE_LIMITS.image + 1;
		const result = validateFileSize(overLimit, "image");
		expect(result).toContain("File too large");
	});

	it("커스텀 제한 적용", () => {
		expect(validateFileSize(500, "image", 100)).toContain("File too large");
		expect(validateFileSize(50, "image", 100)).toBeNull();
	});
});

describe("validateMimeType", () => {
	it("허용된 MIME은 null 반환", () => {
		expect(validateMimeType("image/jpeg", "image")).toBeNull();
		expect(validateMimeType("image/png", "image")).toBeNull();
	});

	it("허용되지 않은 MIME은 에러 반환", () => {
		const result = validateMimeType("application/pdf", "image");
		expect(result).toContain("Invalid file type");
	});

	it("file 타입은 모든 MIME 허용", () => {
		expect(validateMimeType("application/anything", "file")).toBeNull();
	});
});

describe("successResponse / errorResponse", () => {
	it("successResponse 포맷", () => {
		const res = successResponse([{ url: "/a.jpg", name: "a.jpg", size: 100 }]);
		expect(res.result).toHaveLength(1);
		expect(res.errorMessage).toBeUndefined();
	});

	it("errorResponse 포맷", () => {
		const res = errorResponse("fail");
		expect(res.result).toHaveLength(0);
		expect(res.errorMessage).toBe("fail");
	});
});

/* ── processUpload 통합 테스트 ────────────────────────── */

describe("processUpload", () => {
	const testDir = path.join(UPLOAD_BASE_PATH, "file");

	afterEach(async () => {
		// 테스트 생성 파일 정리
		try {
			const files = await fs.readdir(testDir);
			for (const f of files) {
				if (f.startsWith("098f6b")) await fs.unlink(path.join(testDir, f));
			}
		} catch { /* dir not exists */ }
	});

	it("유효한 파일 업로드 성공", async () => {
		const files = [{
			name: "test.txt",
			size: 5,
			mimetype: "text/plain",
			data: Buffer.from("hello"),
		}];
		const res = await processUpload(files, "file", "/uploads/file");
		expect(res.errorMessage).toBeUndefined();
		expect(res.result).toHaveLength(1);
		expect(res.result[0].url).toMatch(/^\/uploads\/file\/.+\.txt$/);
		expect(res.result[0].name).toBe("test.txt");
	});

	it("MIME 검증 실패 시 에러 반환", async () => {
		const files = [{
			name: "bad.exe",
			size: 5,
			mimetype: "application/x-msdownload",
			data: Buffer.from("hello"),
		}];
		const res = await processUpload(files, "image", "/uploads/image");
		expect(res.errorMessage).toContain("Invalid file type");
		expect(res.result).toHaveLength(0);
	});

	it("크기 초과 시 에러 반환", async () => {
		const oversized = Buffer.alloc(DEFAULT_SIZE_LIMITS.image + 1);
		const files = [{
			name: "big.jpg",
			size: oversized.length,
			mimetype: "image/jpeg",
			data: oversized,
		}];
		const res = await processUpload(files, "image", "/uploads/image");
		expect(res.errorMessage).toContain("File too large");
	});

	it("동일 파일 중복 업로드 시 같은 URL 반환 (해시 기반)", async () => {
		const files = [{
			name: "dup.txt",
			size: 5,
			mimetype: "text/plain",
			data: Buffer.from("hello"),
		}];
		const res1 = await processUpload(files, "file", "/uploads/file");
		const res2 = await processUpload(files, "file", "/uploads/file");
		expect(res1.result[0].url).toBe(res2.result[0].url);
	});
});

/* ── 타입/상수 검증 ────────────────────────────────────── */

describe("서버 상수", () => {
	it("ACCEPTED_MIMES에 4가지 미디어 타입 정의", () => {
		expect(Object.keys(ACCEPTED_MIMES)).toEqual(["image", "video", "audio", "file"]);
	});

	it("image MIME에 주요 포맷 포함", () => {
		expect(ACCEPTED_MIMES.image).toContain("image/jpeg");
		expect(ACCEPTED_MIMES.image).toContain("image/png");
		expect(ACCEPTED_MIMES.image).toContain("image/webp");
	});

	it("file은 빈 배열 (모든 MIME 허용)", () => {
		expect(ACCEPTED_MIMES.file).toEqual([]);
	});

	it("크기 제한이 합리적인 범위", () => {
		expect(DEFAULT_SIZE_LIMITS.image).toBe(10 * 1024 * 1024);
		expect(DEFAULT_SIZE_LIMITS.video).toBe(100 * 1024 * 1024);
	});
});
