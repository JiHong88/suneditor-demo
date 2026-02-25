"use client";

import { type Dispatch } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction, isFixedOption } from "../_lib/playgroundState";

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

function FieldLabel({ label, fixed }: { label: string; fixed?: boolean }) {
	return (
		<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
			{label}
			{fixed && <span className='rounded bg-destructive/15 px-1 py-0.5 text-[10px] font-medium text-destructive'>remount</span>}
		</span>
	);
}

function SelectField({
	label,
	value,
	options,
	onChange,
	fixed,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
	fixed?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} fixed={fixed} />
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring'
			>
				{options.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</select>
		</label>
	);
}

function TextInput({
	label,
	value,
	onChange,
	placeholder,
	fixed,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	fixed?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} fixed={fixed} />
			<input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className='h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring'
			/>
		</label>
	);
}

function NumberInput({
	label,
	value,
	onChange,
	fixed,
}: {
	label: string;
	value: number | null;
	onChange: (v: number | null) => void;
	fixed?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} fixed={fixed} />
			<input
				type='number'
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
				className='h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring'
			/>
		</label>
	);
}

function SwitchField({
	label,
	checked,
	onChange,
	fixed,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
	fixed?: boolean;
}) {
	return (
		<label className='flex items-center justify-between gap-2 py-0.5'>
			<FieldLabel label={label} fixed={fixed} />
			<button
				type='button'
				role='switch'
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${
					checked ? "bg-primary" : "bg-muted"
				}`}
			>
				<span className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`} />
			</button>
		</label>
	);
}

function TextareaField({
	label,
	value,
	onChange,
	placeholder,
	fixed,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	fixed?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} fixed={fixed} />
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={2}
				className='rounded-md border border-input bg-background px-2 py-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-ring resize-y'
			/>
		</label>
	);
}

/* ── Helper to dispatch ────────────────────────────────── */

function useSet(dispatch: Dispatch<PlaygroundAction>) {
	return <K extends keyof PlaygroundState>(key: K) =>
		(value: PlaygroundState[K]) =>
			dispatch({ type: "SET", key, value });
}

/* ── Main component ────────────────────────────────────── */

