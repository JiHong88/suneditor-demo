"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
	DndContext,
	DragOverlay,
	pointerWithin,
	type DragStartEvent,
	type DragEndEvent,
	type DragOverEvent,
	type Modifier,
} from "@dnd-kit/core";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Eraser, RotateCcw, GripVertical } from "lucide-react";
import { useBuilderState } from "./useBuilderState";
import { buttonListToBuilder, builderToButtonList } from "./builderConversion";
import BuilderPalette from "./BuilderPalette";
import BuilderCanvas from "./BuilderCanvas";
import BuilderBreakpointTabs from "./BuilderBreakpointTabs";
import { BUTTON_MAP } from "./buttonCatalog";
import BuilderToolbarPreview from "./BuilderToolbarPreview";
import suneditorIcons from "suneditor/src/assets/icons/defaultIcons.js";

/** Snap overlay so cursor is at top-center: move anchor to cursor, then CSS -translate-x-1/2 centers horizontally */
const snapToCursor: Modifier = ({ activatorEvent, draggingNodeRect, transform }) => {
	if (draggingNodeRect && activatorEvent && "clientX" in activatorEvent) {
		const event = activatorEvent as PointerEvent;
		return {
			...transform,
			x: transform.x + (event.clientX - draggingNodeRect.left),
			y: transform.y + (event.clientY - draggingNodeRect.top),
		};
	}
	return transform;
};

interface ButtonListBuilderProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialButtonList: unknown[];
	onApply: (buttonList: unknown[]) => void;
	editorRenderedWidth?: number;
	editorTheme?: string;
}

