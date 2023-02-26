<script lang="ts" setup>
import { computed } from "vue";

import { useAuthors } from "@/api";
import { useAuthorsBrowseSearchParams } from "@/lib/browse/use-browse-authors-search-params";
import { useBrowseSearchFilters } from "@/lib/browse/use-browse-search-filters";
import { getAuthorLabel } from "@/lib/get-label";
import { useHead } from "#imports";

const title = "Browse authors";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters } = useBrowseSearchFilters();
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

const columns = {
	name: { label: "Name" },
	comment: { label: "Comment" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Browse authors</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading authors...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load authors.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating authors...</LoadingIndicator>
			</template>

			<div class="overflow-x-auto transition" :class="{ 'opacity-50 grayscale': isFetching }">
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
						<tr v-for="author of authors" :key="author.id">
							<td class="px-6 py-4 text-neutral-800">
								{{ getAuthorLabel(author) }}
							</td>
							<td class="px-6 py-4 text-neutral-800">
								{{ author.kommentar }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</div>
</template>
