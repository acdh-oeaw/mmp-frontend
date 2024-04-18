import { computed, type ComputedRef } from "vue";

import { usePassages } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import type { SearchFilters } from "@/lib/search/use-search-filters";

export function usePassagesSearch(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = usePassagesSearchParams(searchFilters);
	const passagesQuery = usePassages(searchParams);
	const isLoading = passagesQuery.isInitialLoading;
	const isFetching = passagesQuery.isFetching;
	const isError = passagesQuery.isError;
	const passages = computed(() => {
		return passagesQuery.data.value?.results ?? [];
	});
	const isEmpty = computed(() => {
		return passages.value.length === 0;
	});

	return {
		passagesQuery,
		passages,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
