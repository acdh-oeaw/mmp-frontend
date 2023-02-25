<script lang="ts" setup>
import { computed } from "vue";

import ErrorMessage from "@/components/error-message.vue";
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
										{{ getAuthorLabel(author) }}
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
								{{ getPassageLabel(passage) }}
							</template>
						</td>
						<td>
							<ul class="flex flex-wrap gap-0.5" role="list">
								<li v-for="keyword of passage.key_word" :key="keyword.id">
									<KeywordTag :keyword="keyword" />
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
		</template>
	</div>
</template>
