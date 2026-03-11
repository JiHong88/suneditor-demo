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
}

export default function BuilderCanvas({ rows, dispatch, breakpointId, dragPreview, isDragging, isDraggingGroup }: BuilderCanvasProps) {
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
				/>
			))}

			{/* Add row */}
			<button
				type='button'
				onClick={() => dispatch({ type: "ADD_ROW", breakpointId })}
				className='flex items-center gap-1.5 w-full justify-center py-2 rounded-lg border border-dashed border-border text-[11px] text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer'
			>
				<Plus className='h-3.5 w-3.5' />
				Add Row (line break)
			</button>
		</div>
	);
}
