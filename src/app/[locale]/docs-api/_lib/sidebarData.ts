import type { ApiDocs, SidebarItem, ContentData, Subgroup } from "./types";

const PLUGIN_TYPE_LABELS: Record<string, string> = {
  command: "Command",
  dropdown: "Dropdown",
  modal: "Modal",
  browser: "Browser",
  field: "Field",
  input: "Input",
  popup: "Popup",
};

/** Subgroups excluded entirely from the docs (not user-facing) */
const EXCLUDED_KEYS = new Set(["executor", "ports"]);
/** Internal subgroup shown under "Internals" with _ prefix */
const INTERNAL_KEY = "eventOrchestrator";
const STORE_KEY = "store";

export function buildSidebarItems(apiDocs: ApiDocs): SidebarItem[] {
  const items: SidebarItem[] = [];

  // ── 1. Event Callbacks ──
  if (apiDocs.structure.events) {
    items.push({
      id: "events",
      title: "Event Callbacks",
      count: apiDocs.structure.events.methods.length,
      type: "group",
    });
  }

  // ── 2. Editor Instance (Main Methods + Kernel($) info) ──
  if (apiDocs.structure.editor) {
    const editorCount = apiDocs.structure.editor.methods.length;
    items.push({
      id: "editor-group",
      title: "Editor Instance",
      count: editorCount,
      type: "group",
      children: [
        {
          id: "editor",
          title: "Main Methods",
          count: editorCount,
          type: "subgroup",
        },
        {
          id: "kernel-info",
          title: "Kernel ($) ↓",
          count: 0,
          type: "subgroup",
        },
      ],
    });
  }

  // ── 3. $ (Kernel subsystems — without store) ──
  // Layer ordering (matching Step3_KernelApi KERNEL_DEPS)
  if (apiDocs.structure.editor?.subgroups) {
    const LAYER_SECTIONS = [
      { id: "layer-l1", label: "Kernel (L1)", keys: ["facade"] },
      { id: "layer-l2", label: "Config (L2)", keys: ["contextProvider", "optionProvider", "instanceCheck", "eventManager"] },
      { id: "layer-l2-acc", label: "Accessors (L2)", keys: ["frameRoots", "context", "frameContext", "options", "frameOptions", "icons", "lang"] },
      { id: "layer-l3-dom", label: "DOM (L3)", keys: ["offset", "selection", "format", "inline", "listFormat", "html", "nodeTransform", "char"] },
      { id: "layer-l3-shell", label: "Shell (L3)", keys: ["component", "focusManager", "pluginManager", "ui", "commandDispatcher", "history", "shortcuts"] },
      { id: "layer-l3-panel", label: "Panel (L3)", keys: ["toolbar", "subToolbar", "menu", "viewer"] },
    ];

    const kernelChildren: SidebarItem[] = [];
    const usedKeys = new Set<string>();

    for (const section of LAYER_SECTIONS) {
      kernelChildren.push({ id: section.id, title: section.label, count: 0, type: "subgroup" });
      for (const key of section.keys) {
        const subgroup = apiDocs.structure.editor.subgroups[key];
        if (!subgroup) continue;
        usedKeys.add(key);
        kernelChildren.push({
          id: `editor.${key}`,
          title: key,
          count: subgroup.methods.length + (subgroup.getters?.length || 0),
          type: "subgroup",
        });
      }
    }

    // Remaining items not in any layer
    Object.entries(apiDocs.structure.editor.subgroups).forEach(([key, subgroup]) => {
      if (usedKeys.has(key) || key === STORE_KEY || key.startsWith("store.") || key === INTERNAL_KEY || EXCLUDED_KEYS.has(key)) return;
      kernelChildren.push({
        id: `editor.${key}`,
        title: key,
        count: subgroup.methods.length + (subgroup.getters?.length || 0),
        type: "subgroup",
      });
    });

    if (kernelChildren.length > 0) {
      const countableChildren = kernelChildren.filter(c => !c.id.startsWith("layer-"));
      items.push({
        id: "kernel-group",
        title: "$ (Kernel)",
        count: countableChildren.reduce((sum, child) => sum + child.count, 0),
        type: "group",
        children: kernelChildren,
      });
    }
  }

  // ── 3.5. $.store (separate group) ──
  if (apiDocs.structure.editor?.subgroups?.[STORE_KEY]) {
    const storeSg = apiDocs.structure.editor.subgroups[STORE_KEY];
    const storeChildren: SidebarItem[] = [
      {
        id: "editor.store",
        title: "Methods",
        count: storeSg.methods.length,
        type: "subgroup",
      },
    ];

    // StoreState properties (from store subgroup if available)
    if (apiDocs.structure.editor.subgroups["store.state"]) {
      const stateSg = apiDocs.structure.editor.subgroups["store.state"];
      storeChildren.push({
        id: "editor.store.state",
        title: "State",
        count: stateSg.methods.length,
        type: "subgroup",
      });
    }

    // StoreMode properties
    if (apiDocs.structure.editor.subgroups["store.mode"]) {
      const modeSg = apiDocs.structure.editor.subgroups["store.mode"];
      storeChildren.push({
        id: "editor.store.mode",
        title: "Mode",
        count: modeSg.methods.length,
        type: "subgroup",
      });
    }

    items.push({
      id: "store-group",
      title: "$.store",
      count: storeChildren.reduce((sum, child) => sum + child.count, 0),
      type: "group",
      children: storeChildren,
    });
  }

  // ── 4. $.plugins (Plugins + Hooks + Interfaces) ──
  if (apiDocs.structure.plugins?.subgroups) {
    const pluginChildren: SidebarItem[] = [];
    const pluginsByType: Record<string, Array<[string, Subgroup]>> = {};

    Object.entries(apiDocs.structure.plugins.subgroups).forEach(([key, plugin]) => {
      const type = plugin.type || "other";
      if (!pluginsByType[type]) pluginsByType[type] = [];
      pluginsByType[type].push([key, plugin]);
    });

    Object.entries(pluginsByType).forEach(([type, plugins]) => {
      const typeChildren: SidebarItem[] = plugins.map(([key, plugin]) => ({
        id: `plugins.${key}`,
        title: plugin.title,
        count: plugin.methods.length,
        type: "subgroup" as const,
      }));

      pluginChildren.push({
        id: `plugins-type-${type}`,
        title: PLUGIN_TYPE_LABELS[type] || type,
        count: typeChildren.reduce((sum, child) => sum + child.count, 0),
        type: "subgroup" as const,
        children: typeChildren,
      });
    });

    // Plugin Interfaces (nested under Plugins — above Hooks)
    if (apiDocs.structure.interfaces?.subgroups) {
      const ifaceChildren: SidebarItem[] = Object.entries(
        apiDocs.structure.interfaces.subgroups
      ).map(([key, iface]) => ({
        id: `interfaces.${key}`,
        title: iface.title,
        count: iface.methods.length,
        type: "subgroup" as const,
      }));

      pluginChildren.push({
        id: "interfaces-sub",
        title: "Plugin Interfaces",
        count: ifaceChildren.reduce((sum, child) => sum + child.count, 0),
        type: "subgroup" as const,
        variant: "typeish",
        children: ifaceChildren,
      });
    }

    // Plugin Hooks (nested under Plugins)
    if (apiDocs.structure.hooks?.subgroups) {
      const hookChildren: SidebarItem[] = Object.entries(
        apiDocs.structure.hooks.subgroups
      ).map(([key, hook]) => ({
        id: `hooks.${key}`,
        title: hook.title,
        count: hook.methods.length,
        type: "subgroup" as const,
      }));

      pluginChildren.push({
        id: "hooks-sub",
        title: "Plugin Hooks",
        count: hookChildren.reduce((sum, child) => sum + child.count, 0),
        type: "subgroup" as const,
        variant: "typeish",
        children: hookChildren,
      });
    }

    items.push({
      id: "plugins-group",
      title: "$.plugins",
      count: pluginChildren.reduce((sum, child) => sum + child.count, 0),
      type: "group",
      children: pluginChildren,
    });
  }

  // ── 4. Modules ──
  if (apiDocs.structure.modules?.subgroups) {
    const moduleChildren: SidebarItem[] = Object.entries(
      apiDocs.structure.modules.subgroups
    ).map(([key, mod]) => ({
      id: `modules.${key}`,
      title: mod.title,
      count: mod.methods.length,
      type: "subgroup" as const,
    }));

    items.push({
      id: "modules-group",
      title: "Modules",
      count: moduleChildren.reduce((sum, child) => sum + child.count, 0),
      type: "group",
      children: moduleChildren,
    });
  }

  // ── 5. Helper Utilities ──
  if (apiDocs.structure.helpers?.subgroups) {
    const helperChildren: SidebarItem[] = Object.entries(
      apiDocs.structure.helpers.subgroups
    ).map(([key, helper]) => ({
      id: `helpers.${key}`,
      title: helper.title,
      count: helper.methods.length,
      type: "subgroup" as const,
    }));

    items.push({
      id: "helpers-group",
      title: "Helper Utilities",
      count: helperChildren.reduce((sum, child) => sum + child.count, 0),
      type: "group",
      children: helperChildren,
    });
  }

  // ── separator ──
  items.push({ id: "sep", title: "", count: 0, type: "separator" });

  // ── 6. Internals (_eventOrchestrator only) ──
  if (apiDocs.structure.editor?.subgroups?.[INTERNAL_KEY]) {
    const sg = apiDocs.structure.editor.subgroups[INTERNAL_KEY];
    items.push({
      id: "internals-group",
      title: "Internals",
      count: sg.methods.length,
      type: "group",
      children: [{
        id: `editor.${INTERNAL_KEY}`,
        title: `_${INTERNAL_KEY}`,
        count: sg.methods.length,
        type: "subgroup",
      }],
    });
  }

  // ── 7. Type Definitions ──
  if (apiDocs.structure.types && "items" in apiDocs.structure.types) {
    items.push({
      id: "types",
      title: "Type Definitions",
      count: apiDocs.structure.types.items.length,
      type: "group",
    });
  }

  return items;
}

