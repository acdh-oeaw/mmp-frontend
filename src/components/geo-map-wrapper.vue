<script lang="ts" setup>
import type { Map as LeafletMap } from 'leaflet';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router/composables';

import {
	type ConeGeojson,
	type PlaceGeojsonProperty,
	useCaseStudies,
	useConesGeojson,
	useLinesPointsGeojson,
	useSpatialCoveragesGeojson,
} from '@/api';
import FullscreenButton from '@/components/fullscreen-button.vue';
import GeoMap from '@/components/geo-map.vue';
import LayerSources from '@/components/geo-map-layer-sources.vue';
import type { ConeOriginGeojson, SpatialCoverageCenterPoint } from '@/lib/geo-map/geo-map.types';
import { useDetailsSearchFilters } from '@/lib/search/use-details-search-filters';
import { useGeoMapSearchParams } from '@/lib/search/use-geo-map-search-params';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const searchParams = useGeoMapSearchParams();

const areasGeojsonQuery = useSpatialCoveragesGeojson(searchParams);
const linesPointsGeojsonQuery = useLinesPointsGeojson(searchParams);
const conesGeojsonQuery = useConesGeojson(searchParams);

const isLoading = computed(() => {
	return [areasGeojsonQuery, linesPointsGeojsonQuery, conesGeojsonQuery].some(
		(query) => query.isInitialLoading.value
	);
});
const isEmpty = computed(() => {
	return [areasGeojsonQuery, linesPointsGeojsonQuery, conesGeojsonQuery].every(
		(query) => query.isSuccess.value && query.data.value?.count === 0
	);
});

const areas = computed(() => areasGeojsonQuery.data.value?.features ?? []);
const linesPoints = computed(() => linesPointsGeojsonQuery.data.value?.features ?? []);

function getConeOrigins(feature: ConeGeojson) {
	return feature.properties.texts.flatMap((text) =>
		text.places.filter((place) => place.lat != null && place.lng != null)
	);
}

const cones = computed(
	() =>
		/** Filter out cones without origin place. */
		conesGeojsonQuery.data.value?.features.filter(
			(feature) => getConeOrigins(feature).length > 0
		) ?? []
);

const coneOrigins = computed(() => {
	const points = new Map<PlaceGeojsonProperty['id'], ConeOriginGeojson>();

	conesGeojsonQuery.data.value?.features.forEach((feature) => {
		/**
		 * Spatial coverage areas may be related to multiple passages.
		 * And passages themselves are allowed to have relations to multiple places, i.e. origin points.
		 */
		for (const place of getConeOrigins(feature)) {
			if (points.has(place.id)) {
				points.get(place.id)?.properties.spatialCoverages.set(feature.id, feature.properties);
			} else {
				const point: ConeOriginGeojson = {
					id: place.id,
					type: 'Feature',
					geometry: {
						type: 'Point',
						// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
						coordinates: [place.lng!, place.lat!],
					},
					properties: {
						name: place.name,
						art: place.art,
						spatialCoverages: new Map([[feature.id, feature.properties]]),
					},
				};

				points.set(place.id, point);
			}
		}
	});

	return Array.from(points.values());
});

const areaCenterPoints = computed(() => {
	const points: Array<SpatialCoverageCenterPoint> = [];

	areasGeojsonQuery.data.value?.features.forEach((feature) => {
		const [x1, y1, x2, y2] = feature.bbox as [number, number, number, number];
		const lng = (x1 + x2) / 2;
		const lat = (y1 + y2) / 2;

		const point: SpatialCoverageCenterPoint = {
			id: feature.id,
			type: 'Feature',
			geometry: {
				type: 'Point',
				coordinates: [lng, lat],
			},
			/** Use `key_word.stichwort` as label. */
			properties: feature.properties,
		};

		points.push(point);
	});

	return points;
});

//

const ids = computed(() => searchFilters.value['case-study']);
const caseStudiesQuery = useCaseStudies(
	{ ids: ids.value.join(',') },
	{ isEnabled: computed(() => ids.value.length > 0) }
);

const layers = computed(() => {
	// TODO: unique
	return caseStudiesQuery.data.value?.results.flatMap((result) => result.layer) ?? [];
});

//

const { createSearchFilterParams: createDetailSearchFilterParams } = useDetailsSearchFilters();
const router = useRouter();

function onClickGeojsonFeature(id: number, kind: 'area' | 'place') {
	const detailKind = kind === 'area' ? 'spatial-coverage' : 'place';

	router.push({
		query: {
			...createSearchFilterParams(searchFilters.value),
			...createDetailSearchFilterParams({ 'detail-kind': detailKind, 'detail-id': [id] }),
		},
		params: { id: String(id) },
	});
}

//

const map = ref<LeafletMap | null>(null);

function onMapReady(leaflet: LeafletMap) {
	map.value = leaflet;
}
</script>

<template>
	<VCard color="transparent" class="geo-map-container" :style="{ '--geo-map-height': '640px' }">
		<GeoMap
			:areas="areas"
			:area-center-points="areaCenterPoints"
			:cones="cones"
			:cone-origins="coneOrigins"
			:layers="layers"
			:lines-points="linesPoints"
			@click-geojson-feature="onClickGeojsonFeature"
			@map-ready="onMapReady"
		>
			<div class="geo-map-control">
				<FullscreenButton />
			</div>
		</GeoMap>

		<LayerSources :layers="layers" />

		<VOverlay absolute opacity=".2" :value="isLoading">
			<VProgressCircular color="primary" indeterminate />
		</VOverlay>

		<VOverlay absolute opacity=".2" :value="isEmpty">
			<span class="geo-map-overlay-text">Nothing found.</span>
		</VOverlay>
	</VCard>
</template>

<style scoped>
.geo-map-container {
	display: grid;
	grid-template-rows: var(--geo-map-height, 640px) auto;
	width: 100%;
	position: relative;
}

.geo-map-control {
	position: absolute;
	right: 8px;
	bottom: 24px;
}

.geo-map-overlay-text {
	color: hsl(0deg 0% 0%);
}
</style>
