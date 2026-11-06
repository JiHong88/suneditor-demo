<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

يحتاج المكون أيضًا إلى محرك [SunEditor](https://www.npmjs.com/package/suneditor) (تبعية نظيرة، 3.4.1 أو أحدث)

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

يتم تسليم `options` إلى `suneditor.create()` كما هي، لذا فإن كل خيار، ومكون إضافي، وزر، وحدث، ولغة هي ملك للمحرك.\
يغطي ملف README هذا فقط ما يضيفه المكون React؛ للاطلاع على الخيارات نفسها، راجع الحزمة [SunEditor وثائق](https://suneditor.com) أو الحزمة [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` يستقبل الوحدة `suneditor` المحملة بشكل كسول (`se.plugins`، `se.langs`، `se.interfaces`، ...).\
يفضل هذا الشكل في Next.js: استيراد `suneditor` بشكل ثابت في مكون العميل يعطل عرض الخادم لأن المحرك يلمس `window` في وقت الاستيراد.\
يعمل الكائن البسيط أيضًا عندما لا تقوم بعرض الخادم، أو بالنسبة للخيارات التي لا تحتاج إلى استيراد المحرك.\
حزم اللغات عبارة عن كائنات بسيطة ويمكن استيرادها دائمًا بشكل ثابت: `import ko from 'suneditor/langs/ko'`.

### القيمة الخاضعة للتحكم

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

يؤدي تغيير `value` إلى شيء آخر غير النتيجة الأخيرة `onChange` إلى استبدال محتوى المحرر.
احذف `value` للحصول على محرر غير متحكم به واقرأ المحتوى من النسخة عندما تحتاج إليه.

### الوصول إلى المثيل

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` هو الكائن الذي تم إرجاعه بواسطة `suneditor.create()`، لذا فإن واجهة برمجة التطبيقات الكاملة للمحرك متاحة.

### Events

مرر المعالجات عبر `options.events`. تتم إعادة مزامنتها في كل عملية عرض، لذا يمكنها الإغلاق بأمان فوق الحالة React.

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

### شريط الأدوات أو شريط الحالة في عنصر آخر

خيارات المحرك التي تأخذ عنصر DOM تعمل مع المراجع لأن الدالة `options` تعمل بعد التحميل:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

مثيل واحد للمحرك (شريط الأدوات، الإضافات، الأحداث، المظهر) مع عدة مناطق قابلة للتعديل. ضع `<SunEditorRoot>` لكل منطقة داخل `<SunEditorGroup>`؛ يمكن وضع أي JSX آخر بينهما. لا تقوم المجموعة بعرض أي عنصر خاص بها.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` هو المحرك `rootKey` (`ref.current.changeFrameContext('body')`، `html.get({ rootKey: 'body' })`).
- كل جذر له إطاره الخاص `value` / `onChange`، `readOnly`، `disabled` وإطاره `options` (`height`، `placeholder`، `iframe`، ...).
- يحتاج المحرك إلى `toolbar_container` لشريط الأدوات المشترك ما لم يكن `mode` هو `inline` أو `balloon`.
- يتم جمع الجذور عند تركيب المجموعة. لا يمكن للمحرك إضافة أو إزالة الجذور لاحقًا، لذا قم بتغيير `key` للمجموعة لإعادة إنشائها بجذور مختلفة.

## Props

| Prop | يكتب | وصف |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | محرر HTML (خاضع للتحكم). |
| `onChange` | `(html: string) => void` | يتم استدعاؤه عند كل تغيير في المحتوى. اختصار لـ `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor خيارات](https://suneditor.com)، يتم تمريره دون تغيير. `events` و `theme` يتم تطبيقهما مباشرة. كل شيء آخر يتم تطبيقه مرة واحدة عند الإنشاء. |
| `readOnly` | `boolean` | قم بتبديل وضع القراءة فقط. |
| `disabled` | `boolean` | قم بتعطيل المحرر. |
| `className`, `style` |  | تم تطبيقه على الغلاف `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | يتم تطبيق أي prop آخر (`id`، `data-*`، `aria-*`، ...) على الغلاف `<div>`. يتم تجاهل `children`. |
| `ref` | `SunEditorInstance \| null` | نسخة المحرر. |

يتم تطبيق الخيارات الأخرى غير `events` و `theme` عند إنشاء المحرر.
لتغييرها لاحقًا، أعد تركيبها باستخدام `key` مختلف أو اتصل بـ `ref.current.resetOptions()`.

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

جميع أنواع المحركات متوفرة أيضًا بدءًا من `suneditor/types`.

## ملاحظات Next.js

- المكون عبارة عن وحدة عميل (`"use client"` موجود في مخرجات البناء) ويقوم بتحميل المحرك فقط في المتصفح، لذلك يمكن عرضه من مكون الخادم مباشرة.
- تجنب استخدام `suneditor` في عمليات الاستيراد الثابتة في مكونات العميل. استخدم الصيغة `options={(se) => ...}` للوصول إلى `se.plugins`.
- تعمل عمليات استيراد CSS (`suneditor/css/editor`، `suneditor/css/contents`، `suneditor/src/themes/*.css`) في كل من App Router و Pages Router.
