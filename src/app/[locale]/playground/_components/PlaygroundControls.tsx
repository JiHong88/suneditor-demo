"use client";

import { type Dispatch } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction, isFixedOption } from "../_lib/playgroundState";

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

function FieldLabel({ label, resettable }: { label: string; resettable?: boolean }) {
	return (
		<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
			{label}
			{resettable && <span className='rounded bg-green-500/15 px-1 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400'>live</span>}
		</span>
	);
}

function SelectField({
	label,
	value,
	options,
	onChange,
	resettable,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
	resettable?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
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
	resettable,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	resettable?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
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
	resettable,
}: {
	label: string;
	value: number | null;
	onChange: (v: number | null) => void;
	resettable?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
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
	resettable,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
	resettable?: boolean;
}) {
	return (
		<label className='flex items-center justify-between gap-2 py-0.5'>
			<FieldLabel label={label} resettable={resettable} />
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
	resettable,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	resettable?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
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
							resettable={!isFixedOption("mode")}
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
							resettable={!isFixedOption("buttonListPreset")}
						/>
						<SelectField
							label='theme'
							value={state.theme}
							options={[
								{ value: "", label: "Default" },
								{ value: "dark", label: "Dark" },
							]}
							onChange={set("theme")}
							resettable={!isFixedOption("theme")}
						/>
						<SelectField
							label='textDirection'
							value={state.textDirection}
							options={[
								{ value: "ltr", label: "LTR" },
								{ value: "rtl", label: "RTL" },
							]}
							onChange={(v) => set("textDirection")(v as PlaygroundState["textDirection"])}
							resettable={!isFixedOption("textDirection")}
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='type' value={state.type} onChange={set("type")} resettable={!isFixedOption("type")} placeholder='document:header,page' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Layout & Sizing */}
			<AccordionItem value='layout'>
				<AccordionTrigger className='text-sm font-semibold'>Layout & Sizing</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='width' value={state.width} onChange={set("width")} placeholder='100%' resettable={!isFixedOption("width")} />
						<TextInput label='height' value={state.height} onChange={set("height")} placeholder='auto' resettable={!isFixedOption("height")} />
						<TextInput label='minWidth' value={state.minWidth} onChange={set("minWidth")} resettable={!isFixedOption("minWidth")} />
						<TextInput label='maxWidth' value={state.maxWidth} onChange={set("maxWidth")} resettable={!isFixedOption("maxWidth")} />
						<TextInput label='minHeight' value={state.minHeight} onChange={set("minHeight")} resettable={!isFixedOption("minHeight")} />
						<TextInput label='maxHeight' value={state.maxHeight} onChange={set("maxHeight")} resettable={!isFixedOption("maxHeight")} />
						<div className='col-span-2'>
							<TextInput label='editorStyle' value={state.editorStyle} onChange={set("editorStyle")} placeholder='CSS string' resettable={!isFixedOption("editorStyle")} />
						</div>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Toolbar */}
			<AccordionItem value='toolbar'>
				<AccordionTrigger className='text-sm font-semibold'>Toolbar</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='toolbar_width' value={state.toolbar_width} onChange={set("toolbar_width")} placeholder='auto' resettable={!isFixedOption("toolbar_width")} />
						<NumberInput label='toolbar_sticky' value={state.toolbar_sticky} onChange={(v) => set("toolbar_sticky")(v ?? 0)} resettable={!isFixedOption("toolbar_sticky")} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='toolbar_hide' checked={state.toolbar_hide} onChange={set("toolbar_hide")} resettable={!isFixedOption("toolbar_hide")} />
						<SwitchField label='shortcutsHint' checked={state.shortcutsHint} onChange={set("shortcutsHint")} resettable={!isFixedOption("shortcutsHint")} />
						<SwitchField label='shortcutsDisable' checked={state.shortcutsDisable} onChange={set("shortcutsDisable")} resettable={!isFixedOption("shortcutsDisable")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Statusbar & Counter */}
			<AccordionItem value='statusbar'>
				<AccordionTrigger className='text-sm font-semibold'>Statusbar & Counter</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='statusbar' checked={state.statusbar} onChange={set("statusbar")} resettable={!isFixedOption("statusbar")} />
						<SwitchField label='statusbar_showPathLabel' checked={state.statusbar_showPathLabel} onChange={set("statusbar_showPathLabel")} resettable={!isFixedOption("statusbar_showPathLabel")} />
						<SwitchField
							label='statusbar_resizeEnable'
							checked={state.statusbar_resizeEnable}
							onChange={set("statusbar_resizeEnable")}
							resettable={!isFixedOption("statusbar_resizeEnable")}
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='charCounter' checked={state.charCounter} onChange={set("charCounter")} resettable={!isFixedOption("charCounter")} />
						<NumberInput label='charCounter_max' value={state.charCounter_max} onChange={set("charCounter_max")} resettable={!isFixedOption("charCounter_max")} />
						<TextInput label='charCounter_label' value={state.charCounter_label} onChange={set("charCounter_label")} resettable={!isFixedOption("charCounter_label")} />
						<SelectField
							label='charCounter_type'
							value={state.charCounter_type}
							options={[
								{ value: "char", label: "char" },
								{ value: "byte", label: "byte" },
								{ value: "byte-html", label: "byte-html" },
							]}
							onChange={(v) => set("charCounter_type")(v as PlaygroundState["charCounter_type"])}
							resettable={!isFixedOption("charCounter_type")}
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
							<TextInput label='placeholder' value={state.placeholder} onChange={set("placeholder")} resettable={!isFixedOption("placeholder")} />
						</div>
						<SwitchField label='iframe' checked={state.iframe} onChange={set("iframe")} resettable={!isFixedOption("iframe")} />
						{state.iframe && <SwitchField label='iframe_fullPage' checked={state.iframe_fullPage} onChange={set("iframe_fullPage")} resettable={!isFixedOption("iframe_fullPage")} />}
					</div>
					{state.iframe && (
						<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
							<TextInput label='iframe_cssFileName' value={state.iframe_cssFileName} onChange={set("iframe_cssFileName")} placeholder='suneditor' resettable={!isFixedOption("iframe_cssFileName")} />
							<TextInput label='iframe_attributes' value={state.iframe_attributes} onChange={set("iframe_attributes")} placeholder='{"key":"value"}' resettable={!isFixedOption("iframe_attributes")} />
						</div>
					)}
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='editableFrameAttributes' value={state.editableFrameAttributes} onChange={set("editableFrameAttributes")} placeholder='{"spellcheck":"false"}' resettable={!isFixedOption("editableFrameAttributes")} />
						<TextInput label='defaultLine' value={state.defaultLine} onChange={set("defaultLine")} resettable={!isFixedOption("defaultLine")} placeholder='p' />
						<SelectField
							label='defaultLineBreakFormat'
							value={state.defaultLineBreakFormat}
							options={[
								{ value: "line", label: "line" },
								{ value: "br", label: "br" },
							]}
							onChange={(v) => set("defaultLineBreakFormat")(v as PlaygroundState["defaultLineBreakFormat"])}
							resettable={!isFixedOption("defaultLineBreakFormat")}
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
							resettable={!isFixedOption("retainStyleMode")}
						/>
						<SwitchField label='freeCodeViewMode' checked={state.freeCodeViewMode} onChange={set("freeCodeViewMode")} resettable={!isFixedOption("freeCodeViewMode")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Features */}
			<AccordionItem value='features'>
				<AccordionTrigger className='text-sm font-semibold'>Features</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='autoLinkify' checked={state.autoLinkify} onChange={set("autoLinkify")} resettable={!isFixedOption("autoLinkify")} />
						<SwitchField label='copyFormatKeepOn' checked={state.copyFormatKeepOn} onChange={set("copyFormatKeepOn")} resettable={!isFixedOption("copyFormatKeepOn")} />
						<SwitchField label='tabDisable' checked={state.tabDisable} onChange={set("tabDisable")} resettable={!isFixedOption("tabDisable")} />
						<SwitchField label='syncTabIndent' checked={state.syncTabIndent} onChange={set("syncTabIndent")} resettable={!isFixedOption("syncTabIndent")} />
						<SwitchField
							label='closeModalOutsideClick'
							checked={state.closeModalOutsideClick}
							onChange={set("closeModalOutsideClick")}
							resettable={!isFixedOption("closeModalOutsideClick")}
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
							resettable={!isFixedOption("componentInsertBehavior")}
						/>
						<NumberInput label='historyStackDelayTime' value={state.historyStackDelayTime} onChange={(v) => set("historyStackDelayTime")(v ?? 400)} resettable={!isFixedOption("historyStackDelayTime")} />
						<NumberInput label='fullScreenOffset' value={state.fullScreenOffset} onChange={(v) => set("fullScreenOffset")(v ?? 0)} resettable={!isFixedOption("fullScreenOffset")} />
						<TextInput label='defaultUrlProtocol' value={state.defaultUrlProtocol} onChange={set("defaultUrlProtocol")} placeholder='https://' resettable={!isFixedOption("defaultUrlProtocol")} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='autoStyleify' value={state.autoStyleify} onChange={set("autoStyleify")} placeholder='bold,underline,italic,strike' resettable={!isFixedOption("autoStyleify")} />
						<NumberInput label='toastMessageTime' value={state.toastMessageTime} onChange={(v) => set("toastMessageTime")(v ?? 1500)} resettable={!isFixedOption("toastMessageTime")} />
					</div>
					<div className='mt-3 grid gap-3'>
						<TextareaField label='previewTemplate' value={state.previewTemplate} onChange={set("previewTemplate")} placeholder='Custom preview HTML template' resettable={!isFixedOption("previewTemplate")} />
						<TextareaField label='printTemplate' value={state.printTemplate} onChange={set("printTemplate")} placeholder='Custom print HTML template' resettable={!isFixedOption("printTemplate")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Filtering (Advanced) */}
			<AccordionItem value='filtering'>
				<AccordionTrigger className='text-sm font-semibold'>Filtering (Advanced)</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<SwitchField label='strictMode' checked={state.strictMode} onChange={set("strictMode")} resettable={!isFixedOption("strictMode")} />
						<TextInput label='fontSizeUnits' value={state.fontSizeUnits} onChange={set("fontSizeUnits")} resettable={!isFixedOption("fontSizeUnits")} placeholder='px,pt,em,rem' />
						<TextInput label='lineAttrReset' value={state.lineAttrReset} onChange={set("lineAttrReset")} placeholder='id|name' resettable={!isFixedOption("lineAttrReset")} />
						<TextInput label='printClass' value={state.printClass} onChange={set("printClass")} resettable={!isFixedOption("printClass")} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='allowedClassName' value={state.allowedClassName} onChange={set("allowedClassName")} resettable={!isFixedOption("allowedClassName")} placeholder='class1|class2' />
						<TextInput label='allowedEmptyTags' value={state.allowedEmptyTags} onChange={set("allowedEmptyTags")} placeholder='CSS selector' resettable={!isFixedOption("allowedEmptyTags")} />
						<TextInput label='allUsedStyles' value={state.allUsedStyles} onChange={set("allUsedStyles")} resettable={!isFixedOption("allUsedStyles")} placeholder='color|background-color' />
						<TextInput label='scopeSelectionTags' value={state.scopeSelectionTags} onChange={set("scopeSelectionTags")} placeholder='td,table,li,...' resettable={!isFixedOption("scopeSelectionTags")} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='textStyleTags' value={state.textStyleTags} onChange={set("textStyleTags")} resettable={!isFixedOption("textStyleTags")} placeholder='additional tags' />
						<TextInput label='spanStyles' value={state.spanStyles} onChange={set("spanStyles")} resettable={!isFixedOption("spanStyles")} placeholder='font-family|font-size|...' />
						<TextInput label='lineStyles' value={state.lineStyles} onChange={set("lineStyles")} resettable={!isFixedOption("lineStyles")} placeholder='text-align|margin|...' />
					</div>
					<div className='mt-3 grid gap-3'>
						<TextareaField
							label='elementWhitelist'
							value={state.elementWhitelist}
							onChange={set("elementWhitelist")}
							resettable={!isFixedOption("elementWhitelist")}
							placeholder='tag1|tag2'
						/>
						<TextareaField
							label='elementBlacklist'
							value={state.elementBlacklist}
							onChange={set("elementBlacklist")}
							resettable={!isFixedOption("elementBlacklist")}
							placeholder='script|style'
						/>
						<TextareaField
							label='attributeWhitelist'
							value={state.attributeWhitelist}
							onChange={set("attributeWhitelist")}
							resettable={!isFixedOption("attributeWhitelist")}
							placeholder='{"a": "href|target", "*": "id"}'
						/>
						<TextareaField
							label='attributeBlacklist'
							value={state.attributeBlacklist}
							onChange={set("attributeBlacklist")}
							resettable={!isFixedOption("attributeBlacklist")}
							placeholder='{"*": "onclick"}'
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Format Extensions (Advanced) */}
			<AccordionItem value='format-extensions'>
				<AccordionTrigger className='text-sm font-semibold'>Format Extensions</AccordionTrigger>
				<AccordionContent>
					<div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
						<TextInput label='formatLine' value={state.formatLine} onChange={set("formatLine")} resettable={!isFixedOption("formatLine")} placeholder='additional line tags' />
						<TextInput label='formatBrLine' value={state.formatBrLine} onChange={set("formatBrLine")} resettable={!isFixedOption("formatBrLine")} placeholder='additional brLine tags' />
						<TextInput label='formatClosureBrLine' value={state.formatClosureBrLine} onChange={set("formatClosureBrLine")} resettable={!isFixedOption("formatClosureBrLine")} />
						<TextInput label='formatBlock' value={state.formatBlock} onChange={set("formatBlock")} resettable={!isFixedOption("formatBlock")} placeholder='additional block tags' />
						<TextInput label='formatClosureBlock' value={state.formatClosureBlock} onChange={set("formatClosureBlock")} resettable={!isFixedOption("formatClosureBlock")} />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
