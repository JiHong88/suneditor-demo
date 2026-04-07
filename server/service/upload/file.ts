/**
 * @fileoverview 일반 파일 업로드 처리
 *
 * 일반 파일 로직: 모든 MIME 허용, 저장 처리
 * 향후 확장: 확장자 화이트리스트, 바이러스 스캔
 */

import type { UploadResponse } from "../../types";
import { processUpload } from "./index";

const MEDIA_TYPE = "file" as const;
const URL_PREFIX = "/api/download/file/file";

export async function uploadFile(
	files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>,
): Promise<UploadResponse> {
	return processUpload(files, MEDIA_TYPE, URL_PREFIX);
}
