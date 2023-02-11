<script lang="ts" setup>
import { computed } from "vue";

import { usePassages } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { usePassagesSearchParams } from "@/lib/search/use-passages-search-params";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useHead } from "#imports";
import { keywordColors } from "~~/src/lib/search/search.config";

const title = "Search results";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const searchParams = usePassagesSearchParams();
const passagesQuery = usePassages(searchParams);
const isLoading = passagesQuery.isInitialLoading;
const isFetching = passagesQuery.isFetching;
const isError = passagesQuery.isError;
const passages = computed(() => {
	return passagesQuery.data.value?.results ?? [];
});

const { searchFilters, createSearchFilterParams } = useSearchFilters();
const { createSelectionParams } = useSelection();

const columns = {
	authors: { label: "Authors" },
	text: { label: "Text" },
	passage: { label: "Passage" },
	keywords: { label: "Keywords" },
	dateOfComposition: { label: "Date of composition" },
	temporalCoverage: { label: "Temporal coverage" },
};
</script>

<template>
	<div class="h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Search results</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading search results...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load search results.</ErrorMessage>
		</template>

		<template v-else-if="passages.length === 0">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<!--
			FIXME: why is the navigation behavior different for author and passages vs. keyword?
			FIXME: why does the Text column open Passage details?
		-->
		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating search results...</LoadingIndicator>
			</template>

			<table>
				<thead>
					<tr>
						<th v-for="(column, key) of columns" :key="key">{{ column.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="passage of passages" :key="passage.id">
						<td>
							<template v-if="passage.text != null">
								<NuxtLink
									v-for="author of passage.text.autor"
									:key="author.id"
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
							</template>
						</td>
						<td>
							<template v-if="passage.text != null">
								<NuxtLink
									:href="{
										query: {
											...createSearchFilterParams(searchFilters),
											...createSelectionParams({
												selection: [createResourceKey({ kind: 'stelle', id: passage.id })],
											}),
										},
									}"
								>
									{{ passage.text.title }}
								</NuxtLink>
							</template>
						</td>
						<td>
							<!-- {{ passage.display_label.replace(passage.text.title, "").replace(/ \(\d+ - \d+\), /, "") }} -->
							{{ passage.display_label }}
						</td>
						<td>
							<NuxtLink
								v-for="keyword of passage.key_word"
								:key="keyword.id"
								:href="{
									query: {
										...createSearchFilterParams({
											...searchFilters,
											keyword: [...searchFilters.keyword, keyword.id],
										}),
									},
								}"
							>
								<span :class="keywordColors[keyword.art]">
									{{ keyword.stichwort }}
								</span>
							</NuxtLink>
						</td>
						<td>{{ getDateRangeLabel(passage.text?.not_before, passage.text?.not_after) }}</td>
						<td>{{ getDateRangeLabel(passage.start_date, passage.end_date) }}</td>
					</tr>
				</tbody>
			</table>

			<!-- TODO: disabled links -->
			<template v-if="passagesQuery.data.value?.count">
				<nav aria-label="Pagination">
					<NuxtLink
						:aria-disabled="searchFilters.offset <= searchFilters.limit"
						:href="{
							query: {
								...createSearchFilterParams({
									...searchFilters,
									offset: searchFilters.offset - searchFilters.limit,
								}),
							},
						}"
						rel="prev"
					>
						<span>Previous page</span>
					</NuxtLink>
					<NuxtLink
						:aria-disabled="
							searchFilters.offset + searchFilters.limit >= passagesQuery.data.value.count
						"
						:href="{
							query: {
								...createSearchFilterParams({
									...searchFilters,
									offset: searchFilters.offset + searchFilters.limit,
								}),
							},
						}"
						rel="next"
					>
						<span>Next page</span>
					</NuxtLink>
				</nav>
			</template>
		</template>
	</div>
</template>
