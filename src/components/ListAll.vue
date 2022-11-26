<script lang="ts" setup>
import { type Ref, computed, ref } from 'vue';

import { useAuthors, useCaseStudies, useKeywords, usePassages, usePlaces } from '@/api';
import { kindLabels } from '@/lib/search/search.config';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { searchFilters, createSearchFilterParams } = useSearchFilters();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFunction = (...args: any) => any;

type CreateTabParams<TQueryFn extends AnyFunction> = {
  label: string;
  header: Array<{ text: string; value: string }>;
  createQuery: (q: Ref<string>, limit: Ref<number>, offset: Ref<number>) => ReturnType<TQueryFn>;
};

function createTab<TQueryFn extends AnyFunction>(params: CreateTabParams<TQueryFn>) {
  const { createQuery, header, label } = params;

  const searchTerm = ref('');
  const q = computed(() => searchTerm.value.trim());

  const limit = ref(10);
  const offset = ref(0);

  const query = createQuery(q, limit, offset);

  const isFetching = computed(() => query.isFetching.value);

  const items = computed(() => query.data.value?.results ?? []);
  const count = computed(() => query.data.value?.count);

  function onUpdateLimit(value: number) {
    limit.value = value;
  }

  function onUpdatePage(value: number) {
    offset.value = (value - 1) * limit.value;
  }

  return {
    label,
    header,
    searchTerm,
    isFetching,
    items,
    count,
    onUpdateLimit,
    onUpdatePage,
  };
}

const authors = createTab<typeof useAuthors>({
  label: kindLabels.autor.other,
  header: [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Comment', value: 'kommentar' },
  ],
  createQuery(q, limit, offset) {
    return useAuthors(
      computed(() => ({
        name: q.value,
        name_lookup: 'icontains',
        limit: limit.value,
        offset: offset.value,
      }))
    );
  },
});

const passages = createTab<typeof usePassages>({
  label: kindLabels.stelle.other,
  header: [
    { text: 'ID', value: 'id' },
    { text: 'Quote', value: 'zitat' },
    { text: 'Comment', value: 'kommentar' },
  ],
  createQuery(q, limit, offset) {
    return usePassages(
      computed(() => ({
        zitat: q.value,
        zitat_lookup: 'icontains',
        limit: limit.value,
        offset: offset.value,
      }))
    );
  },
});

const keywords = createTab<typeof useKeywords>({
  label: kindLabels.keyword.other,
  header: [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'stichwort' },
    { text: 'Type', value: 'art' },
  ],
  createQuery(q, limit, offset) {
    return useKeywords(
      computed(() => ({
        stichwort: q.value,
        stichwort_lookup: 'icontains',
        limit: limit.value,
        offset: offset.value,
      }))
    );
  },
});

const caseStudies = createTab<typeof useCaseStudies>({
  label: kindLabels.usecase.other,
  header: [
    { text: 'ID', value: 'id' },
    { text: 'Title', value: 'title' },
    { text: 'Description', value: 'description' },
  ],
  createQuery(q, limit, offset) {
    return useCaseStudies(
      computed(() => ({
        title: q.value,
        title_lookup: 'icontains',
        limit: limit.value,
        offset: offset.value,
      }))
    );
  },
});

const places = createTab<typeof usePlaces>({
  label: kindLabels.ort.other,
  header: [
    { text: 'ID', value: 'id' },
    { text: 'Name', value: 'name' },
    { text: 'Comment', value: 'kommentar' },
  ],
  createQuery(q, limit, offset) {
    return usePlaces(
      computed(() => ({
        name: q.value,
        name_lookup: 'icontains',
        limit: limit.value,
        offset: offset.value,
      }))
    );
  },
});

const activeTabIndex = ref(0);

const tabs = { authors, passages, keywords, caseStudies, places };
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8" class="grey-bg">
        <v-tabs v-model="activeTabIndex" background-color="transparent" grow>
          <v-tab v-for="(tab, key) of tabs" :key="key">{{ tab.label }}</v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTabIndex">
          <v-tab-item v-for="(tab, key) in tabs" :key="key">
            <v-data-table
              :items="tab.items.value"
              :headers="tab.header"
              :loading="tab.isFetching.value"
              :server-items-length="tab.count.value || 50"
              disable-sort
              disable-filtering
              :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, 1000, -1] }"
              class="data-table"
              @update:page="tab.onUpdatePage"
              @update:items-per-page="tab.onUpdateLimit"
            >
              <template #item.id="{ item }">
                {{ item.id }}
              </template>
              <template #item.name="{ item }">
                <v-chip
                  v-if="'gnd_id' in item"
                  :to="{
                    name: 'List',
                    query: createSearchFilterParams({ ...searchFilters, author: [item.id] }),
                  }"
                  color="red lighten-3"
                >
                  {{ item.name }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
                <v-chip
                  v-else
                  :to="{
                    name: 'List',
                    query: createSearchFilterParams({ ...searchFilters, place: [item.id] }),
                  }"
                  color="green lighten-3"
                >
                  {{ item.name }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
              </template>
              <template #item.zitat="{ item }">
                <router-link
                  :to="{
                    name: 'List',
                    query: createSearchFilterParams({ ...searchFilters, passage: [item.id] }),
                  }"
                >
                  <b> {{ item.zitat }}&nbsp;<v-icon>mdi-chevron-right</v-icon> </b>
                </router-link>
              </template>
              <template #item.stichwort="{ item }">
                <v-chip
                  :to="{
                    name: 'List',
                    query: createSearchFilterParams({ ...searchFilters, keyword: [item.id] }),
                  }"
                  color="blue lighten-4"
                >
                  {{ item.stichwort }}&nbsp;<v-icon>mdi-chevron-right</v-icon>
                </v-chip>
              </template>
              <template #item.title="{ item }">
                <router-link
                  :to="{ name: 'Case Study', params: { id: item.id, query: $route.query } }"
                >
                  <b> {{ item.title }}&nbsp;<v-icon>mdi-chevron-right</v-icon> </b>
                </router-link>
              </template>
              <template #top>
                <v-container>
                  <!-- TODO: <form role="search"> -->
                  <v-text-field
                    v-model="tab.searchTerm"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                    type="search"
                  />
                </v-container>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
  </v-container>
</template>
