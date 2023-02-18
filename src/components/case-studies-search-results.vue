<script lang="ts" setup>
import { computed } from "vue";

import { useCaseStudies } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudiesSearchFilters } from "@/lib/search/use-case-studies-search-filters";
import { useCaseStudiesSearchParams } from "@/lib/search/use-case-studies-search-params";

const { searchFilters } = useCaseStudiesSearchFilters();
const searchParams = useCaseStudiesSearchParams(searchFilters);
const caseStudiesQuery = useCaseStudies(searchParams);
const isLoading = caseStudiesQuery.isInitialLoading;
const isFetching = caseStudiesQuery.isFetching;
const isError = caseStudiesQuery.isError;
const caseStudies = computed(() => {
	return caseStudiesQuery.data.value?.results ?? [];
});
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

		<template v-else-if="caseStudies.length === 0">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating search results...</LoadingIndicator>
			</template>

			<ul class="grid gap-8 lg:grid-cols-2" role="list">
				<li v-for="caseStudy of caseStudies" :key="caseStudy.id">
					<CaseStudyPreviewCard :case-study="caseStudy" />
				</li>
			</ul>
		</template>
	</div>
</template>
