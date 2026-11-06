<!-- Generated from @suneditor/suneditor-react@0.0.1 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

```bash
npm install @suneditor/suneditor-react suneditor
```

`suneditor` 3.4.1 veya daha yeni bir sürüm gerektirir (`editor.events`, React ve props'ü bağlamak için kullanılır).

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

`options`, gecikmeli olarak yüklenen `suneditor` modülünü (`se.plugins`, `se.langs`, `se.interfaces`, ...) alır.
Next.js'de bu formu tercih edin: istemci bileşeninde `suneditor`'ı statik olarak içe aktarmak, sunucu tarafı oluşturmayı bozar çünkü motor içe aktarma sırasında `window`'e dokunur.
Sunucu tarafında render işlemi yapmadığınızda veya motor içe aktarımı gerektirmeyen seçenekler için de düz bir nesne kullanılabilir.
Dil paketleri düz nesnelerdir ve her zaman statik olarak içe aktarılabilirler: `import ko from 'suneditor/langs/ko'`.

### Kontrollü değer

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value` değerini son `onChange` sonucundan farklı bir değere değiştirmek, düzenleyici içeriğini değiştirir.
Kontrolsüz bir düzenleyici için `value` ifadesini atlayın ve ihtiyaç duyduğunuzda içeriği örnekten okuyun.

### Örnek erişimi

```tsx
const ref = useRef<SunEditorInstance | null>(null);

<SunEditor ref={ref} options={...} />

ref.current?.$.html.get();
ref.current?.$.html.set('<p>new</p>');
ref.current?.resetOptions({ height: '600px' });
```

`ref`, `suneditor.create()` tarafından döndürülen nesnedir, bu nedenle motorun tüm API'si kullanılabilir durumdadır.

### Events

`options.events` üzerinden işleyici fonksiyonlarını geçirin. Bunlar her render işleminde yeniden senkronize edilir, böylece React durumunun üzerine güvenle kapatılabilirler.

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

### Başka bir öğedeki araç çubuğu veya durum çubuğu

DOM öğesi alan motor seçenekleri, `options` fonksiyonu mount işleminden sonra çalıştığı için ref'lerle birlikte çalışır:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Birden fazla düzenlenebilir alana sahip tek bir motor örneği (araç çubuğu, eklentiler, olaylar, tema). Her alan için `<SunEditorGroup>` içine bir `<SunEditorRoot>` yerleştirin; diğer JSX kodları bunların arasına yerleştirilebilir. Grup kendi başına hiçbir öğe oluşturmaz.

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<SunEditorGroup options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })}>
	<div ref={toolbarRef} />
	<h2>Title</h2>
	<SunEditorRoot name='header' value={header} onChange={setHeader} options={{ height: '80px' }} />
	<SunEditorRoot name='body' value={body} onChange={setBody} readOnly={locked} />
</SunEditorGroup>;
```

- `name`, `rootKey` (`ref.current.changeFrameContext('body')`, `html.get({ rootKey: 'body' })`) motorudur.
- Her kökün kendine ait `value` / `onChange`, `readOnly`, `disabled` ve çerçevesi `options` (`height`, `placeholder`, `iframe`, ...) vardır.
- Motor, paylaşılan araç çubuğu için `toolbar_container`'a ihtiyaç duyar, aksi takdirde `mode`, `inline` veya `balloon` olmalıdır.
- Grup bağlandığında kökler toplanır. Motor daha sonra kök ekleyemez veya kaldıramaz, bu nedenle farklı köklerle yeniden oluşturmak için grubun `key` değerini değiştirin.

## Props

| Prop | Tip | Tanım |
| -------------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML düzenleyici (kontrollü). |
| `onChange` | `(html: string) => void` | Her içerik değişikliğinde çağrılır. `options.events.onChange`'ın kısaltmasıdır. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | SunEditor başlatma seçenekleri. `events` ve `theme` canlı olarak uygulanır. Geri kalan her şey oluşturma sırasında bir kez uygulanır. |
| `readOnly` | `boolean` | Salt okunur modu açıp kapatın. |
| `disabled` | `boolean` | Editörü devre dışı bırakın. |
| `className`, `style` |  | `<div>` sargısına uygulandı. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Diğer tüm prop (`id`, `data-*`, `aria-*`, ...) sarmalayan `<div>`'e uygulanır. `children` göz ardı edilir. |
| `ref` | `SunEditorInstance \| null` | Editör örneği. |

`events` ve `theme` dışındaki seçenekler, düzenleyici oluşturulurken uygulanır.
Bunları daha sonra değiştirmek için, farklı bir `key` ile yeniden bağlayın veya `ref.current.resetOptions()`'i çağırın.

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

Tüm motor tipleri `suneditor/types`'dan itibaren de mevcuttur.

## Next.js notları

- Bu bileşen bir istemci modülüdür (`"use client"` derleme çıktısında yer alır) ve motoru yalnızca tarayıcıda yükler, bu nedenle doğrudan bir sunucu bileşeninden işlenebilir.
- İstemci bileşenlerindeki statik içe aktarmalardan `suneditor`'ı çıkarın. `se.plugins`'ye ulaşmak için `options={(se) => ...}` formunu kullanın.
- CSS içe aktarımları (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) hem App Router hem de Pages Router'te çalışır.
