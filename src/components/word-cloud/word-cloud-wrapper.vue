<script lang="ts" setup>
import { computed, ref } from 'vue';

import {
  type GetPassageKeywords,
  type GetPassageNlpData,
  usePassageKeywords,
  usePassageNlpData,
} from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import PieChart from '@/components/PieChart.vue';
import type { Token, TokenData } from '@/components/word-cloud/word-cloud.types';
import WordCloud from '@/components/word-cloud/word-cloud.vue';
import { isNonEmptyArray } from '@/lib/is-nonempty-array';
import { isNotNullable } from '@/lib/is-not-nullable';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';

const props = defineProps<{
  author?: any;
  passage?: any;
  keyword?: any;
  usecase?: any;
  place?: any;
  height?: any;
}>();

const { searchFilters } = useSearchFilters();

const searchParams = computed(() => {
  // FIXME:
  if (Object.values(props).some(isNotNullable)) {
    const searchParams: GetPassageKeywords.SearchParams | GetPassageNlpData.SearchParams = {
      ids: props.passage?.toString().split('+').join(','),
      text__autor: props.author,
      key_word: props.keyword,
      use_case: props.usecase,
      text__ort: props.place,
    };

    return searchParams;
  }

  function getDateFilters() {
    const [start, end] = Array.isArray(searchFilters.value['date-range'])
      ? searchFilters.value['date-range']
      : [searchFilters.value['date-range'] - 5, searchFilters.value['date-range'] + 4];

    const dateFilters: GetPassageKeywords.SearchParams | GetPassageNlpData.SearchParams = {
      start_date: start,
      start_date_lookup: 'gt',
      end_date: end,
      end_date_lookup: 'lt',
    };

    return dateFilters;
  }

  const searchParams: GetPassageKeywords.SearchParams | GetPassageNlpData.SearchParams = {
    ids: isNonEmptyArray(searchFilters.value['passage'])
      ? searchFilters.value['passage'].join(',')
      : undefined,
    text__autor: searchFilters.value['author'],
    key_word: searchFilters.value['keyword'],
    use_case: searchFilters.value['case-study'],
    text__ort: searchFilters.value['place'],
    ...getDateFilters(),
  };

  return searchParams;
});

const passageNlpDataQuery = usePassageNlpData(searchParams);
const passageKeywordsQuery = usePassageKeywords(searchParams);

const isLoading = computed(() => {
  return [passageNlpDataQuery, passageKeywordsQuery].some((query) => {
    return query.isInitialLoading.value;
  });
});

const data = computed<TokenData>(() => {
  const nlpData = passageNlpDataQuery.data.value;
  const keywords = passageKeywordsQuery.data.value;

  /** Sort by occurence, then alphabetically. */
  function sortWords(a: Token, b: Token) {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return a[0].localeCompare(b[0]);
  }

  if (nlpData == null || keywords == null) {
    return { words: [], keywords: [] };
  }

  // FIXME: `/kw-stelle` endpoint should return Record<string, number> (same as `/nlp-data`), not Array<{ [token: string]: number }>
  const data: TokenData = {
    words: Object.entries(nlpData.token_dict).sort(sortWords),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    keywords: keywords.token_dict.map((x) => Object.entries(x)[0]!).sort(sortWords),
  };

  return data;
});

const filteredData = computed<TokenData>(() => {
  function sanitize(word: Token): Token {
    const [token, count] = word;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return [token.split(' (')[0]!, count];
  }

  // TODO: why not just slice the first n entries, since they are already sorted?
  // improves performance by a lot, removing unused and non words
  // for (let j = 1; words.length > 75; j += 1) {
  //   words = words.filter(([token, count]) => token.match(/\w+/g) && count > j);
  // }

  const filteredData: TokenData = {
    words: data.value.words.map(sanitize).slice(0, 75),
    keywords: data.value.keywords.map(sanitize).slice(0, 75),
  };

  return filteredData;
});

const drawer = ref(false);
const speeddial = ref(false);
const type = ref<'pie' | 'cloud'>('cloud');

// TODO: merge
const check = ref<Array<keyof TokenData>>(['words', 'keywords']);
const titles: Record<keyof TokenData, string> = { words: 'All Words', keywords: 'Keywords' };
const isVisible = computed(() => {
  return { words: check.value.includes('words'), keywords: check.value.includes('keywords') };
});

const isFullScreen = useFullScreen();
</script>

<template>
  <v-card width="100%" color="transparent" :height="isFullScreen ? 'calc(100vh - 4px)' : 500">
    <v-overlay absolute opacity=".2" :value="isLoading">
      <h1 v-if="isLoading" class="no-nodes">
        <v-progress-circular indeterminate color="#0F1226" />
      </h1>
      <h1 v-else class="no-nodes">No words found!</h1>
    </v-overlay>
    <v-row v-if="type === 'pie'">
      <template v-for="(tokens, key) of filteredData">
        <v-col v-if="isVisible[key]" :key="key" :cols="check.length >= 2 ? 6 : 12">
          <pie-chart
            :data="tokens"
            :title="titles[key]"
            :height="isFullScreen ? '100%' : '500px'"
          />
        </v-col>
      </template>
    </v-row>
    <v-row v-else>
      <template v-for="(data, key) of filteredData">
        <v-col v-if="isVisible[key]" :key="key" :cols="check.length >= 2 ? 6 : 12">
          <word-cloud :data="data" :title="titles[key]" />
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
            <v-expansion-panel v-for="(tokens, key) of data" :key="key">
              <v-expansion-panel-header>
                {{ titles[key] }}
                <template #actions>
                  <v-chip small>{{ tokens.length }}</v-chip>
                  <v-icon> $expand </v-icon>
                </template>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-list dense>
                  <v-list-item v-for="[token, count] of tokens" :key="token">
                    <v-list-item-content>
                      <v-list-item-title>{{ token }}:&nbsp;{{ count }}</v-list-item-title>
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
