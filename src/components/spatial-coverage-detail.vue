<script lang="ts" setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router/composables';

import { useSpatialCoverageGeojsonById } from '@/api';
import { getDateRangeLabel } from '@/lib/get-label';
import { useSearchFilters } from '@/lib/search/use-search-filters';

const { createSearchFilterParams, searchFilters } = useSearchFilters();
const route = useRoute();
// FIXME: currently the map view encodes multiple ids as path param when a point is clicked
// which has multiple overlapping spatial coverages, which is a really bad idea
const id = computed(() => {
  return String(route.params.id).startsWith('[')
    ? String(route.params.id).slice(1, -1).split(',').map(Number)[0]
    : Number(route.params.id);
});

const spatialCoverageQuery = useSpatialCoverageGeojsonById({ id });

const isLoading = computed(() => spatialCoverageQuery.isInitialLoading.value);

const spatialCoverage = computed(() => spatialCoverageQuery.data.value);

// FIXME: only temporary
const data = computed(() => {
  if (spatialCoverage.value == null) return [];
  return [spatialCoverage.value];
});
</script>

<template>
  <div>
    <VListItem>
      <VListItemAction>
        <RouterLink :to="{ name: 'geo-map', query: route.query }" class="text-decoration-none">
          <VIcon>mdi-close</VIcon>
        </RouterLink>
      </VListItemAction>
      <VListItemTitle>Keyword(s) found at point</VListItemTitle>
    </VListItem>

    <VDivider />

    <VList v-if="!isLoading" v-model="data">
      <VList v-for="d in data" :key="d.id">
        <VListItem>
          <VListItemContent>
            <VListItemTitle v-if="d.properties.key_word?.stichwort" class="text-h5">
              Keyword: {{ d.properties.key_word.stichwort }}
            </VListItemTitle>
            <VListItemSubtitle v-if="d.properties.key_word?.art">
              {{ d.properties.key_word.art }}
            </VListItemSubtitle>
          </VListItemContent>
        </VListItem>
        <VSubheader hide-details>Texts</VSubheader>
        <VListItem v-for="text in d.properties.texts" :key="text.id">
          <VList>
            <VListItemContent>
              <VListItemTitle>{{ text.title }}</VListItemTitle>
              <VListItemSubtitle v-if="text.authors.length">
                {{ text.authors.map((author) => author.name).join(', ') }}
              </VListItemSubtitle>
              <VListItemSubtitle v-if="text.places.length"> </VListItemSubtitle>
            </VListItemContent>
          </VList>
        </VListItem>
        <VSubheader>Passages</VSubheader>
        <VListItem
          v-for="passage in d.properties.stelle"
          :key="passage.id"
          :to="{
            query: createSearchFilterParams({ ...searchFilters, passage: [passage.id] }),
            params: { id: passage.id },
          }"
        >
          <VListItemContent>
            <VListItemTitle>
              {{ passage.display_label }}
            </VListItemTitle>
            <VListItemSubtitle v-if="passage.start_date || passage.end_date">
              {{ getDateRangeLabel(passage.start_date, passage.end_date) }}
            </VListItemSubtitle>
          </VListItemContent>
          <VListItemIcon>
            <VIcon>mdi-chevron-right</VIcon>
          </VListItemIcon>
        </VListItem>
        <VDivider />
      </VList>
    </VList>
    <VList v-else>
      <VListItem>
        <VListItemContent>
          <VListItemTitle>
            <VSkeletonLoader type="sentences@7" />
          </VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </div>
</template>
