<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Richiede `suneditor` 3.4.1 o versioni successive (`editor.events` viene utilizzato per collegare React props).

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

`options` riceve il modulo `suneditor` caricato in modo differito (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Preferisci questa forma in Next.js: l'importazione statica di `suneditor` in un componente client interrompe il rendering lato server perché il motore modifica `window` al momento dell'importazione.
Un oggetto semplice funziona anche quando non si utilizza il rendering lato server, oppure per opzioni che non richiedono l'importazione dal motore.
I pacchetti lingua sono oggetti semplici e possono sempre essere importati staticamente: `import ko from 'suneditor/langs/ko'`.

### Valore controllato

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Modificando `value` con un valore diverso dall'ultimo risultato di `onChange`, il contenuto dell'editor viene sostituito.
Ometti `value` per un editor non controllato e leggi il contenuto dall'istanza quando ne hai bisogno.

### Accesso all'istanza

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` è l'oggetto restituito da `suneditor.create()`, quindi l'intera API del motore è disponibile.

### Events

Passa i gestori attraverso `options.events`. Vengono risincronizzati ad ogni rendering, quindi possono chiudere in sicurezza lo stato React.

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

### Barra degli strumenti o barra di stato in un altro elemento

Le opzioni del motore che accettano un elemento DOM funzionano con i riferimenti perché la funzione `options` viene eseguita dopo il montaggio:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Un'istanza del motore (barra degli strumenti, plugin, eventi, tema) con diverse aree modificabili. Inserisci un `<SunEditorRoot>` per ogni area all'interno di un `<SunEditorGroup>`; qualsiasi altro elemento JSX può essere posizionato tra di essi. Il gruppo non genera alcun elemento proprio.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` è il motore `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Ogni radice ha il proprio `value` / `onChange`, `readOnly`, `disabled` e frame `options` (`height`, `placeholder`, `iframe`, ...).
- Il motore necessita di `toolbar_container` per la barra degli strumenti condivisa a meno che `mode` non sia `inline` o `balloon`.
- Le radici vengono raccolte al momento del montaggio del gruppo. Il motore non può aggiungere o rimuovere radici in seguito, quindi modifica il `key` del gruppo per ricrearlo con radici diverse.

## Props

| Prop | Tipo | Descrizione |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Editor HTML (controllato). |
| `onChange` | `(html: string) => void` | Chiamato ad ogni modifica del contenuto. Abbreviazione di `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | Opzioni di inizializzazione SunEditor. `events` e `theme` vengono applicate in tempo reale. Tutto il resto viene applicato una sola volta al momento della creazione. |
| `readOnly` | `boolean` | Attiva/disattiva la modalità di sola lettura. |
| `disabled` | `boolean` | Disabilita l'editor. |
| `className`, `style` |  | Applicato all'involucro `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Qualsiasi altro prop (`id`, `data-*`, `aria-*`, ...) viene applicato al `<div>` di contenimento. `children` viene ignorato. |
| `ref` | `SunEditorInstance \| null` | L'istanza dell'editor. |

Le opzioni diverse da `events` e `theme` vengono applicate al momento della creazione dell'editor.
Per modificarli in seguito, rimontare con un diverso `key` o chiamare `ref.current.resetOptions()`.

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

Tutti i tipi di motore sono disponibili anche da `suneditor/types`.

## Next.js note

- Il componente è un modulo client (`"use client"` è presente nell'output di compilazione) e carica il motore solo nel browser, quindi può essere renderizzato direttamente da un componente server.
- Non includere `suneditor` nelle importazioni statiche dei componenti client. Utilizza la forma `options={(se) => ...}` per raggiungere `se.plugins`.
- Le importazioni CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funzionano sia in App Router che in Pages Router.
