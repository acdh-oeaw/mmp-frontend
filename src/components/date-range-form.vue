<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { VRangeSlider, VSlider } from 'vuetify/lib';

import { debounce } from '@/lib/debounce';
import { maxYear, minYear } from '@/lib/search/search.config';
import {
  type DateFilter,
  type SearchFilters,
  dateFilters,
  useSearchFilters,
} from '@/lib/search/use-search-filters';

const { searchFilters, setSearchFilters } = useSearchFilters();

const dateRange = ref(searchFilters.value['date-range']);

const onUpdateDateRangeSearchFilter = debounce(function onUpdateDateRangeSearchFilter(
  dateRange: SearchFilters['date-range']
) {
  setSearchFilters({ ...searchFilters.value, ['date-range']: dateRange });
});

watch(dateRange, (dateRange) => {
  onUpdateDateRangeSearchFilter(dateRange);
});

const SliderComponent = computed(() => {
  return Array.isArray(dateRange) ? VRangeSlider : VSlider;
});

//

const dateRangeTypes = ['range', 'discrete'] as const;
type DateRangeType = typeof dateRangeTypes[number];

const dateRangeType = computed<DateRangeType>(() => {
  return Array.isArray(dateRange.value) ? 'range' : 'discrete';
});

function onUpdateDateRangeType(_dateRangeType: DateRangeType) {
  if (Array.isArray(dateRange.value)) {
    dateRange.value = (dateRange.value[0] + dateRange.value[1]) / 2;
  } else {
    dateRange.value = [dateRange.value - 5, dateRange.value + 4];
  }
}

const dateRangeTypeLabels: Record<DateRangeType, string> = {
  discrete: 'Discrete date',
  range: 'Date range',
};

//

const dateFilter = computed(() => {
  return searchFilters.value['date-filter'];
});

function onUpdateDateFilterSearchFilter(dateFilter: SearchFilters['date-filter']) {
  setSearchFilters({ ...searchFilters.value, ['date-filter']: dateFilter });
}

const dateFilterLabels: Record<DateFilter, string> = {
  composition: 'Time of composition',
  content: 'Temporal coverage',
};
</script>

<template>
  <form novalidate role="search" @submit.prevent="">
    <component :is="SliderComponent" v-model="dateRange" :max="maxYear" :min="minYear" :step="10" />

    <VMenu attach :close-on-content-click="false">
      <template #activator="{ props }">
        <VBtn v-bind="props">
          <VIcon left>mdi-cog</VIcon>
          <span class="d-sr-only">Open date filter options</span>
        </VBtn>
      </template>
      <form novalidate @submit.prevent="">
        <VRadioGroup :model-value="dateFilter" @update:model-value="onUpdateDateFilterSearchFilter">
          <VRadio v-for="id of dateFilters" :key="id">
            {{ dateFilterLabels[id] }}
          </VRadio>
        </VRadioGroup>
        <VRadioGroup :model-value="dateRangeType" @update:model-value="onUpdateDateRangeType">
          <VRadio v-for="id of dateRangeTypes" :key="id">
            {{ dateRangeTypeLabels[id] }}
          </VRadio>
        </VRadioGroup>
      </form>
    </VMenu>
  </form>
</template>
