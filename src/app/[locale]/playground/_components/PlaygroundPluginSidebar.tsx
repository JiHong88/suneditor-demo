"use client";

import { type Dispatch, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction, ITEM_PRESETS, GALLERY_DATA_PRESETS } from "../_lib/playgroundState";
import { OptionInfo } from "./OptionInfo";
import optDescEn from "@/data/api/option-descriptions.en.json";
import optDescKo from "@/data/api/option-descriptions.ko.json";
import optDescAr from "@/data/api/option-descriptions.ar.json";
import {
	API_UPLOAD_IMAGE,
	API_UPLOAD_VIDEO,
	API_UPLOAD_AUDIO,
	API_UPLOAD_FILE,
	API_MENTION,
	API_DOWNLOAD_PDF,
} from "@/data/snippets/apiEndpoints";

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

function FieldLabel({ label, optionKey }: { label: string; optionKey?: string }) {
	const locale = useLocale();
	const optDesc = optDescMap[locale] ?? optDescMap.en;
	const key = optionKey ?? label;
	const desc = optDesc[key]?.description;
	return (
		<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
			<span>{label}</span>
			{desc && <OptionInfo optionKey={key} description={desc} />}
		</span>
	);
}

function SelectField({
	label,
	value,
	options,
	onChange,
	optionKey,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
	optionKey?: string;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} optionKey={optionKey} />
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
	optionKey,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
	optionKey?: string;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} optionKey={optionKey} />
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
	optionKey,
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
	optionKey?: string;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} optionKey={optionKey} />
			<input
				type='number'
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className='h-8 rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring'
			/>
		</label>
	);
}

function SwitchField({
	label,
	checked,
	onChange,
	optionKey,
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
	optionKey?: string;
}) {
	return (
		<label className='flex items-center justify-between gap-2 py-0.5'>
			<FieldLabel label={label} optionKey={optionKey} />
			<button
				type='button'
				role='switch'
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
			>
				<span
					className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
				/>
			</button>
		</label>
	);
}

function AdvancedSection({ children, label }: { children: React.ReactNode; label: string }) {
	return (
		<details className='mt-2 border-t pt-2'>
			<summary className='cursor-pointer text-[11px] font-medium text-muted-foreground hover:text-foreground select-none'>
				{label}
			</summary>
			<div className='mt-2 space-y-3'>{children}</div>
		</details>
	);
}

/** TextInput/Textarea with a mini toggle that fills preset value when toggled on, clears when off */
function ToggleableTextInput({
	label,
	value,
	preset,
	onChange,
	placeholder,
	optionKey,
}: {
	label: string;
	value: string;
	preset: string;
	onChange: (v: string) => void;
	placeholder?: string;
	optionKey?: string;
}) {
	const isActive = !!value;
	return (
		<div className='space-y-1'>
			<span className='flex items-center justify-between gap-2 py-0.5'>
				<FieldLabel label={label} optionKey={optionKey} />
				<button
					type='button'
					role='switch'
					aria-checked={isActive}
					onClick={() => onChange(isActive ? "" : preset)}
					className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${isActive ? "bg-primary" : "bg-muted"}`}
				>
					<span
						className={`pointer-events-none block h-3 w-3 rounded-full bg-background shadow-sm transition-transform ${isActive ? "translate-x-3" : "translate-x-0"}`}
					/>
				</button>
			</span>
			<input
				type='text'
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				className='h-8 w-full rounded-md border border-input bg-background px-2 text-xs outline-none focus:ring-2 focus:ring-ring'
			/>
		</div>
	);
}

function ToggleableTextarea({
	label,
	value,
	preset,
	onChange,
	placeholder,
	rows = 3,
	optionKey,
}: {
	label: string;
	value: string;
	preset: string;
	onChange: (v: string) => void;
	placeholder?: string;
	rows?: number;
	optionKey?: string;
}) {
	const isActive = !!value;
	return (
		<div className='space-y-1'>
			<span className='flex items-center justify-between gap-2 py-0.5'>
				<FieldLabel label={label} optionKey={optionKey} />
				<button
					type='button'
					role='switch'
					aria-checked={isActive}
					onClick={() => onChange(isActive ? "" : preset)}
					className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${isActive ? "bg-primary" : "bg-muted"}`}
				>
					<span
						className={`pointer-events-none block h-3 w-3 rounded-full bg-background shadow-sm transition-transform ${isActive ? "translate-x-3" : "translate-x-0"}`}
					/>
				</button>
			</span>
			<textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				rows={rows}
				className='w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-ring resize-y min-h-[60px]'
			/>
		</div>
	);
}

/** Section header for plugins with no configurable options */
function NoOptionsNote() {
	return <p className='text-[11px] text-muted-foreground/50 italic'>No configurable options</p>;
}

/* ── Helper to dispatch ────────────────────────────────── */

function useSet(dispatch: Dispatch<PlaygroundAction>) {
	return <K extends keyof PlaygroundState>(key: K) =>
		(value: PlaygroundState[K]) =>
			dispatch({ type: "SET", key, value });
}

/* ── Insert behavior select options ────────────────────── */
const INSERT_BEHAVIOR_OPTS = [
	{ value: "auto", label: "auto" },
	{ value: "select", label: "select" },
	{ value: "line", label: "line" },
	{ value: "none", label: "none" },
];

/* ── Main component ────────────────────────────────────── */

