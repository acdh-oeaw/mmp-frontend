<script lang="ts" setup>
import { computed, ref } from 'vue';

import { type Author, type GetPassages, type Keyword, type KeywordType, usePassages } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import { getAuthorLabel, getDateRangeLabel } from '@/lib/get-label';
import { isNonEmptyArray } from '@/lib/is-nonempty-array';
import { isNotNullable } from '@/lib/is-not-nullable';
import { keywordColors } from '@/lib/search/search.config';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';
import { useStore } from '@/lib/use-store';

const props = defineProps<{
  author?: any;
  passage?: any;
  keyword?: any;
  usecase?: any;
  place?: any;
}>();

const { searchFilters } = useSearchFilters();
const store = useStore();

const headers = [
  { text: 'Author', value: 'text.autor', width: '150px' },
  { text: 'Title', value: 'text.title' },
  { text: 'Label', value: 'display_label' },
  { text: 'Keywords', value: 'keywords' },
  { text: 'Time Frame', value: 'written', width: '100px' },
  { text: 'Coverage', value: 'coverage', width: '100px' },
];

const limit = ref(10);
const offset = ref(0);

const renderKey = ref(0);

function addKeywordToInput(obj: Keyword) {
  // TODO: should this use setSearchFilters instead? i.e. trigger a query vs. just adding to autocomplete selection
  store.commit('addAutoCompleteSelectedValues', [
    {
      id: obj.id,
      label: obj.stichwort,
      kind: 'keyword',
    },
  ]);
}

function addAuthorToInput(obj: Author) {
  // TODO: should this use setSearchFilters instead? i.e. trigger a query vs. just adding to autocomplete selection
  store.commit('addAutoCompleteSelectedValues', [
    {
      id: obj.id,
      label: obj.name,
      kind: 'author',
    },
  ]);
}

const passagesQuery = usePassages(
  computed(() => {
    // FIXME:
    if (Object.values(props).some(isNotNullable)) {
      const searchParams: GetPassages.SearchParams = {
        ids: props.passage?.toString().split('+').join(','),
        text__autor: props.author,
        key_word: props.keyword,
        use_case: props.usecase,
        text__ort: props.place,
        limit: limit.value,
        offset: offset.value,
      };

      return searchParams;
    }

    function getDateFilters() {
      const [start, end] = Array.isArray(searchFilters.value['date-range'])
        ? searchFilters.value['date-range']
        : [searchFilters.value['date-range'] - 5, searchFilters.value['date-range'] + 4];

      const dateFilters: GetPassages.SearchParams =
        searchFilters.value['date-filter'] === 'content'
          ? {
              start_date: start,
              start_date_lookup: 'gt',
              end_date: end,
              end_date_lookup: 'lt',
            }
          : {
              text__start_date: start,
              text__start_date_lookup: 'gt',
              text__end_date: end,
              text__end_date_lookup: 'lt',
            };

      return dateFilters;
    }

    const searchParams: GetPassages.SearchParams = {
      ids: isNonEmptyArray(searchFilters.value['passage'])
        ? searchFilters.value['passage'].join(',')
        : undefined,
      [searchFilters.value['query-mode'] === 'intersection' ? 'text__autor_and' : 'text__autor']:
        searchFilters.value['author'],
      [searchFilters.value['query-mode'] === 'intersection' ? 'key_word_and' : 'key_word']:
        searchFilters.value['keyword'],
      use_case: searchFilters.value['case-study'],
      text__ort: searchFilters.value['place'],
      has_usecase: searchFilters.value['dataset'] === 'case-studies',
      ...getDateFilters(),
      limit: limit.value,
      offset: offset.value,
    };

    return searchParams;
  })
);

const isFetching = computed(() => passagesQuery.isFetching.value);

const items = computed(() => {
  return passagesQuery.data.value?.results ?? [];
});

const count = computed(() => passagesQuery.data.value?.count ?? 0);

function onUpdateLimit(value: number) {
  limit.value = value;
}

function onUpdatePage(value: number) {
  offset.value = (value - 1) * limit.value;
}

function getColor(type: KeywordType) {
  return keywordColors[type];
}

const isFullScreen = useFullScreen();
</script>

<template>
  <v-card color="transparent" width="100%" flat>
    <v-data-table
      :items="items"
      :headers="headers"
      :loading="isFetching"
      :server-items-length="count"
      disable-sort
      disable-filtering
      no-data-text="No passages found"
      :footer-props="{
        'items-per-page-options': [10, 20, 50, 100, 1000],
      }"
      class="data-table"
      @update:page="onUpdatePage"
      @update:items-per-page="onUpdateLimit"
    >
      <template #[`item.text.autor`]="{ item }">
        <template v-if="item.text">
          <router-link
            v-for="(author, i) in item.text.autor"
            :key="author.id"
            :to="{
              name: isFullScreen ? 'Author Detail Fullscreen' : 'Author Detail',
              params: { id: author.id },
              query: $route.query,
            }"
            class="text-decoration-none"
          >
            <span v-if="i != 0">, </span>
            {{ getAuthorLabel(author) }}
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template #[`item.text.title`]="{ item }">
        <template v-if="item.text">
          <router-link
            :to="{
              name: isFullScreen ? 'Passage Detail Fullscreen' : 'Passage Detail',
              params: { id: item.id },
              query: $route.query,
            }"
            class="text-decoration-none"
          >
            <b>{{ item.text.title }}</b
            ><v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template #[`item.keywords`]="{ item }">
        <div v-for="keyword in item.key_word" :key="keyword.stichwort" class="keyword-chip">
          <v-chip small :color="getColor(keyword.art)" @click="addKeywordToInput(keyword)">
            {{ keyword.stichwort }}
          </v-chip>
        </div>
      </template>
      <template #[`item.written`]="{ item }">
        <!-- displays unkown if neither start nor end date are defined -->
        {{ item.text ? getDateRangeLabel(item.text.start_date, item.text.end_date) : 'Unknown' }}
      </template>
      <template #[`item.coverage`]="{ item }">
        <!-- displays nothing if neither start nor end date are defined -->
        {{ getDateRangeLabel(item.start_date, item.end_date) }}
      </template>
      <template #[`footer.prepend`]>
        <fullscreen-button left />
      </template>
    </v-data-table>
    <router-view />
  </v-card>
</template>

<style>
a:hover {
  text-decoration: underline;
}

div.v-data-table.data-table {
  background-color: transparent;
}

.keyword-chip {
  display: inline-block;
  margin: 1.5px;
}
</style>
