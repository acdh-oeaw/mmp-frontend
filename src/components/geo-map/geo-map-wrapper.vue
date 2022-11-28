<script lang="ts" setup>
import type { Map as LeafletMap } from 'leaflet';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';

import {
  type ConeGeojson,
  type GetConesGeojson,
  type GetSpatialCoveragesGeojson,
  type PlaceGeojsonProperty,
  useCaseStudyById,
  useConesGeojson,
  useLinesPointsGeojson,
  useSpatialCoveragesGeojson,
} from '@/api';
import GeoMap from '@/components/geo-map/geo-map.vue';
import LayerSources from '@/components/geo-map/layer-sources.vue';
import type {
  ConeOriginGeojson,
  RelatedPlaceGeojson,
  SpatialCoverageCenterPoint,
} from '@/lib/geo-map/geo-map.types';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  author?: any;
  passage?: any;
  keyword?: any;
  usecase?: any;
  place?: any;
}>();

const router = useRouter();
const route = useRoute();
const { searchFilters } = useSearchFilters();
const map = ref<LeafletMap | null>(null);

const searchParams = computed(() => {
  // FIXME:
  if (Object.values(props).some(isNotNullable)) {
    const searchParams: GetSpatialCoveragesGeojson.SearchParams | GetConesGeojson.SearchParams = {
      stelle__text__autor: props.author,
      stelle: props.passage,
      key_word: props.keyword,
      stelle__use_case: props.usecase,
      stelle__ort: props.place,
      page_size: 250,
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
    // FIXME: pagination
    page_size: 250,
  };

  return searchParams;
});

const areasGeojsonQuery = useSpatialCoveragesGeojson(searchParams);
const linesPointsGeojsonQuery = useLinesPointsGeojson(searchParams);
const conesGeojsonQuery = useConesGeojson(searchParams);

const isLoading = computed(() => {
  return [areasGeojsonQuery, linesPointsGeojsonQuery, conesGeojsonQuery].some(
    (query) => query.isInitialLoading.value
  );
});
const isEmpty = computed(() => {
  return [areasGeojsonQuery, linesPointsGeojsonQuery, conesGeojsonQuery].every(
    (query) => query.isSuccess.value && query.data.value?.count === 0
  );
});

const areas = computed(() => areasGeojsonQuery.data.value?.features ?? []);
const linesPoints = computed(() => linesPointsGeojsonQuery.data.value?.features ?? []);

function getConeOrigins(feature: ConeGeojson) {
  return feature.properties.texts.flatMap((text) =>
    text.places.filter((place) => place.lat != null && place.lng != null)
  );
}

const cones = computed(
  () =>
    /** Filter out cones without origin place. */
    conesGeojsonQuery.data.value?.features.filter(
      (feature) => getConeOrigins(feature).length > 0
    ) ?? []
);

const coneOrigins = computed(() => {
  const points = new Map<PlaceGeojsonProperty['id'], ConeOriginGeojson>();

  conesGeojsonQuery.data.value?.features.forEach((feature) => {
    /**
     * Spatial coverage areas may be related to multiple passages.
     * And passages themselves are allowed to have relations to multiple places, i.e. origin points.
     */
    for (const place of getConeOrigins(feature)) {
      if (points.has(place.id)) {
        points.get(place.id)?.properties.spatialCoverages.set(feature.id, feature.properties);
      } else {
        const point: ConeOriginGeojson = {
          id: place.id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            coordinates: [place.lng!, place.lat!],
          },
          properties: {
            name: place.name,
            art: place.art,
            spatialCoverages: new Map([[feature.id, feature.properties]]),
          },
        };

        points.set(place.id, point);
      }
    }
  });

  return Array.from(points.values());
});

const areaCenterPoints = computed(() => {
  const points: Array<SpatialCoverageCenterPoint> = [];

  areasGeojsonQuery.data.value?.features.forEach((feature) => {
    const [x1, y1, x2, y2] = feature.bbox as [number, number, number, number];
    const lng = (x1 + x2) / 2;
    const lat = (y1 + y2) / 2;

    const point: SpatialCoverageCenterPoint = {
      id: feature.id,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      /** Use `key_word.stichwort` as label. */
      properties: feature.properties,
    };

    points.push(point);
  });

  return points;
});

const relatedPlaces = computed(() => {
  const places = new Map<PlaceGeojsonProperty['id'], RelatedPlaceGeojson>();

  areasGeojsonQuery.data.value?.features.forEach((feature) => {
    feature.properties.texts.forEach((text) => {
      text.places.forEach((place) => {
        // FIXME: backend should never return places without coordinates
        if (place.lat == null || place.lng == null) return;

        const point: RelatedPlaceGeojson = {
          id: place.id,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [place.lng, place.lat] as [number, number],
          },
          properties: {
            name: place.name,
            name_antik: place.name_antik,
            art: place.art,
          },
        };

        places.set(place.id, point);
      });
    });
  });

  return Array.from(places.values());
});

// FIXME: what if we have multiple case studies in route.query
const id = computed(() => props.usecase ?? route.query['Use Case']);
const caseStudyQuery = useCaseStudyById({ id }, { isEnabled: computed(() => id.value != null) });

const layers = computed(() => caseStudyQuery.data.value?.layer ?? []);

const isFullScreen = useFullScreen();

function onClickGeojsonFeature(id: number, kind: 'area' | 'place') {
  function getRouteName() {
    if (kind === 'place') {
      return isFullScreen.value ? 'Place Detail Fullscreen' : 'Place Detail';
    }
    if (kind === 'area') {
      return isFullScreen.value ? 'Spatial Detail Fullscreen' : 'Spatial Detail';
    }
  }

  router.push({
    name: getRouteName(),
    query: route.query,
    params: { id: String(id) },
  });
}

function onMapReady(leaflet: LeafletMap) {
  map.value = leaflet;
}
</script>

<template>
  <v-card
    color="transparent"
    class="geo-map-container"
    :style="{ '--geo-map-height': isFullScreen ? '100vh' : '640px' }"
  >
    <geo-map
      :areas="areas"
      :area-center-points="areaCenterPoints"
      :cones="cones"
      :cone-origins="coneOrigins"
      :lines-points="linesPoints"
      :related-places="relatedPlaces"
      :layers="layers"
      @click-geojson-feature="onClickGeojsonFeature"
      @map-ready="onMapReady"
    >
      <div class="geo-map-control">
        <v-btn
          fab
          small
          :to="{ name: isFullScreen ? 'Map' : 'Map Fullscreen', query: route.query }"
        >
          <v-icon v-if="isFullScreen">mdi-fullscreen-exit</v-icon>
          <v-icon v-else>mdi-fullscreen</v-icon>
        </v-btn>
      </div>
    </geo-map>

    <layer-sources :layers="layers" />

    <v-overlay absolute opacity=".2" :value="isLoading">
      <v-progress-circular color="primary" indeterminate />
    </v-overlay>
    <v-overlay absolute opacity=".2" :value="isEmpty">
      <span class="geo-map-overlay-text">Nothing found.</span>
    </v-overlay>

    <router-view />
  </v-card>
</template>

<style scoped>
.geo-map-container {
  display: grid;
  grid-template-rows: var(--geo-map-height, 640px) auto;
  width: 100%;
  position: relative;
}

.geo-map-control {
  position: absolute;
  right: 8px;
  bottom: 24px;
}

.geo-map-overlay-text {
  color: hsl(0deg 0% 0%);
}
</style>
