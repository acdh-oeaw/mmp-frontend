<script lang="ts" setup>
import { computed } from "vue";

import { useAuthors } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { useAuthorsBrowseSearchParams } from "@/lib/browse/use-browse-authors-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { getAuthorLabel, getDateRangeLabel, getPlaceLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Browse authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSelectionParams } = useSelection();
const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchParams = useAuthorsBrowseSearchParams(searchFilters);
const authorsQuery = useAuthors(searchParams);
const isLoading = authorsQuery.isInitialLoading;
const isFetching = authorsQuery.isFetching;
const isError = authorsQuery.isError;
const authors = computed(() => {
	return authorsQuery.data.value?.results ?? [];
});
const isEmpty = computed(() => {
	return authors.value.length === 0;
});

const previous = computed(() => {
	if (authorsQuery.data.value?.previous == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (authorsQuery.data.value?.next == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset + limit }) };
});
const page = computed(() => {
	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return Math.ceil(offset / limit) + 1;
});
const pages = computed(() => {
	const limit = searchFilters.value["limit"];
	const count = authorsQuery.data.value?.count ?? 0;

	return Math.ceil(count / limit);
});

const columns = {
	name: { label: "Name" },
	place: { label: "Birthplace" },
	date: { label: "Lifetime" },
	comment: { label: "Comment" },
	dnd: { label: "GND ID" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse authors</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading authors...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load authors.</ErrorMessage>
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
					<LoadingIndicator>Updating authors...</LoadingIndicator>
				</Centered>
			</template>

			<div class="overflow-x-auto transition-all" :class="{ 'opacity-50 grayscale': isFetching }">
				<table class="mt-4 min-w-full divide-y divide-neutral-200 text-sm">
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
						<tr v-for="author of authors" :key="author.id">
							<td class="whitespace-nowrap px-6 py-4">
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
							</td>
							<td class="px-6 py-4">
								<NuxtLink
									v-if="author.ort"
									class="font-medium transition hover:underline"
									:href="{
										query: {
											...createSearchFilterParams(searchFilters),
											...createSelectionParams({
												selection: [createResourceKey({ kind: 'ort', id: author.ort?.id })],
											}),
										},
									}"
								>
									{{ getPlaceLabel(author.ort) }}
								</NuxtLink>
							</td>
							<td class="whitespace-nowrap px-6 py-4">
								{{ getDateRangeLabel(author.start_date_year, author.end_date_year) }}
							</td>
							<td class="px-6 py-4">
								{{ author.kommentar }}
							</td>
							<td class="px-6 py-4">
								<a
									class="font-medium transition hover:underline"
									:href="author.gnd_id"
									target="_blank"
								>
									{{ author.gnd_id.replace("https:\/\/d-nb.info/gnd/", "") }}
								</a>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" :pages="pages" :page="page" />
		</template>
	</div>
</template>
