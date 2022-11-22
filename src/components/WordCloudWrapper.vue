<template>
  <v-card width="100%" color="transparent" :height="isFullScreen ? 'calc(100vh - 4px)' : 500">
    <v-overlay absolute opacity=".2" :value="loading">
      <h1 v-if="loading" class="no-nodes">
        <v-progress-circular indeterminate color="#0F1226" />
      </h1>
      <h1 v-else class="no-nodes">No words found!</h1>
    </v-overlay>
    <v-row v-if="type === 'pie'">
      <template v-for="(filtered, i) in filteredWords">
        <v-col
          v-if="showWords[i]"
          :key="JSON.stringify(filtered) + i"
          :cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
        >
          <pie-chart
            :data="filtered"
            :title="titles[i]"
            :height="isFullScreen ? '100%' : '500px'"
          />
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <template v-for="(filtered, i) in filteredWords">
        <v-col
          v-if="showWords[i]"
          :key="JSON.stringify(filtered) + i"
          :cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
        >
          <word-cloud-beta :data="filtered" :title="titles[i]" />
        </v-col>
      </template>
    </v-row>
    <v-navigation-drawer v-model="drawer" absolute right>
      <v-card :min-height="isFullScreen ? 'calc(100vh - 4px)' : 498">
        <v-btn absolute top right icon style="z-index: 100" @click="drawer = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-card-text>
          <v-checkbox
            v-model="check"
            label="Show all words"
            value="words"
            color="green lighten-1"
          />
          <v-checkbox
            v-model="check"
            label="Show keywords"
            value="keywords"
            color="blue lighten-2"
          />
        </v-card-text>
        <v-container>
          <v-expansion-panels flat accordion>
            <v-expansion-panel
              v-for="(title, i) in ['Keyword occurences', 'All occurences']"
              :key="title"
            >
              <v-expansion-panel-header>
                {{ title }}
                <template #actions>
                  <v-chip small>{{ words[1 - i] ? words[1 - i].length : 0 }}</v-chip>
                  <v-icon> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-list-item v-for="entry in words[1 - i]" :key="entry[0]">
                    <v-list-item-content>
                      <v-list-item-title>{{ entry[0] }}:&nbsp;{{ entry[1] }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-container>
        <v-card-actions>
          <v-btn text absolute bottom right @click="drawer = false"> Close </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
    <v-btn icon absolute top right @click="drawer = true">
      <v-icon> mdi-menu </v-icon>
    </v-btn>
    <fullscreen-button :usecase="usecase" />
    <v-speed-dial
      v-model="speeddial"
      absolute
      top
      left
      direction="bottom"
      transition="slide-y-transition"
    >
      <template #activator>
        <v-btn v-model="speeddial" icon small>
          <v-icon v-if="speeddial"> mdi-close </v-icon>
          <v-icon v-else> mdi-dots-vertical </v-icon>
        </v-btn>
      </template>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="type = 'cloud'" v-on="on">
            <v-icon>mdi-cloud</v-icon>
          </v-btn>
        </template>
        <span>Word Cloud</span>
      </v-tooltip>
      <v-tooltip right transition="slide-x-transition">
        <template #activator="{ on, attrs }">
          <v-btn fab small v-bind="attrs" @click="type = 'pie'" v-on="on">
            <v-icon>mdi-chart-pie</v-icon>
          </v-btn>
        </template>
        <span>Pie Chart</span>
      </v-tooltip>
    </v-speed-dial>
  </v-card>
</template>

<script>
import Gradient from 'javascript-color-gradient';

import FullscreenButton from '@/components/FullscreenButton';
import PieChart from '@/components/PieChart';
import WordCloudBeta from '@/components/WordCloudBeta';
import helpers from '@/helpers';

export default {
  name: 'WordCloudWrapper',
  components: {
    FullscreenButton,
    PieChart,
    WordCloudBeta,
  },
  mixins: [helpers],
  props: ['usecase', 'keyword', 'author', 'passage', 'place', 'height'],
  data: () => ({
    avgProgress: 0,
    filteredWords: [[], []],
    drawer: false,
    loading: true,
    overlay: {
      active: false,
      x: 0,
      y: 0,
      word: '',
    },
    speeddial: false,
    progress: [0, 0],
    check: ['words', 'keywords'],
    titles: ['All Words', 'Keywords'],
    type: 'cloud',
    words: [[], []],
  }),
  computed: {
    maxOccurence() {
      return Math.max(...[...this.words[0], ...this.words[1]].map((word) => word[1])); // this returns the max occurence of all words and keywords
    },
    showWords() {
      return [this.check.includes('words'), this.check.includes('keywords')];
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.loading = 2;
        this.words = [];
        let urls = [
          `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/archiv/nlp-data/?`,
          `${import.meta.env.VITE_APP_MMP_API_BASE_URL}/archiv/kw-stelle/?`,
        ];

        const terms = {
          Author: 'text__autor',
          // Passage: 'id', // not used anymore
          Keyword: 'key_word',
          'Use Case': 'use_case',
          Place: 'text__ort',
        };

        const props = [this.author, this.passage, this.keyword, this.usecase, this.place];

        if (props.some((x) => x)) {
          let j;
          props.forEach((prop, i) => {
            if (prop && prop !== '0') {
              if (i === 1) {
                // passage
                urls = urls.map((url) => `${url}&ids=${prop.toString().split('+').join(',')}`);
              } else {
                if (i > 1) j = i - 1; // because terms is missing an element
                else j = i;
                urls = urls.map((url) => `${url}&${terms[Object.keys(terms)[j]]}=${prop}`);
              }
            }
          });
        } else {
          Object.keys(query).forEach((cat) => {
            if (query[cat] && cat !== 'time') {
              const arr = query[cat].toString().split('+');
              arr.forEach((val) => {
                urls = urls.map((x) => `${x}&${terms[cat]}=${val}`);
              });
            }
          });

          if (query.Passage)
            urls = urls.map((x) => `${x}&ids=${query.Passage.replaceAll('+', ',')}`);

          if (query.time) {
            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              urls = urls.map(
                (x) =>
                  `${x}&start_date=${times[0]}&start_date_lookup=gt&end_date=${times[1]}&end_date_lookup=lt`
              );
            } else {
              urls = urls.map(
                (x) =>
                  `${x}&start_date=${query.time - 5}&start_date_lookup=gt&end_date=${
                    query.time + 4
                  }&end_date_lookup=lt`
              );
            }
          }
        }
        const prefetched = this.$store.state.fetchedResults[urls.toString()];

        if (prefetched) {
          this.handleRes(prefetched);
          this.loading = false;
        } else {
          Promise.all(urls.map((x) => fetch(x)))
            .then((res) => {
              Promise.all(res.map((x) => x.json()))
                .then((jsonRes) => {
                  this.handleRes(jsonRes);
                  this.$store.commit('addToResults', { req: urls.toString(), res: jsonRes });
                })
                .catch((err) => {
                  console.error(err);
                })
                .finally(() => {
                  this.loading -= 1;
                });
            })
            .catch((err) => {
              console.error(err);
            });
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    colorWords(word) {
      const colors = ['#a91a1a', '#3a8d86', '#0c76ce', '#c09000', '#3b823e'];
      const colorGradient = new Gradient();
      colorGradient.setGradient(...colors);

      colorGradient.setMidpoint(20);
      // console.log(colorGradient.getArray());

      return colorGradient.getColor(Math.floor((20 * word[1]) / this.maxOccurence));
    },
    crossRotate(word) {
      if ([this.words[0][0][0], this.words[1][0][0]].includes(word[0])) {
        return 0; // ensures the first word is always horizontal
      }
      switch (Math.floor(Math.random() * 4)) {
        case 2:
          return 0.25;
        case 3:
          return -0.25;
        default:
          return 0;
      }
    },
    handleRes(res) {
      const words = [
        Object.entries(res[0].token_dict),
        res[1].token_dict.map((x) => Object.entries(x)[0]),
      ];

      this.words = words.map((x) => x.sort(this.sortWords));
      for (let i = 0; i < words.length; i += 1) {
        for (let j = 1; words[i].length > 75; j += 1) {
          words[i] = words[i].filter((entry) => entry[0].match(/\w+/g) && entry[1] > j);
        } // improves performance by a lot, removing unused and non words
        words[i] = words[i].map((word) => [word[0].split(' (')[0], word[1]]); // removes unecessary tags
      }
      this.loading -= 1;
      this.filteredWords = words;
    },
    sortWords(a, b) {
      // sorts after occurences, then alphabetically
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    },
  },
};
</script>

<style scoped>
.word-cloud {
  min-height: 500px;
  width: 50%;
}

.full-height {
  height: 100vh !important;
}
</style>
