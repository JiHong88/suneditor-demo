/**
 * POST /api/upload/:type (image|video|audio|file)
 *
 * SunEditor의 uploadUrl이 이 엔드포인트를 가리킴
 * SunEditor는 파일을 FormData로 "file-0", "file-1" ... 필드명으로 전송
 */

import { NextRequest, NextResponse } from "next/server";
import type { MediaType, UploadResponse } from "@/../server/types";
import { uploadImage } from "@/../server/service/upload/image";
import { uploadVideo } from "@/../server/service/upload/video";
import { uploadAudio } from "@/../server/service/upload/audio";
import { uploadFile } from "@/../server/service/upload/file";

const VALID_TYPES: MediaType[] = ["image", "video", "audio", "file"];

const uploadHandlers: Record<MediaType, (files: Array<{ name: string; size: number; mimetype: string; data: Buffer }>) => Promise<UploadResponse>> = {
	image: uploadImage,
	video: uploadVideo,
	audio: uploadAudio,
	file: uploadFile,
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
	const { type } = await params;
	const mediaType = type as MediaType;

	if (!VALID_TYPES.includes(mediaType)) {
		return NextResponse.json({ result: [], errorMessage: `Invalid upload type: ${mediaType}` }, { status: 400 });
	}

	const formData = await request.formData();

	// SunEditor가 보내는 "file-0", "file-1" ... 필드에서 파일 추출
	const files: Array<{ name: string; size: number; mimetype: string; data: Buffer }> = [];
	for (const [, value] of formData.entries()) {
		if (value instanceof File) {
			const arrayBuffer = await value.arrayBuffer();
			files.push({
				name: value.name,
				size: value.size,
				mimetype: value.type,
				data: Buffer.from(arrayBuffer),
			});
		}
	}

	if (files.length === 0) {
		return NextResponse.json({ result: [], errorMessage: "No files uploaded" }, { status: 400 });
	}

	const handler = uploadHandlers[mediaType];
	const response = await handler(files);

	const status = response.errorMessage ? 400 : 200;
	return NextResponse.json(response, { status });
}
