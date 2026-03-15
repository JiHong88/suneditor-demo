<script setup>
// 1. CSS import
import "suneditor/css/contents";

defineProps({ html: String });
</script>

<!-- 2. sun-editor-editable Wrap with class -->
<template>
  <div class="sun-editor-editable" v-html="html" />
</template>