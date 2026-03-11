"use client";

import { type Dispatch, useState, useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction, isFixedOption } from "../_lib/playgroundState";
import { OptionInfo } from "./OptionInfo";
import optDescEn from "@/data/api/option-descriptions.en.json";
import optDescKo from "@/data/api/option-descriptions.ko.json";
import optDescAr from "@/data/api/option-descriptions.ar.json";

type OptDesc = Record<string, { description: string; default?: string }>;
const optDescMap: Record<string, OptDesc> = {
	en: optDescEn as OptDesc,
	ko: optDescKo as OptDesc,
	ar: optDescAr as OptDesc,
};

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

function FieldLabel({ label, resettable, description }: { label: string; resettable?: boolean; description?: string }) {
	const locale = useLocale();
	const optDesc = optDescMap[locale] ?? optDescMap.en;
	const entry = optDesc[label];
	const desc = description ?? entry?.description;
	return (
		<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
			<span>{label}</span>
			{resettable && (
				<span className='shrink-0 rounded bg-green-500/15 px-1 py-0.5 text-[10px] font-medium text-green-600 dark:text-green-400'>
					live
				</span>
			)}
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
	useEffect(() => {
		if (!focusedRef.current) setLocal(value);
	}, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
			<input
				type='text'
				value={local}
				onChange={(e) => setLocal(e.target.value)}
				onFocus={() => {
					focusedRef.current = true;
				}}
				onBlur={() => {
					focusedRef.current = false;
					if (local !== value) onChange(local);
				}}
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
	useEffect(() => {
		if (!focusedRef.current) setLocal(value ?? "");
	}, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} />
			<input
				type='number'
				value={local}
				onChange={(e) => setLocal(e.target.value === "" ? "" : Number(e.target.value))}
				onFocus={() => {
					focusedRef.current = true;
				}}
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
				<span
					className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
				/>
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
	description,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	resettable?: boolean;
	description?: string;
}) {
	const [local, setLocal] = useState(value);
	const focusedRef = useRef(false);
	useEffect(() => {
		if (!focusedRef.current) setLocal(value);
	}, [value]);
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} resettable={resettable} description={description} />
			<textarea
				value={local}
				onChange={(e) => setLocal(e.target.value)}
				onFocus={() => {
					focusedRef.current = true;
				}}
				onBlur={() => {
					focusedRef.current = false;
					if (local !== value) onChange(local);
				}}
				placeholder={placeholder}
				rows={2}
				className='rounded-md border border-input bg-background px-2 py-1.5 text-xs font-mono outline-none focus:ring-2 focus:ring-ring resize-y'
			/>
		</label>
	);
}

/** Disabled option indicator — shown for options that can't be configured in playground */
function DisabledField({ label, reason }: { label: string; reason?: string }) {
	const locale = useLocale();
	const optDesc = optDescMap[locale] ?? optDescMap.en;
	const desc = optDesc[label]?.description;
	return (
		<div className='flex items-center justify-between gap-2 py-0.5 opacity-40'>
			<span className='flex items-center gap-1.5 text-[11px] text-muted-foreground'>
				<span>{label}</span>
				{desc && <OptionInfo optionKey={label} description={desc} />}
			</span>
			<span className='text-[10px] text-muted-foreground/70 italic shrink-0'>{reason ?? "complex type"}</span>
		</div>
	);
}

/* ── Lang options from shared language list ────────────── */
/**
 * icon can be any ReactNode: string emoji, SVG component, <img>, etc.
 * Languages are managed in @/i18n/languages.ts (single source of truth).
 */

import { languages } from "@/i18n/languages";

const LANG_OPTIONS: { value: string; label: string }[] = languages
	.filter((l) => l.editorLang)
	.map((l) => ({
		value: l.code === "en" ? "" : l.code,
		label: `${l.icon ?? ""} ${l.code} [${l.nativeName}]${l.code === "en" ? " (default)" : ""}`.trim(),
	}));

function LangSelectField({
	value,
	onChange,
	resettable,
}: {
	value: string;
	onChange: (v: string) => void;
	resettable?: boolean;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label='lang' resettable={resettable} />
			<select
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className='rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring'
			>
				{LANG_OPTIONS.map((opt) => (
					<option key={opt.value} value={opt.value}>
						{opt.label}
					</option>
				))}
			</select>
		</label>
	);
}

/** Tri-state select for per-root boolean overrides: inherit (empty) / true / false */
function TriStateField({
	label,
	value,
	onChange,
	resettable,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	resettable?: boolean;
}) {
	return (
		<SelectField
			label={label}
			value={value}
			options={[
				{ value: "", label: "(inherit)" },
				{ value: "true", label: "true" },
				{ value: "false", label: "false" },
			]}
			onChange={onChange}
			resettable={resettable}
		/>
	);
}

