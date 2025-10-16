# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Next.js 15** demo/documentation site for **SunEditor**, a lightweight WYSIWYG editor. The project showcases SunEditor features, provides documentation, and includes an interactive playground using Sandpack.

## Key Technologies

- **Framework**: Next.js 15 (App Router) with React 19
- **Internationalization**: next-intl with locales: `en`, `ko`, `ar` (with RTL support)
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Editor**: SunEditor (local development may use `npm link suneditor`)
- **Code Playground**: Sandpack (React, Vanilla JS, Vue 3 templates)

## Development Commands

```bash
# Start development server (with Turbopack)
npm run dev

# Build for production (unlinks local suneditor first)
npm run build:prod

# Build (standard, for when using linked suneditor)
npm run build

# Start production server
npm start

# Lint the codebase
npm run lint

# Add shadcn/ui components
npx shadcn@latest add componentName
```

Development server runs on `http://localhost:3000`.

## Architecture

### Internationalization (i18n)

The site uses **next-intl** with a locale-based routing structure:

- **Routing**: `src/i18n/routing.ts` defines supported locales (`en`, `ko`, `ar`) with `localePrefix: "as-needed"`
- **Messages**: Translation files in `src/messages/[locale].json` with fallback to English
- **RTL Support**: `src/i18n/lang.ts` contains comprehensive RTL detection logic for Arabic and other RTL scripts
- **Request Config**: `src/i18n/request.ts` handles locale resolution and message loading with fallback merging
- **Country Detection**: `countryToLocale()` maps country codes to appropriate locales

### App Structure

```
src/app/[locale]/
├── HomePage.tsx              # Home page component
├── layout.tsx                # Root layout with nav, footer, theme script
├── page.tsx                  # Home route
├── _components/              # Home-specific components
├── getting-started/
├── feature-demo/
├── playground/
├── plugin-guide/
├── deep-dive/
└── docs-api/
```

All pages are under `[locale]` dynamic segment for i18n routing.

### Components Organization

- **`src/components/ui/`**: shadcn/ui components (button, card, tabs, etc.)
- **`src/components/layout/`**: Site-wide layout components (nav, footer, theme-toggle, lang-select)
- **`src/components/editor/`**: SunEditor wrapper component
- **`src/components/common/`**: Shared components like LiveEditor (Sandpack playground)
- **`src/components/nav/`**: Navigation-specific components

### SunEditor Integration

The editor is wrapped in a client component at `src/components/editor/suneditor.tsx`:

- Uses `"use client"` directive (Next.js)
- Dynamically imported with `ssr: false` to avoid SSR issues
- Accepts `value` and `options` props
- Handles cleanup with error suppression for cross-origin issues during destroy

### Live Playground (Sandpack)

`src/components/common/LiveEditor.tsx` provides an interactive code editor:

- Supports React, Vanilla JS, and Vue 3 templates
- Uses `@codesandbox/sandpack-react` with theme switching (githubLight, atomDark)
- Includes code editor, preview, and console panels
- Has "Copy All" functionality for bundling all files

### Theme System

- Theme initialized via inline script in `layout.tsx` to prevent flash
- Stored in localStorage with `"light"`, `"dark"`, or `"system"` values
- `suppressHydrationWarning` on `<html>` tag due to client-side theme class

### External Data Fetching

The `src/lib/` directory contains utilities for:

- **git/**: Fetching release version info (used in footer)
- **npm/**: NPM stats
- **cdn/**: CDN hit counts
- **siteMetrics.ts**: Aggregated metrics for homepage badges

## Important Notes

### Local Development with Linked SunEditor

The project may use `npm link suneditor` for local editor development. When building for production, use `npm run build:prod` which runs `npm unlink suneditor` first.

### TypeScript Configuration

- Path alias: `@/*` maps to `src/*`
- Strict mode enabled
- Target: ES2024

### ESLint Configuration

Custom rules disabled:
- `@typescript-eslint/no-explicit-any`: off
- `@next/next/no-html-link-for-pages`: off

### Styling Approach

- Uses Tailwind CSS 4 with `@tailwindcss/postcss`
- RTL support via `tailwindcss-rtl` package
- Dark mode: class-based (`.dark` class on `<html>`)
- Animations: `tw-animate-css` package

## Message Translation

When adding new UI text:

1. Add keys to `src/messages/en.json` first (primary language)
2. Add corresponding keys to `ko.json` and `ar.json`
3. Use nested structure: `Main.Common.ComponentName.key`
4. Access via `useTranslations()` hook from next-intl
5. Fallback logic merges English messages for missing translations

## Pages and Routes

All routes follow the pattern `[locale]/route-name`:

- `/` - Home with hero, feature grid, stats badges
- `/getting-started` - Installation guide
- `/feature-demo` - Feature showcase
- `/playground` - Interactive Sandpack editor
- `/plugin-guide` - Plugin documentation
- `/deep-dive` - In-depth technical content
- `/docs-api` - API documentation

## Git Workflow

Current branch: `main`

Recent work includes playground implementation, menu page creation, and homepage updates. The codebase is actively tracking changes to multiple layout components, i18n files, and the editor wrapper.
