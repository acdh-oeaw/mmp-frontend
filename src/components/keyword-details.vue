<script lang="ts" setup>
import { computed } from "vue";

import { type Keyword, useKeywordById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordDetailsList from "@/components/keyword-details-list.vue";
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
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading keyword...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load keyword.</ErrorMessage>
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
					<LoadingIndicator>Updating keyword...</LoadingIndicator>
				</Centered>
			</template>

			<div
				class="grid h-full grid-rows-[auto_auto_1fr] gap-4 p-4 text-neutral-800 transition-all"
				:class="{ 'opacity-50 grayscale': isFetching }"
			>
				<h2 class="text-lg font-medium">{{ keyword?.stichwort }}</h2>

				<p v-if="keyword?.kommentar">{{ keyword.kommentar }}</p>

				<KeywordDetailsList :id="id" />
			</div>
		</template>
	</div>
</template>
