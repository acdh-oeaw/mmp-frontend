<script lang="ts" setup>
import 'leaflet/dist/leaflet.css';

import { assert } from '@stefanprobst/assert';
import type { CircleMarker, GeoJSON, Map as LeafletMap, Marker, Polygon, TileLayer } from 'leaflet';
import {
	circleMarker,
	control,
	divIcon,
	geoJSON,
	latLngBounds,
	map as createMap,
	marker,
	tileLayer,
} from 'leaflet';
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import type { ConeGeojson, GeojsonLayer, LinesPointsGeojson, SpatialCoverageGeojson } from '@/api';
import { config, initialViewState } from '@/lib/geo-map/geo-map.config';
import type { ConeOriginGeojson, SpatialCoverageCenterPoint } from '@/lib/geo-map/geo-map.types';

type FeatureLayers = {
	areas: GeoJSON<SpatialCoverageGeojson['properties']> | null;
	areaLabels: GeoJSON<SpatialCoverageCenterPoint['properties']> | null;
	cones: GeoJSON<ConeGeojson['properties']> | null;
	coneOrigins: GeoJSON<ConeOriginGeojson['properties']> | null;
	linesPoints: GeoJSON<LinesPointsGeojson['properties']> | null;
};

type HighlightFeatureLayers = {
	areas: GeoJSON<SpatialCoverageGeojson['properties']> | null;
	cones: GeoJSON<ConeGeojson['properties']> | null;
};

type GeoMapState = {
	map: LeafletMap | null;
	baseLayer: TileLayer | null;
	layers: Record<GeojsonLayer['id'], GeoJSON | null>;
	featureGroups: FeatureLayers;
	highlights: HighlightFeatureLayers;
};

const props = defineProps<{
	areas: Array<SpatialCoverageGeojson>;
	areaCenterPoints: Array<SpatialCoverageCenterPoint>;
	cones: Array<ConeGeojson>;
	coneOrigins: Array<ConeOriginGeojson>;
	layers: Array<GeojsonLayer>;
	linesPoints: Array<LinesPointsGeojson>;
}>();

const emit = defineEmits<{
	(event: 'click-geojson-feature', id: number, kind: 'area' | 'place'): void;
	(event: 'map-ready', map: LeafletMap): void;
}>();

const geoMap: GeoMapState = {
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
};

const overlayAreas = ref<Array<SpatialCoverageGeojson>>([]);

const overlayCones = ref<Array<ConeOriginGeojson>>([]);

// TODO: overlayed lines-and-points?

// FIXME: use reactive in vue 3
const visibleFeatureGroups = ref(
	new Set<keyof FeatureLayers>(['areas', 'areaLabels', 'cones', 'coneOrigins', 'linesPoints'])
);
// FIXME: use reactive in vue 3
const visibleLayers = ref(new Set<GeojsonLayer['id']>([]));

function createAreaTooltipContent(feature: SpatialCoverageGeojson | ConeGeojson) {
	const label = feature.properties.key_word?.stichwort;
	const type = feature.properties.key_word?.art;
	const passages = feature.properties.stelle;

	return `<div class="geo-map-tooltip">
    <strong>${label} (${type})</strong>
    <ul role="list">
      ${passages
				.map((passage) => {
					return `<li>
          <span>${passage.display_label}</span>
        </li>`;
				})
				.join('\n')}
    </ul>
  </div>`;
}

function createConeOriginTooltipContent(feature: ConeOriginGeojson) {
	const label = feature.properties.name;
	const type = feature.properties.art?.label;
	const areas = Array.from(feature.properties.spatialCoverages.values());

	return `<div class="geo-map-tooltip">
    <strong>${label} (${type})</strong>
    <ul role="list">
      ${areas
				.map((feature) => {
					const label = feature.key_word?.stichwort;
					const type = feature.key_word?.art;

					return `<li>
            <span>${label} (${type})</span>
          </li>`;
				})
				.join('\n')}
    </ul>
  </div>`;
}

