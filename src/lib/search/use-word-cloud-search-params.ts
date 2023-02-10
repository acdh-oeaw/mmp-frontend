import { computed } from "vue";

import type { GetKeywordByAuthorGraph } from "@/api";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";

export function useWordCloudSearchParams() {
	const passagesSearchParams = usePassagesSearchParams();

	const searchParams = computed<GetKeywordByAuthorGraph.SearchParams>(() => {
		const searchParams = {
			...passagesSearchParams.value,
			limit: undefined,
			offset: undefined,
		};

		return searchParams;
	});

	return searchParams;
}
