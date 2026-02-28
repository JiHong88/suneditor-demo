#!/usr/bin/env node

const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const TYPES_DIR = path.join(__dirname, "../node_modules/suneditor/types");
const OUTPUT_DIR = path.join(__dirname, "../src/data/api");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "api-docs.json");
const OPTIONS_OUTPUT_FILE = path.join(OUTPUT_DIR, "option-descriptions.json");

/* ── Shared helpers ─────────────────────────────────────── */

function createProgramForFile(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);
	if (!fs.existsSync(fullPath)) return null;

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	return { program, sourceFile: program.getSourceFile(fullPath), fullPath };
}

function makeJSDocExtractor(sourceFile) {
	return function extractJSDoc(node) {
		const fullText = sourceFile.getFullText();
		const ranges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
		if (!ranges || ranges.length === 0) return { description: "", example: "" };

		const comment = fullText.substring(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);

		// Extract @description
		let description = "";
		const descMatch = comment.match(/@description\s+([^\n]+(?:\n\s*\*\s*[^@\n]+)*)/);
		if (descMatch) {
			description = descMatch[1]
				.split("\n")
				.map((l) => l.replace(/^\s*\*\s*/, "").trim())
				.filter((l) => l)
				.join(" ")
				.trim();
		} else {
			const lines = comment
				.split("\n")
				.map((l) => l.replace(/^\s*\*\s*/, "").trim())
				.filter((l) => l && !l.startsWith("@") && l !== "/**" && l !== "*/");
			description = lines.join(" ").trim();
		}

		// Extract @example
		let example = "";
		const exampleMatch = comment.match(/@example\s+([\s\S]*?)(?=@\w+|$)/);
		if (exampleMatch) {
			example = exampleMatch[1]
				.split("\n")
				.map((l) => l.replace(/^\s*\*\s*/, ""))
				.filter((l) => {
					const trimmed = l.trim();
					return trimmed && trimmed !== "*/" && trimmed !== "/";
				})
				.join("\n")
				.trim();
		}

		return { description, example };
	};
}

function makeTypeGetter(sourceFile) {
	return function getType(typeNode) {
		if (!typeNode) return "any";
		try {
			const text = typeNode.getText(sourceFile);
			if (text.includes("Omit<")) return "void";
			return text;
		} catch {
			return "any";
		}
	};
}

function extractParamsFromList(parameters, sourceFile, getType) {
	return (parameters || [])
		.map((p) => {
			const pName = p.name.getText(sourceFile);
			if (pName === "this") return null;
			const pType = p.type ? getType(p.type) : "any";
			const opt = p.questionToken ? "?" : "";
			return `${pName}${opt}: ${pType}`;
		})
		.filter((p) => p !== null);
}

/* ── Extract export list from index.d.ts ────────────────── */

