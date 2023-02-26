<script lang="ts" setup>
import { useQueries } from "@tanstack/vue-query";
import { computed } from "vue";

import { type Keyword, createKey } from "@/api";
import * as api from "@/api/client";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { createList } from "@/lib/create-list";

const props = defineProps<{
	ids: Set<Keyword["id"]>;
}>();

const queries = computed(() => {
	return Array.from(props.ids).map((id) => {
		const params = { id };

		return {
			queryKey: createKey("keyword", "by-id", params),
			queryFn() {
				return api.getKeywordById(params);
			},
		};
	});
});
const keywordsQueries = useQueries({ queries });
const isLoading = computed(() => {
	return keywordsQueries.some((query) => {
		return query.isInitialLoading;
	});
});
const isFetching = computed(() => {
	return keywordsQueries.some((query) => {
		return query.isFetching;
	});
});
const isError = computed(() => {
	return keywordsQueries.some((query) => {
		return query.isError;
	});
});
const keywords = computed(() => {
	return keywordsQueries
		.map((query) => {
			return query.data;
		})
		.filter(Boolean);
});
const isEmpty = computed(() => {
	return keywords.value.length === 0;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<template v-if="isLoading">
			<LoadingIndicator>Loading keyword...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load keyword.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating keyword...</LoadingIndicator>
			</template>

			<h2>{{ createList(keywords.map((keyword) => keyword?.stichwort)) }}</h2>

			<pre>{{ keywords }}</pre>
		</template>
	</div>
</template>
