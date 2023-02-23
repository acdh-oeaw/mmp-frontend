<script lang="ts" setup>
import { computed } from "vue";

import { type Passage, usePassageById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";

const props = defineProps<{
	ids: Set<Passage["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const passageQuery = usePassageById({ id });
const isLoading = passageQuery.isInitialLoading;
const isFetching = passageQuery.isFetching;
const isError = passageQuery.isError;
const passage = passageQuery.data;
const isEmpty = computed(() => {
	return passage.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<template v-if="isLoading">
			<LoadingIndicator>Loading passage...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load passage.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating passage...</LoadingIndicator>
			</template>

			<h2>{{ passage?.display_label }}</h2>

			<pre>{{ passage }}</pre>
		</template>
	</div>
</template>
