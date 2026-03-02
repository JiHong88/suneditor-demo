import React from "react";

const CODE_STYLE =
	"px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-mono";

/** Parse `backtick` and "quoted" text into <code> elements, and \n into <br/> */
export function highlightInline(text: string): React.ReactNode {
	const lines = text.split("\n");
	const result: React.ReactNode[] = [];

	for (let li = 0; li < lines.length; li++) {
		if (li > 0) result.push(<br key={`br-${li}`} />);

		const line = lines[li];
		const regex = /`([^`]+)`|"([^"]+)"/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(line)) !== null) {
			if (match.index > lastIndex) {
				result.push(line.substring(lastIndex, match.index));
			}
			result.push(
				<code key={`${li}-${match.index}`} className={CODE_STYLE}>
					{match[1] || match[2]}
				</code>,
			);
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < line.length) {
			result.push(line.substring(lastIndex));
		}
	}

	return result.length > 0 ? <>{result}</> : text;
}
