#!/usr/bin/env node

const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const TYPES_DIR = path.join(__dirname, "../node_modules/suneditor/types");
const OUTPUT_DIR = path.join(__dirname, "../src/data/api");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "api-docs.json");

// Extract export list from index.d.ts file
function extractExportsFromIndex(indexFilePath) {
	const fullPath = path.join(TYPES_DIR, indexFilePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`Index file not found: ${fullPath}`);
		return [];
	}

	const content = fs.readFileSync(fullPath, "utf8");
	const exports = [];

	// Match import statements like: import blockquote from './command/blockquote';
	const importRegex = /import\s+(\w+)\s+from\s+['"]\.\/(.+?)['"];/g;
	let match;

	while ((match = importRegex.exec(content)) !== null) {
		const [, name, relativePath] = match;
		exports.push({
			name,
			path: relativePath,
		});
	}

	return exports;
}

// Extract all public methods from a class
function extractMethodsFromClass(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`   ⚠ File not found: ${fullPath}`);
		return [];
	}

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	const sourceFile = program.getSourceFile(fullPath);
	if (!sourceFile) {
		console.log(`   ⚠ Could not get source file`);
		return [];
	}

	const methods = [];

	function extractJSDoc(node) {
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
			// Otherwise get all non-tag lines
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
					// Filter out empty lines and closing */ tag
					return trimmed && trimmed !== "*/" && trimmed !== "/";
				})
				.join("\n")
				.trim();
		}

		return { description, example };
	}

	function getType(typeNode) {
		if (!typeNode) return "any";
		try {
			const text = typeNode.getText(sourceFile);
			if (text.includes("Omit<")) return "void";
			return text;
		} catch (e) {
			console.error("Error getting type:", e.message);
			return "any";
		}
	}

	function visit(node) {
		if (ts.isClassDeclaration(node)) {
			node.members.forEach((member) => {
				if ((ts.isMethodDeclaration(member) || ts.isMethodSignature(member) || ts.isPropertySignature(member)) && member.name) {
					try {
						const name = member.name.getText(sourceFile);
						// Skip private methods, constructor, and properties
						if (name.startsWith("_") || name.startsWith("__") || name === "constructor") return;

						// Handle method signatures (most common in .d.ts files)
						if (ts.isMethodSignature(member)) {
							const params = (member.parameters || [])
								.map((p) => {
									const pName = p.name.getText(sourceFile);
									// Skip 'this' parameter
									if (pName === "this") return null;
									const pType = p.type ? getType(p.type) : "any";
									const opt = p.questionToken ? "?" : "";
									return `${pName}${opt}: ${pType}`;
								})
								.filter((p) => p !== null);

							const jsDoc = extractJSDoc(member);
							methods.push({
								name,
								params: params.join(", "),
								returns: member.type ? getType(member.type) : "void",
								description: jsDoc.description,
								example: jsDoc.example,
							});
						}
						// Handle property signatures that are function types
						else if (ts.isPropertySignature(member)) {
							if (!member.type || !ts.isFunctionTypeNode(member.type)) {
								return; // Skip non-function properties
							}

							// Extract parameters from function type
							const params = (member.type.parameters || [])
								.map((p) => {
									const pName = p.name.getText(sourceFile);
									// Skip 'this' parameter
									if (pName === "this") return null;
									const pType = p.type ? getType(p.type) : "any";
									const opt = p.questionToken ? "?" : "";
									return `${pName}${opt}: ${pType}`;
								})
								.filter((p) => p !== null);

							const jsDoc = extractJSDoc(member);
							methods.push({
								name,
								params: params.join(", "),
								returns: member.type.type ? getType(member.type.type) : "void",
								description: jsDoc.description,
								example: jsDoc.example,
							});
						}
						// Handle method declarations
						else if (ts.isMethodDeclaration(member)) {
							const params = (member.parameters || [])
								.map((p) => {
									const pName = p.name.getText(sourceFile);
									// Skip 'this' parameter
									if (pName === "this") return null;
									const pType = p.type ? getType(p.type) : "any";
									const opt = p.questionToken ? "?" : "";
									return `${pName}${opt}: ${pType}`;
								})
								.filter((p) => p !== null);

							const jsDoc = extractJSDoc(member);
							methods.push({
								name,
								params: params.join(", "),
								returns: member.type ? getType(member.type) : "void",
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
	return methods.filter((m) => m.name !== "constructor");
}

// Extract methods from function return type (for history.d.ts pattern)
function extractMethodsFromFunctionReturnType(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);

	if (!fs.existsSync(fullPath)) {
		return [];
	}

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	const sourceFile = program.getSourceFile(fullPath);
	if (!sourceFile) return [];

	const methods = [];

	function extractJSDoc(node) {
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
			// Otherwise get all non-tag lines
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
					// Filter out empty lines and closing */ tag
					return trimmed && trimmed !== "*/" && trimmed !== "/";
				})
				.join("\n")
				.trim();
		}

		return { description, example };
	}

	function getType(typeNode) {
		if (!typeNode) return "any";
		try {
			const text = typeNode.getText(sourceFile);
			if (text.includes("Omit<")) return "void";
			return text;
		} catch (e) {
			console.error("Error getting type:", e.message);
			return "any";
		}
	}

	function visit(node) {
		// Check for: export default function Name(...): { methods... }
		if (ts.isFunctionDeclaration(node) && node.type && ts.isTypeLiteralNode(node.type)) {
			node.type.members.forEach((member) => {
				if ((ts.isMethodSignature(member) || ts.isPropertySignature(member)) && member.name) {
					try {
						const name = member.name.getText(sourceFile);

						let params = [];
						let returns = "void";

						if (ts.isMethodSignature(member)) {
							params = (member.parameters || [])
								.map((p) => {
									const pName = p.name.getText(sourceFile);
									if (pName === "this") return null;
									const pType = p.type ? getType(p.type) : "any";
									const opt = p.questionToken ? "?" : "";
									return `${pName}${opt}: ${pType}`;
								})
								.filter((p) => p !== null);
							returns = member.type ? getType(member.type) : "void";
						} else if (ts.isPropertySignature(member) && member.type && ts.isFunctionTypeNode(member.type)) {
							params = (member.type.parameters || [])
								.map((p) => {
									const pName = p.name.getText(sourceFile);
									if (pName === "this") return null;
									const pType = p.type ? getType(p.type) : "any";
									const opt = p.questionToken ? "?" : "";
									return `${pName}${opt}: ${pType}`;
								})
								.filter((p) => p !== null);
							returns = member.type.type ? getType(member.type.type) : "void";
						}

						const jsDoc = extractJSDoc(member);
						methods.push({
							name,
							params: params.join(", "),
							returns,
							description: jsDoc.description,
							example: jsDoc.example,
						});
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

// Extract exported functions (for helpers)
function extractExportedFunctions(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);

	if (!fs.existsSync(fullPath)) {
		return [];
	}

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	const sourceFile = program.getSourceFile(fullPath);
	if (!sourceFile) return [];

	const functions = [];

	function extractJSDoc(node) {
		const fullText = sourceFile.getFullText();
		const ranges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
		if (!ranges || ranges.length === 0) return "";

		const comment = fullText.substring(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);

		const descMatch = comment.match(/@description\s+([^\n]+(?:\n\s*\*\s*[^@\n]+)*)/);
		if (descMatch) {
			return descMatch[1]
				.split("\n")
				.map((l) => l.replace(/^\s*\*\s*/, "").trim())
				.filter((l) => l)
				.join(" ")
				.trim();
		}

		const lines = comment
			.split("\n")
			.map((l) => l.replace(/^\s*\*\s*/, "").trim())
			.filter((l) => l && !l.startsWith("@") && l !== "/**" && l !== "*/");

		return lines.join(" ").trim();
	}

	function getType(typeNode) {
		if (!typeNode) return "any";
		try {
			const text = typeNode.getText(sourceFile);
			return text;
		} catch (e) {
			console.error("Error getting function type:", e.message);
			return "any";
		}
	}

	function visit(node) {
		// Check for export function declarations
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
					functions.push({
						name,
						params: params.join(", "),
						returns: node.type ? getType(node.type) : "void",
						description: jsDoc.description,
						example: jsDoc.example,
					});
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

// Extract type definitions from .d.ts files
function extractTypeDefinitions(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);

	if (!fs.existsSync(fullPath)) {
		return [];
	}

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	const sourceFile = program.getSourceFile(fullPath);
	if (!sourceFile) return [];

	const types = [];

	function visit(node) {
		// TypeAlias declarations
		if (ts.isTypeAliasDeclaration(node)) {
			const name = node.name.getText(sourceFile);
			const typeText = node.type.getText(sourceFile);

			types.push({
				name,
				definition: typeText,
				kind: "type",
			});
		}
		// Interface declarations
		else if (ts.isInterfaceDeclaration(node)) {
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

			types.push({
				name,
				definition: members,
				kind: "interface",
			});
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return types;
}

// Extract event properties from events.d.ts
function extractEventProperties(filePath) {
	const fullPath = path.join(TYPES_DIR, filePath);

	if (!fs.existsSync(fullPath)) {
		console.log(`Events file not found: ${fullPath}`);
		return [];
	}

	const program = ts.createProgram([fullPath], {
		target: ts.ScriptTarget.ES2020,
		module: ts.ModuleKind.CommonJS,
	});

	const sourceFile = program.getSourceFile(fullPath);
	if (!sourceFile) return [];

	const events = [];

	function visit(node) {
		// Look for namespace declarations
		if (ts.isModuleDeclaration(node) && node.body && ts.isModuleBlock(node.body)) {
			node.body.statements.forEach((statement) => {
				// Look for variable statements (let onload: any;)
				if (ts.isVariableStatement(statement)) {
					statement.declarationList.declarations.forEach((declaration) => {
						if (ts.isIdentifier(declaration.name)) {
							const name = declaration.name.getText(sourceFile);
							// Generate a simple description based on the event name
							let description = name
								.replace(/^on/, "")
								.replace(/([A-Z])/g, " $1")
								.toLowerCase()
								.trim();
							description = `Event triggered ${description}`;

							events.push({
								name,
								params: "...args: any[]",
								returns: "any",
								description,
							});
						}
					});
				}
			});
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return events;
}

console.log("🔍 Generating comprehensive SunEditor API documentation\n");

// Get version from suneditor package
let suneditorVersion = "3.x.x"; // fallback
try {
	const suneditorPkg = JSON.parse(fs.readFileSync(path.join(TYPES_DIR, "../package.json"), "utf-8"));
	suneditorVersion = suneditorPkg.version;
	console.log(`📦 SunEditor version: ${suneditorVersion}\n`);
} catch (e) {
	console.warn("⚠ Could not read suneditor package version, using fallback:", e);
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

// Extract Editor main methods from core/editor.d.ts
console.log("\n📦 Editor Instance:");
const editorMethods = extractMethodsFromClass("core/editor.d.ts");
if (editorMethods.length > 0) {
	// Filter out private methods (starting with _) and internal methods (starting with __)
	apiDocs.structure.editor.methods = editorMethods.filter((m) => !m.name.startsWith("_") && !m.name.startsWith("__"));
	console.log(`  ✓ Editor Instance (${apiDocs.structure.editor.methods.length} public methods)`);
}

// Auto-discover core classes from directories
console.log("\n📦 Core Classes:");
const coreClassDirs = ["core/class", "core/base", "core/event"];
const coreClasses = [];

coreClassDirs.forEach((dir) => {
	const dirPath = path.join(TYPES_DIR, dir);
	if (fs.existsSync(dirPath)) {
		const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".d.ts"));
		files.forEach((file) => {
			const key = path.basename(file, ".d.ts");
			const relativePath = `${dir}/${file}`;
			coreClasses.push({ key, file: relativePath });
		});
	}
});

coreClasses.forEach(({ key, file }) => {
	// Try to extract class methods first
	let methods = extractMethodsFromClass(file);

	// If no methods found, try to extract from function return type (for history.d.ts pattern)
	if (methods.length === 0) {
		methods = extractMethodsFromFunctionReturnType(file);
	}

	// If still no methods, try to extract exported functions (for actives, etc.)
	if (methods.length === 0) {
		methods = extractExportedFunctions(file);
	}

	if (methods.length > 0) {
		const title = `editor.${key}`;
		apiDocs.structure.editor.subgroups[key] = {
			title,
			description: `${key} class methods`,
			methods,
		};
		console.log(`  ✓ ${title} (${methods.length} methods)`);
	}
});

// Plugins - auto-extract from index.d.ts
console.log("\n📦 Plugins:");
const pluginExports = extractExportsFromIndex("plugins/index.d.ts");

apiDocs.structure.plugins = { title: "Plugins", description: "Feature plugins", subgroups: {} };

pluginExports.forEach(({ name, path: relativePath }) => {
	// Convert camelCase to Title Case for display
	const title = name.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
	const type = relativePath.split("/")[0]; // command, dropdown, modal, etc.

	// Check if it's a folder with index.d.ts or a direct file
	const folderIndexPath = `plugins/${relativePath}/index.d.ts`;
	const directFilePath = `plugins/${relativePath}.d.ts`;

	let file;
	if (fs.existsSync(path.join(TYPES_DIR, folderIndexPath))) {
		file = folderIndexPath;
	} else if (fs.existsSync(path.join(TYPES_DIR, directFilePath))) {
		file = directFilePath;
	} else {
		console.log(`  ⚠ ${title}: File not found`);
		return;
	}

	const methods = extractMethodsFromClass(file);
	if (methods.length > 0) {
		apiDocs.structure.plugins.subgroups[name] = { title, type, methods };
		console.log(`  ✓ ${title} (${methods.length} methods)`);
	}
});

// Modules - auto-extract from index.d.ts
console.log("\n📦 Modules:");
const moduleExports = extractExportsFromIndex("modules/index.d.ts");

apiDocs.structure.modules = { title: "Modules", description: "Reusable UI components", subgroups: {} };

moduleExports.forEach(({ name }) => {
	const file = `modules/${name}.d.ts`;
	// Convert PascalCase/camelCase to Title Case for display
	const title = name
		.replace(/([A-Z])/g, " $1")
		.replace(/^./, (str) => str.toUpperCase())
		.trim();

	const methods = extractMethodsFromClass(file);
	if (methods.length > 0) {
		apiDocs.structure.modules.subgroups[name] = { title, methods };
		console.log(`  ✓ ${title} (${methods.length} methods)`);
	}
});

// Helper utilities - auto-discover from helper/ directory
console.log("\n📦 Helper Utilities:");
apiDocs.structure.helpers = { title: "Helper Utilities", description: "Pure utility functions", subgroups: {} };

const helperDirs = ["helper", "helper/dom"];
const helpers = [];

helperDirs.forEach((dir) => {
	const dirPath = path.join(TYPES_DIR, dir);
	if (fs.existsSync(dirPath)) {
		const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".d.ts") && f !== "index.d.ts");
		files.forEach((file) => {
			const key = path.basename(file, ".d.ts");
			const relativePath = `${dir}/${file}`;
			helpers.push({ key, file: relativePath });
		});
	}
});

helpers.forEach(({ key, file }) => {
	const methods = extractExportedFunctions(file);
	if (methods.length > 0) {
		// Convert camelCase to Title Case for display
		const title = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
		apiDocs.structure.helpers.subgroups[key] = { title, description: `${title} utility functions`, methods };
		console.log(`  ✓ ${title} (${methods.length} functions)`);
	}
});

// Events - auto-extract from events.d.ts
console.log("\n📦 Events:");
const eventProperties = extractEventProperties("events.d.ts");
apiDocs.structure.events = {
	title: "Event Callbacks",
	description: "Event handlers (options.events)",
	methods: eventProperties,
};
console.log(`  ✓ Event Callbacks (${apiDocs.structure.events.methods.length} events)`);

// Type Definitions - collect from all files
console.log("\n📦 Type Definitions:");
apiDocs.structure.types = { title: "Type Definitions", description: "TypeScript type and interface definitions", items: [] };

const typeMap = new Map(); // To avoid duplicates

// Extract from typedef directory
const typedefDir = path.join(TYPES_DIR, "typedef");
if (fs.existsSync(typedefDir)) {
	const typedefFiles = fs.readdirSync(typedefDir).filter((f) => f.endsWith(".d.ts"));
	typedefFiles.forEach((file) => {
		const types = extractTypeDefinitions(`typedef/${file}`);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) {
				typeMap.set(type.name, { ...type, source: `typedef/${file}` });
			}
		});
	});
}

// Extract from core files
["core/editor.d.ts", "core/config/options.d.ts", "core/config/context.d.ts"].forEach((file) => {
	const types = extractTypeDefinitions(file);
	types.forEach((type) => {
		if (!typeMap.has(type.name)) {
			typeMap.set(type.name, { ...type, source: file });
		}
	});
});

// Extract from plugin files
pluginExports.forEach(({ name, path: relativePath }) => {
	const folderIndexPath = `plugins/${relativePath}/index.d.ts`;
	const directFilePath = `plugins/${relativePath}.d.ts`;

	let file;
	if (fs.existsSync(path.join(TYPES_DIR, folderIndexPath))) {
		file = folderIndexPath;
	} else if (fs.existsSync(path.join(TYPES_DIR, directFilePath))) {
		file = directFilePath;
	}

	if (file) {
		const types = extractTypeDefinitions(file);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) {
				typeMap.set(type.name, { ...type, source: file });
			}
		});
	}
});

apiDocs.structure.types.items = Array.from(typeMap.values());
console.log(`  ✓ Type Definitions (${apiDocs.structure.types.items.length} types)`);

if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(apiDocs, null, 2), "utf-8");

const totalMethods =
	apiDocs.structure.editor.methods.length + Object.values(apiDocs.structure.editor.subgroups).reduce((sum, g) => sum + g.methods.length, 0) + apiDocs.structure.events.methods.length;

console.log(`\n✅ Generated!`);
console.log(`📝 ${OUTPUT_FILE}`);
console.log(`📊 ${totalMethods} total methods\n`);
