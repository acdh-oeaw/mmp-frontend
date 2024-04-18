<script lang="ts" setup>
import { computed } from "vue";

import { usePassages } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordDisclosure from "@/components/keyword-disclosure.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { usePassagesBrowseSearchParams } from "@/lib/browse/use-browse-passages-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { getAuthorLabel, getDateRangeLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Browse passages";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchParams = usePassagesBrowseSearchParams(searchFilters);
const passagesQuery = usePassages(searchParams);
const { createSelectionParams } = useSelection();
const isLoading = passagesQuery.isInitialLoading;
const isFetching = passagesQuery.isFetching;
const isError = passagesQuery.isError;
const passages = computed(() => {
	return passagesQuery.data.value?.results ?? [];
});
const isEmpty = computed(() => {
	return passages.value.length === 0;
});

const previous = computed(() => {
	if (passagesQuery.data.value?.previous == null) return null;

	const limit = searchFilters.value.limit;
	const offset = searchFilters.value.offset;

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (passagesQuery.data.value?.next == null) return null;

	const limit = searchFilters.value.limit;
	const offset = searchFilters.value.offset;

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset + limit }) };
});
const page = computed(() => {
	const limit = searchFilters.value.limit;
	const offset = searchFilters.value.offset;

	return Math.ceil(offset / limit) + 1;
});
const pages = computed(() => {
	const limit = searchFilters.value.limit;
	const count = passagesQuery.data.value?.count ?? 0;

	return Math.ceil(count / limit);
});

const columns = {
	quote: { label: "Quote" },
	text: { label: "Text" },
	author: { label: "Author" },
	keywords: { label: "Keywords" },
	text_date: { label: "Date of composition" },
	date: { label: "Temporal Coverage" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto size-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse passages</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading passages...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load passages.</ErrorMessage>
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
					<LoadingIndicator>Updating passages...</LoadingIndicator>
				</Centered>
			</template>

			<div class="overflow-x-auto transition-all" :class="{ 'opacity-50 grayscale': isFetching }">
				<table class="min-w-full divide-y divide-neutral-200 text-sm">
					<thead>
						<tr>
							<th
								v-for="(column, key) of columns"
								:key="key"
								scope="col"
								class="px-6 py-3 text-left text-xs font-medium uppercase text-neutral-500"
							>
								{{ column.label }}
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-neutral-200">
						<tr v-for="passage of passages" :key="passage.id">
							<td class="w-1/3 px-6 py-4 text-neutral-800">
								<template v-if="passage.zitat">
									<NuxtLink
										class="line-clamp-4 font-medium transition hover:underline"
										:href="{
											query: {
												...createSearchFilterParams(searchFilters),
												...createSelectionParams({
													selection: [createResourceKey({ kind: 'stelle', id: passage.id })],
												}),
											},
										}"
									>
										{{ passage.zitat }}
									</NuxtLink>
								</template>
							</td>
							<td class="w-1/3 px-6 py-4 text-neutral-800">
								<NuxtLink
									class="font-medium transition hover:underline"
									:href="{
										query: {
											...createSearchFilterParams(searchFilters),
											...createSelectionParams({
												selection: [createResourceKey({ kind: 'text', id: passage.text!.id })],
											}),
										},
									}"
								>
									{{ passage.text?.title }}
								</NuxtLink>
							</td>
							<td class="px-6 py-4 text-neutral-800">
								<p v-for="author in passage.text?.autor" :key="author.id">
									<NuxtLink
										class="font-medium transition hover:underline"
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
								</p>
							</td>
							<td class="px-6 py-4 text-neutral-800">
								<KeywordDisclosure no-header :keywords="passage.key_word" />
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-neutral-800">
								{{ getDateRangeLabel(passage.text?.not_before, passage.text?.not_after) }}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-neutral-800">
								{{ getDateRangeLabel(passage.start_date, passage.end_date) || "non-defined" }}
							</td>
							<td class="min-w-[200px] px-6 py-4 text-neutral-800">
								{{ passage.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" :pages="pages" :page="page" />
		</template>
	</div>
</template>
