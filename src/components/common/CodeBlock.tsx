"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("shiki").then((mod) =>
			mod.createHighlighter({
				themes: ["github-light", "github-dark"],
				langs: ["javascript", "html", "jsx", "vue", "typescript", "bash", "css", "svelte", "json", "diff", "markdown", "yaml", "scss"],
			}),
		);
	}
	return highlighterPromise;
}

type CodeBlockProps = {
	code: string;
	lang?: string;
	className?: string;
};

export default function CodeBlock({ code, lang = "javascript", className }: CodeBlockProps) {
	const [html, setHtml] = useState<string>("");
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		let cancelled = false;
		getHighlighter().then((highlighter) => {
			if (cancelled) return;
			const loadedLangs = highlighter.getLoadedLanguages();
			const safeLang = loadedLangs.includes(lang) ? lang : "text";
			const result = highlighter.codeToHtml(code, {
				lang: safeLang,
				themes: { light: "github-light", dark: "github-dark" },
				defaultColor: false,
			});
			setHtml(result);
		});
		return () => {
			cancelled = true;
		};
	}, [code, lang]);

	const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
		if ((e.ctrlKey || e.metaKey) && e.key === "a") {
			e.preventDefault();
			const sel = window.getSelection();
			if (sel && ref.current) {
				const range = document.createRange();
				range.selectNodeContents(ref.current);
				sel.removeAllRanges();
				sel.addRange(range);
			}
		}
	}, []);

	return (
		<div
			ref={ref as React.RefObject<HTMLDivElement>}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			className={`[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-[1.7] ${className ?? ""}`}
		>
			{html ? (
				<div dangerouslySetInnerHTML={{ __html: html }} />
			) : (
				<pre><code>{code}</code></pre>
			)}
		</div>
	);
}
