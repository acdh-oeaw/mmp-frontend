<script lang="ts" setup>
import { computed } from "vue";

import { usePassageKeywords, usePassageNlpData } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import VisualisationContainer from "@/components/visualisation-container.vue";
import { useWordCloudSearchParams } from "@/lib/search/use-word-cloud-search-params";
import { createTokenData } from "@/lib/word-cloud/create-token-data";
import { useHead } from "#imports";

const title = "Word-cloud visualisation";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const searchParams = useWordCloudSearchParams();
const nlpDataQuery = usePassageNlpData(searchParams);
const keywordsQuery = usePassageKeywords(searchParams);
const isLoading = computed(() => {
	return [nlpDataQuery, keywordsQuery].some((query) => {
		return query.isInitialLoading.value;
	});
});
const isFetching = computed(() => {
	return [nlpDataQuery, keywordsQuery].some((query) => {
		return query.isFetching.value;
	});
});
const isError = computed(() => {
	return [nlpDataQuery, keywordsQuery].some((query) => {
		return query.isError.value;
	});
});
const tokens = computed(() => {
	return {
		words: createTokenData(nlpDataQuery.data.value?.token_dict ?? {}),
		keywords: createTokenData(
			// @see https://github.com/acdh-oeaw/mmp/issues/175
			Object.fromEntries(
				keywordsQuery.data.value?.token_dict.map((token) => {
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return Object.entries(token)[0]!;
				}) ?? [],
			),
		),
	};
});
</script>

<template>
	<div class="h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Word-cloud visualisation</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading word cloud...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load word cloud.</ErrorMessage>
		</template>

		<template v-else-if="tokens.words.length === 0">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating network graph...</LoadingIndicator>
			</template>

			<VisualisationContainer v-slot="{ width, height }">
				<!--  -->
			</VisualisationContainer>
		</template>
	</div>
</template>
