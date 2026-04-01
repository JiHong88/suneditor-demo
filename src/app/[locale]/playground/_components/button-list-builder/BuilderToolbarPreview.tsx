"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import "suneditor/css/editor";
import type { BuilderRow, BreakpointConfig } from "./builderTypes";
import { BUTTON_MAP } from "./buttonCatalog";

/**
 * Map builder button names → suneditor defaultIcons key names.
 * Plugins set `this.icon = 'key'` in their constructors.
 */
const BUTTON_ICON_MAP: Record<string, string> = {
	undo: "undo",
	redo: "redo",
	dir: "dir_ltr",
	dir_ltr: "dir_ltr",
	dir_rtl: "dir_rtl",
	newDocument: "new_document",
	selectAll: "select_all",
	save: "save",
	preview: "preview",
	print: "print",
	exportPDF: "PDF",
	copy: "copy",
	bold: "bold",
	underline: "underline",
	italic: "italic",
	strike: "strike",
	subscript: "subscript",
	superscript: "superscript",
	fontColor: "font_color",
	backgroundColor: "background_color",
	removeFormat: "remove_format",
	copyFormat: "format_paint",
	blockquote: "blockquote",
	blockStyle: "text_style",
	paragraphStyle: "paragraph_style",
	textStyle: "text_style",
	align: "align_left",
	list_numbered: "list_numbered",
	list_bulleted: "list_bulleted",
	list: "list_numbered",
	outdent: "outdent",
	indent: "indent",
	lineHeight: "line_height",
	table: "table",
	hr: "horizontal_line",
	link: "link",
	anchor: "bookmark_anchor",
	math: "math",
	template: "template",
	layout: "layout",
	image: "image",
	drawing: "drawing",
	video: "video",
	audio: "audio",
	embed: "embed",
	fileUpload: "file_upload",
	imageGallery: "image_gallery",
	videoGallery: "video_gallery",
	audioGallery: "audio_gallery",
	fileGallery: "file_gallery",
	fileBrowser: "file_browser",
	fullScreen: "expansion",
	showBlocks: "show_blocks",
	codeBlock: "code_block",
	codeView: "code_view",
	markdownView: "markdown_view",
	pageBreak: "page_break",
	pageNavigator: "more_page",
	pageUp: "page_up",
	pageDown: "page_down",
};

/**
 * Select-style buttons: text label + arrow_down.
 * className mirrors the plugin's `static className`.
 */
const SELECT_BUTTON_INFO: Record<string, { className: string; defaultText: string }> = {
	font: { className: "se-btn-select se-btn-tool-font", defaultText: "Font" },
	blockStyle: { className: "se-btn-select se-btn-tool-format", defaultText: "Format" },
	fontSize: { className: "se-btn-select se-btn-tool-font-size", defaultText: "Size" },
};

const MIN_PREVIEW_WIDTH = 320;

interface BuilderToolbarPreviewProps {
	rows: BuilderRow[];
	icons: Record<string, string>;
	theme?: string;
	breakpoints?: BreakpointConfig[];
	activeBreakpointId?: string;
	onBreakpointSelect?: (id: string | undefined) => void;
	hoveredButton?: { name: string; groupId: string; index: number } | null;
	hoveredMoreGroupId?: string | null;
	hoveredGroupAction?: { groupId: string; action: "drag" | "float" | "more" | "delete" } | null;
}

/* ── Button rendered with real se-btn classes ───────── */

function PreviewBtn({ name, icons, highlighted }: { name: string; icons: Record<string, string>; highlighted?: boolean }) {
	const iconKey = BUTTON_ICON_MAP[name];
	const svg = iconKey ? icons[iconKey] : undefined;
	const meta = BUTTON_MAP[name];
	const label = meta?.label ?? name;
	const tooltip = `<span class="se-tooltip-inner"><span class="se-tooltip-text">${label}</span></span>`;
	const selectInfo = SELECT_BUTTON_INFO[name];

	const highlightStyle: React.CSSProperties | undefined = highlighted
		? { outline: "2px solid #6366f1", outlineOffset: "-1px", borderRadius: "3px", background: "rgba(99,102,241,0.12)" }
		: undefined;

	// Select-style button: text label + dropdown arrow
	if (selectInfo) {
		const arrowSvg = icons["arrow_down"] ?? "";
		const html = `<span class="se-txt">${selectInfo.defaultText}</span>${arrowSvg}${tooltip}`;
		return (
			<li>
				<button
					type='button'
					className={`se-toolbar-btn se-btn se-tooltip ${selectInfo.className}`}
					aria-label={label}
					tabIndex={-1}
					style={highlightStyle}
					dangerouslySetInnerHTML={{ __html: html }}
				/>
			</li>
		);
	}

	// Regular icon button
	const html = (svg ?? `<span style="font-size:9px">${label.slice(0, 3)}</span>`) + tooltip;
	return (
		<li>
			<button
				type='button'
				className='se-toolbar-btn se-btn se-tooltip'
				aria-label={label}
				tabIndex={-1}
				style={highlightStyle}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</li>
	);
}

