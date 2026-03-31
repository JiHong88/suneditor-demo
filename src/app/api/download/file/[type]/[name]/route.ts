/**
 * GET /api/download/file/:type/:name
 *
 * 업로드된 파일 다운로드
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { MediaType } from "@/../server/types";
import { UPLOAD_BASE_PATH } from "@/../server/types";

const VALID_TYPES = new Set<string>(["image", "video", "audio", "file"]);

export async function GET(_request: NextRequest, { params }: { params: Promise<{ type: string; name: string }> }) {
	const { type, name } = await params;

	// Path traversal 방지: type 화이트리스트 + name에서 파일명만 추출
	if (!VALID_TYPES.has(type)) {
		return NextResponse.json({ error: "Invalid type" }, { status: 400 });
	}
	const safeName = path.basename(name);
	if (!safeName || safeName !== name) {
		return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
	}

	// UPLOAD_BASE_PATH is absolute on Vercel (/tmp/uploads), relative locally
	const basePath = path.isAbsolute(UPLOAD_BASE_PATH) ? UPLOAD_BASE_PATH : path.join(process.cwd(), UPLOAD_BASE_PATH);
	const filePath = path.join(basePath, type as MediaType, safeName);

	try {
		const file = await fs.readFile(filePath);
		return new NextResponse(new Uint8Array(file), {
			status: 200,
			headers: {
				"Content-Disposition": `attachment; filename="${safeName}"`,
			},
		});
	} catch {
		return NextResponse.json({ error: "File not found" }, { status: 404 });
	}
}
