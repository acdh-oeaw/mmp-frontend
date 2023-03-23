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
import NothingFoundMessage from "@/components/nothing-found-message.vue";
import { useCaseStudyEvent } from "@/lib/case-studies/use-case-study-events";
import { useCaseStudyTimeline } from "@/lib/case-studies/use-case-study-timeline.js";
import { getDateRangeLabel } from "@/lib/get-label";
import { useSearchFilters } from "@/lib/search/use-search-filters";
import { useResourceIdParam } from "@/lib/use-resource-id-param";
import { NuxtLink } from "#components";
import { useHead } from "#imports";

type TimelineEntry = {
	id: number;
	title?: string | null;
	description?: string | null;
	start_date?: number | null;
	end_date?: number | null;
	type: "autor" | "event" | "text";
};

const title = "Timeline";

useHead({
	title,
	meta: [{ property: "og:title", content: title }],
});

const id = useResourceIdParam();
const timeline = useCaseStudyTimeline(id);
const events = useCaseStudyEvent(id);

const timelineEventsOnly = computed(() => {
	return timeline.caseStudyTimeline.value.filter((event) => {
		return event.ent_type === "event";
	});
});

const mergedTimelineEntries = computed(() => {
	const timelineEntries: Array<TimelineEntry> = [];

	events.caseStudyEvents.value.forEach((event) => {
		timelineEntries.push({ ...event, type: "event" });
	});

	timeline.caseStudyTimeline.value.forEach((entry) => {
		if (entry.ent_type === "event") return;

		timelineEntries.push({
			id: entry.id,
			title: entry.ent_title,
			description: entry.ent_description,
			start_date: entry.start_date,
			end_date: entry.end_date,
			type: entry.ent_type,
		});
	});

	return timelineEntries.sort((a, b) => {
		if (b.start_date == null) return 1;
		else if (a.start_date == null) return -1;
		return a.start_date - b.start_date;
	});
});

const isLoading = computed(() => {
	return events.isLoading.value || timeline.isLoading.value;
});
const isError = computed(() => {
	return events.isError.value || timeline.isError.value;
});
const isFetching = computed(() => {
	return events.isFetching.value || timeline.isFetching.value;
});

const emptyTimeline = computed(() => {
	return timeline.isEmpty.value;
});
const emptyEvents = computed(() => {
	return events.isEmpty.value;
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
				<TabList v-slot="{ selectedIndex }" class="my-6 flex justify-around border-b">
					<Tab
						v-for="(label, i) in ['Case study specific events', 'All events']"
						:key="label"
						class="mx-10 w-0 flex-1 rounded-t py-2 px-4 text-sm transition hover:bg-neutral-100 md:mx-24"
						:class="{ 'bg-neutral-200': i === selectedIndex }"
					>
						{{ label }}
					</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<template v-if="emptyEvents">
							<Centered class="pointer-events-none">
								<NothingFoundMessage></NothingFoundMessage>
							</Centered>
						</template>
						<ol
							v-else
							role="list"
							class="grid grid-cols-[fit-content(40%)_fit-content(3rem)_1fr] items-center gap-6 transition-all"
							:class="{ 'opacity-50 grayscale': isFetching }"
						>
							<template v-for="(event, i) of mergedTimelineEntries" :key="event.id">
								<div class="text-right">
									<span>
										{{ getDateRangeLabel(event.start_date, event.end_date) }}
									</span>
								</div>
								<div class="relative h-full min-h-[3rem] w-12">
									<span
										class="absolute top-2/4 left-2/4 h-12 w-12 -translate-x-2/4 -translate-y-2/4 rounded-full border-4 border-white p-2 text-white shadow"
										:class="getEventColor(event.type)"
									>
										<AuthorIcon v-if="event.type === 'autor'" />
										<TextIcon v-else-if="event.type === 'text'" />
										<EventIcon v-else />
									</span>
									<div
										v-if="i + 1 < mergedTimelineEntries.length"
										class="absolute inset-x-2/4 top-0 bottom-[-1.5rem] -z-10 border border-neutral-300"
									/>
								</div>
								<NuxtLink
									v-if="event.type === 'autor'"
									:href="{
										path: '/explore/search-results',
										query: createSearchFilterParams({
											...defaultSearchFilters,
											author: [event.id],
										}),
									}"
								>
									<div
										class="-ml-2 flex w-fit basis-0 items-center rounded p-2 transition hover:bg-neutral-200"
									>
										<span>
											{{ event.title }}
										</span>
										<span>
											<ChevronRightIcon class="ml-2 inline h-5 w-5" />
										</span>
									</div>
								</NuxtLink>
								<span v-else>{{ event.description }}</span>
							</template>
						</ol>
					</TabPanel>
					<TabPanel>
						<template v-if="emptyTimeline">
							<Centered class="pointer-events-none">
								<NothingFoundMessage></NothingFoundMessage>
							</Centered>
						</template>
						<ol
							role="list"
							class="grid grid-cols-[fit-content(40%)_fit-content(3rem)_1fr] items-center gap-6 transition-all"
							:class="{ 'opacity-50 grayscale': isFetching }"
						>
							<template v-for="(event, i) of timelineEventsOnly" :key="event.id">
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
										v-if="i + 1 < timelineEventsOnly.length"
										class="absolute inset-x-2/4 top-0 bottom-[-1.5rem] -z-10 border border-neutral-300"
									/>
								</div>
								<span>{{ event.ent_description || "No Description" }}</span>
							</template>
						</ol>
					</TabPanel>
				</TabPanels>
			</TabGroup>
		</template>
	</div>
</template>
