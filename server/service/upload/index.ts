/**
 * @fileoverview 업로드 공통 로직 — 파일명 해싱, 저장 경로 생성, 유효성 검증, 응답 포맷 생성
 *
 * 각 미디어 타입별 모듈(image.ts, video.ts 등)에서 import하여 사용
 */

import { promises as fs } from "fs";
import { createHash } from "crypto";
import path from "path";
import type { UploadResult, UploadResponse, MediaType } from "../../types";
import { ACCEPTED_MIMES, DEFAULT_SIZE_LIMITS, UPLOAD_BASE_PATH } from "../../types";

/** 파일 버퍼로부터 MD5 해시 생성 */
export function hashFile(buffer: Buffer): string {
	return createHash("md5").update(buffer).digest("hex");
}

/** 업로드 저장 디렉토리 생성 (없으면 재귀 생성) */
export async function ensureUploadDir(mediaType: MediaType): Promise<string> {
	const dir = path.join(UPLOAD_BASE_PATH, mediaType);
	await fs.mkdir(dir, { recursive: true });
	return dir;
}

/** 파일 저장 경로 생성: {uploadDir}/{hash}.{ext} */
export function buildFilePath(uploadDir: string, hash: string, originalName: string): string {
	const ext = path.extname(originalName).toLowerCase() || ".bin";
	return path.join(uploadDir, `${hash}${ext}`);
}

/** 파일 크기 검증 */
export function validateFileSize(size: number, mediaType: MediaType, customLimit?: number): string | null {
	const limit = customLimit ?? DEFAULT_SIZE_LIMITS[mediaType];
	if (size > limit) {
		const limitMB = (limit / 1024 / 1024).toFixed(0);
		return `File too large. Max: ${limitMB}MB`;
	}
	return null;
}

/** MIME 타입 검증 */
export function validateMimeType(mimeType: string, mediaType: MediaType): string | null {
	const accepted = ACCEPTED_MIMES[mediaType];
	// file 타입은 모든 MIME 허용
	if (accepted.length === 0) return null;
	if (!accepted.includes(mimeType)) {
		return `Invalid file type: ${mimeType}. Accepted: ${accepted.join(", ")}`;
	}
	return null;
}

/** 파일을 디스크에 저장 */
export async function saveFile(buffer: Buffer, filePath: string): Promise<void> {
	await fs.writeFile(filePath, buffer);
}

/** SunEditor 응답 포맷 생성 (성공) */
export function successResponse(results: UploadResult[]): UploadResponse {
	return { result: results };
}

/** SunEditor 응답 포맷 생성 (에러) */
export function errorResponse(message: string): UploadResponse {
	return { result: [], errorMessage: message };
}

/**
 * 범용 업로드 처리 — 파일 검증 → 해시 → 저장 → 결과 반환
 *
 * @param files - { name, size, mimetype, data(Buffer) } 형태의 파일 객체 배열
 * @param mediaType - 미디어 타입
 * @param urlPrefix - 클라이언트에서 접근할 URL prefix (예: "/uploads/image")
 */
export async function processUpload(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
	mediaType: MediaType,
	urlPrefix: string,
): Promise<UploadResponse> {
	const results: UploadResult[] = [];

	const uploadDir = await ensureUploadDir(mediaType);

	for (const file of files) {
		// 크기 검증
		const sizeError = validateFileSize(file.size, mediaType);
		if (sizeError) return errorResponse(sizeError);

		// MIME 검증
		const mimeError = validateMimeType(file.mimetype, mediaType);
		if (mimeError) return errorResponse(mimeError);

		// 해시 기반 파일명 생성 (중복 방지)
		const hash = hashFile(file.data);
		const filePath = buildFilePath(uploadDir, hash, file.name);
		const fileName = path.basename(filePath);

		// 저장
		await saveFile(file.data, filePath);

		results.push({
			url: `${urlPrefix}/${fileName}`,
			name: file.name,
			size: file.size,
		});
	}

	return successResponse(results);
}
