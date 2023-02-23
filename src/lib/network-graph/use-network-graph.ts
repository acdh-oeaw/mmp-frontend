import { type ComputedRef, computed } from "vue";

import { useKeywordByAuthorGraph } from "@/api";
import { createGraph } from "@/lib/network-graph/create-graph";
import { useNetworkGraphSearchParams } from "@/lib/search/use-network-graph-search-params";
import { type SearchFilters } from "@/lib/search/use-search-filters";

export function useNetworkGraph(searchFilters: ComputedRef<SearchFilters>) {
	const searchParams = useNetworkGraphSearchParams(searchFilters);
	const graphQuery = useKeywordByAuthorGraph(searchParams);
	const isError = graphQuery.isError;
	const isFetching = graphQuery.isFetching;
	const isLoading = graphQuery.isInitialLoading;
	const graph = computed(() => {
		return createGraph(graphQuery.data.value ?? { edges: [], nodes: [] });
	});
	const isEmpty = computed(() => {
		return graph.value.nodes.size === 0;
	});

	return {
		graph,
		graphQuery,
		isEmpty,
		isError,
		isFetching,
		isLoading,
	};
}
