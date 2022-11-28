<script lang="ts" setup>
import 'leaflet/dist/leaflet.css';

import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { map as createMap, marker, tileLayer } from 'leaflet';
import { onMounted, onUnmounted, watch } from 'vue';

import { config, initialViewState } from '@/lib/geo-map/geo-map.config';

const props = defineProps<{
  point: { lat: number; lng: number };
}>();

const context = {
  map: null as LeafletMap | null,
  point: null as LeafletMarker | null,
};

onMounted(() => {
  const map = createMap('geo-map', config.options).fitBounds(initialViewState.bounds);
  context.map = map;

  tileLayer(config.baseLayer.url, { attribution: config.baseLayer.attribution }).addTo(map);

  const point = marker([props.point.lat, props.point.lng]).addTo(map);
  context.point = point;
});

onUnmounted(() => {
  context.map?.remove();
});

watch(
  () => props.point,
  (point) => {
    if (context.point == null) return;
    context.point.setLatLng([point.lat, point.lng]);
  }
);
</script>

<template>
  <div id="geo-map" data-geo-map="" />
</template>

<style scoped>
[data-geo-map] {
  height: 400px;
}
</style>
