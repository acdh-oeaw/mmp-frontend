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
    dateRange.value = [dateRange.value - 50, dateRange.value + 50];
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

//

function getSliderLabel(value: number) {
  return value < 0 ? `${value} BC` : `${value} AD`;
}
</script>

<template>
  <div class="date-range-form">
    <form novalidate role="search" @submit.prevent="">
      <component
        :is="Array.isArray(dateRange) ? VRangeSlider : VSlider"
        v-model="dateRange"
        :max="maxYear"
        :min="minYear"
        class="slider"
        thumb-label="always"
        light
        thumb-size="50"
        track-color="#d5d5d5"
        :track-fill-color="Array.isArray(dateRange) ? '#0f1226' : '#d5d5d5'"
      >
        <template #thumb-label="{ value }">{{ getSliderLabel(value) }}</template>
      </component>
    </form>

    <VMenu :close-on-content-click="false">
      <template #activator="{ attrs, on }">
        <VBtn icon v-bind="attrs" class="mt-2" v-on="on">
          <VIcon>mdi-cog</VIcon>
          <span class="d-sr-only">Open date filter options</span>
        </VBtn>
      </template>

      <VCard>
        <VCardTitle>Date range filter</VCardTitle>

        <VCardText>
          <form novalidate @submit.prevent="">
            <VRadioGroup
              label="Timeslider should filter for"
              :value="dateFilter"
              @change="onUpdateDateFilterSearchFilter"
            >
              <VRadio
                v-for="dateFilter of dateFilters"
                :key="dateFilter"
                color="teal lighten-2"
                :label="dateFilterLabels[dateFilter]"
                :value="dateFilter"
              />
            </VRadioGroup>

            <VDivider />

            <VRadioGroup
              label="Discrete date or date range"
              :value="dateRangeType"
              @change="onUpdateDateRangeType"
            >
              <VRadio
                v-for="dateRangeType of dateRangeTypes"
                :key="dateRangeType"
                :value="dateRangeType"
                :label="dateRangeTypeLabels[dateRangeType]"
                color="teal lighten-2"
              />
            </VRadioGroup>
          </form>
        </VCardText>
      </VCard>
    </VMenu>
  </div>
</template>

<style scoped>
.date-range-form {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}

.slider {
  margin-top: 30px;
}
</style>

<style>
.v-slider {
  height: 44px;
}

div.v-slider__thumb-label.primary {
  background-color: transparent !important;
  height: 1.2rem !important;
  color: rgb(0 0 0 / 87%) !important;
}
</style>
