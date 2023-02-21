<script lang="ts" setup>
import { type ForceGraphInstance } from "force-graph";
import { computed, ref } from "vue";

import { type KeywordType, type ResourceKind } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import OverlayPanel from "@/components/overlay-panel.vue";
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

function onNodeHover(node: NetworkGraphNode | null) {
	//
}

//

const resourceKindFilters = ref(
	new Map<ResourceKind, boolean>([
		["autor", true],
		["keyword", true],
	]),
);

const keywordtypeFilters = ref(
	new Map<KeywordType, boolean>([
		["Ethnonym", true],
		["Keyword", true],
		["Name", true],
		["Region", true],
	]),
);

// TODO: toggle nodeVisibility instead?
/** Filter by selected node types. */
const filtered = computed<NetworkGraphData>(() => {
	const nodes: NetworkGraphData["nodes"] = new Map();
	const edges: NetworkGraphData["edges"] = new Map();

	graph.value.nodes.forEach((node) => {
		if (resourceKindFilters.value.get(node.kind) === true) {
			if (node.kind === "keyword") {
				if (keywordtypeFilters.value.get(node.type) === true) {
					nodes.set(node.key, node);
				}
			} else {
				nodes.set(node.key, node);
			}
		}
	});

	graph.value.edges.forEach((edge) => {
		if (nodes.has(edge.source) && nodes.has(edge.target)) {
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

//

function onZoomToFit() {
	context.value.graph?.zoomToFit(150);
}

function onUnPinNodes() {
	context.value.graph?.graphData().nodes.forEach((node) => {
		node.fx = undefined;
		node.fy = undefined;
	});
	context.value.graph?.d3ReheatSimulation();
}
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Network-graph visualisation</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading network graph...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load network graph.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<LoadingIndicator>Loading network visualisation...</LoadingIndicator>
				</template>

				<template v-if="isFetching">
					<LoadingIndicator>Updating network graph...</LoadingIndicator>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<NetworkGraph
						:graph="graph"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:selected-keys="selectedKeys"
						:width="width"
						@node-click="onNodeClick"
						@node-hover="onNodeHover"
						@ready="onReady"
					>
						<OverlayPanel>
							<OverlayPanelButton label="Zoom to fit" @click="onZoomToFit" />
							<OverlayPanelButton label="Unpin nodes" @click="onUnPinNodes" />
						</OverlayPanel>
					</NetworkGraph>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
