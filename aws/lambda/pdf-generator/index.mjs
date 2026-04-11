/**
 * AWS Lambda handler — HTML → PDF conversion
 * Uses puppeteer-core + @sparticuz/chromium
 */

import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

async function waitForMediaLoad(page, timeout = 5000) {
	await page.evaluate(async (timeout) => {
		const selectors = ["img", "video", "audio", "iframe"];
		const mediaElements = selectors.flatMap((s) => Array.from(document.querySelectorAll(s)));
		const promises = mediaElements.map((el) => {
			if (el.complete === false || el.readyState < 2) {
				return new Promise((resolve) => {
					el.addEventListener("load", () => resolve());
					el.addEventListener("error", () => resolve());
				});
			}
			return Promise.resolve();
		});
		await Promise.race([Promise.all(promises), new Promise((r) => setTimeout(r, timeout))]);
	}, timeout);
}

export async function handler(event) {
	let body;
	try {
		body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
	} catch {
		return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON" }) };
	}

	const { htmlContent, fileName = "suneditor-pdf" } = body || {};
	if (!htmlContent) {
		return { statusCode: 400, body: JSON.stringify({ error: "No HTML content provided" }) };
	}

	let browser;
	try {
		browser = await puppeteer.launch({
			headless: true,
			executablePath: await chromium.executablePath(),
			args: chromium.args,
		});

		const page = await browser.newPage();
		page.on("console", (msg) => console.log(msg.text()));

		const pendingRequests = new Set();
		page.on("request", (req) => pendingRequests.add(req));
		page.on("requestfinished", (req) => pendingRequests.delete(req));
		page.on("requestfailed", (req) => pendingRequests.delete(req));

		await page.setViewport({ width: 1200, height: 800 });
		await page.setBypassCSP(true);
		await page.setContent(htmlContent, { waitUntil: "domcontentloaded", timeout: 30000 });

		// Wait for network idle
		await Promise.race([
			new Promise((r) => setTimeout(r, 10000)),
			(async () => {
				while (pendingRequests.size > 0) await new Promise((r) => setTimeout(r, 100));
			})(),
		]);

		try {
			await waitForMediaLoad(page);
		} catch (e) {
			console.error("media load error:", e);
		}

		await page.emulateMediaType("print");

		const pdf = await page.pdf({
			width: "210mm",
			height: "297mm",
			printBackground: true,
			preferCSSPageSize: true,
		});

		await browser.close();
		browser = null;

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="${fileName}.pdf"`,
			},
			isBase64Encoded: true,
			body: Buffer.from(pdf).toString("base64"),
		};
	} catch (err) {
		console.error("PDF generation error:", err);
		return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
	} finally {
		if (browser) await browser.close().catch(() => {});
	}
}