/* ── Separator ──────────────────────────────────────── */

function PreviewSeparator({ highlighted }: { highlighted?: boolean }) {
	return (
		<li>
			<div
				className='se-toolbar-separator-vertical'
				tabIndex={-1}
				style={highlighted ? { backgroundColor: "#6366f1", width: "2.5px", opacity: 1 } : undefined}
			/>
		</li>
	);
}

/* ── More button + expandable layer ─────────────────── */

function MoreButtonGroup({
	label,
	iconClassName,
	icons,
	moreId,
	openMoreId,
	onToggle,
}: {
	label: string;
	iconClassName: string;
	icons: Record<string, string>;
	moreId: string;
	openMoreId: string | null;
	onToggle: (id: string) => void;
}) {
	const btnRef = useRef<HTMLButtonElement>(null);
	const moreIconSvg = icons[iconClassName] ?? icons["more_plus"];
	const isOpen = openMoreId === moreId;

	// Inject SVG as direct child so `button > svg` CSS selector works
	useEffect(() => {
		if (btnRef.current && moreIconSvg) {
			const tooltip = btnRef.current.querySelector(".se-tooltip-inner");
			// Remove previous SVG if any
			const oldSvg = btnRef.current.querySelector(":scope > svg");
			if (oldSvg) oldSvg.remove();
			// Insert SVG before tooltip
			const temp = document.createElement("div");
			temp.innerHTML = moreIconSvg;
			const svgEl = temp.firstElementChild;
			if (svgEl && tooltip) {
				btnRef.current.insertBefore(svgEl, tooltip);
			}
		}
	}, [moreIconSvg]);

	return (
		<li>
			<button
				ref={btnRef}
				type='button'
				className={`se-toolbar-btn se-btn se-btn-more se-tooltip${isOpen ? " on" : ""}`}
				aria-label={label}
				tabIndex={-1}
				onClick={() => onToggle(moreId)}
				style={{ cursor: "pointer" }}
			>
				<span className='se-tooltip-inner'>
					<span className='se-tooltip-text'>{label}</span>
				</span>
			</button>
		</li>
	);
}

/* ── Resize handle ──────────────────────────────────── */

function ResizeHandle({
	side,
	onDragStart,
	onDrag,
}: {
	side: "left" | "right";
	onDragStart: () => void;
	onDrag: (deltaX: number) => void;
}) {
	const handleMouseDown = useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			onDragStart();
			const startX = e.clientX;
			const onMove = (ev: MouseEvent) => {
				const delta = ev.clientX - startX;
				onDrag(side === "right" ? delta : -delta);
			};
			const onUp = () => {
				document.removeEventListener("mousemove", onMove);
				document.removeEventListener("mouseup", onUp);
			};
			document.addEventListener("mousemove", onMove);
			document.addEventListener("mouseup", onUp);
		},
		[side, onDragStart, onDrag],
	);

	return (
		<div
			onMouseDown={handleMouseDown}
			className={`absolute top-0 bottom-0 w-5 cursor-col-resize z-10 group/handle flex items-center justify-center
				${side === "left" ? "-left-6" : "-right-6"}`}
		>
			<div
				className='w-1.5 h-10 rounded-full bg-indigo-300/60 group-hover/handle:bg-indigo-500 group-hover/handle:shadow-sm transition-all'
			/>
		</div>
	);
}

/* ── Main preview ───────────────────────────────────── */

