<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

يتطلب `suneditor` 3.4.1 أو أحدث (يتم استخدام `editor.events` لتوصيل React props).

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

`options` يستقبل وحدة `suneditor` المحملة بشكل كسول (`se.plugins`, `se.langs`, `se.interfaces`, ...).
يفضل استخدام هذا الشكل في Next.js: استيراد `suneditor` بشكل ثابت في مكون العميل يعطل عرض الخادم لأن المحرك يتعامل مع `window` في وقت الاستيراد.
يعمل الكائن البسيط أيضًا عندما لا تقوم بعرض الخادم، أو بالنسبة للخيارات التي لا تحتاج إلى استيراد المحرك.
حزم اللغات عبارة عن كائنات بسيطة ويمكن استيرادها دائمًا بشكل ثابت: `import ko from 'suneditor/langs/ko'`.

### القيمة الخاضعة للتحكم

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

يؤدي تغيير `value` إلى شيء آخر غير نتيجة `onChange` الأخيرة إلى استبدال محتوى المحرر.
احذف `value` للحصول على محرر غير متحكم به واقرأ المحتوى من النسخة عندما تحتاج إليه.

### الوصول إلى المثيل

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` هو الكائن الذي يتم إرجاعه بواسطة `suneditor.create()`، لذا فإن واجهة برمجة التطبيقات الكاملة للمحرك متاحة.

### Events

مرر المعالجات عبر `options.events`. تتم إعادة مزامنتها في كل عملية عرض، لذا يمكنها الإغلاق بأمان فوق حالة React.

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

مثيل واحد للمحرك (شريط الأدوات، الإضافات، الأحداث، المظهر) مع عدة مناطق قابلة للتعديل. ضع عنصر `<SunEditorRoot>` لكل منطقة داخل `<SunEditorGroup>`؛ يمكن وضع أي JSX آخر بينهما. لا تقوم المجموعة بعرض أي عنصر خاص بها.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` هو المحرك `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- لكل جذر `value` / `onChange`, `readOnly`, `disabled` وإطار `options` (`height`, `placeholder`, `iframe`, ...).
- يحتاج المحرك إلى `toolbar_container` لشريط الأدوات المشترك ما لم يكن `mode` هو `inline` أو `balloon`.
- يتم جمع الجذور عند تثبيت المجموعة. لا يمكن للمحرك إضافة أو إزالة الجذور لاحقًا، لذا قم بتغيير قيمة `key` للمجموعة لإعادة إنشائها بجذور مختلفة.

## Props

| Prop | يكتب | وصف |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | محرر HTML (خاضع للتحكم). |
| `onChange` | `(html: string) => void` | يتم استدعاؤه مع كل تغيير في المحتوى. اختصار لـ `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | خيارات تهيئة SunEditor. يتم تطبيق `events` و `theme` أثناء التشغيل. أما باقي الخيارات فيتم تطبيقها مرة واحدة عند الإنشاء. |
| `readOnly` | `boolean` | قم بتبديل وضع القراءة فقط. |
| `disabled` | `boolean` | قم بتعطيل المحرر. |
| `className`, `style` |  | تم تطبيقه على الغلاف `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | يتم تطبيق أي prop آخر (`id`, `data-*`, `aria-*`, ...) على غلاف `<div>`. يتم تجاهل `children`. |
| `ref` | `SunEditorInstance \| null` | نسخة المحرر. |

يتم تطبيق خيارات أخرى غير `events` و `theme` عند إنشاء المحرر.
لتغييرها لاحقًا، أعد تركيبها باستخدام `key` مختلف أو استدعِ `ref.current.resetOptions()`.

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

جميع أنواع المحركات متوفرة أيضًا من `suneditor/types`.

## ملاحظات Next.js

- المكون عبارة عن وحدة عميل (`"use client"` موجود في مخرجات البناء) ويقوم بتحميل المحرك فقط في المتصفح، لذلك يمكن عرضه من مكون الخادم مباشرة.
- تجنب استخدام `suneditor` في عمليات الاستيراد الثابتة في مكونات العميل. استخدم صيغة `options={(se) => ...}` للوصول إلى `se.plugins`.
- تعمل عمليات استيراد CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) في كل من App Router و Pages Router.
