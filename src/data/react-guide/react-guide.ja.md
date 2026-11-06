<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

`suneditor` 3.4.1以降が必要です（`editor.events`はReact propsを配線するために使用されます）。

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

`options` は遅延ロードされた `suneditor` モジュール (`se.plugins`、`se.langs`、`se.interfaces`、...) を受け取ります。
Next.js ではこの形式を推奨します。クライアント コンポーネントで `suneditor` を静的にインポートすると、エンジンがインポート時に `window` にアクセスするため、サーバー レンダリングが壊れます。
サーバーレンダリングを行わない場合や、エンジンのインポートを必要としないオプションの場合は、プレーンオブジェクトでも問題ありません。
言語パックはプレーンオブジェクトであり、常に静的にインポートできます: `import ko from 'suneditor/langs/ko'`。

### 制御値

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value` を最後の `onChange` の結果以外のものに変更すると、エディタの内容が置き換えられます。
制御されていないエディタの場合は `value` を省略し、必要に応じてインスタンスからコンテンツを読み取ってください。

### インスタンスアクセス

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` は `suneditor.create()` によって返されるオブジェクトなので、エンジンの API 全体が利用可能です。

### Events

ハンドラは`options.events`を介して渡されます。レンダリングのたびに再同期されるため、Reactの状態を安全に閉じることができます。

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

### 別の要素内のツールバーまたはステータスバー

DOM要素を受け取るエンジンオプションは、マウント後に`options`関数が実行されるため、refsでも機能します。

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

1つのエンジンインスタンス（ツールバー、プラグイン、イベント、テーマ）に、複数の編集可能な領域があります。各領域ごとに`<SunEditorRoot>`を`<SunEditorGroup>`内に配置します。その他のJSXは、これらの間に配置できます。このグループは、独自の要素をレンダリングしません。

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` はエンジン `rootKey` (`ref.current.changeFrameContext('body')`、`html.get({ rootKey: 'body' })`) です。
- 各ルートには、独自の `value` / `onChange`、`readOnly`、`disabled` とフレーム `options` (`height`、`placeholder`、`iframe`、...) があります。
- `mode`が`inline`または`balloon`でない限り、エンジンは共有ツールバーに`toolbar_container`を必要とします。
- ルートはグループがマウントされる際に収集されます。エンジンは後からルートを追加または削除できないため、グループの`key`を変更して、異なるルートでグループを再作成してください。

## Props

| Prop | タイプ | 説明 |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | エディタのHTML（制御可能）。 |
| `onChange` | `(html: string) => void` | コンテンツが変更されるたびに呼び出されます。`options.events.onChange` の省略形です。 |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor の初期化オプション。`events` と `theme` はリアルタイムで適用されます。その他のオプションは作成時に一度だけ適用されます。 |
| `readOnly` | `boolean` | 読み取り専用モードを切り替えます。 |
| `disabled` | `boolean` | エディターを無効にします。 |
| `className`, `style` |  | ラッピング`<div>`に適用されます。 |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | その他の prop (`id`、`data-*`、`aria-*`、...) は、ラップする `<div>` に適用されます。`children` は無視されます。 |
| `ref` | `SunEditorInstance \| null` | エディタインスタンス。 |

`events` および `theme` 以外のオプションは、エディタの作成時に適用されます。
後で変更するには、別の `key` を使用して再マウントするか、`ref.current.resetOptions()` を呼び出してください。

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

全てのエンジンタイプは`suneditor/types`からも入手可能です。

## Next.js 注記

- このコンポーネントはクライアントモジュール（ビルド出力には`"use client"`が含まれます）であり、ブラウザでのみエンジンをロードするため、サーバーコンポーネントから直接レンダリングできます。
- クライアントコンポーネントの静的インポートには`suneditor`を含めないでください。`se.plugins`にアクセスするには`options={(se) => ...}`フォームを使用してください。
- CSS インポート (`suneditor/css/editor`、`suneditor/css/contents`、`suneditor/src/themes/*.css`) は、App Router と Pages Router の両方で機能します。
