<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { type Map as LeafletMap } from "leaflet";
import { onMounted, onUnmounted, ref, watch } from "vue";

import {
	type ConeGeojson,
	type GeojsonLayer,
	type LinesPointsGeojson,
	type ResourceKey,
	type SpatialCoverage,
	type SpatialCoverageGeojson,
} from "@/api";
import { debounce } from "@/lib/debounce";

interface GeoMapContext {
	map: LeafletMap | null;
}

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
	const createMap = await import("leaflet").then((module) => {
		return module.map;
	});

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value);

	emit("ready", context.map);
});

const resize = debounce((width: number, height: number) => {
	if (context.map == null) return;

	// context.map.width(width);
	// context.map.height(height);
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
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-geo-map>
		<slot :context="context" />
	</div>
</template>
