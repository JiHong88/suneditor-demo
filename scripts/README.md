# API Documentation Generator

This directory contains the automated API documentation generation script for the SunEditor demo site.

## Overview

The `generate-api-docs.js` script automatically extracts TypeScript type definitions and JSDoc comments from the installed `suneditor` npm package and generates structured JSON documentation.

## Features

- **Automatic Parsing**: Uses TypeScript Compiler API to parse `.d.ts` files
- **JSDoc Support**: Extracts descriptions, parameter info, and return types from JSDoc comments
- **Structured Output**: Generates well-organized JSON with multiple sections:
  - Main API (create, init, factory methods)
  - Configuration Options (all editor options)
  - Editor Instance (editor methods and properties)
  - Events (all available events)
  - Plugins (plugin interfaces and options)

## Usage

### Manual Generation

```bash
npm run docs:generate
```

### Automatic Generation

The script runs automatically during the build process:

```bash
npm run build        # Runs prebuild hook, generates docs, then builds
npm run build:prod   # Same, but unlinks local suneditor first
```

## Output

The script generates a JSON file at:
```
src/data/api/api-docs.json
```

This file contains:
- `version`: SunEditor version
- `generatedAt`: ISO timestamp
- `sections`: Organized API documentation by category

## Integration

The generated documentation is consumed by the `/docs-api` page, which provides:
- Interactive API browser with tabs
- Real-time search across all APIs
- Type information with color-coded badges
- Expandable details for parameters and properties
- Copy-to-clipboard functionality

## Dependencies

- `typescript`: TypeScript Compiler API for parsing `.d.ts` files
- `doctrine`: JSDoc comment parser

## How It Works

1. **Discovery**: Scans `node_modules/suneditor/types/` for key `.d.ts` files
2. **Parsing**: Uses TypeScript AST to extract interfaces, types, functions, and variables
3. **Documentation**: Extracts JSDoc comments for descriptions and metadata
4. **Organization**: Groups APIs into logical sections
5. **Output**: Writes structured JSON to the data directory

## Maintenance

When SunEditor is updated:
1. Run `npm install suneditor@latest`
2. Run `npm run docs:generate`
3. The docs will automatically reflect the new version

## Example Output Structure

```json
{
  "version": "3.0.0",
  "generatedAt": "2025-10-16T07:19:31.097Z",
  "sections": {
    "main": {
      "title": "Main API",
      "description": "Core SunEditor API and factory methods",
      "items": [
        {
          "name": "create",
          "kind": "function",
          "description": "Creates a new instance of the SunEditor",
          "parameters": [...],
          "returnType": "Editor"
        }
      ]
    }
  }
}
```

## Future Enhancements

Potential improvements:
- Extract code examples from JSDoc `@example` tags
- Generate markdown documentation
- Add i18n support for descriptions
- Include version history/changelog
- Generate TypeScript declaration files for custom types
