<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

`suneditor` 3.4.1 یا بعد کی ضرورت ہے (`editor.events` کا استعمال React props کو تار کرنے کے لئے کیا جاتا ہے)۔

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

`options` سستی سے بھری ہوئی `suneditor` ماڈیول (`se.plugins`, `se.langs`, `se.interfaces`, ...) وصول کرتا ہے۔
اس فارم کو Next.js میں ترجیح دیں: کلائنٹ کے جزو میں `suneditor` کو مستحکم طور پر درآمد کرنے سے سرور رینڈرنگ ٹوٹ جاتا ہے کیونکہ انجن درآمد کے وقت `window` کو چھوتا ہے۔
ایک سادہ آبجیکٹ اس وقت بھی کام کرتا ہے جب آپ سرور پیش نہیں کررہے ہیں، یا ان اختیارات کے لیے جن کو انجن درآمد کرنے کی ضرورت نہیں ہے۔
لینگویج پیک سادہ آبجیکٹ ہیں اور اسے ہمیشہ مستحکم طور پر درآمد کیا جا سکتا ہے: `import ko from 'suneditor/langs/ko'`۔

### کنٹرول شدہ قدر

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value` کو آخری `onChange` نتیجہ کے علاوہ کسی اور چیز میں تبدیل کرنا ایڈیٹر کے مواد کو بدل دیتا ہے۔
ایک بے قابو ایڈیٹر کے لیے `value` کو چھوڑ دیں اور جب آپ کو ضرورت ہو تو مثال سے مواد پڑھیں۔

### مثال تک رسائی

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` وہ آبجیکٹ ہے جو `suneditor.create()` کے ذریعہ واپس کیا گیا ہے، لہذا پورا انجن API دستیاب ہے۔

### Events

ہینڈلرز کو `options.events` سے پاس کریں۔ وہ ہر رینڈر پر دوبارہ مطابقت پذیر ہوتے ہیں، لہذا وہ محفوظ طریقے سے React حالت میں بند ہو سکتے ہیں۔

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

ایک انجن مثال (ٹول بار، پلگ ان، ایونٹس، تھیم) کئی قابل تدوین علاقوں کے ساتھ۔ ایک `<SunEditorRoot>` فی رقبہ `<SunEditorGroup>` کے اندر رکھیں؛ کوئی دوسرا JSX ان کے درمیان بیٹھ سکتا ہے۔ گروپ اپنا کوئی عنصر پیش نہیں کرتا ہے۔

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` انجن ہے `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`)۔
- ہر جڑ کا اپنا اپنا `value` / `onChange`, `readOnly`, `disabled` اور فریم `options` (`height`, `placeholder`, `iframe`, ...) ہوتا ہے۔
- انجن کو مشترکہ ٹول بار کے لیے `toolbar_container` کی ضرورت ہے جب تک کہ `mode` `inline` یا `balloon` نہ ہو۔
- جب گروپ ماؤنٹ ہوتا ہے تو جڑیں جمع کی جاتی ہیں۔ انجن بعد میں جڑیں شامل یا ہٹا نہیں سکتا، اس لیے گروپ کے `key` کو تبدیل کرکے اسے مختلف جڑوں کے ساتھ دوبارہ بنائیں۔

## Props

| Prop | قسم | تفصیل |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | ایڈیٹر ایچ ٹی ایم ایل (کنٹرولڈ)۔ |
| `onChange` | `(html: string) => void` | ہر مواد کی تبدیلی پر کال کی جاتی ہے۔ `options.events.onChange` کے لیے شارٹ ہینڈ۔ |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor init اختیارات۔ `events` اور `theme` لائیو لاگو ہوتے ہیں۔ باقی سب کچھ تخلیق کے وقت ایک بار لاگو ہوتا ہے۔ |
| `readOnly` | `boolean` | صرف پڑھنے کے موڈ کو ٹوگل کریں۔ |
| `disabled` | `boolean` | ایڈیٹر کو غیر فعال کریں۔ |
| `className`, `style` |  | ریپنگ `<div>` پر لاگو کیا گیا۔ |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | کوئی اور prop (`id`, `data-*`, `aria-*`, ...) ریپنگ `<div>` پر لاگو ہوتا ہے۔ `children` کو نظر انداز کر دیا گیا ہے۔ |
| `ref` | `SunEditorInstance \| null` | ایڈیٹر کی مثال۔ |

ایڈیٹر بننے پر `events` اور `theme` کے علاوہ دیگر اختیارات لاگو ہوتے ہیں۔
انہیں بعد میں تبدیل کرنے کے لیے، ایک مختلف `key` کے ساتھ دوبارہ ماؤنٹ کریں یا `ref.current.resetOptions()` پر کال کریں۔

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

## Next.js نوٹس

- جزو ایک کلائنٹ ماڈیول ہے (`"use client"` بلڈ آؤٹ پٹ میں ہے) اور انجن کو صرف براؤزر میں لوڈ کرتا ہے، لہذا اسے سرور کے جزو سے براہ راست پیش کیا جا سکتا ہے۔
- کلائنٹ کے اجزاء میں `suneditor` کو جامد درآمدات سے باہر رکھیں۔ `se.plugins` تک پہنچنے کے لیے `options={(se) => ...}` فارم استعمال کریں۔
- CSS درآمدات (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) App Router اور Pages Router دونوں میں کام کرتی ہیں۔
