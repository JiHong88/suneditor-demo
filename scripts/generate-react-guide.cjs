#!/usr/bin/env node
/**
 * Generates src/data/react-guide/react-guide.en.md from the README of the installed
 * `@suneditor/suneditor-react` package (so the guide always matches the version the site emits code for).
 *
 * Keeps only the reference body: from the first H2 (the page hero covers the logo, badges and intro)
 * up to "## Development" (contributor notes, license).
 *
 * Usage: npm run docs:generate   (then npm run react-guide:translate for the other locales)
 */
const fs = require("fs");
const path = require("path");

const PKG_DIR = path.join(__dirname, "../node_modules/@suneditor/suneditor-react");
const OUT_DIR = path.join(__dirname, "../src/data/react-guide");
const OUT_FILE = path.join(OUT_DIR, "react-guide.en.md");

const { version } = JSON.parse(fs.readFileSync(path.join(PKG_DIR, "package.json"), "utf-8"));
const readme = fs.readFileSync(path.join(PKG_DIR, "README.md"), "utf-8");

const firstH2 = readme.search(/^## /m);
let body = firstH2 === -1 ? readme : readme.slice(firstH2);
const devIdx = body.indexOf("\n## Development");
if (devIdx !== -1) body = body.slice(0, devIdx);
body = body.trim();

if (!body.startsWith("## ")) {
	console.error("[react-guide] README has no H2 sections — nothing generated.");
	process.exit(1);
}

const header = `<!-- Generated from @suneditor/suneditor-react@${version} README.md by scripts/generate-react-guide.cjs. Do not edit; run \`npm run docs:generate\`. -->`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, `${header}\n\n${body}\n`, "utf-8");
console.log(`[react-guide] Generated ${path.relative(process.cwd(), OUT_FILE)} from @suneditor/suneditor-react@${version}`);
