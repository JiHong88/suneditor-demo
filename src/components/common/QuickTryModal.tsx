"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

import FileListPanel, { useFileList } from "@/components/editor/FileListPanel";

const SunEditorComponent = dynamic(() => import("@/components/editor/suneditor"), { ssr: false });

/** Buttons that indicate upload-related features */
const UPLOAD_BUTTONS = new Set(["image", "video", "audio", "fileUpload", "embed"]);

export type QuickTryEditorConfig = {
	/** Raw demo HTML for preview */
	demoHtml: string;
	/** Toolbar buttons shown in the editor */
	buttonList: (string | string[])[];
	/** Extra SunEditor options */
	editorOptions?: Record<string, unknown>;
};

type QuickTryModalProps = {
	open: boolean;
	onClose: () => void;
	label: string;
	desc: string;
	config: QuickTryEditorConfig;
	playgroundHref?: string;
	color?: string;
	icon?: React.ReactNode;
	badgeText?: string;
};

export default function QuickTryModal({
	open,
	onClose,
	label,
	desc,
	config,
	playgroundHref,
	color,
	icon,
	badgeText,
}: QuickTryModalProps) {
	const t = useTranslations("FeatureDemo");
	const backdropRef = useRef<HTMLDivElement>(null);
	const [editorKey, setEditorKey] = useState(0);
	const { files, handleFileManagerAction, clearFiles } = useFileList();

	// Determine if this config uses upload-related buttons
	const hasUploadButtons = config.buttonList.some((item) => {
		if (typeof item === "string") return UPLOAD_BUTTONS.has(item);
		if (Array.isArray(item)) return item.some((b) => UPLOAD_BUTTONS.has(b));
		return false;
	});

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		},
		[onClose],
	);

	useEffect(() => {
		if (open) {
			document.addEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "hidden";
			setEditorKey((k) => k + 1);
			clearFiles();
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, handleKeyDown]);

	if (!open) return null;

	const editorType = config.editorOptions?.type as string | undefined;
	const isDocument = editorType?.startsWith("document");

	const editorOptions = {
		buttonList: config.buttonList,
		height: isDocument ? "600" : "200",
		...(config.editorOptions || {}),
		...(hasUploadButtons && {
			events: {
				...(config.editorOptions?.events as Record<string, unknown> | undefined),
				onFileManagerAction: handleFileManagerAction,
			},
		}),
	};

	const mode = config.editorOptions?.mode as string | undefined;
	const needsTopPadding = mode === "inline";

	return (
		<div
			ref={backdropRef}
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
			onClick={(e) => {
				if (e.target === backdropRef.current) onClose();
			}}
		>
			<div className={`bg-card border rounded-xl shadow-2xl w-full flex flex-col animate-in fade-in zoom-in-95 duration-200 ${isDocument ? "max-w-5xl max-h-[92vh]" : "max-w-2xl max-h-[85vh]"}`}>
				{/* Header */}
				<div className='flex items-center gap-3 px-5 py-4 border-b shrink-0'>
					{icon && <span className={color}>{icon}</span>}
					<div className='flex-1 min-w-0'>
						<h3 className='font-semibold text-base truncate'>{label}</h3>
						<p className='text-xs text-muted-foreground truncate'>{desc}</p>
					</div>
					{badgeText && (
						<Badge variant='outline' className='text-[10px] shrink-0'>
							{badgeText}
						</Badge>
					)}
					<button onClick={onClose} className='p-1.5 rounded-md hover:bg-muted transition-colors shrink-0' aria-label='Close'>
						<X className='size-4' />
					</button>
				</div>

				{/* Live Editor */}
				<div className='flex-1 overflow-y-auto px-5 py-4' style={needsTopPadding ? { paddingTop: 50 } : undefined}>
					<SunEditorComponent
						key={editorKey}
						value={config.demoHtml}
						options={editorOptions}
					/>
				</div>

				{/* File List Panel — only for upload-related features */}
				{hasUploadButtons && files.length > 0 && (
					<div className='px-5 pb-2'>
						<FileListPanel files={files} />
					</div>
				)}

				{/* Footer actions */}
				<div className='flex items-center justify-between gap-3 px-5 py-3 border-t shrink-0'>
					<Button variant='ghost' size='sm' onClick={onClose}>
						{t("close")}
					</Button>
					{playgroundHref && (
						<Button asChild size='sm' className='group'>
							<Link href={playgroundHref} target='_blank'>
								{t("openInPlayground")}
								<ExternalLink className='ms-1.5 size-3.5 transition-transform group-hover:ltr:translate-x-0.5 group-hover:rtl:-translate-x-0.5' />
							</Link>
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
