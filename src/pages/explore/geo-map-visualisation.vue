<script lang="ts" setup>
import { type Map as LeafletMap } from "leaflet";
import { computed, ref } from "vue";

import { type GeojsonLayer, type ResourceKey, useCaseStudies } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import GeoMap from "@/components/geo-map.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import OverlayPanel from "@/components/overlay-panel.vue";
import OverlayPanelButton from "@/components/overlay-panel-button.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type GeoMapContext } from "@/lib/geo-map/geo-map.types";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Geo visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useSearchFilters();
const { areas, cones, linesPoints, isFetching, isEmpty, isError, isLoading } =
	useGeoMap(searchFilters);

const caseStudiesSearchParams = computed(() => {
	return { ids: searchFilters.value["case-study"].join(",") };
});
const isEnabled = computed(() => {
	return searchFilters.value["case-study"].length > 0;
});
// TODO: useQueries
const caseStudiesQuery = useCaseStudies(caseStudiesSearchParams, { isEnabled });
const layers = computed(() => {
	const layers = new Map<GeojsonLayer["id"], GeojsonLayer>();
	caseStudiesQuery.data.value?.results.forEach((caseStudy) => {
		caseStudy.layer.forEach((layer) => {
			layers.set(layer.id, layer);
		});
	});
	return layers;
});

//

const { selection } = useSelection();
const selectedKeys = computed<Set<ResourceKey>>(() => {
	return new Set(selection.value.selection);
});

function onAreaClick(node: ResourceKey | null) {
	//
}

function onPointClick(node: ResourceKey | null) {
	//
}

//

const highlightedKeys = ref(new Set<ResourceKey>());

function onAreaHover(node: ResourceKey | null) {
	//
}

function onPointHover(node: ResourceKey | null) {
	//
}

//

const context = ref<GeoMapContext>({
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
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Geo visualisation</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading map...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load map.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<LoadingIndicator>Loading geo visualisation...</LoadingIndicator>
				</template>

				<template v-if="isFetching">
					<LoadingIndicator>Updating map...</LoadingIndicator>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<GeoMap
						:areas="areas"
						:cones="cones"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:layers="layers"
						:lines-points="linesPoints"
						:selected-keys="selectedKeys"
						:width="width"
						@ready="onReady"
					>
						<OverlayPanel position="top left">
							<OverlayPanelButton label="Zoom in" @click="onZoomIn" />
							<OverlayPanelButton label="Zoom out" @click="onZoomOut" />
						</OverlayPanel>
					</GeoMap>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
