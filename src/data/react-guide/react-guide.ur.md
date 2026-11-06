<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

اجزاء کو [SunEditor](https://www.npmjs.com/package/suneditor) انجن کی بھی ضرورت ہے (ہم پر انحصار، 3.4.1 یا بعد کا)

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

`options` `suneditor.create()` جیسا ہے کے حوالے کیا جاتا ہے، لہذا ہر آپشن، پلگ ان، بٹن، ایونٹ اور زبان انجن کی اپنی ہے۔\
یہ README صرف وہی احاطہ کرتا ہے جو React جزو شامل کرتا ہے۔ اختیارات کے لیے خود [SunEditor دستاویزات](https://suneditor.com) یا [`suneditor`](https://www.npmjs.com/package/suneditor) پیکیج دیکھیں۔

`options` سستی سے بھری ہوئی `suneditor` ماڈیول (`se.plugins`, `se.langs`, `se.interfaces`, ...) وصول کرتا ہے۔\
اس فارم کو Next.js میں ترجیح دیں: کلائنٹ کے جزو میں `suneditor` کو مستحکم طور پر درآمد کرنے سے سرور رینڈرنگ ٹوٹ جاتا ہے کیونکہ درآمد کے وقت انجن `window` کو چھوتا ہے۔\
ایک سادہ آبجیکٹ اس وقت بھی کام کرتا ہے جب آپ سرور پیش نہیں کررہے ہیں، یا ان اختیارات کے لیے جن کو انجن درآمد کرنے کی ضرورت نہیں ہے۔\
لینگویج پیک سادہ آبجیکٹ ہیں اور اسے ہمیشہ جامد طور پر درآمد کیا جا سکتا ہے: `import ko from 'suneditor/langs/ko'`۔

### کنٹرول شدہ قدر

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value` کو آخری `onChange` نتیجہ کے علاوہ کسی اور چیز میں تبدیل کرنے سے ایڈیٹر کے مواد کو تبدیل کر دیا جاتا ہے۔
ایک بے قابو ایڈیٹر کے لیے `value` کو چھوڑ دیں اور جب آپ کو ضرورت ہو تو مثال سے مواد پڑھیں۔

### مثال تک رسائی

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` وہ آبجیکٹ ہے جسے `suneditor.create()` کے ذریعے واپس کیا گیا ہے، اس لیے پورا انجن API دستیاب ہے۔

### Events

ہینڈلرز کو `options.events` سے گزریں۔ وہ ہر رینڈر پر دوبارہ مطابقت پذیر ہوتے ہیں، اس لیے وہ محفوظ طریقے سے React حالت میں بند ہو سکتے ہیں۔

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

### دوسرے عنصر میں ٹول بار یا اسٹیٹس بار

انجن کے اختیارات جو DOM عنصر لیتے ہیں وہ refs کے ساتھ کام کرتے ہیں کیونکہ `options` فنکشن ماؤنٹ کے بعد چلتا ہے:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

ایک انجن مثال (ٹول بار، پلگ ان، ایونٹس، تھیم) کئی قابل تدوین علاقوں کے ساتھ۔ ایک `<SunEditorRoot>` فی رقبہ `<SunEditorGroup>` کے اندر رکھیں۔ کوئی دوسرا JSX ان کے درمیان بیٹھ سکتا ہے۔ گروپ اپنا کوئی عنصر پیش نہیں کرتا ہے۔

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` انجن `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`) ہے۔
- ہر جڑ کا اپنا `value` / `onChange`, `readOnly`, `disabled` اور فریم `options` (`height`, `placeholder`, `iframe`, ...) ہوتا ہے۔
- انجن کو مشترکہ ٹول بار کے لیے `toolbar_container` کی ضرورت ہے جب تک کہ `mode` `inline` یا `balloon` نہ ہو۔
- جب گروپ ماؤنٹ ہوتا ہے تو جڑیں جمع کی جاتی ہیں۔ انجن بعد میں جڑیں شامل یا ہٹا نہیں سکتا، اس لیے گروپ کے `key` کو تبدیل کر کے اسے مختلف جڑوں کے ساتھ دوبارہ بنائیں۔

## Props

| Prop | قسم | تفصیل |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | ایڈیٹر ایچ ٹی ایم ایل (کنٹرولڈ)۔ |
| `onChange` | `(html: string) => void` | ہر مواد کی تبدیلی پر کال کی جاتی ہے۔ `options.events.onChange` کے لیے شارٹ ہینڈ۔ |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor اختیارات](https://suneditor.com)، بغیر تبدیلی کے گزر گیا۔ `events` اور `theme` لائیو لاگو ہوتے ہیں۔ باقی سب کچھ تخلیق کے وقت ایک بار لاگو ہوتا ہے۔ |
| `readOnly` | `boolean` | صرف پڑھنے کے موڈ کو ٹوگل کریں۔ |
| `disabled` | `boolean` | ایڈیٹر کو غیر فعال کریں۔ |
| `className`, `style` |  | ریپنگ `<div>` پر لاگو ہوتا ہے۔ |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | کوئی دوسرا prop (`id`, `data-*`, `aria-*`, ...) ریپنگ `<div>` پر لاگو ہوتا ہے۔ `children` نظر انداز کر دیا گیا ہے۔ |
| `ref` | `SunEditorInstance \| null` | ایڈیٹر کی مثال۔ |

ایڈیٹر بننے پر `events` اور `theme` کے علاوہ آپشنز لاگو ہوتے ہیں۔
انہیں بعد میں تبدیل کرنے کے لیے، ایک مختلف `key` کے ساتھ دوبارہ ماؤنٹ کریں یا `ref.current.resetOptions()` کال کریں۔

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

انجن کی تمام اقسام `suneditor/types` سے بھی دستیاب ہیں۔

## Next.js نوٹ

- جزو ایک کلائنٹ ماڈیول ہے (`"use client"` بلڈ آؤٹ پٹ میں ہے) اور انجن کو صرف براؤزر میں لوڈ کرتا ہے، لہذا اسے سرور کے جزو سے براہ راست پیش کیا جا سکتا ہے۔
- کلائنٹ کے اجزاء میں `suneditor` کو جامد درآمدات سے دور رکھیں۔ `se.plugins` تک پہنچنے کے لیے `options={(se) => ...}` فارم استعمال کریں۔
- CSS درآمدات (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) App Router اور Pages Router دونوں میں کام کرتی ہیں۔