onMounted(() => {
	const map = createMap('geo-map', config.options).fitBounds(initialViewState.bounds);

	map.on('zoomend', () => {
		const zoomLevel = map.getZoom();
		// TODO: should be unnecessary in vue v3
		const values = new Set(visibleFeatureGroups.value);

		if (zoomLevel <= 4 && visibleFeatureGroups.value.has('areaLabels')) {
			values.delete('areaLabels');
			visibleFeatureGroups.value = values;
		} else if (zoomLevel > 4 && !visibleFeatureGroups.value.has('areaLabels')) {
			values.add('areaLabels');
			visibleFeatureGroups.value = values;
		}
	});

	geoMap.map = map;
	emit('map-ready', map);

	geoMap.baseLayer = tileLayer(config.baseLayer.url, { ...config.baseLayer }).addTo(map);

	geoMap.featureGroups.cones = geoJSON<ConeGeojson['properties']>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const color = 'hsl(50deg 100% 75%)';

			return {
				color,
				dashOffset: '10',
				dashArray: '5',
				fill: true,
				fillOpacity: 0.15,
				opacity: 0.75,
				stroke: true,
				weight: 1,
			};
		},
	}).addTo(map);

	geoMap.featureGroups.areas = geoJSON<SpatialCoverageGeojson['properties']>(undefined, {
		onEachFeature(feature: SpatialCoverageGeojson, layer: Polygon) {
			layer.bindTooltip(createAreaTooltipContent(feature), { permanent: false, sticky: true });

			layer.on({
				click() {
					emit('click-geojson-feature', feature.id, 'area');
				},
			});
		},
		style(feature) {
			if (feature == null) return {};
			const keyword = feature.properties.key_word?.stichwort;
			assert(keyword != null, 'Spatial Coverage is missing a keyword.');

			// const color = getKeywordColor(keyword);
			const color = 'hsl(0deg 0% 0%)';

			return {
				color,
				dashOffset: '15',
				dashArray: '15',
				fill: true,
				fillOpacity: 0.15,
				opacity: 0.75,
				stroke: true,
				weight: 2,
			};
		},
	}).addTo(map);

	geoMap.featureGroups.linesPoints = geoJSON<LinesPointsGeojson['properties']>(undefined, {
		onEachFeature(_feature: LinesPointsGeojson, _layer: CircleMarker) {
			// TODO: tooltips for geometry collection?
			// TODO: do we get any metadata for e.g. points in this collection? like a place name?
		},
		pointToLayer(feature, latlng) {
			const color = 'hsl(320deg 75% 75%)';

			const point = circleMarker(latlng, {
				color,
				fill: true,
				fillOpacity: 0.15,
				opacity: 0.75,
				radius: 3,
				stroke: true,
				weight: 2,
			});

			return point;
		},
		style(feature) {
			if (feature == null) return {};

			const color = 'hsl(320deg 75% 75%)';

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	}).addTo(map);

	geoMap.highlights.areas = geoJSON<SpatialCoverageGeojson['properties']>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const color = 'hsl(0deg 75% 75%)';

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	});

	geoMap.highlights.cones = geoJSON<ConeGeojson['properties']>(undefined, {
		style(feature) {
			if (feature == null) return {};

			const color = 'hsl(0deg 75% 75%)';

			return {
				color,
				fill: false,
				stroke: true,
				weight: 2,
			};
		},
	});

	geoMap.featureGroups.coneOrigins = geoJSON<ConeOriginGeojson['properties']>(undefined, {
		onEachFeature(feature: ConeOriginGeojson, layer: CircleMarker) {
			layer.bindTooltip(createConeOriginTooltipContent(feature), {
				permanent: false,
				sticky: true,
			});

			layer.on({
				click() {
					emit('click-geojson-feature', feature.id, 'place');
				},
			});
		},
		pointToLayer(feature, latlng) {
			const color = 'hsl(0deg 0% 0%)';

			const point = circleMarker(latlng, {
				color,
				fill: true,
				fillOpacity: 0.15,
				opacity: 0.75,
				radius: 3,
				stroke: true,
				weight: 2,
			});

			return point;
		},
	}).addTo(map);

	geoMap.featureGroups.areaLabels = geoJSON<SpatialCoverageCenterPoint['properties']>(undefined, {
		onEachFeature(_feature: SpatialCoverageCenterPoint, _layer: Marker) {
			// TODO: on click highlight area by either (i) adding to separate overlay feature group, or (ii) simply setStyle() on the area layer
			// if (highlightedAreas.value.has(feature.id))
			// if (overlayAreas.value.has(feature.id))
		},
		pointToLayer(feature, latlng) {
			const keyword = feature.properties.key_word?.stichwort;
			assert(keyword != null, 'Spatial Coverage is missing a keyword.');

			// const color = getKeywordColor(keyword);
			const color = 'hsl(0deg 0% 0%)';

			const element = divIcon({
				html: `<div class="geo-map-area-label" style="--geo-map-label-bg-color: ${color}">${keyword}</div>`,
				// @ts-expect-error Missing in upstream types.
				iconSize: 'auto',
				/** Ensure the default `leaflet-div-icon` class is not added, which has white background. */
				className: 'geo-map-area-label-container',
			});

			const label = marker(latlng, {
				icon: element,
				// @ts-expect-error Missing in upstream types.
				autoPanOnFocus: false,
				riseOnHover: true,
			});

			return label;
		},
	}).addTo(map);

	// @ts-expect-error Incorrect upstream types.
	control.layers({ base: geoMap.baseLayer }, geoMap.featureGroups).addTo(map);
});

