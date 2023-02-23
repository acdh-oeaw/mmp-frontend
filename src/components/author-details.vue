<script lang="ts" setup>
import { computed } from "vue";

import { type Author, useAuthorById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel } from "@/lib/get-label";

const props = defineProps<{
	ids: Set<Author["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const authorQuery = useAuthorById({ id });
const isLoading = authorQuery.isInitialLoading;
const isFetching = authorQuery.isFetching;
const isError = authorQuery.isError;
const author = authorQuery.data;
const isEmpty = computed(() => {
	return author.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<template v-if="isLoading">
			<LoadingIndicator>Loading author...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load author.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating author...</LoadingIndicator>
			</template>

			<h2>{{ getAuthorLabel(author) }}</h2>

			<pre>{{ author }}</pre>
		</template>
	</div>
</template>
