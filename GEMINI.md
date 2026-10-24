# SunEditor Demo — Agent Guide (Gemini)

This repository is the **SunEditor demo site** (suneditor.com) — a Next.js app that consumes the published
`suneditor` npm package. It does **not** contain the editor source; do not apply the editor's core
development rules (kernel, store, keydown rules, plugin internals) here.

## Where SunEditor information comes from

Never copy the editor's docs into this repository — copies go stale on every release.

| Need | Source (always current) |
| --- | --- |
| API, options, plugin types of the installed version | `node_modules/suneditor/types/`, `node_modules/suneditor/src/` |
| What changed between versions | `node_modules/suneditor/release-note.md` first (installed version only); GitHub releases (`gh api repos/JiHong88/SunEditor/releases`) only for skipped intermediate versions |
| Editor guides (plugin guide, architecture, typedefs) | `../suneditor/` (local checkout) or GitHub raw `master` |
| Deep Dive pages (`/deep-dive/guide/*`) | Rendered at runtime from GitHub raw `master` via `GUIDE_FILES` in `src/lib/git/githubMarkdown.ts` |

`../suneditor/` may be ahead of the installed package. For API/option work use `node_modules/suneditor`;
for Deep Dive link checks use `../suneditor` (the site renders `master`).

## Demo Site Update Reference

When updating the demo site to reflect suneditor library changes (new features, option changes, plugin additions/removals, renames), refer to **[docs/DEMO-UPDATE-GUIDE.md](docs/DEMO-UPDATE-GUIDE.md)**.
This guide covers which files to modify, in what order, with examples for each scenario.
The `update-editor` skill runs the whole flow.

## Commands

- `npm run dev` — dev server
- `npm run check` — lint + type check
- `npm test` — vitest (integrity tests catch missing option/plugin wiring)
- `npm run docs:generate` — regenerate `src/data/api/` from the installed suneditor (never edit those files by hand)
