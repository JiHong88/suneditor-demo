"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Priority+ navigation pattern:
 * Measures which nav items fit in the container and returns
 * the count of visible items. Overflow items go into a "More" menu.
 */
export function useOverflowNav(itemCount: number, recalcKey?: string) {
	const containerEl = useRef<HTMLElement | null>(null);
	const itemEls = useRef<(HTMLElement | null)[]>([]);
	const moreEl = useRef<HTMLElement | null>(null);
	const roRef = useRef<ResizeObserver | null>(null);

	const [visibleCount, setVisibleCount] = useState(itemCount);

	const calculate = useCallback(() => {
		const container = containerEl.current;
		if (!container) return;

		const items = itemEls.current;
		const containerWidth = container.offsetWidth;
		const moreWidth = moreEl.current?.offsetWidth ?? 60;
		const gap = parseFloat(getComputedStyle(container).gap) || 0;

		// 1차: 전부 들어가는지 확인
		let usedWidth = 0;
		let fitCount = 0;

		for (let i = 0; i < itemCount; i++) {
			const el = items[i];
			if (!el) continue;
			const w = el.offsetWidth + (i > 0 ? gap : 0);
			if (containerWidth - usedWidth - w >= 0) {
				usedWidth += w;
				fitCount++;
			} else {
				break;
			}
		}

		if (fitCount === itemCount) {
			setVisibleCount(itemCount);
			return;
		}

		// 2차: More 버튼 공간 확보 후 재계산
		usedWidth = 0;
		fitCount = 0;
		const budget = containerWidth - moreWidth - gap;

		for (let i = 0; i < itemCount; i++) {
			const el = items[i];
			if (!el) continue;
			const w = el.offsetWidth + (i > 0 ? gap : 0);
			if (usedWidth + w <= budget) {
				usedWidth += w;
				fitCount++;
			} else {
				break;
			}
		}

		setVisibleCount(Math.max(1, fitCount));
	}, [itemCount]);

	// callback refs
	const containerRef = useCallback(
		(node: HTMLElement | null) => {
			// 이전 관찰 해제
			if (roRef.current) {
				roRef.current.disconnect();
				roRef.current = null;
			}
			containerEl.current = node;
			if (node) {
				const ro = new ResizeObserver(calculate);
				ro.observe(node);
				roRef.current = ro;
				calculate();
			}
		},
		[calculate],
	);

	const setItemRef = useCallback(
		(index: number) => (el: HTMLElement | null) => {
			itemEls.current[index] = el;
		},
		[],
	);

	const moreRef = useCallback(
		(node: HTMLElement | null) => {
			moreEl.current = node;
		},
		[],
	);

	// 폰트 로딩 후 재계산
	useEffect(() => {
		document.fonts?.ready.then(calculate);
	}, [calculate]);

	// 언어 변경 등 콘텐츠 변경 시 재계산
	useEffect(() => {
		const id = requestAnimationFrame(calculate);
		return () => cancelAnimationFrame(id);
	}, [calculate, itemCount, recalcKey]);

	// cleanup
	useEffect(() => {
		return () => roRef.current?.disconnect();
	}, []);

	return { containerRef, moreRef, setItemRef, visibleCount };
}
