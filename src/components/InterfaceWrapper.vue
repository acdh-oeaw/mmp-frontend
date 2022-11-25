<script lang="ts" setup>
import { groupBy } from '@stefanprobst/group-by';
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router/composables';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { VRangeSlider, VSlider } from 'vuetify/lib';

import { useAutoComplete } from '@/api';
import rangeSliderIcon from '@/assets/icons/range-slider.svg';
import sliderIcon from '@/assets/icons/slider.svg';
import SearchOptions from '@/components/search/search-options.vue';
import { debounce } from '@/lib/debounce';
import {
  colors,
  keywordTypeLabels,
  kindLabels,
  maxYear,
  minYear,
} from '@/lib/search/search.config';
import type { Item } from '@/lib/search/types';
import { uniqueItems } from '@/lib/search/unique-items';
import {
  type DateFilter,
  type SearchFilters,
  useSearchFilters,
} from '@/lib/search/use-search-filters';
import { truncate } from '@/lib/truncate';
import { useStore } from '@/lib/use-store';

type SliderComponent = 'v-range-slider' | 'v-slider';

const router = useRouter();
const route = useRoute();

const recommendedSearchFilters: Array<Item> = [
  {
    id: 8,
    label: 'Baudonivia von Poitiers',
    kind: 'autor',
  },
  {
    id: 33,
    label: 'barbari',
    kind: 'keyword',
  },
  {
    id: 3,
    label: 'Steppe Peoples 1: "Schwarzes Meer" - Jordanes, Prokop, Zacharias Rhetor',
    kind: 'usecase',
  },
];

const sliderComponent = ref<SliderComponent>('v-range-slider');

// FIXME: do we need this?
const currentView = computed({
  get() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return route.name!;
  },
  set(value: string) {
    router.push({ name: value, query: route.query });
  },
});

const isSliderVisible = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return !['Network Graph', 'Word Cloud'].includes(route.name!);
});

const isDetailView = computed(() => {
  return route.name?.includes('Detail');
});

// changes the slider from range to point, and creates a new range value fittingly.
function toggleSliderComponent(mode: SliderComponent) {
  if (mode !== sliderComponent.value) {
    if (Array.isArray(dateRange.value)) {
      onUpdateDateRange((dateRange.value[0] + dateRange.value[1]) / 2);
    } else {
      onUpdateDateRange([dateRange.value - 100, dateRange.value + 100]);
    }

    sliderComponent.value = mode;
  }
}

const store = useStore();

const searchTerm = ref('');
// TODO: selected values currently still live in global store because it is possible to change them from anywhere in the app
const selectedValues = computed(() => store.state.autocomplete.input);

function onUpdateSearchTerm(value: string | null) {
  searchTerm.value = value ?? '';
}

function onUpdateSelectedValues(values: Array<Item>) {
  store.commit('addAutoCompleteSelectedValues', values);
}

function onRemoveValue(value: Item) {
  store.commit('removeAutoCompleteSelectedValue', value);
}

function onClearSelectedValues() {
  searchTerm.value = '';
  store.commit('clearAutoCompleteSelectedValues');
}

function onSelectRecommendedSearchFilter(value: Item) {
  store.commit('addAutoCompleteSelectedValues', [value]);
}

const kinds = computed(() => store.state.search.kinds);

const autoCompleteQuery = useAutoComplete(
  computed(() => ({
    // return 10 results per `kind`. note that results will be sorted by `kind`.
    page_size: 10,
    q: searchTerm.value.trim(),
    kind: kinds.value,
  }))
);
const isFetching = computed(() => autoCompleteQuery.isFetching.value);
const items = computed(() => {
  // selected values must always be included in items, otherwise the chips for selected values
  // will not be displayed when they are no longer in the items list matching the current search term.
  if (autoCompleteQuery.data.value == null) {
    return selectedValues.value;
  }

  return uniqueItems(autoCompleteQuery.data.value.results, selectedValues.value);
});

const nothingFoundText = computed(() => {
  return autoCompleteQuery.isFetching.value ? 'Loading...' : 'Nothing found';
});

const label = 'Search for passages';

function getKindLabel(value: Item) {
  const kindLabel = kindLabels[value.kind];
  if (value.kind === 'keyword') {
    // @ts-expect-error FIXME: currently endpoint does not return keyword type
    return `${kindLabel} (${keywordTypeLabels[value.type]})`;
  }
  return kindLabel;
}

function getColor(value: Item) {
  return colors[value.kind];
}

//

const { searchFilters, setSearchFilters } = useSearchFilters();

function onSubmit() {
  const byKind = groupBy(selectedValues.value, (value) => {
    return value.kind;
  });

  function getIds(values: Array<Item> | undefined) {
    if (values == null) return [];
    return values.map((value) => {
      return value.id;
    });
  }

  setSearchFilters({
    ...searchFilters.value,
    author: getIds(byKind.autor),
    'case-study': getIds(byKind.usecase),
    keyword: getIds(byKind.keyword),
    passage: getIds(byKind.stelle),
    place: getIds(byKind.ort),
  });
}