function extractExportsFromIndex(indexFilePath) {
	const fullPath = path.join(TYPES_DIR, indexFilePath);
	if (!fs.existsSync(fullPath)) {
		console.log(`Index file not found: ${fullPath}`);
		return [];
	}

	const content = fs.readFileSync(fullPath, "utf8");
	const exports = [];
	const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/(.+?)['"];/g;
	let match;
	while ((match = importRegex.exec(content)) !== null) {
		exports.push({ name: match[1], path: match[2] });
	}
	return exports;
}

/* ── Extract public methods from a class ────────────────── */

function extractMethodsFromClass(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const methods = [];

	function visit(node) {
		if (ts.isClassDeclaration(node)) {
			node.members.forEach((member) => {
				if ((ts.isMethodDeclaration(member) || ts.isMethodSignature(member) || ts.isPropertySignature(member)) && member.name) {
					try {
						const name = member.name.getText(sourceFile);
						if (name.startsWith("_") || name === "constructor") return;

						if (ts.isMethodSignature(member) || ts.isMethodDeclaration(member)) {
							const params = extractParamsFromList(member.parameters, sourceFile, getType);
							const jsDoc = extractJSDoc(member);
							methods.push({
								name,
								params: params.join(", "),
								returns: member.type ? getType(member.type) : "void",
								description: jsDoc.description,
								example: jsDoc.example,
							});
						} else if (ts.isPropertySignature(member) && member.type && ts.isFunctionTypeNode(member.type)) {
							const params = extractParamsFromList(member.type.parameters, sourceFile, getType);
							const jsDoc = extractJSDoc(member);
							methods.push({
								name,
								params: params.join(", "),
								returns: member.type.type ? getType(member.type.type) : "void",
								description: jsDoc.description,
								example: jsDoc.example,
							});
						}
					} catch (e) {
						console.error("Error parsing method:", e.message);
					}
				}
			});
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return methods;
}

/* ── Extract methods from function return type (history.d.ts pattern) ── */

function extractMethodsFromFunctionReturnType(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const methods = [];

	function visit(node) {
		if (ts.isFunctionDeclaration(node) && node.type && ts.isTypeLiteralNode(node.type)) {
			node.type.members.forEach((member) => {
				if ((ts.isMethodSignature(member) || ts.isPropertySignature(member)) && member.name) {
					try {
						const name = member.name.getText(sourceFile);
						let params = [];
						let returns = "void";

						if (ts.isMethodSignature(member)) {
							params = extractParamsFromList(member.parameters, sourceFile, getType);
							returns = member.type ? getType(member.type) : "void";
						} else if (ts.isPropertySignature(member) && member.type && ts.isFunctionTypeNode(member.type)) {
							params = extractParamsFromList(member.type.parameters, sourceFile, getType);
							returns = member.type.type ? getType(member.type.type) : "void";
						}

						const jsDoc = extractJSDoc(member);
						methods.push({ name, params: params.join(", "), returns, description: jsDoc.description, example: jsDoc.example });
					} catch (e) {
						console.error("Error parsing return type method:", e.message);
					}
				}
			});
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return methods;
}

/* ── Extract exported functions (helpers) ───────────────── */

function extractExportedFunctions(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const functions = [];

	function visit(node) {
		if (ts.isFunctionDeclaration(node) && node.name) {
			const modifiers = node.modifiers;
			const isExported = modifiers && modifiers.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
			if (isExported) {
				try {
					const name = node.name.getText(sourceFile);
					const params = (node.parameters || []).map((p) => {
						const pName = p.name.getText(sourceFile);
						const pType = p.type ? getType(p.type) : "any";
						const opt = p.questionToken ? "?" : "";
						return `${pName}${opt}: ${pType}`;
					});

					const jsDoc = extractJSDoc(node);
					functions.push({ name, params: params.join(", "), returns: node.type ? getType(node.type) : "void", description: jsDoc.description, example: jsDoc.example });
				} catch (e) {
					console.error("Error parsing function:", e.message);
				}
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return functions;
}

/* ── Extract type definitions ───────────────────────────── */

function extractTypeDefinitions(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const types = [];

	function visit(node) {
		if (ts.isTypeAliasDeclaration(node)) {
			const name = node.name.getText(sourceFile);
			const typeText = node.type.getText(sourceFile);
			types.push({ name, definition: typeText, kind: "type" });
		} else if (ts.isInterfaceDeclaration(node)) {
			const name = node.name.getText(sourceFile);
			const members = node.members
				.map((m) => {
					try {
						return m.getText(sourceFile);
					} catch {
						return null;
					}
				})
				.filter((m) => m !== null)
				.join("\n");
			types.push({ name, definition: members, kind: "interface" });
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return types;
}

/* ── Extract events from declare function declarations ──── */

function extractEventHandlers(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const events = [];

	function visit(node) {
		// Match: declare function onXxx(params: { ... }): ReturnType;
		if (ts.isFunctionDeclaration(node) && node.name) {
			const modifiers = node.modifiers;
			const isDeclare = modifiers && modifiers.some((m) => m.kind === ts.SyntaxKind.DeclareKeyword);
			if (!isDeclare) {
				ts.forEachChild(node, visit);
				return;
			}

			try {
				const name = node.name.getText(sourceFile);
				const params = (node.parameters || []).map((p) => {
					const pName = p.name.getText(sourceFile);
					const pType = p.type ? getType(p.type) : "any";
					const opt = p.questionToken ? "?" : "";
					return `${pName}${opt}: ${pType}`;
				});

				const jsDoc = extractJSDoc(node);
				events.push({
					name,
					params: params.join(", "),
					returns: node.type ? getType(node.type) : "void",
					description: jsDoc.description,
					example: jsDoc.example,
				});
			} catch (e) {
				console.error("Error parsing event:", e.message);
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return events;
}

/* ── Extract option descriptions from JSDoc @property in @typedef blocks ── */

function extractOptionDescriptions(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);
	if (!fs.existsSync(fullPath)) return {};

	const content = fs.readFileSync(fullPath, "utf8");
	const options = {};

	// Match @property lines with nested braces in type: @property {type} [name=default] - Description
	// Uses a function to handle nested {} in type annotations
	const lines = content.split("\n");
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const propStart = line.match(/\*\s*@property\s+\{/);
		if (!propStart) continue;

		// Find matching closing brace (handle nested braces)
		let fullLine = line;
		let braceCount = 0;
		let foundClose = false;
		for (let c = 0; c < fullLine.length; c++) {
			if (fullLine[c] === "{") braceCount++;
			if (fullLine[c] === "}") {
				braceCount--;
				if (braceCount === 0) {
					foundClose = true;
					break;
				}
			}
		}

		// If braces span multiple lines, collect them
		let j = i;
		while (!foundClose && j < lines.length - 1) {
			j++;
			fullLine += " " + lines[j].replace(/^\s*\*\s*/, "").trim();
			for (let c = fullLine.lastIndexOf(lines[j].trim().charAt(0)); c < fullLine.length; c++) {
				if (fullLine[c] === "{") braceCount++;
				if (fullLine[c] === "}") {
					braceCount--;
					if (braceCount === 0) {
						foundClose = true;
						break;
					}
				}
			}
		}

		// Extract name and description after the type
		const afterType = fullLine.replace(/^.*?@property\s+\{[^]*?\}\s*/, "");
		const nameMatch = afterType.match(/\[?(\w+)(?:=[^\]]*)?\]?\s+-\s+(.+)/);
		if (!nameMatch) continue;

		const name = nameMatch[1];
		if (name.startsWith("_")) continue;

		// Collect multi-line description (following lines starting with " * - ")
		let desc = nameMatch[2].trim();
		for (let k = (j > i ? j : i) + 1; k < lines.length; k++) {
			const nextLine = lines[k].replace(/^\s*\*\s*/, "").trim();
			if (!nextLine || nextLine.startsWith("@") || nextLine === "*/" || nextLine.startsWith("===") || nextLine.startsWith("---") || nextLine === "///") break;
			if (nextLine.startsWith("- ")) {
				desc += " " + nextLine;
			} else {
				break;
			}
		}

		if (!options[name]) {
			options[name] = desc;
		}
	}

	return options;
}

/* ── Extract plugin option descriptions from exported type members ── */

function extractPluginOptionDescriptions(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return {};

	const { sourceFile } = ctx;
	const options = {};

	function visit(node) {
		if (ts.isTypeAliasDeclaration(node)) {
			const typeName = node.name.getText(sourceFile);
			if (!typeName.endsWith("PluginOptions")) {
				ts.forEachChild(node, visit);
				return;
			}

			// Get plugin prefix from type name (e.g. "ImagePluginOptions" -> "image", "FontSizePluginOptions" -> "fontSize")
			const raw = typeName.replace("PluginOptions", "");
			const pluginName = raw.charAt(0).toLowerCase() + raw.slice(1);

			// Extract members with their JSDoc
			if (node.type && ts.isTypeLiteralNode(node.type)) {
				node.type.members.forEach((member) => {
					if (ts.isPropertySignature(member) && member.name) {
						try {
							const propName = member.name.getText(sourceFile);

							// Get JSDoc comment
							const fullText = sourceFile.getFullText();
							const ranges = ts.getLeadingCommentRanges(fullText, member.getFullStart());
							if (ranges && ranges.length > 0) {
								const comment = fullText.substring(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);
								const lines = comment
									.split("\n")
									.map((l) => l.replace(/^\s*\*\s*/, "").trim())
									.filter((l) => l && !l.startsWith("@") && l !== "/**" && l !== "*/" && l !== "-");

								// First line starting with "- " is the description
								let desc = "";
								for (const line of lines) {
									if (line.startsWith("- ")) {
										desc = line.slice(2).trim();
										break;
									} else if (line && !line.startsWith("///")) {
										desc = line;
										break;
									}
								}

								if (desc) {
									options[`${pluginName}_${propName}`] = desc;
								}
							}
						} catch {
							/* skip */
						}
					}
				});
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return options;
}

/* ── Discover .d.ts files in directories recursively ────── */

function discoverFiles(dirs) {
	const result = [];
	dirs.forEach((dir) => {
		const dirPath = path.join(TYPES_DIR, dir);
		if (!fs.existsSync(dirPath)) return;
		const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".d.ts") && !f.startsWith("_"));
		files.forEach((file) => {
			const key = path.basename(file, ".d.ts");
			result.push({ key, file: `${dir}/${file}` });
		});
	});
	return result;
}

/* ── Try all extraction strategies for a file ───────────── */

function extractMethodsAny(file) {
	let methods = extractMethodsFromClass(file);
	if (methods.length === 0) methods = extractMethodsFromFunctionReturnType(file);
	if (methods.length === 0) methods = extractExportedFunctions(file);
	return methods;
}

/* ────────────────────────────────────────────────────────── */
/*                        MAIN                               */
/* ────────────────────────────────────────────────────────── */

console.log("🔍 Generating comprehensive SunEditor API documentation\n");

// Get version
let suneditorVersion = "3.x.x";
try {
	const suneditorPkg = JSON.parse(fs.readFileSync(path.join(TYPES_DIR, "../package.json"), "utf-8"));
	suneditorVersion = suneditorPkg.version;
	console.log(`📦 SunEditor version: ${suneditorVersion}\n`);
} catch (e) {
	console.warn("⚠ Could not read suneditor package version:", e.message);
}

const apiDocs = {
	version: suneditorVersion,
	generatedAt: new Date().toISOString(),
	structure: {
		editor: {
			title: "Editor Instance",
			description: "Main editor methods (editor.method())",
			methods: [],
			subgroups: {},
		},
	},
};

// ── 1. Editor Instance ──
console.log("📦 Editor Instance:");
const editorMethods = extractMethodsFromClass("core/editor.d.ts");
if (editorMethods.length > 0) {
	apiDocs.structure.editor.methods = editorMethods;
	console.log(`  ✓ Editor Instance (${editorMethods.length} public methods)`);
}

// ── 2. Core Classes (event, config, kernel, logic) ──
console.log("\n📦 Core Classes:");
const coreClassDirs = [
	// event subsystem
	"core/event",
	// config
	"core/config",
	// kernel
	"core/kernel",
	// logic - dom
	"core/logic/dom",
	// logic - panel
	"core/logic/panel",
	// logic - shell
	"core/logic/shell",
	// section
	"core/section",
];
const coreClasses = discoverFiles(coreClassDirs);

coreClasses.forEach(({ key, file }) => {
	const methods = extractMethodsAny(file);
	if (methods.length > 0) {
		const title = `editor.${key}`;
		apiDocs.structure.editor.subgroups[key] = { title, description: `${key} methods`, methods };
		console.log(`  ✓ ${title} (${methods.length} methods)`);
	}
});

// ── 3. Plugins ──
console.log("\n📦 Plugins:");
const pluginExports = extractExportsFromIndex("plugins/index.d.ts");
apiDocs.structure.plugins = { title: "Plugins", description: "Feature plugins", methods: [], subgroups: {} };

pluginExports.forEach(({ name, path: relativePath }) => {
	const title = name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
	const type = relativePath.split("/")[0];

	const folderIndexPath = `plugins/${relativePath}/index.d.ts`;
	const directFilePath = `plugins/${relativePath}.d.ts`;
	let file;
	if (fs.existsSync(path.join(TYPES_DIR, folderIndexPath))) file = folderIndexPath;
	else if (fs.existsSync(path.join(TYPES_DIR, directFilePath))) file = directFilePath;
	else {
		console.log(`  ⚠ ${title}: File not found`);
		return;
	}

	const methods = extractMethodsFromClass(file);
	if (methods.length > 0) {
		apiDocs.structure.plugins.subgroups[name] = { title, type, methods };
		console.log(`  ✓ ${title} (${methods.length} methods)`);
	}
});

// ── 4. Modules ──
console.log("\n📦 Modules:");
apiDocs.structure.modules = { title: "Modules", description: "Reusable UI components", methods: [], subgroups: {} };

// Try index.d.ts first, then discover directories
const moduleExports = extractExportsFromIndex("modules/index.d.ts");
if (moduleExports.length > 0) {
	moduleExports.forEach(({ name }) => {
		const file = `modules/${name}.d.ts`;
		const title = name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
		const methods = extractMethodsFromClass(file);
		if (methods.length > 0) {
			apiDocs.structure.modules.subgroups[name] = { title, methods };
			console.log(`  ✓ ${title} (${methods.length} methods)`);
		}
	});
} else {
	// Discover from subdirectories
	const moduleDirs = ["modules/contract", "modules/manager", "modules/ui"];
	const moduleFiles = discoverFiles(moduleDirs);
	moduleFiles.forEach(({ key, file }) => {
		const methods = extractMethodsAny(file);
		if (methods.length > 0) {
			const title = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()).trim();
			apiDocs.structure.modules.subgroups[key] = { title, methods };
			console.log(`  ✓ ${title} (${methods.length} methods)`);
		}
	});
}

// ── 5. Helper Utilities ──
console.log("\n📦 Helper Utilities:");
apiDocs.structure.helpers = { title: "Helper Utilities", description: "Pure utility functions", methods: [], subgroups: {} };

const helperFiles = discoverFiles(["helper", "helper/dom"]);
helperFiles.forEach(({ key, file }) => {
	const methods = extractExportedFunctions(file);
	if (methods.length > 0) {
		const title = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
		apiDocs.structure.helpers.subgroups[key] = { title, description: `${title} utility functions`, methods };
		console.log(`  ✓ ${title} (${methods.length} functions)`);
	}
});

// ── 6. Events ──
console.log("\n📦 Events:");
const eventHandlers = extractEventHandlers("events.d.ts");
apiDocs.structure.events = {
	title: "Event Callbacks",
	description: "Event handlers (options.events)",
	methods: eventHandlers,
};
console.log(`  ✓ Event Callbacks (${eventHandlers.length} events)`);

// ── 7. Type Definitions ──
console.log("\n📦 Type Definitions:");
apiDocs.structure.types = { title: "Type Definitions", description: "TypeScript type and interface definitions", items: [] };

const typeMap = new Map();

// typedef.d.ts (single file, not a directory)
const typedefPath = path.join(TYPES_DIR, "typedef.d.ts");
if (fs.existsSync(typedefPath)) {
	const types = extractTypeDefinitions("typedef.d.ts");
	types.forEach((type) => {
		if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: "typedef.d.ts" });
	});
}

// typedef directory (if exists)
const typedefDir = path.join(TYPES_DIR, "typedef");
if (fs.existsSync(typedefDir) && fs.statSync(typedefDir).isDirectory()) {
	const typedefFiles = fs.readdirSync(typedefDir).filter((f) => f.endsWith(".d.ts"));
	typedefFiles.forEach((file) => {
		const types = extractTypeDefinitions(`typedef/${file}`);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: `typedef/${file}` });
		});
	});
}

// Core schema files
["core/schema/options.d.ts", "core/schema/context.d.ts", "core/schema/frameContext.d.ts", "core/editor.d.ts"].forEach((file) => {
	if (fs.existsSync(path.join(TYPES_DIR, file))) {
		const types = extractTypeDefinitions(file);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: file });
		});
	}
});

// Events types
const eventTypes = extractTypeDefinitions("events.d.ts");
eventTypes.forEach((type) => {
	if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: "events.d.ts" });
});

