import { type ComputedRef, computed } from "vue";

import { type GeojsonLayer, useCaseStudies } from "@/api";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useGeoJsonLayers(searchFilters: ComputedRef<SearchFilters>) {
	const isEnabled = computed(() => {
		return searchFilters.value["case-study"].length > 0;
	});

	const caseStudiesSearchParams = computed(() => {
		return { ids: searchFilters.value["case-study"].join(",") };
	});

	// TODO: useQueries
	const caseStudiesQuery = useCaseStudies(caseStudiesSearchParams, { isEnabled });
	const isLoading = caseStudiesQuery.isInitialLoading;
	const isError = caseStudiesQuery.isError;
	const isFetching = caseStudiesQuery.isFetching;
	const layers = computed(() => {
		const layers = new Map<GeojsonLayer["id"], GeojsonLayer>();

		caseStudiesQuery.data.value?.results.forEach((caseStudy) => {
			caseStudy.layer.forEach((layer) => {
				layers.set(layer.id, layer);
			});
		});

		return layers;
	});
	const isEmpty = computed(() => {
		return layers.value.size === 0;
	});

	return {
		layers,
		caseStudiesQuery,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
