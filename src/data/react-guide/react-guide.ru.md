<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Требуется `suneditor` 3.4.1 или более поздняя версия (`editor.events` используется для подключения React props).

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

`options` получает модуль `suneditor`, загружаемый с задержкой (`se.plugins`, `se.langs`, `se.interfaces`, ...).
В компоненте Next.js предпочтительнее использовать такой формат: статический импорт `suneditor` в клиентском компоненте нарушает рендеринг на сервере, поскольку движок обращается к `window` во время импорта.
Простой объект также подходит, если рендеринг не выполняется на сервере или если не требуется импорт данных из движка.
Языковые пакеты представляют собой простые объекты и всегда могут быть импортированы статически: `import ko from 'suneditor/langs/ko'`.

### Контролируемое значение

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Изменение значения `value` на любое другое, отличное от последнего результата `onChange`, приводит к замене содержимого редактора.
Для неконтролируемого редактора опустите `value` и считывайте содержимое из экземпляра по мере необходимости.

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

Передайте обработчики через `options.events`. Они повторно синхронизируются при каждом рендеринге, поэтому могут безопасно закрыться, перейдя в состояние React.

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

Параметры движка, принимающие элемент DOM, работают со ссылками, поскольку функция `options` выполняется после монтирования:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Один экземпляр движка (панель инструментов, плагины, события, тема) с несколькими редактируемыми областями. Поместите `<SunEditorRoot>` для каждой области внутрь `<SunEditorGroup>`; между ними может располагаться любой другой JSX-файл. Группа не отображает собственные элементы.

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
- Каждый корень имеет свой собственный `value` / `onChange`, `readOnly`, `disabled` и рамку `options` (`height`, `placeholder`, `iframe`, ...).
- Для использования общей панели инструментов движку требуется `toolbar_container`, если только `mode` не равен `inline` или `balloon`.
- Корневые узлы собираются при монтировании группы. Движок не может добавлять или удалять корневые узлы позже, поэтому измените `key` группы, чтобы воссоздать её с другими корневыми узлами.

## Props

| Prop | Тип | Описание |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML-редактор (управляемый). |
| `onChange` | `(html: string) => void` | Вызывается при каждом изменении контента. Сокращенное обозначение для `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor параметры инициализации. `events` и `theme` применяются в режиме реального времени. Все остальные параметры применяются один раз при создании. |
| `readOnly` | `boolean` | Переключить режим только для чтения. |
| `disabled` | `boolean` | Отключите редактор. |
| `className`, `style` |  | Применено к обертке `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Любой другой prop (`id`, `data-*`, `aria-*`, ...) применяется к обертывающему `<div>`. `children` игнорируется. |
| `ref` | `SunEditorInstance \| null` | Экземпляр редактора. |

При создании редактора применяются параметры, отличные от `events` и `theme`.
Чтобы изменить их позже, переустановите устройство с другим `key` или вызовите `ref.current.resetOptions()`.

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

Все типы двигателей также доступны у `suneditor/types`.

## Next.js заметки

- Этот компонент представляет собой клиентский модуль (`"use client"` находится в выходных данных сборки) и загружает движок только в браузере, поэтому его можно отображать непосредственно из серверного компонента.
- Не используйте `suneditor` в статических импортах клиентских компонентов. Используйте форму `options={(se) => ...}` для доступа к `se.plugins`.
- Импорт CSS-файлов (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) работает как в App Router, так и в Pages Router.
