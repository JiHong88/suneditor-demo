import { cva } from "class-variance-authority";

export const navLink = cva("group/navlink relative block rounded-sm px-3 py-2 text-sm transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50", {
	variants: {
		active: { true: "text-foreground", false: "text-muted-foreground hover:text-foreground" },
		size: { sm: "px-2 py-1.5", md: "px-3 py-2" },
	},
	defaultVariants: { active: false, size: "md" },
});
