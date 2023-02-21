import { type ComputedRef, computed } from "vue";

import { usePassageKeywords } from "@/api";
import { type SearchFilters } from "@/lib/search/use-search-filters";
import { useWordCloudSearchParams } from "@/lib/search/use-word-cloud-search-params";
import { createTokenData } from "@/lib/word-cloud/create-token-data";

export function useKeywordCloud(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = useWordCloudSearchParams(searchFilters);
	const cloudQuery = usePassageKeywords(searchParams);
	const isFetching = cloudQuery.isFetching;
	const isLoading = cloudQuery.isLoading;
	const isError = cloudQuery.isError;
	const cloud = computed(() => {
		return createTokenData(
			// @see https://github.com/acdh-oeaw/mmp/issues/175
			Object.fromEntries(
				cloudQuery.data.value?.token_dict.map((token) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return Object.entries(token)[0]!;
				}) ?? [],
			),
		);
	});
	const isEmpty = computed(() => {
		return cloud.value.length === 0;
	});

	return {
		cloud,
		cloudQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
