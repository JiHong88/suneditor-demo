"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { Eraser, Pause, Play, ArrowDownToLine, AlertTriangle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EVENT_LIST, CATEGORY_COLORS } from "@/data/snippets/eventSnippets";
import {
	API_UPLOAD_IMAGE, API_UPLOAD_VIDEO, API_UPLOAD_AUDIO, API_UPLOAD_FILE,
	API_GALLERY_IMAGE, API_GALLERY_VIDEO, API_GALLERY_AUDIO, API_GALLERY_FILE, API_GALLERY_BROWSE,
	API_DOWNLOAD_PDF,
} from "@/data/snippets/apiEndpoints";

const SunEditorComponent = dynamic(() => import("@/components/editor/suneditor"), { ssr: false });

/* ══════════════════════════════════════════════════════
   Event attach rules
   ══════════════════════════════════════════════════════ */

/**
 * Upload *handlers* replace the editor's own upload pipeline — the editor expects them to
 * perform the upload and report back. Attaching a passive logger would silently break uploads,
 * so the inspector never registers these (they stay in the reference table below).
 */
const NEVER_ATTACH = new Set(["imageUploadHandler", "videoUploadHandler", "audioUploadHandler"]);

/**
 * These treat `undefined` as "the handler took over the upload" and stop the flow.
 * A passive logger has to return `true` so the editor calls `handler(null)` and continues.
 * (see plugins/modal/image/index.js — `if (result === undefined) return true;`)
 */
const MUST_RETURN_TRUE = new Set([
	"onImageUploadBefore",
	"onVideoUploadBefore",
	"onAudioUploadBefore",
	"onFileUploadBefore",
	"onEmbedInputBefore",
]);

/** Params carried on every event that would flood the log with editor internals. */
const SKIP_PARAM_KEYS = new Set(["$", "frameContext", "handler", "core", "editor"]);

/** Keep the log bounded — onInput/onScroll fire on every keystroke and scroll tick. */
const MAX_LOGS = 300;

/* ══════════════════════════════════════════════════════
   Payload formatting
   ══════════════════════════════════════════════════════ */

/** Renders one payload value as a short, human-readable string. Never serializes editor internals. */
function describe(value: unknown): string {
	if (value === null) return "null";
	if (value === undefined) return "undefined";

	const type = typeof value;
	if (type === "string") {
		const s = value as string;
		return JSON.stringify(s.length > 120 ? `${s.slice(0, 120)}…` : s);
	}
	if (type === "number" || type === "boolean" || type === "bigint") return String(value);
	if (type === "function") return "ƒ()";

	if (typeof File !== "undefined" && value instanceof File) {
		return `File("${value.name}", ${value.size}B)`;
	}
	if (typeof FileList !== "undefined" && value instanceof FileList) {
		return `FileList(${value.length})${value.length ? ` "${Array.from(value).map((f) => f.name).join('", "')}"` : ""}`;
	}
	if (typeof Event !== "undefined" && value instanceof Event) {
		const key = (value as KeyboardEvent).key;
		return `${value.constructor.name}(${value.type}${key ? `, key="${key}"` : ""})`;
	}
	if (typeof Node !== "undefined" && value instanceof Node) {
		const el = value as Element;
		if (el.nodeType !== 1) return `${el.nodeName}("${(el.textContent || "").slice(0, 40)}")`;
		const id = el.id ? `#${el.id}` : "";
		const cls = el.className && typeof el.className === "string" ? `.${el.className.trim().split(/\s+/).join(".")}` : "";
		return `<${el.nodeName.toLowerCase()}${id}${cls.slice(0, 60)}>`;
	}
	if (Array.isArray(value)) return `Array(${value.length})`;

	if (type === "object") {
		const keys = Object.keys(value as object);
		return keys.length ? `{ ${keys.slice(0, 6).join(", ")}${keys.length > 6 ? ", …" : ""} }` : "{}";
	}
	return String(value);
}

/** Flattens an event's params into displayable `[key, value]` rows, dropping editor internals. */
function extractFields(params: unknown): Array<[string, string]> {
	if (!params || typeof params !== "object") return [];
	return Object.entries(params as Record<string, unknown>)
		.filter(([key]) => !SKIP_PARAM_KEYS.has(key))
		.map(([key, value]) => [key, describe(value)] as [string, string]);
}

/* ══════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════ */

type LogEntry = {
	id: number;
	time: string;
	name: string;
	category: string;
	fields: Array<[string, string]>;
};

const CATEGORIES = [...new Set(EVENT_LIST.map((e) => e.category))];
const ATTACHED_EVENTS = EVENT_LIST.filter((e) => !NEVER_ATTACH.has(e.name));

