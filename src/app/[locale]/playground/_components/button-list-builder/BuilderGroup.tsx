"use client";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { ChevronDown, Trash2, AlignRight, GripVertical } from "lucide-react";
import type { BuilderGroup as GroupType, BuilderAction } from "./builderTypes";
import BuilderButton from "./BuilderButton";
import { useTranslations } from "next-intl";

/* ── Insertion gap between buttons ────────────────────── */

function InsertionGap({ groupId, index, isPreview, disabled }: { groupId: string; index: number; isPreview?: boolean; disabled?: boolean }) {
	const { setNodeRef } = useDroppable({
		id: `gap__${groupId}__${index}`,
		data: { type: "insertion-gap" as const, groupId, index },
		disabled,
	});

	return (
		<div
			ref={setNodeRef}
			className={`self-stretch flex items-center justify-center transition-all duration-200 ease-in-out
				${isPreview ? "w-14" : "w-0.5"}`}
		>
			{isPreview && (
				<div className='w-12 h-7 rounded border-2 border-dashed border-primary/40 bg-primary/5' />
			)}
		</div>
	);
}

/* ── Group component ──────────────────────────────────── */

interface BuilderGroupProps {
	group: GroupType;
	dispatch: React.Dispatch<BuilderAction>;
	breakpointId?: string;
	isOnly: boolean;
	dragPreview?: { groupId: string; index: number } | null;
	isDragging?: boolean;
	isDraggingGroup?: boolean;
	onButtonHover?: (info: { name: string; groupId: string; index: number } | null) => void;
	onMoreGroupHover?: (groupId: string | null) => void;
	onGroupActionHover?: (info: { groupId: string; action: "drag" | "float" | "more" | "delete" } | null) => void;
	searchQuery?: string;
}

