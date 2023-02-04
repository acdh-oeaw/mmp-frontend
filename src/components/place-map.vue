<script lang="ts" setup>
import 'leaflet/dist/leaflet.css';

import { LMap, LMarker, LTileLayer } from 'vue2-leaflet';

const _props = defineProps<{
  point: { lat: number; lng: number };
}>();

const baseLayer = {
  url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  attribution:
    'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
};
</script>

<template>
  <LMap
    height="400"
    :bounds="[
      [34.016242, 5.488281],
      [71.663663, 34.667969],
    ]"
  >
    <LTileLayer :url="baseLayer.url" :attribution="baseLayer.attribution" />
    <LMarker :lat-lng="[point.lat, point.lng]" />
  </LMap>
</template>
