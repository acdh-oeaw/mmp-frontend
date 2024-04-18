import { computed, ref } from "vue";

import type { ResourceKey } from "@/api";
import type { NetworkGraphNode } from "@/lib/network-graph/network-graph.types";
import { createSelectionKey, type SelectionKey } from "@/lib/search/selection-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { useFullScreen } from "@/lib/use-full-screen";
import { useRouter } from "#imports";

export function useNetworkGraphEvents() {
	const router = useRouter();
	const isFullscreen = useFullScreen();
	const { createSearchFilterParams, searchFilters } = useSearchFilters();
	const { createSelectionParams, selection } = useSelection();
	const selectedKeys = computed<Set<SelectionKey>>(() => {
		const keys = new Set<ResourceKey>();
		const prefix = "graph-".length;

		selection.value.selection.forEach((key) => {
			if (key.startsWith("graph-author") || key.startsWith("graph-keyword")) {
				keys.add(key.slice(prefix).replace("author", "autor") as ResourceKey);
			}
		});

		return keys;
	});

	function onNodeClick(node: NetworkGraphNode | null) {
		if (node == null) return;
		const key = createSelectionKey({
			kind: node.kind === "autor" ? "graph-author" : "graph-keyword",
			id: node.id,
		});

		let _selection = new Set(selection.value.selection);

		if (_selection.has(key)) {
			_selection.delete(key);
		} else if (node.kind === "autor") {
			_selection = new Set([key]);
		} else {
			_selection = new Set(
				[..._selection].filter((id) => {
					return id.includes("keyword");
				}),
			);
			_selection.add(key);
		}
		void router.push({
			query: {
				...createSearchFilterParams(searchFilters.value),
				...createSelectionParams({ selection: Array.from(_selection) }),
				"view-mode": isFullscreen.value ? "fullscreen" : undefined,
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
