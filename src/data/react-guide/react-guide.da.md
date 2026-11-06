<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Kræver `suneditor` 3.4.1 eller nyere (`editor.events` bruges til at tilslutte React props).

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

`options` modtager det langsomt indlæste `suneditor`-modul (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Foretrækker denne formular i Next.js: statisk import af `suneditor` i en klientkomponent afbryder servergengivelsen, fordi motoren berører `window` på importtidspunktet.
Et almindeligt objekt fungerer også, når du ikke bruger serverrendering, eller til indstillinger, der ikke kræver motorimport.
Sprogpakker er almindelige objekter og kan altid importeres statisk: `import ko from 'suneditor/langs/ko'`.

### Kontrolleret værdi

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Hvis `value` ændres til noget andet end det sidste `onChange`-resultat, erstattes editorens indhold.
Udelad `value` for en ukontrolleret editor, og læs indholdet fra instansen, når du har brug for det.

### Adgang til instans

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` er det objekt, der returneres af `suneditor.create()`, så hele engine-API'en er tilgængelig.

### Events

Send handlere gennem `options.events`. De synkroniseres igen ved hver gengivelse, så de sikkert kan lukkes over tilstanden React.

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

### Værktøjslinje eller statuslinje i et andet element

Engine-indstillinger, der tager et DOM-element, fungerer med refs, fordi `options`-funktionen kører efter montering:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Én motorinstans (værktøjslinje, plugins, events, tema) med flere redigerbare områder. Placer en `<SunEditorRoot>` pr. område i `<SunEditorGroup>`; enhver anden JSX kan placeres mellem dem. Gruppen gengiver intet eget element.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` er motoren `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Hver rod har sin egen `value` / `onChange`, `readOnly`, `disabled` og ramme `options` (`height`, `placeholder`, `iframe`, ...).
- Systemet skal bruge `toolbar_container` til den delte værktøjslinje, medmindre `mode` er `inline` eller `balloon`.
- Rødder indsamles, når gruppen monteres. Systemet kan ikke tilføje eller fjerne rødder senere, så skift gruppens `key` for at genskabe den med forskellige rødder.

## Props

| Prop | Type | Beskrivelse |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-editor (kontrolleret). |
| `onChange` | `(html: string) => void` | Kaldes ved hver indholdsændring. Forkortelse for `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor init-indstillinger. `events` og `theme` anvendes live. Alt andet anvendes én gang ved oprettelsen. |
| `readOnly` | `boolean` | Slå skrivebeskyttet tilstand til/fra. |
| `disabled` | `boolean` | Deaktiver editoren. |
| `className`, `style` |  | Påført indpakningen `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Enhver anden prop (`id`, `data-*`, `aria-*`, ...) anvendes på indpakningen `<div>`. `children` ignoreres. |
| `ref` | `SunEditorInstance \| null` | Redaktørinstansen. |

Andre indstillinger end `events` og `theme` anvendes, når editoren oprettes.
For at ændre dem senere, skal du genmontere med en anden `key` eller kalde `ref.current.resetOptions()`.

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

Alle motortyper er også tilgængelige fra `suneditor/types`.

## Next.js noter

- Komponenten er et klientmodul (`"use client"` findes i build-outputtet) og indlæser kun motoren i browseren, så den kan gengives direkte fra en serverkomponent.
- Hold `suneditor` ude af statisk import i klientkomponenter. Brug `options={(se) => ...}`-formularen til at nå `se.plugins`.
- CSS-importer (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) fungerer i både App Router og Pages Router.
