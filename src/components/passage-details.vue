<script lang="ts" setup>
import { computed } from "vue";

import { type Passage, usePassageById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PassageDetailsList from "@/components/passage-details-list.vue";
import { createList } from "@/lib/create-list";
import { getAuthorLabel, getDateRangeLabel, getPassageLabel } from "@/lib/get-label";

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

			<div class="grid gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">{{ getPassageLabel(passage) }}</h2>

				<dl v-if="passage" class="text-sm font-medium text-neutral-500">
					<div>
						<dt class="sr-only">Date</dt>
						<dd>{{ getDateRangeLabel(passage.start_date, passage.end_date) }}</dd>
					</div>
					<div v-if="passage.text">
						<dt class="sr-only">Author</dt>
						<dd>{{ createList(passage.text.autor.map(getAuthorLabel)) }}</dd>
					</div>
				</dl>

				<PassageDetailsList :id="id" />
			</div>
		</template>
	</div>
</template>
