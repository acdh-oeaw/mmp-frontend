import { computed } from "vue";

import type { GetKeywordByAuthorGraph } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import { useSearchFilters } from "@/lib/search/use-search-filters";

export function useNetworkGraphSearchParams() {
	const { searchFilters } = useSearchFilters();
	const passagesSearchParams = usePassagesSearchParams();

	const searchParams = computed<GetKeywordByAuthorGraph.SearchParams>(() => {
		const searchParams = {
			...passagesSearchParams.value,
			limit: undefined,
			offset: undefined,
			author: searchFilters.value.author,
		};

		return searchParams;
	});

	return searchParams;
}
