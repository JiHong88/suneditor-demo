/**
 * POST /api/download/pdf
 *
 * HTML 콘텐츠를 PDF로 변환하여 다운로드
 * SunEditor exportPDF 플러그인의 apiUrl이 이 엔드포인트를 가리킴
 */

import { NextRequest, NextResponse } from "next/server";
import { downloadPDF } from "@/../server/service/download/pdf";

export async function POST(request: NextRequest) {
	try {
		const { htmlContent, fileName = "suneditor-pdf" } = await request.json();
		const pdf = await downloadPDF(htmlContent);

		return new NextResponse(new Uint8Array(pdf), {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${fileName}.pdf"`,
			},
		});
	} catch (err) {
		console.error("PDF generation error:", err);
		return NextResponse.json({ error: (err as Error).message }, { status: 500 });
	}
}
