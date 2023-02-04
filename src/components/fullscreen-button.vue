<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router/composables';

import type { CaseStudy } from '@/api';
import { useFullScreen } from '@/lib/use-full-screen';

const router = useRouter();
const route = useRoute();

const props = defineProps<{
  usecase?: CaseStudy['id'];
  left?: boolean;
}>();

function onClick() {
  router.push({
    name: isFullScreen.value
      ? route.name?.replace(' Fullscreen', '')
      : `${props.usecase ? getComponentFromTab(route.query.tab) : route.name} Fullscreen`,
    // @ts-expect-error Check later.
    query: props.usecase ? { ...route.query, 'Use Case': props.usecase } : route.query,
    params: route.params,
  });
}

function getComponentFromTab(tab: unknown) {
  switch (tab) {
    case 'cloud':
      return 'Word Cloud';
    case 'graph':
      return 'Network Graph';
    case 'map':
    default:
      return 'Map';
  }
}

const isFullScreen = useFullScreen();
</script>

<template>
  <VBtn absolute bottom :right="props.left !== true" depressed icon @click="onClick">
    <VIcon v-if="isFullScreen">mdi-fullscreen-exit</VIcon>
    <VIcon v-else>mdi-fullscreen</VIcon>
  </VBtn>
</template>
