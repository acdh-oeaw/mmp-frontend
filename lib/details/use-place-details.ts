import { computed, type ComputedRef } from "vue";

import { type Place, useAuthors, useTexts } from "@/api";
import { hasUseCase } from "@/lib/search/has-usecase";
import type { SearchFilters } from "@/lib/search/use-search-filters";

export function usePlaceDetails(
	id: ComputedRef<Place["id"]>,
	searchFilters: ComputedRef<SearchFilters>,
) {
	const hasCaseStudyFilter = computed(() => {
		return hasUseCase(searchFilters.value.dataset);
	});

	const authorsQuery = useAuthors({
		ort: [id],
		has_usecase: hasCaseStudyFilter,
		limit: 1000,
	});
	const textsQuery = useTexts({
		ort: [id],
		has_usecase: hasCaseStudyFilter,
		limit: 1000,
	});

	const authors = computed(() => {
		return authorsQuery.data.value?.results ?? [];
	});
	const texts = computed(() => {
		return textsQuery.data.value?.results ?? [];
	});

	const isLoading = computed(() => {
		return [authorsQuery, textsQuery].some((query) => {
			return query.isInitialLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [authorsQuery, textsQuery].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [authorsQuery, textsQuery].some((query) => {
			return query.isError.value;
		});
	});
	const isEmpty = computed(() => {
		return [authors, texts].every((data) => {
			return data.value.length === 0;
		});
	});

	return {
		authors,
		authorsQuery,
		texts,
		textsQuery,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
