"use client";

import { useEffect, useState } from "react";
import type { Highlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	if (!highlighterPromise) {
		highlighterPromise = import("shiki").then((mod) =>
			mod.createHighlighter({
				themes: ["github-light", "github-dark"],
				langs: ["javascript", "html", "jsx", "vue", "typescript", "bash", "css", "svelte"],
			})
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

	if (!html) {
		return (
			<pre className={className} style={{ padding: "1rem", fontSize: "0.875rem", lineHeight: 1.7, overflow: "auto" }}>
				<code>{code}</code>
			</pre>
		);
	}

	return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
