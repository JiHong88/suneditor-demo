"use client";

import { useDroppable } from "@dnd-kit/core";
import { Plus, Trash2 } from "lucide-react";
import type { BuilderRow as RowType, BuilderAction } from "./builderTypes";
import BuilderGroup from "./BuilderGroup";
import { useTranslations } from "next-intl";

/* ── Drop zone between groups ─────────────────────────── */

function BetweenGroupDrop({ rowId, groupIndex, wide }: { rowId: string; groupIndex: number; wide?: boolean }) {
	const { setNodeRef, isOver } = useDroppable({
		id: `between__${rowId}__${groupIndex}`,
		data: { type: "between-group-drop" as const, rowId, groupIndex },
	});

	return (
		<div
			ref={setNodeRef}
			className={`self-stretch flex items-center justify-center shrink-0 transition-all duration-150 rounded
				${isOver ? "w-8 bg-emerald-100/60 dark:bg-emerald-900/30" : wide ? "w-4" : "w-2"}`}
		>
			{isOver ? (
				<div className='w-0.5 h-6 bg-emerald-500 rounded-full' />
			) : (
				<div className='w-px h-7 bg-border' />
			)}
		</div>
	);
}

/* ── Row component ────────────────────────────────────── */

interface BuilderRowProps {
	row: RowType;
	rowIndex: number;
	totalRows: number;
	dispatch: React.Dispatch<BuilderAction>;
	breakpointId?: string;
	dragPreview?: { groupId: string; index: number } | null;
	isDragging?: boolean;
	isDraggingGroup?: boolean;
	onButtonHover?: (info: { name: string; groupId: string; index: number } | null) => void;
	onMoreGroupHover?: (groupId: string | null) => void;
	onGroupActionHover?: (info: { groupId: string; action: "drag" | "float" | "more" | "delete" } | null) => void;
	searchQuery?: string;
}

export default function BuilderRow({ row, rowIndex, totalRows, dispatch, breakpointId, dragPreview, isDragging, isDraggingGroup, onButtonHover, onMoreGroupHover, onGroupActionHover, searchQuery }: BuilderRowProps) {
	const t = useTranslations("Playground.builder");
	return (
		<div className='group/row relative'>
			{/* Row label */}
			{totalRows > 1 && (
				<div className='flex items-center gap-2 mb-1.5'>
					<span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
						Row {rowIndex + 1}
					</span>
					<div className='flex-1 border-t border-dashed border-border' />
					<button
						type='button'
						onClick={() => dispatch({ type: "REMOVE_ROW", rowId: row.id, breakpointId })}
						className='p-0.5 rounded hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer text-muted-foreground/40 opacity-0 group-hover/row:opacity-100'
						title='Remove row'
					>
						<Trash2 className='h-3.5 w-3.5' />
					</button>
				</div>
			)}

			{/* Groups container */}
			<div className='flex flex-wrap items-start gap-0'>
				{/* Leading drop zone for group drag */}
				{isDraggingGroup && <BetweenGroupDrop rowId={row.id} groupIndex={0} wide />}

				{row.groups.map((group, gi) => (
					<div key={group.id} className='flex items-start'>
						{gi > 0 && <BetweenGroupDrop rowId={row.id} groupIndex={gi} wide={isDraggingGroup} />}
						<BuilderGroup
							group={group}
							dispatch={dispatch}
							breakpointId={breakpointId}
							isOnly={row.groups.length === 1}
							dragPreview={dragPreview?.groupId === group.id ? dragPreview : null}
							isDragging={isDragging}
							isDraggingGroup={isDraggingGroup}
							onButtonHover={onButtonHover}
							onMoreGroupHover={onMoreGroupHover}
							onGroupActionHover={onGroupActionHover}
							searchQuery={searchQuery}
						/>
					</div>
				))}

				{/* Trailing drop zone for group drag */}
				{isDraggingGroup && <BetweenGroupDrop rowId={row.id} groupIndex={row.groups.length} wide />}

				{/* Add group button */}
				<button
					type='button'
					onClick={() => dispatch({ type: "ADD_GROUP", rowId: row.id, breakpointId })}
					className='inline-flex items-center gap-1.5 px-3 py-2 ms-2 rounded-lg border-2 border-dashed border-primary/40 text-xs font-semibold text-primary/70 bg-primary/5 hover:border-primary hover:text-primary hover:bg-primary/10 hover:shadow-sm transition-all cursor-pointer dark:border-primary/30 dark:text-primary/60 dark:bg-primary/5 dark:hover:border-primary/70 dark:hover:text-primary dark:hover:bg-primary/10'
					title={t("addGroupTitle")}
				>
					<Plus className='h-3.5 w-3.5' />
					{t("addGroup")}
				</button>
			</div>
		</div>
	);
}
