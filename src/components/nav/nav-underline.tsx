import { cn } from "@/lib/utils";

export function Underline({
	active,
	origin = "center", // "left" | "center"
	height = "2px",
	colorVar = "var(--color-se-active)",
	className,
}: {
	active?: boolean;
	origin?: "left" | "center";
	height?: string;
	colorVar?: string;
	className?: string;
}) {
	return (
		<span
			aria-hidden='true'
			className={cn(
				"pointer-events-none absolute inset-x-1 -bottom-1 block rounded-full transition-transform duration-300 will-change-transform",
				origin === "center" ? "origin-center" : "origin-left",
				active ? "scale-x-100" : "scale-x-0",
				className,
			)}
			style={{ height, background: `var(--_u, ${colorVar})` }}
		/>
	);
}
