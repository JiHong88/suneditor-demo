"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SidebarItem = {
  id: string;
  title: string;
  count: number;
  type?: "group" | "subgroup";
  children?: SidebarItem[];
};

type ApiSidebarProps = {
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

function SidebarItemComponent({
  item,
  selectedId,
  onSelect,
  depth = 0,
}: {
  item: SidebarItem;
  selectedId: string;
  onSelect: (id: string) => void;
  depth?: number;
}) {
  const hasChildren = item.children && item.children.length > 0;

  // Check if this item or any of its children is selected
  const isChildSelected = hasChildren && item.children.some(
    (child) => child.id === selectedId || child.children?.some((c) => c.id === selectedId)
  );

  const [isExpanded, setIsExpanded] = useState(isChildSelected || depth === 0);
  const isSelected = selectedId === item.id;

  const handleClick = () => {
    if (hasChildren) {
      // If it has children, toggle expansion
      setIsExpanded(!isExpanded);
    } else {
      // If it's a leaf node, select it
      onSelect(item.id);
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className={`
          w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors
          ${isSelected
            ? "bg-primary text-primary-foreground font-medium"
            : "hover:bg-muted/50"
          }
        `}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {hasChildren && (
            <button
              onClick={handleArrowClick}
              className="flex-shrink-0 hover:bg-muted/50 rounded p-0.5"
            >
              <ChevronRight
                className={`h-3.5 w-3.5 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </button>
          )}
          <span className="truncate">{item.title}</span>
        </div>
        <Badge
          variant={isSelected ? "secondary" : "outline"}
          className="ml-2 text-xs flex-shrink-0"
        >
          {item.count}
        </Badge>
      </button>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {item.children.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ApiSidebar({ items, selectedId, onSelect }: ApiSidebarProps) {
  return (
    <div className="w-64 border-r bg-background h-full overflow-y-auto sticky top-0">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">API Reference</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {items.reduce((sum, item) => sum + item.count, 0)} total methods
        </p>
      </div>
      <div className="p-2 space-y-1">
        {items.map((item) => (
          <SidebarItemComponent
            key={item.id}
            item={item}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
