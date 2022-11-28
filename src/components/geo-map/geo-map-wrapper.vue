<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  type GetConesGeojson,
  type GetSpatialCoveragesGeojson,
  useCaseStudyById,
  useConesGeojson,
  useSpatialCoveragesGeojson,
} from '@/api';
import Leaflet from '@/components/geo-map/geo-map.vue';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const props = defineProps<{
  author?: any;
  passage?: any;
  keyword?: any;
  usecase?: any;
  place?: any;
}>();

const route = useRoute();
const { searchFilters } = useSearchFilters();

const searchParams = computed(() => {
  // FIXME:
  if (Object.values(props).some(isNotNullable)) {
    const searchParams: GetSpatialCoveragesGeojson.SearchParams | GetConesGeojson.SearchParams = {
      stelle__text__autor: props.author,
      stelle: props.passage,
      key_word: props.keyword,
      stelle__use_case: props.usecase,
      stelle__ort: props.place,
    };

    return searchParams;
  }

  function getDateFilters() {
    const [start, end] = Array.isArray(searchFilters.value['date-range'])
      ? searchFilters.value['date-range']
      : [searchFilters.value['date-range'] - 5, searchFilters.value['date-range'] + 4];

    const dateFilters: GetSpatialCoveragesGeojson.SearchParams | GetConesGeojson.SearchParams =
      searchFilters.value['date-filter'] === 'content'
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

  const searchParams: GetSpatialCoveragesGeojson.SearchParams | GetConesGeojson.SearchParams = {
    stelle__text__autor: searchFilters.value['author'],
    stelle: searchFilters.value['passage'],
    key_word: searchFilters.value['keyword'],
    stelle__use_case: searchFilters.value['case-study'],
    stelle__ort: searchFilters.value['place'],
    ...getDateFilters(),
    // TODO: respect other config options like intersect
  };

  return searchParams;
});

const spatialCoveragesQuery = useSpatialCoveragesGeojson(searchParams);
const conesQuery = useConesGeojson(searchParams);

const isLoading = computed(() => {
  return [spatialCoveragesQuery, conesQuery].some((query) => query.isInitialLoading.value);
});

const spatialCoverages = computed(() => spatialCoveragesQuery.data.value?.features ?? []);
const cones = computed(() => conesQuery.data.value?.features ?? []);

// FIXME: what if we have multiple case studies in route.query
const id = computed(() => props.usecase ?? route.query['Use Case']);
const caseStudyQuery = useCaseStudyById({ id }, { isEnabled: computed(() => id.value != null) });

const layers = computed(() => caseStudyQuery.data.value?.layer ?? []);

// FIXME: only temporary because the map component requires this shape
const entries = computed(() => {
  return [{ features: spatialCoverages.value }, { features: cones.value }];
});
</script>

<template>
  <v-card color="transparent" width="100%">
    <leaflet :data="entries" :loading="isLoading" :usecase="usecase" />
    <router-view />
  </v-card>
</template>
