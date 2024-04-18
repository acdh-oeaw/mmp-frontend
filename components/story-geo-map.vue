<script lang="ts" setup>
import { computed } from "vue";

import type { ResourceKey } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import GeoMap from "@/components/geo-map.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useGeoMap } from "@/lib/geo-map/use-geo-map";
import { useGeoJsonLayers } from "@/lib/geo-map/use-geojson-layers";
import type { SearchFilters } from "@/lib/search/use-search-filters";
import { ClientOnly } from "#components";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

const {
	areas,
	areaCenterPoints,
	cones,
	coneOrigins,
	linesPoints,
	isEmpty,
	isError,
	isFetching,
	isLoading,
} = useGeoMap(searchFilters);
// TODO: move into useGeoMap
const { layers } = useGeoJsonLayers(searchFilters);

const selectedKeys = new Set<ResourceKey>();
const highlightedKeys = new Set<ResourceKey>();
</script>

<template>
	<div class="relative size-full">
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
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
