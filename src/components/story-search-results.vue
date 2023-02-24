<script lang="ts" setup>
import { computed } from "vue";

import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { usePassagesSearch } from "@/lib/search/use-passages-search";
import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

const { passages, isEmpty, isError, isFetching, isLoading } = usePassagesSearch(searchFilters);
</script>

<template>
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<LoadingIndicator>Loading search results...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load search results.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating search results...</LoadingIndicator>
			</template>

			<pre>{{ passages }}</pre>
		</template>
	</div>
</template>
