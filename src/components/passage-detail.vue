<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { usePassageById } from '@/api';
import { getAuthorLabel, getPlaceLabel } from '@/lib/get-label';
import { keywordColors } from '@/lib/search/search.config';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const route = useRoute();
const id = computed(() => Number(route.params.id));

const { createSearchFilterParams, searchFilters } = useSearchFilters();

const passageQuery = usePassageById({ id });

const isLoading = computed(() => passageQuery.isInitialLoading.value);
const passage = computed(() => passageQuery.data.value);

const title = computed(() => {
  if (passage.value == null) return {};

  return {
    title: passage.value.text?.title,
    written:
      passage.value.text?.start_date || passage.value.text?.end_date
        ? `${passage.value.text.start_date || 'unknown'} - ${
            passage.value.text.end_date || 'unknown'
          }`
        : 'unknown',
    author: passage.value.text?.autor.map((x) => x.name_en).join(', '),
  };
});

const items = computed(() => {
  if (passage.value == null) return [];

  return [
    {
      key: 'Keywords',
      value: passage.value.key_word,
    },
    {
      key: 'Translation',
      value: passage.value.translation,
    },
    {
      key: 'Original quote',
      value: passage.value.zitat,
    },
    {
      key: 'Title',
      value: title.value.title,
    },
    {
      key: 'Cited',
      value: passage.value.zitat_stelle,
    },
    {
      key: 'Summary',
      value: passage.value.summary,
    },
    {
      key: 'Author',
      value: passage.value.text?.autor,
    },
    {
      key: 'Place',
      value: passage.value.text?.ort,
    },
    {
      key: 'Edition',
      value: passage.value.text?.edition,
    },
    {
      key: 'Text written in',
      value: title.value.written,
    },
    {
      key: 'Comment',
      value: passage.value.kommentar,
    },
  ] as const;
});
</script>

<template>
  <div>
    <VListItem>
      <VListItemAction>
        <RouterLink
          :to="{ name: 'search-results', query: route.query }"
          class="text-decoration-none"
        >
          <v-icon>mdi-close</v-icon>
        </RouterLink>
      </VListItemAction>
      <VListItemContent>
        <div v-if="!isLoading">
          <VListItemTitle class="text-h5">
            {{ title.title }}
          </VListItemTitle>
          <VListItemSubtitle>
            <!-- this is a weird way to ensure the colon is only displayed when both these values have been loaded -->
            {{ [title.written, title.author].join(', ') }}
          </VListItemSubtitle>
        </div>

        <VSkeletonLoader v-else type="heading, text" />
      </VListItemContent>
    </VListItem>

    <VDivider />

    <VSimpleTable v-if="!isLoading" class="data-table">
      <tbody>
        <tr v-for="item of items" :key="item.key">
          <td class="grey--text text--darken-1">
            {{ item.key }}
          </td>
          <td v-if="item.key === 'Keywords'">
            <div v-for="keyword of item.value" :key="keyword.id" class="keyword-chip">
              <VChip
                :color="keywordColors[keyword.art]"
                small
                :to="{
                  query: createSearchFilterParams({ ...searchFilters, keyword: [keyword.id] }),
                }"
              >
                {{ keyword.stichwort }}
              </VChip>
            </div>
          </td>
          <td v-else-if="item.key === 'Place' || item.key === 'Author'">
            <RouterLink
              v-for="(val, i) of item.value"
              :key="val.id"
              :to="{
                query:
                  item.key === 'Place'
                    ? createSearchFilterParams({ ...searchFilters, place: [val.id] })
                    : route.query,
                params: { id: val.id },
              }"
            >
              <span v-if="i != 0">, </span>
              {{ item.key === 'Place' ? getPlaceLabel(val) : getAuthorLabel(val) }}
              <VIcon>mdi-chevron-right</VIcon>
            </RouterLink>
          </td>
          <td v-else>
            {{ item.value }}
          </td>
        </tr>
      </tbody>
    </VSimpleTable>

    <VContainer v-else>
      <VSkeletonLoader type="table-row-divider@11" />
    </VContainer>
  </div>
</template>
