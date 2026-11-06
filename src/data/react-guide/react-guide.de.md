<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Erfordert `suneditor` 3.4.1 oder höher (`editor.events` wird verwendet, um React und props zu verdrahten).

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

`options` empfängt das verzögert geladene `suneditor` Modul (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Diese Form ist in Next.js vorzuziehen: Der statische Import von `suneditor` in eine Clientkomponente führt zu einem Fehler beim Server-Rendering, da die Engine `window` beim Importvorgang berührt.
Ein einfaches Objekt funktioniert auch, wenn Sie kein serverseitiges Rendering verwenden oder für Optionen, die keinen Engine-Import benötigen.
Sprachpakete sind einfache Objekte und können immer statisch importiert werden: `import ko from 'suneditor/langs/ko'`.

### Kontrollierter Wert

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Wenn `value` durch einen anderen Wert als das letzte `onChange`-Ergebnis ersetzt wird, wird der Inhalt des Editors überschrieben.
Lassen Sie `value` weg, um einen unkontrollierten Editor zu verwenden, und lesen Sie den Inhalt der Instanz, wenn Sie ihn benötigen.

### Instanzzugriff

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` ist das von `suneditor.create()` zurückgegebene Objekt, sodass die gesamte Engine-API verfügbar ist.

### Events

Die Handler werden über `options.events` weitergeleitet. Sie werden bei jedem Rendern neu synchronisiert, sodass sie den Zustand von React sicher überschreiben können.

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

### Symbolleiste oder Statusleiste in einem anderen Element

Engine-Optionen, die ein DOM-Element verwenden, funktionieren mit Refs, da die Funktion `options` nach dem Mounten ausgeführt wird:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Eine Engine-Instanz (Toolbar, Plugins, Events, Theme) mit mehreren bearbeitbaren Bereichen. Platzieren Sie pro Bereich ein `<SunEditorRoot>` innerhalb eines `<SunEditorGroup>`; beliebiger weiterer JSX-Code kann dazwischen stehen. Die Gruppe rendert keine eigenen Elemente.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` ist die Maschine `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Jede Wurzel hat ihre eigene `value` / `onChange`, `readOnly`, `disabled` und ihren eigenen Rahmen `options` (`height`, `placeholder`, `iframe`, ...).
- Die Engine benötigt `toolbar_container` für die gemeinsame Symbolleiste, es sei denn, `mode` ist `inline` oder `balloon`.
- Die Root-Variablen werden beim Mounten der Gruppe erfasst. Die Engine kann später keine Root-Variablen hinzufügen oder entfernen. Ändern Sie daher die `key`-Variable der Gruppe, um sie mit anderen Root-Variablen neu zu erstellen.

## Props

| Prop | Typ | Beschreibung |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-Editor (kontrolliert). |
| `onChange` | `(html: string) => void` | Wird bei jeder Inhaltsänderung aufgerufen. Kurzform für `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor-Initialisierungsoptionen. `events` und `theme` werden live angewendet. Alle anderen Optionen werden einmalig bei der Erstellung angewendet. |
| `readOnly` | `boolean` | Schreibgeschützten Modus umschalten. |
| `disabled` | `boolean` | Den Editor deaktivieren. |
| `className`, `style` |  | Angewendet auf die Verpackung `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Jede andere prop (`id`, `data-*`, `aria-*`, ...) wird auf die umschließende `<div>` angewendet. `children` wird ignoriert. |
| `ref` | `SunEditorInstance \| null` | Die Editorinstanz. |

Beim Erstellen des Editors werden andere Optionen als `events` und `theme` angewendet.
Um sie später zu ändern, müssen Sie sie mit einem anderen `key` neu einbinden oder `ref.current.resetOptions()` aufrufen.

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

Alle Motortypen sind auch ab `suneditor/types` erhältlich.

## Next.js Notizen

- Die Komponente ist ein Client-Modul (`"use client"` befindet sich in der Build-Ausgabe) und lädt die Engine nur im Browser, sodass sie direkt von einer Serverkomponente gerendert werden kann.
- Halten Sie `suneditor` von statischen Importen in Clientkomponenten fern. Verwenden Sie die `options={(se) => ...}`-Form, um `se.plugins` zu erreichen.
- CSS-Importe (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funktionieren sowohl in App Router als auch in Pages Router.
