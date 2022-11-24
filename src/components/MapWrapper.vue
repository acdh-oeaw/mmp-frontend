<template>
  <v-card color="transparent" width="100%">
    <leaflet :data="entries" :loading="isLoading" :usecase="usecase" />
    <router-view />
  </v-card>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useCaseStudyById, useConesGeojson, useSpatialCoveragesGeojson } from '@/api';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useStore } from '@/lib/use-store';

import Leaflet from './Leaflet';

export default {
  name: 'MapWrapper',
  components: {
    Leaflet,
  },
  props: ['author', 'passage', 'keyword', 'usecase', 'place'],
  setup(props) {
    const route = useRoute();
    const store = useStore();

    const searchFilters = computed(() => {
      // FIXME:
      if (Object.values(props).some(isNotNullable)) {
        return {
          stelle__text__autor: props.author,
          stelle: props.passage,
          key_word: props.keyword,
          stelle__use_case: props.usecase,
          // place ?
        };
      }

      function getDateFilters() {
        if (route.query['time'] == null) return {};

        const [start, end] = route.query['time'].toString().includes('+')
          ? route.query['time'].split('+')
          : [route.query['time'] - 5, route.query['time'] + 4];

        const dateFilters =
          store.state.slider === 'passage'
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

      return {
        stelle__text__autor: route.query['Author']?.toString().split('+').join(','),
        stelle: route.query['Passage']?.toString().split('+').join(','),
        key_word: route.query['Keyword']?.toString().split('+').join(','),
        stelle__use_case: route.query['Use Case']?.toString().split('+').join(','),
        // place ?,
        ...getDateFilters(),
        // TODO: respect other config options like intersect
      };
    });

    const spatialCoveragesQuery = useSpatialCoveragesGeojson(searchFilters);
    const conesQuery = useConesGeojson(searchFilters);

    // FIXME: what if we have multiple case studies in route.query
    const id = computed(() => ({ id: props.usecase ?? route.query['Use Case'] }));
    const caseStudyQuery = useCaseStudyById({ id });

    const isLoading = computed(() => {
      return [spatialCoveragesQuery, conesQuery, caseStudyQuery].some(
        (query) => query.isInitialLoading.value
      );
    });

    const spatialCoverages = computed(() => spatialCoveragesQuery.data.value?.features ?? []);
    const cones = computed(() => conesQuery.data.value?.features ?? []);

    const layers = computed(() => caseStudyQuery.data.value?.layer ?? []);

    return {
      isLoading,
      spatialCoverages,
      cones,
      layers,

      // FIXME:
      entries: [{ features: spatialCoverages }, { features: cones }],
    };
  },
  created() {
    this.$root.$refs.mapWrap = this;
  },
};
</script>
