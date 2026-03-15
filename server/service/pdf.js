import { launch } from 'puppeteer';

// media load
async function waitForMediaLoad(page, timeout = 5000) {
	await page.evaluate(async (timeout) => {
		const selectors = ['img', 'video', 'audio', 'iframe'];
		const mediaElements = selectors.flatMap((selector) => Array.from(document.querySelectorAll(selector)));

		const mediaPromises = mediaElements.map((element) => {
			if (element.complete === false || element.readyState < 2) {
				return new Promise((resolve) => {
					element.addEventListener('load', resolve);
					element.addEventListener('error', resolve);
				});
			}
			return Promise.resolve();
		});

		await Promise.race([Promise.all(mediaPromises), new Promise((resolve) => setTimeout(resolve, timeout))]);
	}, timeout);
}

export async function downloadPDF(htmlContent) {
	if (!htmlContent) {
		throw new Error('No HTML content provided.');
	}

	const browser = await launch({
		headless: 'new',
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	// capture console log
	page.on('console', (consoleObj) => console.log(consoleObj.text()));

	// network request
	const pendingRequests = new Set();
	page.on('request', (request) => pendingRequests.add(request));
	page.on('requestfinished', (request) => pendingRequests.delete(request));
	page.on('requestfailed', (request) => pendingRequests.delete(request));

	// viewport
	await page.setViewport({ width: 1200, height: 800 });

	// CSP
	await page.setBypassCSP(true);

	// contents
	await page.setContent(htmlContent, {
		waitUntil: 'domcontentloaded',
		timeout: 30000
	});

	// 이미지 및 기타 리소스 로딩 대기
	await Promise.race([
		new Promise((resolve) => setTimeout(resolve, 10000)), // 최대 10초 대기
		new Promise(async (resolve) => {
			while (pendingRequests.size > 0) {
				await new Promise((r) => setTimeout(r, 100)); // 100ms마다 체크
			}
			resolve();
		})
	]);

	try {
		await waitForMediaLoad(page);
	} catch (error) {
		console.error('media load error:', error);
	}

	// emulate print media
	await page.emulateMediaType('print');

	// pdf
	const pdf = await page.pdf({
		width: '210mm',
		height: '297mm',
		printBackground: true,
		preferCSSPageSize: true
		// margin: {
		// 	top: '10mm',
		// 	right: '10mm',
		// 	bottom: '10mm',
		// 	left: '10mm'
		// }
	});

	await browser.close();
	return pdf;
}
