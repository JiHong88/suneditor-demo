"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search, Copy, Check, AlertTriangle, Trash2, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { OPTION_MAP, BUTTON_MAP, EVENT_MAP } from "@/data/v2-to-v3-options";

type ConvertedLine = {
	original: string;
	converted: string;
	status: "converted" | "removed" | "unchanged" | "unknown";
	note?: string;
};

/** Try to convert a v2 option object string to v3 */
function convertV2Options(input: string): { lines: ConvertedLine[]; v3Output: string } {
	const lines: ConvertedLine[] = [];
	// Nested plugin options collector: { image: { uploadUrl: ... }, ... }
	const nestedOpts: Record<string, Record<string, string>> = {};
	const flatLines: string[] = [];

	const inputLines = input.split("\n");

	for (const rawLine of inputLines) {
		const trimmed = rawLine.trim();

		// Skip empty, comments, braces
		if (!trimmed || trimmed === "{" || trimmed === "}" || trimmed.startsWith("//") || trimmed.startsWith("/*") || trimmed.startsWith("*")) {
			lines.push({ original: rawLine, converted: rawLine, status: "unchanged" });
			flatLines.push(rawLine);
			continue;
		}

		// Extract key from "key: value" or "key : value"
		const keyMatch = trimmed.match(/^["']?(\w+)["']?\s*:/);
		if (!keyMatch) {
			lines.push({ original: rawLine, converted: rawLine, status: "unchanged" });
			flatLines.push(rawLine);
			continue;
		}

		const v2Key = keyMatch[1];

		// Check option map
		const entry = OPTION_MAP.find((e) => e.v2 === v2Key);

		if (entry) {
			if (entry.v3 === null) {
				// Removed
				const commented = rawLine.replace(/^(\s*)/, "$1// [REMOVED] ");
				lines.push({ original: rawLine, converted: commented, status: "removed", note: entry.note });
				flatLines.push(commented);
			} else if (entry.v3.includes(".")) {
				// Nested plugin option (e.g. "image.uploadUrl")
				const [plugin, optKey] = entry.v3.split(".", 2);
				const valueMatch = trimmed.match(/^\w+\s*:\s*(.*?)[\s,]*$/);
				const value = valueMatch ? valueMatch[1].replace(/,\s*$/, "") : "...";
				if (!nestedOpts[plugin]) nestedOpts[plugin] = {};
				nestedOpts[plugin][optKey] = value;
				const note = entry.note ? ` (${entry.note})` : "";
				const converted = rawLine.replace(/^(\s*)/, `$1// → ${entry.v3}${note} ... `).replace(/\n$/, "");
				lines.push({ original: rawLine, converted, status: "converted", note: `→ ${entry.v3}${note}` });
				flatLines.push(converted);
			} else if (entry.v3 !== v2Key) {
				// Simple rename
				const converted = rawLine.replace(v2Key, entry.v3);
				const note = entry.note || "Renamed";
				lines.push({ original: rawLine, converted, status: "converted", note: `→ ${entry.v3} (${note})` });
				flatLines.push(converted);
			} else {
				// Unchanged
				lines.push({ original: rawLine, converted: rawLine, status: "unchanged" });
				flatLines.push(rawLine);
			}
		} else {
			// Check event map
			const eventEntry = EVENT_MAP[v2Key];
			if (eventEntry !== undefined) {
				if (eventEntry === null) {
					const commented = rawLine.replace(/^(\s*)/, "$1// [REMOVED] ");
					lines.push({ original: rawLine, converted: commented, status: "removed", note: "Event removed in v3" });
					flatLines.push(commented);
				} else if (eventEntry !== v2Key) {
					const converted = rawLine.replace(v2Key, eventEntry);
					lines.push({ original: rawLine, converted, status: "converted", note: `→ ${eventEntry}` });
					flatLines.push(converted);
				} else {
					lines.push({ original: rawLine, converted: rawLine, status: "unchanged" });
					flatLines.push(rawLine);
				}
			} else {
				// Unknown
				lines.push({ original: rawLine, converted: rawLine, status: "unknown" });
				flatLines.push(rawLine);
			}
		}
	}

	// Build final output: flat lines + nested plugin options
	let v3Output = flatLines.filter((l) => !l.trim().startsWith("// →")).join("\n");

	if (Object.keys(nestedOpts).length > 0) {
		const pluginLines = Object.entries(nestedOpts)
			.map(([plugin, opts]) => {
				const inner = Object.entries(opts)
					.map(([k, v]) => `    ${k}: ${v}`)
					.join(",\n");
				return `  ${plugin}: {\n${inner}\n  }`;
			})
			.join(",\n");
		v3Output = v3Output.trimEnd() + "\n\n  // ── Plugin options (v3 nested) ──\n" + pluginLines + "\n";
	}

	return { lines, v3Output };
}

/** Convert buttonList button names */
function convertButtonList(input: string): string {
	let result = input;
	for (const [v2, v3] of Object.entries(BUTTON_MAP)) {
		result = result.replace(new RegExp(`\\b${v2}\\b`, "g"), v3);
	}
	return result;
}

export default function MigrationPage() {
	const t = useTranslations("Migration");
	const [v2Input, setV2Input] = useState("");
	const [copied, setCopied] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState<"converter" | "table">("converter");

	const result = useMemo(() => {
		if (!v2Input.trim()) return null;
		const processed = convertV2Options(v2Input);
		// Also convert button names in the output
		processed.v3Output = convertButtonList(processed.v3Output);
		return processed;
	}, [v2Input]);

	const handleCopy = useCallback(() => {
		if (!result) return;
		navigator.clipboard.writeText(result.v3Output);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	}, [result]);

	const stats = useMemo(() => {
		if (!result) return null;
		const converted = result.lines.filter((l) => l.status === "converted").length;
		const removed = result.lines.filter((l) => l.status === "removed").length;
		const unknown = result.lines.filter((l) => l.status === "unknown").length;
		return { converted, removed, unknown };
	}, [result]);

	const filteredMap = useMemo(() => {
		if (!searchQuery.trim()) return OPTION_MAP;
		const q = searchQuery.toLowerCase();
		return OPTION_MAP.filter(
			(e) => e.v2.toLowerCase().includes(q) || (e.v3 && e.v3.toLowerCase().includes(q)) || (e.note && e.note.toLowerCase().includes(q)),
		);
	}, [searchQuery]);

	return (
		<div className='min-h-screen'>
			{/* Hero */}
			<section className='container mx-auto px-6 py-12'>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='text-center max-w-3xl mx-auto'>
					<h1 className='text-4xl font-bold tracking-tight md:text-5xl'>{t("title")}</h1>
					<p className='mt-4 text-lg text-muted-foreground'>{t("subtitle")}</p>
				</motion.div>
			</section>

			<div className='container mx-auto px-6 pb-20'>
				{/* Tab toggle */}
				<div className='flex gap-2 mb-8 justify-center'>
					<Button variant={activeTab === "converter" ? "default" : "outline"} size='sm' onClick={() => setActiveTab("converter")}>
						{t("converterTab")}
					</Button>
					<Button variant={activeTab === "table" ? "default" : "outline"} size='sm' onClick={() => setActiveTab("table")}>
						{t("tableTab")}
					</Button>
				</div>

				{activeTab === "converter" && (
					<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className='max-w-5xl mx-auto space-y-6'>
						{/* Info */}
						<div className='flex items-start gap-3 rounded-lg border bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 px-4 py-3'>
							<Info className='size-4 text-blue-500 mt-0.5 shrink-0' />
							<p className='text-sm text-muted-foreground'>{t.raw("converterDesc")}</p>
						</div>

						{/* Input / Output side by side */}
						<div className='grid md:grid-cols-2 gap-4'>
							{/* Input */}
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<label className='text-sm font-semibold'>v2 Options</label>
									<button
										type='button'
										onClick={() => setV2Input("")}
										className='text-xs text-muted-foreground hover:text-foreground transition-colors'
									>
										<Trash2 className='size-3.5' />
									</button>
								</div>
								<textarea
									value={v2Input}
									onChange={(e) => setV2Input(e.target.value)}
									placeholder={t("inputPlaceholder")}
									className='w-full h-80 rounded-lg border bg-background p-3 text-xs font-mono resize-y focus:ring-2 focus:ring-ring outline-none'
									spellCheck={false}
								/>
							</div>

							{/* Output */}
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<label className='text-sm font-semibold'>v3 Options</label>
									{result && (
										<button
											type='button'
											onClick={handleCopy}
											className='inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors'
										>
											{copied ? <Check className='size-3.5 text-green-500' /> : <Copy className='size-3.5' />}
											{copied ? t("copied") : t("copy")}
										</button>
									)}
								</div>
								<div className='w-full h-80 rounded-lg border bg-muted/30 p-3 text-xs font-mono overflow-auto whitespace-pre'>
									{result ? result.v3Output : <span className='text-muted-foreground'>{t("outputPlaceholder")}</span>}
								</div>
							</div>
						</div>

						{/* Stats */}
						{stats && (stats.converted > 0 || stats.removed > 0 || stats.unknown > 0) && (
							<div className='flex flex-wrap gap-3 text-xs'>
								{stats.converted > 0 && (
									<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'>
										<ArrowRight className='size-3' />
										{stats.converted} {t("converted")}
									</span>
								)}
								{stats.removed > 0 && (
									<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'>
										<Trash2 className='size-3' />
										{stats.removed} {t("removed")}
									</span>
								)}
								{stats.unknown > 0 && (
									<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'>
										<AlertTriangle className='size-3' />
										{stats.unknown} {t("unknown")}
									</span>
								)}
							</div>
						)}

						{/* Change details */}
						{result && result.lines.filter((l) => l.status !== "unchanged").length > 0 && (
							<div className='rounded-lg border'>
								<div className='px-4 py-2.5 border-b bg-muted/30'>
									<span className='text-xs font-semibold'>{t("changes")}</span>
								</div>
								<div className='divide-y max-h-64 overflow-y-auto'>
									{result.lines
										.filter((l) => l.status !== "unchanged")
										.map((l, i) => (
											<div key={i} className='flex items-center gap-3 px-4 py-2 text-xs'>
												<span
													className={`shrink-0 w-16 text-center rounded-sm px-1.5 py-0.5 font-medium ${
														l.status === "converted"
															? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
															: l.status === "removed"
																? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
																: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
													}`}
												>
													{l.status}
												</span>
												<code className='font-mono text-muted-foreground truncate'>{l.original.trim()}</code>
												{l.note && <span className='ms-auto shrink-0 text-muted-foreground'>{l.note}</span>}
											</div>
										))}
								</div>
							</div>
						)}
					</motion.div>
				)}

				{activeTab === "table" && (
					<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className='max-w-4xl mx-auto space-y-4'>
						{/* Search */}
						<div className='relative'>
							<Search className='absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground' />
							<input
								type='text'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder={t("searchPlaceholder")}
								className='w-full h-9 rounded-lg border bg-background ps-9 pe-3 text-sm outline-none focus:ring-2 focus:ring-ring'
							/>
						</div>

						{/* Table */}
						<div className='rounded-lg border overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='w-full text-xs'>
									<thead>
										<tr className='border-b bg-muted/50'>
											<th className='px-4 py-2.5 text-start font-semibold'>v2</th>
											<th className='px-2 py-2.5 w-8' />
											<th className='px-4 py-2.5 text-start font-semibold'>v3</th>
											<th className='px-4 py-2.5 text-start font-semibold'>{t("note")}</th>
										</tr>
									</thead>
									<tbody className='divide-y'>
										{filteredMap.map((e) => (
											<tr key={e.v2} className='hover:bg-muted/30'>
												<td className='px-4 py-2'>
													<code className='font-mono'>{e.v2}</code>
												</td>
												<td className='px-2 py-2 text-center'>
													<ArrowRight className='size-3 text-muted-foreground' />
												</td>
												<td className='px-4 py-2'>
													{e.v3 ? (
														<code className='font-mono text-green-600 dark:text-green-400'>{e.v3}</code>
													) : (
														<span className='text-red-500 font-medium'>{t("removed")}</span>
													)}
												</td>
												<td className='px-4 py-2 text-muted-foreground'>{e.note || "—"}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						<p className='text-xs text-muted-foreground text-center'>
							{filteredMap.length} / {OPTION_MAP.length} {t("entries")}
						</p>
					</motion.div>
				)}
			</div>
		</div>
	);
}
