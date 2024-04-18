<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

import { type Marker, type Polygon } from "leaflet";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import { type SpatialCoverageGeojson } from "@/api";
import { debounce } from "@/lib/debounce";
import { key } from "@/lib/geo-map/area-map.context";
import { type AreaMapContext } from "@/lib/geo-map/area-map.types";
import { config, initialViewState, keywordColors } from "@/lib/geo-map/geo-map.config";
import { type SpatialCoverageCenterPoint } from "@/lib/geo-map/geo-map.types";

const props = defineProps<{
	areas: Array<SpatialCoverageGeojson>;
	areaCenterPoints: Array<SpatialCoverageCenterPoint>;
	height: number;
	width: number;
}>();

const context: AreaMapContext = {
	map: null,
	baseLayer: null,
	areas: null,
	areaLabels: null,
};

function updateAreas() {
	const areas = props.areas;

	const featureGroup = context.areas;

	featureGroup?.clearLayers();

	areas.forEach((polygon) => {
		featureGroup?.addData(polygon);
	});
}

function updateAreaLabels() {
	const areaCenterPoints = props.areaCenterPoints;

	const featureGroup = context.areaLabels;

	featureGroup?.clearLayers();

	areaCenterPoints.forEach((point) => {
		featureGroup?.addData(point);
	});
}

const elementRef = ref<HTMLElement | null>(null);

//

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const { map: createMap, tileLayer, marker, geoJSON, divIcon } = await import("leaflet");

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value, config.options).fitBounds(initialViewState.bounds);

	context.baseLayer = tileLayer(config.baseLayer.url, {
		attribution: config.baseLayer.attribution,
		minZoom: 2,
	}).addTo(context.map);

	//

	function getAreaStyles(feature: SpatialCoverageGeojson) {
		const keyword = feature.properties.key_word;
		// FIXME: @see https://github.com/acdh-oeaw/mmp/issues/211
		// assert(keyword != null, "Spatial Coverage is missing a keyword.");

		// const color = keywordColors[keyword.art];
		const color = keyword ? keywordColors[keyword.art] : "#0f172a";

		return {
			color,
			dashArray: "12 6",
			fill: true,
			fillOpacity: 0.18,
			opacity: 0.75,
			stroke: true,
			weight: 2,
		};
	}

	context.areas = geoJSON<SpatialCoverageGeojson["properties"]>(undefined, {
		onEachFeature(feature: SpatialCoverageGeojson, layer: Polygon) {
			layer.on("mouseover", () => {
				const styles = getAreaStyles(feature);
				layer.setStyle({ ...styles, color: "#ef4444", fillOpacity: 0.5 });
			});
			layer.on("mouseout", () => {
				const styles = getAreaStyles(feature);
				layer.setStyle(styles);
			});
		},
		style(feature) {
			if (feature == null) return {};

			const styles = getAreaStyles(feature as SpatialCoverageGeojson);

			return styles;
		},
	}).addTo(context.map);

	function getAreaLabelColor(feature: SpatialCoverageCenterPoint) {
		const keyword = feature.properties.key_word;
		// FIXME: @see https://github.com/acdh-oeaw/mmp/issues/211
		// assert(keyword != null, "Spatial Coverage is missing a keyword.");

		// const color = keywordColors[keyword.art];
		const color = keyword ? keywordColors[keyword.art] : "#0f172a";

		return color;
	}

	context.areaLabels = geoJSON<SpatialCoverageCenterPoint["properties"]>(undefined, {
		onEachFeature(feature: SpatialCoverageCenterPoint, layer: Marker) {
			layer.on("mouseover", () => {
				context.areas?.eachLayer((_area) => {
					const area = _area as Polygon;
					if (area.feature?.id === feature.id) {
						const styles = getAreaStyles(area.feature as SpatialCoverageGeojson);
						area.setStyle({ ...styles, color: "#ef4444", fillOpacity: 0.5 });
					}
				});
			});

			layer.on("mouseout", () => {
				context.areas?.eachLayer((_area) => {
					const area = _area as Polygon;
					if (area.feature?.id === feature.id) {
						const styles = getAreaStyles(area.feature as SpatialCoverageGeojson);
						area.setStyle(styles);
					}
				});
			});
		},
		pointToLayer(feature, latlng) {
			const keyword = feature.properties.key_word;
			const color = getAreaLabelColor(feature as SpatialCoverageCenterPoint);

			// const label = keyword.stichwort
			const label = keyword ? keyword.stichwort : "Unknown";

			const element = divIcon({
				html: `<div class="geo-map-area-label" style="--geo-map-label-bg-color: ${color}">${label}</div>`,
				// @ts-expect-error Missing in upstream types.
				iconSize: "auto",
				/** Ensure the default `leaflet-div-icon` class is not added, which has white background. */
				className: "geo-map-area-label-container",
			});

			const areaLabel = marker(latlng, {
				icon: element,
				autoPanOnFocus: false,
				riseOnHover: true,
			});

			return areaLabel;
		},
	}).addTo(context.map);

	updateAreas();
	updateAreaLabels();
});

const resize = debounce((_width: number, _height: number) => {
	if (context.map == null) return;

	void nextTick(() => {
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
	return props.areas;
}, updateAreas);

watch(() => {
	return props.areaCenterPoints;
}, updateAreaLabels);

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

.geo-map-area-label {
	position: absolute;
	padding-inline: 8px;
	padding-block: 3px;
	border-radius: 4px;
	background-color: var(--geo-map-label-bg-color, "hsl(0deg 0% 0%)");
	color: hsl(0deg 0% 100%);
	font-weight: 500;
	font-size: 12px;
	font-family: "Roboto Flex Variable", ui-sans-serif, system-ui, sans-serif;
	line-height: 1.25;
	text-align: center;
	opacity: 75%;
	pointer-events: auto;
	transform: translate(-50%, -50%);
}

.geo-map-area-label-container {
	border: none;
	background: transparent;
	pointer-events: none;
}
</style>
