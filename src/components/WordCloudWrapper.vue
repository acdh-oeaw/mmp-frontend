<template>
  <v-card
    height="500"
    width="100%"
    outlined
    color="transparent"
  >
    <v-overlay
      absolute
      opacity=".2"
      :value="loading || progress < 100 || !filteredWords.length"
      z-index="99"
    >
    <h1 v-if="progress < 100 && words.length" class="no-nodes">
      <v-progress-circular
        :value="progress"
        :indeterminate="loading"
        :active="progress < 100"
        color="#0F1226"
      />
    </h1>
    <h1 v-if="!words.length && !loading" class="no-nodes">
      No words found!
    </h1>
    </v-overlay>
    <v-btn
      rounded
      absolute
      top
      right
      @click="drawer = true"
      style="z-index: 100"
    >
      <v-icon>
        mdi-menu
      </v-icon>
    </v-btn>
    <word-cloud
      :words="filteredWords"
      :animation-duration="500"
      class="cloud"
      @update:progress="updateProgress"
    >
      <!-- this would show word occurences when hovering over a specific word, but it looks bad -->
      <!-- <template slot-scope="{ text, weight }">
        <div :title="weight" class="word">
          {{ text }}
        </div>
        <div class="wordHover">{{ text }}: {{ weight }}</div>
      </template> -->
    </word-cloud>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      style="z-index: 101"
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
        <v-card-title>Occurences</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="entry in words" :key="entry[0]">
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
  </v-card>
</template>
<script>
import WordCloud from 'vuewordcloud';

export default {
  name: 'WordCloudWrapper',
  components: { WordCloud },
  props: ['usecase'],
  data: () => ({
    filteredWords: [],
    drawer: false,
    loading: true,
    overlay: {
      active: false,
      x: 0,
      y: 0,
      word: '',
    },
    progress: 0,
    words: [],
  }),
  methods: {
    sortWords(a, b) { // sorts after occurences, then alphabetically
      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
      if (a[0] > b[0]) return 1;
      if (a[0] < b[0]) return -1;
      return 0;
    },
    updateProgress(obj) {
      if (obj) {
        this.progress = Math.floor((100 * obj.completedWords) / obj.totalWords);
        // console.log(this.progress, this.filteredWords.length, this.loading);
      }
    },
  },
  watch: {
    '$route.query': {
      handler(query) {
        this.loading = true;
        this.words = [];
        let address = 'https://mmp.acdh-dev.oeaw.ac.at/archiv/nlp-data/?Filter=Search';
        if (this.usecase) address += `&use_case=${this.usecase}`;
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
                address += `&${terms[cat]}=${val}`;
              });
            }
          });

          if (query.Passage) address += `&ids=${query.Passage.replaceAll('+', ',')}`;

          if (query.time) {
            if (query.time.toString().includes('+')) {
              const times = query.time.split('+');
              address += `&start_date=${times[0]}&start_date_lookup=lt`;
              address += `&end_date=${times[1]}&end_date_lookup=gt`;
            } else {
              address += `&start_date=${query.time - 5}&start_date_lookup=lt`;
              address += `&end_date=${query.time + 4}&end_date_lookup=gt`;
            }
          }

          console.log('address', address);
        }
        const prefetched = this.$store.state.fetchedResults[address];

        if (prefetched) {
          this.filteredWords = prefetched;
          this.loading = false;
        } else {
          fetch(address)
            .then((res) => res.json())
            .then((res) => {
              console.log('word cloud res', res);
              let words = Object.entries(res.token_dict);
              this.words = words.sort(this.sortWords);
              for (let i = 1; words.length > 200; i += 1) words = words.filter((entry) => entry[1] > i); // improves performance by a lot
              words = words.sort(this.sortWords);
              this.filteredWords = words;
              this.$store.commit('addToResults', { req: address, words });
            })
            .catch((err) => {
              console.error(err);
            })
            .finally(() => {
              this.loading = false;
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
.cloud {
  height: 500px;
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
  z-index: 100;
}
.word:hover + div.wordHover {
  display: unset;
} */
</style>
