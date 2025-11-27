"use client";

import { Badge } from "@/components/ui/badge";
import { useState } from "react";

type TypeDefinition = {
  name: string;
  definition: string;
  kind: "type" | "interface";
  source: string;
};

type TypesContentProps = {
  title: string;
  description?: string;
  types: TypeDefinition[];
};

export default function TypesContent({ title, description, types }: TypesContentProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTypes = types.filter((type) =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 pb-6 border-b">
          <h1 className="text-3xl font-bold mb-3">{title}</h1>
          {description && (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4 border-l-4 border-primary">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-sm">
              {types.length} types
            </Badge>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search types..."
            className="w-full px-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Types List */}
        <div className="space-y-4">
          {filteredTypes.map((type, idx) => (
            <div
              key={idx}
              id={`type-${type.name}`}
              className="p-5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-foreground font-mono">{type.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {type.kind}
                </Badge>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
                <code>
                  {type.kind === "type" ? (
                    <>
                      <span className="text-purple-400">type</span>{" "}
                      <span className="text-blue-400">{type.name}</span>{" "}
                      <span className="text-muted-foreground">=</span>{" "}
                      <span className="text-orange-400">{type.definition}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-purple-400">interface</span>{" "}
                      <span className="text-blue-400">{type.name}</span> {"{"}
                      <div className="pl-4 whitespace-pre-wrap">{type.definition}</div>
                      {"}"}
                    </>
                  )}
                </code>
              </pre>
              <div className="mt-2 text-xs text-muted-foreground">
                Source: <code className="bg-muted px-1.5 py-0.5 rounded">{type.source}</code>
              </div>
            </div>
          ))}
        </div>

        {filteredTypes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No types found.
          </div>
        )}
      </div>
    </div>
  );
}
