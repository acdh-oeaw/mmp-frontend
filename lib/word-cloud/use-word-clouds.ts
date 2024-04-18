import { computed, type ComputedRef } from "vue";

import type { SearchFilters } from "@/lib/search/use-search-filters";
import { useKeywordCloud } from "@/lib/word-cloud/use-keyword-cloud";
import { useTokenCloud } from "@/lib/word-cloud/use-token-cloud";

export function useWordClouds(searchFilters: ComputedRef<SearchFilters>) {
	const tokens = useTokenCloud(searchFilters);
	const keywords = useKeywordCloud(searchFilters);
	const isLoading = computed(() => {
		return [tokens, keywords].some((query) => {
			return query.isLoading.value;
		});
	});
	const isFetching = computed(() => {
		return [tokens, keywords].some((query) => {
			return query.isFetching.value;
		});
	});
	const isError = computed(() => {
		return [tokens, keywords].some((query) => {
			return query.isError.value;
		});
	});
	const clouds = computed(() => {
		return { tokens: tokens.cloud.value, keywords: keywords.cloud.value };
	});
	const isEmpty = computed(() => {
		return [tokens, keywords].some((query) => {
			return query.isEmpty.value;
		});
	});

	return {
		clouds,
		tokenCloudQuery: tokens.cloudQuery,
		keywordCloudQuery: keywords.cloudQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
