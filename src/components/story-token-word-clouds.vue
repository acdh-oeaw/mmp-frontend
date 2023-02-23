<script lang="ts" setup>
import { computed } from "vue";

import TokenWordClouds from "@/components/token-word-clouds.vue";
import { type SearchFilters } from "@/lib/search/use-search-filters";
import { useWordClouds } from "@/lib/word-cloud/use-word-clouds";

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
			<LoadingIndicator>Loading word clouds...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load word clouds.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<ClientOnly>
				<template #fallback>
					<LoadingIndicator>Loading word clouds...</LoadingIndicator>
				</template>

				<template v-if="isFetching">
					<LoadingIndicator>Updating word clouds...</LoadingIndicator>
				</template>

				<VisualisationContainer v-slot="{ width, height }">
					<TokenWordClouds :height="height" :clouds="clouds" :width="width" />
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
