import { describe, expect, it } from "vitest";
import apiDocs from "../../src/data/api/api-docs.en.json";
import frameworks from "../../src/data/snippets/frameworks";
import { getRenderSnippet } from "../../src/data/snippets/renderSnippets";

const starter = Object.fromEntries(frameworks.map(({ key, snippet }) => [key, snippet]));
const cdn = `https://cdn.jsdelivr.net/npm/suneditor@${apiDocs.version}/dist`;

describe("Getting Started snippets", () => {
	it("closes both CDN scripts and targets the matching textarea", () => {
		const html = starter["javascript-cdn"];
		expect(html).toContain(`href="${cdn}/suneditor.min.css"`);
		expect(html).toContain(`<script src="${cdn}/suneditor.min.js"></script>`);
		expect(html.match(/<\/script>/g)).toHaveLength(2);
		expect(html).toContain('<textarea id="my-editor"></textarea>');
		expect(html).toContain('SUNEDITOR.create("#my-editor",');
	});

	it("documents the host and targets its ID in the npm example", () => {
		const js = starter["javascript-npm"];
		expect(js).toContain(`// npm i suneditor@${apiDocs.version}`);
		expect(js).toContain('<textarea id="my-editor"></textarea>');
		expect(js).toContain('suneditor.create("#my-editor",');
	});

	it("pins the rendered contents stylesheet and references the v3 getter", () => {
		const html = getRenderSnippet("javascript-cdn").code;
		expect(html).toContain(`href="${cdn}/suneditor-contents.min.css"`);
		expect(html).toContain("editor.$.html.get()");
	});
});
