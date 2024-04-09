import { type ComputedRef, computed } from "vue";

import type { GetCaseStudies } from "@/api";
import { type SearchFilters } from "@/lib/case-studies/use-case-studies-search-filters";

export function useCaseStudiesSearchParams(
	searchFilters: ComputedRef<SearchFilters>,
): ComputedRef<GetCaseStudies.SearchParams> {
	const searchParams = computed<GetCaseStudies.SearchParams>(() => {
		const searchParams: GetCaseStudies.SearchParams = {
			has_stelle__text__autor: searchFilters.value.author,
			has_stelle__key_word: searchFilters.value.keyword,
			limit: searchFilters.value["limit"],
			offset: searchFilters.value["offset"],
			ordering: "title",
		};

		return searchParams;
	});

	return searchParams;
}
