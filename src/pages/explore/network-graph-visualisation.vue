<script lang="ts" setup>
import { computed } from "vue";

import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
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

const { selection } = useSelection();
const selectedKeys = computed(() => {
	return new Set(selection.value.selection);
});
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
						:selected-keys="selectedKeys"
						:width="width"
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
