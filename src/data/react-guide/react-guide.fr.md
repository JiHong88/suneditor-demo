<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

Nécessite `suneditor` 3.4.1 ou version ultérieure (`editor.events` est utilisé pour câbler le React props).

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

`options` reçoit le module `suneditor` chargé paresseusement (`se.plugins`, `se.langs`, `se.interfaces`, ...).
Privilégiez cette forme dans Next.js : l'importation statique de `suneditor` dans un composant client interrompt le rendu côté serveur car le moteur touche `window` au moment de l'importation.
Un objet simple fonctionne également lorsque vous n'utilisez pas le rendu côté serveur, ou pour les options qui ne nécessitent aucune importation du moteur.
Les packs de langue sont des objets simples et peuvent toujours être importés statiquement : `import ko from 'suneditor/langs/ko'`.

### Valeur contrôlée

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Modifier `value` par une valeur autre que le dernier résultat `onChange` remplace le contenu de l'éditeur.
Omettez `value` pour un éditeur non contrôlé et lisez le contenu de l'instance lorsque vous en avez besoin.

### Accès à l'instance

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref` est l'objet renvoyé par `suneditor.create()`, donc l'API complète du moteur est disponible.

### Events

Les gestionnaires de passage transitent par `options.events`. Ils sont resynchronisés à chaque rendu, ce qui leur permet de se fermer en toute sécurité sur l'état de React.

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

### Barre d'outils ou barre d'état dans un autre élément

Les options du moteur qui prennent un élément DOM fonctionnent avec les références car la fonction `options` s'exécute après le montage :

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Une instance du moteur (barre d'outils, plugins, événements, thème) avec plusieurs zones modifiables. Placez un élément `<SunEditorRoot>` par zone à l'intérieur d'un élément `<SunEditorGroup>` ; tout autre élément JSX peut être inséré entre eux. Le groupe ne génère aucun élément propre.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name` est le moteur `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`).
- Chaque racine possède son propre `value` / `onChange`, `readOnly`, `disabled` et son cadre `options` (`height`, `placeholder`, `iframe`, ...).
- Le moteur a besoin de `toolbar_container` pour la barre d'outils partagée à moins que `mode` ne soit `inline` ou `balloon`.
- Les racines sont collectées lors du montage du groupe. Le moteur ne peut pas ajouter ou supprimer de racines ultérieurement ; modifiez donc la variable d'environnement `key` du groupe pour le recréer avec des racines différentes.

## Props

| Prop | Taper | Description |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Éditeur HTML (contrôlé). |
| `onChange` | `(html: string) => void` | Appelé à chaque modification de contenu. Abréviation de `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor options d'initialisation. `events` et `theme` sont appliquées en temps réel. Toutes les autres options sont appliquées une seule fois, lors de la création du système. |
| `readOnly` | `boolean` | Activer/désactiver le mode lecture seule. |
| `disabled` | `boolean` | Désactiver l'éditeur. |
| `className`, `style` |  | Appliqué à l'emballage `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Tout autre prop (`id`, `data-*`, `aria-*`, ...) est appliqué à l'encapsulant `<div>`. `children` est ignoré. |
| `ref` | `SunEditorInstance \| null` | L'instance de l'éditeur. |

Les options autres que `events` et `theme` sont appliquées lors de la création de l'éditeur.
Pour les modifier ultérieurement, remontez avec un `key` différent ou appelez `ref.current.resetOptions()`.

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

Tous les types de moteurs sont également disponibles chez `suneditor/types`.

## Next.js notes

- Le composant est un module client (`"use client"` est dans la sortie de compilation) et charge le moteur uniquement dans le navigateur, il peut donc être rendu directement à partir d'un composant serveur.
- Évitez d'inclure `suneditor` dans les importations statiques des composants clients. Utilisez la forme `options={(se) => ...}` pour accéder à `se.plugins`.
- Les importations CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) fonctionnent à la fois dans App Router et Pages Router.
