<template>
  <v-card
    width="100%"
    outlined
    color="transparent"
    :height="fullscreen ? 'calc(100vh - 4px)' : 500"
  >
    <v-overlay
      v-if="false"
      absolute
      opacity=".2"
      :value="loading || avgProgress < 100 || !filteredWords.some((x) => x.length)"
    >
      <h1 v-if="avgProgress < 100 && filteredWords.some((x) => x.length)" class="no-nodes">
        <v-progress-circular
          :value="avgProgress"
          :indeterminate="loading"
          :active="avgProgress < 100 || loading"
          color="#0F1226"
        />
      </h1>
      <h1 v-if="!loading && !filteredWords.some((x) => x.length)" class="no-nodes">
        No words found!
      </h1>
    </v-overlay>
    <v-row
      no-gutters
      v-if="type === 'cloud'"
    >
      <template v-for="filtered, i in filteredWords">
        <v-col v-if="showWords[i] && filtered.length"  :key="JSON.stringify(filtered) + i">
          <word-cloud
            :words="filtered"
            :animation-duration="500"
            :spacing=".08"
            font-family="'Roboto', sans-serif"
            @update:progress="updateProgress($event, i)"
            :rotation="crossRotate"
            :color="colorWords"
            class="word-cloud"
            :class="{ 'full-height': fullscreen }"
          >
            <!-- this would show word occurences when hovering over a specific word, but it looks bad -->
            <!-- <template slot-scope="{ text, weight }">
              <div :title="weight" class="word">
                {{ text }}
              </div>
              <div class="wordHover">{{ text }}: {{ weight }}</div>
            </template> -->
          </word-cloud>
        </v-col>
      </template>
    </v-row>
    <v-row v-else-if="type === 'pie'">
      <template v-for="filtered, i in filteredWords">
        <v-col
          v-if="showWords[i]"
          :key="JSON.stringify(filtered) + i"
          :cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
        >
          <pie-chart
            :data="filtered"
            :title="['All Occurences', 'Keyword Occurences'][i]"
            :height="fullscreen ? '100%' : '500px'"
          />
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <template v-for="filtered, i in filteredWords">
        <v-col
          v-if="showWords[i]"
          :key="JSON.stringify(filtered) + i"
          :cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
        >
          <word-cloud-beta :data="filtered" :title="['All Occurences', 'Keyword Occurences'][i]" />
        </v-col>
      </template>
    </v-row>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
    >
      <v-card :min-height="fullscreen ? 'calc(100vh - 4px)': 498">
        <v-btn
          absolute
          top
          right
          icon
          @click="drawer = false"
          style="z-index: 100"
        >
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
          <v-expansion-panels
            flat
            accordion
          >
            <v-expansion-panel v-for="title, i in ['Keyword occurences', 'All occurences']" :key="title">
              <v-expansion-panel-header>
                {{ title }}
                <template v-slot:actions>
                  <v-chip
                    small
                  >{{ words[1-i] ? words[1-i].length : 0 }}</v-chip>
                  <v-icon>
                    $expand
                  </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-list-item v-for="entry in words[1-i]" :key="entry[0]">
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
          <v-btn
            text
            absolute
            bottom
            right
            @click="drawer = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-navigation-drawer>
    <v-btn
      icon
      absolute
      top
      right
      @click="drawer = true"
    >
      <v-icon>
        mdi-menu
      </v-icon>
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
      <template v-slot:activator>
        <v-btn
          v-model="speeddial"
          icon
          small
        >
          <v-icon v-if="speeddial">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-dots-vertical
          </v-icon>
        </v-btn>
      </template>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click="type = 'cloud'"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-cloud</v-icon>
          </v-btn>
        </template>
        <span>Word Cloud</span>
      </v-tooltip>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            small
            @click="type = 'pie'"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-chart-pie</v-icon>
          </v-btn>
        </template>
        <span>Pie Chart</span>
      </v-tooltip>
      <v-tooltip
        right
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="secondary"
            fab
            small
            @click="type = 'beta'"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-cloud-alert</v-icon>
          </v-btn>
        </template>
        <span>Word Cloud Beta</span>
      </v-tooltip>
    </v-speed-dial>
  </v-card>
