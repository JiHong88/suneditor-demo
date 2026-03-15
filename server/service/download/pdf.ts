/**
 * @fileoverview PDF 다운로드 — puppeteer 기반 HTML → PDF 변환
 *
 * 기존 server/service/pdf.js를 TypeScript로 변환
 * puppeteer는 optional dependency — 설치 후 사용: npm i puppeteer
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

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

	let launch: any;
	try {
		({ launch } = await import(/* webpackIgnore: true */ "puppeteer" as string));
	} catch {
		throw new Error("puppeteer is not installed. Run: npm i puppeteer");
	}

	const browser = await launch({
		headless: true,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
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
