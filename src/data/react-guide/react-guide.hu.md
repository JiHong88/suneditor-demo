<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

`suneditor` 3.4.1 vagy újabb verziót igényel (a `editor.events` a React props bekötésére szolgál).

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

A `options` fogadja a lustán betöltött `suneditor` modult (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Ezt a formát részesítsd előnyben a Next.js-ban: a `suneditor` statikus importálása egy kliens komponensbe megszakítja a szerver renderelését, mivel a motor importáláskor megérinti a `window`-t.
Egy sima objektum akkor is működik, ha nem szerverről renderelsz, vagy olyan beállításokhoz, amelyekhez nincs szükség motorimportálásra.
A nyelvi csomagok egyszerű objektumok, és mindig statikusan importálhatók: `import ko from 'suneditor/langs/ko'`.

### Ellenőrzött érték

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Ha a `value` értéket az utolsó `onChange` eredménytől eltérő értékre módosítja, akkor a szerkesztő tartalma lecserélődik.
Kontrollálatlan szerkesztő esetén hagyd ki a `value` karakterláncot, és a példányból olvasd be a tartalmat, amikor szükséged van rá.

### Példányhozzáférés

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

A `ref` a `suneditor.create()` által visszaadott objektum, így a teljes motor API elérhető.

### Events

Adja át a kezelőket a `options.events` állapoton keresztül. Minden rendereléskor újraszinkronizálódnak, így biztonságosan bezárhatók React állapot felett.

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

Egyetlen motorpéldány (eszköztár, bővítmények, események, téma) több szerkeszthető területtel. Helyezzen el egy `<SunEditorRoot>` elemet területenként a `<SunEditorGroup>`-en belül; bármilyen más JSX elhelyezkedhet közöttük. A csoport nem jelenít meg saját elemet.

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
- Minden gyökérnek megvan a saját `value` / `onChange`, `readOnly`, `disabled` és kerete a `options` (`height`, `placeholder`, `iframe`, ...).
- A motornak `toolbar_container`-ra van szüksége a megosztott eszköztárhoz, kivéve, ha a `mode` nem `inline` vagy `balloon`.
- A gyökereket a csoport csatolásakor gyűjtik össze. A motor később nem tud gyökereket hozzáadni vagy eltávolítani, ezért módosítsa a csoport `key` értékét, hogy más gyökerekkel hozza létre azt.

## Props

| Prop | Típus | Leírás |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML szerkesztő (vezérelt). |
| `onChange` | `(html: string) => void` | Minden tartalomváltozáskor meghívódik. A `options.events.onChange` rövidítése. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor init opciók. A `events` és `theme` élőben érvényesül. Minden más egyszer, a létrehozáskor kerül alkalmazásra. |
| `readOnly` | `boolean` | Csak olvasható mód be-/kikapcsolása. |
| `disabled` | `boolean` | Tiltsa le a szerkesztőt. |
| `className`, `style` |  | A `<div>` csomagolásra alkalmazva. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Bármely más prop (`id`, `data-*`, `aria-*`, ...) a `<div>` tördelésre kerül. A `children` figyelmen kívül marad. |
| `ref` | `SunEditorInstance \| null` | A szerkesztőpéldány. |

A `events` és `theme` beállításoktól eltérő beállítások a szerkesztő létrehozásakor érvényesek.
A későbbi módosításhoz csatlakoztasd újra egy másik `key`-val, vagy hívd meg a `ref.current.resetOptions()`-t.

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

Minden motortípus elérhető a `suneditor/types`-tól is.

## Next.js jegyzetek

- A komponens egy kliens modul (a `"use client"` szerepel a build kimenetében), és csak a böngészőben tölti be a motort, így közvetlenül egy szerver komponensből renderelhető.
- Tartsd távol a `suneditor`-t a kliens komponensek statikus importálásaitól. Használd a `options={(se) => ...}` űrlapot a `se.plugins` eléréséhez.
- A CSS importálások (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) mind a App Router, mind a Pages Router rendszerben működnek.
