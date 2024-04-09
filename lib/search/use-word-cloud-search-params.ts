import { computed } from "vue";
import { type ComputedRef } from "vue";

import type { GetKeywordByAuthorGraph } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useWordCloudSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetKeywordByAuthorGraph.SearchParams> {
	const passagesSearchParams = usePassagesSearchParams(searchFilters);

	const searchParams = computed<GetKeywordByAuthorGraph.SearchParams>(() => {
		const searchParams = {
			...passagesSearchParams.value,
			limit: undefined,
			offset: undefined,
		};

		return searchParams;
	});

	return searchParams;
}
