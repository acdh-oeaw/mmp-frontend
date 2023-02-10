<script lang="ts" setup>
import { computed } from "vue";

import { useKeywordByAuthorGraph } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { createGraph } from "@/lib/network-graph/create-graph";
import { useNetworkGraphSearchParams } from "@/lib/search/use-network-graph-search-params";
import { useSelection } from "@/lib/search/use-selection";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const searchParams = useNetworkGraphSearchParams();
const graphQuery = useKeywordByAuthorGraph(searchParams);
const isLoading = graphQuery.isInitialLoading;
const isError = graphQuery.isError;
const graph = computed(() => {
	return createGraph(graphQuery.data.value ?? { edges: [], nodes: [] });
});

const { selection } = useSelection();
const selectedNodes = computed(() => {
	return new Set(selection.value.selection);
});
</script>

<template>
	<div class="h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Network-graph visualisation</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading network graph...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load network graph.</ErrorMessage>
		</template>

		<template v-else-if="graph.nodes.size === 0">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<LoadingIndicator>Loading network visualisation...</LoadingIndicator>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<NetworkGraph
						:data="graph"
						:height="height"
						:selected-nodes="selectedNodes"
						:width="width"
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
