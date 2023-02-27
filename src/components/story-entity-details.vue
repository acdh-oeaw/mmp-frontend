<script lang="ts" setup>
import { computed } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const _searchFilters = computed(() => {
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
			<Centered>
				<LoadingIndicator>Loading entity details...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load entity details.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating entity details...</LoadingIndicator>
				</Centered>
			</template>

			<!--  -->
		</template>
	</div>
</template>
