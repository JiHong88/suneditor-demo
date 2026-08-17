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

/** 전체 미디어 타입 목록 (업로드 디렉토리 순회용) */
export const MEDIA_TYPES: MediaType[] = ["image", "video", "audio", "file"];

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

/** 업로드 파일 저장 기본 경로 — Vercel: /tmp, 로컬: public/uploads */
export const UPLOAD_BASE_PATH = process.env.VERCEL ? "/tmp/uploads" : "public/uploads";

/**
 * 업로드 파일 보관 시간 (2시간). 이보다 오래된 파일은 다음 업로드 요청 때 삭제된다.
 * 데모 사이트라 세션 중에만 보이면 충분하다.
 */
export const UPLOAD_TTL_MS = 2 * 60 * 60 * 1000;

/**
 * 업로드 디렉토리 전체 용량 상한 (200MB).
 * TTL과 별개인 안전장치 — 짧은 시간에 대용량 파일이 몰리면 오래된 것부터 제거한다.
 * Vercel 서버리스의 /tmp는 인스턴스당 512MB라서 상한 없이는 한 인스턴스가 막힐 수 있다.
 */
export const MAX_TOTAL_UPLOAD_BYTES = 200 * 1024 * 1024;
