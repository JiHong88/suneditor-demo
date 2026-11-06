<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Komponentam ir nepieciešams arī [SunEditor](https://www.npmjs.com/package/suneditor) dzinējs (atkarība no līdziniekiem, 3.4.1 vai jaunāka versija)

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

`options` tiek nodots `suneditor.create()` tādam, kāds tas ir, tāpēc katra opcija, spraudnis, poga, notikums un valoda ir dzinēja paša.\
Šajā README failā ir aprakstīts tikai tas, ko pievieno komponents React; pašas opcijas skatiet [SunEditor dokumentācija](https://suneditor.com) vai [`suneditor`](https://www.npmjs.com/package/suneditor) pakotnē.

`options` saņem lēni ielādēto `suneditor` moduli (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Dodiet priekšroku šai formai Next.js: `suneditor` statiska importēšana klienta komponentē pārtrauc servera renderēšanu, jo dzinējs importēšanas laikā pieskaras `window`.\
Vienkāršs objekts darbojas arī tad, ja netiek veikta servera renderēšana, vai opcijām, kurām nav nepieciešama dzinēja importēšana.\
Valodu pakotnes ir vienkārši objekti, un tās vienmēr var importēt statiski: `import ko from 'suneditor/langs/ko'`.

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

Izlaidiet apstrādātājus caur `options.events`. Tie tiek atkārtoti sinhronizēti katrā renderēšanā, lai tos varētu droši aizvērt, izmantojot React stāvokli.

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

Viens dzinēja eksemplārs (rīkjosla, spraudņi, notikumi, tēma) ar vairākām rediģējamām zonām. Katrai zonai `<SunEditorGroup>` iekšpusē ievietojiet `<SunEditorRoot>`; jebkurš cits JSX var atrasties starp tām. Grupa nerenderē nevienu savu elementu.

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
- Katrai saknei ir savs `value` / `onChange`, `readOnly`, `disabled` un rāmis `options` (`height`, `placeholder`, `iframe`, ...).
- Dzinējam koplietotajai rīkjoslai ir nepieciešams `toolbar_container`, ja vien `mode` nav `inline` vai `balloon`.
- Saknes tiek apkopotas, kad grupa tiek uzstādīta. Dzinējs vēlāk nevar pievienot vai noņemt saknes, tāpēc mainiet grupas `key`, lai to atjaunotu ar citām saknēm.

## Props

| Prop | Tips | Apraksts |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Redaktora HTML (kontrolēts). |
| `onChange` | `(html: string) => void` | Izsaucas pie katras satura izmaiņas. Saīsinājums no `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor opcijas](https://suneditor.com), nodots cauri nemainīts. `events` un `theme` tiek lietoti tiešraidē. Viss pārējais tiek lietots vienreiz izveides laikā. |
| `readOnly` | `boolean` | Pārslēgt tikai lasīšanas režīmu. |
| `disabled` | `boolean` | Atspējot redaktoru. |
| `className`, `style` |  | Uzlikts uz iesaiņojuma `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Jebkurš cits prop (`id`, `data-*`, `aria-*`, ...) tiek lietots ietīšanai `<div>`. `children` tiek ignorēts. |
| `ref` | `SunEditorInstance \| null` | Redaktora instance. |

Izveidojot redaktoru, tiek lietotas opcijas, kas nav `events` un `theme`.
Lai tos vēlāk mainītu, atkārtoti piestipriniet ar citu `key` vai izsauciet `ref.current.resetOptions()`.

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

- Komponents ir klienta modulis (`"use client"` ir būvējuma izvadē) un ielādē dzinēju tikai pārlūkprogrammā, tāpēc to var atveidot tieši no servera komponenta.
- Klienta komponentos statiskajā importēšanā neizmantojiet `suneditor`. Lai sasniegtu `se.plugins`, izmantojiet formu `options={(se) => ...}`.
- CSS importēšana (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) darbojas gan ar App Router, gan ar Pages Router.
