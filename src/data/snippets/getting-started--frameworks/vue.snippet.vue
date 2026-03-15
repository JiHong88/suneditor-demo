<script setup>
import { onMounted, onBeforeUnmount, ref } from "vue";
import suneditor, { plugins } from "suneditor";
import "suneditor/css/editor";
import "suneditor/css/contents";

const editorEl = ref(null);
let instance = null;

onMounted(() => {
  instance = suneditor.create(editorEl.value, {
    plugins,
    value: "{{DEFAULT_VALUE}}",
    buttonList: {{BUTTON_LIST_4}}
  });
});

onBeforeUnmount(() => {
  instance?.destroy();
});
</script>

<template>
  <textarea ref="editorEl" />
</template>
