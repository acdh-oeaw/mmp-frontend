<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <template v-if="!loading">
          <p class="text-h7 grey--text">
            <v-btn icon plain :to="{ name: 'Studies' }">
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
              <v-card color="transparent" v-html="study.story_map" />
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
                <div v-for="author in authors" :key="author.id">
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

<script>
import helpers from '../helpers';
import Graph from './GraphWrapperBeta';
import MapWrapper from './MapWrapper';
import WordCloudWrapper from './WordCloudWrapper';

export default {
  name: 'Studies',
  components: {
    Graph,
    MapWrapper,
    WordCloudWrapper,
  },
  mixins: [helpers],
  props: ['id'],
  data: () => ({
    study: {},
    events: [],
    passages: {},
    loading: true,
  }),
  computed: {
    texts() {
      return this.removeDuplicates(
        this.passages.results.map((passage) => passage.text),
        'id'
      );
    },
    authors() {
      return this.removeDuplicates(this.texts.map((text) => text.autor).flat(1), 'id');
    },
  },
  mounted() {
    const id = this.id || this.$route.params.id;

    const urls = [
      `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/usecase/${id}?format=json`,
      `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/archiv/usecase-timetable-data/${id}`,
      `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/api/stelle/?use_case=${id}&limit=200`, // limit is not ideal, i already created a ticket for the backend to improve this
    ];

    const prefetched = this.$store.state.fetchedResults[urls.toString()];
    if (prefetched) {
      [this.study, this.events] = prefetched;
    } else {
      Promise.all(urls.map((x) => fetch(x)))
        .then((res) => {
          Promise.all(res.map((x) => x.json()))
            .then((jsonRes) => {
              console.log('Study', jsonRes);
              if (jsonRes[0].story_map)
                jsonRes[0].story_map = jsonRes[0].story_map.replaceAll('/explore/', '/view/');
              [this.study, this.events, this.passages] = jsonRes;

              console.log('route', this.$route);
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.loading = false;
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  },
  methods: {
    getTextsByAuthor(authorID) {
      return this.texts.filter((text) => text.autor.map((autor) => autor.id).includes(authorID));
    },
    getPassagesByText(textID) {
      return this.passages.results.filter((passage) => passage.text.id === textID);
    },
    getPassagesByAuthor(authorID) {
      return this.passages.results.filter((passage) =>
        passage.text.autor.map((autor) => autor.id).includes(authorID)
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
