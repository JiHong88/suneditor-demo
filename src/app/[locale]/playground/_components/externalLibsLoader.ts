/* ── CDN script/css loader for external libraries ──────── */

const CODEMIRROR_VERSION = "6.65.7";
const KATEX_VERSION = "0.16.11";

const CM_ASSETS = [
	{ type: "css", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/lib/codemirror.min.css` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/lib/codemirror.min.js` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/mode/xml/xml.min.js` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/mode/css/css.min.js` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/mode/javascript/javascript.min.js` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/codemirror@${CODEMIRROR_VERSION}/mode/htmlmixed/htmlmixed.min.js` },
];

const KATEX_ASSETS = [
	{ type: "css", url: `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.css` },
	{ type: "js", url: `https://cdn.jsdelivr.net/npm/katex@${KATEX_VERSION}/dist/katex.min.js` },
];

function loadCss(url: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`link[href="${url}"]`)) { resolve(); return; }
		const link = document.createElement("link");
		link.rel = "stylesheet";
		link.href = url;
		link.onload = () => resolve();
		link.onerror = reject;
		document.head.appendChild(link);
	});
}

function loadScript(url: string): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
		const script = document.createElement("script");
		script.src = url;
		script.onload = () => resolve();
		script.onerror = reject;
		document.head.appendChild(script);
	});
}

async function loadAssets(assets: { type: string; url: string }[]): Promise<void> {
	for (const asset of assets) {
		if (asset.type === "css") await loadCss(asset.url);
		else await loadScript(asset.url);
	}
}

export type ExternalLibs = Record<string, unknown>;

export async function loadExternalLibs(needMath: boolean, mathLib: "katex" | "mathjax"): Promise<ExternalLibs> {
	const libs: ExternalLibs = {};
	const w = window as unknown as Record<string, unknown>;

	// CodeMirror — always load for code view syntax highlighting
	await loadAssets(CM_ASSETS);
	if (w.CodeMirror) {
		libs.codeMirror = { src: w.CodeMirror };
	}

	// KaTeX — load when math button is present and katex is selected
	if (needMath && mathLib === "katex") {
		await loadAssets(KATEX_ASSETS);
		if (w.katex) {
			libs.katex = { src: w.katex };
		}
	}

	// MathJax — not supported via CDN in playground (requires mathjax-full npm package)

	return libs;
}
