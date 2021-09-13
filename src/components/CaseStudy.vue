<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8">
        <template v-if="!loading">
          <p class="study-surtitle"></p>
          <p class="text-h7 study-surtitle">
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
          <v-timeline>
            <v-timeline-item
              v-for="event in events"
              :key="event.id"
              large
              :icon="getIconFromType(event.ent_type).icon"
              :color="getIconFromType(event.ent_type).color"
            >
              <span slot="opposite">{{ renderDates(event.start_date, event.end_date) }}</span>
              {{ event.ent_description }}
            </v-timeline-item>
          </v-timeline>
        </template>
        <v-skeleton-loader v-else type="text, heading, text@11" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
/* eslint-disable prefer-destructuring */
export default {
  name: 'Studies',
  data: () => ({
    study: {},
    events: [],
    loading: true,
  }),
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
    const urls = [
      `https://mmp.acdh-dev.oeaw.ac.at/api/usecase/${this.$route.params.id}?format=json`,
      `https://mmp.acdh-dev.oeaw.ac.at/archiv/usecase-timetable-data/${this.$route.params.id}`,
    ];

    Promise.all(urls.map((x) => fetch(x)))
      .then((res) => {
        Promise.all(res.map((x) => x.json()))
          .then((jsonRes) => {
            console.log('Study', jsonRes);
            this.study = jsonRes[0];
            this.events = jsonRes[1];
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            this.loading = false;
          });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<style>
.v-timeline-item:nth-child(even) {
  text-align: right;
}
.v-timeline-item__body {
  height: inherit;
  margin: auto;
}
</style>
