"use client";

import { useCallback, useEffect, useRef, useState, type ComponentProps, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type LucideIcon = ComponentType<{ className?: string }>;

/* ── Hook ──────────────────────────────────────────────── */

/** Copies text to the clipboard and exposes a short-lived `copied` flag. */
export function useCopyToClipboard(duration = 1500) {
	const [copied, setCopied] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => () => {
		if (timer.current) clearTimeout(timer.current);
	}, []);

	const copy = useCallback(
		(text: string) => {
			void navigator.clipboard?.writeText(text).catch(() => {});
			setCopied(true);
			if (timer.current) clearTimeout(timer.current);
			timer.current = setTimeout(() => setCopied(false), duration);
		},
		[duration],
	);

	return { copied, copy };
}

/* ── Animated icon ─────────────────────────────────────── */

type CopyStatusIconProps = {
	copied: boolean;
	/** Idle icon. Defaults to the clipboard icon. */
	icon?: LucideIcon;
	/** Size/color classes for the icon box (e.g. `size-4`). */
	className?: string;
};

const spin = {
	initial: { rotate: -90, scale: 0.4, opacity: 0 },
	animate: { rotate: 0, scale: 1, opacity: 1 },
	exit: { rotate: 90, scale: 0.4, opacity: 0 },
	transition: { duration: 0.15, ease: "easeInOut" as const },
};

/** Idle icon that spins into a green check while `copied` is true. */
export function CopyStatusIcon({ copied, icon: Icon = Copy, className }: CopyStatusIconProps) {
	return (
		<span className={cn("relative inline-flex size-4 shrink-0 items-center justify-center", className)}>
			<AnimatePresence initial={false} mode='wait'>
				{copied ? (
					<motion.span key='check' className='inline-flex size-full' {...spin}>
						<Check className='size-full text-green-500' />
					</motion.span>
				) : (
					<motion.span key='idle' className='inline-flex size-full' {...spin}>
						<Icon className='size-full' />
					</motion.span>
				)}
			</AnimatePresence>
		</span>
	);
}

/* ── Toast ─────────────────────────────────────────────── */

function CopyToast({ show, message }: { show: boolean; message: string }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{show && (
				<motion.div
					role='status'
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: 8 }}
					className='fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg'
				>
					<Check className='size-4 text-green-400' />
					{message}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}

/* ── Button ────────────────────────────────────────────── */

type CopyButtonProps = Omit<ComponentProps<"button">, "onClick" | "title" | "children"> & {
	/** Text to copy, or a function resolved at click time (e.g. for `window.location`). */
	text: string | (() => string);
	/** Which idle icon to show. `copy` = clipboard, `link` = permalink. */
	kind?: "copy" | "link";
	/** Tooltip while idle. Defaults to the Common `copyCode` / `copyPermalink` label. */
	label?: string;
	/** Tooltip while copied. Defaults to the Common `copied` label. */
	copiedLabel?: string;
	/** Called after the text is copied (e.g. to update the URL hash). */
	onCopied?: () => void;
	/** How long the check icon stays, in ms. */
	duration?: number;
	/** Show a bottom-center toast while copied. */
	toast?: boolean;
	/** Classes for the icon box, e.g. `size-3.5`. */
	iconClassName?: string;
};

/**
 * Shared copy-to-clipboard button: the idle icon spins into a green check on click,
 * then returns after `duration`. Opt into a toast with `toast`.
 */
export default function CopyButton({
	text,
	kind = "copy",
	label,
	copiedLabel,
	onCopied,
	duration,
	toast = false,
	iconClassName,
	className,
	...rest
}: CopyButtonProps) {
	const tc = useTranslations("Common");
	const { copied, copy } = useCopyToClipboard(duration);

	const idleLabel = label ?? (kind === "link" ? tc("copyPermalink") : tc("copyCode"));
	const doneLabel = copiedLabel ?? tc("copied");
	const title = copied ? doneLabel : idleLabel;

	const handleClick = () => {
		copy(typeof text === "function" ? text() : text);
		onCopied?.();
	};

	return (
		<>
			<button
				type='button'
				onClick={handleClick}
				title={title}
				aria-label={idleLabel}
				className={cn(
					"inline-flex cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-muted active:scale-[0.97]",
					className,
				)}
				{...rest}
			>
				<CopyStatusIcon copied={copied} icon={kind === "link" ? Link2 : Copy} className={iconClassName} />
			</button>
			{toast && <CopyToast show={copied} message={tc("copiedToClipboard")} />}
		</>
	);
}
