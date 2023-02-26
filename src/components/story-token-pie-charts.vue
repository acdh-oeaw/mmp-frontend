<script lang="ts" setup>
import { computed } from "vue";

import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import TokenPieCharts from "@/components/token-pie-charts.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { type SearchFilters } from "@/lib/search/use-search-filters";
import { useWordClouds } from "@/lib/word-cloud/use-word-clouds";
import { ClientOnly } from "#components";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

const { clouds, isEmpty, isError, isFetching, isLoading } = useWordClouds(searchFilters);
</script>

<template>
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<LoadingIndicator>Loading pie charts...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load pie charts.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<LoadingIndicator>Loading pie charts...</LoadingIndicator>
				</template>

				<template v-if="isFetching">
					<LoadingIndicator>Updating pie charts...</LoadingIndicator>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<TokenPieCharts :height="height" :charts="clouds" :width="width" />
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
