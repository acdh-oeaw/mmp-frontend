<script lang="ts" setup>
import { computed, ref } from 'vue';

import { useAuthors, useCaseStudies, useKeywords, usePassages, usePlaces } from '@/api';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { searchFilters, createSearchFilterParams } = useSearchFilters();

const activeTabIndex = ref(0);

const limit = ref(10);
const offset = ref(0);
const searchTerm = ref('');
const q = computed(() => searchTerm.value.trim());

function onUpdateLimit(value: number, tabIndex) {
  limit.value = value;
}

function onUpdatePage(value: number, tabIndex) {
  offset.value = (value - 1) * limit.value;
}

// TODO: all the data fetching should happen a level deeper, in earch tab,
// because they actually know what resource they are handling

// const authorsQuery = useAuthors({ name: q, name_lookup: 'icontains', limit, offset });
// const passagesQuery = usePassages({ zitat: q, zitat_lookup: 'icontains', limit, offset });
// const keywordsQuery = useKeywords({ stichwort: q, stichwort_lookup: 'icontains', limit, offset });
// const caseStudiesQuery = useCaseStudies({ title: q, title_lookup: 'icontains', limit, offset });
// const placesQuery = usePlaces({ name: q, name_lookup: 'icontains', limit, offset });

const tabs = {
  authors: {
    label: 'Authors',
    header: [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Comment', value: 'kommentar' },
    ],
    searchTerm: ref(''),
    q: computed(() => this.searchTerm.value.trim()),
    limit: ref(10),
    offset: ref(0),
    query: useAuthors({
      name: this.q,
      name_lookup: 'icontains',
      limit: this.limit,
      offset: this.offset,
    }),
    isFetching: computed(() => this.query.isFetching.value),
    items: computed(() => this.query.data.value?.results ?? []),
    count: computed(() => this.query.data.value?.count),
  },
  passages: {
    label: 'Passages',
    header: [
      { text: 'ID', value: 'id' },
      { text: 'Quote', value: 'zitat' },
      { text: 'Comment', value: 'kommentar' },
    ],
    searchTerm: ref(''),
    q: computed(() => this.searchTerm.value.trim()),
    limit: ref(10),
    offset: ref(0),
    query: usePassages({
      zitat: this.q,
      zitat_lookup: 'icontains',
      limit: this.limit,
      offset: this.offset,
    }),
    isFetching: computed(() => this.query.isFetching.value),
    items: computed(() => this.query.data.value?.results ?? []),
    count: computed(() => this.query.data.value?.count),
  },
  keywords: {
    label: 'Keywords',
    header: [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'stichwort' },
      { text: 'Type', value: 'art' },
      { text: 'Complete?', value: 'complete' },
    ],
    searchTerm: ref(''),
    q: computed(() => this.searchTerm.value.trim()),
    limit: ref(10),
    offset: ref(0),
    query: useKeywords({
      stichwort: this.q,
      stichwort_lookup: 'icontains',
      limit: this.limit,
      offset: this.offset,
    }),
    isFetching: computed(() => this.query.isFetching.value),
    items: computed(() => this.query.data.value?.results ?? []),
    count: computed(() => this.query.data.value?.count),
  },
  caseStudies: {
    label: 'Case studies',
    header: [
      { text: 'ID', value: 'id' },
      { text: 'Title', value: 'title' },
      { text: 'Description', value: 'description' },
    ],
    searchTerm: ref(''),
    q: computed(() => this.searchTerm.value.trim()),
    limit: ref(10),
    offset: ref(0),
    query: useCaseStudies({
      title: this.q,
      title_lookup: 'icontains',
      limit: this.limit,
      offset: this.offset,
    }),
    isFetching: computed(() => this.query.isFetching.value),
    items: computed(() => this.query.data.value?.results ?? []),
    count: computed(() => this.query.data.value?.count),
  },
  places: {
    label: 'Places',
    header: [
      { text: 'ID', value: 'id' },
      { text: 'Name', value: 'name' },
      { text: 'Comment', value: 'kommentar' },
    ],
    searchTerm: ref(''),
    q: computed(() => this.searchTerm.value.trim()),
    limit: ref(10),
    offset: ref(0),
    query: usePlaces({
      name: this.q,
      name_lookup: 'icontains',
      limit: this.limit,
      offset: this.offset,
    }),
    isFetching: computed(() => this.query.isFetching.value),
    items: computed(() => this.query.data.value?.results ?? []),
    count: computed(() => this.query.data.value?.count),
  },
};
</script>

<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" xl="8" class="grey-bg">
        <v-tabs v-model="activeTabIndex" background-color="transparent" grow>
          <v-tab v-for="(tab, key) of tabs" :key="key"> {{ tab.label }}s </v-tab>
        </v-tabs>
        <v-tabs-items v-model="activeTabIndex">
          <v-tab-item v-for="(tab, key) in tabs" :key="key">
            <v-data-table
              :items="tab.items"
              :headers="tab.header"
              :loading="tab.isFetching"
              :server-items-length="tab.count || 50"
              disable-sort
              disable-filtering
              :footer-props="{ 'items-per-page-options': [10, 20, 50, 100, 1000, -1] }"
              class="data-table"
              @update:page="updateOffset($event, i)"
              @update:items-per-page="updateLimit($event, i)"
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
              <template #item.complete="{ item }">
                <v-icon v-if="$store.state.completeKeywords.includes(item.id)">
                  mdi-check-outline</v-icon
                >
              </template>
              <template #top>
                <v-container>
                  <!-- TODO: <form role="search"> -->
                  <v-text-field
                    v-model="tabs[i].searchTerm"
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
