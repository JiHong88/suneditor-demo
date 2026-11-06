<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Componenta necesită și motorul [SunEditor](https://www.npmjs.com/package/suneditor) (dependență de la egal la egal, 3.4.1 sau o versiune ulterioară)

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

`options` este predat lui `suneditor.create()` așa cum este, deci fiecare opțiune, plugin, buton, eveniment și limbă aparține motorului.\
Acest fișier README acoperă doar ceea ce adaugă componenta React; pentru opțiunile în sine, consultați pachetul [SunEditor documentație](https://suneditor.com) sau [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` primește modulul `suneditor` încărcat leneș (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Prefer această formă în Next.js: importul static al valorii `suneditor` într-o componentă client întrerupe randarea pe server deoarece motorul atinge `window` în momentul importului.\
Un obiect simplu funcționează și atunci când nu se randează pe server sau pentru opțiuni care nu necesită importul motorului.\
Pachetele lingvistice sunt obiecte simple și pot fi oricând importate static: `import ko from 'suneditor/langs/ko'`.

### Valoare controlată

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Schimbarea lui `value` cu altceva decât ultimul rezultat `onChange` înlocuiește conținutul editorului.
Omiteți `value` pentru un editor necontrolat și citiți conținutul din instanță atunci când aveți nevoie de el.

### Acces la instanță

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` este obiectul returnat de `suneditor.create()`, deci întregul API al motorului este disponibil.

### Events

Transmiteți handlerele prin starea `options.events`. Acestea sunt resincronizate la fiecare randare, astfel încât se pot închide în siguranță peste starea React.

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

### Bara de instrumente sau bara de stare într-un alt element

Opțiunile motorului care acceptă un element DOM funcționează cu ref-uri deoarece funcția `options` rulează după montare:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

O instanță a motorului (bara de instrumente, plugin-uri, evenimente, temă) cu mai multe zone editabile. Puneți un `<SunEditorRoot>` per zonă în interiorul `<SunEditorGroup>`; orice alt JSX poate sta între ele. Grupul nu randează niciun element propriu.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` este motorul `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Fiecare rădăcină are propriile `value` / `onChange`, `readOnly`, `disabled` și propriul cadru `options` (`height`, `placeholder`, `iframe`, ...).
- Motorul are nevoie de `toolbar_container` pentru bara de instrumente partajată, cu excepția cazului în care `mode` este `inline` sau `balloon`.
- Rădăcinile sunt colectate atunci când grupul se montează. Motorul nu poate adăuga sau elimina rădăcini ulterior, așa că modificați `key` al grupului pentru a-l recrea cu rădăcini diferite.

## Props

| Prop | Tip | Descriere |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Editor HTML (controlat). |
| `onChange` | `(html: string) => void` | Apelat la fiecare modificare de conținut. Prescurtare pentru `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor opțiuni](https://suneditor.com), transmise neschimbate. `events` și `theme` sunt aplicate live. Toate celelalte se aplică o singură dată la creare. |
| `readOnly` | `boolean` | Comutare mod doar citire. |
| `disabled` | `boolean` | Dezactivați editorul. |
| `className`, `style` |  | Aplicat pe ambalaj `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Orice alt prop (`id`, `data-*`, `aria-*`, ...) este aplicat învelișului `<div>`. `children` este ignorat. |
| `ref` | `SunEditorInstance \| null` | Instanța editorului. |

Alte opțiuni în afară de `events` și `theme` se aplică la crearea editorului.
Pentru a le schimba ulterior, montați din nou cu un `key` diferit sau apelați `ref.current.resetOptions()`.

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

Toate tipurile de motoare sunt disponibile și de la `suneditor/types`.

## Next.js note

- Componenta este un modul client (`"use client"` se află în rezultatul compilației) și încarcă motorul doar în browser, astfel încât poate fi randată direct dintr-o componentă de server.
- Nu importați valorile statice în componentele clientului cu forma `suneditor`. Folosiți forma `options={(se) => ...}` pentru a ajunge la valoarea `se.plugins`.
- Importurile CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funcționează atât în ​​App Router, cât și în Pages Router.
