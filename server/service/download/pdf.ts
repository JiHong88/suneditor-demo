/**
 * @fileoverview PDF 다운로드 — puppeteer-core + @sparticuz/chromium 기반 HTML → PDF 변환
 *
 * - Amplify/Lambda: @sparticuz/chromium이 제공하는 경량 Chromium 사용
 * - 로컬 개발: 시스템에 설치된 Chrome 사용
 */

import puppeteer from "puppeteer-core";

/** 미디어 리소스(img, video, audio, iframe) 로딩 대기 */
async function waitForMediaLoad(page: any, timeout = 5000): Promise<void> {
	await page.evaluate(async (timeout: number) => {
		const selectors = ["img", "video", "audio", "iframe"];
		const mediaElements = selectors.flatMap((selector: string) => Array.from(document.querySelectorAll(selector)));

		const mediaPromises = mediaElements.map((element) => {
			if ((element as HTMLImageElement).complete === false || (element as HTMLMediaElement).readyState < 2) {
				return new Promise<void>((resolve) => {
					element.addEventListener("load", () => resolve());
					element.addEventListener("error", () => resolve());
				});
			}
			return Promise.resolve();
		});

		await Promise.race([Promise.all(mediaPromises), new Promise((resolve) => setTimeout(resolve, timeout))]);
	}, timeout);
}

/** HTML 문자열을 PDF Buffer로 변환 */
export async function downloadPDF(htmlContent: string): Promise<Buffer> {
	if (!htmlContent) {
		throw new Error("No HTML content provided.");
	}

	let executablePath: string;
	let args: string[];

	if (process.env.AWS_LAMBDA_FUNCTION_NAME) {
		// Amplify/Lambda 환경 — @sparticuz/chromium 사용
		const chromium = (await import("@sparticuz/chromium")).default;
		executablePath = await chromium.executablePath();
		args = chromium.args;
	} else {
		// 로컬 개발 환경 — 시스템 Chrome 탐색
		const fs = await import("fs");
		const candidates = [
			"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
			"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
			"/usr/bin/google-chrome",
			"/usr/bin/chromium-browser",
		];
		const found = candidates.find((p) => {
			try {
				fs.accessSync(p);
				return true;
			} catch {
				return false;
			}
		});
		if (!found) throw new Error("Chrome not found. Install Google Chrome.");
		executablePath = found;
		args = ["--no-sandbox", "--disable-setuid-sandbox"];
	}

	const browser = await puppeteer.launch({
		headless: true,
		executablePath,
		args,
	});

	const page = await browser.newPage();

	// 콘솔 로그 캡처
	page.on("console", (consoleObj: any) => console.log(consoleObj.text()));

	// 네트워크 요청 추적
	const pendingRequests = new Set<any>();
	page.on("request", (request: any) => pendingRequests.add(request));
	page.on("requestfinished", (request: any) => pendingRequests.delete(request));
	page.on("requestfailed", (request: any) => pendingRequests.delete(request));

	// 뷰포트
	await page.setViewport({ width: 1200, height: 800 });

	// CSP 우회
	await page.setBypassCSP(true);

	// 콘텐츠 로드
	await page.setContent(htmlContent, {
		waitUntil: "domcontentloaded",
		timeout: 30000,
	});

	// 네트워크 요청 완료 대기 (최대 10초)
	await Promise.race([
		new Promise<void>((resolve) => setTimeout(resolve, 10000)),
		(async () => {
			while (pendingRequests.size > 0) {
				await new Promise<void>((r) => setTimeout(r, 100));
			}
		})(),
	]);

	try {
		await waitForMediaLoad(page);
	} catch (error) {
		console.error("media load error:", error);
	}

	// 인쇄 미디어 에뮬레이션
	await page.emulateMediaType("print");

	// PDF 생성
	const pdf = await page.pdf({
		width: "210mm",
		height: "297mm",
		printBackground: true,
		preferCSSPageSize: true,
	});

	await browser.close();
	return Buffer.from(pdf);
}
