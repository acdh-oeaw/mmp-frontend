<script lang="ts" setup>
import { type Map as LeafletMap } from "leaflet";
import { computed, ref } from "vue";

import { type LinesPointsGeojson, type ResourceKey, type SpatialCoverageGeojson } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GeoMap from "@/components/geo-map.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import OverlayPanel from "@/components/overlay-panel.vue";
import OverlayPanelButton from "@/components/overlay-panel-button.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { initialViewState } from "@/lib/geo-map/geo-map.config";
import { type ConeOriginGeojson, type GeoMapContext } from "@/lib/geo-map/geo-map.types";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { useGeoJsonLayers } from "@/lib/geo-map/use-geojson-layers";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Geo visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const _id = useCaseStudyIdParam();

const { searchFilters } = useSearchFilters();
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

const { selection } = useSelection();
const selectedKeys = computed<Set<ResourceKey>>(() => {
	return new Set(selection.value.selection);
});

function onAreaClick(area: SpatialCoverageGeojson | null) {
	console.log({ area });
}

function onPointClick(point: ConeOriginGeojson | null) {
	console.log({ point });
}

function onLinesPointsClick(collection: LinesPointsGeojson | null) {
	console.log({ collection });
}

//

const highlightedKeys = ref(new Set<ResourceKey>());

function onAreaHover(area: SpatialCoverageGeojson | null) {
	console.log({ area });
}

function onPointHover(point: ConeOriginGeojson | null) {
	console.log({ point });
}

function onLinesPointsHover(collection: LinesPointsGeojson | null) {
	console.log({ collection });
}

//

const context = ref<Pick<GeoMapContext, "map">>({
	map: null,
});

function onReady(instance: LeafletMap) {
	context.value.map = instance;
}

//

function onZoomIn() {
	context.value.map?.zoomIn();
}

function onZoomOut() {
	context.value.map?.zoomOut();
}

function _onResetZoom() {
	context.value.map?.fitBounds(initialViewState.bounds);
}

function _onFitWorld() {
	context.value.map?.fitWorld();
}
</script>

<template>
	<div class="relative mx-auto h-full w-full py-4">
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
					<Centered>
						<LoadingIndicator>Updating map...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
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
						<OverlayPanel position="top left">
							<OverlayPanelButton @click="onZoomIn">Zoom in</OverlayPanelButton>
							<OverlayPanelButton @click="onZoomOut">Zoom out</OverlayPanelButton>
						</OverlayPanel>
						<OverlayPanel position="top right">
							<pre>
								{{ layers }}
							</pre
							>
						</OverlayPanel>
					</GeoMap>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
