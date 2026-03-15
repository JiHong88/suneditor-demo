<script>
  import { onMount } from "svelte";
  import suneditor, { plugins } from "suneditor";
  import "suneditor/css/editor";
  import "suneditor/css/contents";

  let editorEl;
  let instance;

  onMount(() => {
    instance = suneditor.create(editorEl, {
      plugins,
      value: "{{DEFAULT_VALUE}}",
      buttonList: {{BUTTON_LIST_6}}
    });

    return () => instance?.destroy();
  });
</script>

<textarea bind:this={editorEl}></textarea>
