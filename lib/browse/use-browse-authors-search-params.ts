import { computed, type ComputedRef } from "vue";

import type { GetAuthors } from "@/api";
import type { SearchFilters } from "@/lib/browse/use-browse-search-filters";

export function useAuthorsBrowseSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetAuthors.SearchParams> {
	const searchParams = computed<GetAuthors.SearchParams>(() => {
		const searchParams: GetAuthors.SearchParams = {
			name: searchFilters.value.searchTerm,
			name_lookup: "icontains",
			limit: searchFilters.value.limit,
			offset: searchFilters.value.offset,
			ordering: "name",
		};

		return searchParams;
	});

	return searchParams;
}
