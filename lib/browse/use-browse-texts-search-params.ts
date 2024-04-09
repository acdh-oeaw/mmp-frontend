import { type ComputedRef, computed } from "vue";

import type { GetTexts } from "@/api";
import { type SearchFilters } from "@/lib/browse/use-browse-search-filters";

export function useTextsBrowseSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetTexts.SearchParams> {
	const searchParams = computed<GetTexts.SearchParams>(() => {
		const searchParams: GetTexts.SearchParams = {
			title: searchFilters.value["searchTerm"],
			title_lookup: "icontains",
			limit: searchFilters.value["limit"],
			offset: searchFilters.value["offset"],
			ordering: "title",
		};

		return searchParams;
	});

	return searchParams;
}
