import { computed, ref } from "vue";

import { type NetworkGraphNode } from "@/lib/network-graph/network-graph.types";
import { type SelectionKey, createSelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useRouter } from "#imports";

export function useNetworkGraphEvents() {
	const router = useRouter();
	const { createSearchFilterParams, searchFilters } = useSearchFilters();
	const { createSelectionParams, selection } = useSelection();
	const selectedKeys = computed<Set<SelectionKey>>(() => {
		return new Set(selection.value.selection);
	});

	function onNodeClick(node: NetworkGraphNode | null) {
		if (node == null) return;

		const key = createSelectionKey({
			kind: node.kind === "autor" ? "graph-author" : "graph-keyword",
			id: node.id,
		});
		const _selection = new Set(selectedKeys.value);
		if (_selection.has(key)) {
			_selection.delete(key);
		} else {
			_selection.add(key);
		}

		router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createSelectionParams({ selection: Array.from(_selection) }),
			},
		});
	}

	//

	const highlightedKeys = ref(new Set<NetworkGraphNode["key"]>());

	function onNodeHover(_node: NetworkGraphNode | null) {
		//
	}

	return {
		highlightedKeys,
		selectedKeys,
		onNodeClick,
		onNodeHover,
	};
}
