<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Компоненту також потрібен рушій [SunEditor](https://www.npmjs.com/package/suneditor) (залежність від вузла, 3.4.1 або пізніша версія)

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

`options` передається до `suneditor.create()` як є, тому кожен параметр, плагін, кнопка, подія та мова є власними для рушія.\
Цей README-файл охоплює лише те, що додає компонент React; самі опції дивіться в пакеті [SunEditor документація](https://suneditor.com) або [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` отримує ліниво завантажений модуль `suneditor` (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Надайте перевагу такій формі в Next.js: статичний імпорт `suneditor` у клієнтський компонент перериває рендеринг на сервері, оскільки рушій торкається `window` під час імпорту.\
Звичайний об'єкт також працює, коли ви не виконуєте рендеринг на сервері або для опцій, які не потребують імпорту з движка.\
Мовні пакети є звичайними об'єктами та завжди можуть бути імпортовані статично: `import ko from 'suneditor/langs/ko'`.

### Контрольоване значення

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Зміна `value` на щось інше, ніж останній результат `onChange`, замінює вміст редактора.
Пропустіть `value` для неконтрольованого редактора та зчитуйте вміст екземпляра, коли вам це потрібно.

### Доступ до екземплярів

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` – це об'єкт, що повертається `suneditor.create()`, тому доступний весь API рушія.

### Events

Передати обробники через `options.events`. Вони повторно синхронізуються під час кожного рендерингу, тому їх можна безпечно закрити у стані React.

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

### Панель інструментів або рядок стану в іншому елементі

Опції рушія, що приймають елемент DOM, працюють з посиланнями, оскільки функція `options` виконується після монтування:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Один екземпляр рушія (панель інструментів, плагіни, події, тема) з кількома областями для редагування. Поставте `<SunEditorRoot>` для кожної області всередині `<SunEditorGroup>`; будь-який інший JSX може розташовуватися між ними. Група не відтворює жодного власного елемента.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` – це двигун `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Кожен корінь має свої власні `value` / `onChange`, `readOnly`, `disabled` та систему відліку `options` (`height`, `placeholder`, `iframe`, ...).
- Двигуну потрібен `toolbar_container` для спільної панелі інструментів, окрім випадків, коли `mode` дорівнює `inline` або `balloon`.
- Коріння збирається під час монтування групи. Двигун не може додавати або видаляти коріння пізніше, тому змініть `key` групи, щоб відтворити її з іншими коренями.

## Props

| Prop | Тип | Опис |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Редактор HTML (керований). |
| `onChange` | `(html: string) => void` | Викликається при кожній зміні вмісту. Скорочення від `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor варіантів](https://suneditor.com), пропускається без змін. `events` та `theme` застосовуються в режимі реального часу. Все інше застосовується один раз під час створення. |
| `readOnly` | `boolean` | Увімкнути/вимкнути режим лише для читання. |
| `disabled` | `boolean` | Вимкніть редактор. |
| `className`, `style` |  | Застосовується до обгортки `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Будь-яке інше значення prop (`id`, `data-*`, `aria-*`, ...) застосовується до обгортки `<div>`. `children` ігнорується. |
| `ref` | `SunEditorInstance \| null` | Екземпляр редактора. |

Опції, відмінні від `events` та `theme`, застосовуються під час створення редактора.
Щоб змінити їх пізніше, перемонтуйте їх з іншим `key` або викличте `ref.current.resetOptions()`.

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

Усі типи двигунів також доступні з `suneditor/types`.

## Next.js нотатки

- Компонент є клієнтським модулем (`"use client"` є у виводі збірки) та завантажує рушій лише у браузері, тому його можна відобразити безпосередньо з серверного компонента.
- Уникайте `suneditor` у статичних імпортах клієнтських компонентів. Використовуйте форму `options={(se) => ...}` для досягнення `se.plugins`.
- Імпорт CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) працює як у App Router, так і в Pages Router.
