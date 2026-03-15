/**
 * @fileoverview 오디오 업로드 처리
 *
 * 오디오 전용 로직: MIME 검증, 저장 처리
 * 향후 확장: 메타데이터 추출, 포맷 검증
 */

import type { UploadResponse } from "../../types";
import { processUpload } from "./index";

const MEDIA_TYPE = "audio" as const;
const URL_PREFIX = "/uploads/audio";

export async function uploadAudio(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
): Promise<UploadResponse> {
	return processUpload(files, MEDIA_TYPE, URL_PREFIX);
}
