"use client";

import { useRef, useState } from "react";
import SunEditor, { type SunEditorInstance } from "@suneditor/react";
import ko from "suneditor/langs/ko";
import "suneditor/css/editor";
import "suneditor/css/contents";
import "suneditor/src/themes/dark.css";

export default function ReactWrapperDemo() {
	const ref = useRef<SunEditorInstance | null>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [html, setHtml] = useState("<p>Hello <b>@suneditor/react</b></p>");
	const [readOnly, setReadOnly] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [dark, setDark] = useState(false);
	const [korean, setKorean] = useState(false);
	const [mounted, setMounted] = useState(true);
	const [saves, setSaves] = useState(0);
	const [refHtml, setRefHtml] = useState("");

	const btn = "rounded border px-2 py-1 text-xs";

	return (
		<div className='mt-6 space-y-4'>
			<div className='flex flex-wrap gap-2' data-testid='controls'>
				<button className={btn} onClick={() => setHtml(`<p>Set from outside ${Date.now()}</p>`)}>
					set value
				</button>
				<button className={btn} onClick={() => setReadOnly((v) => !v)}>
					readOnly: {String(readOnly)}
				</button>
				<button className={btn} onClick={() => setDisabled((v) => !v)}>
					disabled: {String(disabled)}
				</button>
				<button className={btn} onClick={() => setDark((v) => !v)}>
					theme: {dark ? "dark" : "default"}
				</button>
				<button className={btn} onClick={() => setKorean((v) => !v)}>
					lang: {korean ? "ko" : "en"} (remounts)
				</button>
				<button className={btn} onClick={() => setMounted((v) => !v)}>
					mounted: {String(mounted)}
				</button>
				<button className={btn} onClick={() => setRefHtml(ref.current?.$.html.get() ?? "(no instance)")}>
					read ref.$.html.get()
				</button>
				<span className='self-center text-xs' data-testid='saves'>
					saves: {saves}
				</span>
			</div>

			{/* toolbar_container target: the options function runs after mount, so the ref is set */}
			<div ref={toolbarRef} data-testid='external-toolbar' />

			{mounted && (
				<SunEditor
					key={String(korean)}
					ref={ref}
					data-testid='editor'
					value={html}
					onChange={setHtml}
					readOnly={readOnly}
					disabled={disabled}
					options={(se) => ({
						plugins: [se.plugins.link, se.plugins.image, se.plugins.table, se.plugins.list, se.plugins.align, se.plugins.fontColor],
						buttonList: [["undo", "redo"], ["bold", "italic", "underline", "strike"], ["fontColor", "align", "list"], ["table", "link", "image"], ["codeView", "save"]],
						height: "260px",
						theme: dark ? "dark" : "",
						lang: korean ? ko : undefined,
						toolbar_container: toolbarRef.current,
						events: {
							// Closes over `saves` on purpose: handlers must always see the latest render.
							onSave: async () => {
								setSaves(saves + 1);
								return true;
							},
						},
					})}
				/>
			)}

			<div>
				<h3 className='text-sm font-semibold'>state.html (controlled)</h3>
				<pre className='mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-xs' data-testid='state-html'>
					{html}
				</pre>
			</div>
			<div>
				<h3 className='text-sm font-semibold'>ref.$.html.get()</h3>
				<pre className='mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-xs' data-testid='ref-html'>
					{refHtml}
				</pre>
			</div>
		</div>
	);
}
