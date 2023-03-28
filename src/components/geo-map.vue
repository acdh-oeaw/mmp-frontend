<script lang="ts" setup>
import "leaflet/dist/leaflet.css";

// import { assert } from "@stefanprobst/assert";
import {
	type CircleMarker,
	type LatLngBoundsLiteral,
	type Map as LeafletMap,
	type Marker,
	type PathOptions,
	type Polygon,
} from "leaflet";
import { nextTick, onMounted, onUnmounted, provide, ref, watch } from "vue";

import {
	type ConeGeojson,
	type GeojsonLayer,
	type LinesPointsGeojson,
	type SpatialCoverageGeojson,
} from "@/api";
import { debounce } from "@/lib/debounce";
import { createAreaTooltipContent } from "@/lib/geo-map/create-area-tooltip-content";
import { createConeOriginTooltipContent } from "@/lib/geo-map/create-cone-origin-tooltip-content";
import { createLinesPointsTooltipContent } from "@/lib/geo-map/create-lines-points-tooltip-content";
import { colors, config, initialViewState, keywordColors } from "@/lib/geo-map/geo-map.config";
import { key } from "@/lib/geo-map/geo-map.context";
import {
	type ConeOriginGeojson,
	type FeatureLayers,
	type GeoMapContext,
	type SpatialCoverageCenterPoint,
} from "@/lib/geo-map/geo-map.types";
import { type SelectionKey, createSelectionKey } from "@/lib/search/selection-key";

const props = defineProps<{
	areas: Array<SpatialCoverageGeojson>;
	areaCenterPoints: Array<SpatialCoverageCenterPoint>;
	cones: Array<ConeGeojson>;
	coneOrigins: Array<ConeOriginGeojson>;
	height: number;
	highlightedKeys: Set<SelectionKey>;
	layers: Map<GeojsonLayer["id"], GeojsonLayer>;
	linesPoints: Array<LinesPointsGeojson>;
	selectedKeys: Set<SelectionKey>;
	width: number;
}>();

const emit = defineEmits<{
	(event: "area-click", area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null): void;
	(event: "area-hover", area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null): void;
	(event: "point-click", point: ConeOriginGeojson | null): void;
	(event: "point-hover", point: ConeOriginGeojson | null): void;
	(event: "lines-points-click", point: LinesPointsGeojson | null): void;
	(event: "lines-points-hover", point: LinesPointsGeojson | null): void;
	(event: "ready", map: LeafletMap): void;
}>();

const context: GeoMapContext = {
	map: null,
	baseLayer: null,
	layers: {},
	featureGroups: {
		areas: null,
		areaLabels: null,
		cones: null,
		coneOrigins: null,
		linesPoints: null,
	},
	highlights: {
		areas: null,
		cones: null,
	},

	visibility: {
		featureGroups: ref(
			new Set<keyof FeatureLayers>(["areas", "areaLabels", "cones", "coneOrigins", "linesPoints"]),
		),
		layers: ref(new Set<GeojsonLayer["id"]>([...props.layers.keys()])),
	},
	overlays: {
		areas: ref<Array<SpatialCoverageGeojson>>([]),
		cones: ref<Array<ConeOriginGeojson>>([]),
	},
};

//

async function updateLayers() {
	const layers = props.layers;

	Object.values(context.layers).forEach((layer) => {
		layer?.remove();
	});

	/** `leaflet` assumes `window` global. */
	const { geoJSON } = await import("leaflet");

	const map = context.map;
	if (map == null) return;

	context.layers = {};
	layers.forEach((layer) => {
		if (context.visibility.layers.value.has(layer.id)) {
			context.layers[layer.id] = geoJSON(layer.data).addTo(map);
		}
	});
}

function updateLinesPoints() {
	const linesPoints = props.linesPoints;
	const isVisible = context.visibility.featureGroups.value.has("linesPoints");

	const featureGroup = context.featureGroups.linesPoints;

	featureGroup?.clearLayers();

	if (isVisible) {
		linesPoints.forEach((polygon) => {
			featureGroup?.addData(polygon);
		});
	}
}

function updateCones() {
	const cones = props.cones;
	const isVisible = context.visibility.featureGroups.value.has("cones");

	const featureGroup = context.featureGroups.cones;

	featureGroup?.clearLayers();

	if (isVisible) {
		cones.forEach((polygon) => {
			featureGroup?.addData(polygon);
		});
	}
}

