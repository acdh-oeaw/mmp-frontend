<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { debounce } from "@/lib/debounce";
import { config, initialViewState } from "@/lib/geo-map/geo-map.config";
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

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const { map: createMap, tileLayer, marker, icon } = await import("leaflet");
	const { default: iconUrl } = await import("leaflet/dist/images/marker-icon.png");
	const { default: iconRetinaUrl } = await import("leaflet/dist/images/marker-icon-2x.png");
	const { default: shadowUrl } = await import("leaflet/dist/images/marker-shadow.png");

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
				icon: icon({ iconUrl, iconRetinaUrl, shadowUrl }),
				autoPanOnFocus: false,
				riseOnHover: true,
				title: point.label,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			}).addTo(context.map!),
		);
	});
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