export default function BuilderToolbarPreview({
	rows,
	icons,
	theme,
	breakpoints,
	activeBreakpointId,
	onBreakpointSelect,
	hoveredButton,
	hoveredMoreGroupId,
	hoveredGroupAction,
}: BuilderToolbarPreviewProps) {
	const [openMoreId, setOpenMoreId] = useState<string | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const [previewWidth, setPreviewWidth] = useState<number>(0); // 0 = 100%
	const dragStartWidthRef = useRef(0);

	// Resolve theme class: explicit theme or auto-detect from page
	const [resolvedTheme, setResolvedTheme] = useState(theme || "");
	useEffect(() => {
		if (theme) {
			setResolvedTheme(theme);
			return;
		}
		// Auto: follow page dark/light
		const detect = () => (document.documentElement.classList.contains("dark") ? "midnight" : "");
		setResolvedTheme(detect());
		const onTheme = () => setResolvedTheme(detect());
		window.addEventListener("themechange", onTheme);
		return () => window.removeEventListener("themechange", onTheme);
	}, [theme]);

	const themeClass = resolvedTheme ? `se-theme-${resolvedTheme}` : "";

	// Handle resize drag — symmetric (both handles adjust width equally)
	const handleResizeStart = useCallback(() => {
		dragStartWidthRef.current = previewWidth || (containerRef.current?.parentElement?.clientWidth ?? 800);
	}, [previewWidth]);

	const handleResizeDrag = useCallback((deltaX: number) => {
		const containerWidth = containerRef.current?.parentElement?.clientWidth ?? 800;
		const baseWidth = dragStartWidthRef.current;
		const newWidth = Math.max(MIN_PREVIEW_WIDTH, Math.min(containerWidth, baseWidth + deltaX * 2));
		// Snap to 100% when within 10px of container width
		setPreviewWidth(newWidth >= containerWidth - 10 ? 0 : newWidth);
	}, []);

	// Auto-switch breakpoint tab when width crosses thresholds (resize-initiated)
	const autoSwitchRef = useRef(false);
	useEffect(() => {
		if (!breakpoints || !onBreakpointSelect || previewWidth === 0) return;

		// Sort breakpoints descending by width
		const sorted = [...breakpoints].sort((a, b) => b.width - a.width);

		// Find the matching breakpoint: first one where previewWidth <= bp.width
		let matchedId: string | undefined = undefined;
		for (const bp of sorted) {
			if (previewWidth <= bp.width) {
				matchedId = bp.id;
			}
		}

		// Only flag auto-switch if the matched breakpoint actually changes
		if (matchedId !== activeBreakpointId) {
			autoSwitchRef.current = true;
			onBreakpointSelect(matchedId);
		}
	}, [previewWidth, breakpoints, onBreakpointSelect]);

	// Sync preview width when breakpoint tab is clicked externally
	const prevBreakpointIdRef = useRef(activeBreakpointId);
	useEffect(() => {
		if (activeBreakpointId === prevBreakpointIdRef.current) return;
		prevBreakpointIdRef.current = activeBreakpointId;

		// Skip if this change was caused by auto-switch from resize
		if (autoSwitchRef.current) {
			autoSwitchRef.current = false;
			return;
		}

		if (activeBreakpointId === undefined) {
			// When switching back to Default from a breakpoint,
			// set width to largest breakpoint + 100px (instead of jumping to 100%)
			if (breakpoints && breakpoints.length > 0) {
				const maxBpWidth = Math.max(...breakpoints.map((b) => b.width));
				const containerWidth = containerRef.current?.parentElement?.clientWidth ?? 800;
				const targetWidth = maxBpWidth + 100;
				setPreviewWidth(targetWidth >= containerWidth - 10 ? 0 : targetWidth);
			} else {
				setPreviewWidth(0); // 100%
			}
		} else {
			const bp = breakpoints?.find((b) => b.id === activeBreakpointId);
			if (bp) setPreviewWidth(bp.width);
		}
	}, [activeBreakpointId, breakpoints]);

	// Build preview data: groups with more-button info
	const previewData = useMemo(() => {
		return rows.map((row) => ({
			id: row.id,
			groups: row.groups.map((g) => ({
				id: g.id,
				items: g.items.filter((n) => n !== "|"),
				separatorIndices: g.items.reduce<number[]>((acc, n, i) => {
					if (n === "|") acc.push(i);
					return acc;
				}, []),
				allItems: g.items,
				moreButton: g.moreButton,
				floatRight: g.floatRight,
			})),
		}));
	}, [rows]);

	// Collect more-button groups for the expandable layer
	const moreGroups = useMemo(() => {
		const result: { moreId: string; label: string; allItems: string[] }[] = [];
		for (const row of previewData) {
			for (const group of row.groups) {
				if (group.moreButton) {
					result.push({
						moreId: group.id,
						label: group.moreButton.label,
						allItems: group.allItems,
					});
				}
			}
		}
		return result;
	}, [previewData]);

	// If hovered button is inside a more group, force that more layer open
	const hoverMoreId = useMemo(() => {
		if (!hoveredButton) return null;
		for (const mg of moreGroups) {
			if (mg.moreId === hoveredButton.groupId) return mg.moreId;
		}
		return null;
	}, [hoveredButton, moreGroups]);

	const effectiveOpenMoreId = hoveredMoreGroupId ?? hoverMoreId ?? openMoreId;

	const handleToggleMore = (id: string) => {
		setOpenMoreId((prev) => (prev === id ? null : id));
	};

	const isEmpty = previewData.every((r) => r.groups.every((g) => g.allItems.length === 0));
	if (isEmpty) return null;

	const displayWidth = previewWidth > 0 ? `${Math.round(previewWidth)}px` : "100%";

	return (
		<div
			ref={containerRef}
			className='shrink-0 border-t-2 border-indigo-200 dark:border-indigo-700/50 bg-indigo-50/50 dark:bg-indigo-900/25 min-h-[140px] max-h-[220px] flex flex-col'
		>
			<div className='px-4 py-1.5 flex items-center justify-between'>
				<span className='text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
					Toolbar Preview
				</span>
				<span className='text-[10px] font-mono text-indigo-500/70 dark:text-indigo-300/60'>{displayWidth}</span>
			</div>
			<div className='px-16 pb-3 flex justify-center items-center flex-1 overflow-y-auto'>
				{/* Resizable toolbar container */}
				<div className='relative' style={{ width: previewWidth > 0 ? previewWidth : "100%", maxWidth: "100%" }}>
					{/* Resize handles */}
					<ResizeHandle side='left' onDragStart={handleResizeStart} onDrag={handleResizeDrag} />
					<ResizeHandle side='right' onDragStart={handleResizeStart} onDrag={handleResizeDrag} />

					{/* Wrap in sun-editor + theme class so real SE styles apply */}
					<div className={`sun-editor ${themeClass}`} style={{ border: "none" }}>
						<div className={`se-toolbar sun-editor-common ${themeClass}`} style={{ position: "relative" }}>
							<div className='se-btn-tray'>
								{previewData.map((row, ri) => {
									const groupElements = row.groups.map((group) => {
										const moduleClass = `se-btn-module se-btn-module-border${group.floatRight ? " module-float-right" : ""}`;
										const elements: React.ReactNode[] = [];

										{/* More button (placed before group items) */}
										if (group.moreButton) {
											elements.push(
												<MoreButtonGroup
													key={`more-${group.id}`}
													label={group.moreButton.label}
													iconClassName={group.moreButton.className}
													icons={icons}
													moreId={group.id}
													openMoreId={effectiveOpenMoreId}
													onToggle={handleToggleMore}
												/>,
											);
										}

										{/* Regular buttons (only if NOT a more-button group) */}
										if (!group.moreButton) {
											for (let i = 0; i < group.allItems.length; i++) {
												const name = group.allItems[i];
												if (name === "|") {
													elements.push(
														<PreviewSeparator key={`insep-${group.id}-${i}`} highlighted={hoveredButton?.name === "|" && hoveredButton.groupId === group.id && hoveredButton.index === i} />,
													);
												} else {
													elements.push(
														<PreviewBtn
															key={`btn-${group.id}-${i}`}
															name={name}
															icons={icons}
															highlighted={hoveredButton?.name === name}
														/>,
													);
												}
											}
										}

										// Group action hover border style
										const actionMatch = hoveredGroupAction?.groupId === group.id ? hoveredGroupAction.action : null;
										const actionBorderStyle: React.CSSProperties | undefined = actionMatch
											? {
												outline: `2px solid ${actionMatch === "drag" ? "#34d399" : actionMatch === "float" ? "#fb923c" : actionMatch === "more" ? "#a78bfa" : "#f87171"}`,
												outlineOffset: "-1px",
												borderRadius: "var(--se-border-radius)",
											}
											: undefined;

										return (
											<div key={group.id} className={moduleClass} style={actionBorderStyle}>
												<ul className='se-menu-list'>
													{elements}
												</ul>
											</div>
										);
									});

									return (
										<React.Fragment key={row.id}>
											{ri > 0 && <div className='se-btn-module-enter' />}
											{groupElements}
										</React.Fragment>
									);
								})}

								{/* More layers — expandable sections below the toolbar */}
								{moreGroups.length > 0 && (
									<div className='se-toolbar-more-layer'>
										{moreGroups.map((mg) => (
											<div
												key={mg.moreId}
												className='se-more-layer'
												style={{ display: effectiveOpenMoreId === mg.moreId ? "block" : "none" }}
											>
												<div className='se-more-form'>
													<ul className='se-menu-list'>
														{mg.allItems.map((name, i) =>
															name === "|" ? (
																<PreviewSeparator
																	key={`more-sep-${mg.moreId}-${i}`}
																	highlighted={hoveredButton?.name === "|" && hoveredButton.groupId === mg.moreId && hoveredButton.index === i}
																/>
															) : (
																<PreviewBtn
																	key={`more-btn-${mg.moreId}-${i}`}
																	name={name}
																	icons={icons}
																	highlighted={hoveredButton?.name === name}
																/>
															),
														)}
													</ul>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
