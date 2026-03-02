"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Search, Link2, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import CodeBlock from "@/components/common/CodeBlock";
import { highlightInline } from "@/lib/highlightInline";
import type { TypeDefinition } from "../_lib/types";

type TypesContentProps = {
  title: string;
  description?: string;
  types: TypeDefinition[];
};

function TypeCard({ type }: { type: TypeDefinition }) {
  const t = useTranslations("DocsApi");
  const tc = useTranslations("Common");
  const [copied, setCopied] = useState(false);
  const typeId = `type-${type.name}`;

  const handlePermalink = () => {
    window.history.replaceState(null, "", `#${typeId}`);
    const url = `${window.location.origin}${window.location.pathname}#${typeId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const code =
    type.kind === "type"
      ? `type ${type.name} = ${type.definition}`
      : `interface ${type.name} {\n${type.definition}\n}`;

  return (
    <div
      id={typeId}
      className="group border rounded-lg overflow-hidden hover:border-primary/30 hover:shadow-sm transition-all scroll-mt-24"
    >
      <div className="flex items-center justify-between px-5 py-3 bg-muted/30 border-b">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-foreground font-mono">{type.name}</h3>
          <Badge
            variant="outline"
            className={
              type.kind === "type"
                ? "text-xs bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                : "text-xs bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
            }
          >
            {type.kind}
          </Badge>
        </div>
        <button
          onClick={handlePermalink}
          className="p-1.5 rounded-md hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          title={tc("copyPermalink")}
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-green-600" />
          ) : (
            <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
      <CodeBlock code={code} lang="typescript" />
      {type.memberDescriptions && Object.keys(type.memberDescriptions).length > 0 && (
        <div className="px-5 py-3 border-t bg-muted/10">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("members")}</span>
          <div className="mt-1.5 space-y-1">
            {Object.entries(type.memberDescriptions).map(([name, desc]) => (
              <div key={name} className="flex gap-2 pl-2">
                <code className="shrink-0 text-xs font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 px-1.5 py-0.5 rounded">
                  {name}
                </code>
                <span className="text-muted-foreground text-xs leading-relaxed">{highlightInline(desc.replace(/^-\s*/, ""))}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="px-5 py-2 border-t bg-muted/20">
        <span className="text-xs text-muted-foreground">
          {t("source")} <code className="bg-muted px-1.5 py-0.5 rounded">{type.source}</code>
        </span>
      </div>
    </div>
  );
}

export default function TypesContent({ title, description, types }: TypesContentProps) {
  const t = useTranslations("DocsApi");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTypes = types.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
          {description && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4 border-l-4 border-primary">
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          )}
          <Badge variant="secondary">{types.length} {t("types")}</Badge>
        </div>

        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("filterTypes")}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Types List */}
        <div className="space-y-4">
          {filteredTypes.map((type, idx) => (
            <TypeCard key={idx} type={type} />
          ))}
        </div>

        {filteredTypes.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <p>{t("noTypes")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
