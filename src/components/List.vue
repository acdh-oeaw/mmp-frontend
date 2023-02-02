<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router/composables';

import { type KeywordType, usePassages } from '@/api';
import FullscreenButton from '@/components/FullscreenButton.vue';
import { getAuthorLabel, getDateRangeLabel } from '@/lib/get-label';
import { keywordColors } from '@/lib/search/search.config';
import { usePassagesSearchParams } from '@/lib/search/use-passages-search-params';
import { useSearchFilters } from '@/lib/search/use-search-filters';
import { useFullScreen } from '@/lib/use-full-screen';

const headers = [
  { text: 'Author', value: 'text.autor', width: '150px' },
  { text: 'Title', value: 'text.title' },
  { text: 'Label', value: 'display_label' },
  { text: 'Keywords', value: 'keywords' },
  { text: 'Time Frame', value: 'written', width: '100px' },
  { text: 'Coverage', value: 'coverage', width: '100px' },
];

const route = useRoute();
const limit = ref(10);
const offset = ref(0);
const { createSearchFilterParams, searchFilters } = useSearchFilters();
const searchParams = usePassagesSearchParams();
const passagesQuery = usePassages(searchParams);

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
            <b>{{ item.text.title }}</b>
            <v-icon>mdi-chevron-right</v-icon>
          </router-link>
        </template>
      </template>
      <template #[`item.keywords`]="{ item }">
        <div v-for="keyword of item.key_word" :key="keyword.stichwort" class="keyword-chip">
          <v-chip
            small
            :color="getColor(keyword.art)"
            :to="{
              query: createSearchFilterParams({
                ...searchFilters,
                keyword: [...searchFilters.keyword, keyword.id],
              }),
            }"
          >
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