/** Toggle-based type selector: document + sub-types (page, header) */
function TypeToggleField({
	value,
	onChange,
	resettable,
}: {
	value: string;
	onChange: (v: string) => void;
	resettable?: boolean;
}) {
	// parse current value
	const lower = value.toLowerCase();
	const isDocument = lower.startsWith("document");
	const subTypes = lower.includes(":")
		? lower
				.split(":")[1]
				.split(",")
				.map((s) => s.trim())
		: [];
	const hasPage = subTypes.includes("page");
	const hasHeader = subTypes.includes("header");

	const buildValue = (doc: boolean, page: boolean, header: boolean) => {
		if (!doc) return "";
		const subs: string[] = [];
		if (page) subs.push("page");
		if (header) subs.push("header");
		return subs.length ? `document:${subs.join(",")}` : "document";
	};

	const pill = (label: string, active: boolean, onClick: () => void) => (
		<button
			type='button'
			onClick={onClick}
			className={`h-6 rounded px-2 text-[11px] font-medium transition-colors ${
				active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
			}`}
		>
			{label}
		</button>
	);

	return (
		<div className='flex flex-col gap-1.5'>
			<FieldLabel label='type' resettable={resettable} />
			<div className='flex items-center gap-1.5'>
				{pill("document", isDocument, () => onChange(buildValue(!isDocument, false, false)))}
				{isDocument && (
					<>
						<ChevronRight className='size-3 text-muted-foreground shrink-0' />
						{pill("page", hasPage, () => onChange(buildValue(true, !hasPage, hasHeader)))}
						{pill("header", hasHeader, () => onChange(buildValue(true, hasPage, !hasHeader)))}
					</>
				)}
			</div>
			{value && (
				<input
					type='text'
					readOnly
					value={value}
					className='h-7 mt-2 rounded-md border border-input bg-muted/50 px-2 text-xs text-muted-foreground outline-none cursor-default'
				/>
			)}
		</div>
	);
}

