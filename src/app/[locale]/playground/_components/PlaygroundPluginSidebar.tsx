"use client";

import { type Dispatch } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction } from "../_lib/playgroundState";
import { OptionInfo } from "./OptionInfo";
import optionDescriptions from "@/data/api/option-descriptions.json";

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

const optDesc = optionDescriptions as Record<string, string>;

function FieldLabel({ label, optionKey }: { label: string; optionKey?: string }) {
	const key = optionKey ?? label;
	const desc = optDesc[key];
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

function NumberInput({ label, value, onChange, optionKey }: { label: string; value: number; onChange: (v: number) => void; optionKey?: string }) {
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

function AdvancedSection({ children }: { children: React.ReactNode }) {
	return (
		<details className='mt-2 border-t pt-2'>
			<summary className='cursor-pointer text-[11px] font-medium text-muted-foreground hover:text-foreground select-none'>
				Advanced
			</summary>
			<div className='mt-2 space-y-3'>{children}</div>
		</details>
	);
}

/* ── Helper to dispatch ────────────────────────────────── */

function useSet(dispatch: Dispatch<PlaygroundAction>) {
	return <K extends keyof PlaygroundState>(key: K) =>
		(value: PlaygroundState[K]) =>
			dispatch({ type: "SET", key, value });
}

/* ── Main component ────────────────────────────────────── */

export default function PlaygroundPluginSidebar({ state, dispatch }: Props) {
	const set = useSet(dispatch);
	return (
		<div className='space-y-1'>
			<h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2'>
				Plugin Options
			</h3>
			<Accordion type='multiple' className='w-full'>
				{/* Image */}
				<AccordionItem value='image'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Image</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='canResize' checked={state.image_canResize} onChange={set("image_canResize")} optionKey='image_canResize' />
							<TextInput label='defaultWidth' value={state.image_defaultWidth} onChange={set("image_defaultWidth")} placeholder='auto' optionKey='image_defaultWidth' />
							<TextInput label='defaultHeight' value={state.image_defaultHeight} onChange={set("image_defaultHeight")} placeholder='auto' optionKey='image_defaultHeight' />
							<SwitchField label='createFileInput' checked={state.image_createFileInput} onChange={set("image_createFileInput")} optionKey='image_createFileInput' />
							<SwitchField label='createUrlInput' checked={state.image_createUrlInput} onChange={set("image_createUrlInput")} optionKey='image_createUrlInput' />
							<AdvancedSection>
								<TextInput label='uploadUrl' value={state.image_uploadUrl} onChange={set("image_uploadUrl")} placeholder='/upload/image' optionKey='image_uploadUrl' />
								<NumberInput label='uploadSizeLimit (bytes)' value={state.image_uploadSizeLimit} onChange={set("image_uploadSizeLimit")} optionKey='image_uploadSizeLimit' />
								<SwitchField label='allowMultiple' checked={state.image_allowMultiple} onChange={set("image_allowMultiple")} optionKey='image_allowMultiple' />
								<TextInput label='acceptedFormats' value={state.image_acceptedFormats} onChange={set("image_acceptedFormats")} placeholder='image/*' optionKey='image_acceptedFormats' />
								<SwitchField label='percentageOnlySize' checked={state.image_percentageOnlySize} onChange={set("image_percentageOnlySize")} optionKey='image_percentageOnlySize' />
								<SwitchField label='showHeightInput' checked={state.image_showHeightInput} onChange={set("image_showHeightInput")} optionKey='image_showHeightInput' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Video */}
				<AccordionItem value='video'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Video</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='canResize' checked={state.video_canResize} onChange={set("video_canResize")} optionKey='video_canResize' />
							<TextInput label='defaultWidth' value={state.video_defaultWidth} onChange={set("video_defaultWidth")} placeholder='100%' optionKey='video_defaultWidth' />
							<TextInput label='defaultHeight' value={state.video_defaultHeight} onChange={set("video_defaultHeight")} placeholder='auto' optionKey='video_defaultHeight' />
							<SwitchField label='createFileInput' checked={state.video_createFileInput} onChange={set("video_createFileInput")} optionKey='video_createFileInput' />
							<SwitchField label='createUrlInput' checked={state.video_createUrlInput} onChange={set("video_createUrlInput")} optionKey='video_createUrlInput' />
							<AdvancedSection>
								<TextInput label='uploadUrl' value={state.video_uploadUrl} onChange={set("video_uploadUrl")} placeholder='/upload/video' optionKey='video_uploadUrl' />
								<NumberInput label='uploadSizeLimit (bytes)' value={state.video_uploadSizeLimit} onChange={set("video_uploadSizeLimit")} optionKey='video_uploadSizeLimit' />
								<SwitchField label='allowMultiple' checked={state.video_allowMultiple} onChange={set("video_allowMultiple")} optionKey='video_allowMultiple' />
								<TextInput label='acceptedFormats' value={state.video_acceptedFormats} onChange={set("video_acceptedFormats")} placeholder='video/*' optionKey='video_acceptedFormats' />
								<SwitchField label='percentageOnlySize' checked={state.video_percentageOnlySize} onChange={set("video_percentageOnlySize")} optionKey='video_percentageOnlySize' />
								<SwitchField label='showHeightInput' checked={state.video_showHeightInput} onChange={set("video_showHeightInput")} optionKey='video_showHeightInput' />
								<SwitchField label='showRatioOption' checked={state.video_showRatioOption} onChange={set("video_showRatioOption")} optionKey='video_showRatioOption' />
								<NumberInput label='defaultRatio' value={state.video_defaultRatio} onChange={set("video_defaultRatio")} optionKey='video_defaultRatio' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Audio */}
				<AccordionItem value='audio'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Audio</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<TextInput label='defaultWidth' value={state.audio_defaultWidth} onChange={set("audio_defaultWidth")} placeholder='300px' optionKey='audio_defaultWidth' />
							<TextInput label='defaultHeight' value={state.audio_defaultHeight} onChange={set("audio_defaultHeight")} placeholder='54px' optionKey='audio_defaultHeight' />
							<SwitchField label='createFileInput' checked={state.audio_createFileInput} onChange={set("audio_createFileInput")} optionKey='audio_createFileInput' />
							<SwitchField label='createUrlInput' checked={state.audio_createUrlInput} onChange={set("audio_createUrlInput")} optionKey='audio_createUrlInput' />
							<AdvancedSection>
								<TextInput label='uploadUrl' value={state.audio_uploadUrl} onChange={set("audio_uploadUrl")} placeholder='/upload/audio' optionKey='audio_uploadUrl' />
								<NumberInput label='uploadSizeLimit (bytes)' value={state.audio_uploadSizeLimit} onChange={set("audio_uploadSizeLimit")} optionKey='audio_uploadSizeLimit' />
								<SwitchField label='allowMultiple' checked={state.audio_allowMultiple} onChange={set("audio_allowMultiple")} optionKey='audio_allowMultiple' />
								<TextInput label='acceptedFormats' value={state.audio_acceptedFormats} onChange={set("audio_acceptedFormats")} placeholder='audio/*' optionKey='audio_acceptedFormats' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Embed */}
				<AccordionItem value='embed'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Embed</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='canResize' checked={state.embed_canResize} onChange={set("embed_canResize")} optionKey='embed_canResize' />
							<TextInput label='defaultWidth' value={state.embed_defaultWidth} onChange={set("embed_defaultWidth")} placeholder='100%' optionKey='embed_defaultWidth' />
							<TextInput label='defaultHeight' value={state.embed_defaultHeight} onChange={set("embed_defaultHeight")} placeholder='auto' optionKey='embed_defaultHeight' />
							<AdvancedSection>
								<SwitchField label='showHeightInput' checked={state.embed_showHeightInput} onChange={set("embed_showHeightInput")} optionKey='embed_showHeightInput' />
								<SwitchField label='percentageOnlySize' checked={state.embed_percentageOnlySize} onChange={set("embed_percentageOnlySize")} optionKey='embed_percentageOnlySize' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Table */}
				<AccordionItem value='table'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Table</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SelectField label='scrollType' value={state.table_scrollType} options={[{ value: "x", label: "x" }, { value: "y", label: "y" }, { value: "xy", label: "xy" }]} onChange={(v) => set("table_scrollType")(v as PlaygroundState["table_scrollType"])} optionKey='table_scrollType' />
							<SelectField label='captionPosition' value={state.table_captionPosition} options={[{ value: "bottom", label: "bottom" }, { value: "top", label: "top" }]} onChange={(v) => set("table_captionPosition")(v as PlaygroundState["table_captionPosition"])} optionKey='table_captionPosition' />
							<SelectField label='cellControllerPosition' value={state.table_cellControllerPosition} options={[{ value: "cell", label: "cell" }, { value: "table", label: "table" }]} onChange={(v) => set("table_cellControllerPosition")(v as PlaygroundState["table_cellControllerPosition"])} optionKey='table_cellControllerPosition' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FontSize */}
				<AccordionItem value='fontSize'>
					<AccordionTrigger className='text-xs font-semibold py-2'>FontSize</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SelectField label='sizeUnit' value={state.fontSize_sizeUnit} options={[{ value: "px", label: "px" }, { value: "pt", label: "pt" }, { value: "em", label: "em" }, { value: "rem", label: "rem" }, { value: "vw", label: "vw" }, { value: "%", label: "%" }, { value: "text", label: "text" }]} onChange={set("fontSize_sizeUnit")} optionKey='fontSize_sizeUnit' />
							<SwitchField label='showIncDecControls' checked={state.fontSize_showIncDecControls} onChange={set("fontSize_showIncDecControls")} optionKey='fontSize_showIncDecControls' />
							<AdvancedSection>
								<SwitchField label='showDefaultSizeLabel' checked={state.fontSize_showDefaultSizeLabel} onChange={set("fontSize_showDefaultSizeLabel")} optionKey='fontSize_showDefaultSizeLabel' />
								<SwitchField label='disableInput' checked={state.fontSize_disableInput} onChange={set("fontSize_disableInput")} optionKey='fontSize_disableInput' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FontColor */}
				<AccordionItem value='fontColor'>
					<AccordionTrigger className='text-xs font-semibold py-2'>FontColor</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='disableHEXInput' checked={state.fontColor_disableHEXInput} onChange={set("fontColor_disableHEXInput")} optionKey='fontColor_disableHEXInput' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* BackgroundColor */}
				<AccordionItem value='backgroundColor'>
					<AccordionTrigger className='text-xs font-semibold py-2'>BackgroundColor</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='disableHEXInput' checked={state.backgroundColor_disableHEXInput} onChange={set("backgroundColor_disableHEXInput")} optionKey='backgroundColor_disableHEXInput' />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Drawing */}
				<AccordionItem value='drawing'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Drawing</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SelectField label='outputFormat' value={state.drawing_outputFormat} options={[{ value: "dataurl", label: "dataurl" }, { value: "svg", label: "svg" }]} onChange={(v) => set("drawing_outputFormat")(v as PlaygroundState["drawing_outputFormat"])} optionKey='drawing_outputFormat' />
							<NumberInput label='lineWidth' value={state.drawing_lineWidth} onChange={set("drawing_lineWidth")} optionKey='drawing_lineWidth' />
							<SelectField label='lineCap' value={state.drawing_lineCap} options={[{ value: "round", label: "round" }, { value: "butt", label: "butt" }, { value: "square", label: "square" }]} onChange={(v) => set("drawing_lineCap")(v as PlaygroundState["drawing_lineCap"])} optionKey='drawing_lineCap' />
							<AdvancedSection>
								<SwitchField label='canResize' checked={state.drawing_canResize} onChange={set("drawing_canResize")} optionKey='drawing_canResize' />
								<TextInput label='lineColor' value={state.drawing_lineColor} onChange={set("drawing_lineColor")} placeholder='#000000' optionKey='drawing_lineColor' />
								<SwitchField label='lineReconnect' checked={state.drawing_lineReconnect} onChange={set("drawing_lineReconnect")} optionKey='drawing_lineReconnect' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Mention */}
				<AccordionItem value='mention'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Mention</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<TextInput label='triggerText' value={state.mention_triggerText} onChange={set("mention_triggerText")} placeholder='@' optionKey='mention_triggerText' />
							<NumberInput label='limitSize' value={state.mention_limitSize} onChange={set("mention_limitSize")} optionKey='mention_limitSize' />
							<NumberInput label='delayTime' value={state.mention_delayTime} onChange={set("mention_delayTime")} optionKey='mention_delayTime' />
							<AdvancedSection>
								<NumberInput label='searchStartLength' value={state.mention_searchStartLength} onChange={set("mention_searchStartLength")} optionKey='mention_searchStartLength' />
								<TextInput label='apiUrl' value={state.mention_apiUrl} onChange={set("mention_apiUrl")} placeholder='/api/mention' optionKey='mention_apiUrl' />
								<SwitchField label='useCachingData' checked={state.mention_useCachingData} onChange={set("mention_useCachingData")} optionKey='mention_useCachingData' />
							</AdvancedSection>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Math */}
				<AccordionItem value='math'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Math</AccordionTrigger>
					<AccordionContent className='px-1 pb-3'>
						<div className='space-y-3'>
							<SwitchField label='canResize' checked={state.math_canResize} onChange={set("math_canResize")} optionKey='math_canResize' />
							<SwitchField label='autoHeight' checked={state.math_autoHeight} onChange={set("math_autoHeight")} optionKey='math_autoHeight' />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
