"use client";

import { useEffect, useRef, useState } from "react";
import { ADSENSE_CLIENT_ID } from "@/data/adConfig";

interface GoogleAdProps {
	adSlot: string;
	className?: string;
}

declare global {
	interface Window {
		adsbygoogle?: unknown[];
	}
}

export default function GoogleAd({ adSlot, className }: GoogleAdProps) {
	const adRef = useRef<HTMLModElement>(null);
	const pushed = useRef(false);
	const [isLocal, setIsLocal] = useState(false);

	useEffect(() => {
		const local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
		setIsLocal(local);

		if (!ADSENSE_CLIENT_ID || pushed.current || local) return;
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
			pushed.current = true;
		} catch {
			// AdSense not loaded
		}
	}, []);

	if (!ADSENSE_CLIENT_ID || isLocal) return null;

	return (
		<ins
			ref={adRef}
			className={`adsbygoogle ${className ?? ""}`}
			style={{ display: "block" }}
			data-ad-client={ADSENSE_CLIENT_ID}
			data-ad-slot={adSlot}
			data-ad-format='auto'
			data-full-width-responsive='true'
		/>
	);
}
