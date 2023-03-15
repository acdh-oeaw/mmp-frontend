<script lang="ts" setup>
import { computed } from "vue";

import { type Text, useTextById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import TextDetailsList from "@/components/text-details-list.vue";
import { getAuthorLabel, getDateRangeLabel, getPlaceLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";

const props = defineProps<{
	ids: Set<Text["id"]>;
}>();

const id = computed(() => {
	const id = props.ids.values().next().value;
	return id;
});

const { searchFilters, createSearchFilterParams } = useSearchFilters();
const { createSelectionParams } = useSelection();

const textQuery = useTextById({ id });
const isLoading = textQuery.isInitialLoading;
const isFetching = textQuery.isFetching;
const isError = textQuery.isError;
const text = textQuery.data;
const isEmpty = computed(() => {
	return text.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading text...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load text.</ErrorMessage>
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
					<LoadingIndicator>Updating text...</LoadingIndicator>
				</Centered>
			</template>

			<div class="grid h-full grid-rows-[auto_auto_1fr] gap-4 p-4 text-neutral-800">
				<h2 class="text-lg font-medium">{{ text?.title }}</h2>

				<dl v-if="text" class="text-sm font-medium text-neutral-500">
					<div>
						<dt class="sr-only">Authors</dt>
						<dd>
							<ul role="list">
								<li v-for="author of text.autor" :key="author.id">
									<NuxtLink
										class="hover:underline"
										:href="{
											query: {
												...createSearchFilterParams(searchFilters),
												...createSelectionParams({
													selection: [createResourceKey({ kind: 'autor', id: author.id })],
												}),
											},
										}"
									>
										{{ getAuthorLabel(author) }}
									</NuxtLink>
								</li>
							</ul>
						</dd>
					</div>
					<div>
						<dt class="sr-only">Date of composition</dt>
						<dd>{{ getDateRangeLabel(text.not_before, text.not_after) }}</dd>
					</div>
					<div>
						<dt class="sr-only">Place of composition</dt>
						<dd>
							<ul role="list">
								<li v-for="place of text.ort" :key="place.id">
									<NuxtLink
										class="hover:underline"
										:href="{
											query: {
												...createSearchFilterParams(searchFilters),
												...createSelectionParams({
													selection: [createResourceKey({ kind: 'ort', id: place.id })],
												}),
											},
										}"
									>
										{{ getPlaceLabel(place) }}
									</NuxtLink>
								</li>
							</ul>
						</dd>
					</div>
				</dl>

				<p v-if="text?.kommentar">{{ text.kommentar }}</p>

				<TextDetailsList :id="id" />
			</div>
		</template>
	</div>
</template>
