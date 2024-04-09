import { type ComputedRef, computed } from "vue";

import { type Author, useCaseStudies, useKeywords, useTexts } from "@/api";
import { hasUseCase } from "@/lib/search/has-usecase";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useAuthorDetails(
	id: ComputedRef<Author["id"]>,
	searchFilters: ComputedRef<SearchFilters>,
) {
	const hasCaseStudyFilter = computed(() => {
		return hasUseCase(searchFilters.value.dataset);
	});

	const caseStudiesQuery = useCaseStudies({
		has_stelle__text__autor: [id],
	});
	const keywordsQuery = useKeywords({
		rvn_stelle_key_word_keyword__text__autor: [id],
		has_usecase: hasCaseStudyFilter,
		limit: 1000,
	});
	const textsQuery = useTexts({
		autor: [id],
		has_usecase: hasCaseStudyFilter,
		limit: 1000,
	});

	const caseStudies = computed(() => {
		return caseStudiesQuery.data.value?.results ?? [];
	});
	const keywords = computed(() => {
		return keywordsQuery.data.value?.results ?? [];
	});
	const texts = computed(() => {
		return textsQuery.data.value?.results ?? [];
	});

	const isLoading = computed(() => {
		return [caseStudiesQuery, keywordsQuery, textsQuery].some((query) => {
			return query.isInitialLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [caseStudiesQuery, keywordsQuery, textsQuery].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [caseStudiesQuery, keywordsQuery, textsQuery].some((query) => {
			return query.isError.value;
		});
	});
	const isEmpty = computed(() => {
		return [caseStudies, keywords, texts].every((data) => {
			return data.value.length === 0;
		});
	});

	return {
		caseStudies,
		caseStudiesQuery,
		keywords,
		keywordsQuery,
		texts,
		textsQuery,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
