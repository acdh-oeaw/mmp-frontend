<script lang="ts" setup>
import {
	BookOpenIcon as TextIcon,
	CalendarDaysIcon as EventIcon,
	PencilIcon as AuthorIcon,
} from "@heroicons/vue/24/outline";

import { type GetCaseStudyTimetableById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudyIdParam } from "@/lib/case-studies/use-case-study-id-param";
import { useCaseStudyTimeline } from "@/lib/case-studies/use-case-study-timeline";
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
const { caseStudyTimeline, isEmpty, isError, isFetching, isLoading } = useCaseStudyTimeline(id);
const { createSearchFilterParams, defaultSearchFilters } = useSearchFilters();

function getEventColor(type: GetCaseStudyTimetableById.Response[number]["ent_type"]) {
	switch (type) {
		case "autor":
			return "bg-red-500";
		case "event":
			return "bg-green-500";
		case "text":
			return "bg-blue-500";
	}
}
</script>

<template>
	<div class="relative mx-auto h-full w-full max-w-7xl px-8 py-4">
		<h2 class="sr-only">Timeline</h2>

		<template v-if="isLoading">
			<Centered>
				<LoadingIndicator>Loading timeline...</LoadingIndicator>
			</Centered>
		</template>

		<template v-else-if="isError">
			<Centered>
				<ErrorMessage>Failed to load timeline.</ErrorMessage>
			</Centered>
		</template>

		<template v-else-if="isEmpty">
			<Centered>
				<NothingFoundMessage></NothingFoundMessage>
			</Centered>
		</template>

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating timeline...</LoadingIndicator>
				</Centered>
			</template>

			<ol role="list">
				<li v-for="event of caseStudyTimeline" :key="event.id">
					<div>
						<span>{{ getDateRangeLabel(event.start_date, event.end_date) }}</span>

						<span
							class="inline-grid place-items-center rounded-full border-4 border-white p-2 text-white shadow"
							:class="getEventColor(event.ent_type)"
						>
							<EventIcon v-if="event.ent_type === 'event'" class="h-6 w-6" />
							<AuthorIcon v-if="event.ent_type === 'autor'" class="h-6 w-6" />
							<TextIcon v-if="event.ent_type === 'text'" class="h-6 w-6" />
						</span>

						<NuxtLink
							v-if="event.ent_type === 'autor'"
							:href="{
								path: '/explore/search-results',
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
