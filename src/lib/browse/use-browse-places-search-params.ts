import { type ComputedRef, computed } from "vue";

import type { GetPlaces } from "@/api";
import { type SearchFilters } from "@/lib/browse/use-browse-search-filters";

export function usePlacesBrowseSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetPlaces.SearchParams> {
	const searchParams = computed<GetPlaces.SearchParams>(() => {
		const searchParams: GetPlaces.SearchParams = {
			name: searchFilters.value["searchTerm"],
			name_lookup: "icontains",
			limit: searchFilters.value["limit"],
			offset: searchFilters.value["offset"],
		};

		return searchParams;
	});

	return searchParams;
}
