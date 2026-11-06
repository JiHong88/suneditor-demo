<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Для работы компонента также необходим движок [SunEditor](https://www.npmjs.com/package/suneditor) (зависимость от других движков, версия 3.4.1 или более поздняя).

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

`options` передается `suneditor.create()` как есть, поэтому все параметры, плагины, кнопки, события и языки являются собственными для движка.\
В этом файле README описаны только возможности компонента React; информацию о самих параметрах см. в пакетах [SunEditor документация](https://suneditor.com) или [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` получает модуль `suneditor`, загружаемый с задержкой (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
В случае с Next.js предпочтительнее использовать такую ​​форму: статический импорт `suneditor` в клиентском компоненте нарушает рендеринг на сервере, поскольку движок обращается к `window` во время импорта.\
Простой объект также подходит, если рендеринг не выполняется на сервере или если не требуется импорт данных из движка.\
Языковые пакеты представляют собой простые объекты и всегда могут быть импортированы статически: `import ko from 'suneditor/langs/ko'`.

### Контролируемое значение

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Изменение значения `value` на любое другое, отличное от последнего результата `onChange`, заменяет содержимое редактора.
Опустите `value`, чтобы использовать неконтролируемый редактор, и читайте содержимое из экземпляра по мере необходимости.

### Доступ к экземпляру

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` — это объект, возвращаемый функцией `suneditor.create()`, поэтому весь API движка доступен.

### Events

Передайте обработчики через `options.events`. Они повторно синхронизируются при каждом рендеринге, поэтому их можно безопасно закрыть при переходе в состояние React.

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

### Панель инструментов или строка состояния в другом элементе

Параметры движка, принимающие DOM-элемент, работают с ссылками, поскольку функция `options` выполняется после монтирования:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Один экземпляр движка (панель инструментов, плагины, события, тема) с несколькими редактируемыми областями. Поместите `<SunEditorRoot>` в каждую область внутри `<SunEditorGroup>`; между ними может располагаться любой другой JSX-код. Группа не отображает собственные элементы.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` — это двигатель `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Каждый корень имеет свои собственные `value` / `onChange`, `readOnly`, `disabled` и рамку `options` (`height`, `placeholder`, `iframe`, ...).
- Для общей панели инструментов движку требуется `toolbar_container`, если только `mode` не равно `inline` или `balloon`.
- Корневые узлы собираются при монтировании группы. Движок не может добавлять или удалять корневые узлы позже, поэтому измените значение `key` группы, чтобы создать её заново с другими корневыми узлами.

## Props

| Prop | Тип | Описание |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-редактор (управляемый). |
| `onChange` | `(html: string) => void` | Вызывается при каждом изменении контента. Сокращенное обозначение `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor вариантов](https://suneditor.com) передается без изменений. `events` и `theme` применяются в момент создания. Все остальные применяются один раз при создании. |
| `readOnly` | `boolean` | Переключить режим только для чтения. |
| `disabled` | `boolean` | Отключите редактор. |
| `className`, `style` |  | Применено к упаковке `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Любое другое значение prop (`id`, `data-*`, `aria-*`, ...) применяется к обертке `<div>`. Значение `children` игнорируется. |
| `ref` | `SunEditorInstance \| null` | Экземпляр редактора. |

При создании редактора применяются параметры, отличные от `events` и `theme`.
Чтобы изменить их позже, переустановите с другим значением `key` или вызовите `ref.current.resetOptions()`.

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

Все типы двигателей также доступны начиная с `suneditor/types`.

## Next.js заметки

- Этот компонент представляет собой клиентский модуль (`"use client"` находится в выходных данных сборки) и загружает движок только в браузере, поэтому его можно отображать непосредственно из серверного компонента.
- Не используйте `suneditor` в статических импортах клиентских компонентов. Используйте форму `options={(se) => ...}` для получения `se.plugins`.
- Импорт CSS-элементов (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) работает как в App Router, так и в Pages Router.
