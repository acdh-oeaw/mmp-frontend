<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
// @ts-expect-error Missing types.
import cloud from 'vue-d3-cloud';

const props = defineProps<{
  data: Array<any>;
  title: string;
}>();

const width = ref(500);
const height = ref(500);

// FIXME: unclear if/why this is necessary
const renderKey = ref(0);
onMounted(() => {
  renderKey.value -= -1;
});

const elementRef = ref<HTMLDivElement | null>(null);
let observer: ResizeObserver | null = null;

onMounted(() => {
  if (elementRef.value == null) return;

  observer = new ResizeObserver((entries) => {
    const [entry] = entries;

    if (entry == null) return;

    width.value = entry.contentRect.width;
    height.value = entry.contentRect.height;
    renderKey.value += 1;
  });

  observer.observe(elementRef.value);
});

onUnmounted(() => {
  observer?.disconnect();
});

const words = computed(() => {
  return props.data.map(([text, value]) => ({ text, value }));
});
const maxOccurences = computed(() => {
  return Math.max(...words.value.map((word) => word.value));
});

function sizeFunction(word: any) {
  return (word.value * 400) / words.value.length;
}
</script>

<template>
  <div ref="elementRef" class="cloud-wrapper">
    <h3 class="text-center">{{ title }}</h3>
    <cloud
      :key="renderKey"
      :data="words"
      :font-size-mapper="sizeFunction"
      :width="width"
      :height="height"
      padding="2"
      :on-word-click="() => null"
      font="Roboto FlexVariable, sans-serif"
    />
  </div>
</template>

<style>
.cloud-wrapper {
  height: 460px;
}
</style>
