<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router/composables';

import type { CaseStudy } from '@/api';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  usecase?: CaseStudy['id'];
  left?: boolean;
}>();

const router = useRouter();
const route = useRoute();
const { createSearchFilterParams, searchFilters } = useSearchFilters();

const isFullScreen = useFullScreen();

function press() {
  router.push({
    name: isFullScreen.value
      ? route.name?.replace(' Fullscreen', '')
      : `${props.usecase ? getComponentFromTab(route.query.tab) : route.name} Fullscreen`,
    // FIXME:
    query: props.usecase
      ? createSearchFilterParams({ ...searchFilters.value, 'case-study': [props.usecase] })
      : route.query,
    params: route.params,
  });
}

function getComponentFromTab(tab: 'cloud' | 'graph' | 'map') {
  const components = {
    cloud: 'Word Cloud',
    graph: 'Network Graph',
    map: 'Map',
  };
  return components[tab];
}
</script>

<template>
  <v-btn
    absolute
    bottom
    :left="left !== undefined"
    :right="left === undefined"
    depressed
    icon
    @click="press"
  >
    <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
    <v-icon v-else>mdi-fullscreen</v-icon>
  </v-btn>
</template>
