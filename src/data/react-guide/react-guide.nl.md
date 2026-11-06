<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

De component heeft ook de [SunEditor](https://www.npmjs.com/package/suneditor)-engine nodig (peer dependency, 3.4.1 of later).

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

`options` wordt ongewijzigd aan `suneditor.create()` doorgegeven, waardoor elke optie, plug-in, knop, gebeurtenis en taal eigendom is van de engine zelf.\
Deze README beschrijft alleen wat het React-component toevoegt; voor de opties zelf, zie het [SunEditor documentatie](https://suneditor.com)- of het [`suneditor`](https://www.npmjs.com/package/suneditor)-pakket.

`options` ontvangt de lui geladen module `suneditor` (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Geef de voorkeur aan deze vorm in Next.js: het statisch importeren van `suneditor` in een clientcomponent verstoort de serverrendering omdat de engine `window` aanraakt tijdens het importeren.\
Een eenvoudig object werkt ook prima als je geen server-side rendering gebruikt, of voor opties die geen engine-import vereisen.\
Taalpakketten zijn gewone objecten en kunnen altijd statisch worden geïmporteerd: `import ko from 'suneditor/langs/ko'`.

### Gecontroleerde waarde

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Als je `value` verandert in iets anders dan het laatste `onChange`-resultaat, wordt de editorinhoud vervangen.
Laat `value` weg voor een niet-gecontroleerde editor en lees de inhoud van de instantie wanneer je die nodig hebt.

### Instantietoegang

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` is het object dat door `suneditor.create()` wordt geretourneerd, waardoor de volledige engine-API beschikbaar is.

### Events

Geef handlers door via `options.events`. Ze worden bij elke rendering opnieuw gesynchroniseerd, zodat ze veilig kunnen worden afgesloten via de React-status.

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

### Werkbalk of statusbalk in een ander element

Engine-opties die een DOM-element gebruiken, werken met refs omdat de `options`-functie na het mounten wordt uitgevoerd:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Eén engine-instantie (werkbalk, plug-ins, gebeurtenissen, thema) met meerdere bewerkbare gebieden. Plaats een `<SunEditorRoot>` per gebied binnen een `<SunEditorGroup>`; andere JSX kan ertussen worden geplaatst. De groep rendert geen eigen elementen.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` is de motor `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Elke wortel heeft zijn eigen `value` / `onChange`, `readOnly`, `disabled` en frame `options` (`height`, `placeholder`, `iframe`, ...).
- De engine heeft `toolbar_container` nodig voor de gedeelde werkbalk, tenzij `mode` gelijk is aan `inline` of `balloon`.
- Roots worden verzameld wanneer de groep wordt gemount. De engine kan later geen roots toevoegen of verwijderen, dus wijzig de `key` van de groep om deze opnieuw aan te maken met andere roots.

## Props

| Prop | Type | Beschrijving |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-editor (gecontroleerd). |
| `onChange` | `(html: string) => void` | Wordt aangeroepen bij elke inhoudswijziging. Afkorting voor `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor opties](https://suneditor.com) wordt ongewijzigd doorgegeven. `events` en `theme` worden live toegepast. Al het andere wordt eenmalig toegepast bij de aanmaak. |
| `readOnly` | `boolean` | Schakel de alleen-lezenmodus in/uit. |
| `disabled` | `boolean` | De editor uitschakelen. |
| `className`, `style` |  | Toegepast op de verpakking `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Elke andere prop (`id`, `data-*`, `aria-*`, ...) wordt toegepast op de omhullende `<div>`. `children` wordt genegeerd. |
| `ref` | `SunEditorInstance \| null` | De editor-instantie. |

Bij het aanmaken van de editor worden andere opties dan `events` en `theme` toegepast.
Om ze later te wijzigen, kunt u opnieuw mounten met een andere `key` of `ref.current.resetOptions()` aanroepen.

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

Alle motortypes zijn ook verkrijgbaar vanaf `suneditor/types`.

## Next.js notities

- Het component is een clientmodule (`"use client"` staat in de buildoutput) en laadt de engine alleen in de browser, waardoor het direct vanuit een servercomponent kan worden weergegeven.
- Vermijd `suneditor` in statische imports in clientcomponenten. Gebruik de `options={(se) => ...}`-vorm om `se.plugins` te bereiken.
- CSS-imports (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) werken zowel in de App Router als in de Pages Router.
