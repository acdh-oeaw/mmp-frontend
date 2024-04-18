<script lang="ts" setup>
import { computed } from "vue";

import { type Author, useAuthorById } from "@/api";
import AuthorDetailsList from "@/components/author-details-list.vue";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel, getPlaceLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSelection } from "@/lib/search/use-selection";
import { useRoute } from "#imports";

const props = defineProps<{
	ids: Set<Author["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const route = useRoute();
const { createSelectionParams } = useSelection();
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
	<div class="relative mx-auto size-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading author...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load author.</ErrorMessage>
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
					<LoadingIndicator>Updating author...</LoadingIndicator>
				</Centered>
			</template>

			<div class="flex h-full flex-col gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">{{ getAuthorLabel(author) }}</h2>

				<dl v-if="author" class="text-sm font-medium text-neutral-500">
					<div>
						<dt class="sr-only">Century</dt>
						<dd>{{ getDateRangeLabel(author.start_date_year, author.end_date_year) }}</dd>
					</div>
					<div v-if="author.ort">
						<dt class="sr-only">Place</dt>
						<dd>
							<NuxtLink
								class="transition hover:underline"
								:href="{
									query: {
										...route.query,
										...createSelectionParams({
											selection: [createResourceKey({ kind: 'ort', id: author.ort.id })],
										}),
									},
								}"
							>
								{{ getPlaceLabel(author.ort) }}
							</NuxtLink>
						</dd>
					</div>
					<div>
						<dt class="sr-only">GND</dt>
						<dd>
							<a class="transition hover:text-neutral-700" :href="author.gnd_id" target="_blank">
								{{ author.gnd_id }}
							</a>
						</dd>
					</div>
				</dl>
				<p v-if="author?.kommentar">{{ author.kommentar }}</p>
				<AuthorDetailsList :id="id" />
			</div>
		</template>
	</div>
</template>
