import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { sweepUploads } from "../../server/service/upload/cleanup";
import { UPLOAD_TTL_MS } from "../../server/types";

/**
 * 실제 업로드 디렉토리(public/uploads)가 아니라 임시 디렉토리를 대상으로 스윕한다.
 * 테스트가 개발자의 로컬 업로드를 지우면 안 된다.
 */
let baseDir: string;

const imageDir = () => path.join(baseDir, "image");
const videoDir = () => path.join(baseDir, "video");

/** 지정한 크기/나이로 테스트 파일 생성 */
async function makeFile(dir: string, name: string, bytes: number, ageMs: number): Promise<string> {
	await fs.mkdir(dir, { recursive: true });
	const filePath = path.join(dir, name);
	await fs.writeFile(filePath, Buffer.alloc(bytes, 1));
	const mtime = new Date(Date.now() - ageMs);
	await fs.utimes(filePath, mtime, mtime);
	return filePath;
}

async function exists(filePath: string): Promise<boolean> {
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

beforeEach(async () => {
	baseDir = await fs.mkdtemp(path.join(os.tmpdir(), "se-upload-sweep-"));
});

afterEach(async () => {
	await fs.rm(baseDir, { recursive: true, force: true });
});

describe("sweepUploads — TTL", () => {
	it("TTL을 넘긴 파일은 삭제된다", async () => {
		const old = await makeFile(imageDir(), "old.bin", 16, UPLOAD_TTL_MS + 60_000);

		const result = await sweepUploads({ basePath: baseDir });

		expect(await exists(old)).toBe(false);
		expect(result.expired).toBe(1);
		expect(result.freedBytes).toBe(16);
	});

	it("TTL 이내 파일은 유지된다", async () => {
		const fresh = await makeFile(imageDir(), "fresh.bin", 16, 60_000);

		const result = await sweepUploads({ basePath: baseDir });

		expect(await exists(fresh)).toBe(true);
		expect(result.expired).toBe(0);
		expect(result.remainingBytes).toBe(16);
	});

	it("여러 미디어 디렉토리를 함께 정리한다", async () => {
		const oldImage = await makeFile(imageDir(), "img.bin", 16, UPLOAD_TTL_MS + 60_000);
		const oldVideo = await makeFile(videoDir(), "vid.bin", 16, UPLOAD_TTL_MS + 60_000);
		const freshImage = await makeFile(imageDir(), "img-fresh.bin", 16, 1_000);

		const result = await sweepUploads({ basePath: baseDir });

		expect(await exists(oldImage)).toBe(false);
		expect(await exists(oldVideo)).toBe(false);
		expect(await exists(freshImage)).toBe(true);
		expect(result.expired).toBe(2);
	});

	it("ttlMs override가 적용된다", async () => {
		const file = await makeFile(imageDir(), "ttl.bin", 16, 5_000);

		await sweepUploads({ basePath: baseDir, ttlMs: 1_000 });

		expect(await exists(file)).toBe(false);
	});

	it("미디어 타입 디렉토리 밖의 파일은 건드리지 않는다", async () => {
		const stray = path.join(baseDir, "stray.bin");
		await fs.writeFile(stray, Buffer.alloc(16, 1));
		const mtime = new Date(Date.now() - UPLOAD_TTL_MS - 60_000);
		await fs.utimes(stray, mtime, mtime);

		await sweepUploads({ basePath: baseDir });

		expect(await exists(stray)).toBe(true);
	});
});

describe("sweepUploads — 총량 상한", () => {
	it("상한을 넘으면 오래된 파일부터 제거한다", async () => {
		const oldest = await makeFile(imageDir(), "cap-1.bin", 100, 30_000);
		const middle = await makeFile(imageDir(), "cap-2.bin", 100, 20_000);
		const newest = await makeFile(imageDir(), "cap-3.bin", 100, 10_000);

		// 250바이트만 허용 → 총 300바이트 중 가장 오래된 1개 제거
		const result = await sweepUploads({ basePath: baseDir, maxTotalBytes: 250 });

		expect(await exists(oldest)).toBe(false);
		expect(await exists(middle)).toBe(true);
		expect(await exists(newest)).toBe(true);
		expect(result.evicted).toBe(1);
		expect(result.remainingBytes).toBe(200);
	});

	it("상한을 크게 넘으면 여러 개를 제거한다", async () => {
		await makeFile(imageDir(), "cap-1.bin", 100, 30_000);
		await makeFile(imageDir(), "cap-2.bin", 100, 20_000);
		const newest = await makeFile(imageDir(), "cap-3.bin", 100, 10_000);

		const result = await sweepUploads({ basePath: baseDir, maxTotalBytes: 100 });

		expect(result.evicted).toBe(2);
		expect(result.remainingBytes).toBe(100);
		expect(await exists(newest)).toBe(true);
	});

	it("상한 이내면 아무것도 제거하지 않는다", async () => {
		const file = await makeFile(imageDir(), "under-cap.bin", 100, 10_000);

		const result = await sweepUploads({ basePath: baseDir, maxTotalBytes: 1_000 });

		expect(await exists(file)).toBe(true);
		expect(result.evicted).toBe(0);
	});

	it("TTL 삭제 후 남은 용량으로 상한을 판단한다", async () => {
		// 만료 200바이트 + 유효 100바이트 → TTL 정리 후 100바이트라 상한(150) 이내
		await makeFile(imageDir(), "expired.bin", 200, UPLOAD_TTL_MS + 60_000);
		const fresh = await makeFile(imageDir(), "fresh.bin", 100, 10_000);

		const result = await sweepUploads({ basePath: baseDir, maxTotalBytes: 150 });

		expect(result.expired).toBe(1);
		expect(result.evicted).toBe(0);
		expect(await exists(fresh)).toBe(true);
	});
});

describe("sweepUploads — 안전성", () => {
	it("업로드 디렉토리가 없어도 예외를 던지지 않는다", async () => {
		const missing = path.join(baseDir, "does-not-exist");
		const result = await sweepUploads({ basePath: missing });

		expect(result).toEqual({ expired: 0, evicted: 0, freedBytes: 0, remainingBytes: 0 });
	});

	it("결과 통계 형태를 반환한다", async () => {
		const result = await sweepUploads({ basePath: baseDir });

		expect(result).toHaveProperty("expired");
		expect(result).toHaveProperty("evicted");
		expect(result).toHaveProperty("freedBytes");
		expect(result).toHaveProperty("remainingBytes");
	});
});
