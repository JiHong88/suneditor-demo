"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ApiItem, ApiItemData } from "./ApiItem";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ApiSectionData {
  title: string;
  description: string;
  items: ApiItemData[];
}

interface ApiSectionProps {
  section: ApiSectionData;
  sectionKey: string;
  searchQuery?: string;
}

export function ApiSection({ section, sectionKey, searchQuery }: ApiSectionProps) {
  // Filter items based on search query
  const filteredItems = searchQuery
    ? section.items.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.properties?.some((prop) =>
            prop.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    : section.items;

  if (filteredItems.length === 0 && searchQuery) {
    return null;
  }

  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{section.title}</CardTitle>
              <CardDescription className="mt-2">{section.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm">
              {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredItems.map((item, idx) => (
              <ApiItem key={`${sectionKey}-${item.name}-${idx}`} item={item} searchQuery={searchQuery} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
