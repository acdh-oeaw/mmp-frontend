<script lang="ts" setup>
import { type ForceGraphInstance } from "force-graph";
import { ref } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NetworkGraphLegend from "@/components/network-graph-legend.vue";
import NetworkGraphToolbar from "@/components/network-graph-toolbar.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type NetworkGraphContext } from "@/lib/network-graph/network-graph.types";
import { useFilteredGraph } from "@/lib/network-graph/use-filtered-graph";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { useNetworkGraphEvents } from "@/lib/network-graph/use-network-graph-events";
import { useNetworkGraphFilters } from "@/lib/network-graph/use-network-graph-filters";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Network-graph visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useSearchFilters();
const { graph, isEmpty, isError, isFetching, isLoading } = useNetworkGraph(searchFilters);

const { selectedKeys, onNodeClick, highlightedKeys, onNodeHover } = useNetworkGraphEvents();

const {
	resourceKindFilters,
	onToggleResourceKindFilter,
	keywordTypeFilters,
	onToggleKeywordTypeFilter,
} = useNetworkGraphFilters();

// TODO: toggle `nodeVisibility` instead?
const filteredGraph = useFilteredGraph({ graph, resourceKindFilters, keywordTypeFilters });

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
					<Centered class="z-10">
						<LoadingIndicator>Updating network graph...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer
					v-slot="{ width, height }"
					class="min-h-[600px] transition-all"
					:class="{ 'opacity-50 grayscale': isFetching }"
				>
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
						<div class="absolute right-4 bottom-4 rounded bg-white px-8 py-3 shadow-lg">
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
