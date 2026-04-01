"use client";

import { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Search, Plus, GripVertical, SeparatorVertical } from "lucide-react";
import { getButtonsByCategory, CATEGORY_LABELS, CATEGORY_ORDER } from "./buttonCatalog";
import type { ButtonMeta, ButtonCategory } from "./builderTypes";

/* ── Separator palette item ───────────────────────────── */

function SeparatorPaletteItem({ onAdd }: { onAdd: (name: string) => void }) {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: "palette-separator",
		data: { type: "palette-button" as const, buttonName: "|" },
	});

	return (
		<div
			ref={setNodeRef}
			className={`flex items-center gap-0.5 rounded-md border border-dashed border-amber-400/50 bg-amber-50/40 text-amber-700 select-none transition-all
				dark:border-amber-500/40 dark:bg-amber-900/30 dark:text-amber-300
				has-[.add-zone:hover]:border-amber-400 has-[.add-zone:hover]:bg-amber-50 dark:has-[.add-zone:hover]:border-amber-500/60 dark:has-[.add-zone:hover]:bg-amber-900/40
				has-[.drag-zone:hover]:border-amber-500 has-[.drag-zone:hover]:bg-amber-50 dark:has-[.drag-zone:hover]:border-amber-500/70 dark:has-[.drag-zone:hover]:bg-amber-900/50
				${isDragging ? "opacity-40" : ""}`}
		>
			<button
				type='button'
				onClick={() => onAdd("|")}
				className='add-zone shrink-0 p-1.5 rounded-s-md hover:text-amber-800 dark:hover:text-amber-300 transition-colors cursor-pointer'
				title='Add separator'
			>
				<Plus className='h-3 w-3' />
			</button>
			<div
				{...attributes}
				{...listeners}
				className='drag-zone flex-1 flex items-center gap-1 pe-2 py-1.5 cursor-grab min-w-0 rounded-e-md hover:text-amber-800 dark:hover:text-amber-300 transition-colors'
			>
				<SeparatorVertical className='h-3.5 w-3.5 shrink-0' />
				<span className='text-[11px] font-medium'>Separator</span>
				<span className='text-[9px] opacity-60 ms-auto'>|</span>
			</div>
		</div>
	);
}

/* ── Draggable palette button ──────────────────────────── */

function PaletteButton({ meta, onAdd }: { meta: ButtonMeta; onAdd: (name: string) => void }) {
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `palette-${meta.name}`,
		data: { type: "palette-button" as const, buttonName: meta.name },
	});

	return (
		<div
			ref={setNodeRef}
			className={`flex items-center gap-0.5 rounded text-[11px] border border-border bg-muted/40 select-none transition-all
				has-[.add-zone:hover]:border-blue-300 has-[.add-zone:hover]:bg-blue-50/50 dark:has-[.add-zone:hover]:border-blue-500/40 dark:has-[.add-zone:hover]:bg-blue-900/30
				has-[.drag-zone:hover]:border-blue-400 has-[.drag-zone:hover]:bg-blue-50 dark:has-[.drag-zone:hover]:border-blue-500/60 dark:has-[.drag-zone:hover]:bg-blue-900/40
				${isDragging ? "opacity-40" : ""}`}
		>
			{/* Click-to-add button */}
			<button
				type='button'
				onClick={() => onAdd(meta.name)}
				className='add-zone shrink-0 p-1 rounded-s hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer'
				title={`Add ${meta.label}`}
			>
				<Plus className='h-3 w-3' />
			</button>
			{/* Drag handle area */}
			<div
				{...attributes}
				{...listeners}
				className='drag-zone flex-1 flex items-center gap-0.5 pe-1.5 py-1 cursor-grab min-w-0 rounded-e hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
			>
				<GripVertical className='h-3 w-3 text-muted-foreground/50 shrink-0' />
				<span className='truncate relative group/tip'>
					{meta.label}
					<span className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-foreground text-background opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50'>
						{meta.label}
					</span>
				</span>
			</div>
		</div>
	);
}

/* ── Draggable category header ────────────────────────── */

