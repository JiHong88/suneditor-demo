/**
 * Patches option/frameOption method descriptions in translated api-docs files
 * with locale-specific descriptions from option-descriptions.{locale}.json.
 *
 * This ensures api-docs and playground tooltips share the same translations.
 *
 * Usage:
 *   node scripts/add-accessor-subgroups.cjs
 *
 * Prerequisites:
 *   1. generate-api-docs.cjs has been run (creates api-docs.en.json with accessor subgroups)
 *   2. translate-api-docs.cjs has been run for each locale
 *   3. translate-option-desc.cjs has been run for each locale
 */
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.resolve(__dirname, "../src/data/api");
const LOCALES = ["ko", "ar"];

for (const locale of LOCALES) {
	const apiPath = path.join(DATA_DIR, `api-docs.${locale}.json`);
	const optDescPath = path.join(DATA_DIR, `option-descriptions.${locale}.json`);

	if (!fs.existsSync(apiPath) || !fs.existsSync(optDescPath)) {
		console.log(`⚠ Skipping ${locale}: missing files`);
		continue;
	}

	const apiDocs = JSON.parse(fs.readFileSync(apiPath, "utf8"));
	const optDesc = JSON.parse(fs.readFileSync(optDescPath, "utf8"));

	let patchCount = 0;

	// Patch options and frameOptions subgroup method descriptions
	for (const subKey of ["options", "frameOptions"]) {
		const subgroup = apiDocs.structure.editor?.subgroups?.[subKey];
		if (!subgroup?.methods) continue;

		for (const method of subgroup.methods) {
			const entry = optDesc[method.name];
			if (entry?.description) {
				method.description = entry.description;
				patchCount++;
			}
		}
	}

	fs.writeFileSync(apiPath, JSON.stringify(apiDocs, null, "\t") + "\n", "utf8");
	console.log(`✓ ${locale}: patched ${patchCount} option descriptions`);
}

console.log("\nDone!");
