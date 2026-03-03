"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { FileText, Hash, Braces, Eye } from "lucide-react";
import type { SearchableItem } from "../_lib/apiSearchIndex";

type GlobalSearchResultsProps = {
  results: SearchableItem[];
  query: string;
  onSelect: (sectionId: string, itemId: string) => void;
};

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !text) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-200 dark:bg-yellow-800/60 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  );
}

const kindIcons = {
  method: FileText,
  type: Braces,
  event: Hash,
  getter: Eye,
};

const kindColors = {
  method: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  type: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  event: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  getter: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800",
};

export default function GlobalSearchResults({ results, query, onSelect }: GlobalSearchResultsProps) {
  const t = useTranslations("DocsApi");
  const grouped = useMemo(() => {
    const map = new Map<string, SearchableItem[]>();
    for (const item of results) {
      const group = map.get(item.groupTitle) || [];
      group.push(item);
      map.set(item.groupTitle, group);
    }
    return map;
  }, [results]);

  if (results.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-3xl mx-auto p-8">
          <div className="text-center py-20">
            <div className="text-6xl mb-4 opacity-20">?</div>
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">{t("noResults")}</h2>
            <p className="text-sm text-muted-foreground">
              {t("noMatchesFor")} &quot;<span className="font-medium text-foreground">{query}</span>&quot;
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{results.length}</span> {t("resultsIn")}{" "}
            <span className="font-medium text-foreground">{grouped.size}</span> {t("sections")}
          </p>
        </div>

        <div className="space-y-8">
          {Array.from(grouped.entries()).map(([groupTitle, items]) => (
            <div key={groupTitle}>
              <div className="flex items-center gap-2 mb-3 pb-2 border-b">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {groupTitle}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {items.length}
                </Badge>
              </div>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = kindIcons[item.kind];
                  return (
                    <button
                      key={item.id}
                      onClick={() => onSelect(item.sectionId, item.id)}
                      className="w-full text-left px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors group flex items-start gap-3"
                    >
                      <div className={`mt-0.5 p-1.5 rounded-md border ${kindColors[item.kind]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <code className="text-sm font-bold font-mono text-foreground group-hover:text-primary transition-colors">
                            <HighlightMatch text={item.name} query={query} />
                          </code>
                          {item.returns && (
                            <span className="text-xs text-muted-foreground font-mono">
                              → {item.returns}
                            </span>
                          )}
                        </div>
                        {item.description && item.description !== "/" && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            <HighlightMatch text={item.description} query={query} />
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
