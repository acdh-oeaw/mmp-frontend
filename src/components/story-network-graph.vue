<script lang="ts" setup>
import { computed } from "vue";

import { type ResourceKey } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NetworkGraph from "@/components/network-graph.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { type SearchFilters } from "@/lib/search/use-search-filters";
import { ClientOnly } from "#components";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

const { graph, isEmpty, isError, isFetching, isLoading } = useNetworkGraph(searchFilters);

const selectedKeys = new Set<ResourceKey>();
const highlightedKeys = new Set<ResourceKey>();
</script>

<template>
	<div class="relative h-full w-full">
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

				<VisualisationContainer v-slot="{ width, height }" class="rounded">
					<NetworkGraph
						:graph="graph"
						:height="height"
						:highlighted-keys="highlightedKeys"
						:selected-keys="selectedKeys"
						:width="width"
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
