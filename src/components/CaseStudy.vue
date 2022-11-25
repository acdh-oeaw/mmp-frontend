<script lang="ts" setup>
import { groupBy } from '@stefanprobst/group-by';
import { keyBy } from '@stefanprobst/key-by';
import { values } from '@stefanprobst/object';
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import {
  type CaseStudy,
  type GetCaseStudyTimetableById,
  useCaseStudyById,
  useCaseStudyTimeTableById,
  usePassages,
} from '@/api';
import Graph from '@/components/GraphWrapperBeta.vue';
import MapWrapper from '@/components/MapWrapper.vue';
import WordCloudWrapper from '@/components/WordCloudWrapper.vue';
import { getAuthorLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';

type EventType = GetCaseStudyTimetableById.Response[number]['ent_type'];

const props = defineProps<{
  id: CaseStudy['id'];
}>();

const route = useRoute();
const { searchFilters, createSearchFilterParams } = useSearchFilters();
const id = computed(() => props.id ?? route.params.id);

const caseStudyQuery = useCaseStudyById({ id });
const caseStudyTimeTableQuery = useCaseStudyTimeTableById({ id });
// TODO: limit is not ideal here
const passagesQuery = usePassages({ use_case: [id], limit: 200 });

const isLoading = computed(() => {
  return [caseStudyQuery, caseStudyTimeTableQuery, passagesQuery].some(
    (query) => query.isInitialLoading.value
  );
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
  return caseStudyTimeTableQuery.data.value;
});

const passages = computed(() => {
  return passagesQuery.data.value?.results ?? [];
});

// TODO: check if passage.text really is optional
const passagesWithText = computed(() => {
  return passages.value?.filter((passage) => passage.text != null);
});

const textsById = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const texts = passagesWithText.value?.map((passage) => passage.text!);
  return keyBy(texts, (text) => text.id);
});

const authorsById = computed(() => {
  const authors = values(textsById.value)?.flatMap((text) => text.autor);
  return keyBy(authors, (author) => author.id);
});

const passagesByAuthor = computed(() => {
  return groupBy(passagesWithText.value, (passage) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return passage.text!.autor.map((author) => author.id);
  });
});

const passagesByText = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return groupBy(passagesWithText.value, (passage) => passage.text!.id);
});

