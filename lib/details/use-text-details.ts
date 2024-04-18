import { computed, type ComputedRef } from "vue";

import { type Text, useCaseStudies, usePassages } from "@/api";
import { hasUseCase } from "@/lib/search/has-usecase";
import type { SearchFilters } from "@/lib/search/use-search-filters";

export function useTextDetails(
	id: ComputedRef<Text["id"]>,
	searchFilters: ComputedRef<SearchFilters>,
) {
	const hasCaseStudyFilter = computed(() => {
		return hasUseCase(searchFilters.value.dataset);
	});

	const passagesQuery = usePassages({
		text: [id],
		has_usecase: hasCaseStudyFilter,
		limit: 1000,
	});
	const caseStudiesQuery = useCaseStudies({
		has_stelle__text: [id],
		limit: 1000,
	});

	const passages = computed(() => {
		return passagesQuery.data.value?.results ?? [];
	});
	const caseStudies = computed(() => {
		return caseStudiesQuery.data.value?.results ?? [];
	});

	const isLoading = computed(() => {
		return [passagesQuery, caseStudiesQuery].some((query) => {
			return query.isInitialLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [passagesQuery, caseStudiesQuery].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [passagesQuery, caseStudiesQuery].some((query) => {
			return query.isError.value;
		});
	});
	const isEmpty = computed(() => {
		return [passages, caseStudies].every((data) => {
			return data.value.length === 0;
		});
	});

	return {
		passages,
		passagesQuery,
		caseStudies,
		caseStudiesQuery,
		isLoading,
		isFetching,
		isError,
		isEmpty,
	};
}
