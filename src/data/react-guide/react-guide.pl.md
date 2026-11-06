<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Wymagana jest wersja `suneditor` 3.4.1 lub nowsza (`editor.events` służy do podłączenia React props).

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

`options` odbiera leniwie załadowany moduł `suneditor` (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Preferowana forma w Next.js: statyczny import `suneditor` do komponentu klienta przerywa renderowanie na serwerze, ponieważ silnik ma styczność z `window` w momencie importu.
Zwykły obiekt działa również wtedy, gdy nie renderujesz na serwerze lub gdy używasz opcji, które nie wymagają importowania silnika.
Pakiety językowe to zwykłe obiekty, które zawsze można importować statycznie: `import ko from 'suneditor/langs/ko'`.

### Kontrolowana wartość

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Zmiana `value` na coś innego niż ostatni wynik `onChange` powoduje zastąpienie zawartości edytora.
Pomiń `value` w przypadku niekontrolowanego edytora i odczytaj zawartość z instancji, gdy będzie to potrzebne.

### Dostęp do instancji

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` jest obiektem zwróconym przez `suneditor.create()`, więc dostępne jest całe API silnika.

### Events

Przekaż procedury obsługi zdarzeń przez `options.events`. Są one ponownie synchronizowane przy każdym renderowaniu, więc mogą bezpiecznie zamknąć się w stanie React.

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

### Pasek narzędzi lub pasek stanu w innym elemencie

Opcje silnika przyjmujące element DOM działają z odniesieniami, ponieważ funkcja `options` jest uruchamiana po zamontowaniu:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Jedna instancja silnika (pasek narzędzi, wtyczki, zdarzenia, motyw) z kilkoma obszarami edytowalnymi. Umieść `<SunEditorRoot>` na każdy obszar wewnątrz `<SunEditorGroup>`; dowolny inny kod JSX może znajdować się między nimi. Grupa nie renderuje żadnego własnego elementu.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` jest silnikiem `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Każdy korzeń ma swój własny `value` / `onChange`, `readOnly`, `disabled` i ramkę `options` (`height`, `placeholder`, `iframe`, ...).
- Silnik wymaga `toolbar_container` dla współdzielonego paska narzędzi, chyba że `mode` jest równe `inline` lub `balloon`.
- Korzenie są zbierane podczas montowania grupy. Silnik nie może później dodawać ani usuwać korzeni, więc zmień `key` grupy, aby odtworzyć ją z innymi korzeniami.

## Props

| Prop | Typ | Opis |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Edytor HTML (kontrolowany). |
| `onChange` | `(html: string) => void` | Wywoływane przy każdej zmianie treści. Skrót od `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | Opcje inicjalizacji SunEditor. `events` i `theme` są stosowane na bieżąco. Wszystkie pozostałe są stosowane jednorazowo podczas tworzenia. |
| `readOnly` | `boolean` | Przełącz tryb tylko do odczytu. |
| `disabled` | `boolean` | Wyłącz edytor. |
| `className`, `style` |  | Zastosowano do opakowania `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Każde inne prop (`id`, `data-*`, `aria-*`, ...) jest stosowane do opakowania `<div>`. `children` jest ignorowane. |
| `ref` | `SunEditorInstance \| null` | Instancja edytora. |

Opcje inne niż `events` i `theme` są stosowane podczas tworzenia edytora.
Aby je później zmienić, należy ponownie zamontować inny `key` lub zadzwonić do `ref.current.resetOptions()`.

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

Wszystkie typy silników są również dostępne w `suneditor/types`.

## Next.js notatki

- Komponent jest modułem klienta (`"use client"` znajduje się w wynikach kompilacji) i ładuje silnik tylko w przeglądarce, więc może być renderowany bezpośrednio z komponentu serwera.
- Nie uwzględniaj `suneditor` w importach statycznych w komponentach klienta. Użyj formy `options={(se) => ...}`, aby dotrzeć do `se.plugins`.
- Importy CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) działają zarówno w App Router, jak i Pages Router.
