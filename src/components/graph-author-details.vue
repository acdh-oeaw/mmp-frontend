<script lang="ts" setup>
import { computed } from "vue";

import { type Author, useAuthorById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordDisclosureWrapper from "@/components/keyword-disclosure-wrapper.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel, getPlaceLabel } from "@/lib/get-label";
import { useNetworkGraph } from "@/lib/network-graph/use-network-graph";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSearchFilters } from "@/lib/search/use-search-filters";
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
const { searchFilters } = useSearchFilters();

const authorQuery = useAuthorById({ id });
const graphQuery = useNetworkGraph(searchFilters);

const isLoading = authorQuery.isInitialLoading.value || graphQuery.isLoading.value;
const isFetching = authorQuery.isFetching.value || graphQuery.isFetching.value;
const isError = authorQuery.isError.value || graphQuery.isError.value;
const author = authorQuery.data;
const graph = graphQuery.graph;

const graphAuthors = [...graph.value.nodes]
	.filter(([key]) => {
		return key.includes("autor");
	})
	.map(([, node]) => {
		return node;
	})
	.sort((a) => {
		// Always puts selected author on top
		return Number(a.key.replace(/\D/g, "")) === id.value ? -1 : 0;
	});

const isEmpty = computed(() => {
	return author.value == null;
});
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-6 py-4">
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
			<div class="grid h-full grid-rows-[auto_auto_auto_1fr] gap-4 p-4 text-neutral-800">
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
				<div
					v-for="(graphAuthor, i) in graphAuthors.filter(
						(graphAuthor) => graphAuthor.key.replace(/\D/g, '') !== id,
					)"
					:key="graphAuthor.key"
				>
					<KeywordDisclosureWrapper
						new-tab
						:label="i === 0 ? 'Connected Keywords' : `Shared with ${graphAuthor.label}`"
						:ids="[...graphAuthor.neighbors].map((neighbor) => Number(neighbor.replace(/\D/g, '')))"
					/>
				</div>

				<p v-if="author?.kommentar">{{ author.kommentar }}</p>
			</div>
		</template>
	</div>
</template>
