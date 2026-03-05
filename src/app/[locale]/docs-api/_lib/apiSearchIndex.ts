import type { ApiDocs, Subgroup } from "./types";

export type SearchableItem = {
  id: string;
  sectionId: string;
  name: string;
  kind: "method" | "type" | "event" | "getter";
  params?: string;
  returns?: string;
  description: string;
  groupTitle: string;
  prefix: string;
};

export function buildSearchIndex(apiDocs: ApiDocs): SearchableItem[] {
  const items: SearchableItem[] = [];

  // Editor main methods
  if (apiDocs.structure.editor) {
    for (const m of apiDocs.structure.editor.methods) {
      items.push({
        id: `editor.${m.name}`,
        sectionId: "editor",
        name: m.name,
        kind: "method",
        params: m.params,
        returns: m.returns,
        description: m.description,
        groupTitle: "Editor Instance",
        prefix: "editor.",
      });
    }

    // Editor subgroups
    if (apiDocs.structure.editor.subgroups) {
      const excludedKeys = new Set(["executor", "ports"]);
      for (const [key, subgroup] of Object.entries(apiDocs.structure.editor.subgroups) as [string, Subgroup][]) {
        if (excludedKeys.has(key)) continue;

        // Store state properties
        if (key === "store.state") {
          for (const m of subgroup.methods) {
            items.push({
              id: `editor.store.state.${m.name}`,
              sectionId: "editor.store.state",
              name: m.name,
              kind: "method",
              params: m.params,
              returns: m.returns,
              description: m.description,
              groupTitle: "$.store > State",
              prefix: "$.store.get('",
            });
          }
          continue;
        }

        // Store mode properties
        if (key === "store.mode") {
          for (const m of subgroup.methods) {
            items.push({
              id: `editor.store.mode.${m.name}`,
              sectionId: "editor.store.mode",
              name: m.name,
              kind: "method",
              params: m.params,
              returns: m.returns,
              description: m.description,
              groupTitle: "$.store > Mode",
              prefix: "$.store.mode.",
            });
          }
          continue;
        }

        const isInternal = key === "eventOrchestrator";
        const displayKey = isInternal ? `_${key}` : key;
        const prefixBase = isInternal ? "core" : "$";
        for (const m of subgroup.methods) {
          items.push({
            id: `editor.${key}.${m.name}`,
            sectionId: `editor.${key}`,
            name: m.name,
            kind: "method",
            params: m.params,
            returns: m.returns,
            description: m.description,
            groupTitle: `${isInternal ? "Internals" : "Editor"} > ${displayKey}`,
            prefix: `${prefixBase}.${displayKey}.`,
          });
        }

        // Getters
        if (subgroup.getters) {
          for (const g of subgroup.getters) {
            items.push({
              id: `${prefixBase}.${displayKey}.${g.name}`,
              sectionId: `editor.${key}`,
              name: g.name,
              kind: "getter",
              returns: g.returns,
              description: g.description,
              groupTitle: `${isInternal ? "Internals" : "Editor"} > ${displayKey}`,
              prefix: `${prefixBase}.${displayKey}.`,
            });
          }
        }
      }
    }
  }

  // Plugins
  if (apiDocs.structure.plugins?.subgroups) {
    for (const [key, plugin] of Object.entries(apiDocs.structure.plugins.subgroups) as [string, Subgroup][]) {
      for (const m of plugin.methods) {
        items.push({
          id: `plugins.${key}.${m.name}`,
          sectionId: `plugins.${key}`,
          name: m.name,
          kind: "method",
          params: m.params,
          returns: m.returns,
          description: m.description,
          groupTitle: `Plugins > ${plugin.title}`,
          prefix: `$.plugins.${key}.`,
        });
      }
    }
  }

  // Modules
  if (apiDocs.structure.modules?.subgroups) {
    for (const [key, mod] of Object.entries(apiDocs.structure.modules.subgroups) as [string, Subgroup][]) {
      for (const m of mod.methods) {
        items.push({
          id: `modules.${key}.${m.name}`,
          sectionId: `modules.${key}`,
          name: m.name,
          kind: "method",
          params: m.params,
          returns: m.returns,
          description: m.description,
          groupTitle: `Modules > ${mod.title}`,
          prefix: `${key}.`,
        });
      }
    }
  }

  // Helpers
  if (apiDocs.structure.helpers?.subgroups) {
    for (const [key, helper] of Object.entries(apiDocs.structure.helpers.subgroups) as [string, Subgroup][]) {
      for (const m of helper.methods) {
        items.push({
          id: `helpers.${key}.${m.name}`,
          sectionId: `helpers.${key}`,
          name: m.name,
          kind: "method",
          params: m.params,
          returns: m.returns,
          description: m.description,
          groupTitle: `Helpers > ${helper.title}`,
          prefix: `helper.${key}.`,
        });
      }
    }
  }

  // Events
  if (apiDocs.structure.events) {
    for (const m of apiDocs.structure.events.methods) {
      items.push({
        id: `events.${m.name}`,
        sectionId: "events",
        name: m.name,
        kind: "event",
        params: m.params,
        returns: m.returns,
        description: m.description,
        groupTitle: "Event Callbacks",
        prefix: "editor.",
      });
    }
  }

  // Hooks
  if (apiDocs.structure.hooks?.subgroups) {
    for (const [key, hook] of Object.entries(apiDocs.structure.hooks.subgroups) as [string, Subgroup][]) {
      for (const m of hook.methods) {
        items.push({
          id: `hooks.${key}.${m.name}`,
          sectionId: `hooks.${key}`,
          name: m.name,
          kind: "method",
          params: m.params,
          returns: m.returns,
          description: m.description,
          groupTitle: `Hooks > ${hook.title}`,
          prefix: `${key}.`,
        });
      }
    }
  }

  // Interfaces
  if (apiDocs.structure.interfaces?.subgroups) {
    for (const [key, iface] of Object.entries(apiDocs.structure.interfaces.subgroups) as [string, Subgroup][]) {
      for (const m of iface.methods) {
        items.push({
          id: `interfaces.${key}.${m.name}`,
          sectionId: `interfaces.${key}`,
          name: m.name,
          kind: "method",
          params: m.params,
          returns: m.returns,
          description: m.description,
          groupTitle: `Interfaces > ${iface.title}`,
          prefix: `interfaces.${key}.`,
        });
      }
    }
  }

  // Types
  if (apiDocs.structure.types && "items" in apiDocs.structure.types) {
    for (const t of apiDocs.structure.types.items) {
      items.push({
        id: `type-${t.name}`,
        sectionId: "types",
        name: t.name,
        kind: "type",
        description: t.definition,
        groupTitle: "Type Definitions",
        prefix: "",
      });
    }
  }

  return items;
}

export function searchApi(query: string, items: SearchableItem[]): SearchableItem[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase();

  type Scored = { item: SearchableItem; score: number };
  const scored: Scored[] = [];

  for (const item of items) {
    const nameLower = item.name.toLowerCase();
    let score = 0;

    // Exact name match
    if (nameLower === q) {
      score = 100;
    }
    // Name starts with query
    else if (nameLower.startsWith(q)) {
      score = 80;
    }
    // Name contains query
    else if (nameLower.includes(q)) {
      score = 60;
    }
    // Description contains query
    else if (item.description.toLowerCase().includes(q)) {
      score = 30;
    }
    // Params contains query
    else if (item.params?.toLowerCase().includes(q)) {
      score = 20;
    }
    // Group title contains query
    else if (item.groupTitle.toLowerCase().includes(q)) {
      score = 10;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.map((s) => s.item);
}
