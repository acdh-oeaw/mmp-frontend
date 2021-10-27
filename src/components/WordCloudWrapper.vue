<template>
  <v-row>
    <v-col>
      <div style="position: relative; overflow-x: hidden">
        <word-cloud
          :words="words"
          :animation-duration="500"
          style="height: 500px"
          @update:progress="updateProgress"
          :key="JSON.stringify(words)"
        >
          <!-- this would show word occurences when hovering over a specific word, but it should looks bad -->
          <!-- <template slot-scope="{ text, weight }">
            <div :title="weight" class="word">
              {{ text }}
            </div>
            <div class="wordHover">{{ text }}: {{ weight }}</div>
          </template> -->
        </word-cloud>
        <v-progress-linear
          :value="progress"
          :active="progress < 100"
        />
        <v-btn
          rounded
          absolute
          top
          right
          @click="drawer = true"
        >
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
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
      </div>
    </v-col>
  </v-row>
</template>
<script>
import WordCloud from 'vuewordcloud';

export default {
  name: 'WordCloudWrapper',
  components: { WordCloud },
  props: ['usecase'],
  data: () => ({
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
      if (!obj) console.log(obj);
      else {
        this.progress = Math.floor((100 * obj.completedWords) / obj.totalWords);
        console.log(this.progress);
      }
    },
  },
  mounted() {
    let address = 'https://mmp.acdh-dev.oeaw.ac.at/archiv/nlp-data/?Filter=Search';
    if (this.usecase) address += `&use_case=${this.usecase}`;
    else {
      const terms = {
        Author: 'text__autor',
        // Passage: 'id', // not used anymore
        Keyword: 'key_word',
        'Use Case': 'use_case',
        // Place: unused,
      };

      const { query } = this.$route;

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
      this.words = Object.entries(prefetched.token_dict).sort(this.sortWords);
      this.loading = false;
    } else {
      fetch(address)
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
          this.$store.commit('addToResults', { req: address, res });
          this.words = Object.entries(res.token_dict).sort(this.sortWords);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
};
</script>
<style scoped>
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
