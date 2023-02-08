<script lang="ts" setup>
import { computed } from 'vue';

import type { CaseStudy, GetCaseStudyTimetableById } from '@/api';
import { useCaseStudyTimeTableById } from '@/api';
import { getDateRangeLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useVuetify } from '@/lib/use-vuetify';

type EventType = GetCaseStudyTimetableById.Response[number]['ent_type'];

const props = defineProps<{
	id: CaseStudy['id'];
}>();

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const caseStudyTimeTableQuery = useCaseStudyTimeTableById({ id: props.id });

const _isLoading = computed(() => {
	return caseStudyTimeTableQuery.isInitialLoading.value;
});

const events = computed(() => {
	return caseStudyTimeTableQuery.data.value ?? [];
});

function getIconFromType(type: EventType) {
	const icons = {
		autor: {
			icon: 'mdi-pencil',
			color: 'red',
		},
		event: {
			icon: 'mdi-calendar',
			color: 'green',
		},
		text: {
			icon: 'mdi-book-open-variant',
			color: 'blue',
		},
	};

	return icons[type];
}

const vuetify = useVuetify();
</script>

<template>
	<VTimeline :dense="vuetify.breakpoint.mobile">
		<VTimelineItem
			v-for="(event, i) in events"
			:key="`${event.id}&${i}`"
			large
			:icon="getIconFromType(event.ent_type).icon"
			:color="getIconFromType(event.ent_type).color"
			:class="{ 'text-right': i % 2 == 1 && !vuetify.breakpoint.mobile }"
		>
			<span slot="opposite" class="font-weight-medium">
				{{ getDateRangeLabel(event.start_date, event.end_date) }}
			</span>
			<span v-if="vuetify.breakpoint.mobile" class="font-weight-medium">
				{{ getDateRangeLabel(event.start_date, event.end_date) }}: <br />
			</span>
			<RouterLink
				v-if="event.ent_type === 'autor'"
				class="font-weight-medium"
				:to="{
					name: 'explore-search-results',
					query: createSearchFilterParams({ ...searchFilters, author: [event.id] }),
				}"
			>
				{{ event.ent_description }}
				&nbsp;
				<VIcon>mdi-chevron-right</VIcon>
			</RouterLink>
			<span v-else :class="{ 'font-weight-medium': event.ent_type != 'event' }">
				{{ event.ent_description }}
			</span>
		</VTimelineItem>
	</VTimeline>
</template>