/** Map layer-* / kernel-info IDs → translation keys */
const LAYER_DESC_KEYS: Record<string, { titleLabel: string; tKey: string }> = {
  "kernel-info": { titleLabel: "Kernel ($)", tKey: "kernelInfoDesc" },
  "layer-l1": { titleLabel: "Kernel (L1)", tKey: "layerL1Desc" },
  "layer-l2": { titleLabel: "Config (L2)", tKey: "layerL2Desc" },
  "layer-l2-acc": { titleLabel: "Accessors (L2)", tKey: "layerL2AccDesc" },
  "layer-l3-dom": { titleLabel: "DOM (L3)", tKey: "layerL3DomDesc" },
  "layer-l3-shell": { titleLabel: "Shell (L3)", tKey: "layerL3ShellDesc" },
  "layer-l3-panel": { titleLabel: "Panel (L3)", tKey: "layerL3PanelDesc" },
};

export function resolveContentData(selectedId: string, apiDocs: ApiDocs, t?: (key: string) => string): ContentData | null {
  // Excluded keys — no content
  if (selectedId === "editor.executor" || selectedId === "editor.ports") {
    return null;
  }

  // Layer labels & kernel-info → show description
  const layerInfo = LAYER_DESC_KEYS[selectedId];
  if (layerInfo) {
    return {
      title: layerInfo.titleLabel,
      description: t?.(layerInfo.tKey) ?? "",
      methods: [],
      prefix: "$.",
    };
  }


  if (selectedId === "editor") {
    return {
      title: "Editor Instance - Main Methods",
      description: `${apiDocs.structure.editor.description}\n\n${t?.("editorInstanceDesc") ?? ""}`,
      methods: apiDocs.structure.editor.methods,
      prefix: "editor.",
    };
  }

  if (selectedId === "editor.store.state") {
    const subgroup = apiDocs.structure.editor.subgroups?.["store.state"];
    if (subgroup) {
      return {
        title: "$.store — State Properties",
        description: subgroup.description,
        methods: subgroup.methods,
        prefix: "$.store.get('",
      };
    }
  }

  if (selectedId === "editor.store.mode") {
    const subgroup = apiDocs.structure.editor.subgroups?.["store.mode"];
    if (subgroup) {
      return {
        title: "$.store.mode",
        description: subgroup.description,
        methods: subgroup.methods,
        prefix: "$.store.mode.",
      };
    }
  }

  if (selectedId.startsWith("editor.")) {
    const key = selectedId.replace("editor.", "");
    const subgroup = apiDocs.structure.editor.subgroups?.[key];
    if (subgroup) {
      const isInternal = key === INTERNAL_KEY;
      const displayKey = isInternal ? `_${key}` : key;
      const prefixBase = isInternal ? "kernel" : "$";
      return {
        title: `${prefixBase}.${displayKey}`,
        description: subgroup.description,
        methods: subgroup.methods,
        getters: subgroup.getters,
        prefix: `${prefixBase}.${displayKey}.`,
      };
    }
  }

  if (selectedId.startsWith("plugins.")) {
    const key = selectedId.replace("plugins.", "");
    const plugin = apiDocs.structure.plugins?.subgroups?.[key];
    if (plugin) {
      return {
        title: plugin.title,
        description: `Plugin: ${plugin.title}`,
        methods: plugin.methods,
        prefix: `$.plugins.${key}.`,
      };
    }
  }

  if (selectedId.startsWith("modules.")) {
    const key = selectedId.replace("modules.", "");
    const mod = apiDocs.structure.modules?.subgroups?.[key];
    if (mod) {
      return {
        title: mod.title,
        description: mod.description,
        methods: mod.methods,
        prefix: `${key}.`,
      };
    }
  }

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

  if (selectedId === "events") {
    return {
      title: apiDocs.structure.events.title,
      description: apiDocs.structure.events.description,
      methods: apiDocs.structure.events.methods,
      prefix: "editor.",
    };
  }

  if (selectedId.startsWith("hooks.")) {
    const key = selectedId.replace("hooks.", "");
    const hook = apiDocs.structure.hooks?.subgroups?.[key];
    if (hook) {
      return {
        title: hook.title,
        description: hook.description,
        methods: hook.methods,
        prefix: `${key}.`,
      };
    }
  }

  if (selectedId.startsWith("interfaces.")) {
    const key = selectedId.replace("interfaces.", "");
    const iface = apiDocs.structure.interfaces?.subgroups?.[key];
    if (iface) {
      return {
        title: iface.title,
        description: iface.description,
        methods: iface.methods,
        prefix: `interfaces.${key}.`,
      };
    }
  }

  return null;
}
