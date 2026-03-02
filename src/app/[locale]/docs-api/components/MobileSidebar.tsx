"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ApiSidebar from "./ApiSidebar";
import type { SidebarItem } from "../_lib/types";

type MobileSidebarProps = {
  items: SidebarItem[];
  selectedId: string;
  onSelect: (id: string) => void;
};

export default function MobileSidebar({ items, selectedId, onSelect }: MobileSidebarProps) {
  const t = useTranslations("DocsApi");
  const [open, setOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0 overflow-y-auto">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>
        <ApiSidebar items={items} selectedId={selectedId} onSelect={handleSelect} />
      </SheetContent>
    </Sheet>
  );
}
