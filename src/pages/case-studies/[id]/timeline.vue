<script lang="ts" setup>
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/vue";
import {
	BookOpenIcon as TextIcon,
	CalendarDaysIcon as EventIcon,
	ChevronRightIcon,
	PencilIcon as AuthorIcon,
} from "@heroicons/vue/24/outline";
import { computed } from "vue";

import { type GetCaseStudyTimetableById } from "@/api";
import Centered from "@/components/centered.vue";
import ErrorMessage from "@/components/error-message.vue";
import LoadingIndicator from "@/components/loading-indicator.vue";
import { useCaseStudyEvent } from "@/lib/case-studies/use-case-study-events";
import { useCaseStudyTimeline } from "@/lib/case-studies/use-case-study-timeline.js";
import { getDateRangeLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

const title = "Timeline";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const timelineLib = useCaseStudyTimeline(id);
const eventLib = useCaseStudyEvent(id);

const timeline = computed(() => {
	return timelineLib.caseStudyTimeline.value;
});
const events = computed(() => {
	return eventLib.caseStudyEvents.value;
});
const isLoading = computed(() => {
	return eventLib.isLoading.value || timelineLib.isLoading.value;
});
const isError = computed(() => {
	return eventLib.isError.value || timelineLib.isError.value;
});
const isFetching = computed(() => {
	return eventLib.isFetching.value || timelineLib.isFetching.value;
});
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

		<template v-else>
			<template v-if="isFetching">
				<Centered>
					<LoadingIndicator>Updating timeline...</LoadingIndicator>
				</Centered>
			</template>

			<TabGroup>
				<TabList v-slot="{ selectedIndex }" class="mb-4 flex justify-around border-b">
					<Tab
						v-for="(label, i) in ['All events', 'Case study specific events']"
						:key="label"
						class="rounded-t py-2 px-4 text-sm transition hover:bg-neutral-100"
						:class="{ 'bg-neutral-200': i === selectedIndex }"
					>
						{{ label }}
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<ol
							role="list"
							class="grid items-center gap-6 transition-all"
							style="grid-template-columns: repeat(3, auto)"
							:class="{ 'opacity-50 grayscale': isFetching }"
						>
							<template v-for="(event, i) of timeline" :key="event.id">
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
										v-if="i + 1 < timeline.length"
										class="absolute inset-x-2/4 top-0 bottom-[-1.5rem] -z-10 border border-neutral-300"
									/>
								</div>
								<NuxtLink
									v-if="event.ent_type === 'autor'"
									:href="{
										path: '/explore/search-results',
										query: createSearchFilterParams({
											...defaultSearchFilters,
											author: [event.id],
										}),
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
					</TabPanel>
					<TabPanel>
						<ol
							role="list"
							class="grid items-center gap-6 transition-all"
							style="grid-template-columns: repeat(3, auto)"
							:class="{ 'opacity-50 grayscale': isFetching }"
						>
							<template v-for="(event, i) of Object(events).results" :key="event.id">
								<div class="text-right">
									<span>{{ getDateRangeLabel(event.start_date, event.end_date) }}</span>
								</div>
								<div class="relative h-full min-h-[3rem] w-12">
									<span
										class="absolute top-2/4 left-2/4 h-12 w-12 -translate-x-2/4 -translate-y-2/4 rounded-full border-4 border-white bg-green-500 p-2 text-white shadow"
									>
										<EventIcon />
									</span>
									<div
										v-if="i + 1 < Object(events).results.length"
										class="absolute inset-x-2/4 top-0 bottom-[-1.5rem] -z-10 border border-neutral-300"
									/>
								</div>
								<span>{{ event.description || "No Description" }}</span>
							</template>
						</ol>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</template>
	</div>
</template>
