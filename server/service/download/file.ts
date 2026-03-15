/**
 * @fileoverview 파일 다운로드/스트리밍
 *
 * 업로드된 파일을 클라이언트에 제공하는 서비스
 */

import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_BASE_PATH } from "../../types";
import type { MediaType } from "../../types";

/** 파일 존재 여부 확인 */
export async function fileExists(mediaType: MediaType, fileName: string): Promise<boolean> {
	const filePath = path.join(UPLOAD_BASE_PATH, mediaType, fileName);
	try {
		await fs.access(filePath);
		return true;
	} catch {
		return false;
	}
}

/** 파일 경로 반환 (존재 확인 포함) */
export async function getFilePath(mediaType: MediaType, fileName: string): Promise<string | null> {
	const filePath = path.join(UPLOAD_BASE_PATH, mediaType, fileName);
	try {
		await fs.access(filePath);
		return filePath;
	} catch {
		return null;
	}
}

/** 파일 삭제 */
export async function deleteFile(mediaType: MediaType, fileName: string): Promise<boolean> {
	const filePath = path.join(UPLOAD_BASE_PATH, mediaType, fileName);
	try {
		await fs.unlink(filePath);
		return true;
	} catch {
		return false;
	}
}
