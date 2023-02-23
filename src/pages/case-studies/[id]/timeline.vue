<script lang="ts" setup>
import { computed } from "vue";

import { type GetCaseStudyTimetableById, useCaseStudyTimeTableById } from "@/api";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { getDateRangeLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Timeline";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useCaseStudyIdParam();

const caseStudyTimelineQuery = useCaseStudyTimeTableById({ id });
const isFetching = caseStudyTimelineQuery.isFetching;
const isLoading = caseStudyTimelineQuery.isInitialLoading;
const isError = caseStudyTimelineQuery.isError;
const caseStudyTimeline = computed(() => {
	return caseStudyTimelineQuery.data.value ?? [];
});
const isEmpty = computed(() => {
	return caseStudyTimeline.value.length === 0;
});

const { createSearchFilterParams, defaultSearchFilters } = useSearchFilters();

function getEventColor(event: GetCaseStudyTimetableById.Response[number]) {
	switch (event.ent_type) {
		case "autor":
			return "bg-red-500";
		case "event":
			return "bg-green-500";
		case "text":
			return "bg-blue-500";
	}
}

// function getEventIcon(event: GetCaseStudyTimetableById.Response[number]) {
//   switch (event.ent_type) {
//     case 'autor':
//       return mdiPencil
//     case 'event':
//       return mdiCalendar
//     case 'text':
//       return mdiBookOpenVariant
//   }
// }
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Timeline</h2>

		<template v-if="isLoading">
			<LoadingIndicator>Loading timeline...</LoadingIndicator>
		</template>

		<template v-else-if="isError">
			<ErrorMessage>Failed to load timeline.</ErrorMessage>
		</template>

		<template v-else-if="isEmpty">
			<NothingFoundMessage></NothingFoundMessage>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<LoadingIndicator>Updating timeline...</LoadingIndicator>
			</template>

			<ol role="list">
				<li v-for="event of caseStudyTimeline" :key="event.id">
					<div>
						<span>{{ getDateRangeLabel(event.start_date, event.end_date) }}</span>

						<NuxtLink
							v-if="event.ent_type === 'autor'"
							:to="{
								name: '/explore/search-results',
								query: createSearchFilterParams({ ...defaultSearchFilters, author: [event.id] }),
							}"
						>
							{{ event.ent_title }}
						</NuxtLink>
						<span v-else>{{ event.ent_description }}</span>
					</div>
				</li>
			</ol>
		</template>
	</div>
</template>
