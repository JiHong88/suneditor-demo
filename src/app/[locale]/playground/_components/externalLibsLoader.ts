/* ── Dynamic import loader for external libraries ──────── */

export type ExternalLibs = Record<string, unknown>;

export type AllLibs = {
	codeMirror: { src: unknown };
	katex: { src: unknown };
	mathjax: Record<string, unknown> | null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const g = globalThis as any;

async function loadMathjax(): Promise<Record<string, unknown> | null> {
	// Polyfill PACKAGE_VERSION before import so mathjax-full/js/components/version.js
	// skips its eval('require') branch (needed in Turbopack where DefinePlugin is not active)
	if (typeof g.PACKAGE_VERSION === "undefined") g.PACKAGE_VERSION = "3.2.1";
	try {
		const [{ mathjax: mj }, { TeX }, { CHTML: CHtmlBase }, { TeXFont }, { browserAdaptor }, { RegisterHTMLHandler }] =
			await Promise.all([
				import("mathjax-full/js/mathjax"),
				import("mathjax-full/js/input/tex"),
				import("mathjax-full/js/output/chtml"),
				import("mathjax-full/js/output/chtml/fonts/tex"),
				import("mathjax-full/js/adaptors/browserAdaptor"),
				import("mathjax-full/js/handlers/html"),
			]);
		const FONT_URL = "https://cdn.jsdelivr.net/npm/mathjax-full@3/es5/output/chtml/fonts/woff-v2";
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		function CHTML(options: Record<string, unknown> | null = null): any {
			const font = new TeXFont({ fontURL: FONT_URL });
			return new CHtmlBase(options ? { ...options, font } : { font });
		}
		return { src: mj, TeX, CHTML, browserAdaptor, RegisterHTMLHandler };
	} catch (err) {
		console.warn("[playground] MathJax load failed", err);
		return null;
	}
}

/** Load all external libs in parallel on mount. Results are module-cached. */
export async function loadAllExternalLibs(): Promise<AllLibs> {
	const [codeMirror, katex, mathjax] = await Promise.all([
		// CodeMirror
		Promise.all([
			import("codemirror"),
			import("codemirror/lib/codemirror.css"),
			import("codemirror/mode/xml/xml"),
			import("codemirror/mode/css/css"),
			import("codemirror/mode/javascript/javascript"),
			import("codemirror/mode/htmlmixed/htmlmixed"),
		]).then(([{ default: CodeMirror }]) => ({ src: CodeMirror })),

		// KaTeX
		Promise.all([
			import("katex"),
			import("katex/dist/katex.min.css"),
		]).then(([{ default: katexLib }]) => ({ src: katexLib })),

		// MathJax
		loadMathjax(),
	]);

	return { codeMirror, katex, mathjax };
}

/** Extract the active subset of libs for the current editor options. */
export function getActiveLibs(allLibs: AllLibs, mathLib: "katex" | "mathjax"): ExternalLibs {
	const libs: ExternalLibs = { codeMirror: allLibs.codeMirror };
	if (mathLib === "mathjax" && allLibs.mathjax) {
		libs.mathjax = allLibs.mathjax;
	} else {
		libs.katex = allLibs.katex;
	}
	return libs;
}
