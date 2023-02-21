<script lang="ts" setup>
import { computed } from "vue";

import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

// TODO:
const isEmpty = false;
const isError = false;
const isFetching = false;
const isLoading = false;
</script>

<template>
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<LoadingIndicator>Loading entity details...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load entity details.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating entity details...</LoadingIndicator>
			</template>

			<!--  -->
		</template>
	</div>
</template>
