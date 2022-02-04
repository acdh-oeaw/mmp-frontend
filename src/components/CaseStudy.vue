<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <template v-if="!loading">
          <p class="text-h7 grey--text">
            <v-btn
              icon
              plain
              :to="{ name: 'Studies' }"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            CASE STUDY<span v-if="study.principal_investigator">&nbsp;&nbsp;&bull;&nbsp;&nbsp;{{ study.principal_investigator }}</span>
          </p>
          <p class="text-h4">{{ study.title }}</p>
          <p v-if="study.description">{{ study.description }}</p>
          <v-tabs
            v-model="tab"
            fixed-tabs
            background-color="transparent"
          >
            <v-tab key="timeline">
              Timeline
            </v-tab>
            <v-tab v-if="study.story_map" key="story">
              Story Map
            </v-tab>
            <v-tab key="graph">
              Graph
            </v-tab>
            <v-tab key="map">
              Map
            </v-tab>
            <v-tab key="cloud">
              Word Cloud
            </v-tab>
          </v-tabs>
          <br />
          <v-tabs-items v-model="tab">
            <v-tab-item key="timeline">
              <v-timeline :dense="$vuetify.breakpoint.mobile">
                <v-timeline-item
                  v-for="(event, i) in events"
                  :key="`${event.id}&${i}`"
                  large
                  :icon="getIconFromType(event.ent_type).icon"
                  :color="getIconFromType(event.ent_type).color"
                  :class="{ 'text-right': i%2 == 1 && !$vuetify.breakpoint.mobile }"
                >
                  <span
                    class="font-weight-medium"
                    slot="opposite"
                  >
                    {{ renderDates(event.start_date, event.end_date) }}
                  </span>
                  <span
                    class="font-weight-medium"
                    v-if="$vuetify.breakpoint.mobile"
                  >
                    {{ renderDates(event.start_date, event.end_date) }}: <br />
                  </span>
                  <router-link
                    class="font-weight-medium"
                    v-if="event.ent_type === 'autor'"
                    :to="{
                      name: 'List',
                      query: { Author: event.id }
                    }"
                  >
                    {{ event.ent_description }}
                    &nbsp;
                    <v-icon>mdi-chevron-right</v-icon>
                  </router-link>
                  <span
                    v-else
                    :class="{
                      'font-weight-medium': event.ent_type != 'event'
                    }"
                  >
                    {{ event.ent_description }}
                  </span>
                </v-timeline-item>
              </v-timeline>
            </v-tab-item>
            <v-tab-item
              key="story"
              v-if="study.story_map"
            >
              <v-card color="transparent" v-html="study.story_map" />
            </v-tab-item>
            <v-tab-item key="graph">
              <v-card color="transparent">
                <graph :usecase="id || $route.params.id" />
              </v-card>
            </v-tab-item>
            <v-tab-item key="map">
              <v-card color="transparent">
                <map-wrapper :usecase="id || $route.params.id" />
              </v-card>
            </v-tab-item>
            <v-tab-item key="cloud">
              <word-cloud-wrapper :usecase="id || $route.params.id" />
            </v-tab-item>
          </v-tabs-items>
        </template>
        <v-skeleton-loader
          v-else
          type="text, heading, text@11"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable prefer-destructuring */
import Graph from './GraphWrapper';
import MapWrapper from './MapWrapper';
import WordCloudWrapper from './WordCloudWrapper';

export default {
  name: 'Studies',
  data: () => ({
    study: {},
    events: [],
    loading: true,
    tab: 'timeline',
  }),
  props: ['id'],
  components: {
    Graph,
    MapWrapper,
    WordCloudWrapper,
  },
  methods: {
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
  mounted() {
    const id = this.id || this.$route.params.id;

    const urls = [
      `https://mmp.acdh-dev.oeaw.ac.at/api/usecase/${id}?format=json`,
      `https://mmp.acdh-dev.oeaw.ac.at/archiv/usecase-timetable-data/${id}`,
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
              if (jsonRes[0].story_map) jsonRes[0].story_map = jsonRes[0].story_map.replaceAll('/explore/', '/view/');
              [this.study, this.events] = jsonRes;
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
};
</script>

<style>
.v-timeline-item__body {
  height: inherit;
  margin: auto;
}
</style>
