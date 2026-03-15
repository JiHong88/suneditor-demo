/**
 * @fileoverview 이미지 업로드 처리
 *
 * 이미지 전용 로직: MIME 검증, 저장 처리
 * 향후 확장: 리사이즈, 포맷 변환, 썸네일 생성
 */

import type { UploadResponse } from "../../types";
import { processUpload } from "./index";

const MEDIA_TYPE = "image" as const;
const URL_PREFIX = "/uploads/image";

export async function uploadImage(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
): Promise<UploadResponse> {
	return processUpload(files, MEDIA_TYPE, URL_PREFIX);
}
