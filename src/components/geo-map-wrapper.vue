<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useCaseStudyById, useConesGeojson, useSpatialCoveragesGeojson } from '@/api';
import GeoMap from '@/components/geo-map.vue';
import { useGeoMapSearchParams } from '@/lib/search/use-geo-map-search-params';

// FIXME:
const props = defineProps<{
  usecase?: any;
}>();

const route = useRoute();

const searchParams = useGeoMapSearchParams();
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

// TODO:
const _layers = computed(() => caseStudyQuery.data.value?.layer ?? []);

// FIXME: only temporary because the map component requires this shape
const entries = computed(() => {
  return [{ features: spatialCoverages.value }, { features: cones.value }] as const;
});
</script>

<template>
  <VCard color="transparent" width="100%">
    <GeoMap :data="entries" :loading="isLoading" :usecase="usecase" />
    <RouterView />
  </VCard>
</template>
