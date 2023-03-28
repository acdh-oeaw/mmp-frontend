<script lang="ts" setup>
import { type Map as LeafletMap } from "leaflet";
import { computed, ref } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GeoMap from "@/components/geo-map.vue";
import GeoMapToolbar from "@/components/geo-map-toolbar.vue";
import GeojsonDetails from "@/components/geojson-details.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import SideDisclosure from "@/components/side-disclosure.vue";
import ViewMode from "@/components/view-mode.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type GeoMapContext } from "@/lib/geo-map/geo-map.types";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { useGeoMapBaseLayer } from "@/lib/geo-map/use-geo-map-base-layer";
import { useGeoMapEvents } from "@/lib/geo-map/use-geo-map-events";
import { useGeoJsonLayers } from "@/lib/geo-map/use-geojson-layers";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelectionByKind } from "@/lib/search/use-selection-by-kind";
import { ClientOnly } from "#components";
import { useHead, useRouter } from "#imports";

const title = "Geo visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const router = useRouter();
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const selectionByKind = useSelectionByKind();

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

const {
	highlightedKeys,
	selectedKeys,
	onAreaClick,
	onAreaHover,
	onLinesPointsClick,
	onLinesPointsHover,
	onPointClick,
	onPointHover,
} = useGeoMapEvents();

const context = ref<Pick<GeoMapContext, "map">>({
	map: null,
});

function onReady(instance: LeafletMap) {
	context.value.map = instance;
}

const isSideDisclosureVisible = computed(() => {
	return (
		selectionByKind.value.has("geojson-area") ||
		selectionByKind.value.has("geojson-collection") ||
		selectionByKind.value.has("geojson-point")
	);
});

function onToggleSideDisclosure() {
	router.push({ query: createSearchFilterParams(searchFilters.value) });
}

const { baseLayer, baseLayers, onChangeBaseLayer } = useGeoMapBaseLayer();
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

				<ViewMode>
					<VisualisationContainer
						v-slot="{ width, height }"
						class="min-h-[600px] transition-all"
						:class="{ 'opacity-50 grayscale': isFetching }"
					>
						<GeoMap
							:areas="areas"
							:area-center-points="areaCenterPoints"
							:base-layer="baseLayer"
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
							<GeoMapToolbar
								:layers="layers"
								:base-layer="baseLayer"
								:base-layers="baseLayers"
								@change-base-layer="onChangeBaseLayer"
							/>

							<SideDisclosure :open="isSideDisclosureVisible" @toggle="onToggleSideDisclosure">
								<GeojsonDetails
									v-if="
										selectionByKind.has('geojson-area') ||
										selectionByKind.has('geojson-collection') ||
										selectionByKind.has('geojson-point')
									"
									:areas="selectionByKind.get('geojson-area')"
									:collections="selectionByKind.get('geojson-collection')"
									:points="selectionByKind.get('geojson-point')"
								/>
							</SideDisclosure>
						</GeoMap>
					</VisualisationContainer>
				</ViewMode>
			</ClientOnly>
		</template>
	</div>
</template>
