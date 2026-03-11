/* ── Builder normalized data model ─────────────────────── */

export interface MoreButtonConfig {
	label: string;
	icon: string;
	className: string;
}

export interface BuilderGroup {
	id: string;
	items: string[];
	moreButton?: MoreButtonConfig;
	floatRight?: boolean;
}

export interface BuilderRow {
	id: string;
	groups: BuilderGroup[];
}

export interface BreakpointConfig {
	id: string;
	width: number;
	rows: BuilderRow[];
}

export interface BuilderState {
	rows: BuilderRow[];
	breakpoints: BreakpointConfig[];
}

/* ── Button catalog types ─────────────────────────────── */

export type ButtonCategory = "document" | "format" | "text" | "layout" | "insert" | "media" | "gallery" | "view" | "page";

export interface ButtonMeta {
	name: string;
	label: string;
	category: ButtonCategory;
}

/* ── Drag-drop types ──────────────────────────────────── */

export type DragItemType = "palette-button" | "canvas-button";

export interface DragData {
	type: DragItemType;
	buttonName: string;
	/** Source group id (only for canvas-button) */
	fromGroupId?: string;
}

/* ── Builder action types ─────────────────────────────── */

export type BuilderAction =
	| { type: "SET"; state: BuilderState }
	| { type: "ADD_ROW"; breakpointId?: string }
	| { type: "REMOVE_ROW"; rowId: string; breakpointId?: string }
	| { type: "ADD_GROUP"; rowId: string; breakpointId?: string }
	| { type: "REMOVE_GROUP"; groupId: string; breakpointId?: string }
	| { type: "ADD_BUTTON"; groupId: string; buttonName: string; index?: number; breakpointId?: string }
	| { type: "REMOVE_BUTTON"; groupId: string; buttonName: string; index: number; breakpointId?: string }
	| { type: "MOVE_BUTTON"; fromGroupId: string; fromIndex: number; toGroupId: string; toIndex: number; breakpointId?: string }
	| { type: "REORDER_BUTTON"; groupId: string; fromIndex: number; toIndex: number; breakpointId?: string }
	| { type: "SET_MORE_BUTTON"; groupId: string; config?: MoreButtonConfig; breakpointId?: string }
	| { type: "SET_FLOAT_RIGHT"; groupId: string; value: boolean; breakpointId?: string }
	| { type: "ADD_BREAKPOINT"; width: number }
	| { type: "REMOVE_BREAKPOINT"; breakpointId: string }
	| { type: "COPY_TO_BREAKPOINT"; breakpointId: string; sourceBreakpointId?: string }
	| { type: "INSERT_GROUP"; rowId: string; groupIndex: number; items?: string[]; breakpointId?: string }
	| { type: "MOVE_GROUP"; groupId: string; targetRowId: string; targetIndex: number; breakpointId?: string }
	| { type: "CLEAR"; breakpointId?: string };
