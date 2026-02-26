"use client";

import { type Dispatch } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { type PlaygroundState, type PlaygroundAction } from "../_lib/playgroundState";

type Props = {
	state: PlaygroundState;
	dispatch: Dispatch<PlaygroundAction>;
};

/* ── Reusable field components ─────────────────────────── */

function FieldLabel({ label }: { label: string }) {
	return (
		<span className='text-xs text-muted-foreground'>
			{label}
		</span>
	);
}

function SelectField({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (v: string) => void;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} />
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
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	placeholder?: string;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} />
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
}: {
	label: string;
	value: number;
	onChange: (v: number) => void;
}) {
	return (
		<label className='flex flex-col gap-1'>
			<FieldLabel label={label} />
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
}: {
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
}) {
	return (
		<label className='flex items-center justify-between gap-2 py-0.5'>
			<FieldLabel label={label} />
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
			<h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2'>Plugin Options</h3>
			<Accordion type='multiple' className='w-full'>
				{/* Image */}
				<AccordionItem value='image'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Image</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='canResize' checked={state.image_canResize} onChange={set("image_canResize")} />
							<TextInput label='defaultWidth' value={state.image_defaultWidth} onChange={set("image_defaultWidth")} placeholder='auto' />
							<TextInput label='defaultHeight' value={state.image_defaultHeight} onChange={set("image_defaultHeight")} placeholder='auto' />
							<SwitchField label='createFileInput' checked={state.image_createFileInput} onChange={set("image_createFileInput")} />
							<SwitchField label='createUrlInput' checked={state.image_createUrlInput} onChange={set("image_createUrlInput")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Video */}
				<AccordionItem value='video'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Video</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='canResize' checked={state.video_canResize} onChange={set("video_canResize")} />
							<TextInput label='defaultWidth' value={state.video_defaultWidth} onChange={set("video_defaultWidth")} />
							<TextInput label='defaultHeight' value={state.video_defaultHeight} onChange={set("video_defaultHeight")} />
							<SwitchField label='createFileInput' checked={state.video_createFileInput} onChange={set("video_createFileInput")} />
							<SwitchField label='createUrlInput' checked={state.video_createUrlInput} onChange={set("video_createUrlInput")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Audio */}
				<AccordionItem value='audio'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Audio</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<TextInput label='defaultWidth' value={state.audio_defaultWidth} onChange={set("audio_defaultWidth")} placeholder='300px' />
							<TextInput label='defaultHeight' value={state.audio_defaultHeight} onChange={set("audio_defaultHeight")} placeholder='54px' />
							<SwitchField label='createFileInput' checked={state.audio_createFileInput} onChange={set("audio_createFileInput")} />
							<SwitchField label='createUrlInput' checked={state.audio_createUrlInput} onChange={set("audio_createUrlInput")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Embed */}
				<AccordionItem value='embed'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Embed</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='canResize' checked={state.embed_canResize} onChange={set("embed_canResize")} />
							<TextInput label='defaultWidth' value={state.embed_defaultWidth} onChange={set("embed_defaultWidth")} />
							<TextInput label='defaultHeight' value={state.embed_defaultHeight} onChange={set("embed_defaultHeight")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Table */}
				<AccordionItem value='table'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Table</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SelectField
								label='scrollType'
								value={state.table_scrollType}
								options={[
									{ value: "x", label: "x" },
									{ value: "y", label: "y" },
									{ value: "xy", label: "xy" },
								]}
								onChange={(v) => set("table_scrollType")(v as PlaygroundState["table_scrollType"])}
							/>
							<SelectField
								label='captionPosition'
								value={state.table_captionPosition}
								options={[
									{ value: "bottom", label: "bottom" },
									{ value: "top", label: "top" },
								]}
								onChange={(v) => set("table_captionPosition")(v as PlaygroundState["table_captionPosition"])}
							/>
							<SelectField
								label='cellControllerPosition'
								value={state.table_cellControllerPosition}
								options={[
									{ value: "cell", label: "cell" },
									{ value: "table", label: "table" },
								]}
								onChange={(v) => set("table_cellControllerPosition")(v as PlaygroundState["table_cellControllerPosition"])}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FontSize */}
				<AccordionItem value='fontSize'>
					<AccordionTrigger className='text-xs font-semibold py-2'>FontSize</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
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
							/>
							<SwitchField label='showIncDecControls' checked={state.fontSize_showIncDecControls} onChange={set("fontSize_showIncDecControls")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* FontColor */}
				<AccordionItem value='fontColor'>
					<AccordionTrigger className='text-xs font-semibold py-2'>FontColor</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='disableHEXInput' checked={state.fontColor_disableHEXInput} onChange={set("fontColor_disableHEXInput")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* BackgroundColor */}
				<AccordionItem value='backgroundColor'>
					<AccordionTrigger className='text-xs font-semibold py-2'>BackgroundColor</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='disableHEXInput' checked={state.backgroundColor_disableHEXInput} onChange={set("backgroundColor_disableHEXInput")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Drawing */}
				<AccordionItem value='drawing'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Drawing</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SelectField
								label='outputFormat'
								value={state.drawing_outputFormat}
								options={[
									{ value: "dataurl", label: "dataurl" },
									{ value: "svg", label: "svg" },
								]}
								onChange={(v) => set("drawing_outputFormat")(v as PlaygroundState["drawing_outputFormat"])}
							/>
							<NumberInput label='lineWidth' value={state.drawing_lineWidth} onChange={set("drawing_lineWidth")} />
							<SelectField
								label='lineCap'
								value={state.drawing_lineCap}
								options={[
									{ value: "round", label: "round" },
									{ value: "butt", label: "butt" },
									{ value: "square", label: "square" },
								]}
								onChange={(v) => set("drawing_lineCap")(v as PlaygroundState["drawing_lineCap"])}
							/>
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Mention */}
				<AccordionItem value='mention'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Mention</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<TextInput label='triggerText' value={state.mention_triggerText} onChange={set("mention_triggerText")} placeholder='@' />
							<NumberInput label='limitSize' value={state.mention_limitSize} onChange={set("mention_limitSize")} />
							<NumberInput label='delayTime' value={state.mention_delayTime} onChange={set("mention_delayTime")} />
						</div>
					</AccordionContent>
				</AccordionItem>

				{/* Math */}
				<AccordionItem value='math'>
					<AccordionTrigger className='text-xs font-semibold py-2'>Math</AccordionTrigger>
					<AccordionContent>
						<div className='space-y-2'>
							<SwitchField label='canResize' checked={state.math_canResize} onChange={set("math_canResize")} />
							<SwitchField label='autoHeight' checked={state.math_autoHeight} onChange={set("math_autoHeight")} />
						</div>
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</div>
	);
}
