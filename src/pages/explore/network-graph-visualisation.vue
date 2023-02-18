<script lang="ts" setup>
import { type ForceGraphInstance } from "force-graph";
import { computed, ref } from "vue";

import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type NetworkGraphNode } from "@/lib/network-graph/network-graph.types";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useSearchFilters();
const { graph, isEmpty, isError, isFetching, isLoading } = useNetworkGraph(searchFilters);

//

const { selection } = useSelection();
const selectedKeys = computed<Set<NetworkGraphNode["key"]>>(() => {
	return new Set(selection.value.selection);
});

function onNodeClick(node: NetworkGraphNode | null) {
	//
}

//

const highlightedKeys = ref(new Set<NetworkGraphNode["key"]>());

function onNodeHover(node: NetworkGraphNode | null) {
	//
}

//

const context = ref({
	graph: null as ForceGraphInstance | null,
});

function onReady(instance: ForceGraphInstance) {
	context.value.graph = instance;
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
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
