"use client";

import { useCallback, useEffect, useState } from "react";

const HIGHLIGHT = ["ring-2", "ring-primary/60", "ring-offset-2", "ring-offset-background"];

/**
 * Scroll to `#id` once it exists (inactive tab content mounts a few frames after the tab switch),
 * then briefly ring it so the reader sees what the link pointed at.
 */
export function scrollToAnchor(id: string, { highlight = true }: { highlight?: boolean } = {}) {
	let frames = 0;
	const tick = () => {
		const el = document.getElementById(id);
		if (!el) {
			if (++frames < 120) requestAnimationFrame(tick);
			return;
		}
		el.scrollIntoView({ behavior: "smooth", block: highlight ? "center" : "start" });
		if (highlight) {
			el.classList.add(...HIGHLIGHT);
			setTimeout(() => el.classList.remove(...HIGHLIGHT), 2000);
		}
	};
	setTimeout(tick, 50);
}

/**
 * Tab state synced with the URL hash, so tabs and the items inside them can be linked (site search ⌘K, shared links).
 * - `#<tab>` selects the tab (and scrolls to `anchorId` when given)
 * - `#<item id>` selects the tab `tabOf(id)` returns, then scrolls to and highlights the item
 * Clicking a tab writes `#<tab>` with replaceState (no history entry).
 * `tabs` and `tabOf` must be stable (module-level).
 */
export function useHashTab<T extends string>(tabs: readonly T[], fallback: T, { tabOf, anchorId }: { tabOf?: (hash: string) => T | undefined; anchorId?: string } = {}) {
	const [tab, setTabState] = useState<T>(fallback);

	useEffect(() => {
		const sync = () => {
			const hash = decodeURIComponent(window.location.hash.slice(1));
			if (!hash) return;
			if ((tabs as readonly string[]).includes(hash)) {
				setTabState(hash as T);
				if (anchorId) scrollToAnchor(anchorId, { highlight: false });
				return;
			}
			const owner = tabOf?.(hash);
			if (owner) {
				setTabState(owner);
				scrollToAnchor(hash);
			}
		};
		sync();
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, [tabs, tabOf, anchorId]);

	const setTab = useCallback((next: string) => {
		setTabState(next as T);
		window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}#${next}`);
	}, []);

	return [tab, setTab] as const;
}
