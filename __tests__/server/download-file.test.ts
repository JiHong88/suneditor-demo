import { describe, it, expect } from "vitest";
import path from "path";

/**
 * 파일 다운로드 API의 path traversal 방지 로직 검증
 * (route handler 내 safeName 검증 로직을 순수 함수로 추출하여 테스트)
 */

const VALID_TYPES = new Set<string>(["image", "video", "audio", "file"]);

/** route.ts의 검증 로직을 재현 */
function validateDownloadParams(type: string, name: string): { error: string } | null {
	if (!VALID_TYPES.has(type)) return { error: "Invalid type" };
	const safeName = path.basename(name);
	if (!safeName || safeName !== name) return { error: "Invalid filename" };
	return null;
}

describe("파일 다운로드 경로 검증", () => {
	it("정상 파일명 통과", () => {
		expect(validateDownloadParams("image", "abc123.jpg")).toBeNull();
		expect(validateDownloadParams("video", "video.mp4")).toBeNull();
		expect(validateDownloadParams("file", "doc.pdf")).toBeNull();
	});

	it("잘못된 type 거부", () => {
		expect(validateDownloadParams("script", "file.js")).toEqual({ error: "Invalid type" });
		expect(validateDownloadParams("../etc", "passwd")).toEqual({ error: "Invalid type" });
	});

	it("path traversal 시도 차단 — ../ 포함", () => {
		expect(validateDownloadParams("image", "../../../etc/passwd")).toEqual({ error: "Invalid filename" });
		expect(validateDownloadParams("file", "../../secret.env")).toEqual({ error: "Invalid filename" });
	});

	it("path traversal 시도 차단 — 디렉토리 포함", () => {
		expect(validateDownloadParams("image", "subdir/file.jpg")).toEqual({ error: "Invalid filename" });
	});

	it("빈 파일명 거부", () => {
		expect(validateDownloadParams("image", "")).toEqual({ error: "Invalid filename" });
	});
});