/** Reusable block of all per-root frame option controls */
function PerRootFields({
	prefix,
	state,
	set,
	t,
}: {
	prefix: "root_header" | "root_body";
	state: PlaygroundState;
	set: <K extends keyof PlaygroundState>(key: K) => (value: PlaygroundState[K]) => void;
	t: (key: string) => string;
}) {
	const s = (key: string) => state[`${prefix}_${key}` as keyof PlaygroundState] as string;
	const setK = (key: string) => set(`${prefix}_${key}` as keyof PlaygroundState) as (v: string) => void;
	const isFixed = (key: string) => !isFixedOption(`${prefix}_${key}`);

	return (
		<>
			<div className='mb-3 rounded bg-muted/50 dark:bg-muted/30 px-2.5 py-1.5 flex items-baseline gap-1.5'>
				<code className='text-[11px] font-bold text-orange-600 dark:text-orange-400'>(inherit)</code>
				<span className='text-[11px] text-orange-600/90 dark:text-orange-400/90'>
					{t("sections.inheritDesc")}
				</span>
			</div>
			{/* Layout */}
			<div className='grid grid-cols-2 gap-3'>
				<TextInput
					label='height'
					value={s("height")}
					onChange={setK("height")}
					placeholder={prefix === "root_header" ? "150px" : "400px"}
					resettable={isFixed("height")}
				/>
				<TextInput
					label='width'
					value={s("width")}
					onChange={setK("width")}
					placeholder='(inherit)'
					resettable={isFixed("width")}
				/>
				<TextInput
					label='minHeight'
					value={s("minHeight")}
					onChange={setK("minHeight")}
					placeholder='(inherit)'
					resettable={isFixed("minHeight")}
				/>
				<TextInput
					label='maxHeight'
					value={s("maxHeight")}
					onChange={setK("maxHeight")}
					placeholder='(inherit)'
					resettable={isFixed("maxHeight")}
				/>
				<TextInput
					label='minWidth'
					value={s("minWidth")}
					onChange={setK("minWidth")}
					placeholder='(inherit)'
					resettable={isFixed("minWidth")}
				/>
				<TextInput
					label='maxWidth'
					value={s("maxWidth")}
					onChange={setK("maxWidth")}
					placeholder='(inherit)'
					resettable={isFixed("maxWidth")}
				/>
			</div>
			{/* Content */}
			<div className='mt-3'>
				<TextInput
					label='placeholder'
					value={s("placeholder")}
					onChange={setK("placeholder")}
					placeholder='(inherit)'
					resettable={isFixed("placeholder")}
				/>
			</div>
			{/* Statusbar */}
			<div className='mt-3 grid gap-2'>
				<TriStateField
					label='statusbar'
					value={s("statusbar")}
					onChange={setK("statusbar")}
					resettable={isFixed("statusbar")}
				/>
				<TriStateField
					label='statusbar_showPathLabel'
					value={s("statusbar_showPathLabel")}
					onChange={setK("statusbar_showPathLabel")}
					resettable={isFixed("statusbar_showPathLabel")}
				/>
				<TriStateField
					label='statusbar_resizeEnable'
					value={s("statusbar_resizeEnable")}
					onChange={setK("statusbar_resizeEnable")}
					resettable={isFixed("statusbar_resizeEnable")}
				/>
			</div>
			{/* Char Counter */}
			<div className='mt-3 grid gap-2'>
				<TriStateField
					label='charCounter'
					value={s("charCounter")}
					onChange={setK("charCounter")}
					resettable={isFixed("charCounter")}
				/>
				<div className='grid grid-cols-2 gap-3'>
					<TextInput
						label='charCounter_max'
						value={s("charCounter_max")}
						onChange={setK("charCounter_max")}
						placeholder='(inherit)'
						resettable={isFixed("charCounter_max")}
					/>
					<TextInput
						label='charCounter_label'
						value={s("charCounter_label")}
						onChange={setK("charCounter_label")}
						placeholder='(inherit)'
						resettable={isFixed("charCounter_label")}
					/>
				</div>
				<SelectField
					label='charCounter_type'
					value={s("charCounter_type")}
					options={[
						{ value: "", label: "(inherit)" },
						{ value: "char", label: "char" },
						{ value: "byte", label: "byte" },
						{ value: "byte-html", label: "byte-html" },
					]}
					onChange={setK("charCounter_type")}
					resettable={isFixed("charCounter_type")}
				/>
			</div>
			{/* Advanced (collapsible, gray section) */}
			<details className='mt-4 pt-3 border-t border-dashed border-muted-foreground/20'>
				<summary className='cursor-pointer text-[10px] font-medium text-muted-foreground/50 uppercase tracking-wider mb-2 select-none'>
					Advanced
				</summary>
				<div className='grid gap-3 opacity-70 mt-2'>
					<TextInput
						label='editorStyle'
						value={s("editorStyle")}
						onChange={setK("editorStyle")}
						placeholder='(inherit)'
						resettable={isFixed("editorStyle")}
					/>
					<TextInput
						label='value'
						value={s("value")}
						onChange={setK("value")}
						placeholder='initial HTML'
						resettable={isFixed("value")}
					/>
					<TextInput
						label='editableFrameAttributes'
						value={s("editableFrameAttributes")}
						onChange={setK("editableFrameAttributes")}
						placeholder='(inherit)'
						resettable={isFixed("editableFrameAttributes")}
					/>
					<TriStateField
						label='iframe'
						value={s("iframe")}
						onChange={setK("iframe")}
						resettable={isFixed("iframe")}
					/>
					{s("iframe") === "true" && (
						<>
							<TriStateField
								label='iframe_fullPage'
								value={s("iframe_fullPage")}
								onChange={setK("iframe_fullPage")}
								resettable={isFixed("iframe_fullPage")}
							/>
							<TextInput
								label='iframe_attributes'
								value={s("iframe_attributes")}
								onChange={setK("iframe_attributes")}
								placeholder='(inherit)'
								resettable={isFixed("iframe_attributes")}
							/>
							<TextInput
								label='iframe_cssFileName'
								value={s("iframe_cssFileName")}
								onChange={setK("iframe_cssFileName")}
								placeholder='(inherit)'
								resettable={isFixed("iframe_cssFileName")}
							/>
						</>
					)}
				</div>
			</details>
		</>
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
				<AccordionTrigger className='text-sm font-semibold px-3 text-amber-700 dark:text-amber-400'>
					{t("sections.modeTheme")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<SelectField
							label='mode'
							value={state.mode}
							options={[
								{ value: "classic", label: "classic" },
								{ value: "inline", label: "inline" },
								{ value: "balloon", label: "balloon" },
								{ value: "balloon-always", label: "balloon-always" },
							]}
							onChange={(v) => set("mode")(v as PlaygroundState["mode"])}
							resettable={!isFixedOption("mode")}
						/>
						<SelectField
							label='buttonList'
							value={state.buttonListPreset}
							options={[
								{ value: "basic", label: "basic" },
								{ value: "standard", label: "standard" },
								{ value: "full", label: "full" },
								{ value: "custom", label: "custom" },
							]}
							onChange={(v) => set("buttonListPreset")(v as PlaygroundState["buttonListPreset"])}
							resettable={!isFixedOption("buttonListPreset")}
						/>
						<SelectField
							label='theme'
							value={state.theme}
							options={[
								{ value: "", label: "auto (sync)" },
								{ value: "default", label: "(default)" },
								{ value: "dark", label: "dark" },
								{ value: "midnight", label: "midnight" },
								{ value: "cobalt", label: "cobalt" },
								{ value: "cream", label: "cream" },
							]}
							onChange={set("theme")}
							resettable={!isFixedOption("theme")}
						/>
						<SelectField
							label='textDirection'
							value={state.textDirection}
							options={[
								{ value: "ltr", label: "ltr" },
								{ value: "rtl", label: "rtl" },
							]}
							onChange={(v) => set("textDirection")(v as PlaygroundState["textDirection"])}
							resettable={!isFixedOption("textDirection")}
						/>
					</div>
					<div className='mt-3'>
						<TypeToggleField
							value={state.type}
							onChange={set("type")}
							resettable={!isFixedOption("type")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='reverseButtons'
							value={state.reverseButtons}
							onChange={set("reverseButtons")}
							resettable={!isFixedOption("reverseButtons")}
							placeholder='indent-outdent'
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField
							label='v2Migration'
							checked={state.v2Migration}
							onChange={set("v2Migration")}
							resettable={!isFixedOption("v2Migration")}
						/>
					</div>
					<div className='mt-3 pt-3 border-t border-dashed border-muted-foreground/20'>
						<LangSelectField
							value={state.lang}
							onChange={set("lang")}
							resettable={!isFixedOption("lang")}
						/>
					</div>
					<div className='mt-3 pt-3 border-t border-dashed border-muted-foreground/20'>
						<TextareaField
							label='icons'
							value={state.icons}
							onChange={set("icons")}
							placeholder='{"bold": "<svg>...</svg>", "undo": "↩"}'
							resettable={!isFixedOption("icons")}
							description={t("iconsDesc")}
						/>
					</div>
					{/* Sub-Toolbar */}
					<div className='mt-4 pt-3 border-t'>
						<SwitchField
							label='subToolbar'
							checked={state.subToolbar_enabled}
							onChange={set("subToolbar_enabled")}
							resettable={!isFixedOption("subToolbar_enabled")}
						/>
					</div>
					{state.subToolbar_enabled && (
						<div className='mt-3 ms-2 border-s-2 border-muted ps-3 grid gap-3'>
							<SelectField
								label='subToolbar.buttonList'
								value={state.subToolbar_buttonListPreset}
								options={[
									{ value: "basic", label: "basic" },
									{ value: "standard", label: "standard" },
									{ value: "full", label: "full" },
								]}
								onChange={(v) =>
									set("subToolbar_buttonListPreset")(
										v as PlaygroundState["subToolbar_buttonListPreset"],
									)
								}
								resettable={!isFixedOption("subToolbar_buttonListPreset")}
							/>
							<SelectField
								label='subToolbar.mode'
								value={state.subToolbar_mode}
								options={[
									{ value: "balloon", label: "balloon" },
									{ value: "balloon-always", label: "balloon-always" },
								]}
								onChange={(v) => set("subToolbar_mode")(v as PlaygroundState["subToolbar_mode"])}
								resettable={!isFixedOption("subToolbar_mode")}
							/>
							<TextInput
								label='subToolbar.width'
								value={state.subToolbar_width}
								onChange={set("subToolbar_width")}
								placeholder='auto'
								resettable={!isFixedOption("subToolbar_width")}
							/>
						</div>
					)}
				</AccordionContent>
			</AccordionItem>

			{/* Layout & Sizing */}
			<AccordionItem value='layout'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>
					{t("sections.layoutSizing")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<TextInput
							label='width'
							value={state.width}
							onChange={set("width")}
							placeholder='100%'
							resettable={!isFixedOption("width")}
						/>
						<TextInput
							label='height'
							value={state.height}
							onChange={set("height")}
							placeholder='auto'
							resettable={!isFixedOption("height")}
						/>
						<TextInput
							label='minWidth'
							value={state.minWidth}
							onChange={set("minWidth")}
							placeholder='e.g. 300px'
							resettable={!isFixedOption("minWidth")}
						/>
						<TextInput
							label='maxWidth'
							value={state.maxWidth}
							onChange={set("maxWidth")}
							placeholder='e.g. 800px'
							resettable={!isFixedOption("maxWidth")}
						/>
						<TextInput
							label='minHeight'
							value={state.minHeight}
							onChange={set("minHeight")}
							placeholder='e.g. 200px'
							resettable={!isFixedOption("minHeight")}
						/>
						<TextInput
							label='maxHeight'
							value={state.maxHeight}
							onChange={set("maxHeight")}
							placeholder='e.g. 600px'
							resettable={!isFixedOption("maxHeight")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='editorStyle'
							value={state.editorStyle}
							onChange={set("editorStyle")}
							placeholder='CSS string'
							resettable={!isFixedOption("editorStyle")}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Toolbar */}
			<AccordionItem value='toolbar'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>
					{t("sections.toolbar")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid grid-cols-2 gap-3'>
						<TextInput
							label='toolbar_width'
							value={state.toolbar_width}
							onChange={set("toolbar_width")}
							placeholder='auto'
							resettable={!isFixedOption("toolbar_width")}
						/>
						<NumberInput
							label='toolbar_sticky'
							value={state.toolbar_sticky}
							onChange={(v) => set("toolbar_sticky")(v ?? 0)}
							placeholder='0'
							resettable={!isFixedOption("toolbar_sticky")}
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField
							label='toolbar_hide'
							checked={state.toolbar_hide}
							onChange={set("toolbar_hide")}
							resettable={!isFixedOption("toolbar_hide")}
						/>
						<SwitchField
							label='shortcutsHint'
							checked={state.shortcutsHint}
							onChange={set("shortcutsHint")}
							resettable={!isFixedOption("shortcutsHint")}
						/>
						<SwitchField
							label='shortcutsDisable'
							checked={state.shortcutsDisable}
							onChange={set("shortcutsDisable")}
							resettable={!isFixedOption("shortcutsDisable")}
						/>
					</div>
					<div className='mt-3 pt-3 border-t border-dashed border-muted-foreground/20'>
						<DisabledField label='toolbar_container' reason='HTMLElement' />
						<DisabledField label='shortcuts' reason='Object' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Statusbar & Counter */}
			<AccordionItem value='statusbar'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-sky-700 dark:text-sky-400'>
					{t("sections.statusbarCounter")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
						<SwitchField
							label='statusbar'
							checked={state.statusbar}
							onChange={set("statusbar")}
							resettable={!isFixedOption("statusbar")}
						/>
						<SwitchField
							label='statusbar_showPathLabel'
							checked={state.statusbar_showPathLabel}
							onChange={set("statusbar_showPathLabel")}
							resettable={!isFixedOption("statusbar_showPathLabel")}
						/>
						<SwitchField
							label='statusbar_resizeEnable'
							checked={state.statusbar_resizeEnable}
							onChange={set("statusbar_resizeEnable")}
							resettable={!isFixedOption("statusbar_resizeEnable")}
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField
							label='charCounter'
							checked={state.charCounter}
							onChange={set("charCounter")}
							resettable={!isFixedOption("charCounter")}
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<NumberInput
							label='charCounter_max'
							value={state.charCounter_max}
							onChange={set("charCounter_max")}
							placeholder='no limit'
							resettable={!isFixedOption("charCounter_max")}
						/>
						<TextInput
							label='charCounter_label'
							value={state.charCounter_label}
							onChange={set("charCounter_label")}
							placeholder='e.g. Chars:'
							resettable={!isFixedOption("charCounter_label")}
						/>
					</div>
					<div className='mt-3'>
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
					<div className='mt-3 pt-3 border-t border-dashed border-muted-foreground/20'>
						<DisabledField label='statusbar_container' reason='HTMLElement' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Content & Behavior */}
			<AccordionItem value='content'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-teal-700 dark:text-teal-400'>
					{t("sections.contentBehavior")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div>
						<TextInput
							label='placeholder'
							value={state.placeholder}
							onChange={set("placeholder")}
							resettable={!isFixedOption("placeholder")}
						/>
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField
							label='iframe'
							checked={state.iframe}
							onChange={set("iframe")}
							resettable={!isFixedOption("iframe")}
						/>
						{state.iframe && (
							<SwitchField
								label='iframe_fullPage'
								checked={state.iframe_fullPage}
								onChange={set("iframe_fullPage")}
								resettable={!isFixedOption("iframe_fullPage")}
							/>
						)}
					</div>
					{state.iframe && (
						<div className='mt-3 grid grid-cols-2 gap-3'>
							<TextInput
								label='iframe_cssFileName'
								value={state.iframe_cssFileName}
								onChange={set("iframe_cssFileName")}
								placeholder='suneditor'
								resettable={!isFixedOption("iframe_cssFileName")}
							/>
							<TextInput
								label='iframe_attributes'
								value={state.iframe_attributes}
								onChange={set("iframe_attributes")}
								placeholder='{"key":"value"}'
								resettable={!isFixedOption("iframe_attributes")}
							/>
						</div>
					)}
					<div className='mt-3'>
						<TextInput
							label='editableFrameAttributes'
							value={state.editableFrameAttributes}
							onChange={set("editableFrameAttributes")}
							placeholder='{"spellcheck":"false"}'
							resettable={!isFixedOption("editableFrameAttributes")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='defaultLine'
							value={state.defaultLine}
							onChange={set("defaultLine")}
							resettable={!isFixedOption("defaultLine")}
							placeholder='p'
						/>
					</div>
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<SelectField
							label='defaultLineBreakFormat'
							value={state.defaultLineBreakFormat}
							options={[
								{ value: "line", label: "line" },
								{ value: "br", label: "br" },
							]}
							onChange={(v) =>
								set("defaultLineBreakFormat")(v as PlaygroundState["defaultLineBreakFormat"])
							}
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
					</div>
					<div className='mt-3 grid gap-2'>
						<SwitchField
							label='freeCodeViewMode'
							checked={state.freeCodeViewMode}
							onChange={set("freeCodeViewMode")}
							resettable={!isFixedOption("freeCodeViewMode")}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Features */}
			<AccordionItem value='features'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-teal-700 dark:text-teal-400'>
					{t("sections.features")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
						<SwitchField
							label='autoLinkify'
							checked={state.autoLinkify}
							onChange={set("autoLinkify")}
							resettable={!isFixedOption("autoLinkify")}
						/>
						<SwitchField
							label='copyFormatKeepOn'
							checked={state.copyFormatKeepOn}
							onChange={set("copyFormatKeepOn")}
							resettable={!isFixedOption("copyFormatKeepOn")}
						/>
						<SwitchField
							label='tabDisable'
							checked={state.tabDisable}
							onChange={set("tabDisable")}
							resettable={!isFixedOption("tabDisable")}
						/>
						<SwitchField
							label='syncTabIndent'
							checked={state.syncTabIndent}
							onChange={set("syncTabIndent")}
							resettable={!isFixedOption("syncTabIndent")}
						/>
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
								{ value: "auto", label: "auto" },
								{ value: "select", label: "select" },
								{ value: "line", label: "line" },
								{ value: "none", label: "none" },
							]}
							onChange={(v) =>
								set("componentInsertBehavior")(v as PlaygroundState["componentInsertBehavior"])
							}
							resettable={!isFixedOption("componentInsertBehavior")}
						/>
					</div>
					<div className='mt-3'>
						<NumberInput
							label='historyStackDelayTime'
							value={state.historyStackDelayTime}
							onChange={(v) => set("historyStackDelayTime")(v ?? 400)}
							placeholder='400'
							resettable={!isFixedOption("historyStackDelayTime")}
						/>
					</div>
					<div className='mt-3'>
						<NumberInput
							label='fullScreenOffset'
							value={state.fullScreenOffset}
							onChange={(v) => set("fullScreenOffset")(v ?? 0)}
							placeholder='0'
							resettable={!isFixedOption("fullScreenOffset")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='defaultUrlProtocol'
							value={state.defaultUrlProtocol}
							onChange={set("defaultUrlProtocol")}
							placeholder='e.g. https://'
							resettable={!isFixedOption("defaultUrlProtocol")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='autoStyleify'
							value={state.autoStyleify}
							onChange={set("autoStyleify")}
							placeholder='bold,underline,italic,strike'
							resettable={!isFixedOption("autoStyleify")}
						/>
					</div>
					<div className='mt-3'>
						<NumberInput
							label='toastMessageTime'
							value={state.toastMessageTime}
							onChange={(v) => set("toastMessageTime")(v ?? 1500)}
							placeholder='1500'
							resettable={!isFixedOption("toastMessageTime")}
						/>
					</div>
					<div className='mt-3 grid gap-3'>
						<TextareaField
							label='previewTemplate'
							value={state.previewTemplate}
							onChange={set("previewTemplate")}
							placeholder='Custom preview HTML template'
							resettable={!isFixedOption("previewTemplate")}
						/>
						<TextareaField
							label='printTemplate'
							value={state.printTemplate}
							onChange={set("printTemplate")}
							placeholder='Custom print HTML template'
							resettable={!isFixedOption("printTemplate")}
						/>
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Filtering (Advanced) */}
			<AccordionItem value='filtering'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-muted-foreground/60'>
					{t("sections.filtering")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<div className='grid gap-2'>
						<SwitchField
							label='strictMode'
							checked={state.strictMode}
							onChange={set("strictMode")}
							resettable={!isFixedOption("strictMode")}
						/>
					</div>
					{!state.strictMode && (
						<div className='mt-2 ms-2 grid gap-1.5 border-s-2 border-muted ps-3'>
							<SwitchField
								label='tagFilter'
								checked={state.strictMode_tagFilter}
								onChange={set("strictMode_tagFilter")}
								resettable={!isFixedOption("strictMode_tagFilter")}
								description={t("filtering.tagFilter")}
							/>
							<SwitchField
								label='formatFilter'
								checked={state.strictMode_formatFilter}
								onChange={set("strictMode_formatFilter")}
								resettable={!isFixedOption("strictMode_formatFilter")}
								description={t("filtering.formatFilter")}
							/>
							<SwitchField
								label='classFilter'
								checked={state.strictMode_classFilter}
								onChange={set("strictMode_classFilter")}
								resettable={!isFixedOption("strictMode_classFilter")}
								description={t("filtering.classFilter")}
							/>
							<SwitchField
								label='textStyleTagFilter'
								checked={state.strictMode_textStyleTagFilter}
								onChange={set("strictMode_textStyleTagFilter")}
								resettable={!isFixedOption("strictMode_textStyleTagFilter")}
								description={t("filtering.textStyleTagFilter")}
							/>
							<SwitchField
								label='attrFilter'
								checked={state.strictMode_attrFilter}
								onChange={set("strictMode_attrFilter")}
								resettable={!isFixedOption("strictMode_attrFilter")}
								description={t("filtering.attrFilter")}
							/>
							<SwitchField
								label='styleFilter'
								checked={state.strictMode_styleFilter}
								onChange={set("strictMode_styleFilter")}
								resettable={!isFixedOption("strictMode_styleFilter")}
								description={t("filtering.styleFilter")}
							/>
						</div>
					)}
					<div className='mt-3 grid grid-cols-2 gap-3'>
						<TextInput
							label='fontSizeUnits'
							value={state.fontSizeUnits}
							onChange={set("fontSizeUnits")}
							resettable={!isFixedOption("fontSizeUnits")}
							placeholder='px,pt,em,rem'
						/>
						<TextInput
							label='lineAttrReset'
							value={state.lineAttrReset}
							onChange={set("lineAttrReset")}
							placeholder='e.g. id'
							resettable={!isFixedOption("lineAttrReset")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='printClass'
							value={state.printClass}
							onChange={set("printClass")}
							placeholder='e.g. my-print'
							resettable={!isFixedOption("printClass")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='allowedClassName'
							value={state.allowedClassName}
							onChange={set("allowedClassName")}
							resettable={!isFixedOption("allowedClassName")}
							placeholder='e.g. ^my-class'
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='allowedEmptyTags'
							value={state.allowedEmptyTags}
							onChange={set("allowedEmptyTags")}
							placeholder='e.g. div,span'
							resettable={!isFixedOption("allowedEmptyTags")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='allUsedStyles'
							value={state.allUsedStyles}
							onChange={set("allUsedStyles")}
							resettable={!isFixedOption("allUsedStyles")}
							placeholder='auto-computed from styles'
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='scopeSelectionTags'
							value={state.scopeSelectionTags}
							onChange={set("scopeSelectionTags")}
							placeholder='e.g. td,table'
							resettable={!isFixedOption("scopeSelectionTags")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='textStyleTags'
							value={state.textStyleTags}
							onChange={set("textStyleTags")}
							resettable={!isFixedOption("textStyleTags")}
							placeholder='e.g. mark|cite'
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='spanStyles'
							value={state.spanStyles}
							onChange={set("spanStyles")}
							resettable={!isFixedOption("spanStyles")}
						/>
					</div>
					<div className='mt-3'>
						<TextInput
							label='lineStyles'
							value={state.lineStyles}
							onChange={set("lineStyles")}
							resettable={!isFixedOption("lineStyles")}
						/>
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
						<TextareaField
							label='convertTextTags'
							value={state.convertTextTags}
							onChange={set("convertTextTags")}
							resettable={!isFixedOption("convertTextTags")}
							placeholder='{"bold":"b","italic":"em"}'
						/>
						<TextareaField
							label='tagStyles'
							value={state.tagStyles}
							onChange={set("tagStyles")}
							resettable={!isFixedOption("tagStyles")}
							placeholder='{"p":"font-size|color"}'
						/>
					</div>
					<div className='mt-3 pt-3 border-t border-dashed border-muted-foreground/20'>
						<DisabledField label='plugins' reason='Object' />
						<DisabledField label='excludedPlugins' reason='Array' />
						<DisabledField label='events' reason='handlers' />
						<div className='flex items-center justify-between gap-2 py-0.5'>
							<span className='flex items-center gap-1.5 text-[11px] text-green-600 dark:text-green-400'>
								<span>externalLibs</span>
								<span className='shrink-0 rounded bg-green-500/15 px-1 py-0.5 text-[10px] font-medium'>auto</span>
							</span>
							<span className='text-[10px] text-muted-foreground/70 italic shrink-0'>CodeMirror + KaTeX/MathJax</span>
						</div>
						<DisabledField label='allowedExtraTags' reason='Object' />
					</div>
				</AccordionContent>
			</AccordionItem>

			{/* Format Extensions (Advanced) */}
			<AccordionItem value='format-extensions'>
				<AccordionTrigger className='text-sm font-semibold px-3 text-muted-foreground/60'>
					{t("sections.formatExtensions")}
				</AccordionTrigger>
				<AccordionContent className='px-3 pb-3'>
					<p className='mb-3 text-[11px] leading-relaxed text-muted-foreground'>{t("formatExtDesc")}</p>
					<div className='grid gap-3'>
						<TextInput
							label='formatLine'
							value={state.formatLine}
							onChange={set("formatLine")}
							resettable={!isFixedOption("formatLine")}
							placeholder='e.g. SECTION|ARTICLE'
						/>
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} P|H[1-6]|LI|TH|TD|DETAILS</p>
						<TextInput
							label='formatBrLine'
							value={state.formatBrLine}
							onChange={set("formatBrLine")}
							resettable={!isFixedOption("formatBrLine")}
							placeholder='e.g. CODE'
						/>
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} PRE</p>
						<TextInput
							label='formatClosureBrLine'
							value={state.formatClosureBrLine}
							onChange={set("formatClosureBrLine")}
							resettable={!isFixedOption("formatClosureBrLine")}
							placeholder='e.g. PRE'
						/>
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} (none)</p>
						<TextInput
							label='formatBlock'
							value={state.formatBlock}
							onChange={set("formatBlock")}
							resettable={!isFixedOption("formatBlock")}
							placeholder='e.g. FIGURE|NAV'
						/>
						<p className='text-[10px] text-muted-foreground/70'>
							{t("builtIn")} BLOCKQUOTE|OL|UL|FIGCAPTION|TABLE|THEAD|TBODY|TR|CAPTION|DETAILS
						</p>
						<TextInput
							label='formatClosureBlock'
							value={state.formatClosureBlock}
							onChange={set("formatClosureBlock")}
							resettable={!isFixedOption("formatClosureBlock")}
							placeholder='e.g. DETAILS'
						/>
						<p className='text-[10px] text-muted-foreground/70'>{t("builtIn")} TH|TD</p>
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}

/* ── Per-Root Panel (rendered below editor, not in controls accordion) ── */

export function PlaygroundPerRootPanel({ state, dispatch }: Props) {
	const t = useTranslations("Playground");
	const set = useSet(dispatch);

	return (
		<div className='rounded-lg border bg-card/90 overflow-hidden'>
			<div className='px-4 py-2.5 border-b bg-muted/30'>
				<span className='text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider'>
					{t("sections.multirootRoots")}
				</span>
			</div>
			<div className='p-4 space-y-4'>
				{/* Header root */}
				<details className='group/h rounded-lg border border-violet-200 dark:border-violet-800/50 overflow-hidden'>
					<summary className='flex items-center gap-2 px-3 py-1.5 bg-violet-50 dark:bg-violet-900/20 border-b border-violet-200 dark:border-violet-800/50 cursor-pointer select-none'>
						<ChevronRight className='h-3.5 w-3.5 text-violet-400 transition-transform group-open/h:rotate-90' />
						<span className='inline-block w-2 h-2 rounded-full bg-violet-500' />
						<code className='text-xs font-semibold text-violet-700 dark:text-violet-300'>
							root: &quot;header&quot;
						</code>
					</summary>
					<div className='px-3 py-2.5'>
						<PerRootFields prefix='root_header' state={state} set={set} t={t} />
					</div>
				</details>
				{/* Body root */}
				<details className='group/b rounded-lg border border-emerald-200 dark:border-emerald-800/50 overflow-hidden'>
					<summary className='flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border-b border-emerald-200 dark:border-emerald-800/50 cursor-pointer select-none'>
						<ChevronRight className='h-3.5 w-3.5 text-emerald-400 transition-transform group-open/b:rotate-90' />
						<span className='inline-block w-2 h-2 rounded-full bg-emerald-500' />
						<code className='text-xs font-semibold text-emerald-700 dark:text-emerald-300'>
							root: &quot;body&quot;
						</code>
					</summary>
					<div className='px-3 py-2.5'>
						<PerRootFields prefix='root_body' state={state} set={set} t={t} />
					</div>
				</details>
			</div>
		</div>
	);
}
