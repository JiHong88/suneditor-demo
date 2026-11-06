<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

A komponensnek szüksége van a [SunEditor](https://www.npmjs.com/package/suneditor) motorra is (peer függőség, 3.4.1 vagy újabb)

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

A `options` értéket a `suneditor.create()` értéknek adjuk át jelenlegi állapotában, tehát minden opció, bővítmény, gomb, esemény és nyelv a motor sajátja.\
Ez a README fájl csak a React komponens által hozzáadott funkciókat tartalmazza; magukért a beállításokért lásd a [SunEditor dokumentáció](https://suneditor.com) vagy a [`suneditor`](https://www.npmjs.com/package/suneditor) csomagot.

A `options` kapja meg a lustán betöltött `suneditor` modult (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Ezt a formát részesítsd előnyben a Next.js-ben: a `suneditor` statikus importálása egy kliens komponensbe megzavarja a szerver renderelését, mivel a motor importáláskor megérinti a `window`-et.\
Egy sima objektum akkor is működik, ha nem szerverről renderelsz, vagy olyan beállításokhoz, amelyekhez nincs szükség motorimportálásra.\
A nyelvi csomagok egyszerű objektumok, és mindig statikusan importálhatók: `import ko from 'suneditor/langs/ko'`.

### Ellenőrzött érték

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Ha a `value` értéket az utolsó `onChange` eredménytől eltérő értékre módosítjuk, a szerkesztő tartalma lecserélődik.
Hagyd ki a `value`-t egy kontrollálatlan szerkesztő esetén, és olvasd be a tartalmat a példányból, amikor szükséged van rá.

### Példányhozzáférés

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

A `ref` a `suneditor.create()` által visszaadott objektum, tehát a teljes motor API elérhető.

### Events

Add át a kezelőket a `options.events` állapoton. Minden rendereléskor újraszinkronizálódnak, így biztonságosan bezárhatók React állapot felett.

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

### Eszköztár vagy állapotsor egy másik elemben

A DOM elemet elfogadó motoropciók működnek ref-ekkel, mivel a `options` függvény a csatolás után fut:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Egyetlen motorpéldány (eszköztár, bővítmények, események, téma) több szerkeszthető területtel. Területenként tegyél egy `<SunEditorRoot>`-t az `<SunEditorGroup>`-on belül; bármilyen más JSX elhelyezkedhet közöttük. A csoport nem jelenít meg saját elemet.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- A `name` a `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`) motor.
- Minden gyöknek megvan a saját `value` / `onChange`, `readOnly`, `disabled` és kerete `options` (`height`, `placeholder`, `iframe`, ...).
- A motornak `toolbar_container`-ra van szüksége a megosztott eszköztárhoz, kivéve, ha az `mode` értéke `inline` vagy `balloon`.
- A gyökereket a csoport csatolásakor gyűjtik össze. A motor később nem tud gyökereket hozzáadni vagy eltávolítani, ezért módosítsa a csoport `key` értékét, hogy más gyökerekkel hozza létre újra.

## Props

| Prop | Típus | Leírás |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML szerkesztő (vezérelt). |
| `onChange` | `(html: string) => void` | Minden tartalomváltozáskor meghívódik. A `options.events.onChange` rövidítése. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor lehetőség](https://suneditor.com), változatlanul átment. `events` és `theme` élőben alkalmazva. Minden más egyszer, a létrehozáskor kerül alkalmazásra. |
| `readOnly` | `boolean` | Csak olvasható mód be-/kikapcsolása. |
| `disabled` | `boolean` | Tiltsa le a szerkesztőt. |
| `className`, `style` |  | A csomagolásra alkalmazva `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Bármely más prop (`id`, `data-*`, `aria-*`, ...) a `<div>` körre lesz alkalmazva. A `children`-t figyelmen kívül hagyja a rendszer. |
| `ref` | `SunEditorInstance \| null` | A szerkesztőpéldány. |

A `events` és `theme` értékektől eltérő beállítások a szerkesztő létrehozásakor érvényesek.
Későbbi módosításhoz csatlakoztasd újra egy másik `key` értékkel, vagy hívd meg a `ref.current.resetOptions()` kódot.

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

Minden motortípus elérhető `suneditor/types`-tól.

## Next.js jegyzetek

- A komponens egy kliens modul (a `"use client"` szerepel a build kimenetében), és csak a böngészőben tölti be a motort, így közvetlenül egy szerver komponensből renderelhető.
- A kliens komponensekben a statikus importálásokból hagyd ki a `suneditor`-t. A `options={(se) => ...}` űrlappal elérheted a `se.plugins`-t.
- A CSS importálások (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) mind a App Router, mind a Pages Router formátumban működnek.
