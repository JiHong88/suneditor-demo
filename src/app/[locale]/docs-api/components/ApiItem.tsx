"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TypeBadge } from "./TypeBadge";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface ApiItemData {
  name: string;
  kind: "function" | "interface" | "type" | "variable" | "method";
  description: string;
  tags?: Array<{
    title: string;
    description: string;
    type?: string | null;
    name?: string;
  }>;
  parameters?: Array<{
    name: string;
    type: string;
    optional: boolean;
    description?: string;
  }>;
  returnType?: string;
  properties?: Array<{
    name: string;
    type: string;
    optional: boolean;
    description: string;
    tags?: any[];
    parameters?: any[];
    returnType?: string;
  }>;
  type?: string;
}

interface ApiItemProps {
  item: ApiItemData;
  searchQuery?: string;
}

export function ApiItem({ item, searchQuery }: ApiItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const signature = generateSignature(item);
    navigator.clipboard.writeText(signature);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateSignature = (item: ApiItemData): string => {
    if (item.kind === "function" || item.kind === "method") {
      const params = item.parameters
        ?.map((p) => `${p.name}${p.optional ? "?" : ""}: ${p.type}`)
        .join(", ");
      return `${item.name}(${params || ""}): ${item.returnType || "void"}`;
    }
    if (item.kind === "variable") {
      return `${item.name}: ${item.type || "any"}`;
    }
    return item.name;
  };

  const kindColor = {
    function: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    method: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    interface: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    type: "bg-green-500/10 text-green-600 dark:text-green-400",
    variable: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  };

  // Highlight search query
  const highlightText = (text: string) => {
    if (!searchQuery || !text) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const hasDetails =
    item.parameters?.length ||
    item.properties?.length ||
    item.tags?.some((t) => t.title !== "description");

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow" id={`api-${item.name}`}>
      <CardHeader
        className="cursor-pointer"
        onClick={() => hasDetails && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={kindColor[item.kind]}>{item.kind}</Badge>
              <code className="text-lg font-semibold font-mono">
                {highlightText(item.name)}
              </code>
            </div>

            {/* Function/Method signature */}
            {(item.kind === "function" || item.kind === "method") && (
              <div className="font-mono text-sm text-muted-foreground mb-2 overflow-x-auto">
                <span className="text-primary">{item.name}</span>(
                {item.parameters?.map((param, idx) => (
                  <span key={idx}>
                    {idx > 0 && ", "}
                    <span className="text-foreground">{param.name}</span>
                    {param.optional && "?"}
                    {": "}
                    <TypeBadge type={param.type} variant="outline" />
                  </span>
                ))}
                ): <TypeBadge type={item.returnType || "void"} />
              </div>
            )}

            {/* Variable/Type signature */}
            {item.kind === "variable" && item.type && (
              <div className="font-mono text-sm text-muted-foreground mb-2">
                {item.name}: <TypeBadge type={item.type} />
              </div>
            )}

            {/* Description */}
            {item.description && (
              <p className="text-sm text-muted-foreground mt-2">
                {highlightText(item.description)}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            {hasDetails &&
              (isExpanded ? (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              ))}
          </div>
        </div>
      </CardHeader>

      {/* Expanded details */}
      {isExpanded && hasDetails && (
        <CardContent className="border-t pt-4">
          {/* Parameters */}
          {item.parameters && item.parameters.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Parameters</h4>
              <div className="space-y-2">
                {item.parameters.map((param, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-muted">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono font-semibold">
                        {param.name}
                      </code>
                      {param.optional && (
                        <Badge variant="outline" className="text-xs">
                          optional
                        </Badge>
                      )}
                      <TypeBadge type={param.type} variant="outline" />
                    </div>
                    {param.description && (
                      <p className="text-sm text-muted-foreground">
                        {param.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Properties (for interfaces/types) */}
          {item.properties && item.properties.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Properties</h4>
              <div className="space-y-3">
                {item.properties.map((prop, idx) => (
                  <div key={idx} className="pl-4 border-l-2 border-muted">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-mono font-semibold">
                        {prop.name}
                      </code>
                      {prop.optional && (
                        <Badge variant="outline" className="text-xs">
                          optional
                        </Badge>
                      )}
                      <TypeBadge type={prop.type} variant="outline" />
                    </div>
                    {prop.description && (
                      <p className="text-sm text-muted-foreground mb-1">
                        {prop.description}
                      </p>
                    )}
                    {/* Method details within properties */}
                    {prop.parameters && prop.parameters.length > 0 && (
                      <div className="mt-2 text-xs font-mono text-muted-foreground">
                        (
                        {prop.parameters.map((p: any, i: number) => (
                          <span key={i}>
                            {i > 0 && ", "}
                            {p.name}: {p.type}
                          </span>
                        ))}
                        ) → {prop.returnType}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Additional tags */}
          {item.tags && item.tags.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Additional Information</h4>
              <div className="space-y-2">
                {item.tags
                  .filter((tag) => tag.title !== "param" && tag.title !== "returns")
                  .map((tag, idx) => (
                    <div key={idx} className="text-sm">
                      <Badge variant="outline" className="mb-1">
                        {tag.title}
                      </Badge>
                      {tag.description && (
                        <p className="text-muted-foreground mt-1">{tag.description}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
