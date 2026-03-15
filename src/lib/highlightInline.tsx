import React from "react";
import CodeBlock from "@/components/common/CodeBlock";

const CODE_STYLE =
	"px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-mono";

const TYPE_LINK_STYLE =
	"px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs font-mono cursor-pointer hover:underline";

/** Check if backtick content is a TypeName.property reference (e.g. EmbedPluginOptions.embedQuery) */
const TYPE_REF_RE = /^([A-Z]\w+)\.(\w+)$/;

/** Parse inline backtick/quoted text and ```lang code``` blocks */
export function highlightInline(text: string): React.ReactNode {
	// Split on ```lang ... ``` fenced code blocks
	const parts = text.split(/(```\w*\s[\s\S]*?```)/);
	if (parts.length === 1) return highlightText(text);

	const result: React.ReactNode[] = [];
	for (let i = 0; i < parts.length; i++) {
		const part = parts[i];
		if (!part) continue;

		const fenceMatch = part.match(/^```(\w*)\s([\s\S]*?)```$/);
		if (fenceMatch) {
			const lang = fenceMatch[1] || "javascript";
			const code = fenceMatch[2].trim();
			result.push(
				<div key={`cb-${i}`} className="mt-2 rounded-lg overflow-hidden border text-xs [&_pre]:!p-3">
					<CodeBlock code={code} lang={lang} />
				</div>,
			);
		} else {
			result.push(<React.Fragment key={`t-${i}`}>{highlightText(part)}</React.Fragment>);
		}
	}

	return <>{result}</>;
}

/** Parse `backtick`, "quoted" text, and {@link Type.Property} into styled elements, and \n into <br/> */
function highlightText(text: string): React.ReactNode {
	const lines = text.split("\n");
	const result: React.ReactNode[] = [];

	for (let li = 0; li < lines.length; li++) {
		if (li > 0) result.push(<br key={`br-${li}`} />);

		const line = lines[li];
		// Also matches {@link TypeName.PropertyName} for JSDoc-style type links
		const regex = /`([^`]+)`|"([^"]+)"|\{@link ([A-Z]\w+)\.(\w+)\}/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(line)) !== null) {
			if (match.index > lastIndex) {
				result.push(line.substring(lastIndex, match.index));
			}
			if (match[3]) {
				// {@link TypeName.PropertyName}
				const typeName = match[3];
				const propName = match[4];
				result.push(
					<a key={`${li}-${match.index}`} href={`/docs-api?s=types#type-${typeName}`} className={TYPE_LINK_STYLE}>
						{typeName}.{propName}
					</a>,
				);
			} else {
				const content = match[1] || match[2];
				const typeRef = match[1] ? TYPE_REF_RE.exec(content) : null;
				if (typeRef) {
					const typeName = typeRef[1];
					result.push(
						<a key={`${li}-${match.index}`} href={`/docs-api?s=types#type-${typeName}`} className={TYPE_LINK_STYLE}>
							{content}
						</a>,
					);
				} else {
					result.push(
						<code key={`${li}-${match.index}`} className={CODE_STYLE}>
							{content}
						</code>,
					);
				}
			}
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < line.length) {
			result.push(line.substring(lastIndex));
		}
	}

	return result.length > 0 ? <>{result}</> : text;
}
