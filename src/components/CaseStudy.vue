<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <template v-if="!isLoading">
          <p class="text-h7 grey--text">
            <v-btn icon plain :to="{ name: 'Case Studies' }">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            CASE STUDY<span v-if="study.principal_investigator"
              >&nbsp;&nbsp;&bull;&nbsp;&nbsp;{{ study.principal_investigator }}</span
            >
          </p>
          <p class="text-h4">{{ study.title }}</p>
          <p v-if="study.description">{{ study.description }}</p>
          <v-tabs fixed-tabs show-arrows background-color="transparent">
            <v-tab exact :to="{ query: addParamsToQuery({ tab: 'timeline' }) }"> Timeline </v-tab>
            <v-tab v-if="study.story_map" exact :to="{ query: addParamsToQuery({ tab: 'story' }) }">
              Story Map
            </v-tab>
            <v-tab exact :to="{ query: addParamsToQuery({ tab: 'graph' }) }"> Graph </v-tab>
            <v-tab exact :to="{ query: addParamsToQuery({ tab: 'map' }) }"> Map </v-tab>
            <v-tab exact :to="{ query: addParamsToQuery({ tab: 'cloud' }) }"> Word Cloud </v-tab>
            <v-tab exact :to="{ query: addParamsToQuery({ tab: 'texts' }) }">
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
                      query: addParamsToQuery({ Author: event.id }),
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
            <v-tab-item v-if="study.story_map" value="story">
              <v-card color="transparent">
                <div v-html="study.story_map" />
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
                <div v-for="author in removeDuplicates(authors, 'id')" :key="author.id">
                  <v-list-group prepend-icon="mdi-account-edit">
                    <template #activator>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>
                            {{ getOptimalName(author) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ getTextsByAuthor(author.id).length }}
                            text{{ getTextsByAuthor(author.id).length === 1 ? '' : 's' }} and
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            {{ getPassagesByAuthor(author.id).length }} passage{{
                              getPassagesByAuthor(author.id).length === 1 ? '' : 's'
                            }}
                            found in this case study
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                    <v-list-group
                      v-for="text in getTextsByAuthor(author.id)"
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
                              {{ getPassagesByText(text.id).length }} passage{{
                                getPassagesByText(text.id).length === 1 ? '' : 's'
                              }}
                            </v-list-item-subtitle>
                          </v-list-item-content>
                        </v-list-item>
                      </template>
                      <v-list-item
                        v-for="passage in getPassagesByText(text.id)"
                        :key="passage.id"
                        :to="{
                          name: 'List',
                          query: addParamsToQuery({ Passage: passage.id }),
                        }"
                        prepend-icon="mdi-format-quote-close"
                      >
                        {{ passage.display_label }}
                        <v-icon>mdi-chevron-right</v-icon>
                      </v-list-item>
                    </v-list-group>
                  </v-list-group>
                  <v-divider inset />
                </div>
              </v-list>
            </v-tab-item>
          </v-tabs-items>
        </template>
        <template v-else>
          <v-skeleton-loader type="text@3" />
          <br />
          <v-skeleton-loader type="heading" />
          <br />
          <v-skeleton-loader type="text@50" />
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useCaseStudyById, useCaseStudyTimeTableById, usePassages } from '@/api';
import Graph from '@/components/GraphWrapper.vue';
import MapWrapper from '@/components/MapWrapper.vue';
import WordCloudWrapper from '@/components/WordCloudWrapper.vue';
import helpers from '@/helpers';
import { isNotNullable } from '@/lib/is-not-nullable';

export default {
  name: 'CaseStudy',
  components: {
    Graph,
    MapWrapper,
    WordCloudWrapper,
  },
  mixins: [helpers],
  props: ['id'],
  setup(props) {
    const route = useRoute();
    const id = computed(() => props.id ?? route.params.id);

    const caseStudyQuery = useCaseStudyById({ id });
    const caseStudyTimeTableQuery = useCaseStudyTimeTableById({ id });

    const passageQuery = usePassages({ use_case: id, limit: 200 }); // limit is not ideal here, TODO:

    const isLoading = computed(() => {
      return [caseStudyQuery, caseStudyTimeTableQuery, passageQuery].some(
        (query) => query.isInitialLoading.value
      );
    });

    const study = computed(() => {
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

    const texts = computed(() => {
      return passages.value.map((passage) => passage.text).filter(isNotNullable);
    });

    const authors = computed(() => {
      return texts.value.flatMap((text) => text.autor);
    });

    return {
      isLoading,
      study,
      events,
      passages,
      texts,
      authors,
    };
  },
  methods: {
    getTextsByAuthor(authorID) {
      return this.removeDuplicates(this.texts, 'id').filter((text) =>
        text.autor.map((autor) => autor.id).includes(authorID)
      );
    },
    getPassagesByText(textID) {
      return this.passages.filter((passage) => passage.text?.id === textID);
    },
    getPassagesByAuthor(authorID) {
      return this.passages.filter((passage) =>
        passage.text?.autor.map((autor) => autor.id).includes(authorID)
      );
    },
    removeDatesFromTitle(title) {
      const ret = title.split(' ');
      ret.shift();
      return ret.join(' ');
    },
    getIconFromType(type) {
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
    },
    renderDates(start, end) {
      if (start === end) return `${start} A.D.`;
      if (start && end) return `${start} - ${end} A.D.`;
      return `${start || end} A.D.`;
    },
  },
};
</script>

<style>
.v-timeline-item__body {
  height: inherit;
  margin: auto;
}
</style>
