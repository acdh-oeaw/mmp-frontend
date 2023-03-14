<script lang="ts" setup>
import {
	BookOpenIcon as TextIcon,
	CalendarDaysIcon as EventIcon,
	ChevronRightIcon,
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

			<ol
				role="list"
				class="grid items-center gap-6 transition-all"
				style="grid-template-columns: repeat(3, auto)"
				:class="{ 'opacity-50 grayscale': isFetching }"
			>
				<template v-for="(event, i) of caseStudyTimeline" :key="event.id">
					<div class="text-right">
						<span>{{ getDateRangeLabel(event.start_date, event.end_date) }}</span>
					</div>
					<div class="relative h-full min-h-[3rem] w-12">
						<span
							class="absolute top-2/4 left-2/4 h-12 w-12 -translate-x-2/4 -translate-y-2/4 rounded-full border-4 border-white p-2 text-white shadow"
							:class="getEventColor(event.ent_type)"
						>
							<EventIcon v-if="event.ent_type === 'event'" />
							<AuthorIcon v-if="event.ent_type === 'autor'" />
							<TextIcon v-if="event.ent_type === 'text'" />
						</span>
						<div
							v-if="i + 1 < caseStudyTimeline.length"
							class="absolute inset-x-2/4 top-0 bottom-[-1.5rem] -z-10 border border-neutral-300"
						/>
					</div>
					<NuxtLink
						v-if="event.ent_type === 'autor'"
						:href="{
							path: '/explore/search-results',
							query: createSearchFilterParams({ ...defaultSearchFilters, author: [event.id] }),
						}"
					>
						<div
							class="flex w-fit basis-0 items-center rounded p-2 transition hover:bg-neutral-200"
						>
							<span>
								{{ event.ent_title }}
							</span>
							<span>
								<ChevronRightIcon class="ml-2 inline h-5 w-5" />
							</span>
						</div>
					</NuxtLink>
					<span v-else>{{ event.ent_description }}</span>
				</template>
			</ol>
		</template>
	</div>
</template>