function updateAreas() {
	const areas = props.areas;
	const isVisible = context.visibility.featureGroups.value.has("areas");

	const featureGroup = context.featureGroups.areas;

	featureGroup?.clearLayers();

	if (isVisible) {
		areas.forEach((polygon) => {
			featureGroup?.addData(polygon);
		});
	}
}

function updateOverlayAreas() {
	const isVisible = context.visibility.featureGroups.value.has("areas");

	const featureGroup = context.highlights.areas;

	featureGroup?.clearLayers();

	if (isVisible) {
		context.overlays.areas.value.forEach((polygon) => {
			featureGroup?.addData(polygon);
		});
	}
}

function updateOverlayCones() {
	const isVisible = context.visibility.featureGroups.value.has("cones");

	const featureGroup = context.highlights.cones;

	featureGroup?.clearLayers();

	if (isVisible) {
		context.overlays.cones.value.forEach((polygon) => {
			featureGroup?.addData(polygon);
		});
	}
}

function updateConeOrigins() {
	const coneOrigins = props.coneOrigins;
	const isVisible = context.visibility.featureGroups.value.has("coneOrigins");

	const featureGroup = context.featureGroups.coneOrigins;

	featureGroup?.clearLayers();

	if (isVisible) {
		coneOrigins.forEach((point) => {
			featureGroup?.addData(point);
		});
	}
}

function updateAreaLabels() {
	const areaCenterPoints = props.areaCenterPoints;
	const isVisible = context.visibility.featureGroups.value.has("areaLabels");

	const featureGroup = context.featureGroups.areaLabels;

	featureGroup?.clearLayers();

	if (isVisible) {
		areaCenterPoints.forEach((point) => {
			featureGroup?.addData(point);
		});
	}
}

function updateStackingOrder() {
	nextTick(() => {
		Object.values(context.layers).forEach((layer) => {
			layer?.bringToFront();
		});
		context.featureGroups.cones?.bringToFront();
		context.featureGroups.areas?.bringToFront();
		context.highlights.areas?.bringToFront();
		context.highlights.cones?.bringToFront();
		context.featureGroups.linesPoints?.bringToFront();
		context.featureGroups.coneOrigins?.bringToFront();
		context.featureGroups.areaLabels?.bringToFront();
	});
}

function updateBounds() {
	const areas = props.areas;
	const coneOrigins = props.coneOrigins;

	if (
		[areas, coneOrigins].every((features) => {
			return features.length === 0;
		})
	) {
		const bounds = initialViewState.bounds;

		nextTick(() => {
			context.map?.flyToBounds(bounds, { duration: 0.25 });
		});
	} else if (areas.length) {
		const lng: Array<number> = [];
		const lat: Array<number> = [];

		areas.forEach((area) => {
			const [x1, y1, x2, y2] = area.bbox as [number, number, number, number];
			lng.push(x1, x2);
			lat.push(y1, y2);
		});

		coneOrigins.forEach((place) => {
			const [x, y] = place.geometry.coordinates as [number, number];
			lng.push(x);
			lat.push(y);
		});

		const bounds: LatLngBoundsLiteral = [
			[Math.min(...lat), Math.min(...lng)],
			[Math.max(...lat), Math.max(...lng)],
		];

		nextTick(() => {
			/**
			 * Note that leaflet currently does not properly cancel previous `fitBounds` animations,
			 * which means that when cone origins load quickly after spatial coverage areas,
			 * two `fitBounds` events are triggered, but the last, correct one is swallowed.
			 *
			 * Seems to work with `flyToBounds`.
			 * Alternatively, disable animation on `fitBounds`:
			 * ```ts
			 * geoMap?.map?.fitBounds(bounds, { animate: false });
			 * ```
			 *
			 * @see https://github.com/Leaflet/Leaflet/issues/3249
			 */
			context.map?.flyToBounds(bounds, { duration: 0.25 });
		});
	}
}

//

const elementRef = ref<HTMLElement | null>(null);

