<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { colors, config, initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/place-map.context";
import { type PlaceMapContext } from "@/lib/geo-map/place-map.types";

const props = defineProps<{
	height: number;
	points: Array<{ lat: number; lng: number; label: string }>;
	width: number;
}>();

const context: PlaceMapContext = {
	map: null,
	baseLayer: null,
	points: [],
};

const elementRef = ref<HTMLElement | null>(null);

async function updatePoints() {
	context.points.forEach((point) => {
		point.remove();
	});
	context.points = [];

	nextTick(async () => {
		/** `leaflet` assumes `window` global. */
		const { circleMarker } = await import("leaflet");

		const map = context.map;
		if (map == null) return;

		props.points.forEach((point) => {
			context.points.push(
				circleMarker([point.lat, point.lng], {
					color: colors.coneOrigins,
					fill: true,
					fillOpacity: 0.18,
					opacity: 0.75,
					radius: 3,
					stroke: true,
					weight: 2,
				})
					.bindTooltip(() => {
						return point.label;
					})
					.addTo(map),
			);
		});
	});
}

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const { map: createMap, tileLayer } = await import("leaflet");

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value, config.options).fitBounds(initialViewState.bounds);

	context.baseLayer = tileLayer(config.baseLayer.url, {
		attribution: config.baseLayer.attribution,
		minZoom: 2,
	}).addTo(context.map);

	void updatePoints();
});

const resize = debounce((_width: number, _height: number) => {
	if (context.map == null) return;

	nextTick(() => {
		context.map?.invalidateSize();
	});
});

watch(
	[
		() => {
			return props.width;
		},
		() => {
			return props.height;
		},
	],
	([width, height]) => {
		resize(width, height);
	},
);

watch(() => {
	return props.points;
}, updatePoints);

onUnmounted(() => {
	context.map?.remove();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-place-map />
	<slot :context="context" />
</template>

<style>
.leaflet-container {
	isolation: isolate;
}

.leaflet-container:focus {
	outline: none;
}

.leaflet-tooltip {
	white-space: unset;
}
</style>
