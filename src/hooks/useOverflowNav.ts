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
	const cachedWidths = useRef<number[]>([]);

	const [visibleCount, setVisibleCount] = useState(itemCount);

	const calculate = useCallback(() => {
		const container = containerEl.current;
		if (!container) return;

		const items = itemEls.current;
		const moreWidth = moreEl.current?.offsetWidth ?? 60;
		const gap = parseFloat(getComputedStyle(container).gap) || 0;

		// 보이는 아이템의 너비를 캐시 (숨겨진 아이템은 캐시값 유지)
		for (let i = 0; i < itemCount; i++) {
			const el = items[i];
			if (!el) continue;
			if (!el.classList.contains("invisible")) {
				cachedWidths.current[i] = el.offsetWidth;
			}
		}
		const widths = cachedWidths.current;

		// 부모에 max-w-fit이 있으면 컨테이너 폭이 콘텐츠에 묶이므로
		// 일시적으로 해제하여 실제 가용 폭을 측정
		const wrapper = container.parentElement;
		let removedMaxW = false;
		if (wrapper) {
			const cs = getComputedStyle(wrapper);
			if (cs.maxWidth !== "none" && cs.maxWidth !== "0px") {
				wrapper.style.setProperty("max-width", "none", "important");
				removedMaxW = true;
			}
		}

		const containerWidth = container.offsetWidth;

		if (removedMaxW && wrapper) {
			wrapper.style.removeProperty("max-width");
		}

		// 1차: 전부 들어가는지 확인
		let usedWidth = 0;
		let fitCount = 0;

		for (let i = 0; i < itemCount; i++) {
			const w = (widths[i] ?? 60) + (i > 0 ? gap : 0);
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
			const w = (widths[i] ?? 60) + (i > 0 ? gap : 0);
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

	// max-w-fit 부모 사용 시 컨테이너 폭이 고정될 수 있으므로 window resize로도 재계산
	useEffect(() => {
		const handler = () => calculate();
		window.addEventListener("resize", handler);
		return () => window.removeEventListener("resize", handler);
	}, [calculate]);

	// 언어 변경 등 콘텐츠 변경 시 캐시 초기화 후 재계산
	useEffect(() => {
		cachedWidths.current = [];
		setVisibleCount(itemCount);
		const id = requestAnimationFrame(calculate);
		return () => cancelAnimationFrame(id);
	}, [calculate, itemCount, recalcKey]);

	// cleanup
	useEffect(() => {
		return () => roRef.current?.disconnect();
	}, []);

	return { containerRef, moreRef, setItemRef, visibleCount };
}
