import { computed, type ComputedRef, type Ref } from "vue";

import type { KeywordType, ResourceKind } from "@/api";
import type { NetworkGraphData } from "@/lib/network-graph/network-graph.types";

interface UseFilteredGraphParams {
	graph: ComputedRef<NetworkGraphData>;
	resourceKindFilters: Ref<Map<ResourceKind, boolean>>;
	keywordTypeFilters: Ref<Map<KeywordType, boolean>>;
}

export function useFilteredGraph(params: UseFilteredGraphParams) {
	const { graph, resourceKindFilters, keywordTypeFilters } = params;

	const filteredGraph = computed<NetworkGraphData>(() => {
		const nodes: NetworkGraphData["nodes"] = new Map();
		const edges: NetworkGraphData["edges"] = new Map();

		graph.value.nodes.forEach((node) => {
			if (resourceKindFilters.value.get(node.kind) === true) {
				if (node.kind === "keyword") {
					if (keywordTypeFilters.value.get(node.type) === true) {
						nodes.set(node.key, node);
					}
				} else {
					nodes.set(node.key, node);
				}
			}
		});

		graph.value.edges.forEach((edge) => {
			// FIXME: there must be a better way
			/** `d3-force` replaces string ids with object references on init. */
			// @ts-expect-error Mutated by `d3`.
			const source = typeof edge.source === "string" ? edge.source : edge.source.key;
			// @ts-expect-error Mutated by `d3`.
			const target = typeof edge.target === "string" ? edge.target : edge.target.key;
			if (nodes.has(source) && nodes.has(target)) {
				edges.set(edge.key, edge);
			}
		});

		return { nodes, edges };
	});

	return filteredGraph;
}
