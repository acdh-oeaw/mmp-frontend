<script lang="ts" setup>
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import WordClouds from "@/components/word-clouds.vue";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useWordClouds } from "@/lib/word-cloud/use-word-clouds";
import { ClientOnly } from "#components";
import { useHead } from "#imports";

const title = "Word-cloud visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useSearchFilters();
const { clouds, isEmpty, isError, isFetching, isLoading } = useWordClouds(searchFilters);
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Word-clouds visualisation</h2>

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
					<WordClouds :height="height" :clouds="clouds" :width="width" />
				</VisualisationContainer>
			</ClientOnly>
		</template>
	</div>
</template>
