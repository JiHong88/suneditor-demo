"use client";

import { type Dispatch, useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction, isFixedOption } from "../_lib/playgroundState";
import { OptionInfo } from "./OptionInfo";
import optionDescriptions from "@/data/api/option-descriptions.json";

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

const optDesc = optionDescriptions as Record<string, { description: string; default?: string }>;

function FieldLabel({ label, resettable, description }: { label: string; resettable?: boolean; description?: string }) {
	const entry = optDesc[label];
	const desc = description ?? entry?.description;
	return (
		<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
			<span>{label}</span>
			{resettable && <span className='shrink-0 rounded bg-green-500/15 px-1 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400'>live</span>}
			{desc && <OptionInfo optionKey={label} description={desc} />}
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
	const [local, setLocal] = useState(value);
	const focusedRef = useRef(false);
	useEffect(() => { if (!focusedRef.current) setLocal(value); }, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
			<input
				type='text'
				value={local}
				onChange={(e) => setLocal(e.target.value)}
				onFocus={() => { focusedRef.current = true; }}
				onBlur={() => { focusedRef.current = false; if (local !== value) onChange(local); }}
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
	placeholder,
	resettable,
}: {
	label: string;
	value: number | null;
	onChange: (v: number | null) => void;
	placeholder?: string;
	resettable?: boolean;
}) {
	const [local, setLocal] = useState(value ?? "");
	const focusedRef = useRef(false);
	useEffect(() => { if (!focusedRef.current) setLocal(value ?? ""); }, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
			<input
				type='number'
				value={local}
				onChange={(e) => setLocal(e.target.value === "" ? "" : Number(e.target.value))}
				onFocus={() => { focusedRef.current = true; }}
				onBlur={() => {
					focusedRef.current = false;
					const parsed = local === "" ? null : Number(local);
					if (parsed !== value) onChange(parsed);
				}}
				placeholder={placeholder}
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
	description,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
	resettable?: boolean;
	description?: string;
}) {
	return (
		<label className='flex items-start justify-between gap-2 py-0.5'>
			<span className='min-w-0'>
				<FieldLabel label={label} resettable={resettable} description={description} />
			</span>
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
	const [local, setLocal] = useState(value);
	const focusedRef = useRef(false);
	useEffect(() => { if (!focusedRef.current) setLocal(value); }, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
			<textarea
				value={local}
				onChange={(e) => setLocal(e.target.value)}
				onFocus={() => { focusedRef.current = true; }}
				onBlur={() => { focusedRef.current = false; if (local !== value) onChange(local); }}
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
	const t = useTranslations("Playground");
	const set = useSet(dispatch);

	return (
		<Accordion type='multiple' defaultValue={["mode-theme"]} className='w-full'>
			{/* Mode & Theme */}
			<AccordionItem value='mode-theme'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-amber-700 dark:text-amber-400'>{t("sections.modeTheme")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<SelectField
							label='mode'
							value={state.mode}
							options={[
								{ value: "classic", label: t("options.classic") },
								{ value: "inline", label: t("options.inline") },
								{ value: "balloon", label: t("options.balloon") },
								{ value: "balloon-always", label: t("options.balloonAlways") },
							]}
							onChange={(v) => set("mode")(v as PlaygroundState["mode"])}
							resettable={!isFixedOption("mode")}
						/>
						<SelectField
							label='buttonList'
							value={state.buttonListPreset}
							options={[
								{ value: "basic", label: t("options.basic") },
								{ value: "standard", label: t("options.standard") },
								{ value: "full", label: t("options.full") },
							]}
							onChange={(v) => set("buttonListPreset")(v as PlaygroundState["buttonListPreset"])}
							resettable={!isFixedOption("buttonListPreset")}
						/>
						<SelectField
							label='theme'
							value={state.theme}
							options={[
								{ value: "", label: t("options.autoSync") },
								{ value: "default", label: t("options.default") },
								{ value: "dark", label: t("options.dark") },
								{ value: "cobalt", label: t("options.cobalt") },
							]}
							onChange={set("theme")}
							resettable={!isFixedOption("theme")}
						/>
						<SelectField
							label='textDirection'
							value={state.textDirection}
							options={[
								{ value: "ltr", label: t("options.ltr") },
								{ value: "rtl", label: t("options.rtl") },
							]}
							onChange={(v) => set("textDirection")(v as PlaygroundState["textDirection"])}
							resettable={!isFixedOption("textDirection")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput label='type' value={state.type} onChange={set("type")} resettable={!isFixedOption("type")} placeholder='document:header,page' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Layout & Sizing */}
			<AccordionItem value='layout'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>{t("sections.layoutSizing")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<TextInput label='width' value={state.width} onChange={set("width")} placeholder='100%' resettable={!isFixedOption("width")} />
						<TextInput label='height' value={state.height} onChange={set("height")} placeholder='auto' resettable={!isFixedOption("height")} />
						<TextInput label='minWidth' value={state.minWidth} onChange={set("minWidth")} placeholder='e.g. 300px' resettable={!isFixedOption("minWidth")} />
						<TextInput label='maxWidth' value={state.maxWidth} onChange={set("maxWidth")} placeholder='e.g. 800px' resettable={!isFixedOption("maxWidth")} />
						<TextInput label='minHeight' value={state.minHeight} onChange={set("minHeight")} placeholder='e.g. 200px' resettable={!isFixedOption("minHeight")} />
						<TextInput label='maxHeight' value={state.maxHeight} onChange={set("maxHeight")} placeholder='e.g. 600px' resettable={!isFixedOption("maxHeight")} />
					</div>
					<div className='mt-3'>
						<TextInput label='editorStyle' value={state.editorStyle} onChange={set("editorStyle")} placeholder='CSS string' resettable={!isFixedOption("editorStyle")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Toolbar */}
			<AccordionItem value='toolbar'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>{t("sections.toolbar")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<TextInput label='toolbar_width' value={state.toolbar_width} onChange={set("toolbar_width")} placeholder='auto' resettable={!isFixedOption("toolbar_width")} />
						<NumberInput label='toolbar_sticky' value={state.toolbar_sticky} onChange={(v) => set("toolbar_sticky")(v ?? 0)} placeholder='0' resettable={!isFixedOption("toolbar_sticky")} />
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField label='toolbar_hide' checked={state.toolbar_hide} onChange={set("toolbar_hide")} resettable={!isFixedOption("toolbar_hide")} />
						<SwitchField label='shortcutsHint' checked={state.shortcutsHint} onChange={set("shortcutsHint")} resettable={!isFixedOption("shortcutsHint")} />
						<SwitchField label='shortcutsDisable' checked={state.shortcutsDisable} onChange={set("shortcutsDisable")} resettable={!isFixedOption("shortcutsDisable")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Statusbar & Counter */}
			<AccordionItem value='statusbar'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>{t("sections.statusbarCounter")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
						<SwitchField label='statusbar' checked={state.statusbar} onChange={set("statusbar")} resettable={!isFixedOption("statusbar")} />
						<SwitchField label='statusbar_showPathLabel' checked={state.statusbar_showPathLabel} onChange={set("statusbar_showPathLabel")} resettable={!isFixedOption("statusbar_showPathLabel")} />
						<SwitchField
							label='statusbar_resizeEnable'
							checked={state.statusbar_resizeEnable}
							onChange={set("statusbar_resizeEnable")}
							resettable={!isFixedOption("statusbar_resizeEnable")}
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField label='charCounter' checked={state.charCounter} onChange={set("charCounter")} resettable={!isFixedOption("charCounter")} />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<NumberInput label='charCounter_max' value={state.charCounter_max} onChange={set("charCounter_max")} placeholder='no limit' resettable={!isFixedOption("charCounter_max")} />
						<TextInput label='charCounter_label' value={state.charCounter_label} onChange={set("charCounter_label")} placeholder='e.g. Chars:' resettable={!isFixedOption("charCounter_label")} />
					</div>
					<div className='mt-3'>
						<SelectField
							label='charCounter_type'
							value={state.charCounter_type}
							options={[
								{ value: "char", label: t("options.char") },
								{ value: "byte", label: t("options.byte") },
								{ value: "byte-html", label: t("options.byteHtml") },
							]}
							onChange={(v) => set("charCounter_type")(v as PlaygroundState["charCounter_type"])}
							resettable={!isFixedOption("charCounter_type")}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Content & Behavior */}
			<AccordionItem value='content'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-teal-700 dark:text-teal-400'>{t("sections.contentBehavior")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div>
						<TextInput label='placeholder' value={state.placeholder} onChange={set("placeholder")} resettable={!isFixedOption("placeholder")} />
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField label='iframe' checked={state.iframe} onChange={set("iframe")} resettable={!isFixedOption("iframe")} />
						{state.iframe && <SwitchField label='iframe_fullPage' checked={state.iframe_fullPage} onChange={set("iframe_fullPage")} resettable={!isFixedOption("iframe_fullPage")} />}
					</div>
					{state.iframe && (
						<div className='mt-3 grid grid-cols-2 gap-3'>
							<TextInput label='iframe_cssFileName' value={state.iframe_cssFileName} onChange={set("iframe_cssFileName")} placeholder='suneditor' resettable={!isFixedOption("iframe_cssFileName")} />
							<TextInput label='iframe_attributes' value={state.iframe_attributes} onChange={set("iframe_attributes")} placeholder='{"key":"value"}' resettable={!isFixedOption("iframe_attributes")} />
						</div>
					)}
					<div className='mt-3'>
						<TextInput label='editableFrameAttributes' value={state.editableFrameAttributes} onChange={set("editableFrameAttributes")} placeholder='{"spellcheck":"false"}' resettable={!isFixedOption("editableFrameAttributes")} />
					</div>
					<div className='mt-3'>
						<TextInput label='defaultLine' value={state.defaultLine} onChange={set("defaultLine")} resettable={!isFixedOption("defaultLine")} placeholder='p' />
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<SelectField
							label='defaultLineBreakFormat'
							value={state.defaultLineBreakFormat}
							options={[
								{ value: "line", label: t("options.line") },
								{ value: "br", label: t("options.br") },
							]}
							onChange={(v) => set("defaultLineBreakFormat")(v as PlaygroundState["defaultLineBreakFormat"])}
							resettable={!isFixedOption("defaultLineBreakFormat")}
						/>
						<SelectField
							label='retainStyleMode'
							value={state.retainStyleMode}
							options={[
								{ value: "repeat", label: t("options.repeat") },
								{ value: "always", label: t("options.always") },
								{ value: "none", label: t("options.none") },
							]}
							onChange={(v) => set("retainStyleMode")(v as PlaygroundState["retainStyleMode"])}
							resettable={!isFixedOption("retainStyleMode")}
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField label='freeCodeViewMode' checked={state.freeCodeViewMode} onChange={set("freeCodeViewMode")} resettable={!isFixedOption("freeCodeViewMode")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Features */}
			<AccordionItem value='features'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-teal-700 dark:text-teal-400'>{t("sections.features")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
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
					<div className='mt-3'>
						<SelectField
							label='componentInsertBehavior'
							value={state.componentInsertBehavior}
							options={[
								{ value: "auto", label: t("options.auto") },
								{ value: "select", label: t("options.select") },
								{ value: "line", label: t("options.line") },
								{ value: "none", label: t("options.none") },
							]}
							onChange={(v) => set("componentInsertBehavior")(v as PlaygroundState["componentInsertBehavior"])}
							resettable={!isFixedOption("componentInsertBehavior")}
						/>
					</div>
					<div className='mt-3'>
						<NumberInput label='historyStackDelayTime' value={state.historyStackDelayTime} onChange={(v) => set("historyStackDelayTime")(v ?? 400)} placeholder='400' resettable={!isFixedOption("historyStackDelayTime")} />
					</div>
					<div className='mt-3'>
						<NumberInput label='fullScreenOffset' value={state.fullScreenOffset} onChange={(v) => set("fullScreenOffset")(v ?? 0)} placeholder='0' resettable={!isFixedOption("fullScreenOffset")} />
					</div>
					<div className='mt-3'>
						<TextInput label='defaultUrlProtocol' value={state.defaultUrlProtocol} onChange={set("defaultUrlProtocol")} placeholder='e.g. https://' resettable={!isFixedOption("defaultUrlProtocol")} />
					</div>
					<div className='mt-3'>
						<TextInput label='autoStyleify' value={state.autoStyleify} onChange={set("autoStyleify")} placeholder='bold,underline,italic,strike' resettable={!isFixedOption("autoStyleify")} />
					</div>
					<div className='mt-3'>
						<NumberInput label='toastMessageTime' value={state.toastMessageTime} onChange={(v) => set("toastMessageTime")(v ?? 1500)} placeholder='1500' resettable={!isFixedOption("toastMessageTime")} />
					</div>
					<div className='mt-3 grid gap-3'>
						<TextareaField label='previewTemplate' value={state.previewTemplate} onChange={set("previewTemplate")} placeholder='Custom preview HTML template' resettable={!isFixedOption("previewTemplate")} />
						<TextareaField label='printTemplate' value={state.printTemplate} onChange={set("printTemplate")} placeholder='Custom print HTML template' resettable={!isFixedOption("printTemplate")} />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Filtering (Advanced) */}
			<AccordionItem value='filtering'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-muted-foreground/60'>{t("sections.filtering")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
						<SwitchField label='strictMode' checked={state.strictMode} onChange={set("strictMode")} resettable={!isFixedOption("strictMode")} />
					</div>
					{!state.strictMode && (
						<div className='mt-2 ml-2 grid gap-1.5 border-l-2 border-muted pl-3'>
							<SwitchField label='tagFilter' checked={state.strictMode_tagFilter} onChange={set("strictMode_tagFilter")} resettable={!isFixedOption("strictMode_tagFilter")} description={t("filtering.tagFilter")} />
							<SwitchField label='formatFilter' checked={state.strictMode_formatFilter} onChange={set("strictMode_formatFilter")} resettable={!isFixedOption("strictMode_formatFilter")} description={t("filtering.formatFilter")} />
							<SwitchField label='classFilter' checked={state.strictMode_classFilter} onChange={set("strictMode_classFilter")} resettable={!isFixedOption("strictMode_classFilter")} description={t("filtering.classFilter")} />
							<SwitchField label='textStyleTagFilter' checked={state.strictMode_textStyleTagFilter} onChange={set("strictMode_textStyleTagFilter")} resettable={!isFixedOption("strictMode_textStyleTagFilter")} description={t("filtering.textStyleTagFilter")} />
							<SwitchField label='attrFilter' checked={state.strictMode_attrFilter} onChange={set("strictMode_attrFilter")} resettable={!isFixedOption("strictMode_attrFilter")} description={t("filtering.attrFilter")} />
							<SwitchField label='styleFilter' checked={state.strictMode_styleFilter} onChange={set("strictMode_styleFilter")} resettable={!isFixedOption("strictMode_styleFilter")} description={t("filtering.styleFilter")} />
						</div>
					)}
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<TextInput label='fontSizeUnits' value={state.fontSizeUnits} onChange={set("fontSizeUnits")} resettable={!isFixedOption("fontSizeUnits")} placeholder='px,pt,em,rem' />
						<TextInput label='lineAttrReset' value={state.lineAttrReset} onChange={set("lineAttrReset")} placeholder='e.g. id' resettable={!isFixedOption("lineAttrReset")} />
					</div>
					<div className='mt-3'>
						<TextInput label='printClass' value={state.printClass} onChange={set("printClass")} placeholder='e.g. my-print' resettable={!isFixedOption("printClass")} />
					</div>
					<div className='mt-3'>
						<TextInput label='allowedClassName' value={state.allowedClassName} onChange={set("allowedClassName")} resettable={!isFixedOption("allowedClassName")} placeholder='e.g. ^my-class' />
					</div>
					<div className='mt-3'>
						<TextInput label='allowedEmptyTags' value={state.allowedEmptyTags} onChange={set("allowedEmptyTags")} placeholder='e.g. div,span' resettable={!isFixedOption("allowedEmptyTags")} />
					</div>
					<div className='mt-3'>
						<TextInput label='allUsedStyles' value={state.allUsedStyles} onChange={set("allUsedStyles")} resettable={!isFixedOption("allUsedStyles")} placeholder='auto-computed from styles' />
					</div>
					<div className='mt-3'>
						<TextInput label='scopeSelectionTags' value={state.scopeSelectionTags} onChange={set("scopeSelectionTags")} placeholder='e.g. td,table' resettable={!isFixedOption("scopeSelectionTags")} />
					</div>
					<div className='mt-3'>
						<TextInput label='textStyleTags' value={state.textStyleTags} onChange={set("textStyleTags")} resettable={!isFixedOption("textStyleTags")} placeholder='e.g. mark|cite' />
					</div>
					<div className='mt-3'>
						<TextInput label='spanStyles' value={state.spanStyles} onChange={set("spanStyles")} resettable={!isFixedOption("spanStyles")} />
					</div>
					<div className='mt-3'>
						<TextInput label='lineStyles' value={state.lineStyles} onChange={set("lineStyles")} resettable={!isFixedOption("lineStyles")} />
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
				<AccordionTrigger className='text-sm font-semibold px-3 text-muted-foreground/60'>{t("sections.formatExtensions")}</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<p className='mb-3 text-[11px] leading-relaxed text-muted-foreground'>
						{t("formatExtDesc")}
					</p>
					<div className='grid gap-3'>
						<TextInput label='formatLine' value={state.formatLine} onChange={set("formatLine")} resettable={!isFixedOption("formatLine")} placeholder='e.g. SECTION|ARTICLE' />
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} P|H[1-6]|LI|TH|TD|DETAILS</p>
						<TextInput label='formatBrLine' value={state.formatBrLine} onChange={set("formatBrLine")} resettable={!isFixedOption("formatBrLine")} placeholder='e.g. CODE' />
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} PRE</p>
						<TextInput label='formatClosureBrLine' value={state.formatClosureBrLine} onChange={set("formatClosureBrLine")} resettable={!isFixedOption("formatClosureBrLine")} placeholder='e.g. PRE' />
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} (none)</p>
						<TextInput label='formatBlock' value={state.formatBlock} onChange={set("formatBlock")} resettable={!isFixedOption("formatBlock")} placeholder='e.g. FIGURE|NAV' />
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} BLOCKQUOTE|OL|UL|FIGCAPTION|TABLE|THEAD|TBODY|TR|CAPTION|DETAILS</p>
						<TextInput label='formatClosureBlock' value={state.formatClosureBlock} onChange={set("formatClosureBlock")} resettable={!isFixedOption("formatClosureBlock")} placeholder='e.g. DETAILS' />
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} TH|TD</p>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
