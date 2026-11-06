<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Nepieciešama `suneditor` 3.4.1 vai jaunāka versija (`editor.events` tiek izmantots React props pievienošanai).

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

`options` saņem lēni ielādēto `suneditor` moduli (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Dodiet priekšroku šai formai Next.js: `suneditor` statiska importēšana klienta komponentē pārtrauc servera renderēšanu, jo dzinējs importēšanas laikā pieskaras `window`.
Vienkāršs objekts darbojas arī tad, ja netiek veikta servera renderēšana, vai opcijām, kurām nav nepieciešama dzinēja importēšana.
Valodu pakotnes ir vienkārši objekti un tās vienmēr var importēt statiski: `import ko from 'suneditor/langs/ko'`.

### Kontrolētā vērtība

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Mainot `value` uz kaut ko citu, nevis pēdējo `onChange` rezultātu, tiek aizstāts redaktora saturs.
Nekontrolētam redaktoram izlaidiet `value` un lasiet saturu no instances, kad tas ir nepieciešams.

### Instances piekļuve

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` ir objekts, ko atgriež `suneditor.create()`, tāpēc ir pieejama visa dzinēja API.

### Events

Izlaidiet apstrādātājus caur `options.events`. Tie tiek atkārtoti sinhronizēti katrā renderēšanā, lai tos varētu droši aizvērt React stāvoklī.

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

### Rīkjosla vai statusa josla citā elementā

Dzinēja opcijas, kas pieņem DOM elementu, darbojas ar atsaucēm, jo ​​funkcija `options` darbojas pēc pievienošanas:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Viens dzinēja eksemplārs (rīkjosla, spraudņi, notikumi, tēma) ar vairākām rediģējamām zonām. Ievietojiet `<SunEditorRoot>` katrā zonā `<SunEditorGroup>` iekšpusē; jebkurš cits JSX var atrasties starp tiem. Grupa nerenderē nevienu savu elementu.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` ir dzinējs `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Katrai saknei ir sava `value` / `onChange`, `readOnly`, `disabled` un rāmis `options` (`height`, `placeholder`, `iframe`, ...).
- Dzinējam koplietotajai rīkjoslai ir nepieciešams `toolbar_container`, ja ​​vien `mode` nav `inline` vai `balloon`.
- Saknes tiek apkopotas, kad grupa tiek uzstādīta. Dzinējs vēlāk nevar pievienot vai noņemt saknes, tāpēc mainiet grupas `key`, lai to atjaunotu ar citām saknēm.

## Props

| Prop | Tips | Apraksts |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Redaktora HTML (kontrolēts). |
| `onChange` | `(html: string) => void` | Izsaucas pie katrām satura izmaiņām. Saīsinājums no `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor init opcijas. `events` un `theme` tiek lietotas tiešraidē. Viss pārējais tiek lietots vienreiz izveides laikā. |
| `readOnly` | `boolean` | Pārslēgt tikai lasīšanas režīmu. |
| `disabled` | `boolean` | Atspējot redaktoru. |
| `className`, `style` |  | Pielietots iesaiņojumam `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Jebkurš cits prop (`id`, `data-*`, `aria-*`, ...) tiek lietots ietīšanai `<div>`. `children` tiek ignorēts. |
| `ref` | `SunEditorInstance \| null` | Redaktora instance. |

Izveidojot redaktoru, tiek lietotas citas opcijas, nevis `events` un `theme`.
Lai tos vēlāk mainītu, veiciet atkārtotu uzstādīšanu ar citu `key` vai zvaniet uz `ref.current.resetOptions()`.

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

Visi dzinēju tipi ir pieejami arī no `suneditor/types`.

## Next.js piezīmes

- Komponents ir klienta modulis (`"use client"` ir atrodams būvējuma izvadē) un ielādē dzinēju tikai pārlūkprogrammā, tāpēc to var atveidot tieši no servera komponenta.
- Klienta komponentos neiekļaujiet `suneditor` statiskajā importā. Lai sazinātos ar `se.plugins`, izmantojiet `options={(se) => ...}` veidlapu.
- CSS importēšana (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) darbojas gan App Router, gan Pages Router.
