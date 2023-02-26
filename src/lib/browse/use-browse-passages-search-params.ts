import { type ComputedRef, computed } from "vue";

import type { GetPassages } from "@/api";
import { type SearchFilters } from "@/lib/browse/use-browse-search-filters";

export function usePassagesBrowseSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetPassages.SearchParams> {
	const searchParams = computed<GetPassages.SearchParams>(() => {
		const searchParams: GetPassages.SearchParams = {
			zitat: searchFilters.value["searchTerm"],
			zitat_lookup: "icontains",
			limit: searchFilters.value["limit"],
			offset: searchFilters.value["offset"],
		};

		return searchParams;
	});

	return searchParams;
}