onMounted(async () => {
	/** `leaflet` assumes `window` global. */
	const {
		map: createMap,
		tileLayer,
		geoJSON,
		circleMarker,
		divIcon,
		marker,
	} = await import("leaflet");

	if (elementRef.value == null) return;

	context.map = createMap(elementRef.value, config.options).fitBounds(initialViewState.bounds);

	//

	context.baseLayer = tileLayer(config.baseLayer.url, {
		attribution: config.baseLayer.attribution,
		minZoom: 2,
	}).addTo(context.map);

	//

	function getConeStyles(_feature: ConeGeojson): PathOptions {
		const color = colors.cones;

		return {
			color,
			dashArray: "4",
			fill: true,
			fillOpacity: 0.18,
			opacity: 0.75,
			stroke: true,
			weight: 1,
		};
	}

	context.featureGroups.cones = geoJSON<ConeGeojson["properties"]>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const styles = getConeStyles(feature as ConeGeojson);

			return styles;
		},
	}).addTo(context.map);

	//

	function getAreaStyles(feature: SpatialCoverageGeojson): PathOptions {
		const keyword = feature.properties.key_word;
		// FIXME: @see https://github.com/acdh-oeaw/mmp/issues/211
		// assert(keyword != null, "Spatial Coverage is missing a keyword.");

		const key: SelectionKey = createSelectionKey({ id: feature.id, kind: "geojson-area" });
		const isSelected = props.selectedKeys.has(key);
		// const color = keywordColors[keyword.art];
		const color = keyword ? keywordColors[keyword.art] : "#0f172a";

		return {
			color: isSelected ? "#ef4444" : color,
			dashArray: "12 6",
			fill: true,
			fillOpacity: isSelected ? 0.36 : 0.18,
			opacity: 0.75,
			stroke: true,
			weight: 2,
		};
	}

	context.featureGroups.areas = geoJSON<SpatialCoverageGeojson["properties"]>(undefined, {
		onEachFeature(feature: SpatialCoverageGeojson, layer: Polygon) {
			layer.bindTooltip(createAreaTooltipContent(feature), { permanent: false, sticky: true });

			layer.on({
				click() {
					emit("area-click", feature);
				},
			});

			layer.on("mouseover", () => {
				const styles = getAreaStyles(feature);
				layer.setStyle({ ...styles, color: "#ef4444", fillOpacity: 0.54 });
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

	//

	context.featureGroups.linesPoints = geoJSON<LinesPointsGeojson["properties"]>(undefined, {
		onEachFeature(feature: LinesPointsGeojson, layer: CircleMarker) {
			layer.bindTooltip(createLinesPointsTooltipContent(feature), {
				permanent: false,
				sticky: true,
			});

			layer.on({
				click() {
					emit("lines-points-click", feature);
				},
			});
		},
		pointToLayer(feature, latlng) {
			const color = colors.linesPoints;

			const point = circleMarker(latlng, {
				color,
				fill: true,
				fillOpacity: 0.18,
				opacity: 0.75,
				radius: 3,
				stroke: true,
				weight: 2,
			});

			return point;
		},
		style(feature) {
			if (feature == null) return {};

			const color = colors.linesPoints;

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	}).addTo(context.map);

	//

	context.featureGroups.coneOrigins = geoJSON<ConeOriginGeojson["properties"]>(undefined, {
		onEachFeature(feature: ConeOriginGeojson, layer: CircleMarker) {
			layer.bindTooltip(createConeOriginTooltipContent(feature), {
				permanent: false,
				sticky: true,
			});

			layer.on({
				click() {
					emit("point-click", feature);
				},
			});
		},
		pointToLayer(feature, latlng) {
			const color = colors.coneOrigins;

			const point = circleMarker(latlng, {
				color,
				fill: true,
				fillOpacity: 0.18,
				opacity: 0.75,
				radius: 3,
				stroke: true,
				weight: 2,
			});

			return point;
		},
	}).addTo(context.map);

	//

	function getAreaLabelColor(feature: SpatialCoverageCenterPoint) {
		const keyword = feature.properties.key_word;
		// FIXME: @see https://github.com/acdh-oeaw/mmp/issues/211
		// assert(keyword != null, "Spatial Coverage is missing a keyword.");

		// const color = keywordColors[keyword.art];
		const color = keyword ? keywordColors[keyword.art] : "#0f172a";

		return color;
	}

	context.featureGroups.areaLabels = geoJSON<SpatialCoverageCenterPoint["properties"]>(undefined, {
		onEachFeature(feature: SpatialCoverageCenterPoint, layer: Marker) {
			layer.on({
				click() {
					emit("area-click", feature);
				},
			});

			layer.on("mouseover", () => {
				context.featureGroups.areas?.eachLayer((_area) => {
					const area = _area as Polygon;
					if (area.feature?.id === feature.id) {
						const styles = getAreaStyles(area.feature as SpatialCoverageGeojson);
						area.setStyle({ ...styles, color: "#ef4444", fillOpacity: 0.5 });
					}
				});
			});

			layer.on("mouseout", () => {
				context.featureGroups.areas?.eachLayer((_area) => {
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

	//

	context.highlights.areas = geoJSON<SpatialCoverageGeojson["properties"]>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const color = colors.areaHighlights;

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	});

	context.highlights.cones = geoJSON<ConeGeojson["properties"]>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const color = colors.coneHighlights;

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	});

	//

	context.map.on("zoomend", () => {
		if (context.map == null) return;

		const zoomLevel = context.map.getZoom();

		if (zoomLevel <= 4 && context.visibility.featureGroups.value.has("areaLabels")) {
			context.visibility.featureGroups.value.delete("areaLabels");
		} else if (zoomLevel > 4 && !context.visibility.featureGroups.value.has("areaLabels")) {
			context.visibility.featureGroups.value.add("areaLabels");
		}
	});

	//

	updateLayers();
	updateLinesPoints();
	updateCones();
	updateAreas();
	updateOverlayAreas();
	updateOverlayCones();
	updateConeOrigins();
	updateAreaLabels();
	updateStackingOrder();
	updateBounds();

	//

	emit("ready", context.map);
});

//

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

//

watch(
	[
		() => {
			return props.layers;
		},
		context.visibility.layers,
	],
	updateLayers,
);

watch(
	[
		() => {
			return props.cones;
		},
		() => {
			return context.visibility.featureGroups.value.has("cones");
		},
	],
	updateCones,
);

watch(
	[
		() => {
			return props.areas;
		},
		() => {
			return context.visibility.featureGroups.value.has("areas");
		},
	],
	updateAreas,
);

watch(
	[
		() => {
			return props.linesPoints;
		},
		() => {
			return context.visibility.featureGroups.value.has("linesPoints");
		},
	],
	updateLinesPoints,
);

watch(
	[
		context.overlays.areas,
		() => {
			return context.visibility.featureGroups.value.has("areas");
		},
	],
	updateOverlayAreas,
	{ immediate: true },
);

watch(
	[
		context.overlays.cones,
		() => {
			return context.visibility.featureGroups.value.has("cones");
		},
	],
	updateOverlayCones,
);

watch(
	[
		() => {
			return props.coneOrigins;
		},
		() => {
			return context.visibility.featureGroups.value.has("coneOrigins");
		},
	],
	updateConeOrigins,
);

watch(
	[
		() => {
			return props.areaCenterPoints;
		},
		() => {
			return context.visibility.featureGroups.value.has("areaLabels");
		},
	],
	updateAreaLabels,
);

watch(
	[
		() => {
			return props.areas;
		},
		() => {
			return props.coneOrigins;
		},
	],
	updateBounds,
);

watch(
	[
		() => {
			return props.areas;
		},
		() => {
			return props.areaCenterPoints;
		},
		() => {
			return props.cones;
		},
		() => {
			return props.coneOrigins;
		},
		() => {
			return props.linesPoints;
		},
		() => {
			return props.layers;
		},
		context.overlays.areas,
		context.overlays.cones,
		context.visibility.layers,
		context.visibility.featureGroups,
	],
	updateStackingOrder,
);

//

onUnmounted(() => {
	context.map?.remove();
});

provide(key, context);
</script>

<template>
	<div ref="elementRef" class="absolute inset-0 grid" data-geo-map />
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
	padding-block: 3px;
	padding-inline: 8px;
	border-radius: 4px;
	background-color: var(--geo-map-label-bg-color, "hsl(0deg 0% 0%)");
	color: hsl(0deg 0% 100%);
	font-weight: 500;
	font-size: 12px;
	font-family: "Roboto FlexVariable", ui-sans-serif, system-ui, sans-serif;
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

.geo-map-tooltip {
	display: grid;
	gap: 4px;
	overflow: auto;
	width: max-content;
	max-width: 256px;
	max-height: 256px;
	font-size: 12px;
	font-family: "Roboto FlexVariable", ui-sans-serif, system-ui, sans-serif;
	white-space: unset;
	overflow-wrap: unset;
}

.geo-map-tooltip strong {
	font-weight: 500;
}

.geo-map-tooltip ul {
	display: grid;
	gap: 4px;
	padding: 0;
	list-style: none;
	font-size: 10px;
}
</style>
