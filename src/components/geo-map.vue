<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { type Map as LeafletMap } from "leaflet";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import {
	type ConeGeojson,
	type GeojsonLayer,
	type LinesPointsGeojson,
	type ResourceKey,
	type SpatialCoverage,
	type SpatialCoverageGeojson,
} from "@/api";
import { debounce } from "@/lib/debounce";
import { config, initialViewState } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/geo-map.context";
import { type GeoMapContext } from "@/lib/geo-map/geo-map.types";

const props = defineProps<{
	areas: Array<SpatialCoverageGeojson>;
	cones: Array<ConeGeojson>;
	height: number;
	highlightedKeys: Set<ResourceKey>;
	layers: Map<GeojsonLayer["id"], GeojsonLayer>;
	linesPoints: Array<LinesPointsGeojson>;
	selectedKeys: Set<ResourceKey>;
	width: number;
}>();

const emit = defineEmits<{
	(event: "area-click", area: SpatialCoverage | null): void;
	(event: "area-hover", area: SpatialCoverage | null): void;
	(event: "point-click", point: SpatialCoverage | null): void;
	(event: "point-hover", point: SpatialCoverage | null): void;
	(event: "ready", map: LeafletMap): void;
}>();

const context: GeoMapContext = {
	map: null,
};

const elementRef = ref<HTMLElement | null>(null);

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const { map: createMap, tileLayer } = await import("leaflet");

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value, config.options).fitBounds(initialViewState.bounds);

	tileLayer(config.baseLayer.url, {
		attribution: config.baseLayer.attribution,
		minZoom: 2,
	}).addTo(context.map);

	emit("ready", context.map);
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

onUnmounted(() => {
	context.map?.remove();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-geo-map />
	<slot :context="context" />
</template>
