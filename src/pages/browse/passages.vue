<script lang="ts" setup>
import { computed } from "vue";

import { usePassages } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { usePassagesBrowseSearchParams } from "@/lib/browse/use-browse-passages-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { getPassageLabel } from "@/lib/get-label";
import { useHead } from "#imports";

const title = "Browse passages";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchParams = usePassagesBrowseSearchParams(searchFilters);
const passagesQuery = usePassages(searchParams);
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

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (passagesQuery.data.value?.next == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset + limit }) };
});

const columns = {
	quote: { label: "Quote" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
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
							<td class="px-6 py-4 text-neutral-800">
								{{ getPassageLabel(passage) }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ passage.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" />
		</template>
	</div>
</template>
