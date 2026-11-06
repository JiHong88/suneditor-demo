<!-- Generated from @suneditor/suneditor-react@1.0.0 README.md by scripts/generate-react-guide.cjs. Do not edit; run `npm run docs:generate`. -->

## Install

Bu bileşen ayrıca [SunEditor](https://www.npmjs.com/package/suneditor) motoruna da ihtiyaç duyar (eş bağımlılık, 3.4.1 veya üzeri).

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

`options`, `suneditor.create()`'e olduğu gibi aktarılır; bu nedenle her seçenek, eklenti, düğme, olay ve dil, motorun kendine özgü özellikleridir.\
Bu README dosyası yalnızca React bileşeninin eklediklerini kapsar; seçeneklerin kendileri için [SunEditor dokümantasyon](https://suneditor.com) veya [`suneditor`](https://www.npmjs.com/package/suneditor) paketine bakın.

`options`, tembelce yüklenen `suneditor` modülünü (`se.plugins`, `se.langs`, `se.interfaces`, ...) alır.\
Next.js'deki bu formu tercih edin: istemci bileşeninde `suneditor`'ı statik olarak içe aktarmak, sunucu tarafı oluşturmayı bozar çünkü motor içe aktarma sırasında `window`'e dokunur.\
Sunucu tarafında render işlemi yapmadığınızda veya motor içe aktarımı gerektirmeyen seçenekler için de düz bir nesne kullanılabilir.\
Dil paketleri düz nesnelerdir ve her zaman statik olarak içe aktarılabilirler: `import ko from 'suneditor/langs/ko'`.

### Kontrollü değer

```tsx
const [html, setHtml] = useState('<p>Hello</p>');

<SunEditor value={html} onChange={setHtml} options={...} />
```

`value` değerini son `onChange` sonucundan farklı bir değerle değiştirmek, düzenleyici içeriğini değiştirir.
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

İşleyici fonksiyonlarını `options.events` üzerinden geçirin. Her render işleminde yeniden senkronize edildikleri için React durumu üzerinden güvenli bir şekilde kapatılabilirler.

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

DOM öğesi alan motor seçenekleri, ref'lerle çalışır çünkü `options` fonksiyonu mount işleminden sonra çalışır:

```tsx
const toolbarRef = useRef<HTMLDivElement>(null);

<div ref={toolbarRef} />
<SunEditor options={(se) => ({ plugins: [se.plugins.link], toolbar_container: toolbarRef.current })} />
```

### Multi-root

Birden fazla düzenlenebilir alana sahip tek bir motor örneği (araç çubuğu, eklentiler, olaylar, tema). Her alan için `<SunEditorGroup>` içine bir `<SunEditorRoot>` yerleştirin; aralarına herhangi bir başka JSX kodu yerleştirilebilir. Grup kendi başına hiçbir öğe oluşturmaz.

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
- Motorun paylaşılan araç çubuğu için `toolbar_container`'a ihtiyacı vardır, aksi takdirde `mode`, `inline` veya `balloon` olmalıdır.
- Grup monte edildiğinde kökler toplanır. Motor daha sonra kök ekleyemez veya kaldıramaz, bu nedenle farklı köklerle yeniden oluşturmak için grubun `key` değerini değiştirin.

## Props

| Prop | Tip | Tanım |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `value` | `string` | HTML düzenleyici (kontrollü). |
| `onChange` | `(html: string) => void` | Her içerik değişikliğinde çağrılır. `options.events.onChange`'ın kısaltmasıdır. |
| `options` | `SunEditorOptions \| (se) => SunEditorOptions` | [SunEditor seçenek](https://suneditor.com), değiştirilmeden aktarıldı. `events` ve `theme` canlı olarak uygulandı. Diğer her şey oluşturma sırasında bir kez uygulandı. |
| `readOnly` | `boolean` | Salt okunur modu açıp kapatın. |
| `disabled` | `boolean` | Editörü devre dışı bırakın. |
| `className`, `style` |  | Ambalaja uygulandı `<div>`. |
| `...divProps` | `HTMLAttributes<HTMLDivElement>` | Diğer prop (`id`, `data-*`, `aria-*`, ...) sarmalayan `<div>`'e uygulanır. `children` göz ardı edilir. |
| `ref` | `SunEditorInstance \| null` | Editör örneği. |

`events` ve `theme` dışındaki seçenekler, düzenleyici oluşturulurken uygulanır.
Bunları daha sonra değiştirmek için farklı bir `key` ile yeniden takın veya `ref.current.resetOptions()`'i arayın.

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

## Next.js notlar

- Bu bileşen bir istemci modülüdür (yapı çıktısında `"use client"` bulunur) ve motoru yalnızca tarayıcıda yükler, bu nedenle doğrudan bir sunucu bileşeninden işlenebilir.
- İstemci bileşenlerindeki statik içe aktarmalarda `suneditor`'ı kullanmayın. `se.plugins`'ye ulaşmak için `options={(se) => ...}` formunu kullanın.
- CSS içe aktarmaları (`suneditor/css/editor`, `suneditor/css/contents`, `suneditor/src/themes/*.css`) hem App Router hem de Pages Router'te çalışır.