function CategoryHeader({
	category,
	availableItems,
	totalCount,
	open,
	onToggle,
	onAddGroup,
}: {
	category: ButtonCategory;
	availableItems: string[];
	totalCount: number;
	open: boolean;
	onToggle: () => void;
	onAddGroup?: (items: string[]) => void;
}) {
	const hasAvailable = availableItems.length > 0;
	const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
		id: `palette-group-${category}`,
		data: { type: "palette-group" as const, items: availableItems },
		disabled: !hasAvailable,
	});

	if (!onAddGroup || !hasAvailable) {
		// Non-draggable fallback (no group handler or all used)
		return (
			<button
				type='button'
				onClick={onToggle}
				className='flex items-center gap-1.5 w-full text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground py-1.5 transition-colors cursor-pointer'
			>
				<span className={`transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
				{CATEGORY_LABELS[category]}
				<span className='text-muted-foreground/60 font-normal normal-case'>
					{availableItems.length}/{totalCount}
				</span>
			</button>
		);
	}

	return (
		<div
			ref={setNodeRef}
			className={`flex items-center gap-0.5 rounded-md border select-none transition-all mb-1
				border-emerald-300/60 bg-emerald-50/40 text-emerald-700
				dark:border-emerald-600/40 dark:bg-emerald-900/30 dark:text-emerald-300
				has-[.add-zone:hover]:border-emerald-400 has-[.add-zone:hover]:bg-emerald-50 dark:has-[.add-zone:hover]:border-emerald-500/60 dark:has-[.add-zone:hover]:bg-emerald-900/40
				has-[.drag-zone:hover]:border-emerald-500 has-[.drag-zone:hover]:bg-emerald-50 dark:has-[.drag-zone:hover]:border-emerald-500/70 dark:has-[.drag-zone:hover]:bg-emerald-900/50
				${isDragging ? "opacity-40" : ""}`}
		>
			{/* Click-to-add group */}
			<button
				type='button'
				onClick={() => onAddGroup(availableItems)}
				className='add-zone shrink-0 px-1 py-0.5 rounded-s-md hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer'
				title={`Add ${CATEGORY_LABELS[category]} group`}
			>
				<Plus className='h-3 w-3' />
			</button>
			{/* Drag handle + toggle */}
			<div
				{...attributes}
				{...listeners}
				className='drag-zone flex-1 flex items-center gap-1 pe-2 py-0.5 cursor-grab min-w-0 rounded-e-md hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors'
			>
				<GripVertical className='h-3 w-3 shrink-0 opacity-50' />
				<span className='text-[10px] font-semibold uppercase tracking-wider'>{CATEGORY_LABELS[category]}</span>
				<span className='text-[9px] opacity-60 ms-auto font-normal normal-case'>{availableItems.length}/{totalCount}</span>
			</div>
			{/* Collapse toggle */}
			<button
				type='button'
				onClick={onToggle}
				className='shrink-0 px-1.5 py-0.5 rounded-e-md text-emerald-600/60 hover:text-emerald-700 dark:text-emerald-400/60 dark:hover:text-emerald-300 transition-colors cursor-pointer'
			>
				<span className={`inline-block text-[10px] transition-transform ${open ? "rotate-90" : ""}`}>▸</span>
			</button>
		</div>
	);
}

/* ── Category section ──────────────────────────────────── */

function CategorySection({
	category,
	buttons,
	usedButtons,
	onAdd,
	onAddGroup,
}: {
	category: ButtonCategory;
	buttons: ButtonMeta[];
	usedButtons: Set<string>;
	onAdd: (name: string) => void;
	onAddGroup?: (items: string[]) => void;
}) {
	const [open, setOpen] = useState(true);
	const available = buttons.filter((b) => !usedButtons.has(b.name));
	const used = buttons.filter((b) => usedButtons.has(b.name));

	return (
		<div>
			<CategoryHeader
				category={category}
				availableItems={available.map((b) => b.name)}
				totalCount={buttons.length}
				open={open}
				onToggle={() => setOpen(!open)}
				onAddGroup={onAddGroup}
			/>
			{open && (
				<div className='grid grid-cols-2 gap-1 mt-1 mb-3'>
					{available.map((b) => (
						<PaletteButton key={b.name} meta={b} onAdd={onAdd} />
					))}
					{used.map((b) => (
						<div
							key={b.name}
							className='flex items-center gap-1 px-1.5 py-1 rounded text-[11px] border border-transparent text-muted-foreground/50 dark:text-muted-foreground/45 cursor-default select-none'
						>
							<span className='truncate line-through relative group/tip'>
								{b.label}
								<span className='pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap bg-foreground text-background opacity-0 group-hover/tip:opacity-100 transition-opacity duration-100 z-50'>
									{b.label}
								</span>
							</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

/* ── Palette component ─────────────────────────────────── */

interface BuilderPaletteProps {
	usedButtons: Set<string>;
	onAdd: (buttonName: string) => void;
	onAddGroup?: (items: string[]) => void;
	search: string;
	onSearchChange: (value: string) => void;
}

export default function BuilderPalette({ usedButtons, onAdd, onAddGroup, search, onSearchChange }: BuilderPaletteProps) {
	const byCategory = useMemo(() => getButtonsByCategory(), []);

	const filteredCategories = useMemo(() => {
		if (!search.trim()) return CATEGORY_ORDER.map((cat) => ({ category: cat, buttons: byCategory.get(cat) ?? [] }));

		const q = search.toLowerCase();
		return CATEGORY_ORDER.map((cat) => ({
			category: cat,
			buttons: (byCategory.get(cat) ?? []).filter((b) => b.name.toLowerCase().includes(q) || b.label.toLowerCase().includes(q)),
		})).filter((c) => c.buttons.length > 0);
	}, [search, byCategory]);

	return (
		<div className='flex flex-col h-full'>
			{/* Separator - prominent at top */}
			<div className='mb-3'>
				<SeparatorPaletteItem onAdd={onAdd} />
			</div>

			{/* Search */}
			<div className='relative mb-3'>
				<Search className='absolute start-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60' />
				<input
					type='text'
					value={search}
					onChange={(e) => onSearchChange(e.target.value)}
					placeholder='Search buttons...'
					className='w-full ps-7 pe-2 py-1.5 text-xs rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary/40 placeholder:text-muted-foreground/50'
				/>
			</div>

			{/* Categories */}
			<div className='flex-1 overflow-y-auto space-y-1 -me-1 pe-1 pb-24'>
				{filteredCategories.map(({ category, buttons }) => (
					<CategorySection key={category} category={category} buttons={buttons} usedButtons={usedButtons} onAdd={onAdd} onAddGroup={onAddGroup} />
				))}
				{filteredCategories.length === 0 && (
					<p className='text-[11px] text-muted-foreground/60 italic py-4 text-center'>No buttons found</p>
				)}
			</div>
		</div>
	);
}
