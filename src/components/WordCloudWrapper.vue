<template>
  <v-card
    width="100%"
    outlined
    color="transparent"
    :height="$route.path.includes('/view/') ? '100vh' : 500"
  >
    <v-overlay
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
      :style="'width:' + $route.path.includes('/view/') ? '100vh' : 500"
      no-gutters
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
            :class="{ 'full-height': $route.path.includes('/view/') }"
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
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
    >
      <v-card>
        <v-btn
          absolute
          top
          right
          icon
          @click="drawer = false"
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
        <v-card-title>Keyword Occurences</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="entry in words[1]" :key="entry[0]">
              {{ entry[0] }}:&nbsp;{{ entry[1] }}
            </li>
          </ul>
        </v-card-text>
        <v-card-title>All Occurences</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="entry in words[0]" :key="entry[0]">
              {{ entry[0] }}:&nbsp;{{ entry[1] }}
            </li>
          </ul>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
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
    <v-btn
      absolute
      bottom
      right
      icon
      :to="{
        name: $route.path.includes('/view/') ? 'Word Cloud' : 'Word Cloud Fullscreen',
        query: usecase ? { 'Use Case': usecase } : $route.query
      }"
    >
      <v-icon v-if="$route.path.includes('/view/')">mdi-fullscreen-exit</v-icon>
      <v-icon v-else>mdi-fullscreen</v-icon>
    </v-btn>
  </v-card>
</template>
<script>
import Gradient from 'javascript-color-gradient';
import WordCloud from 'vuewordcloud';

export default {
  name: 'WordCloudWrapper',
  components: { WordCloud },
  props: ['usecase', 'height'],
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
    progress: [0, 0],
    check: ['words', 'keywords'],
    words: [[], []],
  }),
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
        if (this.usecase) urls = urls.map((x) => `${x}&use_case=${this.usecase}`);
        else {
          const terms = {
            Author: 'text__autor',
            // Passage: 'id', // not used anymore
            Keyword: 'key_word',
            'Use Case': 'use_case',
            Place: 'ort',
          };

          Object.keys(query).forEach((cat) => {
            if (query[cat]) {
              console.log(query[cat]);
              const arr = query[cat].toString(10).split('+');
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