const textsByAuthor = computed(() => {
  return groupBy(values(textsById.value), (text) => text.autor.map((author) => author.id));
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

function renderDates(start: number, end: number) {
  const startDate = start < 0 ? `${start} BC` : `${start} AD`;
  const endDate = end < 0 ? `${end} BC` : `${end} AD`;

  if (startDate === endDate) {
    return startDate;
  }

  return [startDate, endDate].join(' - ');
}
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <template v-if="!isLoading">
          <p class="text-h7 grey--text">
            <v-btn icon plain :to="{ name: 'Case Studies' }">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            CASE STUDY<span v-if="caseStudy?.principal_investigator"
              >&nbsp;&nbsp;&bull;&nbsp;&nbsp;{{ caseStudy.principal_investigator }}</span
            >
          </p>
          <p class="text-h4">{{ caseStudy?.title }}</p>
          <p v-if="caseStudy?.description">{{ caseStudy.description }}</p>
          <v-tabs fixed-tabs show-arrows background-color="transparent">
            <v-tab exact :to="{ query: { ...$route.query, tab: 'timeline' } }"> Timeline </v-tab>
            <v-tab
              v-if="caseStudy?.story_map"
              exact
              :to="{ query: { ...$route.query, tab: 'story' } }"
            >
              Story Map
            </v-tab>
            <v-tab exact :to="{ query: { ...$route.query, tab: 'graph' } }"> Graph </v-tab>
            <v-tab exact :to="{ query: { ...$route.query, tab: 'map' } }"> Map </v-tab>
            <v-tab exact :to="{ query: { ...$route.query, tab: 'cloud' } }"> Word Cloud </v-tab>
            <v-tab exact :to="{ query: { ...$route.query, tab: 'texts' } }">
              Texts & Authors
            </v-tab>
          </v-tabs>
          <br />
          <v-tabs-items :value="$route.query.tab || 'timeline'">
            <v-tab-item value="timeline">
              <v-timeline :dense="$vuetify.breakpoint.mobile">
                <v-timeline-item
                  v-for="(event, i) in events"
                  :key="`${event.id}&${i}`"
                  large
                  :icon="getIconFromType(event.ent_type).icon"
                  :color="getIconFromType(event.ent_type).color"
                  :class="{ 'text-right': i % 2 == 1 && !$vuetify.breakpoint.mobile }"
                >
                  <span slot="opposite" class="font-weight-medium">
                    {{ renderDates(event.start_date, event.end_date) }}
                  </span>
                  <span v-if="$vuetify.breakpoint.mobile" class="font-weight-medium">
                    {{ renderDates(event.start_date, event.end_date) }}: <br />
                  </span>
                  <router-link
                    v-if="event.ent_type === 'autor'"
                    class="font-weight-medium"
                    :to="{
                      name: 'List',
                      query: createSearchFilterParams({ ...searchFilters, author: [event.id] }),
                    }"
                  >
                    {{ event.ent_description }}
                    &nbsp;
                    <v-icon>mdi-chevron-right</v-icon>
                  </router-link>
                  <span
                    v-else
                    :class="{
                      'font-weight-medium': event.ent_type != 'event',
                    }"
                  >
                    {{ event.ent_description }}
                  </span>
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>
            <v-tab-item v-if="caseStudy?.story_map" value="story">
              <v-card color="transparent">
                <div v-html="caseStudy.story_map" />
              </v-card>
            </v-tab-item>
            <v-tab-item value="graph">
              <v-card color="transparent">
                <graph :usecase="id || $route.params.id" />
              </v-card>
            </v-tab-item>
            <v-tab-item value="map">
              <v-card color="transparent">
                <map-wrapper :usecase="id || $route.params.id" />
              </v-card>
            </v-tab-item>
            <v-tab-item value="cloud">
              <word-cloud-wrapper :usecase="id || $route.params.id" />
            </v-tab-item>
            <v-tab-item value="texts">
              <v-list color="transparent">
                <div v-for="author of authorsById" :key="author.id">
                  <v-list-group prepend-icon="mdi-account-edit">
                    <template #activator>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ getAuthorLabel(author) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ textsByAuthor[author.id]?.length }}
                            <span>
                              text{{ textsByAuthor[author.id]?.length === 1 ? '' : 's' }} and
                            </span>
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            {{ passagesByAuthor[author.id]?.length }}
                            <span>
                              passage{{ passagesByAuthor[author.id]?.length === 1 ? '' : 's' }}
                            </span>
                            found in this case study
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <v-list-group
                      v-for="text in textsByAuthor[author.id]"
                      :key="text.id"
                      :ripple="false"
                      prepend-icon="mdi-book-open-variant"
                      sub-group
                      no-action
                    >
                      <template #activator>
                        <v-list-item>
                          <v-list-item-content>
                            <v-list-item-title>
                              {{ text.title }}
                            </v-list-item-title>
                            <v-list-item-subtitle>
                              {{ passagesByText[text.id]?.length }} passage{{
                                passagesByText[text.id]?.length === 1 ? '' : 's'
                              }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <v-list-item
                        v-for="passage in passagesByText[text.id]"
                        :key="passage.id"
                        :to="{
                          name: 'List',
                          query: createSearchFilterParams({
                            ...searchFilters,
                            passage: [passage.id],
                          }),
                        }"
                        prepend-icon="mdi-format-quote-close"
                      >
                        {{ passage.display_label }}
                      </v-list-item>
                    </v-list-group>
                  </v-list-group>
                  <v-divider inset />
                </div>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </template>
        <v-skeleton-loader v-else type="text, heading, text@11" />
      </v-col>
    </v-row>
  </v-container>
</template>

<style>
.v-timeline-item__body {
  height: inherit;
  margin: auto;
}
</style>
