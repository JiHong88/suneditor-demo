"use client";

import { useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "@/components/common/CodeBlock";
import { highlightInline } from "@/lib/highlightInline";
import type { Method } from "../_lib/types";

type ApiContentProps = {
  title: string;
  description?: string;
  methods: Method[];
  prefix: string;
};

function MethodCard({ method, prefix }: { method: Method; prefix: string }) {
  const t = useTranslations("DocsApi");
  const tc = useTranslations("Common");
  const [copied, setCopied] = useState<"sig" | "link" | null>(null);

  const methodId = `${prefix}${method.name}`.replace(/\.$/, "");

  const handleCopy = (type: "sig" | "link") => {
    const text =
      type === "sig"
        ? `${prefix}${method.name}(${method.params})`
        : `${window.location.origin}${window.location.pathname}#${methodId}`;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handlePermalink = () => {
    window.history.replaceState(null, "", `#${methodId}`);
    handleCopy("link");
  };

  // Syntax highlight for TypeScript parameters
  const highlightParams = (params: string) => {
    if (!params) return <span className="text-muted-foreground">()</span>;

    const cleanParams = params.replace(/\?\s*:\s*([^,]+?)\s*\|\s*undefined/g, (_match, type) => {
      return `?: ${type.trim()}`;
    });

    const parameters: string[] = [];
    let buffer = "";
    let depth = 0;

    for (let i = 0; i < cleanParams.length; i++) {
      const char = cleanParams[i];
      if (char === "<" || char === "{" || char === "(") depth++;
      if (char === ">" || char === "}" || char === ")") depth--;
      if (char === "," && depth === 0) {
        parameters.push(buffer.trim());
        buffer = "";
      } else {
        buffer += char;
      }
    }
    if (buffer.trim()) parameters.push(buffer.trim());

    const shouldUseMultiline =
      parameters.some((p) => p.includes("{") || p.includes("[") || p.length > 50) ||
      parameters.length > 2;

    const renderParam = (param: string, idx: number, isLast: boolean) => {
      const colonIndex = param.indexOf(":");
      if (colonIndex <= 0) {
        return <span className="text-blue-600 dark:text-blue-400">{param}</span>;
      }

      const paramName = param.substring(0, colonIndex).trim();
      const paramType = param.substring(colonIndex + 1).trim();

      return (
        <span key={idx}>
          <span className="text-blue-600 dark:text-blue-400">{paramName}</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-orange-600 dark:text-orange-400">{paramType}</span>
          {!isLast && <span className="text-muted-foreground">, </span>}
        </span>
      );
    };

    if (!shouldUseMultiline) {
      return (
        <span className="text-muted-foreground">
          ({parameters.map((p, i) => renderParam(p, i, i === parameters.length - 1))})
        </span>
      );
    }

    return (
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">(</span>
        <div className="pl-4">
          {parameters.map((param, idx) => (
            <div key={idx}>
              {renderParam(param, idx, idx === parameters.length - 1)}
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">)</span>
      </div>
    );
  };

  // Format description
  const formatDescription = (desc: string) => {
    if (!desc || desc === "/") return null;

    const parts = desc.split(/\s+-\s+|\s+\*\s+/);

    if (parts.length > 1) {
      return (
        <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
          {parts.map((part, idx) => {
            if (!part.trim()) return null;
            return (
              <div key={idx} className="flex gap-2">
                {idx > 0 && <span className="text-primary mt-0.5">&#x2022;</span>}
                <span className={idx === 0 ? "" : "flex-1"}>{highlightInline(part.trim())}</span>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <p className="text-sm text-muted-foreground leading-relaxed">{highlightInline(desc)}</p>
    );
  };

  return (
    <div
      id={methodId}
      className="group/row border rounded-lg p-5 hover:border-primary/30 hover:shadow-sm transition-all scroll-mt-24"
    >
      {/* Method name + actions */}
      <div className="flex items-center justify-between mb-3">
        <code className="text-base font-bold text-green-600 dark:text-green-400 font-mono">
          {method.name}
        </code>
        <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
          <button
            onClick={handlePermalink}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title={tc("copyPermalink")}
          >
            {copied === "link" ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => handleCopy("sig")}
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            title={tc("copySignature")}
          >
            {copied === "sig" ? (
              <Check className="h-3.5 w-3.5 text-green-600" />
            ) : (
              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Parameters */}
      {method.params && (
        <div className="mb-3 bg-muted/40 px-3 py-2 rounded-md font-mono text-sm">
          {highlightParams(method.params)}
        </div>
      )}

      {/* Param descriptions */}
      {method.paramDescriptions && Object.keys(method.paramDescriptions).length > 0 && (
        <div className="mb-3 text-sm">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{t("parameters")}</span>
          <div className="mt-1.5 space-y-1">
            {Object.entries(method.paramDescriptions).map(([name, desc]) => (
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

      {/* Returns */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide shrink-0 mt-0.5">{t("returns")}</span>
        <div>
          <code className="text-sm font-mono px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800">
            {method.returns || "void"}
          </code>
          {method.returnsDescription && (
            <p className="text-xs text-muted-foreground mt-1">{highlightInline(method.returnsDescription.replace(/^-\s*/, ""))}</p>
          )}
        </div>
      </div>

      {/* Description */}
      {method.description && method.description !== "/"
        ? formatDescription(method.description)
        : (
          <p className="text-sm text-muted-foreground/50 italic">{t("noDescription")}</p>
        )}

      {/* Example */}
      {method.example && method.example.trim() && (
        <div className="mt-4 pt-4 border-t">
          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
            {t("example")}
          </span>
          <div className="mt-2 rounded-lg overflow-hidden border text-xs [&_pre]:!p-3">
            <CodeBlock code={method.example} lang="typescript" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ApiContent({ title, description, methods, prefix }: ApiContentProps) {
  const t = useTranslations("DocsApi");
  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b">
          <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>
          {description && (
            <div className="bg-muted/50 rounded-lg p-4 mb-4 border-l-4 border-primary space-y-2">
              {description.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm text-muted-foreground leading-relaxed">{highlightInline(para)}</p>
              ))}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {methods.length} {methods.length === 1 ? t("method") : t("methods")}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {t("prefix")} <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{prefix}</code>
            </span>
          </div>
        </div>

        {/* Methods */}
        <div className="space-y-3">
          {methods.map((method, idx) => (
            <MethodCard key={idx} method={method} prefix={prefix} />
          ))}
        </div>

        {methods.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-4xl mb-3 opacity-20">{ }</div>
            <p>{t("noMethods")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
