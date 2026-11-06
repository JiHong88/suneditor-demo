<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Requiere `suneditor` 3.4.1 o posterior (`editor.events` se utiliza para cablear React props).

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

`options` recibe el módulo `suneditor` cargado de forma diferida (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Prefiera esta forma en Next.js: importar `suneditor` estáticamente en un componente cliente rompe la representación del servidor porque el motor toca `window` en el momento de la importación.
Un objeto simple también funciona cuando no se utiliza renderizado del servidor, o para opciones que no requieren importación del motor.
Los paquetes de idioma son objetos simples y siempre se pueden importar de forma estática: `import ko from 'suneditor/langs/ko'`.

### Valor controlado

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Si se cambia `value` por algo distinto al último resultado de `onChange`, se reemplaza el contenido del editor.
Omita `value` para un editor no controlado y lea el contenido de la instancia cuando lo necesite.

### Acceso a la instancia

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` es el objeto devuelto por `suneditor.create()`, por lo que toda la API del motor está disponible.

### Events

Los manejadores se pasan a través de `options.events`. Se resincronizan en cada renderizado, por lo que pueden cerrarse de forma segura sobre el estado React.

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

### Barra de herramientas o barra de estado en otro elemento

Las opciones del motor que aceptan un elemento DOM funcionan con referencias porque la función `options` se ejecuta después del montaje:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Una instancia del motor (barra de herramientas, complementos, eventos, tema) con varias áreas editables. Coloque un `<SunEditorRoot>` por área dentro de `<SunEditorGroup>`; cualquier otro JSX puede ubicarse entre ellos. El grupo no renderiza ningún elemento propio.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` es el motor `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Cada raíz tiene su propio `value` / `onChange`, `readOnly`, `disabled` y marco `options` (`height`, `placeholder`, `iframe`, ...).
- El motor necesita `toolbar_container` para la barra de herramientas compartida a menos que `mode` sea `inline` o `balloon`.
- Las raíces se recopilan cuando se monta el grupo. El motor no puede agregar ni eliminar raíces posteriormente, por lo que debe cambiar el valor de `key` del grupo para recrearlo con raíces diferentes.

## Props

| Prop | Tipo | Descripción |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Editor HTML (controlado). |
| `onChange` | `(html: string) => void` | Se llama con cada cambio de contenido. Abreviatura de `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | Opciones de inicialización de SunEditor. `events` y `theme` se aplican en tiempo real. Todo lo demás se aplica una sola vez al crear la aplicación. |
| `readOnly` | `boolean` | Activar/desactivar el modo de solo lectura. |
| `disabled` | `boolean` | Deshabilitar el editor. |
| `className`, `style` |  | Aplicado al envoltorio `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Cualquier otro prop (`id`, `data-*`, `aria-*`, ...) se aplica al `<div>` envolvente. `children` se ignora. |
| `ref` | `SunEditorInstance \| null` | La instancia del editor. |

Las opciones distintas de `events` y `theme` se aplican al crear el editor.
Para cambiarlos más tarde, vuelva a montar con un `key` diferente o llame a `ref.current.resetOptions()`.

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

Todos los tipos de motor también están disponibles desde `suneditor/types`.

## Notas Next.js

- El componente es un módulo de cliente (`"use client"` aparece en la salida de la compilación) y carga el motor solo en el navegador, por lo que puede renderizarse directamente desde un componente de servidor.
- Mantén `suneditor` fuera de las importaciones estáticas en los componentes del cliente. Usa la forma `options={(se) => ...}` para llegar a `se.plugins`.
- Las importaciones CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) funcionan tanto en App Router como en Pages Router.
