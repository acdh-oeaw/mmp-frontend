<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { config, initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/place-map.context";
import { type PlaceMapContext } from "@/lib/geo-map/place-map.types";

const props = defineProps<{
	points: Array<{ lat: number; lng: number; label: string }>;
}>();

const context: PlaceMapContext = {
	map: null,
	baseLayer: null,
	points: [],
};

const elementRef = ref<HTMLElement | null>(null);

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const { map: createMap, tileLayer, marker } = await import("leaflet");

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value, config.options).fitBounds(initialViewState.bounds);

	context.baseLayer = tileLayer(config.baseLayer.url, {
		attribution: config.baseLayer.attribution,
		minZoom: 2,
	}).addTo(context.map);

	props.points.forEach((point) => {
		context.points.push(
			// TODO: do we want to `bindTooltip` instead of html `title`?
			marker([point.lat, point.lng], {
				autoPanOnFocus: false,
				riseOnHover: true,
				title: point.label,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			}).addTo(context.map!),
		);
	});
});

onUnmounted(() => {
	context.map?.remove();
});

watch(
	() => {
		return props.points;
	},
	(points) => {
		context.points.forEach((point) => {
			point.remove();
		});
		context.points = [];

		nextTick(async () => {
			/** `leaflet` assumes `window` global. */
			const { marker } = await import("leaflet");

			const map = context.map;
			if (map == null) return;

			points.forEach((point) => {
				context.points.push(
					// TODO: do we want to `bindTooltip` instead of html `title`?
					marker([point.lat, point.lng], {
						autoPanOnFocus: false,
						riseOnHover: true,
						title: point.label,
					}).addTo(map),
				);
			});
		});
	},
);

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