const DEMO_HTML =
	"<p>Type, select, paste, or click a toolbar button — every event the editor fires shows up in the log.</p>" +
	"<p>Upload from the media menu or pick an item from the gallery menu to see the upload and file-manager events.</p>";

/**
 * Media and gallery buttons are grouped behind more-buttons so the toolbar stays compact
 * in the half-width column while still exposing every upload/browser event.
 */
const BUTTON_LIST = [
	["undo", "redo"],
	["bold", "italic", "underline", "strike"],
	["fontColor", "align", "list_bulleted"],
	["link", "table"],
	[":Media-default.more_media", "image", "video", "audio", "embed", "fileUpload"],
	[":Gallery-default.more_gallery", "imageGallery", "videoGallery", "audioGallery", "fileGallery", "fileBrowser"],
	["codeView", "markdownView", "fullScreen", "save", "exportPDF"],
];

/**
 * Every media plugin gets a working endpoint so upload/gallery events actually fire.
 * Uploads go to the demo upload API; galleries and the file browser read the demo gallery API.
 */
const MEDIA_OPTIONS = {
	image: { uploadUrl: API_UPLOAD_IMAGE },
	// video/audio default `createFileInput` to false — without it the modal is URL-only
	// and the *UploadBefore events can never fire.
	video: { uploadUrl: API_UPLOAD_VIDEO, createFileInput: true },
	audio: { uploadUrl: API_UPLOAD_AUDIO, createFileInput: true },
	embed: { uploadUrl: API_UPLOAD_FILE },
	fileUpload: { uploadUrl: API_UPLOAD_FILE },
	link: { uploadUrl: API_UPLOAD_FILE },
	imageGallery: { url: API_GALLERY_IMAGE },
	videoGallery: { url: API_GALLERY_VIDEO },
	audioGallery: { url: API_GALLERY_AUDIO },
	fileGallery: { url: API_GALLERY_FILE },
	fileBrowser: { url: API_GALLERY_BROWSE },
	exportPDF: { apiUrl: API_DOWNLOAD_PDF },
};

