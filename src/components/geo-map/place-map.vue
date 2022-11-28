<script lang="ts" setup>
import 'leaflet/dist/leaflet.css';

import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { type LatLngBoundsLiteral, map as createMap, marker, tileLayer } from 'leaflet';
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  point: { lat: number; lng: number };
}>();

const baseLayer = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
};

const initialViewState = {
  bounds: [
    [34.016242, 5.488281],
    [71.663663, 34.667969],
  ] as LatLngBoundsLiteral,
};

const context = {
  map: null as LeafletMap | null,
  point: null as LeafletMarker | null,
};

onMounted(() => {
  const map = createMap('geo-map', { preferCanvas: true }).fitBounds(initialViewState.bounds);
  context.map = map;

  tileLayer(baseLayer.url, { attribution: baseLayer.attribution }).addTo(map);

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
