<script lang="ts" setup>
import { computed } from "vue";

import { usePlaces } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { usePlacesBrowseSearchParams } from "@/lib/browse/use-browse-places-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { getPlaceLabel } from "@/lib/get-label";
import { useHead } from "#imports";

const title = "Browse places";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

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

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (placesQuery.data.value?.next == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset + limit }) };
});

const columns = {
	name: { label: "Name" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse places</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading places...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load places.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating places...</LoadingIndicator>
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
								{{ getPlaceLabel(place) }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ place.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" />
		</template>
	</div>
</template>