export default function EventInspector() {
	const t = useTranslations("DeepDive.events.inspector");
	const tCat = useTranslations("DeepDive.events.cat");

	const [logs, setLogs] = useState<LogEntry[]>([]);
	const [paused, setPaused] = useState(false);
	const [autoScroll, setAutoScroll] = useState(true);
	const [hidden, setHidden] = useState<Set<string>>(new Set());
	const [expanded, setExpanded] = useState<number | null>(null);

	// The editor is created once and captures its `events` object, so handlers read live
	// state through refs instead of closing over it.
	const pausedRef = useRef(paused);
	pausedRef.current = paused;
	const seqRef = useRef(0);
	const logBoxRef = useRef<HTMLDivElement>(null);

	const push = useCallback((name: string, category: string, params: unknown) => {
		if (pausedRef.current) return;
		const now = new Date();
		const time = `${now.toTimeString().slice(0, 8)}.${String(now.getMilliseconds()).padStart(3, "0")}`;
		const entry: LogEntry = { id: seqRef.current++, time, name, category, fields: extractFields(params) };
		setLogs((prev) => {
			const next = prev.length >= MAX_LOGS ? prev.slice(prev.length - MAX_LOGS + 1) : prev.slice();
			next.push(entry);
			return next;
		});
	}, []);

	/** Every attachable event wired to the logger, built once for the editor's lifetime. */
	const editorOptions = useMemo(() => {
		const events: Record<string, (params: unknown) => unknown> = {};
		for (const { name, category } of ATTACHED_EVENTS) {
			events[name] = (params: unknown) => {
				push(name, category, params);
				// Passive logging only — never cancel, but keep upload flows alive.
				return MUST_RETURN_TRUE.has(name) ? true : undefined;
			};
		}
		return { buttonList: BUTTON_LIST, height: "260", events, ...MEDIA_OPTIONS };
	}, [push]);

	const visibleLogs = useMemo(() => logs.filter((l) => !hidden.has(l.category)), [logs, hidden]);

	useEffect(() => {
		if (!autoScroll || paused) return;
		const box = logBoxRef.current;
		if (box) box.scrollTop = box.scrollHeight;
	}, [visibleLogs, autoScroll, paused]);

	const toggleCategory = (cat: string) => {
		setHidden((prev) => {
			const next = new Set(prev);
			if (next.has(cat)) next.delete(cat);
			else next.add(cat);
			return next;
		});
	};

	return (
		<div className='space-y-4'>
			<p className='text-sm text-muted-foreground'>{t("desc")}</p>

			<div className='grid gap-4 lg:grid-cols-2'>
				{/* Live editor */}
				<div className='rounded-lg border p-3 space-y-2'>
					<div className='flex items-center gap-2'>
						<span className='text-xs font-semibold'>{t("editorLabel")}</span>
						<Badge variant='outline' className='text-[10px]'>
							{t("attachedCount", { count: ATTACHED_EVENTS.length })}
						</Badge>
					</div>
					<SunEditorComponent value={DEMO_HTML} options={editorOptions} />
				</div>

				{/* Event log */}
				<div className='rounded-lg border p-3 space-y-2 flex flex-col'>
					<div className='flex items-center gap-2 flex-wrap'>
						<span className='text-xs font-semibold'>{t("logLabel")}</span>
						<Badge variant='secondary' className='text-[10px]'>
							{visibleLogs.length}
						</Badge>
						<div className='ms-auto flex items-center gap-1'>
							<Button variant='ghost' size='sm' className='h-7 px-2 text-xs' onClick={() => setPaused((p) => !p)}>
								{paused ? <Play className='size-3.5' /> : <Pause className='size-3.5' />}
								{paused ? t("resume") : t("pause")}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className={`h-7 px-2 text-xs ${autoScroll ? "text-foreground" : "text-muted-foreground"}`}
								onClick={() => setAutoScroll((a) => !a)}
								aria-pressed={autoScroll}
							>
								<ArrowDownToLine className='size-3.5' />
								{t("autoScroll")}
							</Button>
							<Button
								variant='ghost'
								size='sm'
								className='h-7 px-2 text-xs'
								onClick={() => {
									setLogs([]);
									setExpanded(null);
								}}
							>
								<Eraser className='size-3.5' />
								{t("clear")}
							</Button>
						</div>
					</div>

					{/* Category filters */}
					<div className='flex flex-wrap gap-1'>
						{CATEGORIES.map((cat) => {
							const off = hidden.has(cat);
							return (
								<button
									key={cat}
									type='button'
									onClick={() => toggleCategory(cat)}
									aria-pressed={!off}
									className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-opacity ${CATEGORY_COLORS[cat]} ${off ? "opacity-30" : ""}`}
								>
									{tCat(cat)}
								</button>
							);
						})}
					</div>

					{/* Log rows */}
					<div ref={logBoxRef} className='flex-1 min-h-[300px] max-h-[420px] overflow-y-auto rounded-md bg-muted/40 font-mono text-[11px]'>
						{visibleLogs.length === 0 ? (
							<div className='flex h-full min-h-[300px] items-center justify-center px-4 text-center text-muted-foreground'>
								{t("empty")}
							</div>
						) : (
							visibleLogs.map((log) => {
								const isOpen = expanded === log.id;
								return (
									<div key={log.id} className='border-b border-border/40 last:border-b-0'>
										<button
											type='button'
											onClick={() => setExpanded(isOpen ? null : log.id)}
											className='flex w-full items-center gap-2 px-2 py-1 text-start hover:bg-muted/70'
										>
											<span className='text-muted-foreground shrink-0'>{log.time}</span>
											<span className={`rounded px-1 shrink-0 ${CATEGORY_COLORS[log.category]}`}>{log.name}</span>
											{MUST_RETURN_TRUE.has(log.name) && (
												<AlertTriangle className='size-3 shrink-0 text-amber-500' aria-label='returns true' />
											)}
											<span className='truncate text-muted-foreground'>
												{log.fields.length ? log.fields.map(([k, v]) => `${k}=${v}`).join("  ") : "—"}
											</span>
										</button>
										{isOpen && (
											<div className='space-y-0.5 bg-background/60 px-2 py-1.5'>
												{log.fields.length === 0 ? (
													<div className='text-muted-foreground'>{t("noPayload")}</div>
												) : (
													log.fields.map(([k, v]) => (
														<div key={k} className='flex gap-2'>
															<span className='shrink-0 text-muted-foreground'>{k}</span>
															<span className='break-all'>{v}</span>
														</div>
													))
												)}
												{MUST_RETURN_TRUE.has(log.name) && (
													<div className='mt-1 text-amber-600 dark:text-amber-400'>{t("returnTrueNote")}</div>
												)}
											</div>
										)}
									</div>
								);
							})
						)}
					</div>
				</div>
			</div>

			{/* Events the inspector deliberately does not attach */}
			<div className='rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 p-4'>
				<h4 className='mb-1 flex items-center gap-1.5 text-sm font-semibold text-amber-700 dark:text-amber-400'>
					<AlertTriangle className='size-4' />
					{t("notAttachedTitle")}
				</h4>
				<p className='text-xs text-muted-foreground'>
					{t("notAttachedDesc")}{" "}
					{[...NEVER_ATTACH].map((n) => (
						<code key={n} className='mx-0.5 rounded bg-muted px-1 font-mono text-[10px]'>
							{n}
						</code>
					))}
				</p>
			</div>
		</div>
	);
}
