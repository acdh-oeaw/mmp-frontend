<script lang="ts" setup>
import { computed } from "vue";

import { useCaseStudies } from "@/api";
import CaseStudiesSearchForm from "@/components/case-studies-search-form.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import MainContent from "@/components/main-content.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudiesSearchFilters } from "@/lib/search/use-case-studies-search-filters";
import { useCaseStudiesSearchParams } from "@/lib/search/use-case-studies-search-params";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Case studies";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

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
	<div>
		<h1>Case studies</h1>

		<aside>
			<div class="max-w-7xl px-8 py-4">
				<CaseStudiesSearchForm />
			</div>
		</aside>

		<MainContent>
			<div class="h-full w-full max-w-7xl px-8 py-4">
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

					<ul role="list">
						<li v-for="caseStudy of caseStudies" :key="caseStudy.id">
							<article>
								<h3>
									<NuxtLink :href="`/case-studies/${caseStudy.id}/timeline`">
										{{ caseStudy.title }}
									</NuxtLink>
								</h3>
								<p>{{ caseStudy.description }}</p>
							</article>
						</li>
					</ul>
				</template>
			</div>
		</MainContent>
	</div>
</template>
