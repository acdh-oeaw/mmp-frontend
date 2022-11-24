<template>
  <v-card width="100%" color="transparent" :height="fullscreen ? 'calc(100vh - 4px)' : 500">
    <v-overlay absolute opacity=".2" :value="isLoading">
      <h1 v-if="isLoading" class="no-nodes">
        <v-progress-circular indeterminate color="#0F1226" />
      </h1>
      <h1 v-else class="no-nodes">No words found!</h1>
    </v-overlay>
    <v-row v-if="type === 'pie'">
      <template v-for="(filtered, i) in data.filteredWords">
        <v-col
          v-if="showWords[i]"
          :key="JSON.stringify(filtered) + i"
          :cols="showWords.filter((x) => x).length >= 2 ? 6 : 12"
        >
          <pie-chart :data="filtered" :title="titles[i]" :height="fullscreen ? '100%' : '500px'" />
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <template v-for="(filtered, i) in data.filteredWords">
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
      <v-card :min-height="fullscreen ? 'calc(100vh - 4px)' : 498">
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
                  <v-chip small>{{ data.words[1 - i] ? data.words[1 - i].length : 0 }}</v-chip>
                  <v-icon> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-list-item v-for="entry in data.words[1 - i]" :key="entry[0]">
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
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassageKeywords, usePassageNlpData } from '@/api';
import helpers from '@/helpers';
import { isNotNullable } from '@/lib/is-not-nullable';

import FullscreenButton from './FullscreenButton';
import PieChart from './PieChart';
import WordCloudBeta from './WordCloudBeta';

export default {
  name: 'WordCloudWrapper',
  components: {
    // WordCloud,
    FullscreenButton,
    PieChart,
    WordCloudBeta,
  },
  mixins: [helpers],
  props: ['author', 'passage', 'keyword', 'usecase', 'place', 'height'],
  setup(props) {
    const route = useRoute();
    const searchFilters = computed(() => {
      // FIXME:
      if (Object.values(props).some(isNotNullable)) {
        return {
          ids: props.passage?.toString().split('+').join(','),
          text__autor: props.author,
          key_word: props.keyword,
          use_case: props.usecase,
          text__ort: props.place,
        };
      }

      function getDateFilters() {
        if (route.query['time'] == null) return {};

        const [start, end] = route.query['time'].toString().includes('+')
          ? route.query['time'].split('+')
          : [route.query['time'] - 5, route.query['time'] + 4];

        const dateFilters = {
          start_date: start,
          start_date_lookup: 'gt',
          end_date: end,
          end_date_lookup: 'lt',
        };

        return dateFilters;
      }

      return {
        ids: route.query['Passage']?.toString().split('+').join(','),
        text__autor: route.query['Author']?.toString().split('+'),
        key_word: route.query['Keyword']?.toString().split('+'),
        use_case: route.query['Use Case']?.toString().split('+'),
        text__ort: route.query['Place']?.toString().split('+'),
        ...getDateFilters(),
      };
    });

    const passageNlpDataQuery = usePassageNlpData(searchFilters);
    const passageKeywordsQuery = usePassageKeywords(searchFilters);

    const isLoading = computed(() => {
      return [passageNlpDataQuery, passageKeywordsQuery].some((query) => {
        return query.isInitialLoading.value;
      });
    });

    const data = computed(() => {
      // TODO: check this

      const nlpData = passageNlpDataQuery.data.value;
      const keywords = passageKeywordsQuery.data.value;

      if (nlpData == null || keywords == null) {
        return { words: [[], []], filteredWords: [[], []] };
      }

      const allWords = [
        Object.entries(nlpData.token_dict),
        keywords.token_dict.map((x) => Object.entries(x)[0]),
      ];

      function sortWords(a, b) {
        // sorts after occurences, then alphabetically
        if (a[1] < b[1]) return 1;
        if (a[1] > b[1]) return -1;
        if (a[0] > b[0]) return 1;
        if (a[0] < b[0]) return -1;
        return 0;
      }

      const words = allWords.map((x) => x.sort(sortWords));

      for (let i = 0; i < allWords.length; i += 1) {
        // improves performance by a lot, removing unused and non words
        for (let j = 1; allWords[i].length > 75; j += 1) {
          allWords[i] = allWords[i].filter((entry) => entry[0].match(/\w+/g) && entry[1] > j);
        }
        // removes unecessary tags
        allWords[i] = allWords[i].map((word) => [word[0].split(' (')[0], word[1]]);
      }

      return { words, filteredWords: allWords };
    });

    return {
      isLoading,
      data,
    };
  },
  data: () => ({
    avgProgress: 0,
    drawer: false,
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
  }),
  computed: {
    maxOccurence() {
      return Math.max(...[...this.words[0], ...this.words[1]].map((word) => word[1])); // this returns the max occurence of all words and keywords
    },
    showWords() {
      return [this.check.includes('words'), this.check.includes('keywords')];
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
