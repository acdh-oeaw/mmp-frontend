<script lang="ts" setup>
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel, getPassageLabel } from "@/lib/get-label";
import { createResourceKey } from "@/lib/search/resource-key";
import { usePassagesSearch } from "@/lib/search/use-passages-search";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useSelection } from "@/lib/search/use-selection";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Search results";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const { searchFilters, createSearchFilterParams } = useSearchFilters();
const { passages, passagesQuery, isEmpty, isError, isFetching, isLoading } =
	usePassagesSearch(searchFilters);
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
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Search results</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading search results...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load search results.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
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

			<table class="text-sm transition" :class="{ 'grayscale opacity-50': isFetching }">
				<thead>
					<tr>
						<th v-for="(column, key) of columns" :key="key">{{ column.label }}</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="passage of passages" :key="passage.id">
						<td>
							<template v-if="passage.text != null">
								<ul role="list">
									<li v-for="author of passage.text.autor" :key="author.id">
										<NuxtLink
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
							</template>
						</td>
						<td>
							<template v-if="passage.text != null">
								{{ passage.text.title }}
							</template>
						</td>
						<td>
							<template v-if="passage.display_label">
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
									{{ getPassageLabel(passage) }}
								</NuxtLink>
							</template>
						</td>
						<td>
							<ul class="flex flex-wrap gap-0.5" role="list">
								<li v-for="keyword of passage.key_word" :key="keyword.id">
									<NuxtLink
										:href="{
											query: {
												...createSearchFilterParams({
													...searchFilters,
													keyword: [...searchFilters.keyword, keyword.id],
												}),
											},
										}"
									>
										<KeywordTag :keyword="keyword" />
									</NuxtLink>
								</li>
							</ul>
						</td>
						<td>
							<span class="text-xs">
								{{ getDateRangeLabel(passage.text?.not_before, passage.text?.not_after) }}
							</span>
						</td>
						<td>
							<span class="text-xs">
								{{ getDateRangeLabel(passage.start_date, passage.end_date) }}
							</span>
						</td>
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
