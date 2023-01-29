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
  <v-btn
    absolute
    bottom
    :left="left !== undefined"
    :right="left === undefined"
    depressed
    icon
    @click="onClick"
  >
    <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
    <v-icon v-else>mdi-fullscreen</v-icon>
  </v-btn>
</template>
