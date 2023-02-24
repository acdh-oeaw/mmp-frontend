<script lang="ts" setup>
import { computed } from "vue";

import { type Author } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import KeywordTag from "@/components/keyword-tag.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useAuthorDetails } from "@/lib/details/use-author-details";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink } from "#components";

const props = defineProps<{
	id: Author["id"];
}>();

const id = computed(() => {
	return props.id;
});
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const { caseStudies, keywords, passages, isLoading, isFetching, isEmpty, isError } =
	useAuthorDetails(id, searchFilters);
</script>

<template>
	<div>
		<template v-if="isLoading">
			<LoadingIndicator>Loading details...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load details.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating details...</LoadingIndicator>
			</template>

			<section v-if="keywords.length > 0">
				<h3>Keywords</h3>
				<ul class="flex flex-wrap gap-0.5" role="list">
					<li v-for="keyword of keywords" :key="keyword.id">
						<NuxtLink
							:href="{
								query: createSearchFilterParams({ ...searchFilters, keyword: [keyword.id] }),
							}"
						>
							<KeywordTag :keyword="keyword" />
						</NuxtLink>
					</li>
				</ul>
			</section>

			<section v-if="caseStudies.length > 0">
				<h3>Case studies</h3>
				<pre>{{ caseStudies.length }}</pre>
			</section>

			<section>
				<h3>Passages</h3>
				<pre>{{ passages.length }}</pre>
			</section>
		</template>
	</div>
</template>
