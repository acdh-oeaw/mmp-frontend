<script lang="ts" setup>
import { computed } from "vue";

import { usePlaces } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { usePlacesBrowseSearchParams } from "@/lib/browse/use-browse-places-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { createResourceKey } from "@/lib/search/resource-key";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Browse places";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSelectionParams } = useSelection();
const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchParams = usePlacesBrowseSearchParams(searchFilters);
const placesQuery = usePlaces(searchParams);
const isLoading = placesQuery.isInitialLoading;
const isFetching = placesQuery.isFetching;
const isError = placesQuery.isError;
const places = computed(() => {
	return placesQuery.data.value?.results ?? [];
});
const isEmpty = computed(() => {
	return places.value.length === 0;
});

const previous = computed(() => {
	if (placesQuery.data.value?.previous == null) return null;

	const limit = searchFilters.value.limit;
	const offset = searchFilters.value.offset;

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (placesQuery.data.value?.next == null) return null;

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
	const count = placesQuery.data.value?.count ?? 0;

	return Math.ceil(count / limit);
});

const columns = {
	name: { label: "English name" },
	name_antik: { label: "Ancient name" },
	name_de: { label: "German name" },
	name_fr: { label: "French name" },
	name_gr: { label: "Greek name" },
	name_it: { label: "Italian name" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto size-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse places</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading places...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load places.</ErrorMessage>
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
					<LoadingIndicator>Updating places...</LoadingIndicator>
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
						<tr v-for="place of places" :key="place.id">
							<td class="px-6 py-4 text-neutral-800">
								<NuxtLink
									class="font-medium transition hover:underline"
									:href="{
										query: {
											...createSearchFilterParams(searchFilters),
											...createSelectionParams({
												selection: [createResourceKey({ kind: 'ort', id: place.id })],
											}),
										},
									}"
								>
									{{ place.name }}
								</NuxtLink>
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.name_antik }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.name_de }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.name_fr }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.name_gr }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.name_it }}
							</td>
							<td class="w-1/3 px-6 py-4 text-neutral-800">
								{{ place.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" :pages="pages" :page="page" />
		</template>
	</div>
</template>
