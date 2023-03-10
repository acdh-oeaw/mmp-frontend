<script lang="ts" setup>
import { computed } from "vue";

import Centered from "@/components/centered.vue";
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
			<Centered>
				<LoadingIndicator>Loading pie charts...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load pie charts.</ErrorMessage>
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
						<LoadingIndicator>Loading pie charts...</LoadingIndicator>
					</Centered>
				</template>

				<template v-if="isFetching">
					<Centered>
						<LoadingIndicator>Updating pie charts...</LoadingIndicator>
					</Centered>
				</template>

				<VisualisationContainer v-slot="{ width, height }" class="rounded">
					<TokenPieCharts :height="height" :charts="clouds" :width="width" />
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
