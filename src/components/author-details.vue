<script lang="ts" setup>
import { computed } from "vue";

import { type Author, useAuthorById } from "@/api";
import AuthorDetailsList from "@/components/author-details-list.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getPlaceLabel } from "@/lib/get-label";

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

			<dl v-if="author">
				<div>
					<dt class="sr-only">Century</dt>
					<dd>{{ author.jahrhundert || "Unknown century" }}</dd>
				</div>
				<div>
					<dt class="sr-only">Place</dt>
					<dd>{{ getPlaceLabel(author.ort) }}</dd>
				</div>
				<div>
					<dt class="sr-only">GND</dt>
					<dd>
						<a :href="author?.gnd_id" target="_blank">{{ author.gnd_id }}</a>
					</dd>
				</div>
			</dl>

			<AuthorDetailsList :id="id" />
		</template>
	</div>
</template>
