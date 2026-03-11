import { useReducer, useCallback } from "react";
import type { BuilderState, BuilderAction, BuilderRow } from "./builderTypes";
import { createEmptyRow, createEmptyGroup } from "./builderConversion";

/* ── Find helpers ─────────────────────────────────────── */

function getRows(state: BuilderState, breakpointId?: string): BuilderRow[] {
	if (!breakpointId) return state.rows;
	return state.breakpoints.find((bp) => bp.id === breakpointId)?.rows ?? [];
}

function withRows(state: BuilderState, rows: BuilderRow[], breakpointId?: string): BuilderState {
	if (!breakpointId) return { ...state, rows };
	return {
		...state,
		breakpoints: state.breakpoints.map((bp) => (bp.id === breakpointId ? { ...bp, rows } : bp)),
	};
}

/* ── Reducer ──────────────────────────────────────────── */

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
	switch (action.type) {
		case "SET":
			return action.state;

		case "ADD_ROW": {
			const rows = [...getRows(state, action.breakpointId), createEmptyRow()];
			return withRows(state, rows, action.breakpointId);
		}

		case "REMOVE_ROW": {
			let rows = getRows(state, action.breakpointId).filter((r) => r.id !== action.rowId);
			if (rows.length === 0) rows = [createEmptyRow()];
			return withRows(state, rows, action.breakpointId);
		}

		case "ADD_GROUP": {
			const rows = getRows(state, action.breakpointId).map((r) =>
				r.id === action.rowId ? { ...r, groups: [...r.groups, createEmptyGroup()] } : r,
			);
			return withRows(state, rows, action.breakpointId);
		}

		case "REMOVE_GROUP": {
			const rows = getRows(state, action.breakpointId).map((r) => {
				const groups = r.groups.filter((g) => g.id !== action.groupId);
				return { ...r, groups: groups.length > 0 ? groups : [createEmptyGroup()] };
			});
			return withRows(state, rows, action.breakpointId);
		}

		case "ADD_BUTTON": {
			const rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => {
					if (g.id !== action.groupId) return g;
					const items = [...g.items];
					const idx = action.index ?? items.length;
					items.splice(idx, 0, action.buttonName);
					return { ...g, items };
				}),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "REMOVE_BUTTON": {
			const rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => {
					if (g.id !== action.groupId) return g;
					const items = [...g.items];
					items.splice(action.index, 1);
					return { ...g, items };
				}),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "REORDER_BUTTON": {
			const rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => {
					if (g.id !== action.groupId) return g;
					const items = [...g.items];
					const [moved] = items.splice(action.fromIndex, 1);
					items.splice(action.toIndex, 0, moved);
					return { ...g, items };
				}),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "MOVE_BUTTON": {
			// Remove from source group, add to target group
			let buttonName = "";
			let rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => {
					if (g.id !== action.fromGroupId) return g;
					const items = [...g.items];
					buttonName = items[action.fromIndex];
					items.splice(action.fromIndex, 1);
					return { ...g, items };
				}),
			}));
			if (!buttonName) return state;
			rows = rows.map((r) => ({
				...r,
				groups: r.groups.map((g) => {
					if (g.id !== action.toGroupId) return g;
					const items = [...g.items];
					items.splice(action.toIndex, 0, buttonName);
					return { ...g, items };
				}),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "SET_MORE_BUTTON": {
			const rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => (g.id === action.groupId ? { ...g, moreButton: action.config } : g)),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "SET_FLOAT_RIGHT": {
			const rows = getRows(state, action.breakpointId).map((r) => ({
				...r,
				groups: r.groups.map((g) => (g.id === action.groupId ? { ...g, floatRight: action.value || undefined } : g)),
			}));
			return withRows(state, rows, action.breakpointId);
		}

		case "ADD_BREAKPOINT": {
			// Copy from default rows
			const defaultRows = structuredClone(state.rows).map((r) => ({
				...r,
				id: `bp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
				groups: r.groups.map((g) => ({
					...g,
					id: `bg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
				})),
			}));
			return {
				...state,
				breakpoints: [
					...state.breakpoints,
					{ id: `bp_${Date.now()}`, width: action.width, rows: defaultRows },
				].sort((a, b) => b.width - a.width),
			};
		}

		case "REMOVE_BREAKPOINT":
			return { ...state, breakpoints: state.breakpoints.filter((bp) => bp.id !== action.breakpointId) };

		case "COPY_TO_BREAKPOINT": {
			const sourceRows = action.sourceBreakpointId
				? state.breakpoints.find((bp) => bp.id === action.sourceBreakpointId)?.rows ?? state.rows
				: state.rows;
			const cloned = structuredClone(sourceRows).map((r) => ({
				...r,
				id: `cpr_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
				groups: r.groups.map((g) => ({
					...g,
					id: `cpg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
				})),
			}));
			return {
				...state,
				breakpoints: state.breakpoints.map((bp) => (bp.id === action.breakpointId ? { ...bp, rows: cloned } : bp)),
			};
		}

		case "MOVE_GROUP": {
			// Find and remove the group from its current row
			let movedGroup: import("./builderTypes").BuilderGroup | null = null;
			let rows = getRows(state, action.breakpointId).map((r) => {
				const idx = r.groups.findIndex((g) => g.id === action.groupId);
				if (idx === -1) return r;
				movedGroup = r.groups[idx];
				const groups = r.groups.filter((_, i) => i !== idx);
				return { ...r, groups: groups.length > 0 ? groups : [createEmptyGroup()] };
			});
			if (!movedGroup) return state;
			// Insert into target row at target index
			rows = rows.map((r) => {
				if (r.id !== action.targetRowId) return r;
				const groups = [...r.groups];
				groups.splice(action.targetIndex, 0, movedGroup!);
				return { ...r, groups };
			});
			return withRows(state, rows, action.breakpointId);
		}

		case "INSERT_GROUP": {
			const rows = getRows(state, action.breakpointId).map((r) => {
				if (r.id !== action.rowId) return r;
				const groups = [...r.groups];
				const newGroup = createEmptyGroup();
				if (action.items) newGroup.items = action.items;
				groups.splice(action.groupIndex, 0, newGroup);
				return { ...r, groups };
			});
			return withRows(state, rows, action.breakpointId);
		}

		case "CLEAR": {
			const rows = [createEmptyRow()];
			return withRows(state, rows, action.breakpointId);
		}

		default:
			return state;
	}
}

/* ── Hook ─────────────────────────────────────────────── */

export function useBuilderState(initialState: BuilderState) {
	const [state, dispatch] = useReducer(builderReducer, initialState);

	const set = useCallback((s: BuilderState) => dispatch({ type: "SET", state: s }), []);

	return { state, dispatch, set };
}
