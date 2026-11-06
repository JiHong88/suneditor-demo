<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

דורש `suneditor` 3.4.1 או גרסה מתקדמת יותר (`editor.events` משמש לחיווט ה-React props).

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

`options` מקבל את מודול `suneditor` שנטען בעצלתיים ‏(`se.plugins`, `se.langs`, `se.interfaces`, ...).
מעדיפים טופס זה ב-Next.js: ייבוא ​​סטטי של `suneditor` ברכיב לקוח משבש את תהליך הרינדור של השרת מכיוון שהמנוע נוגע ב-`window` בזמן הייבוא.
אובייקט רגיל עובד גם כשאתה לא מבצע רינדור בשרת, או עבור אפשרויות שאינן דורשות ייבוא ​​מנוע.
חבילות שפה הן אובייקטים רגילים ותמיד ניתן לייבא אותן באופן סטטי: `import ko from 'suneditor/langs/ko'`.

### ערך מבוקר

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

שינוי `value` למשהו שאינו התוצאה האחרונה `onChange` מחליף את תוכן העורך.
השמט את `value` עבור עורך בלתי מבוקר וקרא את התוכן מהמופע כשאתה זקוק לו.

### גישה למופע

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` הוא האובייקט המוחזר על ידי `suneditor.create()`, כך שכל ה-API של המנוע זמין.

### Events

מעבירים מטפלים דרך `options.events`. הם מסונכרנים מחדש בכל רינדור, כך שהם יכולים להיסגר בבטחה מעל מצב React.

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

### סרגל כלים או סרגל מצב באלמנט אחר

אפשרויות מנוע שמקבלות אלמנט DOM פועלות עם הפניות מכיוון שהפונקציה `options` פועלת לאחר ההרכבה:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

מופע מנוע אחד (סרגל כלים, תוספים, אירועים, ערכת נושא) עם מספר אזורים הניתנים לעריכה. יש להכניס `<SunEditorRoot>` לכל אזור בתוך `<SunEditorGroup>`; כל JSX אחר יכול לשבת ביניהם. הקבוצה לא מעבדת אלמנט משלה.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` הוא המנוע `rootKey` ‏(`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- לכל שורש יש `value` / `onChange`, `readOnly`, `disabled` ומסגרת `options` (`height`, `placeholder`, `iframe`, ...) משלו.
- המנוע זקוק ל-`toolbar_container` עבור סרגל הכלים המשותף אלא אם כן `mode` הוא `inline` או `balloon`.
- שורשים נאספים כאשר הקבוצה עולה. המנוע לא יכול להוסיף או להסיר שורשים מאוחר יותר, לכן יש לשנות את `key` של הקבוצה כדי ליצור אותה מחדש עם שורשים שונים.

## Props

| Prop | סוּג | תֵאוּר |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | עורך HTML (מבוקר). |
| `onChange` | `(html: string) => void` | נקרא בכל שינוי תוכן. קיצור של `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | אפשרויות init של SunEditor. `events` ו-`theme` מוחלים בזמן אמת. כל השאר מוחל פעם אחת בעת היצירה. |
| `readOnly` | `boolean` | הפעל/י מצב קריאה בלבד. |
| `disabled` | `boolean` | השבת את העורך. |
| `className`, `style` |  | מוחל על העטיפה `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | כל prop אחר (`id`, `data-*`, `aria-*`, ...) מוחל על העטיפה `<div>`. `children` מתעלמים ממנה. |
| `ref` | `SunEditorInstance \| null` | מופע העורך. |

אפשרויות אחרות מלבד `events` ו-`theme` מוחלות בעת יצירת העורך.
כדי לשנות אותם מאוחר יותר, טען מחדש עם `key` אחר או קרא ל-`ref.current.resetOptions()`.

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

כל סוגי המנועים זמינים גם מ-`suneditor/types`.

## Next.js הערות

- הרכיב הוא מודול לקוח (`"use client"` נמצא בפלט הבנייה) וטוען את המנוע רק בדפדפן, כך שניתן לרנדר אותו ישירות מרכיב שרת.
- יש להרחיק את `suneditor` מייבוא ​​סטטי ברכיבי לקוח. יש להשתמש בטופס `options={(se) => ...}` כדי להגיע ל-`se.plugins`.
- ייבוא ​​CSS ‏(`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) פועל גם ב-App Router וגם ב-Pages Router.
