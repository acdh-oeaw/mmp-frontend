<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassageKeywords, usePassageNlpData } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import PieChart from '@/components/PieChart.vue';
import WordCloudBeta from '@/components/WordCloudBeta.vue';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  author: any;
  passage: any;
  keyword: any;
  usecase: any;
  place: any;
  height: any;
}>();

const route = useRoute();

const searchFilters = computed(() => {
  if (Object.values(props).some(isNotNullable)) {
    return {
      ids: String(props.passage).split('+').join(),
      text__autor: props.author,
      key_word: props.keyword,
      use_case: props.usecase,
      text__ort: props.place,
    };
  }

  function getDateFilters() {
    if (route.query['time'] == null) return {};

    const [start, end] = String(route.query['time']).includes('+')
      ? String(route.query['time']).split('+')
      : [Number(route.query['time']) - 5, Number(route.query['time']) + 4];

    const dateFilters = {
      start_date: start,
      start_date_lookup: 'gt',
      end_date: end,
      end_date_lookup: 'lt',
    };

    return dateFilters;
  }

  return {
    ids: route.query['Passage']?.toString().split('+').join(),
    text__autor: route.query['Author']?.toString().split('+').map(Number),
    key_word: route.query['Keyword']?.toString().split('+').map(Number),
    use_case: route.query['Use Case']?.toString().split('+').map(Number),
    text__ort: route.query['Place']?.toString().split('+').map(Number),
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
  const nlpData = passageNlpDataQuery.data.value;
  const keywords = passageKeywordsQuery.data.value;

  if (nlpData == null || keywords == null) {
    return { words: [[], []], filteredWords: [[], []] };
  }

  const allWords = [
    Object.entries(nlpData.token_dict),
    keywords.token_dict.map((x) => Object.entries(x)[0]),
  ];

  function sortWords(a: any, b: any) {
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
    // @ts-expect-error Add types.
    for (let j = 1; allWords[i].length > 75; j += 1) {
      // @ts-expect-error Add types.
      allWords[i] = allWords[i].filter((entry) => entry[0].match(/\w+/g) && entry[1] > j);
    }
    // removes unecessary tags
    // @ts-expect-error Add types.
    allWords[i] = allWords[i].map((word) => [word[0].split(' (')[0], word[1]]);
  }

  return { words, filteredWords: allWords };
});

const drawer = ref(false);
const speeddial = ref(false);
const check = ref(['words', 'keywords']);
const titles = ['All Words', 'Keywords'];
const type = ref('cloud');

const showWords = computed(() => {
  return [check.value.includes('words'), check.value.includes('keywords')];
});

const isFullScreen = useFullScreen();
</script>

<template>
  <v-card width="100%" color="transparent" :height="isFullScreen ? 'calc(100vh - 4px)' : 500">
    <v-overlay
      absolute
      opacity=".2"
      :value="isLoading || !Object.values(data.filteredWords).some((x) => x.length)"
    >
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
          <pie-chart
            :data="filtered"
            :title="titles[i]"
            :height="isFullScreen ? '100%' : '500px'"
          />
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

<style scoped>
.word-cloud {
  min-height: 500px;
  width: 50%;
}

.full-height {
  height: 100vh !important;
}
</style>