export default function PlaygroundControls({ state, dispatch }: Props) {
	const set = useSet(dispatch);

	return (
		<Accordion type='multiple' defaultValue={["mode-theme", "layout"]} className='w-full'>
			{/* Mode & Theme */}
			<AccordionItem value='mode-theme'>
				<AccordionTrigger className='text-sm font-semibold'>Mode & Theme</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SelectField
							label='mode'
							value={state.mode}
							options={[
								{ value: "classic", label: "Classic" },
								{ value: "inline", label: "Inline" },
								{ value: "balloon", label: "Balloon" },
								{ value: "balloon-always", label: "Balloon Always" },
							]}
							onChange={(v) => set("mode")(v as PlaygroundState["mode"])}
							fixed={isFixedOption("mode")}
						/>
						<SelectField
							label='buttonList'
							value={state.buttonListPreset}
							options={[
								{ value: "basic", label: "Basic" },
								{ value: "standard", label: "Standard" },
								{ value: "full", label: "Full" },
							]}
							onChange={(v) => set("buttonListPreset")(v as PlaygroundState["buttonListPreset"])}
							fixed={isFixedOption("buttonListPreset")}
						/>
						<SelectField
							label='theme'
							value={state.theme}
							options={[
								{ value: "", label: "Default" },
								{ value: "dark", label: "Dark" },
							]}
							onChange={set("theme")}
						/>
						<SelectField
							label='textDirection'
							value={state.textDirection}
							options={[
								{ value: "ltr", label: "LTR" },
								{ value: "rtl", label: "RTL" },
							]}
							onChange={(v) => set("textDirection")(v as PlaygroundState["textDirection"])}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Layout & Sizing */}
			<AccordionItem value='layout'>
				<AccordionTrigger className='text-sm font-semibold'>Layout & Sizing</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='width' value={state.width} onChange={set("width")} placeholder='100%' />
						<TextInput label='height' value={state.height} onChange={set("height")} placeholder='auto' />
						<TextInput label='minWidth' value={state.minWidth} onChange={set("minWidth")} />
						<TextInput label='maxWidth' value={state.maxWidth} onChange={set("maxWidth")} />
						<TextInput label='minHeight' value={state.minHeight} onChange={set("minHeight")} />
						<TextInput label='maxHeight' value={state.maxHeight} onChange={set("maxHeight")} />
						<div className='col-span-2'>
							<TextInput label='editorStyle' value={state.editorStyle} onChange={set("editorStyle")} placeholder='CSS string' />
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Toolbar */}
			<AccordionItem value='toolbar'>
				<AccordionTrigger className='text-sm font-semibold'>Toolbar</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='toolbar_width' value={state.toolbar_width} onChange={set("toolbar_width")} placeholder='auto' />
						<NumberInput label='toolbar_sticky' value={state.toolbar_sticky} onChange={(v) => set("toolbar_sticky")(v ?? 0)} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='toolbar_hide' checked={state.toolbar_hide} onChange={set("toolbar_hide")} />
						<SwitchField label='shortcutsHint' checked={state.shortcutsHint} onChange={set("shortcutsHint")} />
						<SwitchField label='shortcutsDisable' checked={state.shortcutsDisable} onChange={set("shortcutsDisable")} fixed={isFixedOption("shortcutsDisable")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Statusbar & Counter */}
			<AccordionItem value='statusbar'>
				<AccordionTrigger className='text-sm font-semibold'>Statusbar & Counter</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='statusbar' checked={state.statusbar} onChange={set("statusbar")} />
						<SwitchField label='statusbar_showPathLabel' checked={state.statusbar_showPathLabel} onChange={set("statusbar_showPathLabel")} />
						<SwitchField
							label='statusbar_resizeEnable'
							checked={state.statusbar_resizeEnable}
							onChange={set("statusbar_resizeEnable")}
							fixed={isFixedOption("statusbar_resizeEnable")}
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='charCounter' checked={state.charCounter} onChange={set("charCounter")} />
						<NumberInput label='charCounter_max' value={state.charCounter_max} onChange={set("charCounter_max")} />
						<TextInput label='charCounter_label' value={state.charCounter_label} onChange={set("charCounter_label")} />
						<SelectField
							label='charCounter_type'
							value={state.charCounter_type}
							options={[
								{ value: "char", label: "char" },
								{ value: "byte", label: "byte" },
								{ value: "byte-html", label: "byte-html" },
							]}
							onChange={(v) => set("charCounter_type")(v as PlaygroundState["charCounter_type"])}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Content & Behavior */}
			<AccordionItem value='content'>
				<AccordionTrigger className='text-sm font-semibold'>Content & Behavior</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<div className='col-span-2'>
							<TextInput label='placeholder' value={state.placeholder} onChange={set("placeholder")} />
						</div>
						<SwitchField label='iframe' checked={state.iframe} onChange={set("iframe")} fixed={isFixedOption("iframe")} />
						{state.iframe && <SwitchField label='iframe_fullPage' checked={state.iframe_fullPage} onChange={set("iframe_fullPage")} fixed={isFixedOption("iframe_fullPage")} />}
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='defaultLine' value={state.defaultLine} onChange={set("defaultLine")} fixed={isFixedOption("defaultLine")} placeholder='p' />
						<SelectField
							label='defaultLineBreakFormat'
							value={state.defaultLineBreakFormat}
							options={[
								{ value: "line", label: "line" },
								{ value: "br", label: "br" },
							]}
							onChange={(v) => set("defaultLineBreakFormat")(v as PlaygroundState["defaultLineBreakFormat"])}
						/>
						<SelectField
							label='retainStyleMode'
							value={state.retainStyleMode}
							options={[
								{ value: "repeat", label: "repeat" },
								{ value: "always", label: "always" },
								{ value: "none", label: "none" },
							]}
							onChange={(v) => set("retainStyleMode")(v as PlaygroundState["retainStyleMode"])}
						/>
						<SwitchField label='freeCodeViewMode' checked={state.freeCodeViewMode} onChange={set("freeCodeViewMode")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Features */}
			<AccordionItem value='features'>
				<AccordionTrigger className='text-sm font-semibold'>Features</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='autoLinkify' checked={state.autoLinkify} onChange={set("autoLinkify")} />
						<SwitchField label='copyFormatKeepOn' checked={state.copyFormatKeepOn} onChange={set("copyFormatKeepOn")} />
						<SwitchField label='tabDisable' checked={state.tabDisable} onChange={set("tabDisable")} />
						<SwitchField label='syncTabIndent' checked={state.syncTabIndent} onChange={set("syncTabIndent")} />
						<SwitchField
							label='closeModalOutsideClick'
							checked={state.closeModalOutsideClick}
							onChange={set("closeModalOutsideClick")}
							fixed={isFixedOption("closeModalOutsideClick")}
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SelectField
							label='componentInsertBehavior'
							value={state.componentInsertBehavior}
							options={[
								{ value: "auto", label: "auto" },
								{ value: "select", label: "select" },
								{ value: "line", label: "line" },
								{ value: "none", label: "none" },
							]}
							onChange={(v) => set("componentInsertBehavior")(v as PlaygroundState["componentInsertBehavior"])}
						/>
						<NumberInput label='historyStackDelayTime' value={state.historyStackDelayTime} onChange={(v) => set("historyStackDelayTime")(v ?? 400)} />
						<NumberInput label='fullScreenOffset' value={state.fullScreenOffset} onChange={(v) => set("fullScreenOffset")(v ?? 0)} />
						<TextInput label='defaultUrlProtocol' value={state.defaultUrlProtocol} onChange={set("defaultUrlProtocol")} placeholder='https://' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Filtering (Advanced) */}
			<AccordionItem value='filtering'>
				<AccordionTrigger className='text-sm font-semibold'>Filtering (Advanced)</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='strictMode' checked={state.strictMode} onChange={set("strictMode")} fixed={isFixedOption("strictMode")} />
						<TextInput label='fontSizeUnits' value={state.fontSizeUnits} onChange={set("fontSizeUnits")} fixed={isFixedOption("fontSizeUnits")} placeholder='px,pt,em,rem' />
						<TextInput label='lineAttrReset' value={state.lineAttrReset} onChange={set("lineAttrReset")} placeholder='id|name' />
						<TextInput label='printClass' value={state.printClass} onChange={set("printClass")} />
					</div>
					<div className='mt-3 grid gap-3'>
						<TextareaField
							label='elementWhitelist'
							value={state.elementWhitelist}
							onChange={set("elementWhitelist")}
							fixed={isFixedOption("elementWhitelist")}
							placeholder='tag1|tag2'
						/>
						<TextareaField
							label='elementBlacklist'
							value={state.elementBlacklist}
							onChange={set("elementBlacklist")}
							fixed={isFixedOption("elementBlacklist")}
							placeholder='script|style'
						/>
						<TextareaField
							label='attributeWhitelist'
							value={state.attributeWhitelist}
							onChange={set("attributeWhitelist")}
							fixed={isFixedOption("attributeWhitelist")}
							placeholder='{"a": "href|target", "*": "id"}'
						/>
						<TextareaField
							label='attributeBlacklist'
							value={state.attributeBlacklist}
							onChange={set("attributeBlacklist")}
							fixed={isFixedOption("attributeBlacklist")}
							placeholder='{"*": "onclick"}'
						/>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