// Plugin types
pluginExports.forEach(({ path: relativePath }) => {
	const folderIndexPath = `plugins/${relativePath}/index.d.ts`;
	const directFilePath = `plugins/${relativePath}.d.ts`;
	let file;
	if (fs.existsSync(path.join(TYPES_DIR, folderIndexPath))) file = folderIndexPath;
	else if (fs.existsSync(path.join(TYPES_DIR, directFilePath))) file = directFilePath;
	if (file) {
		const types = extractTypeDefinitions(file);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: file });
		});
	}
});

apiDocs.structure.types.items = Array.from(typeMap.values());
console.log(`  ✓ Type Definitions (${apiDocs.structure.types.items.length} types)`);

// ── 8. Option Descriptions (for playground tooltips) ──
console.log("\n📦 Option Descriptions:");
const optionDescriptions = {};

// Frame options (EditorFrameOptions)
const frameOpts = extractOptionDescriptions("core/schema/options.d.ts");
Object.assign(optionDescriptions, frameOpts);

// Base options (EditorBaseOptions)
// Already included in the same file
console.log(`  ✓ Base & Frame options (${Object.keys(optionDescriptions).length} options)`);

// Plugin option descriptions
const pluginOptionFiles = new Set();
pluginExports.forEach(({ path: relativePath }) => {
	const folderIndexPath = `plugins/${relativePath}/index.d.ts`;
	const directFilePath = `plugins/${relativePath}.d.ts`;
	if (fs.existsSync(path.join(TYPES_DIR, folderIndexPath))) pluginOptionFiles.add(folderIndexPath);
	else if (fs.existsSync(path.join(TYPES_DIR, directFilePath))) pluginOptionFiles.add(directFilePath);
});

let pluginOptCount = 0;
pluginOptionFiles.forEach((file) => {
	const pluginOpts = extractPluginOptionDescriptions(file);
	const count = Object.keys(pluginOpts).length;
	pluginOptCount += count;
	Object.assign(optionDescriptions, pluginOpts);
});
console.log(`  ✓ Plugin options (${pluginOptCount} options from ${pluginOptionFiles.size} plugins)`);
console.log(`  ✓ Total: ${Object.keys(optionDescriptions).length} option descriptions`);

// ── Write output files ──
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apiDocs, null, 2), "utf-8");
fs.writeFileSync(OPTIONS_OUTPUT_FILE, JSON.stringify(optionDescriptions, null, 2), "utf-8");

const totalMethods =
	apiDocs.structure.editor.methods.length +
	Object.values(apiDocs.structure.editor.subgroups).reduce((sum, g) => sum + g.methods.length, 0) +
	apiDocs.structure.events.methods.length;

console.log(`\n✅ Generated!`);
console.log(`📝 ${OUTPUT_FILE}`);
console.log(`📝 ${OPTIONS_OUTPUT_FILE}`);
console.log(`📊 ${totalMethods} total methods/events\n`);
