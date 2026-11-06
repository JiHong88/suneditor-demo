<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

សមាសភាគនេះក៏ត្រូវការម៉ាស៊ីន [SunEditor](https://www.npmjs.com/package/suneditor) ផងដែរ (ការពឹងផ្អែកពីមិត្តភក្ដិ កំណែ 3.4.1 ឬថ្មីជាងនេះ)

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

`options` ត្រូវបានប្រគល់ទៅឱ្យ `suneditor.create()` ដូចដែលវាមាន ដូច្នេះជម្រើស កម្មវិធីជំនួយ ប៊ូតុង ព្រឹត្តិការណ៍ និងភាសានីមួយៗគឺជារបស់ម៉ាស៊ីនផ្ទាល់។\
README នេះគ្របដណ្តប់តែអ្វីដែលសមាសភាគ React បន្ថែមប៉ុណ្ណោះ។ សម្រាប់ជម្រើសខ្លួនឯង សូមមើលកញ្ចប់ [SunEditor documentation](https://suneditor.com) ឬ [`suneditor`](https://www.npmjs.com/package/suneditor)។

`options` ទទួល​ម៉ូឌុល `suneditor` ដែល​ផ្ទុក​យ៉ាង​ខ្ជិល (`se.plugins`, `se.langs`, `se.interfaces`, ...)។\
ចូលចិត្តទម្រង់នេះនៅក្នុង Next.js៖ ការនាំចូល `suneditor` ដោយឋិតិវន្តនៅក្នុងសមាសភាគអតិថិជនធ្វើឱ្យខូចការបង្ហាញម៉ាស៊ីនមេ ពីព្រោះម៉ាស៊ីនប៉ះ `window` នៅពេលនាំចូល។\
វត្ថុ​ធម្មតា​ក៏ដំណើរការ​ផងដែរ នៅពេល​ដែលអ្នក​មិនកំពុង​បង្ហាញ​ម៉ាស៊ីនមេ ឬសម្រាប់​ជម្រើស​ដែលមិនត្រូវការ​ការនាំចូល​ម៉ាស៊ីន។\
កញ្ចប់ភាសាគឺជាវត្ថុធម្មតា ហើយអាចត្រូវបាននាំចូលជាឋិតិវន្តជានិច្ច៖ `import ko from 'suneditor/langs/ko'`។

### តម្លៃដែលបានគ្រប់គ្រង

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

ការ​ផ្លាស់ប្ដូរ `value` ទៅ​ជា​អ្វី​ផ្សេង​ក្រៅ​ពី​លទ្ធផល `onChange` ចុងក្រោយ នឹង​ជំនួស​ខ្លឹមសារ​របស់​កម្មវិធី​និពន្ធ។
លុប `value` សម្រាប់​កម្មវិធី​និពន្ធ​ដែល​មិន​បាន​គ្រប់គ្រង ហើយ​អាន​ខ្លឹមសារ​ពី​ឧទាហរណ៍​នៅ​ពេល​ដែល​អ្នក​ត្រូវការ​វា។

### ការចូលប្រើឧទាហរណ៍

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` គឺជាវត្ថុដែលបានប្រគល់ដោយ `suneditor.create()` ដូច្នេះ API ម៉ាស៊ីនទាំងមូលអាចប្រើបាន។

### Events

បញ្ជូន​ឧបករណ៍​ដោះស្រាយ​ឆ្លងកាត់ `options.events`។ ពួកវាត្រូវបាន​ធ្វើសមកាលកម្មឡើងវិញ​នៅលើ​ការបង្ហាញ​នីមួយៗ ដូច្នេះ​ពួកវា​អាចបិទ​ដោយសុវត្ថិភាព​លើស្ថានភាព React។

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

### របារឧបករណ៍ ឬរបារស្ថានភាពនៅក្នុងធាតុផ្សេងទៀត

ជម្រើសម៉ាស៊ីនដែលយកធាតុ DOM ដំណើរការជាមួយ refs ពីព្រោះអនុគមន៍ `options` ដំណើរការបន្ទាប់ពី mount៖

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

ឧទាហរណ៍​របស់​ម៉ាស៊ីន​មួយ (របារ​ឧបករណ៍ កម្មវិធី​ជំនួយ ព្រឹត្តិការណ៍ ស្បែក) ដែល​មាន​តំបន់​ដែល​អាច​កែសម្រួល​បាន​ច្រើន។ ដាក់ `<SunEditorRoot>` ក្នុងមួយតំបន់នៅខាងក្នុង `<SunEditorGroup>`; JSX ផ្សេងទៀតអាចដាក់នៅចន្លោះពួកវាបាន។ ក្រុមនេះមិនបង្ហាញធាតុផ្ទាល់ខ្លួនរបស់វាទេ។

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` គឺជាម៉ាស៊ីន `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`)។
- ឬសនីមួយៗមាន `value` / `onChange`, `readOnly`, `disabled` និងស៊ុម `options` (`height`, `placeholder`, `iframe`, ...) រៀងៗខ្លួន។
- ម៉ាស៊ីនត្រូវការ `toolbar_container` សម្រាប់របារឧបករណ៍ដែលបានចែករំលែក លុះត្រាតែ `mode` គឺ `inline` ឬ `balloon`។
- ឫស​ត្រូវ​បាន​ប្រមូល​នៅ​ពេល​ដែល​ក្រុម​ត្រូវ​បាន​ម៉ោន។ ម៉ាស៊ីន​មិន​អាច​បន្ថែម ឬ​ដក​ឫស​ចេញ​នៅ​ពេល​ក្រោយ​បាន​ទេ ដូច្នេះ​សូម​ផ្លាស់ប្ដូរ `key` របស់​ក្រុម ដើម្បី​បង្កើត​វា​ឡើង​វិញ​ជាមួយ​ឫស​ផ្សេង​គ្នា។

## Props

| Prop | ប្រភេទ | ការពិពណ៌នា |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | កម្មវិធីនិពន្ធ HTML (គ្រប់គ្រង)។ |
| `onChange` | `(html: string) => void` | បានអំពាវនាវឱ្យមានការផ្លាស់ប្តូរខ្លឹមសារនីមួយៗ។ អក្សរកាត់សម្រាប់ `options.events.onChange`។ |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [ជម្រើស SunEditor](https://suneditor.com) បានឆ្លងកាត់ដោយមិនមានការផ្លាស់ប្តូរ។ `events` និង `theme` ត្រូវបានអនុវត្តផ្ទាល់។ អ្វីៗផ្សេងទៀតទាំងអស់ត្រូវបានអនុវត្តតែម្តងនៅពេលបង្កើត។ |
| `readOnly` | `boolean` | បិទ/បើក​របៀប​អាន​តែប៉ុណ្ណោះ។ |
| `disabled` | `boolean` | បិទកម្មវិធីនិពន្ធ។ |
| `className`, `style` |  | បានអនុវត្តទៅលើការរុំ `<div>`។ |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | prop (`id`, `data-*`, `aria-*`, ...) ផ្សេងទៀតត្រូវបានអនុវត្តទៅការរុំ `<div>`។ `children` ត្រូវបានមិនអើពើ។ |
| `ref` | `SunEditorInstance \| null` | ឧទាហរណ៍របស់អ្នកកែសម្រួល។ |

ជម្រើស​ផ្សេង​ក្រៅពី `events` និង `theme` នឹង​ត្រូវ​បាន​អនុវត្ត​នៅ​ពេល​ដែល​កម្មវិធី​និពន្ធ​ត្រូវ​បាន​បង្កើត។
ដើម្បីផ្លាស់ប្តូរពួកវានៅពេលក្រោយ សូមដំឡើងឡើងវិញជាមួយ `key` ផ្សេង ឬទូរស័ព្ទទៅ `ref.current.resetOptions()`។

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

ម៉ាស៊ីនគ្រប់ប្រភេទក៏មានចាប់ពី `suneditor/types` ផងដែរ។

## កំណត់ចំណាំ Next.js

- សមាសភាគនេះគឺជាម៉ូឌុលអតិថិជន (`"use client"` គឺស្ថិតនៅក្នុងលទ្ធផលសាងសង់) ហើយផ្ទុកម៉ាស៊ីនតែនៅក្នុងកម្មវិធីរុករកប៉ុណ្ណោះ ដូច្នេះវាអាចត្រូវបានបង្ហាញពីសមាសភាគម៉ាស៊ីនមេដោយផ្ទាល់។
- រក្សា `suneditor` ឲ្យឆ្ងាយពីការនាំចូលឋិតិវន្តនៅក្នុងសមាសធាតុអតិថិជន។ ប្រើទម្រង់ `options={(se) => ...}` ដើម្បីទៅដល់ `se.plugins`។
- ការនាំចូល CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) ដំណើរការទាំងនៅក្នុង App Router និង Pages Router។
