<script lang="ts" setup>
import { computed } from "vue";

import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { getAuthorLabel, getDateRangeLabel, getPassageLabel } from "@/lib/get-label";
import { usePassagesSearch } from "@/lib/search/use-passages-search";
import { type SearchFilters } from "@/lib/search/use-search-filters";

const props = defineProps<{
	searchFilters: SearchFilters;
}>();

const searchFilters = computed(() => {
	return props.searchFilters;
});

const { passages, isEmpty, isError, isFetching, isLoading } = usePassagesSearch(searchFilters);

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
	<div class="relative h-full w-full">
		<template v-if="isLoading">
			<LoadingIndicator>Loading search results...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load search results.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating search results...</LoadingIndicator>
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
								<template v-if="passage.text != null">
									<ul role="list">
										<li v-for="author of passage.text.autor" :key="author.id">
											{{ getAuthorLabel(author) }}
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
									{{ getPassageLabel(passage) }}
								</template>
							</td>
							<td class="px-6 py-4 text-neutral-800">
								<ul class="flex flex-wrap gap-0.5" role="list">
									<li v-for="keyword of passage.key_word" :key="keyword.id">
										<KeywordTag :keyword="keyword" />
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
		</template>
	</div>
</template>
