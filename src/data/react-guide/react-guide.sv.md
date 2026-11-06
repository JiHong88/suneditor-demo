<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Komponenten behöver även motorn [SunEditor](https://www.npmjs.com/package/suneditor) (peer-beroende, 3.4.1 eller senare)

```bash
npm install suneditor @suneditor/suneditor-react
```

## Usage

```tsx
import SunEditor from '@suneditor/suneditor-react';
import 'suneditor/css/editor';
import 'suneditor/css/contents';

export default function App() {
  return (
    <SunEditor
      options={(se) => ({
        plugins: [se.plugins.link, se.plugins.image, se.plugins.table],
        buttonList: [
          ['undo', 'redo'],
          ['bold', 'italic', 'underline'],
          ['table', 'link', 'image'],
        ],
        height: '400px',
      })}
    />
  );
}
```

`options` överlämnas till `suneditor.create()` i befintligt skick, så varje alternativ, plugin, knapp, händelse och språk är motorns egna.\
Denna README-fil täcker endast det som komponenten React lägger till; för själva alternativen, se paketet [SunEditor dokumentation](https://suneditor.com) eller [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` tar emot den långsamt laddade `suneditor`-modulen (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Föredra denna form i Next.js: statisk import av `suneditor` i en klientkomponent avbryter serverrenderingen eftersom motorn nuddar `window` vid importtillfället.\
Ett vanligt objekt fungerar även när du inte renderar på en server, eller för alternativ som inte behöver någon motorimport.\
Språkpaket är vanliga objekt och kan alltid importeras statiskt: `import ko from 'suneditor/langs/ko'`.

### Kontrollerat värde

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Om `value` ändras till något annat än det sista `onChange`-resultatet ersätts redigerarens innehåll.
Utelämna `value` för en okontrollerad editor och läs innehållet från instansen när du behöver det.

### Instansåtkomst

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` är objektet som returneras av `suneditor.create()`, så hela motorns API är tillgängligt.

### Events

Skicka hanterare genom `options.events`. De synkroniseras om vid varje rendering, så de kan säkert stängas över React-tillstånd.

```tsx
<SunEditor
	options={(se) => ({
		plugins: [se.plugins.image],
		events: {
			onSave: async () => { await save(html); return true; },
			onImageUploadBefore: ({ info, handler }) => { ... },
		},
	})}
/>
```

### Verktygsfält eller statusfält i ett annat element

Motoralternativ som tar ett DOM-element fungerar med refs eftersom funktionen `options` körs efter montering:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

En motorinstans (verktygsfält, plugin-program, händelser, tema) med flera redigerbara områden. Sätt en `<SunEditorRoot>` per område inuti `<SunEditorGroup>`; vilken annan JSX som helst kan placeras mellan dem. Gruppen renderar inget eget element.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` är motorn `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Varje rot har sina egna `value` / `onChange`, `readOnly`, `disabled` och ram `options` (`height`, `placeholder`, `iframe`, ...).
- Motorn behöver `toolbar_container` för den delade verktygsfältet om inte `mode` är `inline` eller `balloon`.
- Rötter samlas in när gruppen monteras. Motorn kan inte lägga till eller ta bort rötter senare, så ändra gruppens `key` för att återskapa den med andra rötter.

## Props

| Prop | Typ | Beskrivning |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-redigerare (kontrollerad). |
| `onChange` | `(html: string) => void` | Anropas vid varje innehållsändring. Förkortning för `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor alternativ](https://suneditor.com), skickas igenom oförändrad. `events` och `theme` tillämpas live. Allt annat tillämpas en gång vid skapandet. |
| `readOnly` | `boolean` | Växla skrivskyddat läge. |
| `disabled` | `boolean` | Inaktivera redigeraren. |
| `className`, `style` |  | Appliceras på omslaget `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Alla andra prop (`id`, `data-*`, `aria-*`, ...) appliceras på omslaget `<div>`. `children` ignoreras. |
| `ref` | `SunEditorInstance \| null` | Redigerarinstansen. |

Andra alternativ än `events` och `theme` tillämpas när redigeraren skapas.
För att ändra dem senare, montera om med en annan `key` eller anropa `ref.current.resetOptions()`.

## Types

```ts
import type {
  SunEditorProps,
  SunEditorGroupProps,
  SunEditorRootProps,
  SunEditorInstance,
  SunEditorOptions,
  SunEditorFrameOptions,
  SunEditorEvents,
} from '@suneditor/suneditor-react';
```

Alla motortyper finns också tillgängliga från `suneditor/types`.

## Next.js anteckningar

- Komponenten är en klientmodul (`"use client"` finns i byggutdata) och laddar motorn endast i webbläsaren, så den kan renderas direkt från en serverkomponent.
- Håll `suneditor` borta från statiska importer i klientkomponenter. Använd formen `options={(se) => ...}` för att nå `se.plugins`.
- CSS-importer (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) fungerar i både App Router och Pages Router.
