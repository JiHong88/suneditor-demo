"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("shiki").then((mod) =>
			mod.createHighlighter({
				themes: ["github-light", "github-dark"],
				langs: ["javascript", "html", "jsx", "vue", "typescript", "bash", "css", "svelte"],
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
			const result = highlighter.codeToHtml(code, {
				lang,
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

	if (!html) {
		return (
			<pre
				ref={ref as React.RefObject<HTMLPreElement>}
				tabIndex={0}
				onKeyDown={handleKeyDown}
				className={className}
				style={{ padding: "1rem", fontSize: "0.75rem", lineHeight: 1.7, overflow: "auto" }}
			>
				<code>{code}</code>
			</pre>
		);
	}

	return (
		<div
			ref={ref as React.RefObject<HTMLDivElement>}
			tabIndex={0}
			onKeyDown={handleKeyDown}
			className={`[&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-xs [&_pre]:leading-[1.7] ${className ?? ""}`}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
