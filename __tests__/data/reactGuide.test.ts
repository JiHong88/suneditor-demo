import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "fs";
import path from "path";
import { routing } from "@/i18n/routing";
import wrapperPkg from "@suneditor/suneditor-react/package.json";

const DIR = path.join(process.cwd(), "src", "data", "react-guide");
const read = (locale: string) => readFileSync(path.join(DIR, `react-guide.${locale}.md`), "utf-8");
const fenceCount = (md: string) => (md.match(/^\s*```/gm) ?? []).length;
const headingCount = (md: string) => (md.match(/^#{1,6} /gm) ?? []).length;

/** Guards the generated React guide: regenerate with `npm run docs:generate` after upgrading the wrapper,
 *  then `npm run react-guide:translate`. */
describe("react guide data", () => {
	const en = read("en");

	it("is generated from the installed wrapper version", () => {
		expect(en.split("\n")[0]).toContain(`@suneditor/suneditor-react@${wrapperPkg.version} `);
	});

	it("keeps only the reference body of the README", () => {
		expect(en).toMatch(/\n## Install\n/);
		expect(en).not.toContain("## Development");
		expect(en).not.toContain("shields.io");
	});

	it.each(routing.locales)("%s has a translation with the English structure intact", (locale) => {
		const file = path.join(DIR, `react-guide.${locale}.md`);
		expect(existsSync(file), `missing ${file} — run npm run react-guide:translate`).toBe(true);
		const md = read(locale);
		expect(fenceCount(md)).toBe(fenceCount(en));
		expect(headingCount(md)).toBe(headingCount(en));
		expect(md).not.toMatch(/⟦|__\s*PH/i); // leftover protection token
		// hard line breaks and link targets survive translation
		expect((md.match(/\\$/gm) ?? []).length).toBe((en.match(/\\$/gm) ?? []).length);
		expect((md.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).sort()).toEqual((en.match(/\]\(https?:\/\/[^)]+\)/g) ?? []).sort());
	});
});