export default function BuilderGroup({ group, dispatch, breakpointId, isOnly, dragPreview, isDragging, isDraggingGroup, onButtonHover, onMoreGroupHover, onGroupActionHover, searchQuery }: BuilderGroupProps) {
	const t = useTranslations("Playground.builder");
	// Separator-only group: just a "|" item, no group actions
	const isSeparatorOnly = !group.floatRight && !group.moreButton && group.items.length === 1 && group.items[0] === "|";

	const { attributes: groupDragAttrs, listeners: groupDragListeners, setNodeRef: setDragRef, isDragging: isGroupDragging } = useDraggable({
		id: `group-drag-${group.id}`,
		data: { type: "canvas-group" as const, groupId: group.id },
	});

	const { setNodeRef, isOver } = useDroppable({
		id: `group-drop-${group.id}`,
		data: { type: "group-drop" as const, groupId: group.id },
		disabled: isGroupDragging,
	});

	// Create stable sortable IDs: groupId__index__buttonName
	const sortableIds = group.items.map((name, i) => `${group.id}__${i}__${name}`);

	// Border color based on floatRight / moreButton state (transparent by default, visible on hover)
	const hasRight = !!group.floatRight;
	const hasMore = !!group.moreButton;

	// Group hover prominence classes (only when not dragging a group, skip for separator-only)
	const groupHoverClasses = isSeparatorOnly
		? ""
		: isDraggingGroup
		? ""
		: hasRight && hasMore
			? "hover:border-rose-400 hover:bg-muted/30 hover:shadow-sm dark:hover:border-rose-500/60 dark:hover:bg-muted/20"
			: hasRight
				? "hover:border-orange-400 hover:bg-muted/30 hover:shadow-sm dark:hover:border-orange-500/60 dark:hover:bg-muted/20"
				: hasMore
					? "hover:border-violet-400 hover:bg-muted/30 hover:shadow-sm dark:hover:border-violet-500/60 dark:hover:bg-muted/20"
					: "hover:border-foreground/30 hover:bg-muted/30 hover:shadow-sm dark:hover:border-foreground/20 dark:hover:bg-muted/20";

	return (
		<div
			ref={setNodeRef}
			className={`group/grp relative flex flex-wrap items-center min-h-[36px] min-w-[70px] px-1.5 py-2 rounded-lg border border-dashed transition-colors
				${isOver ? "border-primary !border-solid bg-primary/5 shadow-sm" : "border-transparent bg-background"}
				${isGroupDragging ? "!border-emerald-400 !bg-emerald-50/50 opacity-40 dark:!border-emerald-500/60 dark:!bg-emerald-900/25" : ""}
				${groupHoverClasses}
				has-[.group-drag-zone:hover]:border-emerald-400 has-[.group-drag-zone:hover]:bg-emerald-50/30 dark:has-[.group-drag-zone:hover]:border-emerald-500/60 dark:has-[.group-drag-zone:hover]:bg-emerald-900/25
				has-[.group-float-zone:hover]:border-orange-400 has-[.group-float-zone:hover]:bg-orange-50/30 dark:has-[.group-float-zone:hover]:border-orange-500/60 dark:has-[.group-float-zone:hover]:bg-orange-900/25
				has-[.group-more-zone:hover]:border-violet-400 has-[.group-more-zone:hover]:bg-violet-50/30 dark:has-[.group-more-zone:hover]:border-violet-500/60 dark:has-[.group-more-zone:hover]:bg-violet-900/25
				has-[.group-delete-zone:hover]:border-red-400 has-[.group-delete-zone:hover]:bg-red-50/30 dark:has-[.group-delete-zone:hover]:border-red-500/60 dark:has-[.group-delete-zone:hover]:bg-red-900/25`}
			onMouseEnter={group.moreButton ? () => onMoreGroupHover?.(group.id) : undefined}
			onMouseLeave={group.moreButton ? () => onMoreGroupHover?.(null) : undefined}
		>
			{/* MoreButton label */}
			{group.moreButton && (
				<span className='text-[10px] font-semibold text-violet-700 dark:text-violet-200 bg-violet-100 dark:bg-violet-800/50 px-2 py-0.5 rounded me-1'>
					:{group.moreButton.label}
				</span>
			)}

			{/* Float right indicator */}
			{group.floatRight && (
				<span className='text-[10px] font-semibold text-orange-700 dark:text-orange-200 bg-orange-100 dark:bg-orange-800/50 px-1.5 py-0.5 rounded me-1'>
					-right
				</span>
			)}

			{/* Buttons with insertion gaps */}
			<SortableContext items={sortableIds} strategy={horizontalListSortingStrategy}>
				{group.items.map((name, i) => (
					<div key={sortableIds[i]} className='flex items-center'>
						<InsertionGap groupId={group.id} index={i} isPreview={isDragging && dragPreview?.index === i} disabled={isGroupDragging} />
						<BuilderButton
							id={sortableIds[i]}
							buttonName={name}
							onRemove={() => dispatch({ type: "REMOVE_BUTTON", groupId: group.id, buttonName: name, index: i, breakpointId })}
							suppressHover={isDraggingGroup}
							onHover={onButtonHover}
							highlight={searchQuery}
						/>
					</div>
				))}
				{/* Trailing gap for appending */}
				<InsertionGap groupId={group.id} index={group.items.length} isPreview={isDragging && dragPreview?.index === group.items.length} disabled={isGroupDragging} />
			</SortableContext>

			{/* Empty placeholder */}
			{group.items.length === 0 && !group.moreButton && (
				<span className='text-[11px] text-muted-foreground/60 italic px-1'>{t("dropHere")}</span>
			)}

			{/* Group actions (hidden for separator-only groups) */}
			{isSeparatorOnly ? null : <div className='absolute -top-3 end-0 flex items-center gap-0.5 opacity-0 group-hover/row:opacity-100 transition-opacity'>
				<div
					ref={setDragRef}
					{...groupDragAttrs}
					{...groupDragListeners}
					className='group-drag-zone p-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-grab text-muted-foreground/50 hover:text-emerald-600 dark:hover:text-emerald-400'
					title={t("dragGroup")}
					onMouseEnter={() => onGroupActionHover?.({ groupId: group.id, action: "drag" })}
					onMouseLeave={() => onGroupActionHover?.(null)}
				>
					<GripVertical className='h-3.5 w-3.5' />
				</div>
				<button
					type='button'
					onClick={() => dispatch({ type: "SET_FLOAT_RIGHT", groupId: group.id, value: !group.floatRight, breakpointId })}
					className={`group-float-zone p-1 rounded hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors cursor-pointer ${group.floatRight ? "text-orange-600 dark:text-orange-400" : "text-muted-foreground/50 hover:text-orange-600 dark:hover:text-orange-400"}`}
					title={t("floatRight")}
					onMouseEnter={() => onGroupActionHover?.({ groupId: group.id, action: "float" })}
					onMouseLeave={() => onGroupActionHover?.(null)}
				>
					<AlignRight className='h-3.5 w-3.5' />
				</button>
				<button
					type='button'
					onClick={() =>
						dispatch({
							type: "SET_MORE_BUTTON",
							groupId: group.id,
							config: group.moreButton ? undefined : { label: "More", icon: "default", className: "more_plus" },
							breakpointId,
						})
					}
					className={`group-more-zone p-1 rounded hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors cursor-pointer ${group.moreButton ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground/50 hover:text-violet-600 dark:hover:text-violet-400"}`}
					title={t("toggleMore")}
					onMouseEnter={() => onGroupActionHover?.({ groupId: group.id, action: "more" })}
					onMouseLeave={() => onGroupActionHover?.(null)}
				>
					<ChevronDown className='h-3.5 w-3.5' />
				</button>
				{!isOnly && (
					<button
						type='button'
						onClick={() => dispatch({ type: "REMOVE_GROUP", groupId: group.id, breakpointId })}
						className='group-delete-zone p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer text-muted-foreground/50'
						title={t("removeGroup")}
						onMouseEnter={() => onGroupActionHover?.({ groupId: group.id, action: "delete" })}
						onMouseLeave={() => onGroupActionHover?.(null)}
					>
						<Trash2 className='h-3.5 w-3.5' />
					</button>
				)}
			</div>}
		</div>
	);
}
