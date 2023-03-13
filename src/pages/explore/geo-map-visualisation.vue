<script lang="ts" setup>
import { type Map as LeafletMap } from "leaflet";
import { computed, ref } from "vue";

import { type LinesPointsGeojson, type SpatialCoverageGeojson } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GeoMap from "@/components/geo-map.vue";
import GeoMapToolbar from "@/components/geo-map-toolbar.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import {
	type ConeOriginGeojson,
	type GeoMapContext,
	type SpatialCoverageCenterPoint,
} from "@/lib/geo-map/geo-map.types";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { useGeoJsonLayers } from "@/lib/geo-map/use-geojson-layers";
import { type SelectionKey, createSelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead, useRouter } from "#imports";

const title = "Geo visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { createSelectionParams, selection } = useSelection();
const selectedKeys = computed<Set<SelectionKey>>(() => {
	return new Set(selection.value.selection);
});

const {
	areas,
	areaCenterPoints,
	cones,
	coneOrigins,
	linesPoints,
	isFetching,
	isEmpty,
	isError,
	isLoading,
} = useGeoMap(searchFilters);
// TODO: move into useGeoMap
const { layers } = useGeoJsonLayers(searchFilters);

//

function onAreaClick(area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null) {
	if (area == null) return;

	const key = createSelectionKey({ kind: "geojson-area", id: area.id });
	const _selection = new Set(selectedKeys.value);
	if (_selection.has(key)) {
		_selection.delete(key);
	} else {
		_selection.add(key);
	}

	router.push({
		query: {
			...createSearchFilterParams(searchFilters.value),
			...createSelectionParams({ selection: Array.from(_selection) }),
		},
	});
}

function onPointClick(point: ConeOriginGeojson | null) {
	if (point == null) return;

	const key = createSelectionKey({ kind: "geojson-point", id: point.id });
	const _selection = new Set(selectedKeys.value);
	if (_selection.has(key)) {
		_selection.delete(key);
	} else {
		_selection.add(key);
	}

	router.push({
		query: {
			...createSearchFilterParams(searchFilters.value),
			...createSelectionParams({ selection: Array.from(_selection) }),
		},
	});
}

function onLinesPointsClick(collection: LinesPointsGeojson | null) {
	if (collection == null) return;

	const key = createSelectionKey({ kind: "geojson-collection", id: collection.id });
	const _selection = new Set(selectedKeys.value);
	if (_selection.has(key)) {
		_selection.delete(key);
	} else {
		_selection.add(key);
	}

	router.push({
		query: {
			...createSearchFilterParams(searchFilters.value),
			...createSelectionParams({ selection: Array.from(_selection) }),
		},
	});
}

//

const highlightedKeys = ref(new Set<SelectionKey>());

function onAreaHover(area: SpatialCoverageCenterPoint | SpatialCoverageGeojson | null) {
	if (area == null) return;
}

function onPointHover(point: ConeOriginGeojson | null) {
	if (point == null) return;
}

function onLinesPointsHover(collection: LinesPointsGeojson | null) {
	if (collection == null) return;
}

//

const context = ref<Pick<GeoMapContext, "map">>({
	map: null,
});

function onReady(instance: LeafletMap) {
	context.value.map = instance;
}
</script>

<template>
	<div class="relative mx-auto h-full w-full">
		<h2 class="sr-only">Geo visualisation</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading map...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load map.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<Centered>
						<LoadingIndicator>Loading geo visualisation...</LoadingIndicator>
					</Centered>
				</template>

				<template v-if="isFetching">
					<Centered class="z-10">
						<LoadingIndicator>Updating map...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer
					v-slot="{ width, height }"
					class="min-h-[600px] rounded transition-all"
					:class="{ 'opacity-50 grayscale': isFetching }"
				>
					<GeoMap
						:areas="areas"
						:area-center-points="areaCenterPoints"
						:cones="cones"
						:cone-origins="coneOrigins"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:layers="layers"
						:lines-points="linesPoints"
						:selected-keys="selectedKeys"
						:width="width"
						@ready="onReady"
						@area-click="onAreaClick"
						@area-hover="onAreaHover"
						@point-click="onPointClick"
						@point-hover="onPointHover"
						@lines-points-click="onLinesPointsClick"
						@lines-points-hover="onLinesPointsHover"
					>
						<GeoMapToolbar :layers="layers" />
					</GeoMap>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
