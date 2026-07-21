import React from "react";
import { highlightInline } from "@/lib/highlightInline";

/**
 * Split a JSDoc-style description on the " - " / "\n- " convention.
 * Both the api-docs generator (spaces: `a - b`) and the option descriptions
 * (newlines: `a\n- b`) use a dash delimiter; `\s+-\s+` covers both, and " * "
 * is treated the same way. Leading "- " is stripped first.
 */
export function splitDescriptionParts(desc: string): string[] {
	return desc
		.replace(/^-\s*/, "")
		.split(/\s+-\s+|\s+\*\s+/)
		.map((p) => p.trim())
		.filter(Boolean);
}

/**
 * Render a doc description with the dash convention as bullet line-breaks.
 * Single-part descriptions render as one line (via `as`, default `<p>`).
 * `textClass` controls the font size so it can be reused for small param/returns text.
 */
export function DocDescription({
	desc,
	textClass = "text-sm",
	as = "p",
}: {
	desc: string;
	textClass?: string;
	as?: "p" | "span" | "div";
}): React.ReactNode {
	if (!desc || desc === "/") return null;

	const parts = splitDescriptionParts(desc);
	if (parts.length === 0) return null;

	if (parts.length > 1) {
		return (
			<div className={`${textClass} text-muted-foreground leading-relaxed space-y-1`}>
				{parts.map((part, idx) => (
					<div key={idx} className="flex gap-2">
						{idx > 0 && <span className="text-primary mt-0.5 shrink-0">&#x2022;</span>}
						<span className={idx === 0 ? "" : "flex-1"}>{highlightInline(part)}</span>
					</div>
				))}
			</div>
		);
	}

	const Tag = as;
	return <Tag className={`${textClass} text-muted-foreground leading-relaxed`}>{highlightInline(parts[0])}</Tag>;
}
