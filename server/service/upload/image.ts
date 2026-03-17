/**
 * @fileoverview 이미지 업로드 처리
 *
 * 이미지 전용 로직: MIME 검증, sharp 리사이즈, 썸네일 생성
 */

import { promises as fs } from "fs";
import path from "path";
import sharp from "sharp";
import type { UploadResult, UploadResponse } from "../../types";
import {
	hashFile,
	ensureUploadDir,
	buildFilePath,
	validateFileSize,
	validateMimeType,
	saveFile,
	successResponse,
	errorResponse,
} from "./index";

const MEDIA_TYPE = "image" as const;
const URL_PREFIX = "/uploads/image";

/** MIME types that should skip resize (vector / animated) */
const SKIP_RESIZE_MIMES = new Set(["image/svg+xml", "image/gif"]);

/** Max width for main image */
const MAX_WIDTH = 1920;
/** Width for thumbnail */
const THUMB_WIDTH = 200;

export async function uploadImage(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
): Promise<UploadResponse> {
	const results: UploadResult[] = [];
	const uploadDir = await ensureUploadDir(MEDIA_TYPE);

	for (const file of files) {
		// 크기 검증
		const sizeError = validateFileSize(file.size, MEDIA_TYPE);
		if (sizeError) return errorResponse(sizeError);

		// MIME 검증
		const mimeError = validateMimeType(file.mimetype, MEDIA_TYPE);
		if (mimeError) return errorResponse(mimeError);

		let imageBuffer = file.data;

		// SVG, GIF는 리사이즈 스킵
		if (!SKIP_RESIZE_MIMES.has(file.mimetype)) {
			// 리사이즈: max 1920px width, 원본보다 작으면 확대하지 않음
			imageBuffer = await sharp(file.data)
				.resize({ width: MAX_WIDTH, withoutEnlargement: true })
				.toBuffer();

			// 썸네일 생성: 200px width
			const thumbBuffer = await sharp(file.data)
				.resize({ width: THUMB_WIDTH, withoutEnlargement: true })
				.toBuffer();

			const hash = hashFile(imageBuffer);
			const ext = path.extname(file.name).toLowerCase() || ".bin";
			const thumbPath = path.join(uploadDir, `thumb_${hash}${ext}`);
			await saveFile(thumbBuffer, thumbPath);
		}

		// 해시 기반 파일명 생성 (중복 방지)
		const hash = hashFile(imageBuffer);
		const filePath = buildFilePath(uploadDir, hash, file.name);
		const fileName = path.basename(filePath);

		// 저장
		await saveFile(imageBuffer, filePath);

		results.push({
			url: `${URL_PREFIX}/${fileName}`,
			name: file.name,
			size: imageBuffer.length, // 리사이즈 후 크기 반환
		});
	}

	return successResponse(results);
}
