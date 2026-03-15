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

export async function GET(_request: NextRequest, { params }: { params: Promise<{ type: string; name: string }> }) {
	const { type, name } = await params;
	const filePath = path.join(process.cwd(), UPLOAD_BASE_PATH, type as MediaType, name);

	try {
		const file = await fs.readFile(filePath);
		return new NextResponse(new Uint8Array(file), {
			status: 200,
			headers: {
				"Content-Disposition": `attachment; filename="${name}"`,
			},
		});
	} catch {
		return NextResponse.json({ error: "File not found" }, { status: 404 });
	}
}
