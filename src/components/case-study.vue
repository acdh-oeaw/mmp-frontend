<script lang="ts" setup>
import { assert } from '@stefanprobst/assert';
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  type CaseStudy,
  type GetCaseStudyTimetableById,
  useCaseStudyById,
  useCaseStudyTimeTableById,
  usePassages,
} from '@/api';
import GeoMap from '@/components/geo-map-wrapper.vue';
import KeywordAuthorTab from '@/components/keyword-author-tab.vue';
import Graph from '@/components/network-graph-wrapper.vue';
import WordCloud from '@/components/word-cloud-wrapper.vue';
import { getDateRangeLabel } from '@/lib/get-label';
import { useVuetify } from '@/lib/use-vuetify';

type EventType = GetCaseStudyTimetableById.Response[number]['ent_type'];

const props = defineProps<{
  id?: CaseStudy['id'];
}>();

const route = useRoute();
const id = computed(() => {
  if (props.id != null) return props.id;
  const id = route.params.id;
  assert(id != null);
  return Number(id);
});

const caseStudyQuery = useCaseStudyById({ id });
const caseStudyTimeTableQuery = useCaseStudyTimeTableById({ id });
const passageQuery = usePassages({ use_case: [id], limit: 200 }); // TODO: proper pagination + infinite scroll

const isLoading = computed(() => {
  return [caseStudyQuery, caseStudyTimeTableQuery, passageQuery].some((query) => {
    return query.isInitialLoading.value;
  });
});

const caseStudy = computed(() => {
  if (caseStudyQuery.data.value == null) return caseStudyQuery.data.value;

  return {
    ...caseStudyQuery.data.value,
    // FIXME: why is this necessary?
    story_map: caseStudyQuery.data.value.story_map?.replaceAll('/explore/', '/view/'),
  };
});
const events = computed(() => {
  return caseStudyTimeTableQuery.data.value ?? [];
});
const passages = computed(() => {
  return passageQuery.data.value?.results ?? [];
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
  <VContainer>
    <VRow justify="center">
      <VCol cols="12" xl="8">
        <template v-if="!isLoading && caseStudy">
          <p class="text-h7 grey--text">
            <VBtn icon plain :to="{ name: 'Case Studies' }">
              <VIcon>mdi-chevron-left</VIcon>
            </VBtn>
            CASE STUDY<span v-if="caseStudy.principal_investigator">
              &nbsp;&nbsp;&bull;&nbsp;&nbsp;{{ caseStudy.principal_investigator }}
            </span>
          </p>

          <p class="text-h4">{{ caseStudy.title }}</p>
          <p v-if="caseStudy.description">{{ caseStudy.description }}</p>
          <VTabs fixed-tabs show-arrows background-color="transparent">
            <VTab exact :to="{ query: { ...route.query, tab: 'timeline' } }"> Timeline </VTab>
            <VTab
              v-if="caseStudy.story_map"
              exact
              :to="{ query: { ...route.query, tab: 'story' } }"
            >
              Story Map
            </VTab>
            <VTab exact :to="{ query: { ...route.query, tab: 'graph' } }">Graph</VTab>
            <VTab exact :to="{ query: { ...route.query, tab: 'map' } }">Map</VTab>
            <VTab exact :to="{ query: { ...route.query, tab: 'cloud' } }">Word Cloud</VTab>
            <VTab exact :to="{ query: { ...route.query, tab: 'texts' } }">Texts & Authors</VTab>
          </VTabs>

          <br />

          <VTabsItems :value="route.query.tab || 'timeline'">
            <VTabItem value="timeline">
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
                      name: 'List',
                      query: { ...route.query, Author: event.id },
                    }"
                  >
                    {{ event.ent_description }}
                    &nbsp;
                    <VIcon>mdi-chevron-right</VIcon>
                  </RouterLink>
                  <span
                    v-else
                    :class="{
                      'font-weight-medium': event.ent_type != 'event',
                    }"
                  >
                    {{ event.ent_description }}
                  </span>
                </VTimelineItem>
              </VTimeline>
            </VTabItem>

            <VTabItem v-if="caseStudy.story_map" value="story">
              <VCard color="transparent">
                <div v-html="caseStudy.story_map" />
              </VCard>
            </VTabItem>

            <VTabItem value="graph">
              <VCard color="transparent">
                <Graph :usecase="id || route.params.id" />
              </VCard>
            </VTabItem>

            <VTabItem value="map">
              <VCard color="transparent">
                <GeoMap :usecase="id || route.params.id" />
              </VCard>
            </VTabItem>

            <VTabItem value="cloud">
              <WordCloud :usecase="id || route.params.id" />
            </VTabItem>

            <VTabItem value="texts">
              <KeywordAuthorTab :passages="passages" />
            </VTabItem>
          </VTabsItems>
        </template>

        <template v-else>
          <VSkeletonLoader type="text@3" />
          <br />
          <VSkeletonLoader type="heading" />
          <br />
          <VSkeletonLoader type="text@50" />
        </template>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style>
.v-timeline-item__body {
  height: inherit;
  margin: auto;
}
</style>
