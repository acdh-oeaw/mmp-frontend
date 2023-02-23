<script lang="ts" setup>
import { computed } from "vue";

import { type Keyword, useKeywordById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";

const props = defineProps<{
	ids: Set<Keyword["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const keywordQuery = useKeywordById({ id });
const isLoading = keywordQuery.isInitialLoading;
const isFetching = keywordQuery.isFetching;
const isError = keywordQuery.isError;
const keyword = keywordQuery.data;
const isEmpty = computed(() => {
	return keyword.value == null;
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

			<h2>{{ keyword?.stichwort }}</h2>

			<pre>{{ keyword }}</pre>
		</template>
	</div>
</template>
