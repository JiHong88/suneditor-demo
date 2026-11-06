<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

پێکهاتەکە پێویستی بە بزوێنەری [SunEditor](https://www.npmjs.com/package/suneditor) هەیە هەروەها (وابەستەیی هاوتا، 3.4.1 یان دواتر)

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

`options` وەک خۆی ڕادەستی `suneditor.create()` دەکرێت، بۆیە هەموو بژاردەیەک و پێوەکراوێک و دوگمەیەک و ڕووداو و زمانێک هی بزوێنەرەکەیە.\
ئەم README تەنها ئەو شتانە دەگرێتەوە کە پێکهاتەی React زیاد دەکات؛ بۆ خودی بژاردەکان سەیری پاکێجی [SunEditor بەڵگەنامە](https://suneditor.com) یان [`suneditor`](https://www.npmjs.com/package/suneditor) بکە.

`options` مۆدیۆلی `suneditor` کە بە تەمبەڵی بارگاوی کراوە (`se.plugins`، `se.langs`، `se.interfaces`، ...) وەردەگرێت.\
ئەم فۆڕمە لە Next.jsدا پێ باشترە: هاوردەکردنی `suneditor` بە شێوەیەکی ئیستاتیک لە پێکهاتەی کرێدەردا ڕەندەری سێرڤەر دەشکێنێت چونکە بزوێنەرەکە دەست لە `window` دەدات لە کاتی هاوردەکردندا.\
هەروەها شتێکی سادە کاردەکات کاتێک تۆ ڕەندەری سێرڤەر نیت، یان بۆ ئەو هەڵبژاردنانەی کە پێویستیان بە هاوردەکردنی بزوێنەر نییە.\
پاکەتەکانی زمان شتگەلێکی سادەن و هەمیشە دەتوانرێت بە شێوەیەکی ئیستاتیک هاوردە بکرێن: `import ko from 'suneditor/langs/ko'`.

### بەهای کۆنترۆڵکراو

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

گۆڕینی `value` بۆ شتێکی تر جگە لە ئەنجامی کۆتایی `onChange` جێگەی ناوەڕۆکی دەستکاریکەر دەگرێتەوە.
`value` بۆ دەستکاریکەرێکی کۆنترۆڵنەکراو لاببە و ناوەڕۆکەکە لە نموونەکە بخوێنەرەوە کاتێک پێویستت پێی دەبێت.

### دەستڕاگەیشتن بە نموونە

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` ئەو شتەیە کە لەلایەن `suneditor.create()` دەگەڕێتەوە، بۆیە تەواوی APIی بزوێنەر بەردەستە.

### Events

تێپەڕاندنی مامەڵەکاران لە ڕێگەی `options.events`. لە هەموو ڕێندەرێکدا دووبارە هاوکات دەکرێنەوە، بۆیە دەتوانن بە سەلامەتی لە سەر دۆخی React دابخەن.

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

### Toolbar یان status bar لە توخمێکی تردا

هەڵبژاردەکانی بزوێنەر کە توخمێکی DOM وەردەگرن لەگەڵ refs کاردەکەن چونکە فەنکشنی `options` دوای جێگیرکردن کاردەکات:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

یەک نموونەی بزوێنەر (تۆلبار، پێوەکراوەکان، ڕووداوەکان، تەوەر) لەگەڵ چەندین ناوچەی دەستکاریکراو. `<SunEditorRoot>` بۆ هەر ڕووبەرێک لە ناوەوە `<SunEditorGroup>` دابنێ؛ هەر JSX ێکی تر دەتوانێت لە نێوانیاندا دابنیشێت. گروپەکە هیچ توخمێکی تایبەت بە خۆی نادات.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` بریتیە لە بزوێنەر `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- هەر ڕەگێک `value` / `onChange`، `readOnly`، `disabled` و چوارچێوەی `options` (`height`، `placeholder`، `iframe`، ...)ی خۆی هەیە.
- بزوێنەر پێویستی بە `toolbar_container` هەیە بۆ توولباری هاوبەش مەگەر `mode` `inline` یان `balloon` بێت.
- ڕەگەکان کۆدەکرێنەوە کاتێک گروپەکە جێگیر دەبێت. بزوێنەرەکە ناتوانێت دواتر ڕەگ زیاد بکات یان لاببات، بۆیە `key` ی گروپەکە بگۆڕە بۆ ئەوەی بە ڕەگی جیاواز دروستی بکەیتەوە.

## Props

| Prop | جۆر | وەسف |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | دەستکاریکەر HTML (کۆنتڕۆڵ دەکرێت). |
| `onChange` | `(html: string) => void` | بانگەوازی بۆ هەموو گۆڕانکارییەکی ناوەڕۆک. کورتەنووسی بۆ `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor بژاردەکان](https://suneditor.com)، بەبێ گۆڕانکاری بەسەردا تێپەڕیوە. `events` و `theme` بە شێوەیەکی ڕاستەوخۆ جێبەجێ دەکرێن. هەموو شتێکی تر جارێک لە کاتی دروستکردندا جێبەجێ دەکرێت. |
| `readOnly` | `boolean` | دۆخی تەنها خوێندنەوە بگۆڕە. |
| `disabled` | `boolean` | دەستکاریکەرەکە لەکاربخە. |
| `className`, `style` |  | لە پێچانەکەدا دەدرێت `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | هەر prop (`id`، `data-*`، `aria-*`، ...) ی تر دەخرێتە سەر پێچانی `<div>`. `children` پشتگوێ دەخرێت. |
| `ref` | `SunEditorInstance \| null` | نموونەی سەرنوسەر. |

هەڵبژاردەکانی تر جگە لە `events` و `theme` کاتێک دەستکاریکەرەکە دروست دەکرێت جێبەجێ دەکرێن.
بۆ گۆڕینی دواتر، بە `key` جیاواز دووبارە دایبگرە یان پەیوەندی بە `ref.current.resetOptions()` بکە.

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

هەروەها هەموو جۆرەکانی بزوێنەر لە `suneditor/types` دەست دەکەوێت.

## Next.js تێبینی

- پێکهاتەکە مۆدیولێکی کرێدەرە (`"use client"` لە دەرچوونی دروستکردندایە) و بزوێنەرەکە تەنها لە وێبگەڕەکەدا باردەکات، بۆیە دەتوانرێت ڕاستەوخۆ لە پێکهاتەیەکی سێرڤەرەوە ڕەندەر بکرێت.
- `suneditor` لە هاوردەکردنی ئیستاتیک لە پێکهاتەکانی کرێدەردا بهێڵەرەوە. بۆ گەیشتن بە `se.plugins` فۆڕمی `options={(se) => ...}` بەکاربهێنە.
- هاوردەکردنی CSS (`suneditor/css/editor`، `suneditor/css/contents`، `suneditor/src/themes/*.css`) لە هەردوو App Router و Pages Router کاردەکات.
