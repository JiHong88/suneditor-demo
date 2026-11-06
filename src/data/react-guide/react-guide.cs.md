<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Komponenta také potřebuje engine [SunEditor](https://www.npmjs.com/package/suneditor) (závislost na peerech, 3.4.1 nebo novější)

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

`options` je předáváno `suneditor.create()` tak, jak je, takže každá možnost, plugin, tlačítko, událost a jazyk jsou vlastní enginu.\
Tento soubor README se zabývá pouze tím, co přidává komponenta React; samotné možnosti naleznete v balíčku [SunEditor dokumentace](https://suneditor.com) nebo [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` obdrží líně načtený modul `suneditor` (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
V Next.js preferujte tento tvar: statický import `suneditor` do klientské komponenty přeruší vykreslování na serveru, protože engine se v době importu dotkne `window`.\
Prostý objekt funguje i v případě, že se nejedná o vykreslování na serveru, nebo pro možnosti, které nevyžadují import z enginu.\
Jazykové balíčky jsou prosté objekty a lze je vždy importovat staticky: `import ko from 'suneditor/langs/ko'`.

### Řízená hodnota

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Změna `value` na něco jiného než poslední výsledek `onChange` nahradí obsah editoru.
Vynechejte `value` pro nekontrolovaný editor a čtěte obsah z instance, když ho potřebujete.

### Přístup k instanci

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` je objekt vrácený funkcí `suneditor.create()`, takže je k dispozici celé API enginu.

### Events

Předávejte obslužné rutiny přes `options.events`. Jsou znovu synchronizovány při každém vykreslení, takže je lze bezpečně zavřít ve stavu React.

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

### Panel nástrojů nebo stavový řádek v jiném prvku

Volby enginu, které přijímají element DOM, fungují s referencemi, protože funkce `options` se spouští po připojení:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Jedna instance enginu (panel nástrojů, pluginy, události, téma) s několika upravitelnými oblastmi. Vložte `<SunEditorRoot>` pro každou oblast uvnitř `<SunEditorGroup>`; mezi nimi může být jakýkoli jiný JSX. Skupina nevykresluje žádný vlastní prvek.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` je motor `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Každý kořen má svůj vlastní `value` / `onChange`, `readOnly`, `disabled` a frame `options` (`height`, `placeholder`, `iframe`, ...).
- Engine potřebuje pro sdílený panel nástrojů hodnotu `toolbar_container`, pokud `mode` není `inline` nebo `balloon`.
- Kořeny se shromažďují při připojení skupiny. Engine již nemůže kořeny později přidávat ani odebírat, proto změňte hodnotu `key` skupiny a vytvořte ji s jinými kořeny.

## Props

| Prop | Typ | Popis |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML editor (řízený). |
| `onChange` | `(html: string) => void` | Voláno při každé změně obsahu. Zkratka pro `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor možností](https://suneditor.com), prochází beze změny. `events` a `theme` se aplikují živě. Všechno ostatní se aplikuje jednou při vytvoření. |
| `readOnly` | `boolean` | Přepnout režim pouze pro čtení. |
| `disabled` | `boolean` | Zakažte editor. |
| `className`, `style` |  | Aplikováno na obal `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Jakékoli jiné prop (`id`, `data-*`, `aria-*`, ...) se použije na obalení `<div>`. `children` se ignoruje. |
| `ref` | `SunEditorInstance \| null` | Instance editoru. |

Jiné možnosti než `events` a `theme` se použijí při vytváření editoru.
Chcete-li je později změnit, znovu připojte s jiným `key` nebo zavolejte `ref.current.resetOptions()`.

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

Všechny typy motorů jsou k dispozici také od `suneditor/types`.

## Next.js noty

- Komponenta je klientský modul (`"use client"` je ve výstupu sestavení) a načítá engine pouze v prohlížeči, takže jej lze vykreslit přímo ze serverové komponenty.
- V klientských komponentách vynechejte `suneditor` ze statických importů. Pro dosažení `se.plugins` použijte tvar `options={(se) => ...}`.
- Importy CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) fungují jak v App Router, tak v Pages Router.
