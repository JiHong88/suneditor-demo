<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Requer `suneditor` 3.4.1 ou posterior (`editor.events` é usado para conectar o React props).

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

`options` recebe o módulo `suneditor` carregado preguiçosamente (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Prefira este formato em Next.js: importar `suneditor` estaticamente em um componente cliente quebra a renderização do servidor porque o mecanismo acessa `window` no momento da importação.
Um objeto simples também funciona quando você não está usando renderização no servidor, ou para opções que não precisam de importação do mecanismo.
Os pacotes de idiomas são objetos simples e sempre podem ser importados estaticamente: `import ko from 'suneditor/langs/ko'`.

### Valor controlado

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Alterar `value` para um valor diferente do último resultado `onChange` substitui o conteúdo do editor.
Omita `value` para um editor não controlado e leia o conteúdo da instância quando precisar dele.

### Acesso à instância

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` é o objeto retornado por `suneditor.create()`, portanto, toda a API do mecanismo está disponível.

### Events

Passe os manipuladores por meio de `options.events`. Eles são ressincronizados a cada renderização, portanto, podem ser fechados com segurança sobre o estado de React.

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

### Barra de ferramentas ou barra de status em outro elemento

As opções do mecanismo que utilizam um elemento DOM funcionam com referências porque a função `options` é executada após a montagem:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Uma instância do mecanismo (barra de ferramentas, plugins, eventos, tema) com várias áreas editáveis. Coloque um elemento ``<SunEditorRoot>`` por área dentro de um elemento ``<SunEditorGroup>``; qualquer outro JSX pode ficar entre eles. O grupo não renderiza nenhum elemento próprio.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` é o motor `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Cada raiz tem seu próprio `value` / `onChange`, `readOnly`, `disabled` e estrutura `options` (`height`, `placeholder`, `iframe`, ...).
- O mecanismo precisa de `toolbar_container` para a barra de ferramentas compartilhada, a menos que `mode` seja `inline` ou `balloon`.
- As raízes são coletadas quando o grupo é montado. O mecanismo não pode adicionar ou remover raízes posteriormente, portanto, altere o `key` do grupo para recriá-lo com raízes diferentes.

## Props

| Prop | Tipo | Descrição |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Editor HTML (controlado). |
| `onChange` | `(html: string) => void` | Acionado a cada alteração de conteúdo. Abreviação de `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | As opções de inicialização SunEditor, `events` e `theme` são aplicadas em tempo real. Todas as outras opções são aplicadas uma única vez, na criação do sistema. |
| `readOnly` | `boolean` | Alternar modo somente leitura. |
| `disabled` | `boolean` | Desative o editor. |
| `className`, `style` |  | Aplicado ao invólucro `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Qualquer outro prop (`id`, `data-*`, `aria-*`, ...) é aplicado ao `<div>` de revestimento. `children` é ignorado. |
| `ref` | `SunEditorInstance \| null` | A instância do editor. |

As opções diferentes de `events` e `theme` são aplicadas quando o editor é criado.
Para alterá-los posteriormente, remonte com um `key` diferente ou chame `ref.current.resetOptions()`.

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

Todos os tipos de motor também estão disponíveis a partir de `suneditor/types`.

## Next.js notas

- O componente é um módulo cliente (`"use client"` está presente na saída da compilação) e carrega o mecanismo apenas no navegador, podendo assim ser renderizado diretamente a partir de um componente do servidor.
- Mantenha `suneditor` fora das importações estáticas em componentes do cliente. Use o formulário `options={(se) => ...}` para acessar `se.plugins`.
- As importações de CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funcionam tanto no App Router quanto no Pages Router.
