<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

해당 구성 요소에는 [SunEditor](https://www.npmjs.com/package/suneditor) 엔진도 필요합니다(피어 종속성, 3.4.1 이상).

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

`options`은 `suneditor.create()`에 그대로 전달되므로 모든 옵션, 플러그인, 버튼, 이벤트 및 언어는 엔진 자체의 것입니다.\
이 README 파일은 React 컴포넌트가 추가하는 내용만 다룹니다. 옵션 자체에 대한 자세한 내용은 [SunEditor 문서](https://suneditor.com) 또는 [`suneditor`](https://www.npmjs.com/package/suneditor) 패키지를 참조하십시오.

`options`는 지연 로드되는 `suneditor` 모듈(`se.plugins`, `se.langs`, `se.interfaces`, ...)을 받습니다.\
Next.js에서 이 형식을 선호합니다. 클라이언트 구성 요소에서 `suneditor`을 정적으로 가져오면 엔진이 가져올 때 `window`을 건드리기 때문에 서버 렌더링이 실패합니다.\
일반 객체는 서버 렌더링을 사용하지 않거나 엔진 가져오기가 필요 없는 옵션의 경우에도 작동합니다.\
언어 팩은 일반 객체이며 항상 정적으로 가져올 수 있습니다: `import ko from 'suneditor/langs/ko'`.

### 제어된 값

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value`을 마지막 `onChange` 결과가 아닌 다른 값으로 변경하면 편집기 콘텐츠가 바뀝니다.
제어되지 않는 편집기를 사용하려면 `value`을 생략하고 필요할 때 해당 인스턴스에서 콘텐츠를 읽으십시오.

### 인스턴스 액세스

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref`는 `suneditor.create()`에서 반환된 객체이므로 전체 엔진 API를 사용할 수 있습니다.

### Events

핸들러를 `options.events`을 통해 전달합니다. 핸들러는 렌더링될 때마다 다시 동기화되므로 React 상태를 안전하게 닫을 수 있습니다.

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

### 다른 요소의 툴바 또는 상태 표시줄

DOM 요소를 인수로 받는 엔진 옵션은 `options` 함수가 마운트 후에 실행되기 때문에 refs와 함께 작동합니다.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

하나의 엔진 인스턴스(툴바, 플러그인, 이벤트, 테마)에 여러 개의 편집 가능한 영역이 있습니다. 각 영역마다 `<SunEditorGroup>` 안에 `<SunEditorRoot>`을 넣으세요. 그 사이에 다른 JSX 요소를 넣을 수 있습니다. 이 그룹은 자체적으로 어떤 요소도 렌더링하지 않습니다.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
  <div ref={toolbarRef} />
  <h2>Title</h2>
  <SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
  <SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name`는 엔진 `rootKey`(`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`)입니다.
- 각 루트에는 자체 `value` / `onChange`, `readOnly`, `disabled` 및 프레임 `options` (`height`, `placeholder`, `iframe`, ...)이 있습니다.
- 엔진은 공유 툴바를 위해 `toolbar_container`이 필요합니다. 단, `mode`이 `inline` 또는 `balloon`인 경우는 예외입니다.
- 루트는 그룹이 마운트될 때 수집됩니다. 엔진은 나중에 루트를 추가하거나 제거할 수 없으므로, 다른 루트로 그룹을 다시 생성하려면 그룹의 `key` 값을 변경하십시오.

## Props

| Prop | 유형 | 설명 |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML 편집기(제어됨). |
| `onChange` | `(html: string) => void` | 콘텐츠가 변경될 때마다 호출됩니다. `options.events.onChange`의 약어입니다. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor 옵션](https://suneditor.com)은 변경 없이 그대로 통과합니다. `events`과 `theme`은 실시간으로 적용됩니다. 나머지 항목들은 생성 시 한 번만 적용됩니다. |
| `readOnly` | `boolean` | 읽기 전용 모드를 전환합니다. |
| `disabled` | `boolean` | 편집기를 비활성화하세요. |
| `className`, `style` |  | 포장에 적용됨 `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | 다른 prop (`id`, `data-*`, `aria-*`, ...)는 래핑 `<div>`에 적용됩니다. `children`는 무시됩니다. |
| `ref` | `SunEditorInstance \| null` | 에디터 인스턴스. |

`events` 및 `theme` 이외의 옵션은 편집기를 생성할 때 적용됩니다.
나중에 변경하려면 다른 `key`로 다시 마운트하거나 `ref.current.resetOptions()`를 호출하십시오.

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

모든 엔진 유형은 `suneditor/types`에서도 이용 가능합니다.

## Next.js 메모

- 해당 구성 요소는 클라이언트 모듈(`"use client"`은 빌드 출력에 포함됨)이며 브라우저에서만 엔진을 로드하므로 서버 구성 요소에서 직접 렌더링할 수 있습니다.
- 클라이언트 구성 요소의 정적 가져오기에서 `suneditor`을 제외하세요. `se.plugins`에 접근하려면 `options={(se) => ...}` 형식을 사용하세요.
- CSS 가져오기(`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`)는 App Router와 Pages Router 모두에서 작동합니다.
