/**
 * @fileoverview 서버 공통 타입 정의
 */

/** SunEditor가 기대하는 업로드 성공 응답 포맷 */
export interface UploadResult {
	url: string;
	name: string;
	size: number;
}

/** SunEditor 업로드 API 응답 */
export interface UploadResponse {
	result: UploadResult[];
	errorMessage?: string;
}

/** 서버 공통 응답 */
export interface ServiceResponse<T = unknown> {
	status: number;
	data?: T;
	message?: string;
}

/** 업로드 미디어 타입 */
export type MediaType = "image" | "video" | "audio" | "file";

/** 미디어 타입별 허용 MIME 타입 */
export const ACCEPTED_MIMES: Record<MediaType, string[]> = {
	image: ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "image/bmp"],
	video: ["video/mp4", "video/webm", "video/ogg", "video/quicktime"],
	audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/aac", "audio/flac"],
	file: [], // 빈 배열 = 모든 타입 허용
};

/** 미디어 타입별 기본 크기 제한 (bytes) */
export const DEFAULT_SIZE_LIMITS: Record<MediaType, number> = {
	image: 10 * 1024 * 1024, // 10MB
	video: 100 * 1024 * 1024, // 100MB
	audio: 20 * 1024 * 1024, // 20MB
	file: 50 * 1024 * 1024, // 50MB
};

/** 업로드 파일 저장 기본 경로 */
export const UPLOAD_BASE_PATH = "public/uploads";
