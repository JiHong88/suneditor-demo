"use client";

import { useState, useCallback, useRef } from "react";
import { ChevronDown, ChevronRight, Image, Video, Music, FileText, Trash2, MousePointerClick } from "lucide-react";
import { useTranslations } from "next-intl";

/** Mirrors SunEditor's FileManagementInfo with pluginName */
export interface FileEntry {
	src: string;
	index: number;
	name: string;
	size: number;
	pluginName: string;
	delete: () => void;
	select: () => void;
}

/** Hook return type */
export interface UseFileListReturn {
	files: FileEntry[];
	/** Pass this as onFileManagerAction event handler */
	handleFileManagerAction: (params: {
		info: { src: string; index: number; name: string; size: number; delete: () => void; select: () => void };
		state: "create" | "update" | "delete";
		pluginName: string;
	}) => void;
	/** Call when editor is remounted (key change) to prevent stale closures */
	clearFiles: () => void;
}

/** Manages file list state from SunEditor's onFileManagerAction events */
export function useFileList(): UseFileListReturn {
	const [files, setFiles] = useState<FileEntry[]>([]);
	const filesRef = useRef(files);
	filesRef.current = files;

	const handleFileManagerAction = useCallback(
		(params: {
			info: { src: string; index: number; name: string; size: number; delete: () => void; select: () => void };
			state: "create" | "update" | "delete";
			pluginName: string;
		}) => {
			const { info, state, pluginName } = params;
			const entry: FileEntry = {
				src: info.src,
				index: info.index,
				name: info.name,
				size: info.size,
				pluginName,
				delete: info.delete,
				select: info.select,
			};

			setFiles((prev) => {
				if (state === "create") {
					// Avoid duplicate by src
					if (prev.some((f) => f.src === entry.src && f.pluginName === entry.pluginName)) {
						return prev.map((f) => (f.src === entry.src && f.pluginName === entry.pluginName ? entry : f));
					}
					return [...prev, entry];
				}
				if (state === "update") {
					return prev.map((f) => (f.src === entry.src && f.pluginName === entry.pluginName ? entry : f));
				}
				if (state === "delete") {
					return prev.filter((f) => !(f.src === entry.src && f.pluginName === entry.pluginName));
				}
				return prev;
			});
		},
		[],
	);

	const clearFiles = useCallback(() => {
		setFiles([]);
	}, []);

	return { files, handleFileManagerAction, clearFiles };
}

/** Format bytes to human readable */
function formatSize(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${sizes[i]}`;
}

/** Icon by plugin name */
function PluginIcon({ pluginName }: { pluginName: string }) {
	switch (pluginName) {
		case "image":
			return <Image className='size-4 text-blue-500' />;
		case "video":
			return <Video className='size-4 text-purple-500' />;
		case "audio":
			return <Music className='size-4 text-green-500' />;
		default:
			return <FileText className='size-4 text-gray-500' />;
	}
}

/** Check if src looks like an uploaded image (not a URL insert) */
function isUploadedImage(src: string): boolean {
	return src.startsWith("/uploads/image/") && !src.includes("thumb_");
}

/** Get thumbnail URL from main image URL */
function getThumbUrl(src: string): string | null {
	if (!isUploadedImage(src)) return null;
	const lastSlash = src.lastIndexOf("/");
	return `${src.substring(0, lastSlash + 1)}thumb_${src.substring(lastSlash + 1)}`;
}

// Group label order
const GROUP_ORDER = ["image", "video", "audio", "file"];

interface FileListPanelProps {
	files: FileEntry[];
}

export default function FileListPanel({ files }: FileListPanelProps) {
	const t = useTranslations("FileListPanel");
	const [collapsed, setCollapsed] = useState(false);

	if (files.length === 0) {
		return (
			<div className='rounded-lg border bg-card/90 px-4 py-3'>
				<div className='flex items-center gap-2 text-sm text-muted-foreground'>
					<FileText className='size-4' />
					<span>{t("noFiles")}</span>
				</div>
			</div>
		);
	}

	// Group files by pluginName
	const groups = new Map<string, FileEntry[]>();
	for (const file of files) {
		const key = file.pluginName;
		if (!groups.has(key)) groups.set(key, []);
		groups.get(key)!.push(file);
	}

	// Sort groups by GROUP_ORDER
	const sortedGroups = [...groups.entries()].sort((a, b) => (GROUP_ORDER.indexOf(a[0]) ?? 99) - (GROUP_ORDER.indexOf(b[0]) ?? 99));

	return (
		<div className='rounded-lg border bg-card/90'>
			{/* Header with toggle */}
			<button
				type='button'
				onClick={() => setCollapsed((p) => !p)}
				className='flex w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold hover:bg-muted/50 transition-colors'
			>
				{collapsed ? <ChevronRight className='size-4' /> : <ChevronDown className='size-4' />}
				{t("uploadedFiles")}
				<span className='text-xs font-normal text-muted-foreground'>({files.length})</span>
			</button>

			{/* File list */}
			{!collapsed && (
				<div className='border-t px-4 py-2 space-y-2'>
					{sortedGroups.map(([pluginName, groupFiles]) => (
						<div key={pluginName}>
							<div className='text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5'>{pluginName}</div>
							<div className='flex flex-wrap gap-1.5'>
								{groupFiles.map((file) => (
									<FileItem key={`${file.pluginName}-${file.src}`} file={file} />
								))}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function FileItem({ file }: { file: FileEntry }) {
	const t = useTranslations("FileListPanel");
	const isImage = file.pluginName === "image";
	const thumbUrl = isImage ? getThumbUrl(file.src) : null;
	// Use the main src as fallback if no thumb
	const imgSrc = thumbUrl || (isImage ? file.src : null);

	return (
		<div className='inline-flex items-center gap-1.5 max-w-48 rounded-md border bg-muted/30 px-1.5 py-1 hover:bg-muted/60 group transition-colors'>
			{/* Thumbnail or icon */}
			{imgSrc ? (
				<img
					src={imgSrc}
					alt={file.name}
					className='size-5 shrink-0 rounded-sm object-cover'
					onError={(e) => {
						(e.target as HTMLImageElement).style.display = "none";
					}}
				/>
			) : (
				<PluginIcon pluginName={file.pluginName} />
			)}

			{/* Name */}
			<span className='text-[11px] truncate'>{file.name}</span>

			{/* Actions */}
			<span className='inline-flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
				<button type='button' onClick={() => file.select()} className='p-0.5 rounded hover:bg-background transition-colors' title={t("selectInEditor")}>
					<MousePointerClick className='size-3 text-blue-500' />
				</button>
				<button type='button' onClick={() => file.delete()} className='p-0.5 rounded hover:bg-background transition-colors' title={t("deleteFile")}>
					<Trash2 className='size-3 text-red-500' />
				</button>
			</span>
		</div>
	);
}
