"use client";

import { Plus } from "lucide-react";
import type { BuilderRow as RowType, BuilderAction } from "./builderTypes";
import BuilderRow from "./BuilderRow";

interface BuilderCanvasProps {
	rows: RowType[];
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

export default function BuilderCanvas({ rows, dispatch, breakpointId, dragPreview, isDragging, isDraggingGroup, onButtonHover, onMoreGroupHover, onGroupActionHover, searchQuery }: BuilderCanvasProps) {
	return (
		<div className='space-y-4'>
			{rows.map((row, ri) => (
				<BuilderRow
					key={row.id}
					row={row}
					rowIndex={ri}
					totalRows={rows.length}
					dispatch={dispatch}
					breakpointId={breakpointId}
					dragPreview={dragPreview}
					isDragging={isDragging}
					isDraggingGroup={isDraggingGroup}
					onButtonHover={onButtonHover}
					onMoreGroupHover={onMoreGroupHover}
					onGroupActionHover={onGroupActionHover}
					searchQuery={searchQuery}
				/>
			))}

			{/* Add row */}
			<button
				type='button'
				onClick={() => dispatch({ type: "ADD_ROW", breakpointId })}
				className='flex items-center gap-1.5 w-full justify-center py-2.5 rounded-lg border-2 border-dashed border-border text-xs font-medium text-muted-foreground bg-muted/40 hover:border-primary/60 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer'
			>
				<Plus className='h-3.5 w-3.5' />
				Add Row (line break)
			</button>
		</div>
	);
}
