/**
 * GET /api/gallery/:type (image|video|audio|file|browse)
 *
 * SunEditor Browser 모듈(imageGallery, videoGallery 등)의 url이 이 엔드포인트를 가리킴
 * BrowserFile[] 형식의 샘플 데이터 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { type GalleryType, getGalleryData } from "@/../server/service/gallery";

const VALID_TYPES: GalleryType[] = ["image", "video", "audio", "file", "browse"];

export async function GET(_request: NextRequest, { params }: { params: Promise<{ type: string }> }) {
	const { type } = await params;
	const galleryType = type as GalleryType;

	if (!VALID_TYPES.includes(galleryType)) {
		return NextResponse.json({ errorMessage: `Invalid gallery type: ${galleryType}` }, { status: 400 });
	}

	const data = getGalleryData(galleryType);
	return NextResponse.json({ result: data });
}
