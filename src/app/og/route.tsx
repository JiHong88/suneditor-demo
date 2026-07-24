import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SUNEDITOR_VERSION } from "@/store/version";

export const runtime = "nodejs";

// Official SunEditor logo, inlined as a data URI so Satori (next/og) can render it.
// Read once at module load rather than per-request.
const LOGO_DATA_URI = (() => {
	const svg = readFileSync(join(process.cwd(), "public", "se3_logo.svg"), "utf-8");
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
})();

// 1200×630 branded Open Graph card. Title/description are passed via query params,
// so every page gets a unique card without a static image per page.
export function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const title = (searchParams.get("title") ?? "SunEditor").slice(0, 90);
	const desc = (searchParams.get("desc") ?? "Lightweight WYSIWYG Editor").slice(0, 160);

	return new ImageResponse(
		(
			<div
				style={{
					width: "1200px",
					height: "630px",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					padding: "72px",
					background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
					color: "#f8fafc",
					fontFamily: "sans-serif",
				}}
			>
				{/* Brand row */}
				<div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={LOGO_DATA_URI} width={56} height={56} alt="SunEditor" />
					<div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px" }}>SunEditor</div>
				</div>

				{/* Title + description */}
				<div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
					<div style={{ fontSize: "76px", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-2px" }}>{title}</div>
					<div style={{ fontSize: "32px", color: "#94a3b8", lineHeight: 1.35, maxWidth: "980px" }}>{desc}</div>
				</div>

				{/* Footer row */}
				<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "26px", color: "#64748b" }}>
					<span>suneditor.com</span>
					<span>v{SUNEDITOR_VERSION}</span>
				</div>
			</div>
		),
		{ width: 1200, height: 630 },
	);
}
