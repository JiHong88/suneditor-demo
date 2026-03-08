import apiDocsData from "@/data/api/api-docs.en.json";

export const SUNEDITOR_VERSION: string = apiDocsData.version || "latest";

export const CDN_BASE = `https://cdn.jsdelivr.net/npm/suneditor@${SUNEDITOR_VERSION}`;
export const CDN_CSS = `${CDN_BASE}/dist/suneditor.min.css`;
export const CDN_CONTENTS_CSS = `${CDN_BASE}/dist/suneditor-contents.min.css`;
export const CDN_JS = `${CDN_BASE}/dist/suneditor.min.js`;
