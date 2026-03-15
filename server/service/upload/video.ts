/**
 * @fileoverview 비디오 업로드 처리
 *
 * 비디오 전용 로직: MIME 검증, 저장 처리
 * 향후 확장: 스트림/청크 업로드, 썸네일 추출
 */

import type { UploadResponse } from "../../types";
import { processUpload } from "./index";

const MEDIA_TYPE = "video" as const;
const URL_PREFIX = "/uploads/video";

export async function uploadVideo(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
): Promise<UploadResponse> {
	return processUpload(files, MEDIA_TYPE, URL_PREFIX);
}
