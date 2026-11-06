<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Die Komponente benötigt außerdem die [SunEditor](https://www.npmjs.com/package/suneditor)-Engine (Peer-Abhängigkeit, Version 3.4.1 oder höher).

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

`options` wird unverändert an `suneditor.create()` übergeben, daher sind alle Optionen, Plugins, Schaltflächen, Ereignisse und Sprachen Eigentum der Engine.\
Diese README-Datei beschreibt nur, was die Komponente React hinzufügt; die Optionen selbst finden Sie im Paket [SunEditor Dokumentation](https://suneditor.com) oder [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` empfängt das verzögert geladene `suneditor` Modul (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Diese Form ist in Next.js vorzuziehen: Der statische Import von `suneditor` in eine Clientkomponente führt zu einem Fehler beim Server-Rendering, da die Engine `window` beim Importvorgang berührt.\
Ein einfaches Objekt funktioniert auch, wenn Sie kein serverseitiges Rendering verwenden oder für Optionen, die keinen Engine-Import benötigen.\
Sprachpakete sind einfache Objekte und können immer statisch importiert werden: `import ko from 'suneditor/langs/ko'`.

### Kontrollierter Wert

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Wenn `value` durch etwas anderes als das letzte `onChange`-Ergebnis ersetzt wird, wird der Inhalt des Editors überschrieben.
Lassen Sie `value` weg, um einen unkontrollierten Editor zu verwenden und den Inhalt bei Bedarf aus der Instanz zu lesen.

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

Die Handler werden über `options.events` weitergeleitet. Sie werden bei jedem Rendern neu synchronisiert, sodass sie den Zustand React sicher überschreiben können.

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

Eine Engine-Instanz (Toolbar, Plugins, Events, Theme) mit mehreren bearbeitbaren Bereichen. Platzieren Sie pro Bereich ein `<SunEditorRoot>` innerhalb eines `<SunEditorGroup>`; dazwischen kann beliebiger weiterer JSX-Code stehen. Die Gruppe rendert keine eigenen Elemente.

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
- Jede Wurzel hat ihr eigenes `value` / `onChange`, `readOnly`, `disabled` und ihren eigenen Rahmen `options` (`height`, `placeholder`, `iframe`, ...).
- Die Engine benötigt `toolbar_container` für die gemeinsame Symbolleiste, es sei denn, `mode` ist `inline` oder `balloon`.
- Die Wurzeln werden beim Mounten der Gruppe erfasst. Die Engine kann später keine Wurzeln hinzufügen oder entfernen. Ändern Sie daher den Wert `key` der Gruppe, um sie mit anderen Wurzeln neu zu erstellen.

## Props

| Prop | Typ | Beschreibung |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-Editor (kontrolliert). |
| `onChange` | `(html: string) => void` | Wird bei jeder Inhaltsänderung aufgerufen. Kurzform für `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor Optionen](https://suneditor.com) wird unverändert weitergegeben. `events` und `theme` werden live angewendet. Alle anderen Elemente werden einmalig bei der Erstellung angewendet. |
| `readOnly` | `boolean` | Schreibgeschützten Modus umschalten. |
| `disabled` | `boolean` | Den Editor deaktivieren. |
| `className`, `style` |  | Angewendet auf die Umhüllung `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Jede andere prop (`id`, `data-*`, `aria-*`, ...) wird auf die umschließende `<div>` angewendet. `children` wird ignoriert. |
| `ref` | `SunEditorInstance \| null` | Die Editorinstanz. |

Optionen außer `events` und `theme` werden beim Erstellen des Editors angewendet.
Um sie später zu ändern, müssen Sie sie mit einem anderen `key` erneut einbinden oder `ref.current.resetOptions()` aufrufen.

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
- CSS-Importe (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funktionieren sowohl in der App Router als auch in der Pages Router.
