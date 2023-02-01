<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { type GetPassages, type Keyword, type KeywordType, usePassages } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import { getAuthorLabel, getDateRangeLabel } from '@/lib/get-label';
import { isNotNullable } from '@/lib/is-not-nullable';
import { keywordColors } from '@/lib/search/search.config';
import { useFullScreen } from '@/lib/use-full-screen';
import { useStore } from '@/lib/use-store';

const props = defineProps<{
  keyword?: any;
  passage?: any;
  author?: any;
  usecase?: any;
  place?: any;
}>();

const store = useStore();

const limit = ref(10);
const offset = ref(0);

const headers = [
  { text: 'Author', value: 'text.autor', width: '150px' },
  { text: 'Title', value: 'text.title' },
  { text: 'Label', value: 'display_label' },
  { text: 'Keywords', value: 'keywords' },
  { text: 'Time Frame', value: 'written', width: '100px' },
  { text: 'Coverage', value: 'coverage', width: '100px' },
];

function addKeywordToInput(obj: Keyword) {
  store.commit('addAutoCompleteSelectedValues', [
    {
      id: obj.id,
      label: obj.stichwort,
      kind: 'keyword',
    },
  ]);
}

const route = useRoute();
const passagesQuery = usePassages(
  computed(() => {
    const hasUseCase = store.state.apiParams.hasUsecase === 'true';
    const intersect = store.state.apiParams.intersect;

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
      if (route.query['time'] == null) return {};

      const [start, end] = String(route.query['time']).includes('+')
        ? String(route.query['time']).split('+').map(Number)
        : [Number(route.query['time']) - 5, Number(route.query['time']) + 4];

      const dateFilters: GetPassages.SearchParams =
        store.state.apiParams.slider === 'passage'
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
      ids: route.query['Passage']?.toString().split('+').join(),
      [intersect ? 'text__autor_and' : 'text__autor']: route.query['Author']
        ?.toString()
        .split('+')
        .map(Number),
      [intersect ? 'key_word_and' : 'key_word']: route.query['Keyword']
        ?.toString()
        .split('+')
        .map(Number),
      use_case: route.query['Use Case']?.toString().split('+').map(Number),
      text__ort: route.query['Place']?.toString().split('+').map(Number),
      has_usecase: hasUseCase,
      ...getDateFilters(),
      limit: limit.value,
      offset: offset.value,
    };

    return searchParams;
  })
);

const _isLoading = computed(() => {
  return passagesQuery.isInitialLoading.value;
});
const isFetching = computed(() => {
  return passagesQuery.isFetching.value;
});

const items = computed(() => {
  return passagesQuery.data.value?.results ?? [];
});

const count = computed(() => {
  return passagesQuery.data.value?.count ?? 0;
});

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
        'items-per-page-options': [10, 20, 50, 100, 1000, -1],
      }"
      class="data-table"
      @update:page="onUpdatePage"
      @update:items-per-page="onUpdateLimit"
    >
      <template #[`item.text.autor`]="{ item }">
        <template v-if="item.text">
          <router-link
            v-for="(author, i) of item.text.autor"
            :key="author.id"
            :to="{
              name: isFullScreen ? 'Author Detail Fullscreen' : 'Author Detail',
              params: { id: author.id },
              query: route.query,
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
              query: route.query,
            }"
            class="text-decoration-none"
          >
            <b>{{ item.text.title }}</b
            ><v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template #[`item.keywords`]="{ item }">
        <div v-for="keyword of item.key_word" :key="keyword.stichwort" class="keyword-chip">
          <v-chip small :color="getColor(keyword.art)" @click="addKeywordToInput(keyword)">
            {{ keyword.stichwort }}
          </v-chip>
        </div>
      </template>
      <template #[`item.written`]="{ item }">
        {{ item.text ? getDateRangeLabel(item.text.start_date, item.text.end_date) : 'Unknown' }}
      </template>
      <template #[`item.coverage`]="{ item }">
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
