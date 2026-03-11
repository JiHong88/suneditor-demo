import type { BuilderState, BuilderRow, BuilderGroup, BreakpointConfig, MoreButtonConfig } from "./builderTypes";
import { BUTTON_MAP } from "./buttonCatalog";

/* ── Helpers ──────────────────────────────────────────── */

let _idCounter = 0;
function uid(): string {
	return `b${++_idCounter}_${Date.now().toString(36)}`;
}

/** Parse ":Label-icon.className" → MoreButtonConfig */
function parseMoreButton(str: string): MoreButtonConfig | undefined {
	const m = str.match(/^:(.+?)-([^.]+)\.(.+)$/);
	if (!m) return undefined;
	return { label: m[1], icon: m[2], className: m[3] };
}

/** Serialize MoreButtonConfig → ":Label-icon.className" */
function serializeMoreButton(cfg: MoreButtonConfig): string {
	return `:${cfg.label}-${cfg.icon}.${cfg.className}`;
}

/** Check if a string is a known button name (not a special control) */
function isButton(s: string): boolean {
	return !!BUTTON_MAP[s] || s.startsWith(":");
}

/* ── SunEditor buttonList → BuilderState ─────────────── */

/**
 * Parse a flat button list (one breakpoint level) into BuilderRows.
 * Groups are separated by "|", rows by "/".
 */
function parseFlat(list: unknown[]): BuilderRow[] {
	const rows: BuilderRow[] = [];
	let currentRow: BuilderRow = { id: uid(), groups: [] };
	let currentGroup: BuilderGroup = { id: uid(), items: [] };

	const flushGroup = () => {
		if (currentGroup.items.length > 0 || currentGroup.moreButton) {
			currentRow.groups.push(currentGroup);
		}
		currentGroup = { id: uid(), items: [] };
	};

	const flushRow = () => {
		flushGroup();
		if (currentRow.groups.length > 0) {
			rows.push(currentRow);
		}
		currentRow = { id: uid(), groups: [] };
	};

	for (const item of list) {
		if (item === "|") {
			// Top-level separator → add "|" item to current group, then flush
			currentGroup.items.push("|");
			flushGroup();
		} else if (item === "/") {
			flushRow();
		} else if (typeof item === "string" && item.startsWith("-")) {
			// Float: "-right", "-left", "-center" → mark the next group
			currentGroup.floatRight = item === "-right";
		} else if (typeof item === "string" && item === "#fix") {
			// Skip #fix (RTL hint, not user-configurable)
		} else if (Array.isArray(item)) {
			// Sub-array = a button group
			flushGroup();

			const newGroup: BuilderGroup = { id: uid(), items: [] };

			for (const sub of item) {
				if (typeof sub === "string") {
					if (sub === "|") {
						// Inline separator within a group — keep as item
						newGroup.items.push("|");
					} else if (sub.startsWith(":")) {
						// :MoreButton header
						newGroup.moreButton = parseMoreButton(sub);
					} else if (sub.startsWith("-")) {
						newGroup.floatRight = sub === "-right";
					} else if (sub === "#fix") {
						// skip
					} else {
						newGroup.items.push(sub);
					}
				}
			}

			if (newGroup.items.length > 0 || newGroup.moreButton) {
				currentRow.groups.push(newGroup);
			}
		} else if (typeof item === "string" && isButton(item)) {
			currentGroup.items.push(item);
		}
	}

	flushRow();

	// Ensure at least one row with one group
	if (rows.length === 0) {
		rows.push({ id: uid(), groups: [{ id: uid(), items: [] }] });
	}

	return rows;
}

/**
 * Convert a SunEditor buttonList array into a BuilderState.
 * Handles responsive breakpoint entries like ["%768", [...buttons...]].
 */
export function buttonListToBuilder(list: unknown[]): BuilderState {
	const defaultItems: unknown[] = [];
	const breakpoints: BreakpointConfig[] = [];

	for (const item of list) {
		if (Array.isArray(item) && item.length === 2 && typeof item[0] === "string" && (item[0] as string).startsWith("%")) {
			const width = parseInt((item[0] as string).slice(1), 10);
			if (!isNaN(width) && Array.isArray(item[1])) {
				breakpoints.push({
					id: uid(),
					width,
					rows: parseFlat(item[1] as unknown[]),
				});
			}
		} else {
			defaultItems.push(item);
		}
	}

	// Sort breakpoints descending (larger first)
	breakpoints.sort((a, b) => b.width - a.width);

	return {
		rows: parseFlat(defaultItems),
		breakpoints,
	};
}

/* ── BuilderState → SunEditor buttonList ─────────────── */

function serializeRows(rows: BuilderRow[]): unknown[] {
	const result: unknown[] = [];

	for (let ri = 0; ri < rows.length; ri++) {
		const row = rows[ri];
		if (ri > 0) result.push("/");

		for (let gi = 0; gi < row.groups.length; gi++) {
			const group = row.groups[gi];

			// Separator-only group → emit as top-level "|"
			if (!group.floatRight && !group.moreButton && group.items.length === 1 && group.items[0] === "|") {
				result.push("|");
				continue;
			}

			const items: string[] = [];
			if (group.floatRight) items.push("-right");
			if (group.moreButton) items.push(serializeMoreButton(group.moreButton));
			items.push(...group.items);

			if (items.length > 0) {
				result.push(items);
			}
		}
	}

	return result;
}

/**
 * Convert a BuilderState back to a SunEditor buttonList array.
 */
export function builderToButtonList(state: BuilderState): unknown[] {
	const result = serializeRows(state.rows);

	// Append breakpoints (sorted descending by width)
	const sorted = [...state.breakpoints].sort((a, b) => b.width - a.width);
	for (const bp of sorted) {
		result.push([`%${bp.width}`, serializeRows(bp.rows)]);
	}

	return result;
}

/* ── Create empty state ──────────────────────────────── */

export function createEmptyState(): BuilderState {
	return {
		rows: [{ id: uid(), groups: [{ id: uid(), items: [] }] }],
		breakpoints: [],
	};
}

export function createEmptyRow(): BuilderRow {
	return { id: uid(), groups: [{ id: uid(), items: [] }] };
}

export function createEmptyGroup(): BuilderGroup {
	return { id: uid(), items: [] };
}