// FIXME:
// watch searchfilters, and update selected values with any missing values
// also need to fetch label for these missing values, because the search filter
// will only provide kind and id (?kind=id)

//

const dateFilters: Record<DateFilter, { label: string; color: string }> = {
  content: { label: 'Temporal Coverage', color: 'teal lighten-2' },
  composition: { label: 'Time of composition', color: 'red darken-4' },
};

const dateFilter = computed(() => searchFilters.value['date-filter']);

function onUpdateDateFilter(dateFilter: SearchFilters['date-filter']) {
  setSearchFilters({ ...searchFilters.value, ['date-filter']: dateFilter });
}

//

const dateRange = computed(() => searchFilters.value['date-range']);

const onUpdateDateRange = debounce(function onUpdateDateRange(
  dateRange: SearchFilters['date-range']
) {
  setSearchFilters({ ...searchFilters.value, ['date-range']: dateRange });
});
</script>

<template>
  <div>
    <v-container>
      <v-row :justify="isDetailView ? 'start' : 'center'">
        <v-col cols="12" :lg="isDetailView ? 8 : 12" xl="8">
          <form role="search" @submit.prevent="onSubmit">
            <v-row class="grey-bg">
              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
                <v-menu :close-on-content-click="false">
                  <template #activator="{ on, attrs }">
                    <v-btn min-height="50px" height="100%" block depressed v-bind="attrs" v-on="on">
                      <v-icon>mdi-cog</v-icon>
                      <v-icon>mdi-chevron-down</v-icon>
                      <span class="d-sr-only">Open search options</span>
                    </v-btn>
                  </template>
                  <search-options />
                </v-menu>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 10">
                <v-autocomplete
                  :aria-label="label"
                  auto-select-first
                  color="primary"
                  item-text="label"
                  :items="items"
                  :loading="isFetching"
                  multiple
                  :no-data-text="nothingFoundText"
                  no-filter
                  :placeholder="label"
                  return-object
                  :search-input="searchTerm"
                  type="search"
                  :value="selectedValues"
                  @change="searchTerm = ''"
                  @input="onUpdateSelectedValues"
                  @update:search-input="onUpdateSearchTerm"
                >
                  <template #item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.label }}</v-list-item-title>
                      <v-list-item-subtitle>{{ getKindLabel(item.kind) }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                  <template #selection="{ attrs, selected, select, item }">
                    <!-- TODO: separate component which will load label from api when not provided here via props -->
                    <!-- TODO: remove unnecessary props -->
                    <v-chip
                      v-bind="attrs"
                      :input-value="selected"
                      close
                      :color="getColor(item)"
                      @click="select"
                      @click:close="onRemoveValue(item)"
                    >
                      {{ truncate(item.label, 30) }}
                    </v-chip>
                  </template>
                  <template #append>
                    <v-icon
                      v-if="selectedValues.length"
                      aria-label="Clear search filters"
                      color="primary"
                      @click="onClearSelectedValues"
                    >
                      mdi-close
                    </v-icon>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col :cols="$vuetify.breakpoint.mobile ? 12 : 1">
                <v-btn min-height="50px" height="100%" x-large block depressed type="submit">
                  <v-icon>mdi-magnify</v-icon>
                  <span :class="$vuetify.breakpoint.mobile ? 'd-sr-only' : undefined">Search</span>
                </v-btn>
              </v-col>
            </v-row>
          </form>
          <v-row class="grey-bg">
            <template v-if="!$vuetify.breakpoint.mobile">
              <v-col>
                <v-btn text small class="disable-events"> View as </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'List'"
                  :class="{ active: currentView === 'List' }"
                  :to="{
                    name: 'List',
                    query: $route.query,
                  }"
                >
                  List
                </v-btn>
              </v-col>
              <v-col>
                <v-btn-toggle background-color="transparent" borderless>
                  <v-btn
                    text
                    small
                    class="view-picker"
                    :disabled="currentView === 'Network Graph Beta'"
                    :class="{ active: currentView === 'Network Graph Beta' }"
                    :to="{ name: 'Network Graph Beta', query: $route.query }"
                  >
                    Network Graph
                  </v-btn>
                  <v-menu offset-y left>
                    <template #activator="{ on, attrs }">
                      <v-btn icon text small class="view-picker" v-bind="attrs" v-on="on">
                        <v-icon>mdi-chevron-down</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        :disabled="currentView === 'Network Graph Beta'"
                        :class="{ active: currentView === 'Network Graph Beta' }"
                        :to="{ name: 'Network Graph Beta', query: $route.query }"
                      >
                        <v-list-item-title>Graph</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        :disabled="currentView === 'Compare Authors'"
                        :class="{ active: currentView === 'Compare Authors' }"
                        :to="{ name: 'Compare Authors', query: $route.query }"
                      >
                        <v-list-item-title>Compare Authors</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-btn-toggle>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'Map'"
                  :class="{ active: currentView === 'Map' }"
                  :to="{ name: 'Map', query: $route.query }"
                >
                  Map
                </v-btn>
              </v-col>
              <v-col>
                <v-btn
                  text
                  block
                  small
                  class="view-picker"
                  :disabled="currentView === 'Word Cloud'"
                  :class="{ active: currentView === 'Word Cloud' }"
                  :to="{ name: 'Word Cloud', query: $route.query }"
                >
                  Word Cloud
                </v-btn>
              </v-col>
            </template>
            <template v-else>
              <v-col cols="12">
                <v-select
                  v-model="currentView"
                  :items="['List', 'Graph', '', 'Map', 'Word Cloud']"
                  label="View as"
                />
              </v-col>
            </template>
            <v-col
              :class="{
                'text-right': !$vuetify.breakpoint.mobile,
                'text-center': $vuetify.breakpoint.mobile,
              }"
            >
              <v-btn
                text
                block
                small
                class="justify-end"
                :to="{ name: 'List All', query: $route.query }"
              >
                &nbsp;
                <v-icon>mdi-format-list-bulleted</v-icon>
                List All Entities
              </v-btn>
            </v-col>
          </v-row>
          <v-row
            v-if="!Object.keys($route.query).length && !Object.keys($route.params).length"
            align="center"
            justify="center"
          >
            <v-col cols="12" md="8">
              <div class="text-center no-query">
                <p>
                  Search our database for medieval <b>authors</b>, <b>passages</b>,
                  <b>keywords</b> (such as names of peoples) or <b>case studies</b>.
                </p>
                <p>
                  For instance, try
                  <span
                    v-for="(filter, index) of recommendedSearchFilters"
                    :key="[filter.kind, filter.id].join('+')"
                  >
                    <v-chip
                      :color="colors[filter.kind]"
                      @click="onSelectRecommendedSearchFilter(filter)"
                    >
                      {{ filter.label }}
                    </v-chip>
                    <span v-if="index < recommendedSearchFilters.length - 2">&#32;</span>
                    <span v-else-if="index === recommendedSearchFilters.length - 2">or</span>
                  </span>
                </p>
                <p>
                  Use the <b>slider</b> below to adjust and narrow down the <b>historical</b> scope
                  of your query.
                </p>
              </div>
            </v-col>
          </v-row>
          <v-row v-else>
            <router-view />
          </v-row>
          <v-row v-show="isSliderVisible">
            <v-col>
              <component
                :is="sliderComponent"
                class="slider"
                :max="maxYear"
                :min="minYear"
                :step="10"
                thumb-label="always"
                thumb-size="50"
                track-color="#d5d5d5"
                :track-fill-color="Array.isArray(dateRange) ? '#0f1226' : undefined"
                :value="dateRange"
                @input="onUpdateDateRange"
              >
                <template #thumb-label="{ value }">
                  {{ value < 0 ? `${-value} BC` : `${value} AD` }}
                </template>
                <template #append>
                  <v-menu :close-on-content-click="false">
                    <template #activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-cog</v-icon>
                        <span class="d-sr-only">Show date range options</span>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-text class="text-center">
                        <v-btn icon>
                          <img
                            class="icon"
                            :src="rangeSliderIcon"
                            @click="toggleSliderComponent('v-range-slider')"
                          />
                          <span class="d-sr-only">Use date range</span>
                        </v-btn>
                        <v-btn icon>
                          <img
                            class="icon"
                            :src="sliderIcon"
                            @click="toggleSliderComponent('v-slider')"
                          />
                          <span class="d-sr-only">Use discrete date</span>
                        </v-btn>
                        <v-divider />
                        <v-radio-group
                          label="Timeslider should filter for:"
                          :value="dateFilter"
                          @input="onUpdateDateFilter"
                        >
                          <v-radio
                            v-for="(filter, key) of dateFilters"
                            :key="key"
                            :label="filter.label"
                            :color="filter.color"
                            :value="key"
                          />
                        </v-radio-group>
                      </v-card-text>
                    </v-card>
                  </v-menu>
                </template>
              </component>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style>
div.row a.view-picker.theme--light.v-btn.v-btn--disabled {
  color: rgb(0 0 0 / 87%) !important;
}

img.icon {
  height: 100%;
  width: 100%;
}

/* makes elements read-only */
.disable-events {
  pointer-events: none;
}

.active {
  background-color: #e5e7eb !important;
}

.grey-bg {
  background-color: #e8ebf0;
  border-radius: 5px;
  margin-bottom: 22px;
}

.justify-end {
  justify-content: flex-end;
}

.no-query {
  height: 500px;
  font-size: 1.4em;
  color: #666 !important;
}

.slider {
  margin-top: 30px;
}

.v-slider {
  height: 44px;
}

div.v-slider__thumb-label.primary {
  background-color: transparent !important;
  height: 1.2rem !important;
  color: rgb(0 0 0 / 87%) !important;
}
</style>
