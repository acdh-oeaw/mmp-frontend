<script lang="ts" setup>
import { computed } from "vue";

import { useTexts } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { useTextsBrowseSearchParams } from "@/lib/browse/use-browse-texts-search-params";
import { useHead } from "#imports";

const title = "Browse texts";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { createSearchFilterParams, searchFilters } = useBrowseSearchFilters();
const searchParams = useTextsBrowseSearchParams(searchFilters);
const textsQuery = useTexts(searchParams);
const isLoading = textsQuery.isInitialLoading;
const isFetching = textsQuery.isFetching;
const isError = textsQuery.isError;
const texts = computed(() => {
	return textsQuery.data.value?.results ?? [];
});
const isEmpty = computed(() => {
	return texts.value.length === 0;
});

const previous = computed(() => {
	if (textsQuery.data.value?.previous == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset - limit }) };
});
const next = computed(() => {
	if (textsQuery.data.value?.next == null) return null;

	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return { query: createSearchFilterParams({ ...searchFilters.value, offset: offset + limit }) };
});
const page = computed(() => {
	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return Math.ceil(offset / limit) + 1
});
const pages = computed(() => {
	const limit = searchFilters.value["limit"];
	const count = textsQuery.data.value?.count ?? 0;

	return Math.ceil(count / limit);
});

const columns = {
	title: { label: "Title" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse texts</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading texts...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load texts.</ErrorMessage>
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
					<LoadingIndicator>Updating texts...</LoadingIndicator>
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
						<tr v-for="text of texts" :key="text.id">
							<td class="px-6 py-4 text-neutral-800">
								{{ text.title }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ text.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" :pages="pages" :page="page" />
		</template>
	</div>
</template>
