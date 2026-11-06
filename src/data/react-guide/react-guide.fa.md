<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

این کامپوننت به موتور [SunEditor](https://www.npmjs.com/package/suneditor) نیز نیاز دارد (وابستگی همتا، ۳.۴.۱ یا بالاتر)

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

‎`options` به همین صورت به ‎`suneditor.create()`‎ تحویل داده می‌شود، بنابراین هر گزینه، افزونه، دکمه، رویداد و زبان متعلق به موتور است.\
این README فقط مواردی را که کامپوننت React اضافه می‌کند پوشش می‌دهد؛ برای خود گزینه‌ها به بسته [مستندات SunEditor](https://suneditor.com) یا [`suneditor`](https://www.npmjs.com/package/suneditor) مراجعه کنید.

‎`options` ماژول `suneditor` که با بارگذاری تنبل بارگذاری شده است (`se.plugins`، `se.langs`، `se.interfaces`، ...) را دریافت می‌کند.\
این فرم را در Next.js ترجیح می‌دهم: وارد کردن `suneditor` به صورت استاتیک در یک کامپوننت کلاینت، رندر سرور را مختل می‌کند زیرا موتور در زمان وارد کردن به `window` می‌رسد.\
یک شیء ساده همچنین زمانی که رندرینگ سرور انجام نمی‌دهید یا برای گزینه‌هایی که نیازی به وارد کردن موتور ندارند، کار می‌کند.\
بسته‌های زبان اشیاء ساده‌ای هستند و همیشه می‌توانند به صورت استاتیک وارد شوند: `import ko from 'suneditor/langs/ko'`.

### مقدار کنترل‌شده

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

تغییر `value` به چیزی غیر از نتیجه `onChange` آخر، محتوای ویرایشگر را جایگزین می‌کند.
برای ویرایشگر کنترل نشده، `value` را حذف کنید و در صورت نیاز، محتوا را از نمونه بخوانید.

### دسترسی به نمونه

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` شیء برگردانده شده توسط `suneditor.create()` است، بنابراین کل API موتور در دسترس است.

### Events

کنترل‌کننده‌ها را از طریق `options.events` عبور دهید. آن‌ها در هر رندر دوباره همگام‌سازی می‌شوند، بنابراین می‌توانند با خیال راحت روی حالت React بسته شوند.

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

### نوار ابزار یا نوار وضعیت در عنصر دیگر

گزینه‌های موتور که یک عنصر DOM می‌گیرند با refها کار می‌کنند زیرا تابع `options` بعد از mount اجرا می‌شود:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

یک نمونه موتور (نوار ابزار، افزونه‌ها، رویدادها، قالب) با چندین ناحیه قابل ویرایش. به ازای هر ناحیه، یک `<SunEditorRoot>` داخل `<SunEditorGroup>` قرار دهید؛ هر JSX دیگری می‌تواند بین آنها قرار گیرد. این گروه هیچ عنصری از خود را رندر نمی‌کند.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` موتور `rootKey` است (`ref.current.changeFrameContext('body')`، `html.get({ rootKey: 'body' })`).
- هر ریشه `value` / `onChange`، `readOnly`، `disabled` و فریم `options` (`height`، `placeholder`، `iframe`، ...) مخصوص به خود را دارد.
- موتور برای نوار ابزار مشترک به `toolbar_container` نیاز دارد، مگر اینکه `mode` `inline` یا `balloon` باشد.
- Roots are collected when the group mounts. The engine cannot add or remove roots later, so change the group's `key` to recreate it with different roots.

## Props

| Prop | نوع | توضیحات |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | ویرایشگر HTML (کنترل‌شده). |
| `onChange` | `(html: string) => void` | با هر تغییر محتوا فراخوانی می‌شود. مخفف `options.events.onChange` است. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | ‎[SunEditor گزینه](https://suneditor.com)‎، بدون تغییر منتقل می‌شود. ‎`events`‎ و ‎`theme`‎ به صورت زنده اعمال می‌شوند. هر چیز دیگری یک بار در زمان ایجاد اعمال می‌شود. |
| `readOnly` | `boolean` | حالت فقط خواندنی را فعال یا غیرفعال کنید. |
| `disabled` | `boolean` | ویرایشگر را غیرفعال کنید. |
| `className`, `style` |  | روی بسته‌بندی `<div>` اعمال می‌شود. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | هر prop دیگری (`id`، `data-*`، `aria-*`، ...) روی بسته‌بندی `<div>` اعمال می‌شود. `children` نادیده گرفته می‌شود. |
| `ref` | `SunEditorInstance \| null` | نمونه‌ی ویرایشگر. |

گزینه‌هایی غیر از `events` و `theme` هنگام ایجاد ویرایشگر اعمال می‌شوند.
برای تغییر آنها بعداً، با یک `key` متفاوت دوباره حساب کنید یا با `ref.current.resetOptions()` تماس بگیرید.

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

همه نوع موتور از `suneditor/types` نیز موجود است.

## Next.js یادداشت

- این کامپوننت یک ماژول کلاینت است (`"use client"` در خروجی ساخت است) و موتور را فقط در مرورگر بارگذاری می‌کند، بنابراین می‌تواند مستقیماً از یک کامپوننت سرور رندر شود.
- `suneditor` را از ایمپورت‌های استاتیک در کامپوننت‌های کلاینت دور نگه دارید. برای رسیدن به `se.plugins` از فرم `options={(se) => ...}` استفاده کنید.
- ایمپورت‌های CSS (`suneditor/css/editor`، `suneditor/css/contents`، `suneditor/src/themes/*.css`) هم در App Router و هم در Pages Router کار می‌کنند.
