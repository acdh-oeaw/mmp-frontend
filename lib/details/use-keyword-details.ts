import { computed, type ComputedRef } from "vue";

import { type Keyword, usePassages } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import type { SearchFilters } from "@/lib/search/use-search-filters";

export function useKeywordDetails(
	id: ComputedRef<Keyword["id"]>,
	searchFilters: ComputedRef<SearchFilters>,
) {
	const searchParams = usePassagesSearchParams(searchFilters);
	const passagesQuery = usePassages({
		...searchParams.value,
		key_word: [id],
		key_word_and: undefined,
		limit: 1000,
	});

	const passages = computed(() => {
		return passagesQuery.data.value?.results ?? [];
	});

	const isLoading = computed(() => {
		return [passagesQuery].some((query) => {
			return query.isInitialLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [passagesQuery].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [passagesQuery].some((query) => {
			return query.isError.value;
		});
	});
	const isEmpty = computed(() => {
		return [passages].every((data) => {
			return data.value.length === 0;
		});
	});

	return {
		passages,
		passagesQuery,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
