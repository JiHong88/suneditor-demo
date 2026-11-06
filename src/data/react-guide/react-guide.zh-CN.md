<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

需要 `suneditor` 3.4.1 或更高版本（`editor.events` 用于连接 React 和 props）。

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

`options` 接收延迟加载的 `suneditor` 模块（`se.plugins`、`se.langs`、`se.interfaces` 等）。
建议在 Next.js 中使用这种形式：在客户端组件中静态导入 `suneditor` 会破坏服务器渲染，因为引擎会在导入时访问 `window`。
当您不使用服务器端渲染，或者对于不需要引擎导入的选项时，普通对象也可以正常工作。
语言包是普通对象，始终可以静态导入：`import ko from 'suneditor/langs/ko'`。

### 受控值

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

将 `value` 更改为除最后一个 `onChange` 结果之外的其他值，即可替换编辑器内容。
对于不受控制的编辑器，请省略 `value`，并在需要时从实例中读取内容。

### 实例访问

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` 是 `suneditor.create()` 返回的对象，因此整个引擎 API 都可用。

### Events

将处理程序传递到 `options.events`。它们在每次渲染时都会重新同步，因此可以安全地覆盖 React 状态。

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

### 另一个元素中的工具栏或状态栏

引擎选项如果接受 DOM 元素，则可以与 refs 一起使用，因为 `options` 函数是在挂载之后运行的：

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

一个引擎实例（工具栏、插件、事件、主题），包含多个可编辑区域。每个区域在 ``<SunEditorGroup>`` 内放置一个 ``<SunEditorRoot>``；任何其他 JSX 代码都可以放在它们之间。该组本身不渲染任何元素。

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` 是发动机 `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`)。
- 每个根都有自己的 `value` / `onChange`、 `readOnly`、 `disabled` 和框架 `options`（`height`、 `placeholder`、 `iframe`、 ...）。
- 除非 `mode` 是 `inline` 或 `balloon`，否则引擎需要 `toolbar_container` 来共享工具栏。
- 根目录会在组挂载时收集。引擎之后无法添加或移除根目录，因此需要修改组的 `key` 属性才能使用不同的根目录重新创建组。

## Props

| Prop | 类型 | 描述 |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | 编辑器 HTML（受控）。 |
| `onChange` | `(html: string) => void` | 每次内容更改都会调用。`options.events.onChange` 的缩写。 |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor 初始化选项。`events` 和 `theme` 会实时应用。其他所有选项都在创建时应用一次。 |
| `readOnly` | `boolean` | 切换只读模式。 |
| `disabled` | `boolean` | 禁用编辑器。 |
| `className`, `style` |  | 应用于包装`<div>`。 |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | 任何其他 prop（`id`、`data-*`、`aria-*`、...）都应用于包装 `<div>`。`children` 将被忽略。 |
| `ref` | `SunEditorInstance \| null` | 编辑器实例。 |

创建编辑器时，会应用除 `events` 和 `theme` 之外的其他选项。
要稍后更改它们，请使用不同的 `key` 重新安装或调用 `ref.current.resetOptions()`。

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

所有发动机类型均可从`suneditor/types`获得。

## Next.js 注释

- 该组件是一个客户端模块（`"use client"` 在构建输出中），它只在浏览器中加载引擎，因此可以直接从服务器组件渲染。
- 请勿在客户端组件的静态导入中使用 `suneditor`。请使用 `options={(se) => ...}` 形式来访问 `se.plugins`。
- CSS 导入（`suneditor/css/editor`、`suneditor/css/contents`、`suneditor/src/themes/*.css`）在 App Router 和 Pages Router 中均可工作。
