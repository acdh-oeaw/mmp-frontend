<script lang="ts" setup>
import 'leaflet/dist/leaflet.css';

import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { map as createMap, marker, tileLayer } from 'leaflet';
import { onMounted, onUnmounted, watch } from 'vue';

import { config, initialViewState } from '@/lib/geo-map/geo-map.config';

const props = defineProps<{
	points: Array<{ lat: number; lng: number }>;
}>();

const context = {
	map: null as LeafletMap | null,
	points: [] as Array<LeafletMarker>,
};

onMounted(() => {
	const map = createMap('geo-map', config.options).fitBounds(initialViewState.bounds);
	context.map = map;

	tileLayer(config.baseLayer.url, { attribution: config.baseLayer.attribution }).addTo(map);

	props.points.forEach(({ lat, lng }) => {
		context.points.push(marker([lat, lng]).addTo(map));
	});
});

onUnmounted(() => {
	context.map?.remove();
});

watch(
	() => props.points,
	(points) => {
		context.points.forEach((point) => {
			point.remove();
		});

		context.points = [];
		const map = context.map;
		if (map == null) return;

		points.forEach(({ lat, lng }) => {
			context.points.push(marker([lat, lng]).addTo(map));
		});
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
