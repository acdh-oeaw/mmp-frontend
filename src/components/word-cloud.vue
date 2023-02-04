<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
// @ts-expect-error Missing module declaration.
import Cloud from 'vue-d3-cloud';

const props = defineProps<{
  data: any;
  title?: any;
}>();

const words = computed(() => {
  return props.data.map(([text, value]: any) => ({ text, value }));
});

const cloudRef = ref(null);
const renderKey = ref(0);
const width = ref(500);
const height = ref(500);

onMounted(() => {
  if (cloudRef.value == null) return;

  renderKey.value -= -1; // this makes this component work, i dont know why

  // resize canvas on div resize
  const sizeOberserver = new ResizeObserver((entries) => {
    const [entry] = entries;

    if (entry == null) return;

    width.value = entry.contentRect.width;
    height.value = entry.contentRect.height;
    renderKey.value += 1;
  });

  sizeOberserver.observe(cloudRef.value);
});

function sizeFunction(word: any) {
  return (word.value * 400) / words.value.length;
}
</script>

<template>
  <div ref="cloudRef" class="cloud-wrapper">
    <h3 class="text-center">{{ title }}</h3>
    <Cloud
      :key="renderKey"
      :data="words"
      :font-size-mapper="sizeFunction"
      :width="width"
      :height="height"
      padding="2"
      :on-word-click="() => null"
      font="Roboto, sans-serif"
    />
  </div>
</template>

<style scoped>
.cloud-wrapper {
  height: 460px;
}
</style>
