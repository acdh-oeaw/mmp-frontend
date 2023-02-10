<script lang="ts" setup>
import { computed } from "vue";

import {
	type GeojsonLayer,
	useCaseStudies,
	useConesGeojson,
	useLinesPointsGeojson,
	useSpatialCoveragesGeojson,
} from "@/api";
import { useGeoMapSearchParams } from "@/lib/search/use-geo-map-search-params";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useHead } from "#imports";

const title = "Geo visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const searchParams = useGeoMapSearchParams();
const areasQuery = useSpatialCoveragesGeojson(searchParams);
const conesQuery = useConesGeojson(searchParams);
const linesPointsQuery = useLinesPointsGeojson(searchParams);
const isLoading = computed(() => {
	return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
		return query.isInitialLoading.value;
	});
});
const isFetching = computed(() => {
	return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
		return query.isFetching.value;
	});
});
const isError = computed(() => {
	return [areasQuery, conesQuery, linesPointsQuery].some((query) => {
		return query.isError.value;
	});
});
const areas = computed(() => {
	return areasQuery.data.value?.features ?? [];
});
const cones = computed(() => {
	return conesQuery.data.value?.features ?? [];
});
const linesPoints = computed(() => {
	return linesPointsQuery.data.value?.features ?? [];
});

const { searchFilters } = useSearchFilters();
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

const { selection } = useSelection();
const selectedKeys = computed(() => {
	return new Set(selection.value.selection);
});
</script>

<template>
	<div class="h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Geo visualisation</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading map...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load map.</ErrorMessage>
		</template>

		<template v-else-if="areasQuery.data.value?.count === 0">
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
