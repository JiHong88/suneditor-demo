#!/usr/bin/env node

const ts = require("typescript");
const fs = require("fs");
const path = require("path");

const TYPES_DIR = path.join(__dirname, "../node_modules/suneditor/types");
const OUTPUT_DIR = path.join(__dirname, "../src/data/api");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "api-docs.en.json");
const OPTIONS_OUTPUT_FILE = path.join(OUTPUT_DIR, "option-descriptions.en.json");

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

/**
 * Clean up description artifacts from JSDoc comments
 */
function cleanDescription(desc) {
	if (!desc) return "";
	let cleaned = desc.trim();
	// Remove lone "/" or "*" artifacts
	if (cleaned === "/" || cleaned === "*" || cleaned === "*/") return "";
	// Remove trailing "/" artifacts
	cleaned = cleaned.replace(/\s*\/\s*$/, "").trim();
	// Remove leading "- " if it's the only content
	if (cleaned === "-") return "";
	return cleaned;
}

function makeJSDocExtractor(sourceFile) {
	return function extractJSDoc(node) {
		const fullText = sourceFile.getFullText();
		const ranges = ts.getLeadingCommentRanges(fullText, node.getFullStart());
		if (!ranges || ranges.length === 0) return { description: "", example: "", paramDescriptions: {}, returnsDescription: "" };

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
			// Fallback: get lines before any @tag (except @callback, @class, @interface, @abstract, @optional)
			const lines = comment
				.split("\n")
				.map((l) => l.replace(/^\s*\*\s*/, "").trim())
				.filter((l) => l && !l.startsWith("@") && l !== "/**" && l !== "*/");
			description = lines.reduce((acc, l) => {
				if (!acc) return l;
				return acc + (l.startsWith("- ") || l.startsWith("– ") ? "\n" : " ") + l;
			}, "").trim();
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

		// Extract @param descriptions (line-by-line parsing for robustness with nested braces)
		const paramDescriptions = {};
		const commentLines = comment.split("\n").map((l) => l.replace(/^\s*\*\s?/, "").trimEnd());
		for (let li = 0; li < commentLines.length; li++) {
			const line = commentLines[li].trim();
			if (!line.startsWith("@param")) continue;

			// Skip type annotation: find matching closing brace
			let rest = line.slice(6).trim(); // after "@param"
			if (rest.startsWith("{")) {
				let depth = 0;
				let ci = 0;
				for (; ci < rest.length; ci++) {
					if (rest[ci] === "{") depth++;
					if (rest[ci] === "}") { depth--; if (depth === 0) break; }
				}
				rest = rest.slice(ci + 1).trim();
			}

			// Extract param name (possibly [name] or [name=default])
			let paramName;
			let descPart;
			let isOptional = false;
			let defaultValue;

			if (rest.startsWith("[")) {
				// Optional param: [name] or [name=default]
				const bracketMatch = rest.match(/^\[([^\]]*)\]\s*(.*)/);
				if (!bracketMatch) continue;
				isOptional = true;
				const inner = bracketMatch[1]; // e.g. "options.strictRemove=false"
				const eqIdx = inner.indexOf("=");
				if (eqIdx !== -1) {
					paramName = inner.slice(0, eqIdx).trim();
					defaultValue = inner.slice(eqIdx + 1).trim();
				} else {
					paramName = inner.trim();
				}
				descPart = bracketMatch[2].trim();
			} else {
				const nameMatch = rest.match(/^(\w+(?:\.\w+)*)\s*(.*)/);
				if (!nameMatch) continue;
				paramName = nameMatch[1];
				descPart = nameMatch[2].trim();
			}

			// Build display key with optional/default info
			const optionalSuffix = isOptional ? (defaultValue !== undefined ? `?=${defaultValue}` : "?") : "";

			// Skip dotted sub-params (params.$ etc.) but collect them as sub-descriptions
			if (paramName.includes(".")) {
				const parts = paramName.split(".");
				const parentName = parts[0];
				const subName = parts.slice(1).join(".");
				// Remove leading "- " or "– " from description
				descPart = descPart.replace(/^[-–]\s*/, "").trim();
				if (descPart && subName !== "$" && subName !== "frameContext" && subName !== "event") {
					// Store as "parentName.subName" with optional marker for rich display
					const displayKey = `${parentName}.${subName}${optionalSuffix}`;
					paramDescriptions[displayKey] = descPart;
				}
				continue;
			}

			// Remove leading "- " or "– " from description
			descPart = descPart.replace(/^[-–]\s*/, "").trim();

			// Collect continuation lines (lines starting with "- " that follow)
			for (let lj = li + 1; lj < commentLines.length; lj++) {
				const nextLine = commentLines[lj].trim();
				if (!nextLine || nextLine.startsWith("@")) break;
				if (nextLine.startsWith("- ") || nextLine.startsWith("– ")) {
					descPart += "\n" + nextLine;
				} else {
					break;
				}
			}

			if (descPart) {
				const displayKey = `${paramName}${optionalSuffix}`;
				paramDescriptions[displayKey] = descPart;
			}
		}

		// Extract @returns/@return description (line-by-line)
		let returnsDescription = "";
		for (let li = 0; li < commentLines.length; li++) {
			const line = commentLines[li].trim();
			if (!line.startsWith("@return")) continue;

			let rest = line.replace(/^@returns?\s*/, "").trim();
			// Skip type annotation
			if (rest.startsWith("{")) {
				let depth = 0;
				let ci = 0;
				for (; ci < rest.length; ci++) {
					if (rest[ci] === "{") depth++;
					if (rest[ci] === "}") { depth--; if (depth === 0) break; }
				}
				rest = rest.slice(ci + 1).trim();
			}
			// Remove leading "- "
			rest = rest.replace(/^[-–]\s*/, "").trim();

			// Collect continuation lines
			for (let lj = li + 1; lj < commentLines.length; lj++) {
				const nextLine = commentLines[lj].trim();
				if (!nextLine || nextLine.startsWith("@")) break;
				if (nextLine.startsWith("- ") || nextLine.startsWith("– ")) {
					rest += "\n" + nextLine;
				} else {
					break;
				}
			}

			returnsDescription = rest;
			break;
		}

		return {
			description: cleanDescription(description),
			example,
			paramDescriptions,
			returnsDescription: cleanDescription(returnsDescription),
		};
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

/**
 * Build a method object with JSDoc data
 * @param {string} [memberKind] - "static" | "getter" | "setter" | undefined
 */
function buildMethodObject(name, params, returns, jsDoc, memberKind) {
	const method = {
		name,
		params: params.join(", "),
		returns,
		description: jsDoc.description,
		example: jsDoc.example,
	};

	// Add param descriptions if any exist
	if (Object.keys(jsDoc.paramDescriptions).length > 0) {
		method.paramDescriptions = jsDoc.paramDescriptions;
	}

	// Add returns description if exists
	if (jsDoc.returnsDescription) {
		method.returnsDescription = jsDoc.returnsDescription;
	}

	// Add member kind (static, getter, setter)
	if (memberKind) {
		method.memberKind = memberKind;
	}

	return method;
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
				// Detect member kind: static, getter, setter
				const isStatic = member.modifiers && member.modifiers.some((m) => m.kind === ts.SyntaxKind.StaticKeyword);
				const isGetter = ts.isGetAccessor(member) || ts.isGetAccessorDeclaration(member);
				const isSetter = ts.isSetAccessor(member) || ts.isSetAccessorDeclaration(member);
				const memberKind = isStatic ? "static" : isGetter ? "getter" : isSetter ? "setter" : undefined;

				// Handle getter/setter accessors
				if ((isGetter || isSetter) && member.name) {
					try {
						const name = member.name.getText(sourceFile);
						if (name.startsWith("_")) return;
						const jsDoc = extractJSDoc(member);
						if (isGetter) {
							const returns = member.type ? getType(member.type) : "any";
							methods.push(buildMethodObject(name, [], returns, jsDoc, memberKind));
						} else {
							const params = extractParamsFromList(member.parameters, sourceFile, getType);
							methods.push(buildMethodObject(name, params, "void", jsDoc, memberKind));
						}
					} catch (e) {
						console.error("Error parsing accessor:", e.message);
					}
					return;
				}

				if ((ts.isMethodDeclaration(member) || ts.isMethodSignature(member) || ts.isPropertySignature(member)) && member.name) {
					try {
						const name = member.name.getText(sourceFile);
						if (name.startsWith("_") || name === "constructor") return;

						if (ts.isMethodSignature(member) || ts.isMethodDeclaration(member)) {
							const params = extractParamsFromList(member.parameters, sourceFile, getType);
							const jsDoc = extractJSDoc(member);
							methods.push(buildMethodObject(name, params, member.type ? getType(member.type) : "void", jsDoc, memberKind));
						} else if (ts.isPropertySignature(member) && member.type && ts.isFunctionTypeNode(member.type)) {
							const params = extractParamsFromList(member.type.parameters, sourceFile, getType);
							const jsDoc = extractJSDoc(member);
							methods.push(buildMethodObject(name, params, member.type.type ? getType(member.type.type) : "void", jsDoc, memberKind));
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
						methods.push(buildMethodObject(name, params, returns, jsDoc));
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
					functions.push(buildMethodObject(name, params, node.type ? getType(node.type) : "void", jsDoc));
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

/* ── Extract type definitions with member JSDoc ─────────── */

function extractTypeDefinitions(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const types = [];

	function visit(node) {
		if (ts.isTypeAliasDeclaration(node)) {
			const name = node.name.getText(sourceFile);
			const typeText = node.type.getText(sourceFile);

			// Extract member descriptions for type literal members
			const memberDescriptions = {};
			if (ts.isTypeLiteralNode(node.type)) {
				node.type.members.forEach((member) => {
					if (ts.isPropertySignature(member) && member.name) {
						try {
							const propName = member.name.getText(sourceFile);
							const jsDoc = extractJSDoc(member);
							if (jsDoc.description) {
								memberDescriptions[propName] = jsDoc.description;
							}
						} catch { /* skip */ }
					}
				});
			}

			const typeObj = { name, definition: typeText, kind: "type" };
			if (Object.keys(memberDescriptions).length > 0) {
				typeObj.memberDescriptions = memberDescriptions;
			}
			types.push(typeObj);
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

			// Extract member descriptions for interface members
			const memberDescriptions = {};
			node.members.forEach((member) => {
				if (member.name) {
					try {
						const propName = member.name.getText(sourceFile);
						const jsDoc = extractJSDoc(member);
						if (jsDoc.description) {
							memberDescriptions[propName] = jsDoc.description;
						}
					} catch { /* skip */ }
				}
			});

			const typeObj = { name, definition: members, kind: "interface" };
			if (Object.keys(memberDescriptions).length > 0) {
				typeObj.memberDescriptions = memberDescriptions;
			}
			types.push(typeObj);
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
				events.push(buildMethodObject(name, params, node.type ? getType(node.type) : "void", jsDoc));
			} catch (e) {
				console.error("Error parsing event:", e.message);
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return events;
}

/* ── Extract functions from namespace declarations (hooks/base.d.ts) ── */

function extractNamespaceFunctions(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return {};

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const namespaces = {};

	function visitNamespace(node, parentName) {
		if (ts.isModuleDeclaration(node) && node.name) {
			const nsName = parentName ? `${parentName}.${node.name.text}` : node.name.text;
			if (node.body && ts.isModuleBlock(node.body)) {
				const methods = [];
				node.body.statements.forEach((stmt) => {
					if (ts.isFunctionDeclaration(stmt) && stmt.name) {
						try {
							const name = stmt.name.getText(sourceFile);
							const params = (stmt.parameters || []).map((p) => {
								const pName = p.name.getText(sourceFile);
								const pType = p.type ? getType(p.type) : "any";
								const opt = p.questionToken ? "?" : "";
								return `${pName}${opt}: ${pType}`;
							});

							const jsDoc = extractJSDoc(stmt);
							methods.push(buildMethodObject(name, params, stmt.type ? getType(stmt.type) : "void", jsDoc));
						} catch (e) {
							console.error(`Error parsing namespace function ${nsName}:`, e.message);
						}
					}
					// Recurse into nested namespaces
					if (ts.isModuleDeclaration(stmt)) {
						visitNamespace(stmt, nsName);
					}
				});
				if (methods.length > 0) {
					namespaces[nsName] = methods;
				}
			}
		}
	}

	ts.forEachChild(sourceFile, (node) => visitNamespace(node, ""));

	return namespaces;
}

/* ── Extract methods from interface declarations ────────── */

function extractInterfaceMethods(filePath) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return {};

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const interfaces = {};

	function visit(node) {
		if (ts.isInterfaceDeclaration(node) && node.name) {
			const ifaceName = node.name.getText(sourceFile);
			const methods = [];

			// Get interface-level JSDoc
			const ifaceJSDoc = extractJSDoc(node);

			node.members.forEach((member) => {
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
						} else {
							return; // Skip non-method properties
						}

						const jsDoc = extractJSDoc(member);
						methods.push(buildMethodObject(name, params, returns, jsDoc));
					} catch (e) {
						console.error(`Error parsing interface method ${ifaceName}.${member.name}:`, e.message);
					}
				}
			});

			if (methods.length > 0) {
				interfaces[ifaceName] = {
					description: ifaceJSDoc.description,
					methods,
				};
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return interfaces;
}

/* ── Extract type alias members as property-like methods ─── */

function extractTypeMembersAsProperties(filePath, typeName) {
	const ctx = createProgramForFile(filePath);
	if (!ctx || !ctx.sourceFile) return [];

	const { sourceFile } = ctx;
	const extractJSDoc = makeJSDocExtractor(sourceFile);
	const getType = makeTypeGetter(sourceFile);
	const properties = [];

	function visit(node) {
		if (ts.isTypeAliasDeclaration(node) && node.name.getText(sourceFile) === typeName) {
			if (ts.isTypeLiteralNode(node.type)) {
				node.type.members.forEach((member) => {
					if (ts.isPropertySignature(member) && member.name) {
						try {
							const name = member.name.getText(sourceFile);
							if (name.startsWith("_")) return;
							const typeStr = member.type ? getType(member.type) : "any";
							const jsDoc = extractJSDoc(member);
							properties.push({
								name,
								params: "",
								returns: typeStr,
								description: jsDoc.description,
							});
						} catch (e) {
							console.error(`Error parsing type member ${typeName}.${member.name}:`, e.message);
						}
					}
				});
			}
		}
		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return properties;
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
			const prevLen = fullLine.length;
			fullLine += " " + lines[j].replace(/^\s*\*\s*/, "").trim();
			for (let c = prevLen; c < fullLine.length; c++) {
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

		// Extract name, default value, and description after the type
		const afterType = fullLine.replace(/^.*?@property\s+\{[^]*?\}\s*/, "");
		const nameMatch = afterType.match(/\[?(\w+)(?:=([^\]]*))?\]?\s+-\s+(.+)/);
		if (!nameMatch) continue;

		const name = nameMatch[1];
		if (name.startsWith("_")) continue;

		const defaultValue = nameMatch[2] !== undefined ? nameMatch[2].trim() : undefined;

		// Collect multi-line description (following lines starting with " * - ")
		let desc = nameMatch[3].trim();
		for (let k = (j > i ? j : i) + 1; k < lines.length; k++) {
			const nextLine = lines[k].replace(/^\s*\*\s*/, "").trim();
			if (!nextLine || nextLine.startsWith("@") || nextLine === "*/" || nextLine.startsWith("===") || nextLine.startsWith("---") || nextLine === "///") break;
			if (nextLine.startsWith("- ")) {
				desc += "\n" + nextLine;
			} else {
				break;
			}
		}

		if (!options[name]) {
			options[name] = { description: desc };
			if (defaultValue !== undefined) {
				options[name].default = defaultValue;
			}
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

			/** Extract description from a property member's JSDoc */
			function extractMemberDesc(member, sf) {
				if (!ts.isPropertySignature(member) || !member.name) return null;
				try {
					const propName = member.name.getText(sf);
					const fullText = sf.getFullText();
					const ranges = ts.getLeadingCommentRanges(fullText, member.getFullStart());
					if (!ranges || ranges.length === 0) return null;

					const comment = fullText.substring(ranges[ranges.length - 1].pos, ranges[ranges.length - 1].end);
					const lines = comment
						.split("\n")
						.map((l) => l.replace(/^\s*\*\s*/, "").trim())
						.filter((l) => l && !l.startsWith("@") && l !== "/**" && l !== "*/" && l !== "-");

					let desc = "";
					for (const line of lines) {
						if (line.startsWith("- ")) { desc = line.slice(2).trim(); break; }
						else if (line && !line.startsWith("///")) { desc = line; break; }
					}

					let collecting = false;
					for (const line of lines) {
						if (collecting && line.startsWith("- ")) desc += "\n" + line;
						if (line === desc || line === `- ${desc}`) collecting = true;
					}

					return desc ? { propName, desc } : null;
				} catch { return null; }
			}

			// Extract members with their JSDoc - directly from type literal
			if (node.type && ts.isTypeLiteralNode(node.type)) {
				node.type.members.forEach((member) => {
					const result = extractMemberDesc(member, sourceFile);
					if (result) options[`${pluginName}_${result.propName}`] = { description: result.desc };
				});
			} else {
				// Fallback: use type checker to resolve complex types (e.g. Omit<A & B, ''>)
				try {
					const checker = ctx.program.getTypeChecker();
					const symbol = checker.getSymbolAtLocation(node.name);
					if (symbol) {
						const resolvedType = checker.getDeclaredTypeOfSymbol(symbol);
						const props = resolvedType.getProperties ? resolvedType.getProperties() : [];
						for (const prop of props) {
							const decls = prop.getDeclarations ? prop.getDeclarations() : [];
							if (decls.length > 0 && ts.isPropertySignature(decls[0])) {
								const memberSf = decls[0].getSourceFile();
								if (memberSf) {
									const result = extractMemberDesc(decls[0], memberSf);
									if (result) options[`${pluginName}_${result.propName}`] = { description: result.desc };
								}
							}
						}
					}
				} catch { /* skip */ }
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

// ── 2.5. Store State & Mode properties ──
console.log("\n📦 Store Properties:");
const storeStateProps = extractTypeMembersAsProperties("core/kernel/store.d.ts", "StoreState");
if (storeStateProps.length > 0) {
	apiDocs.structure.editor.subgroups["store.state"] = {
		title: "$.store — State",
		description: "Runtime state properties accessible via $.store.get(key) / $.store.set(key, value)",
		methods: storeStateProps,
	};
	console.log(`  ✓ StoreState (${storeStateProps.length} properties)`);
}

const storeModeProps = extractTypeMembersAsProperties("core/kernel/store.d.ts", "StoreMode");
if (storeModeProps.length > 0) {
	apiDocs.structure.editor.subgroups["store.mode"] = {
		title: "$.store.mode",
		description: "Toolbar display mode flags (immutable after init)",
		methods: storeModeProps,
	};
	console.log(`  ✓ StoreMode (${storeModeProps.length} properties)`);
}

// ── 2.6. Kernel Accessor Subgroups (auto-extracted from type files) ──
console.log("\n📦 Kernel Accessor Subgroups:");

// --- context: from ContextStore type ---
const contextProps = extractTypeMembersAsProperties("core/schema/context.d.ts", "ContextStore");
if (contextProps.length > 0) {
	apiDocs.structure.editor.subgroups["context"] = {
		title: "$.context",
		description: "ContextMap — Global DOM element references shared across all frames. Contains toolbar, statusbar, and other editor-level UI elements. Stored as a Map<string, HTMLElement>.",
		methods: contextProps,
	};
	console.log(`  ✓ $.context (${contextProps.length} properties)`);
}

// --- frameContext: from FrameContextStore type ---
const frameContextProps = extractTypeMembersAsProperties("core/schema/frameContext.d.ts", "FrameContextStore");
if (frameContextProps.length > 0) {
	// Add linkedAs for options → $.frameOptions
	const optEntry = frameContextProps.find((p) => p.name === "options");
	if (optEntry) optEntry.linkedAs = "$.frameOptions";

	apiDocs.structure.editor.subgroups["frameContext"] = {
		title: "$.frameContext",
		description: "FrameContextMap — Per-frame DOM references and state flags for the currently active frame. Contains wysiwyg area, code view, placeholder, and runtime state. Stored as a Map.",
		methods: frameContextProps,
	};
	console.log(`  ✓ $.frameContext (${frameContextProps.length} properties)`);
}

// --- options: from EditorBaseOptions type (keys + types auto-extracted, descriptions from option-descriptions) ---
const baseOptionProps = extractTypeMembersAsProperties("core/schema/options.d.ts", "EditorBaseOptions");
if (baseOptionProps.length > 0) {
	// Filter out private (__) and plugin-specific options
	const publicBaseOptions = baseOptionProps.filter((p) => !p.name.startsWith("__") && !p.name.startsWith("_"));
	apiDocs.structure.editor.subgroups["options"] = {
		title: "$.options",
		description: "BaseOptionsMap — Configuration options applied to the entire editor. Controls plugins, toolbar, themes, content filtering, and UI behavior. Stored as a Map<string, *>.",
		methods: publicBaseOptions,
	};
	console.log(`  ✓ $.options (${publicBaseOptions.length} properties)`);
}

// --- frameOptions: from EditorFrameOptions type ---
const frameOptionProps = extractTypeMembersAsProperties("core/schema/options.d.ts", "EditorFrameOptions");
if (frameOptionProps.length > 0) {
	apiDocs.structure.editor.subgroups["frameOptions"] = {
		title: "$.frameOptions",
		description: "FrameOptionsMap — Configuration options for individual frames. Controls content, sizing, iframe mode, statusbar, and character counter.",
		methods: frameOptionProps,
	};
	console.log(`  ✓ $.frameOptions (${frameOptionProps.length} properties)`);
}

// --- Static accessor subgroups (not extractable from types) ---
apiDocs.structure.editor.subgroups["frameRoots"] = {
	title: "$.frameRoots",
	description: "Map of all frame contexts keyed by root key. In single-root mode, contains one entry with key `null`. In multi-root mode, each root has its own key and FrameContext.",
	methods: [
		{ name: "get", params: "(rootKey: string | null)", returns: "SunEditor.FrameContext", description: "Returns the FrameContext for the given root key." },
		{ name: "set", params: "(rootKey: string | null, frameContext: FrameContext)", returns: "void", description: "Sets the FrameContext for the given root key." },
		{ name: "has", params: "(rootKey: string | null)", returns: "boolean", description: "Checks if a root key exists." },
		{ name: "keys", params: "()", returns: "Iterator<string | null>", description: "Returns an iterator of all root keys." },
		{ name: "values", params: "()", returns: "Iterator<FrameContext>", description: "Returns an iterator of all FrameContext objects." },
	],
};
console.log(`  ✓ $.frameRoots (5 methods — static)`);

apiDocs.structure.editor.subgroups["icons"] = {
	title: "$.icons",
	description: "Icon set object containing SVG strings for all editor UI icons. 156+ icon keys mapped to SVG markup. Customizable via the `icons` option.",
	methods: [
		{ name: "bold", params: "", returns: "string", description: "SVG string for the bold icon." },
		{ name: "italic", params: "", returns: "string", description: "SVG string for the italic icon." },
		{ name: "underline", params: "", returns: "string", description: "SVG string for the underline icon." },
		{ name: "strike", params: "", returns: "string", description: "SVG string for the strikethrough icon." },
		{ name: "...", params: "", returns: "string", description: "156+ icon keys total. Pass custom icons via the `icons` editor option." },
	],
};
console.log(`  ✓ $.icons (5 methods — static)`);

apiDocs.structure.editor.subgroups["lang"] = {
	title: "$.lang",
	description: "Language strings object containing all UI text for the editor. 89+ keys for toolbar tooltips, dialog labels, and status messages. Customizable via the `lang` option.",
	methods: [
		{ name: "bold", params: "", returns: "string", description: "Tooltip text for bold button." },
		{ name: "font", params: "", returns: "string", description: "Label for font selector." },
		{ name: "fontSize", params: "", returns: "string", description: "Label for font size selector." },
		{ name: "formats", params: "", returns: "string", description: "Label for format selector." },
		{ name: "...", params: "", returns: "string", description: "89+ language keys total. Pass custom language via the `lang` editor option." },
	],
};
console.log(`  ✓ $.lang (5 methods — static)`);

apiDocs.structure.editor.subgroups["facade"] = {
	title: "$.facade",
	description: "Reference to the Editor Instance (public API). All methods on the editor object are accessible through $.facade.",
	methods: [
		{ name: "(Editor Instance)", params: "", returns: "SunEditor.Instance", description: "The public editor API. See Editor Instance section for all available methods.", linkedAs: "Editor Instance" },
	],
};
console.log(`  ✓ $.facade (1 method — static)`);

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

// ── 7. Plugin Hooks (hooks/base.d.ts) ──
console.log("\n📦 Plugin Hooks:");
apiDocs.structure.hooks = { title: "Plugin Hooks", description: "Hook functions that plugins can implement for lifecycle and event handling", methods: [], subgroups: {} };

const hookNamespaces = extractNamespaceFunctions("hooks/base.d.ts");
let totalHooks = 0;
Object.entries(hookNamespaces).forEach(([nsName, methods]) => {
	const key = nsName.replace(/^\./, "");
	apiDocs.structure.hooks.subgroups[key] = {
		title: `Hook.${key}`,
		description: `${key} hook functions for plugins`,
		methods,
	};
	totalHooks += methods.length;
	console.log(`  ✓ Hook.${key} (${methods.length} hooks)`);
});

// ── 8. Interfaces (interfaces/contracts.d.ts) ──
console.log("\n📦 Plugin Interfaces:");
apiDocs.structure.interfaces = { title: "Plugin Interfaces", description: "Contract interfaces that plugins implement", methods: [], subgroups: {} };

const contractInterfaces = extractInterfaceMethods("interfaces/contracts.d.ts");
let totalIfaceMethods = 0;
Object.entries(contractInterfaces).forEach(([ifaceName, { description, methods }]) => {
	apiDocs.structure.interfaces.subgroups[ifaceName] = {
		title: ifaceName,
		description: description || `${ifaceName} interface methods`,
		methods,
	};
	totalIfaceMethods += methods.length;
	console.log(`  ✓ ${ifaceName} (${methods.length} methods)`);
});

// Also extract from interfaces/plugins.d.ts
const pluginInterfaces = extractInterfaceMethods("interfaces/plugins.d.ts");
Object.entries(pluginInterfaces).forEach(([ifaceName, { description, methods }]) => {
	if (!apiDocs.structure.interfaces.subgroups[ifaceName]) {
		apiDocs.structure.interfaces.subgroups[ifaceName] = {
			title: ifaceName,
			description: description || `${ifaceName} interface methods`,
			methods,
		};
		totalIfaceMethods += methods.length;
		console.log(`  ✓ ${ifaceName} (${methods.length} methods)`);
	}
});

// ── 9. Type Definitions ──
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

// Interface types
["interfaces/contracts.d.ts", "interfaces/plugins.d.ts"].forEach((file) => {
	if (fs.existsSync(path.join(TYPES_DIR, file))) {
		const types = extractTypeDefinitions(file);
		types.forEach((type) => {
			if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: file });
		});
	}
});

// Hooks types
if (fs.existsSync(path.join(TYPES_DIR, "hooks/base.d.ts"))) {
	const types = extractTypeDefinitions("hooks/base.d.ts");
	types.forEach((type) => {
		if (!typeMap.has(type.name)) typeMap.set(type.name, { ...type, source: "hooks/base.d.ts" });
	});
}

apiDocs.structure.types.items = Array.from(typeMap.values());
console.log(`  ✓ Type Definitions (${apiDocs.structure.types.items.length} types)`);

// ── 10. Option Descriptions (for playground tooltips) ──
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
	Object.values(apiDocs.structure.plugins.subgroups).reduce((sum, g) => sum + g.methods.length, 0) +
	Object.values(apiDocs.structure.modules.subgroups).reduce((sum, g) => sum + g.methods.length, 0) +
	Object.values(apiDocs.structure.helpers.subgroups).reduce((sum, g) => sum + g.methods.length, 0) +
	apiDocs.structure.events.methods.length +
	totalHooks +
	totalIfaceMethods;

console.log(`\n✅ Generated!`);
console.log(`📝 ${OUTPUT_FILE}`);
console.log(`📝 ${OPTIONS_OUTPUT_FILE}`);
console.log(`📊 ${totalMethods} total methods/events/hooks`);
console.log(`📊 ${apiDocs.structure.types.items.length} type definitions\n`);
