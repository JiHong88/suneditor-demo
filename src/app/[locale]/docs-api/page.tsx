"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { Search, X, Command } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import ApiSidebar from "./components/ApiSidebar";
import ApiContent from "./components/ApiContent";
import TypesContent from "./components/TypesContent";
import GlobalSearchResults from "./components/GlobalSearchResults";
import MobileSidebar from "./components/MobileSidebar";
import apiDocsData from "@/data/api/api-docs.json";
import type { ApiDocs } from "./_lib/types";
import { buildSidebarItems, resolveContentData } from "./_lib/sidebarData";
import { buildSearchIndex, searchApi } from "./_lib/apiSearchIndex";

const apiDocs = apiDocsData as unknown as ApiDocs;
const sidebarItems = buildSidebarItems(apiDocs);
const searchIndex = buildSearchIndex(apiDocs);

export default function DocsApiPage() {
  const t = useTranslations("DocsApi");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("editor");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // URL hash sync on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    // Find which section contains this item
    const item = searchIndex.find((i) => i.id === hash);
    if (item) {
      setSelectedId(item.sectionId);
      // Scroll to the element after render
      requestAnimationFrame(() => {
        setTimeout(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      });
    }
  }, []);

  // Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === "Escape" && searchQuery) {
        setSearchQuery("");
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [searchQuery]);

  // Search results
  const searchResults = useMemo(() => {
    return searchApi(searchQuery, searchIndex);
  }, [searchQuery]);

  // Content data for selected section
  const contentData = useMemo(() => {
    return resolveContentData(selectedId, apiDocs);
  }, [selectedId]);

  // Handle sidebar selection — scroll content to top, preserve sidebar scroll
  const handleSidebarSelect = useCallback((id: string) => {
    const scrollTop = sidebarRef.current?.scrollTop ?? 0;
    setSelectedId(id);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => {
      if (sidebarRef.current) {
        sidebarRef.current.scrollTop = scrollTop;
      }
    });
  }, []);

  // Handle search result selection
  const handleSearchSelect = useCallback((sectionId: string, itemId: string) => {
    setSelectedId(sectionId);
    setSearchQuery("");
    window.history.replaceState(null, "", `#${itemId}`);
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.getElementById(itemId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    });
  }, []);

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-4">
            {/* Mobile sidebar trigger */}
            <MobileSidebar
              items={sidebarItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />

            {/* Title */}
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg md:text-2xl font-bold">{t("title")}</h1>
                <Badge variant="secondary" className="text-[10px] md:text-xs">
                  v{apiDocs.version}
                </Badge>
              </div>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("searchPlaceholder")}
                className="w-full pl-9 pr-20 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden md:flex items-center gap-0.5 text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border">
                    <Command className="h-2.5 w-2.5" />K
                  </kbd>
                )}
              </div>
            </div>
          </div>

          {/* Search result count */}
          {isSearching && (
            <div className="mt-2 text-xs text-muted-foreground">
              {searchResults.length} {t("resultsFound")}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Desktop sidebar */}
        <div ref={sidebarRef} className="hidden md:block w-60 lg:w-64 shrink-0 border-r bg-background sticky top-[91px] self-start max-h-[calc(100vh-91px)] overflow-y-auto">
          <ApiSidebar
            items={sidebarItems}
            selectedId={selectedId}
            onSelect={handleSidebarSelect}
          />
        </div>

        {/* Content area */}
        {isSearching ? (
          <GlobalSearchResults
            results={searchResults}
            query={searchQuery}
            onSelect={handleSearchSelect}
          />
        ) : selectedId === "types" &&
          apiDocs.structure.types &&
          "items" in apiDocs.structure.types ? (
          <TypesContent
            title={apiDocs.structure.types.title}
            description={apiDocs.structure.types.description}
            types={apiDocs.structure.types.items}
          />
        ) : contentData ? (
          <ApiContent
            title={contentData.title}
            description={contentData.description}
            methods={contentData.methods}
            prefix={contentData.prefix}
          />
        ) : null}
      </div>
    </div>
  );
}
