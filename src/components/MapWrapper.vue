<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  type SpatialCoverageSearchParams,
  useCaseStudyById,
  useConesGeojson,
  useSpatialCoveragesGeojson,
} from '@/api';
import Leaflet from '@/components/Leaflet.vue';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useStore } from '@/lib/use-store';

const props = defineProps<{
  author?: any;
  passage?: any;
  keyword?: any;
  usecase?: any;
  place?: any;
}>();

const route = useRoute();
const store = useStore();

const searchFilters = computed(() => {
  if (Object.values(props).some(isNotNullable)) {
    const searchFilters: SpatialCoverageSearchParams = {
      stelle__text__autor: props.author,
      stelle: props.passage,
      key_word: props.keyword,
      stelle__use_case: props.usecase,
      stelle__text__ort: props.place,
    };

    return searchFilters;
  }

  function getDateFilters() {
    if (route.query['time'] == null) return {};

    const [start, end] = String(route.query['time']).includes('+')
      ? String(route.query['time']).split('+')
      : [Number(route.query['time']) - 5, Number(route.query['time']) + 4];

    const dateFilters =
      store.state.apiParams.slider === 'passage'
        ? {
            stelle__start_date: start,
            stelle__start_date_lookup: 'gt',
            stelle__end_date: end,
            stelle__end_date_lookup: 'lt',
          }
        : {
            stelle__text__not_before: start,
            stelle__text__not_before_lookup: 'gt',
            stelle__text__not_after: end,
            stelle__text__not_after_lookup: 'lt',
          };

    return dateFilters;
  }

  const searchFilters: SpatialCoverageSearchParams = {
    stelle__text__autor: route.query['Author']?.toString().split('+').map(Number),
    stelle: route.query['Passage']?.toString().split('+').map(Number),
    key_word: route.query['Keyword']?.toString().split('+').map(Number),
    stelle__use_case: route.query['Use Case']?.toString().split('+').map(Number),
    stelle__text__ort: route.query['Place']?.toString().split('+').map(Number),
    ...getDateFilters(),
    // TODO: respect other config options like intersect
  };

  return searchFilters;
});

const spatialCoveragesQuery = useSpatialCoveragesGeojson(searchFilters);
const conesQuery = useConesGeojson(searchFilters);

const isLoading = computed(() => {
  return [spatialCoveragesQuery, conesQuery].some((query) => query.isInitialLoading.value);
});

const spatialCoverages = computed(() => spatialCoveragesQuery.data.value?.features ?? []);
const cones = computed(() => conesQuery.data.value?.features ?? []);

// FIXME: what if we have multiple case studies in route.query
const id = computed(() => props.usecase ?? route.query['Use Case']);
const caseStudyQuery = useCaseStudyById({ id }, { isEnabled: computed(() => id.value != null) });

// TODO:
const _layers = computed(() => caseStudyQuery.data.value?.layer ?? []);

// FIXME: only temporary because the map component requires this shape
const entries = computed(() => {
  return [{ features: spatialCoverages.value }, { features: cones.value }] as const;
});
</script>

<template>
  <v-card color="transparent" width="100%">
    <leaflet :data="entries" :loading="isLoading" :usecase="usecase" />
    <router-view />
  </v-card>
</template>
