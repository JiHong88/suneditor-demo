<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Ce composant nécessite également le moteur [SunEditor](https://www.npmjs.com/package/suneditor) (dépendance homologue, version 3.4.1 ou ultérieure).

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

`options` est transmis tel quel à `suneditor.create()`, donc chaque option, plugin, bouton, événement et langue est propre au moteur.\
Ce fichier README ne couvre que ce que le composant React ajoute ; pour les options elles-mêmes, voir le package [SunEditor documentation](https://suneditor.com) ou [`suneditor`](https://www.npmjs.com/package/suneditor).

`options` reçoit le module `suneditor` chargé paresseusement (`se.plugins`, `se.langs`, `se.interfaces`, ...).\
Préférez cette forme dans Next.js : l'importation statique de `suneditor` dans un composant client interrompt le rendu côté serveur car le moteur touche `window` au moment de l'importation.\
Un objet simple fonctionne également lorsque vous n'utilisez pas le rendu côté serveur, ou pour les options qui ne nécessitent aucune importation du moteur.\
Les packs de langue sont des objets simples et peuvent toujours être importés statiquement : `import ko from 'suneditor/langs/ko'`.

### Valeur contrôlée

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

Changer `value` en autre chose que le dernier résultat `onChange` remplace le contenu de l'éditeur.
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

Les gestionnaires de passage sont transmis par `options.events`. Ils sont resynchronisés à chaque rendu, ce qui leur permet de se fermer en toute sécurité sur l'état React.

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
- Chaque racine a son propre `value` / `onChange`, `readOnly`, `disabled` et son cadre `options` (`height`, `placeholder`, `iframe`, ...).
- Le moteur a besoin de `toolbar_container` pour la barre d'outils partagée à moins que `mode` ne soit `inline` ou `balloon`.
- Les racines sont collectées lors du montage du groupe. Le moteur ne peut pas ajouter ou supprimer de racines ultérieurement ; modifiez donc le `key` du groupe pour le recréer avec des racines différentes.

## Props

| Prop | Taper | Description |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | Éditeur HTML (contrôlé). |
| `onChange` | `(html: string) => void` | Appelé à chaque modification de contenu. Abréviation de `options.events.onChange`. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor options](https://suneditor.com) est transmis sans modification. `events` et `theme` sont appliqués en temps réel. Tout le reste est appliqué une seule fois, lors de la création. |
| `readOnly` | `boolean` | Activer/désactiver le mode lecture seule. |
| `disabled` | `boolean` | Désactiver l'éditeur. |
| `className`, `style` |  | Appliqué à l'emballage `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Tout autre prop (`id`, `data-*`, `aria-*`, ...) est appliqué à l'enveloppe `<div>`. `children` est ignoré. |
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

Tous les types de moteurs sont également disponibles à partir de `suneditor/types`.

## Next.js notes

- Le composant est un module client (`"use client"` est dans la sortie de la compilation) et charge le moteur uniquement dans le navigateur, il peut donc être rendu directement à partir d'un composant serveur.
- Évitez d'utiliser `suneditor` dans les importations statiques des composants clients. Utilisez la forme `options={(se) => ...}` pour accéder à `se.plugins`.
- Les importations CSS (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) fonctionnent à la fois dans le App Router et le Pages Router.
