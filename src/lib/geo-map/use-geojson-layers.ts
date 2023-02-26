import { useQueries } from "@tanstack/vue-query";
import { type ComputedRef, computed } from "vue";

import { type GeojsonLayer, createKey } from "@/api";
import * as api from "@/api/client";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useGeoJsonLayers(searchFilters: ComputedRef<SearchFilters>) {
	const queries = computed(() => {
		return searchFilters.value["case-study"].map((id) => {
			const params = { id };

			return {
				queryKey: createKey("case-study", "by-id", params),
				queryFn() {
					return api.getCaseStudyById(params);
				},
			};
		});
	});
	const caseStudiesQueries = useQueries({ queries });
	const isLoading = computed(() => {
		return caseStudiesQueries.some((query) => {
			return query.isInitialLoading;
		});
	});
	const isFetching = computed(() => {
		return caseStudiesQueries.some((query) => {
			return query.isFetching;
		});
	});
	const isError = computed(() => {
		return caseStudiesQueries.some((query) => {
			return query.isError;
		});
	});
	const layers = computed(() => {
		const layers = new Map<GeojsonLayer["id"], GeojsonLayer>();

		caseStudiesQueries.forEach((query) => {
			query.data?.layer.forEach((layer) => {
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
		caseStudiesQueries,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
