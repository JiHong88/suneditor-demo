/**
 * @fileoverview 업로드 파일 정리 (TTL + 총량 상한)
 *
 * 업로드 요청마다 저장 직전에 한 번 실행된다.
 *
 * cron이 아니라 "업로드 시 스윕"인 이유:
 * Vercel 서버리스에서 업로드는 인스턴스 로컬 /tmp에 저장되고, cron이 호출한 람다는
 * 자기 /tmp만 볼 수 있다. 즉 cron으로는 다른 인스턴스에 쌓인 파일을 지울 수 없다.
 * 업로드가 실제로 일어난 인스턴스에서 정리해야 필요한 곳이 정리된다.
 */

import { promises as fs } from "fs";
import path from "path";
import { MEDIA_TYPES, UPLOAD_BASE_PATH, UPLOAD_TTL_MS, MAX_TOTAL_UPLOAD_BYTES } from "../../types";

type SweepEntry = {
	filePath: string;
	size: number;
	mtimeMs: number;
};

export type SweepResult = {
	/** TTL 초과로 삭제된 파일 수 */
	expired: number;
	/** 총량 상한 초과로 삭제된 파일 수 */
	evicted: number;
	/** 삭제로 확보한 바이트 */
	freedBytes: number;
	/** 정리 후 남은 총 바이트 */
	remainingBytes: number;
};

/** 업로드 경로를 절대 경로로 변환 (Vercel은 이미 절대 경로) */
function resolveBasePath(basePath: string = UPLOAD_BASE_PATH): string {
	return path.isAbsolute(basePath) ? basePath : path.join(process.cwd(), basePath);
}

/** 모든 미디어 디렉토리의 파일 목록을 크기/수정시각과 함께 수집 */
async function collectEntries(basePath: string): Promise<SweepEntry[]> {
	const entries: SweepEntry[] = [];

	for (const mediaType of MEDIA_TYPES) {
		const dir = path.join(basePath, mediaType);
		let names: string[];
		try {
			names = await fs.readdir(dir);
		} catch {
			continue; // 아직 생성 안 된 디렉토리
		}

		for (const name of names) {
			const filePath = path.join(dir, name);
			try {
				const stat = await fs.stat(filePath);
				if (!stat.isFile()) continue;
				entries.push({ filePath, size: stat.size, mtimeMs: stat.mtimeMs });
			} catch {
				// 다른 요청이 이미 지웠을 수 있다 — 무시
			}
		}
	}

	return entries;
}

/** 파일 삭제. 이미 없으면 조용히 실패 처리 */
async function removeFile(filePath: string): Promise<boolean> {
	try {
		await fs.unlink(filePath);
		return true;
	} catch {
		return false;
	}
}

export type SweepOptions = {
	/** 기준 시각 (테스트용) */
	now?: number;
	/** 보관 시간 override (테스트용) */
	ttlMs?: number;
	/** 총량 상한 override (테스트용) */
	maxTotalBytes?: number;
	/** 스윕 대상 경로 override (테스트용) */
	basePath?: string;
};

/**
 * 업로드 디렉토리를 정리한다.
 * 1) mtime이 ttlMs보다 오래된 파일 삭제
 * 2) 남은 총량이 maxTotalBytes를 넘으면 오래된 것부터 추가 삭제
 *
 * 업로드 자체를 막으면 안 되므로 어떤 예외도 밖으로 던지지 않는다.
 */
export async function sweepUploads(options: SweepOptions = {}): Promise<SweepResult> {
	const { now = Date.now(), ttlMs = UPLOAD_TTL_MS, maxTotalBytes = MAX_TOTAL_UPLOAD_BYTES } = options;
	const result: SweepResult = { expired: 0, evicted: 0, freedBytes: 0, remainingBytes: 0 };

	try {
		const entries = await collectEntries(resolveBasePath(options.basePath));

		// 1) TTL 초과 삭제
		const survivors: SweepEntry[] = [];
		for (const entry of entries) {
			if (now - entry.mtimeMs > ttlMs) {
				if (await removeFile(entry.filePath)) {
					result.expired++;
					result.freedBytes += entry.size;
				}
			} else {
				survivors.push(entry);
			}
		}

		// 2) 총량 상한 초과 시 오래된 것부터 제거
		let total = survivors.reduce((sum, e) => sum + e.size, 0);
		if (total > maxTotalBytes) {
			survivors.sort((a, b) => a.mtimeMs - b.mtimeMs); // 오래된 순
			for (const entry of survivors) {
				if (total <= maxTotalBytes) break;
				if (await removeFile(entry.filePath)) {
					result.evicted++;
					result.freedBytes += entry.size;
					total -= entry.size;
				}
			}
		}

		result.remainingBytes = total;

		if (result.expired || result.evicted) {
			console.log(
				`[upload.sweep] expired=${result.expired} evicted=${result.evicted} freed=${(result.freedBytes / 1024 / 1024).toFixed(1)}MB remaining=${(total / 1024 / 1024).toFixed(1)}MB`,
			);
		}
	} catch (err) {
		console.error("[upload.sweep] failed", err);
	}

	return result;
}
