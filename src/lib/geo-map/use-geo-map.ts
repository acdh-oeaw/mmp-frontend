import { type ComputedRef } from "vue";
import { computed } from "vue";

import { useConesGeojson, useLinesPointsGeojson, useSpatialCoveragesGeojson } from "@/api";
import { useGeoMapSearchParams } from "@/lib/search/use-geo-map-search-params";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useGeoMap(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = useGeoMapSearchParams(searchFilters);
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
	const isEmpty = computed(() => {
		return areasQuery.data.value?.count === 0;
	});

	return {
		areas,
		cones,
		linesPoints,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
