<script lang="ts" setup>
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/20/solid";

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

		<!-- FIXME: why is the navigation behavior different for author and passages vs. keyword? -->
		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating search results...</LoadingIndicator>
			</template>

			<div class="overflow-x-auto transition" :class="{ 'grayscale opacity-50': isFetching }">
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
							<td class="px-6 py-4 text-neutral-800">
								<template v-if="passage.text != null">
									{{ passage.text.title }}
								</template>
							</td>
							<td class="px-6 py-4 text-neutral-800">
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
							<td class="px-6 py-4 text-neutral-800">
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
							<td class="whitespace-nowrap px-6 py-4 text-xs text-neutral-800">
								{{ getDateRangeLabel(passage.text?.not_before, passage.text?.not_after) }}
							</td>
							<td class="whitespace-nowrap px-6 py-4 text-xs text-neutral-800">
								{{ getDateRangeLabel(passage.start_date, passage.end_date) }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- FIXME: disabled links -->
			<template v-if="passagesQuery.data.value?.count">
				<nav aria-label="Pagination" class="flex items-center justify-center gap-8 p-8 text-sm">
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
						class="inline-flex items-center gap-1"
					>
						<ChevronLeftIcon class="h-5 w-5" />
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
						class="inline-flex items-center gap-1"
					>
						<span>Next page</span>
						<ChevronRightIcon class="h-5 w-5" />
					</NuxtLink>
				</nav>
			</template>
		</template>
	</div>
</template>