export default function ButtonListBuilder({
	open,
	onOpenChange,
	initialButtonList,
	onApply,
	editorRenderedWidth,
	editorTheme,
}: ButtonListBuilderProps) {
	const initialState = useMemo(() => buttonListToBuilder(initialButtonList), [initialButtonList]);
	const { state, dispatch, set } = useBuilderState(initialState);
	const [activeBreakpointId, setActiveBreakpointId] = useState<string | undefined>(undefined);
	const [hoveredButton, setHoveredButton] = useState<{ name: string; groupId: string; index: number } | null>(null);
	const [hoveredMoreGroupId, setHoveredMoreGroupId] = useState<string | null>(null);
	const [hoveredGroupAction, setHoveredGroupAction] = useState<{ groupId: string; action: "drag" | "float" | "more" | "delete" } | null>(null);

	// Re-sync builder state from latest initialButtonList when sheet opens
	const prevOpenRef = useRef(open);
	useEffect(() => {
		if (open && !prevOpenRef.current) {
			set(initialState);
			setActiveBreakpointId(undefined);
		}
		prevOpenRef.current = open;
	}, [open, initialState, set]);
	const [paletteSearch, setPaletteSearch] = useState("");
	const [dragData, setDragData] = useState<{ buttonName: string; type?: string; groupId?: string } | null>(null);
	const [dragPreview, setDragPreview] = useState<{ groupId: string; index: number } | null>(null);
	const dragSourceRef = useRef<{ groupId: string; index: number } | null>(null);
	const isDraggingRef = useRef(false);

	const handleButtonHover = useCallback((info: { name: string; groupId: string; index: number } | null) => {
		if (!isDraggingRef.current) setHoveredButton(info);
	}, []);
	const handleMoreGroupHover = useCallback((groupId: string | null) => {
		if (!isDraggingRef.current) setHoveredMoreGroupId(groupId);
	}, []);
	const handleGroupActionHover = useCallback((info: { groupId: string; action: "drag" | "float" | "more" | "delete" } | null) => {
		if (!isDraggingRef.current) setHoveredGroupAction(info);
	}, []);

	// Collect all used button names across active rows (exclude separators - they can be duplicated)
	const usedButtons = useMemo(() => {
		const rows = activeBreakpointId
			? (state.breakpoints.find((bp) => bp.id === activeBreakpointId)?.rows ?? state.rows)
			: state.rows;
		const used = new Set<string>();
		for (const row of rows) {
			for (const group of row.groups) {
				for (const item of group.items) {
					if (item !== "|") used.add(item);
				}
			}
		}
		return used;
	}, [state, activeBreakpointId]);

	// Get active rows
	const activeRows = useMemo(() => {
		if (!activeBreakpointId) return state.rows;
		return state.breakpoints.find((bp) => bp.id === activeBreakpointId)?.rows ?? state.rows;
	}, [state, activeBreakpointId]);

	/* ── Click-to-add handler ─────────────────────────── */

	const handlePaletteAdd = useCallback(
		(buttonName: string) => {
			// Add to the last group of the last row
			const rows = activeRows;
			if (rows.length === 0) return;
			const lastRow = rows[rows.length - 1];
			if (lastRow.groups.length === 0) return;
			const lastGroup = lastRow.groups[lastRow.groups.length - 1];

			dispatch({
				type: "ADD_BUTTON",
				groupId: lastGroup.id,
				buttonName,
				breakpointId: activeBreakpointId,
			});
		},
		[activeRows, dispatch, activeBreakpointId],
	);

	/* ── Add preset group handler ─────────────────────── */

	const handlePaletteAddGroup = useCallback(
		(items: string[]) => {
			const rows = activeRows;
			if (rows.length === 0) return;
			const lastRow = rows[rows.length - 1];

			dispatch({
				type: "INSERT_GROUP",
				rowId: lastRow.id,
				groupIndex: lastRow.groups.length,
				items,
				breakpointId: activeBreakpointId,
			});
		},
		[activeRows, dispatch, activeBreakpointId],
	);

	/* ── Drag handlers ─────────────────────────────────── */

	const handleDragStart = useCallback((event: DragStartEvent) => {
		isDraggingRef.current = true;
		setHoveredButton(null);
		setHoveredMoreGroupId(null);
		setHoveredGroupAction(null);
		const data = event.active.data.current;
		if (data) {
			if (data.type === "canvas-group") {
				setDragData({ buttonName: "", type: "canvas-group", groupId: data.groupId as string });
				dragSourceRef.current = null;
			} else if (data.type === "palette-group") {
				setDragData({ buttonName: "", type: "palette-group" });
				dragSourceRef.current = null;
			} else {
				setDragData({ buttonName: data.buttonName as string, type: data.type as string });
				// Track source for excluding from preview
				if (data.type === "canvas-button") {
					const parts = (event.active.id as string).split("__");
					dragSourceRef.current = { groupId: parts[0], index: parseInt(parts[1], 10) };
				} else {
					dragSourceRef.current = null;
				}
			}
		}
	}, []);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { over, active } = event;

			// No preview for group drags (canvas or palette)
			if (active.data.current?.type === "canvas-group" || active.data.current?.type === "palette-group") {
				setDragPreview(null);
				return;
			}

			if (!over) {
				setDragPreview(null);
				return;
			}

			const overData = over.data.current;
			if (!overData) {
				setDragPreview(null);
				return;
			}

			let targetGroupId: string | null = null;
			let targetIndex: number | null = null;

			if (overData.type === "insertion-gap") {
				targetGroupId = overData.groupId as string;
				targetIndex = overData.index as number;
			} else if (overData.type === "group-drop") {
				targetGroupId = overData.groupId as string;
				// Append to end — find group's item count
				const rows = activeRows;
				for (const row of rows) {
					for (const group of row.groups) {
						if (group.id === targetGroupId) {
							targetIndex = group.items.length;
							break;
						}
					}
					if (targetIndex !== null) break;
				}
			} else if (overData.type === "canvas-button") {
				const overParts = (over.id as string).split("__");
				targetGroupId = overParts[0];
				targetIndex = parseInt(overParts[1], 10);
			} else {
				setDragPreview(null);
				return;
			}

			if (targetGroupId !== null && targetIndex !== null) {
				// Skip preview at the dragged item's own position or adjacent gap
				const src = dragSourceRef.current;
				if (
					src &&
					src.groupId === targetGroupId &&
					(targetIndex === src.index || targetIndex === src.index + 1)
				) {
					setDragPreview(null);
					return;
				}

				setDragPreview((prev) => {
					if (prev && prev.groupId === targetGroupId && prev.index === targetIndex) return prev;
					return { groupId: targetGroupId!, index: targetIndex! };
				});
			} else {
				setDragPreview(null);
			}
		},
		[activeRows],
	);

	const handleDragEnd = useCallback(
		(event: DragEndEvent) => {
			isDraggingRef.current = false;
			setDragData(null);
			setDragPreview(null);
			dragSourceRef.current = null;
			const { active, over } = event;
			if (!over) return;

			const activeData = active.data.current;
			const overData = over.data.current;
			if (!activeData) return;

			// Group drag handling — groups can only drop on between-group zones
			if (activeData.type === "canvas-group") {
				const groupId = activeData.groupId as string;
				if (overData?.type === "between-group-drop") {
					const targetRowId = overData.rowId as string;
					const targetIndex = overData.groupIndex as number;
					dispatch({
						type: "MOVE_GROUP",
						groupId,
						targetRowId,
						targetIndex,
						breakpointId: activeBreakpointId,
					});
				}
				return;
			}

			// Palette group drag — insert as new group at drop position or last row
			if (activeData.type === "palette-group") {
				const items = activeData.items as string[];
				if (!items?.length) return;
				if (overData?.type === "between-group-drop") {
					dispatch({
						type: "INSERT_GROUP",
						rowId: overData.rowId as string,
						groupIndex: overData.groupIndex as number,
						items,
						breakpointId: activeBreakpointId,
					});
				} else {
					// Fallback: append to last row
					const rows = activeRows;
					if (rows.length === 0) return;
					const lastRow = rows[rows.length - 1];
					dispatch({
						type: "INSERT_GROUP",
						rowId: lastRow.id,
						groupIndex: lastRow.groups.length,
						items,
						breakpointId: activeBreakpointId,
					});
				}
				return;
			}

			const isPalette = activeData.type === "palette-button";
			const isCanvas = activeData.type === "canvas-button";
			const buttonName = activeData.buttonName as string;

			// Drop on an insertion gap (precise position between buttons)
			if (overData?.type === "insertion-gap") {
				const targetGroupId = overData.groupId as string;
				const targetIndex = overData.index as number;

				if (isPalette) {
					dispatch({
						type: "ADD_BUTTON",
						groupId: targetGroupId,
						buttonName,
						index: targetIndex,
						breakpointId: activeBreakpointId,
					});
				} else if (isCanvas) {
					const parts = (active.id as string).split("__");
					const fromGroupId = parts[0];
					const fromIndex = parseInt(parts[1], 10);

					if (fromGroupId === targetGroupId) {
						const adjustedIndex = targetIndex > fromIndex ? targetIndex - 1 : targetIndex;
						if (fromIndex !== adjustedIndex) {
							dispatch({
								type: "REORDER_BUTTON",
								groupId: fromGroupId,
								fromIndex,
								toIndex: adjustedIndex,
								breakpointId: activeBreakpointId,
							});
						}
					} else {
						dispatch({
							type: "MOVE_BUTTON",
							fromGroupId,
							fromIndex,
							toGroupId: targetGroupId,
							toIndex: targetIndex,
							breakpointId: activeBreakpointId,
						});
					}
				}
				return;
			}

			// Drop between groups (creates new group at that position)
			if (overData?.type === "between-group-drop") {
				const targetRowId = overData.rowId as string;
				const groupIndex = overData.groupIndex as number;

				if (isPalette) {
					dispatch({
						type: "INSERT_GROUP",
						rowId: targetRowId,
						groupIndex,
						items: [buttonName],
						breakpointId: activeBreakpointId,
					});
				} else if (isCanvas) {
					const parts = (active.id as string).split("__");
					const fromGroupId = parts[0];
					const fromIndex = parseInt(parts[1], 10);
					// Remove from source, then insert as new group
					dispatch({
						type: "REMOVE_BUTTON",
						groupId: fromGroupId,
						buttonName,
						index: fromIndex,
						breakpointId: activeBreakpointId,
					});
					dispatch({
						type: "INSERT_GROUP",
						rowId: targetRowId,
						groupIndex,
						items: [buttonName],
						breakpointId: activeBreakpointId,
					});
				}
				return;
			}

			// Drop on a group drop zone (fallback - appends to group)
			if (overData?.type === "group-drop") {
				const targetGroupId = overData.groupId as string;

				if (isPalette) {
					dispatch({
						type: "ADD_BUTTON",
						groupId: targetGroupId,
						buttonName,
						breakpointId: activeBreakpointId,
					});
				} else if (isCanvas) {
					const parts = (active.id as string).split("__");
					const fromGroupId = parts[0];
					const fromIndex = parseInt(parts[1], 10);

					if (fromGroupId === targetGroupId) return;

					dispatch({
						type: "MOVE_BUTTON",
						fromGroupId,
						fromIndex,
						toGroupId: targetGroupId,
						toIndex: 0,
						breakpointId: activeBreakpointId,
					});
				}
				return;
			}

			// Drop on another canvas button (reorder or cross-group move)
			if (overData?.type === "canvas-button" && isCanvas) {
				const activeParts = (active.id as string).split("__");
				const overParts = (over.id as string).split("__");

				const fromGroupId = activeParts[0];
				const fromIndex = parseInt(activeParts[1], 10);
				const toGroupId = overParts[0];
				const toIndex = parseInt(overParts[1], 10);

				if (fromGroupId === toGroupId) {
					if (fromIndex !== toIndex) {
						dispatch({
							type: "REORDER_BUTTON",
							groupId: fromGroupId,
							fromIndex,
							toIndex,
							breakpointId: activeBreakpointId,
						});
					}
				} else {
					dispatch({
						type: "MOVE_BUTTON",
						fromGroupId,
						fromIndex,
						toGroupId,
						toIndex,
						breakpointId: activeBreakpointId,
					});
				}
				return;
			}

			// Palette button dropped on a canvas button position
			if (isPalette && overData?.type === "canvas-button") {
				const overParts = (over.id as string).split("__");
				const targetGroupId = overParts[0];
				const targetIndex = parseInt(overParts[1], 10);

				dispatch({
					type: "ADD_BUTTON",
					groupId: targetGroupId,
					buttonName,
					index: targetIndex,
					breakpointId: activeBreakpointId,
				});
			}
		},
		[dispatch, activeBreakpointId, activeRows],
	);

	/* ── Actions ───────────────────────────────────────── */

	const handleApply = useCallback(() => {
		const buttonList = builderToButtonList(state);
		onApply(buttonList);
		onOpenChange(false);
	}, [state, onApply, onOpenChange]);

	const handleClear = useCallback(() => {
		dispatch({ type: "CLEAR", breakpointId: activeBreakpointId });
	}, [dispatch, activeBreakpointId]);

	const handleReset = useCallback(() => {
		set(initialState);
		setActiveBreakpointId(undefined);
	}, [set, initialState]);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent side='bottom' className='h-[92vh] flex flex-col p-0 gap-0'>
				{/* Keyframe animation for button entry */}
				<style>{`
					@keyframes buttonPop {
						0% { transform: scale(0.7); opacity: 0; }
						60% { transform: scale(1.08); opacity: 1; }
						100% { transform: scale(1); opacity: 1; }
					}
				`}</style>

				{/* Header */}
				<SheetHeader className='shrink-0 px-4 py-3 border-b'>
					<div className='flex items-center justify-between'>
						<SheetTitle className='text-sm font-bold'>ButtonList Builder</SheetTitle>
						<div className='flex items-center gap-2 mx-[24px]'>
							<button
								type='button'
								onClick={handleClear}
								className='inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer'
							>
								<Eraser className='h-3 w-3' />
								Clear
							</button>
							<button
								type='button'
								onClick={handleReset}
								className='inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer'
							>
								<RotateCcw className='h-3 w-3' />
								Reset
							</button>
						</div>
					</div>
				</SheetHeader>

				{/* Breakpoint tabs */}
				<div className='shrink-0 px-4 py-2 border-b bg-muted/30'>
					<BuilderBreakpointTabs
						breakpoints={state.breakpoints}
						activeBreakpointId={activeBreakpointId}
						onSelect={setActiveBreakpointId}
						dispatch={dispatch}
					/>
				</div>

				{/* Main area: Palette + Canvas */}
				<DndContext
					collisionDetection={pointerWithin}
					onDragStart={handleDragStart}
					onDragOver={handleDragOver}
					onDragEnd={handleDragEnd}
				>
					<div className='flex-1 flex min-h-0'>
						{/* Palette */}
						<div className='w-56 shrink-0 border-e bg-muted/30 dark:bg-[oklch(0.18_0_0)] p-3 overflow-y-auto'>
							<BuilderPalette usedButtons={usedButtons} onAdd={handlePaletteAdd} onAddGroup={handlePaletteAddGroup} search={paletteSearch} onSearchChange={setPaletteSearch} />
						</div>

						{/* Canvas */}
						<div className='flex-1 p-4 overflow-y-auto'>
							<BuilderCanvas
								rows={activeRows}
								dispatch={dispatch}
								breakpointId={activeBreakpointId}
								dragPreview={dragPreview}
								isDragging={!!dragData}
								isDraggingGroup={dragData?.type === "canvas-group"}
								onButtonHover={handleButtonHover}
								onMoreGroupHover={handleMoreGroupHover}
								onGroupActionHover={handleGroupActionHover}
								searchQuery={paletteSearch}
							/>
						</div>
					</div>

					{/* Drag overlay */}
					<DragOverlay dropAnimation={null} modifiers={[snapToCursor]}>
						{dragData && dragData.type === "palette-group" ? (
								<div className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-400/20 dark:border-emerald-500/60 dark:bg-emerald-900/40 dark:ring-emerald-500/20 -translate-x-1/2'>
									<GripVertical className='h-3.5 w-3.5 text-emerald-500' />
									<span className='text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
										Preset Group
									</span>
								</div>
							) : dragData && dragData.type === "canvas-group" ? (
							<div className='inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-emerald-400 bg-emerald-50 shadow-lg ring-2 ring-emerald-400/20 dark:border-emerald-500/60 dark:bg-emerald-900/40 dark:ring-emerald-500/20 -translate-x-1/2'>
								<GripVertical className='h-3.5 w-3.5 text-emerald-500' />
								<span className='text-[11px] font-medium text-emerald-600 dark:text-emerald-400'>
									Group
								</span>
							</div>
						) : dragData ? (
							dragData.buttonName === "|" ? (
								<div className='inline-flex items-center gap-1 px-2.5 py-1 rounded border border-dashed border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-400/20 dark:border-blue-500/60 dark:bg-blue-900/40 dark:ring-blue-500/20 -translate-x-1/2'>
									<div className='w-0.5 h-4 bg-blue-500/60 rounded-full' />
									<span className='text-[10px] font-medium text-blue-600 dark:text-blue-400'>|</span>
								</div>
							) : (
								<div className='inline-flex items-center gap-0.5 px-2 py-1 rounded text-[11px] font-medium border border-blue-400 bg-blue-50 shadow-lg ring-2 ring-blue-400/20 dark:border-blue-500/60 dark:bg-blue-900/40 dark:ring-blue-500/20 -translate-x-1/2'>
									<span className='truncate max-w-[80px] text-blue-600 dark:text-blue-400'>
										{BUTTON_MAP[dragData.buttonName]?.label ?? dragData.buttonName}
									</span>
								</div>
							)
						) : null}
					</DragOverlay>
				</DndContext>

				{/* Toolbar Preview */}
				<BuilderToolbarPreview
					rows={activeRows}
					icons={suneditorIcons as Record<string, string>}
					theme={editorTheme}
					breakpoints={state.breakpoints}
					activeBreakpointId={activeBreakpointId}
					onBreakpointSelect={setActiveBreakpointId}
					hoveredButton={hoveredButton}
					hoveredMoreGroupId={hoveredMoreGroupId}
					hoveredGroupAction={hoveredGroupAction}
				/>

				{/* Footer */}
				<div className='shrink-0 px-4 py-3 border-t bg-muted/30 flex items-center justify-between'>
					<div className='flex items-center gap-3 text-[11px] text-muted-foreground'>
						<span>{usedButtons.size} buttons configured</span>
						{editorRenderedWidth ? (
							<span className='px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono'>
								editor: {editorRenderedWidth}px
							</span>
						) : null}
					</div>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={() => onOpenChange(false)}
							className='px-3 py-1.5 text-xs rounded border border-border text-muted-foreground hover:bg-muted transition-colors cursor-pointer'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleApply}
							className='px-4 py-1.5 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium cursor-pointer'
						>
							Apply to Editor
						</button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}
