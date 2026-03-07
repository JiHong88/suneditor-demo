"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import type { FeatureLink } from "../_lib/featurePlaygroundLinks";

const SunEditorComponent = dynamic(() => import("@/components/editor/suneditor"), { ssr: false });

type QuickTryModalProps = {
	open: boolean;
	onClose: () => void;
	featureLabel: string;
	featureDesc: string;
	featureLink: FeatureLink;
	playgroundHref: string;
	color: string;
	icon: React.ReactNode;
};

export default function QuickTryModal({
	open,
	onClose,
	featureLabel,
	featureDesc,
	featureLink,
	playgroundHref,
	color,
	icon,
}: QuickTryModalProps) {
	const t = useTranslations("FeatureDemo");
	const backdropRef = useRef<HTMLDivElement>(null);
	const [editorKey, setEditorKey] = useState(0);

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
		}
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.body.style.overflow = "";
		};
	}, [open, handleKeyDown]);

	if (!open) return null;

	const editorOptions = {
		buttonList: featureLink.buttonList,
		height: "200",
		...(featureLink.editorOptions || {}),
	};

	return (
		<div
			ref={backdropRef}
			className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'
			onClick={(e) => {
				if (e.target === backdropRef.current) onClose();
			}}
		>
			<div className='bg-card border rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200'>
				{/* Header */}
				<div className='flex items-center gap-3 px-5 py-4 border-b shrink-0'>
					<span className={color}>{icon}</span>
					<div className='flex-1 min-w-0'>
						<h3 className='font-semibold text-base truncate'>{featureLabel}</h3>
						<p className='text-xs text-muted-foreground truncate'>{featureDesc}</p>
					</div>
					<Badge variant='outline' className='text-[10px] shrink-0'>
						{t("quickTry")}
					</Badge>
					<button onClick={onClose} className='p-1.5 rounded-md hover:bg-muted transition-colors shrink-0' aria-label='Close'>
						<X className='size-4' />
					</button>
				</div>

				{/* Live Editor */}
				<div className='flex-1 overflow-y-auto px-5 py-4'>
					<SunEditorComponent
						key={editorKey}
						value={featureLink.demoHtml}
						options={editorOptions}
					/>
				</div>

				{/* Footer actions */}
				<div className='flex items-center justify-between gap-3 px-5 py-3 border-t shrink-0'>
					<Button variant='ghost' size='sm' onClick={onClose}>
						{t("close")}
					</Button>
					<Button asChild size='sm' className='group'>
						<Link href={playgroundHref} target='_blank'>
							{t("openInPlayground")}
							<ExternalLink className='ms-1.5 size-3.5 transition-transform group-hover:ltr:translate-x-0.5 group-hover:rtl:-translate-x-0.5' />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