</template>
<script>
import Gradient from 'javascript-color-gradient';
import WordCloud from 'vuewordcloud';

import helpers from '@/helpers';
import PieChart from './PieChart';
import WordCloudBeta from './WordCloudBeta';
import FullscreenButton from './FullscreenButton';

export default {
  name: 'WordCloudWrapper',
  components: {
    WordCloud, FullscreenButton, PieChart, WordCloudBeta,
  },
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
    type: 'cloud',
    words: [[], []],
  }),
  mixins: [helpers],
  methods: {
    colorWords(word) {
      const colors = [
        '#a91a1a',
        '#3a8d86',
        '#0c76ce',
        '#c09000',
        '#3b823e',
      ];
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
      console.log('word cloud res', res);
      const words = [
        Object.entries(res[0].token_dict),
        res[1].token_dict.map((x) => Object.entries(x)[0]),
      ];

      console.log('words', words);
      this.words = words.map((x) => x.sort(this.sortWords));
      console.log('this.words', this.words);
      for (let i = 0; i < words.length; i += 1) {
        for (let j = 1; words[i].length > 75; j += 1) words[i] = words[i].filter((entry) => entry[1] > j); // improves performance by a lot
      }
      console.log('words', words);

      this.filteredWords = words;
    },
    sortWords(a, b) { // sorts after occurences, then alphabetically
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    },
    updateProgress(obj, i) {
      if (obj) {
        this.progress[i] = Math.floor((100 * obj.completedWords) / obj.totalWords);
        this.avgProgress = Math.floor((this.progress[0] + this.progress[1]) / this.progress.filter((x) => x.length).length);
        // console.log('progress', this.progress, this.filteredWords.length, obj);
      }
    },
  },
  computed: {
    maxOccurence() {
      console.log();
      return Math.max(...[...this.words[0], ...this.words[1]].map((word) => word[1])); // this returns the max occurence of all words and keywords
    },
    showWords() {
      return [
        this.check.includes('words'),
        this.check.includes('keywords'),
      ];
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.loading = true;
        this.words = [];
        let urls = [
          'https://mmp.acdh-dev.oeaw.ac.at/archiv/nlp-data/?',
          'https://mmp.acdh-dev.oeaw.ac.at/archiv/kw-stelle/?',
        ];

        const terms = {
          Author: 'text__autor',
          // Passage: 'id', // not used anymore
          Keyword: 'key_word',
          'Use Case': 'use_case',
          Place: 'ort',
        };

        const props = [
          this.author,
          this.passage,
          this.keyword,
          this.usecase,
          this.place,
        ];

        console.log('map props', props);

        if (props.some((x) => x)) {
          console.debug('cloud props detected!');
          let j;
          props.forEach((prop, i) => {
            if (prop && prop !== '0') {
              console.debug('cloud prop', prop);
              if (i === 1) { // passage
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
              console.log(query[cat]);
              const arr = query[cat].toString().split('+');
              arr.forEach((val) => {
                urls = urls.map((x) => `${x}&${terms[cat]}=${val}`);
              });
            }
          });

          if (query.Passage) urls = urls.map((x) => `${x}&ids=${query.Passage.replaceAll('+', ',')}`);

          if (query.time) {
            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              urls = urls.map((x) => `${x}&start_date=${times[0]}&start_date_lookup=lt&end_date=${times[1]}&end_date_lookup=gt`);
            } else {
              urls = urls.map((x) => `${x}&start_date=${query.time - 5}&start_date_lookup=lt&end_date=${query.time + 4}&end_date_lookup=gt`);
            }
          }
          console.log('urls', urls);
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
                  this.loading = false;
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
/* .graph-tooltip {
  position: absolute;
    transform: translate(-50%, 25px);
    font-family: sans-serif;
    font-size: 16px;
    padding: 4px;
    border-radius: 3px;
    color: #eee;
    background: rgba(0,0,0,0.65);
    visibility: hidden;
}
.word {
  cursor: pointer;
}
.wordHover {
  display: none;
  position: absolute;
  background: white;
  font-size: 2rem;
}
.word:hover + div.wordHover {
  display: unset;
} */
</style>
