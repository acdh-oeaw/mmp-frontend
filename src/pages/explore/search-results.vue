<script lang="ts" setup>
import { computed } from "vue";

import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import PaginationLinks from "@/components/pagination-links.vue";
import { getAuthorLabel, getDateRangeLabel } from "@/lib/get-label";
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
const page = computed(() => {
	const limit = searchFilters.value["limit"];
	const offset = searchFilters.value["offset"];

	return Math.ceil(offset / limit) + 1;
});
const pages = computed(() => {
	const limit = searchFilters.value["limit"];
	const count = passagesQuery.data.value?.count ?? 0;

	return Math.ceil(count / limit);
});

const columns = {
	passage: { label: "Passage" },
	text: { label: "Text" },
	authors: { label: "Author" },
	keywords: { label: "Keywords" },
	dateOfComposition: { label: "Date of composition" },
	temporalCoverage: { label: "Temporal coverage" },
};
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Search results</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading search results...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load search results.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<!-- FIXME: why is the navigation behavior different for author and passages vs. keyword? -->
		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating search results...</LoadingIndicator>
				</Centered>
			</template>

			<div class="overflow-x-auto transition-all" :class="{ 'opacity-50 grayscale': isFetching }">
				<div class="text-center text-sm text-gray-500">
					{{ passagesQuery.data.value?.count }} passage{{
						passagesQuery.data.value?.count != 1 ? "s" : ""
					}}
					found
				</div>
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
								<template v-if="passage.zitat">
									<NuxtLink
										class="font-semibold line-clamp-4"
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
							<td class="px-6 py-4 text-neutral-800">
								<template v-if="passage.text != null">
									{{ passage.text.title }}
								</template>
							</td>
							<td class="px-6 py-4 text-neutral-800">
								<template v-if="passage.text != null">
									<ul role="list">
										<li v-for="author of passage.text.autor" :key="author.id">
											<NuxtLink
												class="font-semibold"
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
								<ul class="flex flex-wrap gap-0.5" role="list">
									<li v-for="keyword of passage.key_word" :key="keyword.id">
										<NuxtLink
											:href="{
												query: {
													...createSearchFilterParams({
														...searchFilters,
														keyword: [...searchFilters.keyword, keyword.id],
														offset: 0,
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
								{{ getDateRangeLabel(passage.start_date, passage.end_date) || "non-defined" }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<PaginationLinks :previous="previous" :next="next" :pages="pages" :page="page" />
		</template>
	</div>
</template>
