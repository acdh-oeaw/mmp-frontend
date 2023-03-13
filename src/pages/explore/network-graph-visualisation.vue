<script lang="ts" setup>
import { type ForceGraphInstance } from "force-graph";
import { computed, ref } from "vue";

import { type KeywordType, type ResourceKind } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NetworkGraphLegend from "@/components/network-graph-legend.vue";
import NetworkGraphToolbar from "@/components/network-graph-toolbar.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import {
	type NetworkGraphContext,
	type NetworkGraphData,
	type NetworkGraphNode,
} from "@/lib/network-graph/network-graph.types";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead, useRouter } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { graph, isEmpty, isError, isFetching, isLoading } = useNetworkGraph(searchFilters);

//

const router = useRouter();
const { createSelectionParams, selection } = useSelection();
const selectedKeys = computed<Set<NetworkGraphNode["key"]>>(() => {
	return new Set(selection.value.selection);
});

function onNodeClick(node: NetworkGraphNode | null) {
	if (node == null) return;

	const _selection = new Set(selectedKeys.value);
	if (_selection.has(node.key)) {
		_selection.delete(node.key);
	} else {
		_selection.add(node.key);
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

//

const resourceKindFilters = ref(
	new Map<ResourceKind, boolean>([
		["autor", true],
		["keyword", true],
	]),
);

function onToggleResourceKindFilter(filter: ResourceKind, isVisible: boolean) {
	resourceKindFilters.value.set(filter, isVisible);
}

const keywordTypeFilters = ref(
	new Map<KeywordType, boolean>([
		["Ethnonym", true],
		["Keyword", true],
		["Name", true],
		["Region", true],
	]),
);

function onToggleKeywordTypeFilter(filter: KeywordType, isVisible: boolean) {
	keywordTypeFilters.value.set(filter, isVisible);
}

// TODO: toggle `nodeVisibility` instead?
/** Filter by selected node types. */
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

//

const context = ref<NetworkGraphContext>({
	graph: null,
});

function onReady(instance: ForceGraphInstance) {
	context.value.graph = instance;
}
</script>

<template>
	<div class="relative mx-auto h-full w-full">
		<h2 class="sr-only">Network-graph visualisation</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading network graph...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load network graph.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<Centered>
						<LoadingIndicator>Loading network visualisation...</LoadingIndicator>
					</Centered>
				</template>

				<template v-if="isFetching">
					<Centered>
						<LoadingIndicator>Updating network graph...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<NetworkGraph
						:graph="filteredGraph"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:selected-keys="selectedKeys"
						:width="width"
						@node-click="onNodeClick"
						@node-hover="onNodeHover"
						@ready="onReady"
					>
						<NetworkGraphToolbar :graph="filteredGraph" />
						<div class="absolute right-4 bottom-4 rounded px-8 py-3 shadow-lg">
							<NetworkGraphLegend
								:keyword-type-filters="keywordTypeFilters"
								:resource-kind-filters="resourceKindFilters"
								@toggle-keyword-type-filter="onToggleKeywordTypeFilter"
								@toggle-resource-kind-filter="onToggleResourceKindFilter"
							/>
						</div>
					</NetworkGraph>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
