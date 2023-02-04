<script lang="ts" setup>
const props = defineProps<{
  /** @default 'right' */
  position?: 'left' | 'right';
}>();

const isFullScreen = false;

function onClick() {
  // TODO:;
}
</script>

<template>
  <VBtn absolute bottom :right="props.position !== 'left'" depressed icon @click="onClick">
    <VIcon v-if="isFullScreen">mdi-fullscreen-exit</VIcon>
    <VIcon v-else>mdi-fullscreen</VIcon>
  </VBtn>
</template>
