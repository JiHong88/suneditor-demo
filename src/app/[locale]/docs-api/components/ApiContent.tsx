"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Method = {
  name: string;
  params: string;
  returns: string;
  description: string;
  example?: string;
};

type ApiContentProps = {
  title: string;
  description?: string;
  methods: Method[];
  prefix: string;
};

function MethodRow({ method, prefix }: { method: Method; prefix: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${prefix}${method.name}(${method.params})`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format description with line breaks and bullet points
  const formatDescription = (desc: string) => {
    if (!desc) return null;

    // Highlight quoted text
    const highlightQuotes = (text: string) => {
      const parts: React.ReactNode[] = [];
      const regex = /"([^"]+)"/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        // Add text before quote
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Add quoted text with highlight
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-mono">
            {match[1]}
          </code>
        );
        lastIndex = regex.lastIndex;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
    };

    // Split by " - " or " * " for bullet points
    const parts = desc.split(/\s+-\s+|\s+\*\s+/);

    if (parts.length > 1) {
      // Has bullet points
      return (
        <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
          {parts.map((part, idx) => {
            if (!part.trim()) return null;
            return (
              <div key={idx} className="flex gap-2">
                {idx > 0 && <span className="text-primary">•</span>}
                <span className={idx === 0 ? "" : "flex-1"}>{highlightQuotes(part.trim())}</span>
              </div>
            );
          })}
        </div>
      );
    }

    // No bullet points, just return normal text
    return (
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
        {highlightQuotes(desc)}
      </p>
    );
  };

  // Syntax highlight for TypeScript parameters
  const highlightParams = (params: string) => {
    if (!params) return <span className="text-muted-foreground">()</span>;

    // Clean up optional parameters: remove "| undefined" if parameter has "?"
    const cleanParams = params.replace(/\?\s*:\s*([^,]+?)\s*\|\s*undefined/g, (match, type) => {
      return `?: ${type.trim()}`;
    });

    // Split by comma at depth 0 to get individual parameters
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
    if (buffer.trim()) {
      parameters.push(buffer.trim());
    }

    // Check if we should use multiline format (complex parameters)
    const shouldUseMultiline = parameters.some(p =>
      p.includes("{") || p.includes("[") || p.length > 50
    ) || parameters.length > 2;

    if (!shouldUseMultiline) {
      // Simple inline format
      const parts: React.ReactNode[] = [];

      parameters.forEach((param, idx) => {
        if (idx > 0) {
          parts.push(<span key={`comma-${idx}`} className="text-muted-foreground">, </span>);
        }

        const colonIndex = param.indexOf(":");
        if (colonIndex > 0) {
          const paramName = param.substring(0, colonIndex).trim();
          const paramType = param.substring(colonIndex + 1).trim();

          parts.push(
            <span key={`param-${idx}`} className="text-blue-600 dark:text-blue-400">
              {paramName}
            </span>,
            <span key={`colon-${idx}`} className="text-muted-foreground">: </span>,
            <span key={`type-${idx}`} className="text-orange-600 dark:text-orange-400">
              {paramType}
            </span>
          );
        } else {
          parts.push(
            <span key={`param-${idx}`} className="text-blue-600 dark:text-blue-400">
              {param}
            </span>
          );
        }
      });

      return (
        <span className="text-muted-foreground">
          ({parts})
        </span>
      );
    }

    // Multiline format with proper indentation
    const formatParameter = (param: string, isLast: boolean) => {
      const colonIndex = param.indexOf(":");
      if (colonIndex <= 0) {
        return (
          <span className="text-blue-600 dark:text-blue-400">
            {param}
          </span>
        );
      }

      const paramName = param.substring(0, colonIndex).trim();
      const paramType = param.substring(colonIndex + 1).trim();

      // Format object type nicely
      if (paramType.startsWith("{") && paramType.endsWith("}")) {
        const objectContent = paramType.slice(1, -1).trim();
        const properties = [];
        let propBuffer = "";
        let propDepth = 0;

        for (let i = 0; i < objectContent.length; i++) {
          const char = objectContent[i];
          if (char === "<" || char === "{" || char === "[") propDepth++;
          if (char === ">" || char === "}" || char === "]") propDepth--;

          if (char === ";" && propDepth === 0) {
            if (propBuffer.trim()) properties.push(propBuffer.trim());
            propBuffer = "";
          } else {
            propBuffer += char;
          }
        }
        if (propBuffer.trim()) properties.push(propBuffer.trim());

        return (
          <>
            <span className="text-blue-600 dark:text-blue-400">{paramName}</span>
            <span className="text-muted-foreground">?: </span>
            <span className="text-muted-foreground">{"{"}</span>
            {properties.length > 0 && (
              <div className="pl-6">
                {properties.map((prop, i) => {
                  const propColonIdx = prop.indexOf(":");
                  if (propColonIdx > 0) {
                    const propName = prop.substring(0, propColonIdx).trim();
                    const propType = prop.substring(propColonIdx + 1).trim();
                    return (
                      <div key={i}>
                        <span className="text-blue-500 dark:text-blue-300">{propName}</span>
                        <span className="text-muted-foreground">: </span>
                        <span className="text-orange-600 dark:text-orange-400">{propType}</span>
                        <span className="text-muted-foreground">;</span>
                      </div>
                    );
                  }
                  return <div key={i}>{prop}</div>;
                })}
              </div>
            )}
            <span className="text-muted-foreground">{"}"}</span>
          </>
        );
      }

      // Simple parameter
      return (
        <>
          <span className="text-blue-600 dark:text-blue-400">{paramName}</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-orange-600 dark:text-orange-400">{paramType}</span>
        </>
      );
    };

    return (
      <div className="font-mono text-sm">
        <span className="text-muted-foreground">(</span>
        <div className="pl-4">
          {parameters.map((param, idx) => (
            <div key={idx}>
              {formatParameter(param, idx === parameters.length - 1)}
              {idx < parameters.length - 1 && <span className="text-muted-foreground">,</span>}
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">)</span>
      </div>
    );
  };

  // Syntax highlight for return type
  const highlightReturnType = (returnType: string) => {
    if (!returnType) return "void";

    return (
      <span className="text-purple-600 dark:text-purple-400">
        {returnType}
      </span>
    );
  };

  return (
    <div className="group/row py-4 px-5 hover:bg-muted/30 rounded-lg transition-colors border-l-2 border-transparent hover:border-primary/30">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <code className="text-base font-bold text-green-600 dark:text-green-400 font-mono">
              {method.name}
            </code>
            <button
              onClick={handleCopy}
              className="opacity-0 group-hover/row:opacity-100 hover:text-primary transition-opacity"
              title="Copy method signature"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="mb-3 bg-muted/50 px-3 py-2 rounded">
            {highlightParams(method.params)}
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-muted-foreground">Returns:</span>
            <code className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
              {highlightReturnType(method.returns)}
            </code>
          </div>
          {method.description && formatDescription(method.description)}

          {/* Example section */}
          {method.example && (
            <div className="mt-4 pt-4 border-t border-muted">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Example
                </span>
              </div>
              <pre className="bg-slate-900 dark:bg-slate-950 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
                <code>
                  {method.example.split('\n').map((line, idx) => {
                    const trimmedLine = line.trim();
                    const isComment = trimmedLine.startsWith('//');

                    if (isComment) {
                      return (
                        <div key={idx} className="text-slate-500 dark:text-slate-400">
                          {line}
                        </div>
                      );
                    }

                    // Syntax highlight for code lines
                    const highlightCodeLine = (codeLine: string) => {
                      // Handle strings
                      const parts: React.ReactNode[] = [];
                      let buffer = '';
                      let inString = false;
                      let stringChar = '';

                      for (let i = 0; i < codeLine.length; i++) {
                        const char = codeLine[i];

                        if ((char === '"' || char === "'" || char === '`') && !inString) {
                          if (buffer) {
                            parts.push(<span key={`code-${i}`} className="text-slate-100">{buffer}</span>);
                            buffer = '';
                          }
                          inString = true;
                          stringChar = char;
                          buffer = char;
                        } else if (char === stringChar && inString && codeLine[i - 1] !== '\\') {
                          buffer += char;
                          parts.push(<span key={`str-${i}`} className="text-green-400">{buffer}</span>);
                          buffer = '';
                          inString = false;
                          stringChar = '';
                        } else {
                          buffer += char;
                        }
                      }

                      if (buffer) {
                        if (inString) {
                          parts.push(<span className="text-green-400">{buffer}</span>);
                        } else {
                          // Highlight keywords
                          const highlighted = buffer
                            .split(/(\b(?:const|let|var|function|return|if|else|for|while|new|class|interface|type|import|export|from|default|async|await)\b)/g)
                            .map((part, i) => {
                              if (['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'new', 'class', 'interface', 'type', 'import', 'export', 'from', 'default', 'async', 'await'].includes(part)) {
                                return <span key={i} className="text-purple-400">{part}</span>;
                              }
                              return <span key={i} className="text-slate-100">{part}</span>;
                            });
                          parts.push(...highlighted);
                        }
                      }

                      return parts.length > 0 ? parts : <span className="text-slate-100">{codeLine}</span>;
                    };

                    return (
                      <div key={idx}>
                        {highlightCodeLine(line)}
                      </div>
                    );
                  })}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ApiContent({ title, description, methods, prefix }: ApiContentProps) {
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
              {methods.length} {methods.length === 1 ? 'method' : 'methods'}
            </Badge>
            <span className="text-xs text-muted-foreground">• Prefix: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{prefix}</code></span>
          </div>
        </div>

        {/* Methods */}
        <div className="space-y-2">
          {methods.map((method, idx) => (
            <MethodRow key={idx} method={method} prefix={prefix} />
          ))}
        </div>

        {methods.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No methods found.
          </div>
        )}
      </div>
    </div>
  );
}
