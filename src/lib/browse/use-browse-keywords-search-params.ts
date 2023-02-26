import { type ComputedRef, computed } from "vue";

import type { GetKeywords } from "@/api";
import { type SearchFilters } from "@/lib/browse/use-browse-search-filters";

export function useKeywordsBrowseSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetKeywords.SearchParams> {
	const searchParams = computed<GetKeywords.SearchParams>(() => {
		const searchParams: GetKeywords.SearchParams = {
			stichwort: searchFilters.value["searchTerm"],
			stichwort_lookup: "icontains",
			limit: searchFilters.value["limit"],
			offset: searchFilters.value["offset"],
		};

		return searchParams;
	});

	return searchParams;
}
