<script lang="ts" setup>
import { computed } from "vue";

import { type ResourceKey } from "@/api";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { type SearchFilters } from "@/lib/search/use-search-filters";

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
	<div>
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
					/>
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
