import { type ComputedRef, computed } from "vue";

import { usePassageNlpData } from "@/api";
import { type SearchFilters } from "@/lib/search/use-search-filters";
import { useWordCloudSearchParams } from "@/lib/search/use-word-cloud-search-params";
import { createTokenData } from "@/lib/word-cloud/create-token-data";

export function useTokenCloud(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = useWordCloudSearchParams(searchFilters);
	const cloudQuery = usePassageNlpData(searchParams);
	const isFetching = cloudQuery.isFetching;
	const isLoading = cloudQuery.isLoading;
	const isError = cloudQuery.isError;
	const cloud = computed(() => {
		return createTokenData(cloudQuery.data.value?.token_dict ?? {});
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
