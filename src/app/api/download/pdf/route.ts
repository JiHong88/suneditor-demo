/**
 * POST /api/download/pdf
 *
 * Proxies to AWS Lambda for HTML → PDF conversion.
 * Set PDF_LAMBDA_URL in environment variables.
 * Falls back to local puppeteer for development if Lambda URL is not set.
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { fileName = "suneditor-pdf" } = body;

		const lambdaUrl = process.env.PDF_LAMBDA_URL;

		let pdfBuffer: ArrayBuffer;

		if (lambdaUrl) {
			// Production: proxy to Lambda
			const response = await fetch(lambdaUrl, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				const error = await response.text();
				return NextResponse.json({ error }, { status: response.status });
			}

			pdfBuffer = await response.arrayBuffer();
		} else {
			// Local dev: use local puppeteer
			const { downloadPDF } = await import("@/../server/service/download/pdf");
			const buffer = await downloadPDF(body.htmlContent);
			pdfBuffer = new Uint8Array(buffer).buffer as ArrayBuffer;
		}

		return new NextResponse(pdfBuffer, {
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
