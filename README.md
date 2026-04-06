# SunEditor Demo

The official demo site for [SunEditor](https://github.com/JiHong88/suneditor)

**Live:** [suneditor.com](https://suneditor.com)

## Contributing Translations

This site supports **25 languages**. Translation files are located in `src/messages/`.

UI translations are mostly stable and only change when new features are added, so **community contributions to improve translations are welcome!**

### How to contribute

1. Find your language file in `src/messages/{locale}.json` (e.g., `ja.json`, `fr.json`, `de.json`)
2. Edit the values (not the keys) to fix or improve translations
3. Use `src/messages/en.json` as the reference for the original English text
4. Submit a Pull Request

### Notes

- **Do NOT edit** files in `src/data/api/` — these are auto-generated from source code and will be overwritten.
- Only edit files in `src/messages/`. Each file is a flat JSON organized by page section (Common, Main, Home, FeatureDemo, etc.).
- If you're unsure about context, check the live site to see where the text appears.

### Supported languages

These languages are based on the language packs supported by [SunEditor langs](https://github.com/JiHong88/suneditor/tree/master/src/langs).

| Code | Language | Code | Language   | Code  | Language   |
| ---- | -------- | ---- | ---------- | ----- | ---------- |
| ar   | العربية  | hu   | Magyar     | pl    | Polski     |
| ckb  | کوردی    | it   | Italiano   | pt-BR | Português  |
| cs   | Čeština  | ja   | 日本語     | ro    | Română     |
| da   | Dansk    | km   | ខ្មែរ      | ru    | Русский    |
| de   | Deutsch  | ko   | 한국어     | sv    | Svenska    |
| en   | English  | lv   | Latviešu   | tr    | Türkçe     |
| es   | Español  | nl   | Nederlands | uk    | Українська |
| fa   | فارسی    | ur   | اردو       | zh-CN | 中文       |
| fr   | Français | he   | עברית      |       |            |

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### UI Components

```bash
npx shadcn@latest add componentName
```

## Tech Stack

- [Next.js](https://nextjs.org) with [next-intl](https://next-intl.dev) for i18n
- [shadcn/ui](https://ui.shadcn.com) components
- Deployed on [Vercel](https://vercel.com)