onUnmounted(() => {
	geoMap.map?.remove();
});

//

// function onZoomIn() {
//   geoMap.map?.zoomIn();
// }

// function onZoomOut() {
//   geoMap.map?.zoomOut();
// }

// function onResetZoom() {
//   geoMap.map?.fitBounds(initialViewState.bounds);
// }

// function onFitWorld() {
//   geoMap.map?.fitWorld();
// }

watch(
	[() => props.layers, visibleLayers],
	([layers, visibleLayers]) => {
		nextTick(() => {
			Object.values(geoMap.layers).forEach((layer) => {
				layer?.remove();
			});

			const map = geoMap.map;
			if (map == null) return;

			Object.values(layers).forEach((layer) => {
				if (visibleLayers.has(layer.id)) {
					// TODO:
					geoMap.layers[layer.id] = geoJSON(layer.data).addTo(map);
				}
			});
		});
	},
	{ immediate: true }
);

watch(
	[() => props.cones, () => visibleFeatureGroups.value.has('cones')],
	([cones, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.featureGroups.cones;

			featureGroup?.clearLayers();

			if (isVisible) {
				cones.forEach((polygon) => {
					featureGroup?.addData(polygon);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[() => props.areas, () => visibleFeatureGroups.value.has('areas')],
	([areas, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.featureGroups.areas;

			featureGroup?.clearLayers();

			if (isVisible) {
				areas.forEach((polygon) => {
					featureGroup?.addData(polygon);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[() => props.linesPoints, () => visibleFeatureGroups.value.has('linesPoints')],
	([linesPoints, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.featureGroups.linesPoints;

			featureGroup?.clearLayers();

			if (isVisible) {
				linesPoints.forEach((polygon) => {
					featureGroup?.addData(polygon);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[overlayAreas, () => visibleFeatureGroups.value.has('areas')],
	([areas, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.highlights.areas;

			featureGroup?.clearLayers();

			if (isVisible) {
				areas.forEach((polygon) => {
					featureGroup?.addData(polygon);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[overlayCones, () => visibleFeatureGroups.value.has('cones')],
	([cones, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.highlights.cones;

			featureGroup?.clearLayers();

			if (isVisible) {
				cones.forEach((polygon) => {
					featureGroup?.addData(polygon);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[() => props.coneOrigins, () => visibleFeatureGroups.value.has('coneOrigins')],
	([coneOrigins, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.featureGroups.coneOrigins;

			featureGroup?.clearLayers();

			if (isVisible) {
				coneOrigins.forEach((point) => {
					featureGroup?.addData(point);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[() => props.areaCenterPoints, () => visibleFeatureGroups.value.has('areaLabels')],
	([areaCenterPoints, isVisible]) => {
		/** Update on next tick to ensure feature group is initialised. */
		nextTick(() => {
			const featureGroup = geoMap.featureGroups.areaLabels;

			featureGroup?.clearLayers();

			if (isVisible) {
				areaCenterPoints.forEach((point) => {
					featureGroup?.addData(point);
				});
			}
		});
	},
	{ immediate: true }
);

watch(
	[
		() => props.areas,
		() => props.areaCenterPoints,
		() => props.cones,
		() => props.coneOrigins,
		() => props.linesPoints,
		() => props.layers,
		overlayAreas,
		overlayCones,
		visibleLayers,
		visibleFeatureGroups,
	],
	() => {
		nextTick(() => {
			/** Ensure correct layer stacking order. */
			// Object.values(geoMap.layers).forEach((layer) => {
			//   layer?.bringToFront();
			// });
			geoMap.featureGroups.cones?.bringToFront();
			geoMap.featureGroups.areas?.bringToFront();
			geoMap.featureGroups.linesPoints?.bringToFront();
			geoMap.highlights.areas?.bringToFront();
			geoMap.highlights.cones?.bringToFront();
			geoMap.featureGroups.coneOrigins?.bringToFront();
			geoMap.featureGroups.areaLabels?.bringToFront();
		});
	},
	{ immediate: true }
);

watch(
	[() => props.areas, () => props.coneOrigins],
	([areas, coneOrigins]) => {
		if ([areas, coneOrigins].every((features) => features.length === 0)) {
			const bounds = initialViewState.bounds;

			nextTick(() => {
				geoMap?.map?.flyToBounds(bounds, { duration: 0.25 });
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

			const bounds = latLngBounds([
				[Math.min(...lat), Math.min(...lng)],
				[Math.max(...lat), Math.max(...lng)],
			]);

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
				geoMap?.map?.flyToBounds(bounds, { duration: 0.25 });
			});
		}
	},
	{ immediate: true }
);
</script>

<template>
	<div class="geo-map">
		<div id="geo-map" class="geo-map-map" />
		<slot :map="geoMap.map" />
	</div>
</template>

<style scoped>
.geo-map {
	display: grid;
	width: 100%;
	height: 100%;
	overflow: hidden;
	position: relative;
}

.geo-map-map {
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>

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
	transform: translate(-50%, -50%);
	font-family: ui-sans-serif, system-ui, sans-serif;
	font-size: 14px;
	font-weight: 500;
	color: white;
	border-radius: 4px;
	opacity: 0.75;
	padding-inline: 8px;
	pointer-events: auto;
	background-color: var(--geo-map-label-bg-color, 'hsl(0deg 0% 0%)');
}

.geo-map-area-label-container {
	background: transparent;
	border: none;
	pointer-events: none;
}

.geo-map-tooltip {
	gap: 4px;
	display: grid;
	font-size: 12px;
	font-family: ui-sans-serif, system-ui, sans-serif;
	max-width: 256px;
	width: max-content;
	white-space: unset;
	overflow-wrap: unset;
}

.geo-map-tooltip strong {
	font-weight: 500;
}

.geo-map-tooltip ul {
	gap: 4px;
	display: grid;
	font-size: 10px;
	list-style: none;
	padding: 0;
}
</style>