export default function PlaygroundPluginSidebar({ state, dispatch }: Props) {
	const t = useTranslations("Playground");
	const set = useSet(dispatch);
	const advLabel = t("advanced");
	const [showAll, setShowAll] = useState(false);
	return (
		<div className='space-y-1'>
			<label className='flex items-center justify-end gap-2 px-1 pb-1'>
				<span className='text-[11px] text-muted-foreground select-none'>{t("showAllPlugins")}</span>
				<button
					type='button'
					role='switch'
					aria-checked={showAll}
					onClick={() => setShowAll(!showAll)}
					className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${showAll ? "bg-primary" : "bg-muted"}`}
				>
					<span
						className={`pointer-events-none block h-3 w-3 rounded-full bg-background shadow-sm transition-transform ${showAll ? "translate-x-3" : "translate-x-0"}`}
					/>
				</button>
			</label>
			<Accordion type='multiple' className='w-full'>
				{/* ── modal ─────────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-violet-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400 border border-violet-300/30 dark:border-violet-400/20 mb-1.5 mt-0.5 select-none'>
						modal
					</span>

					{/* Image */}
					<AccordionItem value='image'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Image</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField
									label='canResize'
									checked={state.image_canResize}
									onChange={set("image_canResize")}
									optionKey='image_canResize'
								/>
								<TextInput
									label='defaultWidth'
									value={state.image_defaultWidth}
									onChange={set("image_defaultWidth")}
									placeholder='auto'
									optionKey='image_defaultWidth'
								/>
								<TextInput
									label='defaultHeight'
									value={state.image_defaultHeight}
									onChange={set("image_defaultHeight")}
									placeholder='auto'
									optionKey='image_defaultHeight'
								/>
								<SwitchField
									label='createFileInput'
									checked={state.image_createFileInput}
									onChange={set("image_createFileInput")}
									optionKey='image_createFileInput'
								/>
								<SwitchField
									label='createUrlInput'
									checked={state.image_createUrlInput}
									onChange={set("image_createUrlInput")}
									optionKey='image_createUrlInput'
								/>
								<SwitchField
									label='useFormatType'
									checked={state.image_useFormatType}
									onChange={set("image_useFormatType")}
									optionKey='image_useFormatType'
								/>
								<SelectField
									label='defaultFormatType'
									value={state.image_defaultFormatType}
									options={[
										{ value: "block", label: "block" },
										{ value: "inline", label: "inline" },
									]}
									onChange={set("image_defaultFormatType")}
									optionKey='image_defaultFormatType'
								/>
								<SwitchField
									label='keepFormatType'
									checked={state.image_keepFormatType}
									onChange={set("image_keepFormatType")}
									optionKey='image_keepFormatType'
								/>
								<SwitchField
									label='linkEnableFileUpload'
									checked={state.image_linkEnableFileUpload}
									onChange={set("image_linkEnableFileUpload")}
									optionKey='image_linkEnableFileUpload'
								/>
								<SelectField
									label='insertBehavior'
									value={state.image_insertBehavior}
									options={INSERT_BEHAVIOR_OPTS}
									onChange={set("image_insertBehavior")}
									optionKey='image_insertBehavior'
								/>
								<AdvancedSection label={advLabel}>
									<ToggleableTextInput
										label='uploadUrl'
										value={state.image_uploadUrl}
										preset={API_UPLOAD_IMAGE}
										onChange={set("image_uploadUrl")}
										placeholder={API_UPLOAD_IMAGE}
										optionKey='image_uploadUrl'
									/>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.image_uploadHeaders}
										preset='{}'
										onChange={set("image_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='image_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit (bytes)'
										value={state.image_uploadSizeLimit}
										onChange={set("image_uploadSizeLimit")}
										optionKey='image_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.image_uploadSingleSizeLimit}
										onChange={set("image_uploadSingleSizeLimit")}
										optionKey='image_uploadSingleSizeLimit'
									/>
									<SwitchField
										label='allowMultiple'
										checked={state.image_allowMultiple}
										onChange={set("image_allowMultiple")}
										optionKey='image_allowMultiple'
									/>
									<TextInput
										label='acceptedFormats'
										value={state.image_acceptedFormats}
										onChange={set("image_acceptedFormats")}
										placeholder='image/*'
										optionKey='image_acceptedFormats'
									/>
									<SwitchField
										label='percentageOnlySize'
										checked={state.image_percentageOnlySize}
										onChange={set("image_percentageOnlySize")}
										optionKey='image_percentageOnlySize'
									/>
									<SwitchField
										label='showHeightInput'
										checked={state.image_showHeightInput}
										onChange={set("image_showHeightInput")}
										optionKey='image_showHeightInput'
									/>
									<ToggleableTextarea
										label='controls (JSON)'
										value={state.image_controls}
										preset={ITEM_PRESETS.image_controls}
										onChange={set("image_controls")}
										placeholder='[["align","caption","edit","copy","remove"]]'
										rows={2}
										optionKey='image_controls'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* Video */}
					<AccordionItem value='video'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Video</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField
									label='canResize'
									checked={state.video_canResize}
									onChange={set("video_canResize")}
									optionKey='video_canResize'
								/>
								<TextInput
									label='defaultWidth'
									value={state.video_defaultWidth}
									onChange={set("video_defaultWidth")}
									placeholder='100%'
									optionKey='video_defaultWidth'
								/>
								<TextInput
									label='defaultHeight'
									value={state.video_defaultHeight}
									onChange={set("video_defaultHeight")}
									placeholder='auto'
									optionKey='video_defaultHeight'
								/>
								<SwitchField
									label='createFileInput'
									checked={state.video_createFileInput}
									onChange={set("video_createFileInput")}
									optionKey='video_createFileInput'
								/>
								<SwitchField
									label='createUrlInput'
									checked={state.video_createUrlInput}
									onChange={set("video_createUrlInput")}
									optionKey='video_createUrlInput'
								/>
								<SelectField
									label='insertBehavior'
									value={state.video_insertBehavior}
									options={INSERT_BEHAVIOR_OPTS}
									onChange={set("video_insertBehavior")}
									optionKey='video_insertBehavior'
								/>
								<TextInput
									label='query_youtube'
									value={state.video_query_youtube}
									onChange={set("video_query_youtube")}
									placeholder='YouTube embed query'
									optionKey='video_query_youtube'
								/>
								<TextInput
									label='query_vimeo'
									value={state.video_query_vimeo}
									onChange={set("video_query_vimeo")}
									placeholder='Vimeo embed query'
									optionKey='video_query_vimeo'
								/>
								<AdvancedSection label={advLabel}>
									<ToggleableTextInput
										label='uploadUrl'
										value={state.video_uploadUrl}
										preset={API_UPLOAD_VIDEO}
										onChange={set("video_uploadUrl")}
										placeholder={API_UPLOAD_VIDEO}
										optionKey='video_uploadUrl'
									/>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.video_uploadHeaders}
										preset='{}'
										onChange={set("video_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='video_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit (bytes)'
										value={state.video_uploadSizeLimit}
										onChange={set("video_uploadSizeLimit")}
										optionKey='video_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.video_uploadSingleSizeLimit}
										onChange={set("video_uploadSingleSizeLimit")}
										optionKey='video_uploadSingleSizeLimit'
									/>
									<SwitchField
										label='allowMultiple'
										checked={state.video_allowMultiple}
										onChange={set("video_allowMultiple")}
										optionKey='video_allowMultiple'
									/>
									<TextInput
										label='acceptedFormats'
										value={state.video_acceptedFormats}
										onChange={set("video_acceptedFormats")}
										placeholder='video/*'
										optionKey='video_acceptedFormats'
									/>
									<SwitchField
										label='percentageOnlySize'
										checked={state.video_percentageOnlySize}
										onChange={set("video_percentageOnlySize")}
										optionKey='video_percentageOnlySize'
									/>
									<SwitchField
										label='showHeightInput'
										checked={state.video_showHeightInput}
										onChange={set("video_showHeightInput")}
										optionKey='video_showHeightInput'
									/>
									<SwitchField
										label='showRatioOption'
										checked={state.video_showRatioOption}
										onChange={set("video_showRatioOption")}
										optionKey='video_showRatioOption'
									/>
									<NumberInput
										label='defaultRatio'
										value={state.video_defaultRatio}
										onChange={set("video_defaultRatio")}
										optionKey='video_defaultRatio'
									/>
									<TextInput
										label='extensions'
										value={state.video_extensions}
										onChange={set("video_extensions")}
										placeholder='mp4,webm,...'
										optionKey='video_extensions'
									/>
									<TextInput
										label='videoTagAttributes'
										value={state.video_videoTagAttributes}
										onChange={set("video_videoTagAttributes")}
										placeholder='{"key":"value"}'
										optionKey='video_videoTagAttributes'
									/>
									<TextInput
										label='iframeTagAttributes'
										value={state.video_iframeTagAttributes}
										onChange={set("video_iframeTagAttributes")}
										placeholder='{"key":"value"}'
										optionKey='video_iframeTagAttributes'
									/>
									<ToggleableTextarea
										label='ratioOptions (JSON)'
										value={state.video_ratioOptions}
										preset={ITEM_PRESETS.video_ratioOptions}
										onChange={set("video_ratioOptions")}
										placeholder='[{"value":0.5625,"text":"16:9"}]'
										rows={2}
										optionKey='video_ratioOptions'
									/>
									<ToggleableTextarea
										label='controls (JSON)'
										value={state.video_controls}
										preset={ITEM_PRESETS.video_controls}
										onChange={set("video_controls")}
										placeholder='[["align","caption","edit","copy","remove"]]'
										rows={2}
										optionKey='video_controls'
									/>
									<ToggleableTextInput
										label='urlPatterns (RegExp[])'
										value={state.video_urlPatterns}
										preset={ITEM_PRESETS.video_urlPatterns}
										onChange={set("video_urlPatterns")}
										placeholder='/dailymotion\.com\/video\//'
										optionKey='video_urlPatterns'
									/>
									<ToggleableTextarea
										label='embedQuery (JSON)'
										value={state.video_embedQuery}
										preset={ITEM_PRESETS.video_embedQuery}
										onChange={set("video_embedQuery")}
										placeholder='{"service":{pattern,action,tag}}'
										rows={3}
										optionKey='video_embedQuery'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* Audio */}
					<AccordionItem value='audio'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Audio</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='defaultWidth'
									value={state.audio_defaultWidth}
									onChange={set("audio_defaultWidth")}
									placeholder='300px'
									optionKey='audio_defaultWidth'
								/>
								<TextInput
									label='defaultHeight'
									value={state.audio_defaultHeight}
									onChange={set("audio_defaultHeight")}
									placeholder='54px'
									optionKey='audio_defaultHeight'
								/>
								<SwitchField
									label='createFileInput'
									checked={state.audio_createFileInput}
									onChange={set("audio_createFileInput")}
									optionKey='audio_createFileInput'
								/>
								<SwitchField
									label='createUrlInput'
									checked={state.audio_createUrlInput}
									onChange={set("audio_createUrlInput")}
									optionKey='audio_createUrlInput'
								/>
								<SelectField
									label='insertBehavior'
									value={state.audio_insertBehavior}
									options={INSERT_BEHAVIOR_OPTS}
									onChange={set("audio_insertBehavior")}
									optionKey='audio_insertBehavior'
								/>
								<AdvancedSection label={advLabel}>
									<ToggleableTextInput
										label='uploadUrl'
										value={state.audio_uploadUrl}
										preset={API_UPLOAD_AUDIO}
										onChange={set("audio_uploadUrl")}
										placeholder={API_UPLOAD_AUDIO}
										optionKey='audio_uploadUrl'
									/>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.audio_uploadHeaders}
										preset='{}'
										onChange={set("audio_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='audio_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit (bytes)'
										value={state.audio_uploadSizeLimit}
										onChange={set("audio_uploadSizeLimit")}
										optionKey='audio_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.audio_uploadSingleSizeLimit}
										onChange={set("audio_uploadSingleSizeLimit")}
										optionKey='audio_uploadSingleSizeLimit'
									/>
									<SwitchField
										label='allowMultiple'
										checked={state.audio_allowMultiple}
										onChange={set("audio_allowMultiple")}
										optionKey='audio_allowMultiple'
									/>
									<TextInput
										label='acceptedFormats'
										value={state.audio_acceptedFormats}
										onChange={set("audio_acceptedFormats")}
										placeholder='audio/*'
										optionKey='audio_acceptedFormats'
									/>
									<TextInput
										label='audioTagAttributes'
										value={state.audio_audioTagAttributes}
										onChange={set("audio_audioTagAttributes")}
										placeholder='{"key":"value"}'
										optionKey='audio_audioTagAttributes'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* Embed */}
					<AccordionItem value='embed'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Embed</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField
									label='canResize'
									checked={state.embed_canResize}
									onChange={set("embed_canResize")}
									optionKey='embed_canResize'
								/>
								<TextInput
									label='defaultWidth'
									value={state.embed_defaultWidth}
									onChange={set("embed_defaultWidth")}
									placeholder='100%'
									optionKey='embed_defaultWidth'
								/>
								<TextInput
									label='defaultHeight'
									value={state.embed_defaultHeight}
									onChange={set("embed_defaultHeight")}
									placeholder='auto'
									optionKey='embed_defaultHeight'
								/>
								<SelectField
									label='insertBehavior'
									value={state.embed_insertBehavior}
									options={INSERT_BEHAVIOR_OPTS}
									onChange={set("embed_insertBehavior")}
									optionKey='embed_insertBehavior'
								/>
								<TextInput
									label='query_youtube'
									value={state.embed_query_youtube}
									onChange={set("embed_query_youtube")}
									placeholder='YouTube query'
									optionKey='embed_query_youtube'
								/>
								<TextInput
									label='query_vimeo'
									value={state.embed_query_vimeo}
									onChange={set("embed_query_vimeo")}
									placeholder='Vimeo query'
									optionKey='embed_query_vimeo'
								/>
								<AdvancedSection label={advLabel}>
									<SwitchField
										label='showHeightInput'
										checked={state.embed_showHeightInput}
										onChange={set("embed_showHeightInput")}
										optionKey='embed_showHeightInput'
									/>
									<SwitchField
										label='percentageOnlySize'
										checked={state.embed_percentageOnlySize}
										onChange={set("embed_percentageOnlySize")}
										optionKey='embed_percentageOnlySize'
									/>
									<ToggleableTextInput
										label='uploadUrl'
										value={state.embed_uploadUrl}
										preset={API_UPLOAD_FILE}
										onChange={set("embed_uploadUrl")}
										placeholder={API_UPLOAD_FILE}
										optionKey='embed_uploadUrl'
									/>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.embed_uploadHeaders}
										preset='{}'
										onChange={set("embed_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='embed_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit'
										value={state.embed_uploadSizeLimit}
										onChange={set("embed_uploadSizeLimit")}
										optionKey='embed_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.embed_uploadSingleSizeLimit}
										onChange={set("embed_uploadSingleSizeLimit")}
										optionKey='embed_uploadSingleSizeLimit'
									/>
									<TextInput
										label='iframeTagAttributes'
										value={state.embed_iframeTagAttributes}
										onChange={set("embed_iframeTagAttributes")}
										placeholder='{"key":"value"}'
										optionKey='embed_iframeTagAttributes'
									/>
									<ToggleableTextarea
										label='controls (JSON)'
										value={state.embed_controls}
										preset={ITEM_PRESETS.embed_controls}
										onChange={set("embed_controls")}
										placeholder='[["align","edit","copy","remove"]]'
										rows={2}
										optionKey='embed_controls'
									/>
									<ToggleableTextInput
										label='urlPatterns (RegExp[])'
										value={state.embed_urlPatterns}
										preset={ITEM_PRESETS.embed_urlPatterns}
										onChange={set("embed_urlPatterns")}
										placeholder='/reddit\.com\/r\//'
										optionKey='embed_urlPatterns'
									/>
									<ToggleableTextarea
										label='embedQuery (JSON)'
										value={state.embed_embedQuery}
										preset={ITEM_PRESETS.embed_embedQuery}
										onChange={set("embed_embedQuery")}
										placeholder='{"service":{pattern,action,tag}}'
										rows={3}
										optionKey='embed_embedQuery'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* Link */}
					<AccordionItem value='link'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Link</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField label='title' checked={state.link_title} onChange={set("link_title")} optionKey='link_title' />
								<SwitchField
									label='textToDisplay'
									checked={state.link_textToDisplay}
									onChange={set("link_textToDisplay")}
									optionKey='link_textToDisplay'
								/>
								<SwitchField
									label='openNewWindow'
									checked={state.link_openNewWindow}
									onChange={set("link_openNewWindow")}
									optionKey='link_openNewWindow'
								/>
								<SwitchField
									label='noAutoPrefix'
									checked={state.link_noAutoPrefix}
									onChange={set("link_noAutoPrefix")}
									optionKey='link_noAutoPrefix'
								/>
								<AdvancedSection label={advLabel}>
									<ToggleableTextInput
										label='uploadUrl'
										value={state.link_uploadUrl}
										preset={API_UPLOAD_FILE}
										onChange={set("link_uploadUrl")}
										placeholder={API_UPLOAD_FILE}
										optionKey='link_uploadUrl'
									/>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.link_uploadHeaders}
										preset='{}'
										onChange={set("link_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='link_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit'
										value={state.link_uploadSizeLimit}
										onChange={set("link_uploadSizeLimit")}
										optionKey='link_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.link_uploadSingleSizeLimit}
										onChange={set("link_uploadSingleSizeLimit")}
										optionKey='link_uploadSingleSizeLimit'
									/>
									<TextInput
										label='acceptedFormats'
										value={state.link_acceptedFormats}
										onChange={set("link_acceptedFormats")}
										optionKey='link_acceptedFormats'
									/>
									<ToggleableTextInput
										label='relList'
										value={state.link_relList}
										preset={ITEM_PRESETS.link_relList}
										onChange={set("link_relList")}
										placeholder='nofollow,noreferrer,noopener'
										optionKey='link_relList'
									/>
									<ToggleableTextarea
										label='defaultRel (JSON)'
										value={state.link_defaultRel}
										preset={ITEM_PRESETS.link_defaultRel}
										onChange={set("link_defaultRel")}
										placeholder='{"default":"nofollow"}'
										rows={2}
										optionKey='link_defaultRel'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>
					{/* Drawing */}
					<AccordionItem value='drawing'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Drawing</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SelectField
									label='outputFormat'
									value={state.drawing_outputFormat}
									options={[
										{ value: "dataurl", label: "dataurl" },
										{ value: "svg", label: "svg" },
									]}
									onChange={(v) => set("drawing_outputFormat")(v as PlaygroundState["drawing_outputFormat"])}
									optionKey='drawing_outputFormat'
								/>
								<NumberInput
									label='lineWidth'
									value={state.drawing_lineWidth}
									onChange={set("drawing_lineWidth")}
									optionKey='drawing_lineWidth'
								/>
								<SelectField
									label='lineCap'
									value={state.drawing_lineCap}
									options={[
										{ value: "round", label: "round" },
										{ value: "butt", label: "butt" },
										{ value: "square", label: "square" },
									]}
									onChange={(v) => set("drawing_lineCap")(v as PlaygroundState["drawing_lineCap"])}
									optionKey='drawing_lineCap'
								/>
								<SwitchField
									label='maintainRatio'
									checked={state.drawing_maintainRatio}
									onChange={set("drawing_maintainRatio")}
									optionKey='drawing_maintainRatio'
								/>
								<SwitchField
									label='useFormatType'
									checked={state.drawing_useFormatType}
									onChange={set("drawing_useFormatType")}
									optionKey='drawing_useFormatType'
								/>
								<SelectField
									label='defaultFormatType'
									value={state.drawing_defaultFormatType}
									options={[
										{ value: "block", label: "block" },
										{ value: "inline", label: "inline" },
									]}
									onChange={set("drawing_defaultFormatType")}
									optionKey='drawing_defaultFormatType'
								/>
								<SwitchField
									label='keepFormatType'
									checked={state.drawing_keepFormatType}
									onChange={set("drawing_keepFormatType")}
									optionKey='drawing_keepFormatType'
								/>
								<AdvancedSection label={advLabel}>
									<SwitchField
										label='canResize'
										checked={state.drawing_canResize}
										onChange={set("drawing_canResize")}
										optionKey='drawing_canResize'
									/>
									<TextInput
										label='lineColor'
										value={state.drawing_lineColor}
										onChange={set("drawing_lineColor")}
										placeholder='#000000'
										optionKey='drawing_lineColor'
									/>
									<SwitchField
										label='lineReconnect'
										checked={state.drawing_lineReconnect}
										onChange={set("drawing_lineReconnect")}
										optionKey='drawing_lineReconnect'
									/>
									<ToggleableTextarea
										label='formSize (JSON)'
										value={state.drawing_formSize}
										preset={ITEM_PRESETS.drawing_formSize}
										onChange={set("drawing_formSize")}
										placeholder='{"width":"750px","height":"50vh"}'
										rows={2}
										optionKey='drawing_formSize'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* CodeBlock */}
					<AccordionItem value='codeBlock'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Code Block</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='langs'
									value={state.codeBlock_langs}
									onChange={set("codeBlock_langs")}
									placeholder='javascript, python, html, css'
									optionKey='codeBlock_langs'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* Math */}
					<AccordionItem value='math'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Math</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SelectField
									label='mathLib'
									value={state.math_mathLib}
									options={[
										{ value: "katex", label: "KaTeX (recommended)" },
										{ value: "mathjax", label: "MathJax" },
									]}
									onChange={(v) => set("math_mathLib")(v as "katex" | "mathjax")}
									optionKey='math_mathLib'
								/>
								{state.math_mathLib === "mathjax" && (
									<p className='text-[10px] text-amber-600 dark:text-amber-400'>
										MathJax requires mathjax-full npm package. CDN preview uses KaTeX fallback.
									</p>
								)}
								<SwitchField
									label='canResize'
									checked={state.math_canResize}
									onChange={set("math_canResize")}
									optionKey='math_canResize'
								/>
								<SwitchField
									label='autoHeight'
									checked={state.math_autoHeight}
									onChange={set("math_autoHeight")}
									optionKey='math_autoHeight'
								/>
								<ToggleableTextarea
									label='fontSizeList (JSON)'
									value={state.math_fontSizeList}
									preset={ITEM_PRESETS.math_fontSizeList}
									onChange={set("math_fontSizeList")}
									placeholder='[{"text":"1","value":"1em"}]'
									rows={2}
									optionKey='math_fontSizeList'
								/>
								<ToggleableTextarea
									label='formSize (JSON)'
									value={state.math_formSize}
									preset={ITEM_PRESETS.math_formSize}
									onChange={set("math_formSize")}
									placeholder='{"width":"460px","height":"14em"}'
									rows={2}
									optionKey='math_formSize'
								/>
								<ToggleableTextarea
									label='onPaste (Function)'
									value={state.math_onPaste}
									preset={ITEM_PRESETS.math_onPaste}
									onChange={set("math_onPaste")}
									placeholder='function(e) { ... }'
									rows={3}
									optionKey='math_onPaste'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end modal group */}

				{/* ── dropdown ──────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-sky-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400 border border-sky-300/30 dark:border-sky-400/20 mb-1.5 mt-0.5 select-none'>
						dropdown
					</span>

					{/* Table */}
					<AccordionItem value='table'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Table</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SelectField
									label='scrollType'
									value={state.table_scrollType}
									options={[
										{ value: "x", label: "x" },
										{ value: "y", label: "y" },
										{ value: "xy", label: "xy" },
									]}
									onChange={(v) => set("table_scrollType")(v as PlaygroundState["table_scrollType"])}
									optionKey='table_scrollType'
								/>
								<SelectField
									label='captionPosition'
									value={state.table_captionPosition}
									options={[
										{ value: "bottom", label: "bottom" },
										{ value: "top", label: "top" },
									]}
									onChange={(v) => set("table_captionPosition")(v as PlaygroundState["table_captionPosition"])}
									optionKey='table_captionPosition'
								/>
								<SelectField
									label='cellControllerPosition'
									value={state.table_cellControllerPosition}
									options={[
										{ value: "cell", label: "cell" },
										{ value: "table", label: "table" },
									]}
									onChange={(v) =>
										set("table_cellControllerPosition")(v as PlaygroundState["table_cellControllerPosition"])
									}
									optionKey='table_cellControllerPosition'
								/>
								<ToggleableTextInput
									label='colorList'
									value={state.table_colorList}
									preset={ITEM_PRESETS.table_colorList}
									onChange={set("table_colorList")}
									placeholder='#ff0000,#00ff00,#0000ff,...'
									optionKey='table_colorList'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* FontColor */}
					<AccordionItem value='fontColor'>
						<AccordionTrigger className='text-xs font-semibold py-2'>FontColor</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField
									label='disableHEXInput'
									checked={state.fontColor_disableHEXInput}
									onChange={set("fontColor_disableHEXInput")}
									optionKey='fontColor_disableHEXInput'
								/>
								<NumberInput
									label='splitNum'
									value={state.fontColor_splitNum}
									onChange={set("fontColor_splitNum")}
									optionKey='fontColor_splitNum'
								/>
								<ToggleableTextInput
									label='items'
									value={state.fontColor_items}
									preset={ITEM_PRESETS.fontColor_items}
									onChange={set("fontColor_items")}
									placeholder='#ff0000,#00ff00,...'
									optionKey='fontColor_items'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* BackgroundColor */}
					<AccordionItem value='backgroundColor'>
						<AccordionTrigger className='text-xs font-semibold py-2'>BackgroundColor</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SwitchField
									label='disableHEXInput'
									checked={state.backgroundColor_disableHEXInput}
									onChange={set("backgroundColor_disableHEXInput")}
									optionKey='backgroundColor_disableHEXInput'
								/>
								<NumberInput
									label='splitNum'
									value={state.backgroundColor_splitNum}
									onChange={set("backgroundColor_splitNum")}
									optionKey='backgroundColor_splitNum'
								/>
								<ToggleableTextInput
									label='items'
									value={state.backgroundColor_items}
									preset={ITEM_PRESETS.backgroundColor_items}
									onChange={set("backgroundColor_items")}
									placeholder='#ff0000,#00ff00,...'
									optionKey='backgroundColor_items'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* ── Items-based plugins ── */}

					{/* Align */}
					<AccordionItem value='align'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Align</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextInput
								label='items'
								value={state.align_items}
								preset={ITEM_PRESETS.align_items}
								onChange={set("align_items")}
								placeholder='left,center,right,justify'
								optionKey='align_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* Font */}
					<AccordionItem value='font'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Font</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextarea
								label='items'
								value={state.font_items}
								preset={ITEM_PRESETS.font_items}
								onChange={set("font_items")}
								placeholder='Arial,Georgia,...'
								rows={3}
								optionKey='font_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* BlockStyle */}
					<AccordionItem value='blockStyle'>
						<AccordionTrigger className='text-xs font-semibold py-2'>BlockStyle</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextInput
								label='items'
								value={state.blockStyle_items}
								preset={ITEM_PRESETS.blockStyle_items}
								onChange={set("blockStyle_items")}
								placeholder='p,blockquote,pre,h1,...'
								optionKey='blockStyle_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* LineHeight */}
					<AccordionItem value='lineHeight'>
						<AccordionTrigger className='text-xs font-semibold py-2'>LineHeight</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextarea
								label='items (JSON)'
								value={state.lineHeight_items}
								preset={ITEM_PRESETS.lineHeight_items}
								onChange={set("lineHeight_items")}
								placeholder='[{"text":"1","value":"1em"},{"text":"1.5","value":"1.5em"}]'
								rows={3}
								optionKey='lineHeight_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* ParagraphStyle */}
					<AccordionItem value='paragraphStyle'>
						<AccordionTrigger className='text-xs font-semibold py-2'>ParagraphStyle</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextInput
								label='items'
								value={state.paragraphStyle_items}
								preset={ITEM_PRESETS.paragraphStyle_items}
								onChange={set("paragraphStyle_items")}
								placeholder='spaced,bordered,neon'
								optionKey='paragraphStyle_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* TextStyle */}
					<AccordionItem value='textStyle'>
						<AccordionTrigger className='text-xs font-semibold py-2'>TextStyle</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextInput
								label='items'
								value={state.textStyle_items}
								preset={ITEM_PRESETS.textStyle_items}
								onChange={set("textStyle_items")}
								placeholder='code,shadow'
								optionKey='textStyle_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* Template */}
					<AccordionItem value='template'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Template</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextarea
								label='items (JSON)'
								value={state.template_items}
								preset={ITEM_PRESETS.template_items}
								onChange={set("template_items")}
								placeholder='[{"name":"Greeting","html":"<p>Hello!</p>"}]'
								rows={3}
								optionKey='template_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* Layout */}
					<AccordionItem value='layout'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Layout</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextarea
								label='items (JSON)'
								value={state.layout_items}
								preset={ITEM_PRESETS.layout_items}
								onChange={set("layout_items")}
								placeholder='[{"name":"Two Column","html":"<div>...</div>"}]'
								rows={3}
								optionKey='layout_items'
							/>
						</AccordionContent>
					</AccordionItem>

					{/* HR */}
					<AccordionItem value='hr'>
						<AccordionTrigger className='text-xs font-semibold py-2'>HR</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<ToggleableTextarea
								label='items (JSON)'
								value={state.hr_items}
								preset={ITEM_PRESETS.hr_items}
								onChange={set("hr_items")}
								placeholder='[{"name":"Solid","class":"__se__solid"},{"name":"Dashed","class":"__se__dashed"}]'
								rows={3}
								optionKey='hr_items'
							/>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end dropdown group */}

				{/* ── command ──────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-amber-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400 border border-amber-300/30 dark:border-amber-400/20 mb-1.5 mt-0.5 select-none'>
						command
					</span>

					{showAll && (
						<>
							{/* Blockquote */}
							<AccordionItem value='blockquote'>
								<AccordionTrigger className='text-xs font-semibold py-2 text-muted-foreground/60'>
									Blockquote
								</AccordionTrigger>
								<AccordionContent className='px-1 pb-3'>
									<NoOptionsNote />
								</AccordionContent>
							</AccordionItem>

							{/* List_bulleted */}
							<AccordionItem value='list_bulleted'>
								<AccordionTrigger className='text-xs font-semibold py-2 text-muted-foreground/60'>
									List_bulleted
								</AccordionTrigger>
								<AccordionContent className='px-1 pb-3'>
									<NoOptionsNote />
								</AccordionContent>
							</AccordionItem>

							{/* List_numbered */}
							<AccordionItem value='list_numbered'>
								<AccordionTrigger className='text-xs font-semibold py-2 text-muted-foreground/60'>
									List_numbered
								</AccordionTrigger>
								<AccordionContent className='px-1 pb-3'>
									<NoOptionsNote />
								</AccordionContent>
							</AccordionItem>
						</>
					)}
					{/* ExportPDF */}
					<AccordionItem value='exportPDF'>
						<AccordionTrigger className='text-xs font-semibold py-2'>ExportPDF</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='apiUrl'
									value={state.exportPDF_apiUrl}
									onChange={set("exportPDF_apiUrl")}
									placeholder={API_DOWNLOAD_PDF}
									optionKey='exportPDF_apiUrl'
								/>
								<TextInput
									label='fileName'
									value={state.exportPDF_fileName}
									onChange={set("exportPDF_fileName")}
									placeholder='suneditor-pdf'
									optionKey='exportPDF_fileName'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* FileUpload */}
					<AccordionItem value='fileUpload'>
						<AccordionTrigger className='text-xs font-semibold py-2'>FileUpload</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<ToggleableTextInput
									label='uploadUrl'
									value={state.fileUpload_uploadUrl}
									preset={API_UPLOAD_FILE}
									onChange={set("fileUpload_uploadUrl")}
									placeholder={API_UPLOAD_FILE}
									optionKey='fileUpload_uploadUrl'
								/>
								<SwitchField
									label='allowMultiple'
									checked={state.fileUpload_allowMultiple}
									onChange={set("fileUpload_allowMultiple")}
									optionKey='fileUpload_allowMultiple'
								/>
								<TextInput
									label='acceptedFormats'
									value={state.fileUpload_acceptedFormats}
									onChange={set("fileUpload_acceptedFormats")}
									placeholder='*'
									optionKey='fileUpload_acceptedFormats'
								/>
								<SelectField
									label='as'
									value={state.fileUpload_as}
									options={[
										{ value: "box", label: "box" },
										{ value: "link", label: "link" },
									]}
									onChange={set("fileUpload_as")}
									optionKey='fileUpload_as'
								/>
								<AdvancedSection label={advLabel}>
									<ToggleableTextInput
										label='uploadHeaders'
										value={state.fileUpload_uploadHeaders}
										preset='{}'
										onChange={set("fileUpload_uploadHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='fileUpload_uploadHeaders'
									/>
									<NumberInput
										label='uploadSizeLimit'
										value={state.fileUpload_uploadSizeLimit}
										onChange={set("fileUpload_uploadSizeLimit")}
										optionKey='fileUpload_uploadSizeLimit'
									/>
									<NumberInput
										label='uploadSingleSizeLimit'
										value={state.fileUpload_uploadSingleSizeLimit}
										onChange={set("fileUpload_uploadSingleSizeLimit")}
										optionKey='fileUpload_uploadSingleSizeLimit'
									/>
									<ToggleableTextarea
										label='controls (JSON)'
										value={state.fileUpload_controls}
										preset={ITEM_PRESETS.fileUpload_controls}
										onChange={set("fileUpload_controls")}
										placeholder='[["edit","copy","remove"]]'
										rows={2}
										optionKey='fileUpload_controls'
									/>
									<SelectField
										label='insertBehavior'
										value={state.fileUpload_insertBehavior}
										options={INSERT_BEHAVIOR_OPTS}
										onChange={set("fileUpload_insertBehavior")}
										optionKey='fileUpload_insertBehavior'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end command group */}

				{/* ── input ────────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-teal-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-teal-500/10 text-teal-600 dark:bg-teal-400/15 dark:text-teal-400 border border-teal-300/30 dark:border-teal-400/20 mb-1.5 mt-0.5 select-none'>
						input
					</span>
					{showAll && (
						<>
							{/* PageNavigator */}
							<AccordionItem value='pageNavigator'>
								<AccordionTrigger className='text-xs font-semibold py-2 text-muted-foreground/60'>
									PageNavigator
								</AccordionTrigger>
								<AccordionContent className='px-1 pb-3'>
									<NoOptionsNote />
								</AccordionContent>
							</AccordionItem>
						</>
					)}

					{/* FontSize */}
					<AccordionItem value='fontSize'>
						<AccordionTrigger className='text-xs font-semibold py-2'>FontSize</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<SelectField
									label='sizeUnit'
									value={state.fontSize_sizeUnit}
									options={[
										{ value: "px", label: "px" },
										{ value: "pt", label: "pt" },
										{ value: "em", label: "em" },
										{ value: "rem", label: "rem" },
										{ value: "vw", label: "vw" },
										{ value: "%", label: "%" },
										{ value: "text", label: "text" },
									]}
									onChange={set("fontSize_sizeUnit")}
									optionKey='fontSize_sizeUnit'
								/>
								<SwitchField
									label='showIncDecControls'
									checked={state.fontSize_showIncDecControls}
									onChange={set("fontSize_showIncDecControls")}
									optionKey='fontSize_showIncDecControls'
								/>
								<AdvancedSection label={advLabel}>
									<SwitchField
										label='showDefaultSizeLabel'
										checked={state.fontSize_showDefaultSizeLabel}
										onChange={set("fontSize_showDefaultSizeLabel")}
										optionKey='fontSize_showDefaultSizeLabel'
									/>
									<SwitchField
										label='disableInput'
										checked={state.fontSize_disableInput}
										onChange={set("fontSize_disableInput")}
										optionKey='fontSize_disableInput'
									/>
									<ToggleableTextarea
										label='unitMap (JSON)'
										value={state.fontSize_unitMap}
										preset={ITEM_PRESETS.fontSize_unitMap}
										onChange={set("fontSize_unitMap")}
										placeholder='{"px":{"default":16,"inc":1,...}}'
										rows={3}
										optionKey='fontSize_unitMap'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end input group */}

				{/* ── field ────────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-rose-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-400 border border-rose-300/30 dark:border-rose-400/20 mb-1.5 mt-0.5 select-none'>
						field
					</span>
					{/* Mention */}
					<AccordionItem value='mention'>
						<AccordionTrigger className='text-xs font-semibold py-2'>Mention</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='triggerText'
									value={state.mention_triggerText}
									onChange={set("mention_triggerText")}
									placeholder='@'
									optionKey='mention_triggerText'
								/>
								<NumberInput
									label='limitSize'
									value={state.mention_limitSize}
									onChange={set("mention_limitSize")}
									optionKey='mention_limitSize'
								/>
								<NumberInput
									label='delayTime'
									value={state.mention_delayTime}
									onChange={set("mention_delayTime")}
									optionKey='mention_delayTime'
								/>
								<SwitchField
									label='useCachingFieldData'
									checked={state.mention_useCachingFieldData}
									onChange={set("mention_useCachingFieldData")}
									optionKey='mention_useCachingFieldData'
								/>
								<AdvancedSection label={advLabel}>
									<NumberInput
										label='searchStartLength'
										value={state.mention_searchStartLength}
										onChange={set("mention_searchStartLength")}
										optionKey='mention_searchStartLength'
									/>
									<TextInput
										label='apiUrl'
										value={state.mention_apiUrl}
										onChange={set("mention_apiUrl")}
										placeholder={API_MENTION}
										optionKey='mention_apiUrl'
									/>
									<TextInput
										label='apiHeaders'
										value={state.mention_apiHeaders}
										onChange={set("mention_apiHeaders")}
										placeholder='{"Authorization":"..."}'
										optionKey='mention_apiHeaders'
									/>
									<SwitchField
										label='useCachingData'
										checked={state.mention_useCachingData}
										onChange={set("mention_useCachingData")}
										optionKey='mention_useCachingData'
									/>
									<ToggleableTextarea
										label='data (JSON)'
										value={state.mention_data}
										preset={ITEM_PRESETS.mention_data}
										onChange={set("mention_data")}
										placeholder='[{"key":"john","name":"John","url":"/users/john"}]'
										rows={3}
										optionKey='mention_data'
									/>
								</AdvancedSection>
							</div>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end field group */}

				{/* ── browser ──────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-purple-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-400 border border-purple-300/30 dark:border-purple-400/20 mb-1.5 mt-0.5 select-none'>
						browser
					</span>

					{/* ImageGallery */}
					<AccordionItem value='imageGallery'>
						<AccordionTrigger className='text-xs font-semibold py-2'>ImageGallery</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='url'
									value={state.imageGallery_url}
									onChange={set("imageGallery_url")}
									placeholder='/api/images'
									optionKey='imageGallery_url'
								/>
								<TextInput
									label='headers'
									value={state.imageGallery_headers}
									onChange={set("imageGallery_headers")}
									placeholder='{"Authorization":"..."}'
									optionKey='imageGallery_headers'
								/>
								<ToggleableTextarea
									label='data'
									value={state.imageGallery_data}
									preset={GALLERY_DATA_PRESETS.imageGallery_data}
									onChange={set("imageGallery_data")}
									placeholder='[{"src":"...","thumbnail":"...","name":"..."}]'
									rows={4}
									optionKey='imageGallery_data'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* VideoGallery */}
					<AccordionItem value='videoGallery'>
						<AccordionTrigger className='text-xs font-semibold py-2'>VideoGallery</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='url'
									value={state.videoGallery_url}
									onChange={set("videoGallery_url")}
									placeholder='/api/videos'
									optionKey='videoGallery_url'
								/>
								<TextInput
									label='headers'
									value={state.videoGallery_headers}
									onChange={set("videoGallery_headers")}
									placeholder='{"Authorization":"..."}'
									optionKey='videoGallery_headers'
								/>
								<TextInput
									label='thumbnail'
									value={state.videoGallery_thumbnail}
									onChange={set("videoGallery_thumbnail")}
									placeholder='URL or empty'
									optionKey='videoGallery_thumbnail'
								/>
								<ToggleableTextarea
									label='data'
									value={state.videoGallery_data}
									preset={GALLERY_DATA_PRESETS.videoGallery_data}
									onChange={set("videoGallery_data")}
									placeholder='[{"src":"...","thumbnail":"...","name":"..."}]'
									rows={4}
									optionKey='videoGallery_data'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* AudioGallery */}
					<AccordionItem value='audioGallery'>
						<AccordionTrigger className='text-xs font-semibold py-2'>AudioGallery</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='url'
									value={state.audioGallery_url}
									onChange={set("audioGallery_url")}
									placeholder='/api/audio'
									optionKey='audioGallery_url'
								/>
								<TextInput
									label='headers'
									value={state.audioGallery_headers}
									onChange={set("audioGallery_headers")}
									placeholder='{"Authorization":"..."}'
									optionKey='audioGallery_headers'
								/>
								<TextInput
									label='thumbnail'
									value={state.audioGallery_thumbnail}
									onChange={set("audioGallery_thumbnail")}
									placeholder='URL or empty'
									optionKey='audioGallery_thumbnail'
								/>
								<ToggleableTextarea
									label='data'
									value={state.audioGallery_data}
									preset={GALLERY_DATA_PRESETS.audioGallery_data}
									onChange={set("audioGallery_data")}
									placeholder='[{"src":"...","name":"..."}]'
									rows={3}
									optionKey='audioGallery_data'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* FileGallery */}
					<AccordionItem value='fileGallery'>
						<AccordionTrigger className='text-xs font-semibold py-2'>FileGallery</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='url'
									value={state.fileGallery_url}
									onChange={set("fileGallery_url")}
									placeholder='/api/files'
									optionKey='fileGallery_url'
								/>
								<TextInput
									label='headers'
									value={state.fileGallery_headers}
									onChange={set("fileGallery_headers")}
									placeholder='{"Authorization":"..."}'
									optionKey='fileGallery_headers'
								/>
								<TextInput
									label='thumbnail'
									value={state.fileGallery_thumbnail}
									onChange={set("fileGallery_thumbnail")}
									placeholder='URL or empty'
									optionKey='fileGallery_thumbnail'
								/>
								<ToggleableTextarea
									label='data'
									value={state.fileGallery_data}
									preset={GALLERY_DATA_PRESETS.fileGallery_data}
									onChange={set("fileGallery_data")}
									placeholder='[{"src":"...","name":"..."}]'
									rows={3}
									optionKey='fileGallery_data'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>

					{/* FileBrowser */}
					<AccordionItem value='fileBrowser'>
						<AccordionTrigger className='text-xs font-semibold py-2'>FileBrowser</AccordionTrigger>
						<AccordionContent className='px-1 pb-3'>
							<div className='space-y-3'>
								<TextInput
									label='url'
									value={state.fileBrowser_url}
									onChange={set("fileBrowser_url")}
									placeholder='/api/browse'
									optionKey='fileBrowser_url'
								/>
								<TextInput
									label='headers'
									value={state.fileBrowser_headers}
									onChange={set("fileBrowser_headers")}
									placeholder='{"Authorization":"..."}'
									optionKey='fileBrowser_headers'
								/>
								<TextInput
									label='thumbnail'
									value={state.fileBrowser_thumbnail}
									onChange={set("fileBrowser_thumbnail")}
									placeholder='URL or empty'
									optionKey='fileBrowser_thumbnail'
								/>
								<ToggleableTextarea
									label='data'
									value={state.fileBrowser_data}
									preset={GALLERY_DATA_PRESETS.fileBrowser_data}
									onChange={set("fileBrowser_data")}
									placeholder='{"root":[{"src":"...","name":"..."}]}'
									rows={3}
									optionKey='fileBrowser_data'
								/>
								<ToggleableTextarea
									label='props'
									value={state.fileBrowser_props}
									preset={GALLERY_DATA_PRESETS.fileBrowser_props}
									onChange={set("fileBrowser_props")}
									placeholder='["href","data-size","data-name"]'
									rows={2}
									optionKey='fileBrowser_props'
								/>
							</div>
						</AccordionContent>
					</AccordionItem>
				</div>
				{/* end browser group */}

				{/* ── popup ────────────────────────────────── */}
				<div className='ms-0.5 border-l-2 border-orange-400/50 ps-2 mb-2'>
					<span className='inline-flex items-center px-1.5 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-400 border border-orange-300/30 dark:border-orange-400/20 mb-1.5 mt-0.5 select-none'>
						popup
					</span>

					{showAll && (
						<>
							{/* Anchor */}
							<AccordionItem value='anchor'>
								<AccordionTrigger className='text-xs font-semibold py-2 text-muted-foreground/60'>Anchor</AccordionTrigger>
								<AccordionContent className='px-1 pb-3'>
									<NoOptionsNote />
								</AccordionContent>
							</AccordionItem>
						</>
					)}
				</div>
				{/* end popup group */}
			</Accordion>
		</div>
	);
}
