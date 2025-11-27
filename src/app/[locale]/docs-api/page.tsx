"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ApiSidebar from "./components/ApiSidebar";
import ApiContent from "./components/ApiContent";
import TypesContent from "./components/TypesContent";
import apiDocsData from "@/data/api/api-docs.json";

type Method = {
  name: string;
  params: string;
  returns: string;
  description: string;
  example?: string;
};

type Subgroup = {
  title: string;
  description?: string;
  methods: Method[];
  type?: string;
};

type Group = {
  title: string;
  description: string;
  methods: Method[];
  subgroups?: { [key: string]: Subgroup };
};

type TypeDefinition = {
  name: string;
  definition: string;
  kind: "type" | "interface";
  source: string;
};

type TypesGroup = {
  title: string;
  description: string;
  items: TypeDefinition[];
};

type ApiDocs = {
  version: string;
  generatedAt: string;
  structure: {
    [key: string]: Group | TypesGroup;
  };
};

const apiDocs = apiDocsData as ApiDocs;

type SidebarItem = {
  id: string;
  title: string;
  count: number;
  type?: "group" | "subgroup";
  children?: SidebarItem[];
};

type ContentData = {
  title: string;
  description?: string;
  methods: Method[];
  prefix: string;
};

export default function DocsApiPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState("editor");

  // Build sidebar items from API docs structure
  const sidebarItems: SidebarItem[] = useMemo(() => {
    const items: SidebarItem[] = [];

    // Editor Instance
    if (apiDocs.structure.editor) {
      const editorChildren: SidebarItem[] = [];

      // Main editor methods
      if (apiDocs.structure.editor.methods.length > 0) {
        editorChildren.push({
          id: "editor",
          title: "Main Methods",
          count: apiDocs.structure.editor.methods.length,
          type: "subgroup",
        });
      }

      // Editor subgroups
      if (apiDocs.structure.editor.subgroups) {
        Object.entries(apiDocs.structure.editor.subgroups).forEach(([key, subgroup]) => {
          editorChildren.push({
            id: `editor.${key}`,
            title: subgroup.title,
            count: subgroup.methods.length,
            type: "subgroup",
          });
        });
      }

      items.push({
        id: "editor-group",
        title: "Editor Instance",
        count: editorChildren.reduce((sum, child) => sum + child.count, 0),
        type: "group",
        children: editorChildren,
      });
    }

    // Plugins
    if (apiDocs.structure.plugins?.subgroups) {
      const pluginChildren: SidebarItem[] = [];

      // Group plugins by type
      const pluginsByType: { [type: string]: Array<[string, Subgroup]> } = {};
      Object.entries(apiDocs.structure.plugins.subgroups).forEach(([key, plugin]) => {
        const type = plugin.type || "other";
        if (!pluginsByType[type]) pluginsByType[type] = [];
        pluginsByType[type].push([key, plugin]);
      });

      // Create sidebar items for each plugin type
      Object.entries(pluginsByType).forEach(([type, plugins]) => {
        const typeChildren: SidebarItem[] = plugins.map(([key, plugin]) => ({
          id: `plugins.${key}`,
          title: plugin.title,
          count: plugin.methods.length,
          type: "subgroup",
        }));

        const typeLabels: { [key: string]: string } = {
          command: "Command",
          dropdown: "Dropdown",
          modal: "Modal",
          browser: "Browser",
          field: "Field",
          input: "Input",
          popup: "Popup",
        };

        pluginChildren.push({
          id: `plugins-type-${type}`,
          title: typeLabels[type] || type,
          count: typeChildren.reduce((sum, child) => sum + child.count, 0),
          type: "group",
          children: typeChildren,
        });
      });

      items.push({
        id: "plugins-group",
        title: "Plugins",
        count: pluginChildren.reduce((sum, child) => sum + child.count, 0),
        type: "group",
        children: pluginChildren,
      });
    }

    // Modules
    if (apiDocs.structure.modules?.subgroups) {
      const moduleChildren: SidebarItem[] = Object.entries(
        apiDocs.structure.modules.subgroups
      ).map(([key, module]) => ({
        id: `modules.${key}`,
        title: module.title,
        count: module.methods.length,
        type: "subgroup",
      }));

      items.push({
        id: "modules-group",
        title: "Modules",
        count: moduleChildren.reduce((sum, child) => sum + child.count, 0),
        type: "group",
        children: moduleChildren,
      });
    }

    // Helpers
    if (apiDocs.structure.helpers?.subgroups) {
      const helperChildren: SidebarItem[] = Object.entries(
        apiDocs.structure.helpers.subgroups
      ).map(([key, helper]) => ({
        id: `helpers.${key}`,
        title: helper.title,
        count: helper.methods.length,
        type: "subgroup",
      }));

      items.push({
        id: "helpers-group",
        title: "Helper Utilities",
        count: helperChildren.reduce((sum, child) => sum + child.count, 0),
        type: "group",
        children: helperChildren,
      });
    }

    // Events
    if (apiDocs.structure.events) {
      items.push({
        id: "events",
        title: "Event Callbacks",
        count: apiDocs.structure.events.methods.length,
        type: "group",
      });
    }

    // Types
    if (apiDocs.structure.types && 'items' in apiDocs.structure.types) {
      items.push({
        id: "types",
        title: "Type Definitions",
        count: apiDocs.structure.types.items.length,
        type: "group",
      });
    }

    return items;
  }, []);

  // Get content data for selected item
  const contentData: ContentData | null = useMemo(() => {
    // Editor main methods
    if (selectedId === "editor") {
      return {
        title: "Editor Instance - Main Methods",
        description: apiDocs.structure.editor.description,
        methods: apiDocs.structure.editor.methods,
        prefix: "editor.",
      };
    }

    // Editor subgroups
    if (selectedId.startsWith("editor.")) {
      const key = selectedId.replace("editor.", "");
      const subgroup = apiDocs.structure.editor.subgroups?.[key];
      if (subgroup) {
        return {
          title: subgroup.title,
          description: subgroup.description,
          methods: subgroup.methods,
          prefix: `${subgroup.title}.`,
        };
      }
    }

    // Plugins
    if (selectedId.startsWith("plugins.")) {
      const key = selectedId.replace("plugins.", "");
      const plugin = apiDocs.structure.plugins?.subgroups?.[key];
      if (plugin) {
        return {
          title: plugin.title,
          description: `Plugin: ${plugin.title}`,
          methods: plugin.methods,
          prefix: `${key}.`,
        };
      }
    }

    // Modules
    if (selectedId.startsWith("modules.")) {
      const key = selectedId.replace("modules.", "");
      const module = apiDocs.structure.modules?.subgroups?.[key];
      if (module) {
        return {
          title: module.title,
          description: module.description,
          methods: module.methods,
          prefix: `${key}.`,
        };
      }
    }

    // Helpers
    if (selectedId.startsWith("helpers.")) {
      const key = selectedId.replace("helpers.", "");
      const helper = apiDocs.structure.helpers?.subgroups?.[key];
      if (helper) {
        return {
          title: helper.title,
          description: helper.description,
          methods: helper.methods,
          prefix: `helper.${key}.`,
        };
      }
    }

    // Events
    if (selectedId === "events") {
      return {
        title: apiDocs.structure.events.title,
        description: apiDocs.structure.events.description,
        methods: apiDocs.structure.events.methods,
        prefix: "options.events.",
      };
    }

    return null;
  }, [selectedId]);

  // Filter methods based on search query
  const filteredMethods = useMemo(() => {
    if (!contentData) return [];
    if (!searchQuery.trim()) return contentData.methods;

    return contentData.methods.filter(
      (m) =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contentData, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">v{apiDocs.version}</Badge>
                  <span className="text-xs text-muted-foreground">SunEditor API</span>
                </div>
                <h1 className="text-2xl font-bold">API Reference</h1>
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search methods..."
                className="w-full pl-9 pr-4 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-120px)]">
        <ApiSidebar
          items={sidebarItems}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
        {selectedId === "types" && apiDocs.structure.types && 'items' in apiDocs.structure.types ? (
          <TypesContent
            title={apiDocs.structure.types.title}
            description={apiDocs.structure.types.description}
            types={apiDocs.structure.types.items}
          />
        ) : contentData ? (
          <ApiContent
            title={contentData.title}
            description={contentData.description}
            methods={filteredMethods}
            prefix={contentData.prefix}
          />
        ) : null}
      </div>
    </div>
  );
}
