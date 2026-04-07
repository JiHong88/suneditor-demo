/**
 * @fileoverview API 엔드포인트 상수
 *
 * 서버 API 경로를 한 곳에서 관리. 변경 시 이 파일만 수정.
 * Next.js API Routes (src/app/api/)와 매핑됨.
 */

/** 업로드 API */
export const API_UPLOAD_IMAGE = "/api/upload/image";
export const API_UPLOAD_VIDEO = "/api/upload/video";
export const API_UPLOAD_AUDIO = "/api/upload/audio";
export const API_UPLOAD_FILE = "/api/upload/file";

/** 갤러리/브라우저 API */
export const API_GALLERY_IMAGE = "/api/gallery/image";
export const API_GALLERY_VIDEO = "/api/gallery/video";
export const API_GALLERY_AUDIO = "/api/gallery/audio";
export const API_GALLERY_FILE = "/api/gallery/file";
export const API_GALLERY_BROWSE = "/api/gallery/browse";

/** 멘션 API */
export const API_MENTION = "/api/mention";

/** 다운로드 API */
export const API_DOWNLOAD_PDF = "/api/download/pdf";
