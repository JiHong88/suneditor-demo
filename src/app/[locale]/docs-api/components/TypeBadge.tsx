import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TypeBadgeProps {
  type: string;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export function TypeBadge({ type, variant = "secondary", className }: TypeBadgeProps) {
  // Determine color based on type
  const getTypeColor = (t: string) => {
    if (t.includes("string")) return "text-green-600 dark:text-green-400";
    if (t.includes("number")) return "text-blue-600 dark:text-blue-400";
    if (t.includes("boolean")) return "text-purple-600 dark:text-purple-400";
    if (t.includes("function") || t.includes("=>")) return "text-orange-600 dark:text-orange-400";
    if (t.includes("Array") || t.includes("[]")) return "text-pink-600 dark:text-pink-400";
    if (t.includes("void")) return "text-gray-500 dark:text-gray-400";
    return "text-foreground";
  };

  return (
    <Badge variant={variant} className={cn("font-mono text-xs", getTypeColor(type), className)}>
      {type}
    </Badge>
  );
}
